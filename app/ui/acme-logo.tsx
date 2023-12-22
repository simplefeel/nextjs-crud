import { MusicalNoteIcon } from '@heroicons/react/24/outline';
import { lusitana } from '@/app/ui/fonts';

export default function AcmeLogo() {
  return (
    <div
      className={`${lusitana.className} flex flex-row items-center leading-none text-white`}
    >
      <MusicalNoteIcon className="h-10 w-10" />
      <p className="text-[34px]">Podify</p>
    </div>
  );
}
