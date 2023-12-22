'use server';

import path from 'path';
import fs from 'fs';
import { z } from 'zod';
import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { signIn } from '@/auth';
import bcrypt from 'bcrypt';
import OpenAI from 'openai';
import { auth } from '@/auth';
import { getUser } from '@/app/lib/data';
import { downloadFile, generateFilename } from './downloadFile';
import { CompletionCreateParamsNonStreaming } from 'openai/resources/completions.mjs';

const FormSchema = z.object({
  id: z.string(),
  customerId: z.string({
    invalid_type_error: 'Please select a customer.',
  }),
  amount: z.coerce
    .number()
    .gt(0, { message: 'Please enter an amount greater than $0.' }),
  status: z.enum(['pending', 'paid'], {
    invalid_type_error: 'Please select an invoice status.',
  }),
  date: z.string(),
});

const CreateInvoice = FormSchema.omit({ id: true, date: true });

// This is temporary until @types/react-dom is updated
export type State = {
  errors?: {
    customerId?: string[];
    amount?: string[];
    status?: string[];
  };
  message?: string | null;
};

export async function createInvoice(prevState: State, formData: FormData) {
  // Validate form using Zod
  const validatedFields = CreateInvoice.safeParse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });

  // If form validation fails, return errors early. Otherwise, continue.
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create Invoice.',
    };
  }

  // Prepare data for insertion into the database
  const { customerId, amount, status } = validatedFields.data;
  const amountInCents = amount * 100;
  const date = new Date().toISOString().split('T')[0];

  // Insert data into the database
  try {
    await sql`
      INSERT INTO invoices (customer_id, amount, status, date)
      VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
    `;
  } catch (error) {
    // If a database error occurs, return a more specific error.
    return {
      message: 'Database Error: Failed to Create Invoice.',
    };
  }

  // Revalidate the cache for the invoices page and redirect the user.
  revalidatePath('/dashboard/invoices');
  redirect('/dashboard/invoices');
}

const UpdateInvoice = FormSchema.omit({ id: true, date: true });

export async function updateInvoice(
  id: string,
  prevState: State,
  formData: FormData,
) {
  const validatedFields = UpdateInvoice.safeParse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Update Invoice.',
    };
  }

  const { customerId, amount, status } = validatedFields.data;
  const amountInCents = amount * 100;

  try {
    await sql`
      UPDATE invoices
      SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}
      WHERE id = ${id}
    `;
  } catch (error) {
    return { message: 'Database Error: Failed to Update Invoice.' };
  }

  revalidatePath('/dashboard/invoices');
  redirect('/dashboard/invoices');
}

export async function deleteInvoice(id: string) {
  throw new Error('Failed to Delete Invoice');

  // Unreachable code block
  try {
    await sql`DELETE FROM invoices WHERE id = ${id}`;
    revalidatePath('/dashboard/invoices');
    return { message: 'Deleted Invoice' };
  } catch (error) {
    return { message: 'Database Error: Failed to Delete Invoice' };
  }
}

export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    await signIn('credentials', Object.fromEntries(formData));
    redirect('/dashboard/transcriptions/create');
  } catch (error) {
    if ((error as Error).message.includes('CredentialsSignin')) {
      return 'CredentialsSignin';
    }
    throw error;
  }
}

export async function register(
  prevState: {
    errors?: {
      name?: string[];
      email?: string[];
      password?: string[];
    };
    message?: string | null;
  },
  formData: FormData,
) {
  const schema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(6),
  });
  const { name, email, password } = Object.fromEntries(formData);
  const parse = schema.safeParse({
    name,
    email,
    password,
  });

  if (!parse.success) {
    return {
      errors: parse.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Register.',
    };
  }

  const data = parse.data;

  try {
    const hashedPassword = await bcrypt.hash(data.password, 10);
    await sql`INSERT INTO users (name, email, password) VALUES (${data.name}, ${data.email}, ${hashedPassword})`;
  } catch (error) {}

  redirect('/login');
}

export type Response = {
  status: {
    code: number;
    message: string;
  };
  result: unknown;
};

export async function createTranscription(
  prevState: Response | undefined,
  formData: FormData,
) {
  if (process.env.NODE_ENV === 'development') {
    return {
      status: {
        code: 0,
        message: 'Created Transcription in Development',
      },
      result: 'This is a test response.',
    };
  }
  const schema = z
    .object({
      audioUrl: z.string(),
      dropzoneFile: z.any(),
    })
    .refine((data) => {
      return data.audioUrl || data.dropzoneFile.size > 0;
    });
  const parse = schema.safeParse({
    audioUrl: formData.get('audioUrl'),
    dropzoneFile: formData.get('dropzoneFile'),
  });

  if (!parse.success) {
    return {
      status: {
        code: -1,
        message: 'Please upload a file or provide an audio URL.',
      },
      result: null,
    };
  }

  const data = parse.data;
  const session = await auth();
  const user = await getUser(session?.user?.email as string);
  const { id, api_key } = user;
  if (!api_key) {
    return {
      status: {
        code: -1,
        message:
          'Please provide an OpenAI API Key, you can set it in Settings.',
      },
      result: null,
    };
  }
  try {
    let file;
    let localPath;
    let audioText;
    if (data.dropzoneFile.size > 0) {
      if (data.dropzoneFile.size > 20 * 1024 * 1024) {
        return {
          status: {
            code: -1,
            message: 'Please upload a file smaller than 20MB.',
          },
          result: null,
        };
      }
      file = data.dropzoneFile;
      localPath = path.join(
        process.cwd(),
        'public',
        'audios',
        `${generateFilename(data.dropzoneFile.name)}`,
      );
    } else {
      const remoteUrl = data.audioUrl;
      localPath = path.join(
        process.cwd(),
        'public',
        'audios',
        `${generateFilename(remoteUrl)}`,
      );

      // if local file exists, read it
      if (fs.existsSync(localPath)) {
        file = fs.createReadStream(localPath);
      } else {
        // if local file does not exist, download it
        await downloadFile(remoteUrl, localPath);
        // read local file, if size is greater than 20MB, return error
        const stats = fs.statSync(localPath);
        const fileSizeInBytes = stats.size;
        if (fileSizeInBytes > 20 * 1024 * 1024) {
          return {
            status: {
              code: -1,
              message: 'Please upload a file smaller than 20MB.',
            },
            result: null,
          };
        }
        file = fs.createReadStream(localPath);
      }
    }
    const audioTextPath = path.join(
      process.cwd(),
      'public',
      'audios',
      `${generateFilename(localPath.replace(/\.[^/.]+$/, ''))}.txt`,
    );

    // if transcription exists, read it
    if (fs.existsSync(audioTextPath)) {
      audioText = fs.readFileSync(audioTextPath, 'utf8');
    } else {
      // if transcription does not exist, create it
      const openai = new OpenAI({ apiKey: api_key });
      const response = await openai.audio.transcriptions.create({
        file,
        model: 'whisper-1',
      });
      audioText = response.text;
      audioTextPath && fs.writeFileSync(audioTextPath, audioText);
    }
    // insert transcription into database
    const date = new Date().toISOString().split('T')[0];
    const audioUrl = data.audioUrl || 'no_audio_url';
    const audioName =
      data.dropzoneFile.name !== 'undefined'
        ? data.dropzoneFile.name
        : audioUrl;
    await sql`INSERT INTO transcriptions (customer_id, audio_name, audio_url, audio_text, date) 
    VALUES (${id},${audioName},${audioUrl}, ${audioText}, ${date})
     ON CONFLICT (id) DO NOTHING`;
  } catch (error) {
    return {
      status: {
        code: -1,
        message: `Failed to create transcription: ${error}`,
      },
      result: null,
    };
  }

  revalidatePath('/dashboard/transcriptions');
  redirect('/dashboard/transcriptions');
}

export async function deleteTranscription(id: string) {
  try {
    await sql`DELETE FROM transcriptions WHERE id = ${id}`;
    revalidatePath('/dashboard/transcriptions');
    return {
      status: {
        code: 0,
        message: 'Deleted Transcription',
      },
      result: null,
    };
  } catch (error) {
    return {
      status: {
        code: -1,
        message: `Failed to delete transcription: ${error}`,
      },
      result: null,
    };
  }
}

export async function createChatCompletions({
  messages,
  force,
}: Record<string, any>) {
  if (process.env.NODE_ENV === 'development' && !force) {
    return {
      status: {
        code: 0,
        message: 'Created Chat Completions',
      },
      result: 'This is a test response.',
    };
  }
  const { api_key } = await queryUserSettings();
  if (!api_key) {
    return {
      status: {
        code: -1,
        message:
          'Please provide an OpenAI API Key, you can set it in Settings.',
      },
      result: null,
    };
  }
  try {
    const openai = new OpenAI({ apiKey: api_key });
    const response = await openai.chat.completions.create({
      messages,
      model: 'gpt-3.5-turbo',
    });
    return {
      status: {
        code: 0,
        message: 'Created Chat Completions',
      },
      result: response.choices[0].message.content,
    };
  } catch (error) {
    return {
      status: {
        code: -1,
        message: `Failed to create chat completions: ${error}`,
      },
      result: null,
    };
  }
}

// query user settings
export async function queryUserSettings() {
  const session = await auth();
  const user = await getUser(session?.user?.email as string);
  return user;
}

export type UpdateUserSettingsState = {
  errors?: {
    apiKey?: string[];
  };
  message?: string | null;
};
// update user settings
export async function updateUserSettings(
  prevState: UpdateUserSettingsState,
  formData: FormData,
) {
  const schema = z.object({
    apiKey: z.string(),
  });

  const parse = schema.safeParse({
    apiKey: formData.get('apiKey'),
  });
  if (!parse.success) {
    return {
      errors: parse.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Update User Settings.',
    };
  }

  const data = parse.data;
  try {
    const session = await auth();
    const user = await getUser(session?.user?.email as string);
    const { id } = user;
    await sql`UPDATE users SET api_key = ${data.apiKey} WHERE id = ${id}`;
  } catch (error) {
    return { message: 'Database Error: Failed to Update User Settings.' };
  }

  return {
    message: 'Updated User Settings',
  };
}
