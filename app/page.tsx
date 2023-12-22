import AcmeLogo from '@/app/ui/acme-logo';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import styles from '@/app/ui/home.module.css';
import Image from 'next/image';
import { signIn, auth, signOut } from '@/auth';

export default async function Page() {
  const session = await auth();
  console.log('[ session ] >', session?.user);
  return (
    <main className="flex min-h-screen flex-col p-2">
      <div className="md:h-22 h-15 flex shrink-0 items-center justify-center rounded-lg bg-blue-500 p-4 md:justify-start">
        <AcmeLogo />
      </div>
      <div className="mt-4 flex grow flex-col gap-4 md:flex-row">
        <div className="flex flex-col justify-center gap-6 rounded-lg bg-gray-50 px-6 py-10 md:w-2/5 md:px-20">
          <p className={`text-xl text-gray-800 md:text-3xl md:leading-normal`}>
            <strong>Podcast Transcribe Tool</strong>
          </p>
          <p className="text-base text-gray-500">
            Convert your favorite podcasts into text. Analyze, share, and store
            them with ease.
          </p>
          {session?.user ? (
            <Link
              href="/dashboard"
              className="flex items-center gap-5 self-start rounded-lg bg-blue-500 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-400 md:text-base"
            >
              <span>Get Started</span> <ArrowRightIcon className="w-5 md:w-6" />
            </Link>
          ) : (
            <Link
              href="/login"
              className="flex items-center gap-5 self-start rounded-lg bg-blue-500 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-400 md:text-base"
            >
              <span>Login in</span> <ArrowRightIcon className="w-5 md:w-6" />
            </Link>
          )}
        </div>
        <div className="flex items-center justify-center p-6 md:w-3/5 md:px-28 md:py-12">
          {/* Add Hero Images Here */}
          <Image
            src="/hero-desktop.png"
            width={1000}
            height={760}
            className="hidden rounded-lg border-2 border-gray-200 bg-gray-50 md:block"
            alt="Screenshots of the dashboard project showing desktop version"
          />
          <Image
            src="/hero-mobile.png"
            width={560}
            height={620}
            className="block md:hidden"
            alt="Screenshots of the dashboard project showing desktop version"
          />
        </div>
      </div>
    </main>
  );
}
