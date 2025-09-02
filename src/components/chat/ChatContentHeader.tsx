'use client';

import { useAtom, useAtomValue } from 'jotai';
import { currentChatIdAtom, contentAtom } from '@/atoms/chatAtoms';

export default function ChatContentHeader() {
  const currentChatId = useAtomValue(currentChatIdAtom);
  const [content, setContent] = useAtom(contentAtom);

  const handleContent = (con: 'chat' | 'cloth') => {
    setContent(con);
  };
  return (
    <header className="flex items-center justify-between px-4 py-6 mx-16 md:mx-auto w-full bg-white">
      <div className="flex items-center gap-2">
        <button
          className={`btn cursor-pointer text-blue text-3xl ${content == 'chat' && 'font-bold'}`}
          onClick={() => handleContent('chat')}
        >
          Chat
        </button>
        <button
          className={`btn cursor-pointer text-blue text-3xl ${content == 'cloth' && 'font-bold'}`}
          onClick={() => handleContent('cloth')}
        >
          Cloth
        </button>
      </div>
      <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-bold text-lg">
        U
      </div>
    </header>
  );
}
