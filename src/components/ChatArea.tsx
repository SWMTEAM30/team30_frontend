import { messageColor } from '@/styles/chat';
import { useEffect, useRef } from 'react';

// AI 응답 준비 중 스피너 컴포넌트
function AILoadingSpinner() {
  return (
    <>
      {/* 첫 번째 AI 스피너 */}
      <div className="flex justify-start">
        <div className="max-w-[70%] p-6 rounded-lg bg-gray-100 dark:bg-gray-700">
          <div className="flex space-x-2">
            <div
              className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"
              style={{ animationDelay: '0ms', animationDuration: '1.4s' }}
            ></div>
            <div
              className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"
              style={{ animationDelay: '0.2s', animationDuration: '1.4s' }}
            ></div>
            <div
              className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"
              style={{ animationDelay: '0.4s', animationDuration: '1.4s' }}
            ></div>
          </div>
        </div>
      </div>
      
      {/* 두 번째 AI 스피너 */}
      <div className="flex justify-start">
        <div className="max-w-[70%] p-6 rounded-lg bg-gray-100 dark:bg-gray-700">
          <div className="flex space-x-2">
            <div
              className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"
              style={{ animationDelay: '0.1s', animationDuration: '1.4s' }}
            ></div>
            <div
              className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"
              style={{ animationDelay: '0.3s', animationDuration: '1.4s' }}
            ></div>
            <div
              className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"
              style={{ animationDelay: '0.5s', animationDuration: '1.4s' }}
            ></div>
          </div>
        </div>
      </div>
      
      {/* 세 번째 AI 스피너 */}
      <div className="flex justify-start">
        <div className="max-w-[70%] p-6 rounded-lg bg-gray-100 dark:bg-gray-700">
          <div className="flex space-x-2">
            <div
              className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"
              style={{ animationDelay: '0.2s', animationDuration: '1.4s' }}
            ></div>
            <div
              className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"
              style={{ animationDelay: '0.4s', animationDuration: '1.4s' }}
            ></div>
            <div
              className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"
              style={{ animationDelay: '0.6s', animationDuration: '1.4s' }}
            ></div>
          </div>
        </div>
      </div>
    </>
  );
}

// 예시 선택지 컴포넌트
function ExampleSuggestions({ onExampleSelect }: { onExampleSelect: (text: string) => void }) {
  const examples = [
    '소개팅을 가야 하는 상황이야.',
    '조금 특별한 데이트를 하고 싶은데, 입을 만한 옷을 추천해줘.',
    '면접을 보러 가야하는데, 가장 적합한 옷이 무엇일지 몰라서. 추천받고 싶어.',
    '꾸민 듯 안 꾸민 듯한 꾸안꾸 패션을 추구해보고 싶어.',
  ];

  return (
    <div className="mt-8 max-w-2xl mx-auto">
      <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-4 text-center">
        다음에 물어보고 싶은 것
      </h3>
      <div className="grid gap-3">
        {examples.map((example, index) => (
          <button
            key={index}
            onClick={() => onExampleSelect(example)}
            className="p-4 text-left bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 cursor-pointer"
          >
            <p className="text-gray-700 dark:text-gray-200">{example}</p>
          </button>
        ))}
      </div>
    </div>
  );
}

// 빈 채팅방 시작 화면 컴포넌트
function EmptyChatStart({ onExampleSelect }: { onExampleSelect: (text: string) => void }) {
  const examples = [
    '소개팅을 가야 하는 상황이야.',
    '조금 특별한 데이트를 하고 싶은데, 입을 만한 옷을 추천해줘.',
    '면접을 보러 가야하는데, 가장 적합한 옷이 무엇일지 몰라서. 추천받고 싶어.',
    '꾸민 듯 안 꾸민 듯한 꾸안꾸 패션을 추구해보고 싶어.',
  ];

  return (
    <div className="flex flex-col items-center justify-center h-full text-center px-4">
      {/* 로고 */}
      <div className="mb-8">
        <img src="/TFT_icon.svg" alt="The First Take" className="w-24 h-24 mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">The First Take</h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">패션 AI 어시스턴트</p>
      </div>

      {/* 시작 문구 */}
      <div className="mb-8 max-w-md">
        <p className="text-xl text-gray-700 dark:text-gray-200 mb-4">패션에 대해 무엇이든 물어보세요!</p>
        <p className="text-gray-500 dark:text-gray-400">스타일링 조언부터 특별한 날의 코디까지, AI가 도와드릴게요.</p>
      </div>

      {/* 예시 선택지 */}
      <div className="w-full max-w-2xl">
        <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-4">예시로 시작해보세요</h3>
        <div className="grid gap-3">
          {examples.map((example, index) => (
            <button
              key={index}
              onClick={() => onExampleSelect(example)}
              className="p-4 text-left bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 cursor-pointer"
            >
              <p className="text-gray-700 dark:text-gray-200">{example}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function ChatArea({
  userID,
  messages,
  isLoading,
  isAIResponding,
  onExampleSelect,
}: {
  userID: string;
  messages: Message[];
  isLoading: boolean;
  isAIResponding?: boolean;
  onExampleSelect?: (text: string) => void;
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

  // AI 응답이 완료되었는지 확인 (마지막 메시지가 AI 응답이고 스피너가 꺼져있을 때)
  const isAIResponseComplete =
    messages.length > 0 && messages[messages.length - 1]?.user.userId !== userID && !isAIResponding;

  // AI 메시지에 사진을 첨부하는 함수
  const getAIImages = (messageIndex: number) => {
    // AI 메시지의 순서를 계산 (사용자 메시지 제외)
    let aiMessageCount = 0;
    for (let i = 0; i <= messageIndex; i++) {
      if (messages[i].user.userId !== userID) {
        aiMessageCount++;
      }
    }
    
    // AI별로 3개씩 이미지 할당
    const aiIndex = (aiMessageCount - 1) % 3; // 0, 1, 2 (첫 번째, 두 번째, 세 번째 AI)
    
    const aiImages = {
      0: ['/cloth1.jpg', '/cloth2.jpg', '/cloth3.jpg'],     // 첫 번째 AI
      1: ['/cloth4.jpg', '/cloth5.jpg', '/cloth6.jpg'],     // 두 번째 AI
      2: ['/cloth7.jpg', '/cloth8.jpg', '/cloth9.jpg'],     // 세 번째 AI
    };
    
    return aiImages[aiIndex as keyof typeof aiImages];
  };

  // 채팅방이 비어있고 로딩 중이 아닐 때 시작 화면 표시
  if (messages.length === 0 && !isLoading && !isAIResponding) {
    return (
      <div className="h-[calc(100vh-200px)] p-4">
        <EmptyChatStart onExampleSelect={onExampleSelect || (() => {})} />
      </div>
    );
  }

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
                  {/* AI 메시지에만 사진 첨부 */}
                  {message.user.userId !== userID && (
                    <div className="mt-4 flex flex-row gap-2 overflow-x-auto">
                      <img 
                        src={getAIImages(i)[0]} 
                        alt="패션 추천" 
                        className="w-72 h-90 rounded-lg object-cover flex-shrink-0"
                      />
                      <img 
                        src={getAIImages(i)[1]} 
                        alt="패션 추천" 
                        className="w-72 h-90 rounded-lg object-cover flex-shrink-0"
                      />
                      <img 
                        src={getAIImages(i)[2]} 
                        alt="패션 추천" 
                        className="w-72 h-90 rounded-lg object-cover flex-shrink-0"
                      />
                    </div>
                  )}
                </div>
              </div>
            ))}
            {/* AI 응답 준비 중일 때 3개의 스피너 표시 */}
            {isAIResponding && <AILoadingSpinner />}
            {/* AI 응답이 완료되면 예시 선택지 표시 */}
            {isAIResponseComplete && onExampleSelect && <ExampleSuggestions onExampleSelect={onExampleSelect} />}
          </>
        )}
      </div>
    </div>
  );
}
