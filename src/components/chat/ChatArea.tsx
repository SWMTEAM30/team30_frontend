'use client';

import { userAtom } from '@/atoms/authAtoms';
import { currentChatIdAtom, examplesAtomFamily, isAIRespondingAtom, messagesAtomFamily } from '@/atoms/chatAtoms';
import AILoadingSpinner from '@/components/chat/AILoadingSpinner';
import EmptyChatStart from '@/components/chat/EmptyChatStart';
import ExampleSuggestions from '@/components/chat/ExampleSuggestion';
import MessageBalloon from '@/components/chat/MessageBalloon';
import { useChatMessage } from '@/queries/useChatMessage';
import { useAtomValue } from 'jotai';
import { useCallback, useEffect, useRef } from 'react';

export default function ChatArea() {
  const isAIResponding = useAtomValue(isAIRespondingAtom);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { isLoading: isChatLoading } = useChatMessage();
  const user = useAtomValue(userAtom);

  const currentChatId = useAtomValue(currentChatIdAtom);
  const messages = useAtomValue(messagesAtomFamily(currentChatId));
  const messageExamples = useAtomValue(examplesAtomFamily(currentChatId));

  // 채팅방이 비어있고 로딩 중이 아닐 때 시작 화면 표시
  if (messages.length === 0 && !isChatLoading && !isAIResponding) {
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
                {/* AI 응답 준비 중일 때 스피너 표시 */}
                {isAIResponding && <AILoadingSpinner />}
                {/* AI 응답이 완료되면 예시 선택지 표시 (마지막 메시지가 AI 응답이고 스피너가 꺼져있을 때)*/}
                {messages.length > 0 &&
                  messages[messages.length - 1].user?.userId !== user?.userId &&
                  !isAIResponding &&
                  messageExamples && <ExampleSuggestions />}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
