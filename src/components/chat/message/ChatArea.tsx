'use client';

import { messagesAtom, streamingMessageAtom } from '@/atoms/chatAtoms';
import EmptyChatStart from '@/components/chat/message/EmptyChatStart';
import MessageBalloon from '@/components/chat/message/MessageBalloon';
import { useChatStream } from '@/queries/useChatStream';
import { useAtom, useAtomValue } from 'jotai';
import { useEffect, useRef } from 'react';

export default function ChatArea() {
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const [streamingMessage, setStreamingMessage] = useAtom(streamingMessageAtom);
  const messages = useAtomValue(messagesAtom);

  // 채팅방이 비어있고 로딩 중이 아닐 때 시작 화면 표시
  if (messages.length === 0) {
    return (
      <div className="h-[calc(100vh-200px)] p-4">
        <EmptyChatStart />
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-200px)] overflow-hidden">
      {/* 채팅 영역 */}
      <div className={`flex flex-col transition-all duration-500 ease-in-out flex-1`}>
        <div ref={scrollAreaRef} className="flex-1 p-4 overflow-y-auto scrollbar-hide">
          <div className="space-y-6 mx-auto max-w-[960px]">
            {messages.length == 0 ? (
              <div>대화 내용을 불러오는 중...</div>
            ) : (
              <>
                {messages.map((message, i) => (
                  <MessageBalloon key={i} message={message} />
                ))}
              </>
            )}
            {Object.entries(streamingMessage).map(
              ([agent, content]) => (
                <span>{content}</span>
              ),
              //<MessageBalloon key={agent} message={content} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
