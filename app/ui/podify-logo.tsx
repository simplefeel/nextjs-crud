import { lusitana } from '@/app/ui/fonts';

export default function PodifyLogo() {
  return (
    <div
      className={`${lusitana.className} flex flex-row items-center leading-none text-black`}
    >
      <img className="h-10 w-10" src="/podify-logo.png" />
      <p className="text-[34px]">Podify</p>
    </div>
  );
}
