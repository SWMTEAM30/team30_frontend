'use client';

import { panelAtom } from '@/atoms/chatAtoms';
import ChatPanelHeader from '@/components/chat/ChatPanelHeader';
import FittingPanel from '@/components/chat/fitting/FittingPanel';
import { useAtomValue } from 'jotai';
import ClosetPanel from '@/components/chat/closet/ClosetPanel';

export default function ChatPanel() {
  const panel = useAtomValue(panelAtom);
  return (
    <div className={`flex flex-col h-full w-full bg-beige border-l border-navy-200`}>
      <ChatPanelHeader />
      <div className="h-[calc(100vh-5rem)]">
        {panel == 'closet' && <ClosetPanel />}
        {panel == 'fitting' && <FittingPanel />}
      </div>
    </div>
  );
}
