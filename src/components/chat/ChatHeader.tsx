'use client';

import { useAtom, useSetAtom } from 'jotai';
import { useEffect, useState } from 'react';
import { activeCodinationAtom, panelAtom } from '@/atoms/chatAtoms';

export default function ChatHeader() {
  const [panel, setPanel] = useAtom(panelAtom);
  const setActiveCodination = useSetAtom(activeCodinationAtom);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleChat = () => {
    setPanel('chat');
  };

  const handleCloset = () => {
    setPanel('closet');
    setActiveCodination(null);
  };

  const handleFitting = () => {
    setPanel('fitting');
    setActiveCodination(null);
  };

  return (
    <header className="h-20 flex items-center justify-between px-4 py-6 mx-16 lg:mx-auto w-[calc(100vw-68px)] lg:w-full bg-white">
      <div className="flex items-center gap-2">
        <button
          className={`lg:hidden btn cursor-pointer text-blue text-3xl ${isClient && panel == 'chat' ? 'font-bold' : ''}`}
          onClick={() => handleChat()}
        >
          Chat
        </button>
        <button
          className={`btn cursor-pointer text-blue text-3xl ${isClient && panel == 'closet' ? 'font-bold' : ''}`}
          onClick={() => handleCloset()}
        >
          Closet
        </button>
        <button
          className={`btn cursor-pointer text-blue text-3xl ${isClient && panel == 'fitting' ? 'font-bold' : ''}`}
          onClick={() => handleFitting()}
        >
          Fitting
        </button>
      </div>
      <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-bold text-lg">
        U
      </div>
    </header>
  );
}
