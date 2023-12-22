'use client';

import { FileInput, Label, TextInput, Button } from 'flowbite-react';
import { PaperAirplaneIcon, LinkIcon } from '@heroicons/react/24/outline';
import { useFormState, useFormStatus } from 'react-dom';
import { createTranscription } from '@/app/lib/actions';
import { useState } from 'react';

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button
      className="bg-blue-500"
      color="blue"
      type="submit"
      isProcessing={pending}
    >
      Create Transcription
    </Button>
  );
}

export default function Form() {
  const [state, dispatch] = useFormState(createTranscription, undefined);
  const [selectFile, setSelectFile] = useState<File>();
  const handleFileUpload = (e: any) => {
    setSelectFile(e.target.files[0]);
  };

  return (
    <form action={dispatch}>
      <h2 className="my-2 block text-gray-600">
        Upload Podcast or Enter Audio URL
      </h2>
      <div className="flex w-full items-center justify-center">
        <Label
          htmlFor="dropzoneFile"
          className="dark:hover:bg-bray-800 flex h-64 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:hover:border-gray-500 dark:hover:bg-gray-600"
        >
          <div className="flex flex-col items-center justify-center pb-6 pt-5">
            <svg
              className="mb-4 h-8 w-8 text-gray-500 dark:text-gray-400"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 16"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
              />
            </svg>
            <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
              <span className="font-semibold">
                Click here to upload your podcast
              </span>
            </p>
            <p className="flex text-center text-xs text-gray-500 dark:text-gray-400">
              mp3, mpga, m4a, ogg, wav, or webm file supported.
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Max 20MB.
            </p>
          </div>
          <FileInput
            id="dropzoneFile"
            name="dropzoneFile"
            className="hidden"
            onChange={handleFileUpload}
          />
        </Label>
      </div>
      {selectFile?.name && (
        <div className="my-2 block flex items-center">
          <LinkIcon className="mr-0.5 h-4 w-4 text-blue-500" />
          <span>{selectFile?.name}</span>
        </div>
      )}
      <h2 className="my-2 block text-gray-600">OR</h2>
      <TextInput
        id="audioUrl"
        name="audioUrl"
        type="url"
        rightIcon={PaperAirplaneIcon as any}
        placeholder="Enter Audio URL"
      />
      <div className="mt-4 flex justify-end gap-4">
        <SubmitButton />
      </div>

      <div
        id="customer-error"
        aria-live="polite"
        aria-atomic="true"
        className="mt-2 text-red-500"
      >
        {state?.status.message}
      </div>
    </form>
  );
}
