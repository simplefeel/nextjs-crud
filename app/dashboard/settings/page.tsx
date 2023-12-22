import { queryUserSettings } from '@/app/lib/actions';
import { User } from '@/app/lib/definitions';
import { lusitana } from '@/app/ui/fonts';
import Form from '@/app/ui/settings/form';

export default async function Page() {
  const data = await queryUserSettings();
  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className={`${lusitana.className} text-2xl`}>Settings</h1>
      </div>
      <div className="mt-4 md:mt-8">
        <Form data={data} />
      </div>
    </div>
  );
}
