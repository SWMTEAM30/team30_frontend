'use client';

import { useAtom, useSetAtom } from 'jotai';
import { useEffect, useState } from 'react';
import { activeCodinationAtom, panelAtom } from '@/atoms/chatAtoms';
import LucideIcon from '@/components/ui/icons/LucideIcon';
import SettingsPanel from '@/components/settings/SettingsPanel';

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
      {/* Desktop/Large screens header */}
      <header className="hidden lg:flex h-20 items-center justify-between px-4 py-6 mx-16 lg:mx-auto w-[calc(100vw-68px)] lg:w-full bg-white">
        <div className="flex items-center gap-4">
          <button
            className={`btn cursor-pointer text-blue text-2xl w-32 h-10 flex items-center justify-center ${isClient && panel == 'closet' ? 'font-bold' : ''}`}
            onClick={handleCloset}
          >
            <span className="inline-flex mr-2"><LucideIcon name={'Shirt'} size={20} /></span>
            옷장
          </button>
          <button
            className={`btn cursor-pointer text-blue text-2xl w-32 h-10 flex items-center justify-center ${isClient && panel == 'codination' ? 'font-bold' : ''}`}
            onClick={handleCodination}
          >
            <span className="inline-flex mr-2"><LucideIcon name={'Layers'} size={20} /></span>
            코디
          </button>
          <button
            className={`btn cursor-pointer text-blue text-2xl w-32 h-10 flex items-center justify-center ${isClient && panel == 'fitting' ? 'font-bold' : ''}`}
            onClick={handleFitting}
          >
            <span className="inline-flex mr-2"><LucideIcon name={'ScanLine'} size={20} /></span>
            피팅
          </button>
        </div>
        <div className="flex items-center gap-4">
          <SettingsPanel>
            <button className="btn cursor-pointer text-blue text-2xl w-32 h-10 flex items-center justify-center relative">
              <span className="inline-flex mr-2"><LucideIcon name={'Settings'} size={20} /></span>
              설정
            </button>
          </SettingsPanel>
          <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-bold text-lg">
            U
          </div>
        </div>
      </header>

      {/* Mobile/Small screens bottom fixed nav */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-slate-200">
        <div className="flex items-center justify-around h-16">
          <button
            aria-label="Chat"
            className={`w-16 flex flex-col items-center gap-1 ${isClient && panel == 'chat' ? 'text-blue-600' : 'text-slate-500'}`}
            onClick={handleChat}
          >
            <span className="inline-flex">
              <LucideIcon name={'MessageSquare'} size={24} />
            </span>
            <span className="text-xs">채팅</span>
          </button>
          <button
            aria-label="Closet"
            className={`w-16 flex flex-col items-center gap-1 ${isClient && panel == 'closet' ? 'text-blue-600' : 'text-slate-500'}`}
            onClick={handleCloset}
          >
            <span className="inline-flex">
              <LucideIcon name={'Shirt'} size={24} />
            </span>
            <span className="text-xs">옷장</span>
          </button>
          <button
            aria-label="Codination"
            className={`w-16 flex flex-col items-center gap-1 ${isClient && panel == 'codination' ? 'text-blue-600' : 'text-slate-500'}`}
            onClick={handleCodination}
          >
            <span className="inline-flex">
              <LucideIcon name={'Layers'} size={24} />
            </span>
            <span className="text-xs">코디</span>
          </button>
          <button
            aria-label="Fitting"
            className={`w-16 flex flex-col items-center gap-1 ${isClient && panel == 'fitting' ? 'text-blue-600' : 'text-slate-500'}`}
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
              className="w-16 flex flex-col items-center gap-1 text-slate-500"
            >
              <span className="inline-flex">
                <LucideIcon name={'Settings'} size={24} />
              </span>
              <span className="text-xs">설정</span>
            </button>
          </SettingsPanel>
        </div>
      </nav>
    </>
  );
}
