import Form from '@/app/ui/transcriptions/create-form';
import Breadcrumbs from '@/app/ui/invoices/breadcrumbs';
import { fetchCustomers } from '@/app/lib/data';

export default async function Page() {
  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Transcriptions', href: '/dashboard/transcriptions' },
          {
            label: 'Create Transcription',
            href: '/dashboard/transcriptions/create',
            active: true,
          },
        ]}
      />
      <Form />
    </main>
  );
}
