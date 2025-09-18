'use client';

import ChatInputBox from '@/components/chat/message/ChatInputBox';
import ChatArea from '@/components/chat/message/ChatArea';

export default function ChatPanel() {
  return (
    <div className="flex flex-col w-full h-full">
      <div className="flex h-[calc(100vh)] overflow-hidden">
        <ChatArea />
      </div>
      <ChatInputBox />
    </div>
  );
}
