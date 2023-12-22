import Image from 'next/image';
import { fetchFilteredTranscriptions } from '@/app/lib/data';
import { formatDateToLocal } from '@/app/lib/utils';
import {
  DeleteTranscription,
  ReadTranscription,
} from '@/app/ui/transcriptions/buttons';

export default async function TranscriptionsTable({
  query,
  currentPage,
}: {
  query: string;
  currentPage: number;
}) {
  const transcriptions = await fetchFilteredTranscriptions(query, currentPage);

  return (
    <div className="mt-6 flow-root">
      <div className="inline-block w-full align-middle">
        <div className="rounded-lg bg-gray-50 md:pt-0">
          <div className="md:hidden">
            {transcriptions.length > 0 ? (
              transcriptions?.map((transcription) => (
                <div
                  key={transcription.id}
                  className="mb-2 w-full rounded-md bg-white"
                >
                  <div className="flex items-center justify-between border-b pb-4">
                    <div>
                      <div className="mb-2 flex items-center">
                        <p>{transcription.name}</p>
                      </div>
                      <p className="text-sm text-gray-500">
                        {transcription.email}
                      </p>
                    </div>
                  </div>
                  <div className="flex w-full items-center justify-between pt-4">
                    <div className="max-w-full">
                      <p className="whitespace-normal break-all text-lg font-medium">
                        {transcription.audio_name}
                      </p>
                      <p className="mt-2 line-clamp-2 whitespace-normal">
                        {transcription.audio_text}
                      </p>
                    </div>
                  </div>
                  <div className="mt-2 flex justify-start gap-2 pb-2 text-sm text-gray-500">
                    {formatDateToLocal(transcription.date)}
                  </div>
                </div>
              ))
            ) : (
              <p className="py-2 text-center text-sm text-gray-500">No data</p>
            )}
          </div>
          <table className="hidden min-w-full text-gray-900 md:table">
            <thead className="rounded-lg text-left text-sm font-normal">
              <tr>
                <th scope="col" className="px-4 py-5 font-medium">
                  Name
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Email
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  AudioName
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Date
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  AudioText
                </th>
                <th scope="col" className="relative py-3 pl-6 pr-3">
                  <span className="sr-only">Action</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {transcriptions.length ? (
                transcriptions?.map((transcription) => (
                  <tr
                    key={transcription.id}
                    className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                  >
                    <td className="whitespace-nowrap px-3 py-3">
                      {transcription.name}
                    </td>

                    <td className="whitespace-nowrap px-3 py-3">
                      {transcription.email}
                    </td>
                    <td className="whitespace-normal px-3 py-3">
                      {transcription.audio_name}
                    </td>
                    <td className="whitespace-nowrap px-3 py-3">
                      {formatDateToLocal(transcription.date)}
                    </td>
                    <td className="max-h-16 overflow-hidden px-3 py-3">
                      <p className="line-clamp-2">{transcription.audio_text}</p>
                    </td>
                    <td className="whitespace-nowrap py-3 pl-6 pr-3">
                      <div className="flex justify-end gap-3">
                        <ReadTranscription id={transcription.id} />
                        <DeleteTranscription id={transcription.id} />
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg">
                  <td colSpan={6} className="py-4 text-center">
                    <p className="mt-4 text-sm">No data</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
