'use client';

import { messagesAtom, streamingMessageAtom } from '@/atoms/chatAtoms';
import EmptyChatStart from '@/components/chat/message/EmptyChatStart';
import MessageBalloon from '@/components/chat/message/MessageBalloon';
import { useAtom, useAtomValue } from 'jotai';
import { useEffect, useRef } from 'react';

export default function ChatArea() {
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const [streamingMessage, setStreamingMessage] = useAtom(streamingMessageAtom);
  const messages = useAtomValue(messagesAtom);
  const prevStreamingSizeRef = useRef(0);

  // 스트리밍 메시지가 0에서 새로 생긴 상황에서만 자동 스크롤
  useEffect(() => {
    const currentSize = streamingMessage.size;
    const prevSize = prevStreamingSizeRef.current;
    
    // 이전에 0이었고 현재 0보다 클 때만 스크롤
    if (prevSize === 0 && currentSize > 0 && scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
    
    prevStreamingSizeRef.current = currentSize;
  }, [streamingMessage]);

  // 메시지가 추가될 때도 스크롤 (사용자 메시지 전송 시)
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages.length]);

  // 스트리밍 메시지 변경 시 로그 출력
  // useEffect(() => {
  //   console.log(streamingMessage);
  // }, [streamingMessage]);

  // 채팅방이 비어있고 로딩 중이 아닐 때 시작 화면 표시
  if (messages.length === 0) {
    return <EmptyChatStart />;
  }

  return (
    <div className={`flex flex-col transition-all duration-500 ease-in-out flex-1`}>
      <div ref={scrollAreaRef} className="flex-1 p-4 overflow-y-auto chat-scroll">
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
          {[...streamingMessage].map(([agent, content]) => (
            <MessageBalloon key={agent} message={content} />
          ))}
        </div>
      </div>
    </div>
  );
}
