'use client';

import { panelAtom } from '@/atoms/chatAtoms';
import FittingPanel from '@/components/chat/fitting/FittingPanel';
import { useAtomValue } from 'jotai';
import ClosetPanel from '@/components/chat/closet/ClosetPanel';

export default function ChatPanel() {
  const panel = useAtomValue(panelAtom);
  return (
    <div className={`flex flex-col h-full w-full xl:w-1/2 bg-beige border-l border-navy-200`}>
      <div className="h-full">
        {panel == 'closet' && <ClosetPanel />}
        {panel == 'fitting' && <FittingPanel />}
      </div>
    </div>
  );
}
