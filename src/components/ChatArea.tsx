import AILoadingSpinner from '@/components/AILoadingSpinner';
import { messageColor } from '@/styles/chat';
import { useEffect, useRef } from 'react';

export default function ChatArea({
  userID,
  messages,
  isLoading,
  isAIResponding,
}: {
  userID: string;
  messages: Message[];
  isLoading: boolean;
  isAIResponding?: boolean;
}) {
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // 스크롤을 맨 아래로 이동시키는 함수
  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  };

  // 메시지가 추가될 때마다 스크롤을 맨 아래로 이동
  useEffect(() => {
    if (messages.length > 0 || isAIResponding) {
      // DOM 업데이트 후 스크롤 실행을 위해 setTimeout 사용
      setTimeout(scrollToBottom, 100);
    }
  }, [messages, isAIResponding]);

  return (
    <div ref={scrollAreaRef} className="h-[calc(100vh-200px)] p-4 overflow-y-auto">
      <div className="space-y-4 max-w-[1024px] mx-auto">
        {isLoading ? (
          <div>대화 내용을 불러오는 중...</div>
        ) : (
          <>
            {messages.map((message, i) => (
              <div key={i} className={`flex ${message.user.userId == userID ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[70%] p-6 rounded-lg ${message.user.userId == 'asdf' ? messageColor[0] : messageColor[1]}`}
                >
                  <p className="text-lg md:text-2xl">{message.text}</p>
                  <p className="text-xs opacity-70 mt-2">{message.timestamp.toLocaleTimeString()}</p>
                </div>
              </div>
            ))}
            {/* AI 응답 준비 중일 때 3개의 스피너 표시 */}
            {isAIResponding && <AILoadingSpinner />}
          </>
        )}
      </div>
    </div>
  );
}
