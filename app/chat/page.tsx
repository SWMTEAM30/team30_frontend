'use client';

import { panelAtom } from '@/atoms/chatAtoms';
import ChatHeader from '@/components/chat/ChatHeader';
import ClosetPanel from '@/components/chat/closet/ClosetPanel';
import FittingPanel from '@/components/chat/fitting/FittingPanel';
import ChatPanel from '@/components/chat/message/ChatPanel';
import { useAtomValue } from 'jotai';

export default function Chat() {
  const panel = useAtomValue(panelAtom);
  return (
    <div className="flex flex-col">
      <ChatHeader />
      <div className="flex h-[calc(100vh-5rem)]">
        <div className="flex flex-col w-full xl:w-1/2 h-full lg:transition-all lg:duration-300">
          <ChatPanel />
        </div>

        <div className={`flex flex-col h-full w-full xl:w-1/2 bg-beige border-l border-navy-200`}>
          {panel == 'closet' && <ClosetPanel />}
          {panel == 'fitting' && <FittingPanel />}
        </div>
      </div>
    </div>
  );
}
