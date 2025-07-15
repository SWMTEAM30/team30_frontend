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
      <div className={`flex flex-col transition-all duration-500 ease-in-out ${selectedImage ? 'w-2/3' : 'w-full'}`}>
        <div ref={scrollAreaRef} className="flex-1 p-4 overflow-y-auto">
          <div className="space-y-4 mx-auto max-w-[960px]">
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
                                className="w-72 h-90 rounded-lg object-cover flex-shrink-0 cursor-pointer hover:opacity-80 hover:scale-105 transition-all duration-200 ease-in-out shadow-lg hover:shadow-xl"
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

      {/* 오른쪽 세션 패널 */}
      {selectedImage && (
        <div className="w-1/3 border-l border-gray-200 bg-white">
          <div className="p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">패션 아이템 상세</h3>
              <button
                onClick={() => setSelectedImage(null)}
                className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100"
              >
                ✕
              </button>
            </div>
            <ImageDetailPanel imageData={selectedImage} onClose={() => setSelectedImage(null)} />
          </div>
        </div>
      )}
    </div>
  );
}
