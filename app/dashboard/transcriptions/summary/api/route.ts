import { createChatCompletions, queryUserSettings } from '@/app/lib/actions';
import { cookies } from 'next/headers';
import OpenAI from 'openai';

export async function POST(request: Request) {
  const cookieStore = cookies();
  const token = cookieStore.get('token');
  const { messages } = await request.json();
  const SUMMARIZE_PROMPT = `What's key takeaways from the below?`;
  const response = await createChatCompletions({
    messages: [
      {
        role: 'user',
        content: `${SUMMARIZE_PROMPT}${messages}`,
      },
    ],
    force: false,
  });
  return new Response(JSON.stringify(response), {
    status: 200,
    headers: { 'Set-Cookie': `token=${token?.value}` },
  });
}
