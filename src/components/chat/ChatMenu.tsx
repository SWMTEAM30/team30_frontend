'use client';

import { useAtom, useSetAtom } from 'jotai';
import { useEffect, useState } from 'react';
import { activeCodinationAtom, panelAtom } from '@/atoms/chatAtoms';
import LucideIcon from '@/components/ui/icons/LucideIcon';
import SettingsPanel from '@/components/chat/settings/SettingsPanel';

export default function ChatMenu() {
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

  const handleCodination = () => {
    setPanel('codination');
    setActiveCodination(null);
  };

  const handleFitting = () => {
    setPanel('fitting');
    setActiveCodination(null);
  };

  return (
    <>
      {/* Bottom fixed nav: visible under 1440px */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-600 max-[1439px]:flex min-[1440px]:hidden">
        <div className="flex items-center justify-around h-16 w-full">
          <button
            aria-label="Chat"
            className={`w-16 flex flex-col items-center gap-1 ${isClient && panel == 'chat' ? 'font-bold text-blue-600 dark:text-blue-400' : 'text-slate-400 dark:text-slate-600'}`}
            onClick={handleChat}
          >
            <span className="inline-flex">
              <LucideIcon name={'MessageSquare'} size={24} />
            </span>
            <span className="text-xs">채팅</span>
          </button>
          <button
            aria-label="Closet"
            className={`w-16 flex flex-col items-center gap-1 ${isClient && panel == 'closet' ? 'font-bold text-blue-600 dark:text-blue-400' : 'text-slate-400 dark:text-slate-600'}`}
            onClick={handleCloset}
          >
            <span className="inline-flex">
              <LucideIcon name={'Shirt'} size={24} />
            </span>
            <span className="text-xs">옷장</span>
          </button>
          <button
            aria-label="Codination"
            className={`w-16 flex flex-col items-center gap-1 ${isClient && panel == 'codination' ? 'font-bold text-blue-600 dark:text-blue-400' : 'text-slate-400 dark:text-slate-600'}`}
            onClick={handleCodination}
          >
            <span className="inline-flex">
              <LucideIcon name={'Layers'} size={24} />
            </span>
            <span className="text-xs">코디</span>
          </button>
          <button
            aria-label="Fitting"
            className={`w-16 flex flex-col items-center gap-1 ${isClient && panel == 'fitting' ? 'font-bold text-blue-600 dark:text-blue-400' : 'text-slate-400 dark:text-slate-600'}`}
            onClick={handleFitting}
          >
            <span className="inline-flex">
              <LucideIcon name={'ScanLine'} size={24} />
            </span>
            <span className="text-xs">피팅</span>
          </button>
          <SettingsPanel>
            <button
              aria-label="Settings"
              className="w-16 flex flex-col items-center gap-1 text-slate-400 dark:text-slate-600"
            >
              <span className="inline-flex">
                <LucideIcon name={'Settings'} size={24} />
              </span>
              <span className="text-xs">설정</span>
            </button>
          </SettingsPanel>
        </div>
      </nav>

      {/* Left vertical sidebar: visible at 1440px and above */}
      <aside className="fixed top-0 left-0 bottom-0 z-50 w-28 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-600 min-[1440px]:flex max-[1439px]:hidden">
        <div className="flex flex-col items-center justify-center gap-10 w-full h-full">
          <button
            aria-label="Chat"
            className={`w-full flex flex-col items-center gap-1 ${isClient && panel == 'chat' ? 'font-bold text-blue-600 dark:text-blue-400' : 'text-slate-400 dark:text-slate-600'}`}
            onClick={handleChat}
          >
            <span className="inline-flex">
              <LucideIcon name={'MessageSquare'} size={24} />
            </span>
            <span className="text-[10px]">채팅</span>
          </button>
          <button
            aria-label="Closet"
            className={`w-full flex flex-col items-center gap-1 ${isClient && panel == 'closet' ? 'font-bold text-blue-600 dark:text-blue-400' : 'text-slate-400 dark:text-slate-600'}`}
            onClick={handleCloset}
          >
            <span className="inline-flex">
              <LucideIcon name={'Shirt'} size={24} />
            </span>
            <span className="text-[10px]">옷장</span>
          </button>
          <button
            aria-label="Codination"
            className={`w-full flex flex-col items-center gap-1 ${isClient && panel == 'codination' ? 'font-bold text-blue-600 dark:text-blue-400' : 'text-slate-400 dark:text-slate-600'}`}
            onClick={handleCodination}
          >
            <span className="inline-flex">
              <LucideIcon name={'Layers'} size={24} />
            </span>
            <span className="text-[10px]">코디</span>
          </button>
          <button
            aria-label="Fitting"
            className={`w-full flex flex-col items-center gap-1 ${isClient && panel == 'fitting' ? 'font-bold text-blue-600 dark:text-blue-400' : 'text-slate-400 dark:text-slate-600'}`}
            onClick={handleFitting}
          >
            <span className="inline-flex">
              <LucideIcon name={'ScanLine'} size={24} />
            </span>
            <span className="text-[10px]">피팅</span>
          </button>
          <SettingsPanel>
            <button
              aria-label="Settings"
              className="w-full flex flex-col items-center gap-1 text-slate-400 dark:text-slate-600"
            >
              <span className="inline-flex">
                <LucideIcon name={'Settings'} size={24} />
              </span>
              <span className="text-[10px]">설정</span>
            </button>
          </SettingsPanel>
        </div>
      </aside>
    </>
  );
}
