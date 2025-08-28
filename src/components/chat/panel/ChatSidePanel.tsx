'use client';

import { activePanelTypeAtom } from '@/atoms/chatAtoms';
import ImagePanel from '@/components/chat/panel/ImagePanel';
import WikiPanel from '@/components/chat/panel/WikiPanel';
import { useAtomValue } from 'jotai';

export default function ChatSidePanel() {
  const activePanelType = useAtomValue(activePanelTypeAtom);
  return (
    <div
      className={`fixed top-0 right-0 h-full bg-beige border-l border-gray-200 shadow-xl z-40 
                 flex flex-row transition-transform duration-500 ease-in-out
                 ${activePanelType != null ? 'translate-x-0' : 'translate-x-full'}`}
    >
      <ImagePanel top={'top-40'} />
      <WikiPanel top={'top-96'} />
    </div>
  );
}
