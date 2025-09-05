'use client';

import ChatContentHeader from '@/components/chat/ChatContentHeader';
import ChatInputBox from '@/components/chat/message/ChatInputBox';
import ChatArea from '@/components/chat/message/ChatArea';
import { useAtomValue } from 'jotai';
import { contentAtom } from '@/atoms/chatAtoms';
import ClothArea from '@/components/chat/cloth/ClothArea';

export default function ChatContent() {
  const content = useAtomValue(contentAtom);
  return (
    <>
      {/* <div className="hidden lg:block">
        <ChatSidebar />
      </div> */}
      <div className="w-full h-[100dvh] lg:transition-all lg:duration-300">
        <div className="flex flex-col w-full h-full">
          <ChatContentHeader />
          <div className="flex-1 min-h-0">
            {content == 'chat' && <ChatArea />}
            {content == 'cloth' && <ClothArea />}
          </div>
          <ChatInputBox />
        </div>
      </div>
    </>
  );
}
