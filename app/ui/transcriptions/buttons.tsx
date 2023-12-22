import {
  ViewfinderCircleIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { deleteTranscription } from '@/app/lib/actions';

export function CreateTranscription() {
  return (
    <Link
      href="/dashboard/transcriptions/create"
      className="flex h-10 items-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
    >
      <span className="hidden md:block">Create Transcription</span>{' '}
      <PlusIcon className="h-5 md:ml-4" />
    </Link>
  );
}

export function UpdateInvoice({ id }: { id: string }) {
  return (
    <Link
      href={`/dashboard/invoices/${id}/edit`}
      className="rounded-md border p-2 hover:bg-gray-100"
    >
      <PencilIcon className="w-5" />
    </Link>
  );
}

export function DeleteTranscription({ id }: { id: string }) {
  const deleteTranscriptionWithId = deleteTranscription.bind(null, id);

  return (
    <form action={deleteTranscriptionWithId}>
      <button className="rounded-md border p-2 hover:bg-gray-100">
        <span className="sr-only">Delete</span>
        <TrashIcon className="w-4" />
      </button>
    </form>
  );
}

export function ReadTranscription({ id }: { id: string }) {
  return (
    <Link
      href={`/dashboard/transcriptions/${id}/read`}
      className="rounded-md border p-2 hover:bg-gray-100"
    >
      <ViewfinderCircleIcon className="w-5" />
    </Link>
  );
}
