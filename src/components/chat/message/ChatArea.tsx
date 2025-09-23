'use client';

import { getChatRoomsRoomIdMessages } from '@/api/chatAPI';
import {
  messagesAtomFamily,
  roomIdAtom,
  streamingMessageAtom,
  isAIRespondingAtom,
  tempMessageAtom,
} from '@/atoms/chatAtoms';
import EmptyChatStart from '@/components/chat/message/EmptyChatStart';
import MessageBalloon from '@/components/chat/message/MessageBalloon';
import MessageSpinner from '@/components/chat/message/MessageSpinner';
import { useAtom, useAtomValue } from 'jotai';
import { useCallback, useEffect, useRef, useState } from 'react';

export default function ChatArea() {
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const streamingMessage = useAtomValue(streamingMessageAtom);
  const roomId = useAtomValue(roomIdAtom);
  const [messages, setMessages] = useAtom(messagesAtomFamily(roomId));
  const isAIResponding = useAtomValue(isAIRespondingAtom);
  const prevStreamingSizeRef = useRef(0);
  const [isFetchingOlder, setIsFetchingOlder] = useState(false);
  const [canLoadOlder, setCanLoadOlder] = useState(true);

  // 단일 로더: beforeDate 유무에 따라 초기/이전 메시지 로드
  const loadMessages = useCallback(
    async (beforeDate?: Date) => {
      if (!roomId) return;
      const hasOlderFetch = !!beforeDate;
      if (hasOlderFetch) {
        if (isFetchingOlder || !canLoadOlder) return;
        setIsFetchingOlder(true);
      }
      try {
        const response = await getChatRoomsRoomIdMessages(roomId, beforeDate);
        if (response.status === 'success' && response.data?.messages) {
          const fetched = response.data.messages;
          setMessages((prev) => [...fetched, ...prev]);
          if (fetched.length === 0) setCanLoadOlder(false);
        }
      } catch (error) {
        console.error('Failed to load messages:', error);
      } finally {
        setIsFetchingOlder(false);
      }
    },
    [roomId, isFetchingOlder, canLoadOlder, setMessages],
  );

  // 스크롤 감지 이벤트
  useEffect(() => {
    const scrollArea = scrollAreaRef.current;
    if (!scrollArea) return;

    const handleScroll = () => {
      // 스크롤이 맨 위에 가까이 있을 때 (50px 이내)
      if (scrollArea.scrollTop <= 50 && !isFetchingOlder && canLoadOlder) {
        const oldest = messages[0];
        if (oldest?.createdAt) loadMessages(oldest.createdAt);
      }
    };

    scrollArea.addEventListener('scroll', handleScroll);
    return () => scrollArea.removeEventListener('scroll', handleScroll);
  }, [messages, loadMessages, isFetchingOlder, canLoadOlder]);

  // 스트리밍 메시지가 0에서 새로 생긴 상황에서 자동 스크롤
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

  // 사용자 메시지 전송 시 메시지가 추가될 때 스크롤
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages.length]);

  // 채팅방이 비어있고 로딩 중이 아닐 때 시작 화면 표시
  if (!roomId || messages.length + streamingMessage.size === 0) {
    return <EmptyChatStart />;
  }

  return (
    <div className={`flex flex-col transition-all duration-500 ease-in-out flex-1`}>
      <div ref={scrollAreaRef} className="flex-1 p-4 overflow-y-auto chat-scroll">
        <div className="space-y-6 mx-auto max-w-[960px]">
          {/* 이전 메시지 로딩 인디케이터 */}
          {isFetchingOlder && (
            <div className="flex justify-center py-4">
              <div className="text-gray-500">이전 메시지를 불러오는 중...</div>
            </div>
          )}
          <>
            {messages.map((message, i) => (
              <MessageBalloon key={i} message={message} />
            ))}
          </>
          {[...streamingMessage].map(([agent, content]) => (
            <MessageBalloon key={agent} message={content} />
          ))}

          {/* AI 응답 중일 때 로딩 메시지 표시 */}
          {isAIResponding && streamingMessage.size === 0 && <MessageSpinner />}
        </div>
      </div>
    </div>
  );
}
