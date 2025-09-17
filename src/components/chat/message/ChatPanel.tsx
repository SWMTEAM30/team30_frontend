'use client';

import ChatInputBox from '@/components/chat/message/ChatInputBox';
import ChatArea from '@/components/chat/message/ChatArea';

export default function ChatPanel() {
  return (
    <div className="flex flex-col w-full h-full">
      <div className="flex-1 min-h-0">
        <ChatArea />
      </div>
      <ChatInputBox />
    </div>
  );
}
