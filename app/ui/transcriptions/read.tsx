'use client';

import type { CustomFlowbiteTheme } from 'flowbite-react';
import { Tabs, Flowbite } from 'flowbite-react';
import { HiAdjustments, HiClipboardList, HiUserCircle } from 'react-icons/hi';
import { MdDashboard } from 'react-icons/md';
import Summary from './summary';
import { Suspense } from 'react';

const customTheme: CustomFlowbiteTheme = {
  tabs: {
    tablist: {
      tabitem: {
        base: 'flex items-center justify-center p-3 rounded-t-lg text-sm font-medium first:ml-0 disabled:cursor-not-allowed disabled:text-gray-400 disabled:dark:text-gray-500',
        styles: {
          pills: {
            active: {
              on: 'rounded-lg bg-blue-500 text-white',
            },
          },
        },
      },
    },
  },
};

export default function Read({ audio_text }: { audio_text: string }) {
  return (
    <Flowbite theme={{ theme: customTheme }}>
      <Tabs aria-label="Pills" style="pills">
        <Tabs.Item active title="Summary">
          <Summary messages={audio_text} />
        </Tabs.Item>
        <Tabs.Item title="Transcript">{audio_text}</Tabs.Item>
      </Tabs>
    </Flowbite>
  );
}
