'use client';

import { updateUserSettings } from '@/app/lib/actions';
import { User } from '@/app/lib/definitions';
import { Button, Checkbox, Label, TextInput } from 'flowbite-react';
import { useFormState, useFormStatus } from 'react-dom';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button
      className="bg-blue-500"
      color="blue"
      type="submit"
      isProcessing={pending}
    >
      Save
    </Button>
  );
}

export default function Form({ data }: { data: User }) {
  const [state, dispatch] = useFormState(updateUserSettings, {
    message: null,
    errors: {},
  });

  const showApiKey = () => {
    const input = document.getElementById('apiKey') as HTMLInputElement;
    if (input.type === 'password') {
      input.type = 'text';
    } else {
      input.type = 'password';
    }
  };

  return (
    <form className="flex flex-col gap-4" action={dispatch}>
      <div>
        <div className="mb-2 block">
          <Label htmlFor="apiKey" value="Your APIKEY" />
        </div>
        <TextInput
          type="password"
          name="apiKey"
          id="apiKey"
          placeholder="Please input your api key"
          defaultValue={data?.api_key}
        />
        <div id="customer-error" aria-live="polite" aria-atomic="true">
          {state.errors?.apiKey &&
            state.errors.apiKey.map((error: string) => (
              <p className="mt-2 text-sm text-red-500" key={error}>
                {error}
              </p>
            ))}
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Checkbox id="showKey" onChange={showApiKey} color="blue" />
        <Label htmlFor="showKey">Show APIKEY</Label>
      </div>
      <div className="mt-4 flex justify-end gap-4">
        <SubmitButton />
      </div>
    </form>
  );
}
