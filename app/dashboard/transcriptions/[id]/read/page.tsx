import Breadcrumbs from '@/app/ui/invoices/breadcrumbs';
import { fetchTranscriptionById } from '@/app/lib/data';
import { notFound } from 'next/navigation';
import Read from '@/app/ui/transcriptions/read';

export default async function Page({ params }: { params: { id: string } }) {
  const id = params.id;
  const transcription = await fetchTranscriptionById(id);
  if (!transcription) {
    notFound();
  }
  const { audio_text } = transcription;
  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Transcriptions', href: '/dashboard/transcriptions' },
          {
            label: 'Read Transcription',
            href: `/dashboard/transcriptions/${id}/read`,
            active: true,
          },
        ]}
      />
      <Read audio_text={audio_text} />
    </main>
  );
}
