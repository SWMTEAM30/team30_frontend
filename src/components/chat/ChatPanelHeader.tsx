'use client';

import { useAtom, useAtomValue } from 'jotai';
import { currentChatIdAtom, panelAtom } from '@/atoms/chatAtoms';

export default function ChatPanelHeader() {
  const currentChatId = useAtomValue(currentChatIdAtom);
  const [panel, setPanel] = useAtom(panelAtom);

  const handlePanel = (panel: 'closet' | 'fitting') => {
    setPanel(panel);
  };

  return (
    <header className="h-20 flex items-center justify-between px-4 py-6 mx-16 md:mx-auto w-[calc(100vw-68px)] lg:w-full bg-white">
      <div className="flex items-center gap-2">
        <button
          className={`btn cursor-pointer text-blue text-3xl ${panel == 'closet' && 'font-bold'}`}
          onClick={() => handlePanel('closet')}
        >
          Closet
        </button>
        <button
          className={`btn cursor-pointer text-blue text-3xl ${panel == 'fitting' && 'font-bold'}`}
          onClick={() => handlePanel('fitting')}
        >
          Fitting
        </button>
      </div>
    </header>
  );
}
