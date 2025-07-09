import AILoadingSpinner from '@/components/AILoadingSpinner';
import EmptyChatStart from '@/components/EmptyChatStart';
import ExampleSuggestions from '@/components/ExampleSuggestion';
import ImageDetailPanel from '@/components/ImageDetailPanel';
import { messageColor } from '@/styles/chat';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

export default function ChatArea({
  userID,
  messages,
  isLoading,
  isAIResponding,
  examples,
  onExampleSelect,
}: {
  userID: string;
  messages: Message[];
  isLoading: boolean;
  isAIResponding?: boolean;
  examples: string[];
  onExampleSelect?: (text: string) => void;
}) {
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const [selectedImage, setSelectedImage] = useState<MessageImage | null>(null);

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
    if (messages.length > 0 || isAIResponding) setTimeout(scrollToBottom, 100);
  }, [messages, isAIResponding]);

  // 채팅방이 비어있고 로딩 중이 아닐 때 시작 화면 표시
  if (messages.length === 0 && !isLoading && !isAIResponding) {
    return (
      <div className="h-[calc(100vh-200px)] p-4">
        <EmptyChatStart examples={examples} onExampleSelect={onExampleSelect || (() => {})} />
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-200px)] overflow-hidden">
      {/* 채팅 영역 */}
      <div className={`flex flex-col transition-all duration-500 ease-in-out ${selectedImage ? 'flex-1' : 'w-full'}`}>
        <div ref={scrollAreaRef} className="flex-1 p-4 overflow-y-auto">
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
                      {/* AI 메시지에만 사진 첨부 */}
                      {message.user.userId !== userID && (
                        <div className="mt-4 flex flex-row gap-2 overflow-x-auto">
                          {message.images &&
                            message.images.map((image, key) => (
                              <Image
                                key={key}
                                width={300}
                                height={400}
                                src={image.src}
                                alt={image.name}
                                className="w-72 h-90 rounded-lg object-cover flex-shrink-0 cursor-pointer hover:opacity-80 transition-opacity"
                                onClick={() => setSelectedImage(image)}
                              />
                            ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                {/* AI 응답 준비 중일 때 3개의 스피너 표시 */}
                {isAIResponding && <AILoadingSpinner />}
                {/* AI 응답이 완료되면 예시 선택지 표시 (마지막 메시지가 AI 응답이고 스피너가 꺼져있을 때)*/}
                {messages.length > 0 &&
                  messages[messages.length - 1]?.user.userId !== userID &&
                  !isAIResponding &&
                  onExampleSelect && <ExampleSuggestions onExampleSelect={onExampleSelect} examples={examples} />}
              </>
            )}
          </div>
        </div>
      </div>

      {/* 오른쪽 상세 정보 패널 - transform 애니메이션 */}
      {selectedImage && <ImageDetailPanel imageData={selectedImage} onClose={() => setSelectedImage(null)} />}
    </div>
  );
}
