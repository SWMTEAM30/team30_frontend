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
            className={`btn cursor-pointer text-blue text-2xl ${isClient && panel == 'chat' ? 'font-bold' : ''}`}
            onClick={handleChat}
          >
            Chat
          </button>
          <button
            className={`btn cursor-pointer text-blue text-2xl ${isClient && panel == 'closet' ? 'font-bold' : ''}`}
            onClick={handleCloset}
          >
            Closet
          </button>
          <button
            className={`btn cursor-pointer text-blue text-2xl ${isClient && panel == 'codination' ? 'font-bold' : ''}`}
            onClick={handleCodination}
          >
            Codination
          </button>
          <button
            className={`btn cursor-pointer text-blue text-2xl ${isClient && panel == 'fitting' ? 'font-bold' : ''}`}
            onClick={handleFitting}
          >
            Fitting
          </button>
        </div>
        <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-bold text-lg">
          U
        </div>
      </header>

      {/* Mobile/Small screens bottom fixed nav */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-slate-200">
        <div className="flex items-center justify-around h-16">
          <button
            aria-label="Chat"
            className={`flex flex-col items-center gap-1 ${isClient && panel == 'chat' ? 'text-blue-600' : 'text-slate-500'}`}
            onClick={handleChat}
          >
            <span className="inline-flex">
              {/* MessageSquare */}
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-message-square"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
            </span>
            <span className="text-xs">Chat</span>
          </button>
          <button
            aria-label="Closet"
            className={`flex flex-col items-center gap-1 ${isClient && panel == 'closet' ? 'text-blue-600' : 'text-slate-500'}`}
            onClick={handleCloset}
          >
            <span className="inline-flex">
              {/* Shirt */}
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-shirt"><path d="M20.38 7.01 16 4l-2 2h-4L8 4 3.62 7.01A2 2 0 0 0 3 8.64V20h6v-5a3 3 0 0 1 6 0v5h6V8.64a2 2 0 0 0-.62-1.63Z"/></svg>
            </span>
            <span className="text-xs">Closet</span>
          </button>
          <button
            aria-label="Codination"
            className={`flex flex-col items-center gap-1 ${isClient && panel == 'codination' ? 'text-blue-600' : 'text-slate-500'}`}
            onClick={handleCodination}
          >
            <span className="inline-flex">
              {/* Layers */}
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-layers"><path d="m12.73 2.27 7.2 4.2a2 2 0 0 1 0 3.46l-7.2 4.2a2 2 0 0 1-2 0l-7.2-4.2a2 2 0 0 1 0-3.46l7.2-4.2a2 2 0 0 1 2 0Z"/><path d="m3.53 10.76 8.2 4.78a2 2 0 0 0 2 0l8.2-4.78"/></svg>
            </span>
            <span className="text-xs">Codis</span>
          </button>
          <button
            aria-label="Fitting"
            className={`flex flex-col items-center gap-1 ${isClient && panel == 'fitting' ? 'text-blue-600' : 'text-slate-500'}`}
            onClick={handleFitting}
          >
            <span className="inline-flex">
              {/* Scan */}
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-scan-line"><path d="M3 7V5a2 2 0 0 1 2-2h2"/><path d="M17 3h2a2 2 0 0 1 2 2v2"/><path d="M21 17v2a2 2 0 0 1-2 2h-2"/><path d="M7 21H5a2 2 0 0 1-2-2v-2"/><path d="M7 7h10v10H7z"/></svg>
            </span>
            <span className="text-xs">Fitting</span>
          </button>
        </div>
      </nav>
    </>
  );
}
