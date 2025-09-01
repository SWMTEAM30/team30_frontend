'use client';

import { panelAtom } from '@/atoms/chatAtoms';
import ChatPanelHeader from '@/components/chat/ChatPanelHeader';
import ImagePanel from '@/components/chat/cloth/ImagePanel';
import ChatPanelCodination from '@/components/chat/fitting/ChatPanelCodination';
import FittingPanel from '@/components/chat/fitting/FittingPanel';
import { useAtomValue } from 'jotai';

export default function ChatPanel() {
  const panel = useAtomValue(panelAtom);
  return (
    <div className={`flex flex-col h-full w-full bg-beige border-l border-navy-200`}>
      <ChatPanelHeader />
      <div className="flex justify-center">
        {panel == 'cloth' && <ImagePanel />}
        {panel == 'fitting' && <FittingPanel />}
      </div>
      <ChatPanelCodination />
    </div>
  );
}
