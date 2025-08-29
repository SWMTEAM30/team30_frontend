'use client';

import { activePanelTypeAtom } from '@/atoms/chatAtoms';
import ImagePanel from '@/components/chat/cloth/ImagePanel';
import WikiPanel from '@/components/chat/cloth/WikiPanel';
import { useAtomValue } from 'jotai';

export default function ChatSidePanel() {
  const activePanelType = useAtomValue(activePanelTypeAtom);
  return (
    <div
      className={`h-full w-full bg-beige border-l border-gray-200 shadow-xl z-40 
                 flex flex-row duration-500 ease-in-out`}
    >
      <ImagePanel />
      {/* <WikiPanel /> */}
    </div>
  );
}
