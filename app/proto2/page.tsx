'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Send, Camera, BookOpen, Heart, Star, Info } from 'lucide-react';

interface Message {
  id: number;
  sender: 'user' | 'ai';
  content: string;
  timestamp: string;
  fashionTerms?: string[];
  images?: Array<{
    url: string;
    caption: string;
  }>;
}

interface FashionTerm {
  definition: string;
  examples: string[];
  image: string;
  tips: string;
}

interface FashionTermsData {
  [key: string]: FashionTerm;
}

const FashionChatUI = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      sender: 'ai',
      content:
        '안녕하세요! 패션 스타일링 AI입니다. 먼저 기본 정보를 알려주시겠어요? 키, 체형, 평소 어떤 옷을 즐겨 입으시는지 궁금해요!',
      timestamp: '오후 2:30',
      fashionTerms: [],
    },
  ]);

  const [inputValue, setInputValue] = useState('');
  const [showFashionTerm, setShowFashionTerm] = useState<FashionTerm | null>(null);
  const [learnedTerms, setLearnedTerms] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fashionTermsData: FashionTermsData = {
    오버사이즈: {
      definition: '실제 체형보다 큰 사이즈의 옷을 입는 스타일',
      examples: ['오버사이즈 셔츠', '오버사이즈 후드티', '오버사이즈 재킷'],
      image: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=400&h=600&fit=crop&crop=center',
      tips: '편안하고 캐주얼한 느낌을 주며, 체형 커버에도 좋습니다',
    },
    미니멀: {
      definition: '단순하고 깔끔한 디자인을 추구하는 스타일',
      examples: ['무지 티셔츠', '베이직 셔츠', '심플한 원피스'],
      image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=600&fit=crop&crop=center',
      tips: '색상과 패턴을 최소화하여 세련된 느낌을 연출합니다',
    },
    레이어드: {
      definition: '여러 겹의 옷을 겹쳐 입는 스타일링 기법',
      examples: ['셔츠 + 니트', '티셔츠 + 셔츠 + 가디건', '탱크탑 + 셔츠'],
      image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=400&h=600&fit=crop&crop=center',
      tips: '계절 변화에 대응하기 좋고 다양한 룩을 연출할 수 있습니다',
    },
    스트리트: {
      definition: '거리에서 시작된 자유롭고 개성 있는 패션 스타일',
      examples: ['후드티 + 조거팬츠', '그래픽 티셔츠', '스니커즈'],
      image: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=400&h=600&fit=crop&crop=center',
      tips: '편안하면서도 트렌디한 느낌을 주는 캐주얼 스타일입니다',
    },
  };

  const handleSend = () => {
    if (inputValue.trim()) {
      const newMessage: Message = {
        id: messages.length + 1,
        sender: 'user',
        content: inputValue,
        timestamp: new Date().toLocaleTimeString('ko-KR', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true,
        }),
      };

      setMessages([...messages, newMessage]);

      // AI 응답 시뮬레이션
      setTimeout(() => {
        const aiResponse = generateAIResponse(inputValue);
        setMessages((prev) => [...prev, aiResponse]);
      }, 1000);

      setInputValue('');
    }
  };

  const generateAIResponse = (userInput: string): Message => {
    const responses = [
      {
        content: `그렇다면 당신에게는 **오버사이즈** 핏의 옷들이 잘 어울릴 것 같아요! 편안하면서도 스타일리시한 **미니멀** 스타일은 어떠신가요? **레이어드** 기법을 활용하면 더욱 다채로운 룩을 연출할 수 있을 거예요.`,
        fashionTerms: ['오버사이즈', '미니멀', '레이어드'],
        images: [
          {
            url: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=300&h=200&fit=crop&crop=center',
            caption: '오버사이즈 핏 예시',
          },
          {
            url: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=300&h=200&fit=crop&crop=center',
            caption: '미니멀 스타일 예시',
          },
        ],
      },
      {
        content: `캐주얼한 스타일을 좋아하신다면 **스트리트** 패션이 잘 맞을 것 같아요! **오버사이즈** 후드티에 **레이어드** 기법을 더해보시는 건 어떨까요?`,
        fashionTerms: ['스트리트', '오버사이즈', '레이어드'],
        images: [
          {
            url: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=300&h=200&fit=crop&crop=center',
            caption: '스트리트 패션 예시',
          },
          {
            url: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=300&h=200&fit=crop&crop=center',
            caption: '레이어드 스타일링 예시',
          },
        ],
      },
      {
        content: `체형을 고려해볼 때 **미니멀** 스타일의 **오버사이즈** 셔츠가 좋을 것 같네요. 여기에 **레이어드** 스타일링을 더하면 더욱 세련된 룩을 만들 수 있어요!`,
        fashionTerms: ['미니멀', '오버사이즈', '레이어드'],
        images: [
          {
            url: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=300&h=200&fit=crop&crop=center',
            caption: '미니멀 오버사이즈 셔츠',
          },
          {
            url: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=300&h=200&fit=crop&crop=center',
            caption: '레이어드 코디네이션',
          },
        ],
      },
    ];

    const randomResponse = responses[Math.floor(Math.random() * responses.length)];

    return {
      id: messages.length + 2,
      sender: 'ai',
      content: randomResponse.content,
      timestamp: new Date().toLocaleTimeString('ko-KR', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      }),
      fashionTerms: randomResponse.fashionTerms,
      images: randomResponse.images,
    };
  };

  const handleFashionTermClick = (term: string) => {
    setShowFashionTerm(fashionTermsData[term]);
    if (!learnedTerms.includes(term)) {
      setLearnedTerms([...learnedTerms, term]);
    }
  };

  const renderMessage = (message: Message) => {
    const isUser = message.sender === 'user';

    return (
      <div key={message.id} className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
        <div
          className={`max-w-[70%] ${isUser ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-800'} rounded-2xl px-4 py-3`}
        >
          <div className="text-sm">
            {message.content.split('**').map((part, index) => {
              if (index % 2 === 1 && fashionTermsData[part]) {
                return (
                  <span
                    key={index}
                    className="font-bold underline cursor-pointer hover:bg-yellow-200 hover:text-black px-1 rounded transition-colors"
                    onClick={() => handleFashionTermClick(part)}
                  >
                    {part}
                  </span>
                );
              }
              return part;
            })}
          </div>

          {/* AI 메시지에 예시 이미지 추가 */}
          {!isUser && message.images && message.images.length > 0 && (
            <div className="mt-3 space-y-2">
              <div className="grid grid-cols-2 gap-2">
                {message.images.map((image, index) => (
                  <div key={index} className="relative">
                    <img
                      src={image.url}
                      alt={image.caption}
                      className="w-full h-24 object-cover rounded-lg border border-gray-200"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded-b-lg">
                      {image.caption}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="text-xs opacity-70 mt-1">{message.timestamp}</div>
        </div>
      </div>
    );
  };

  return (
    <div className="h-screen bg-gray-50 flex">
      {/* 메인 채팅 영역 */}
      <div className="flex-1 flex flex-col">
        {/* 헤더 */}
        <div className="bg-white shadow-sm border-b px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <Heart className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800">패션 스타일링 AI</h1>
                <p className="text-sm text-gray-500">당신만의 스타일을 찾아드려요</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-sm font-medium">
                학습된 용어: {learnedTerms.length}개
              </div>
            </div>
          </div>
        </div>

        {/* 채팅 메시지 */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map(renderMessage)}
          <div ref={messagesEndRef} />
        </div>

        {/* 입력 영역 */}
        <div className="bg-white border-t px-6 py-4">
          <div className="flex items-center space-x-4">
            <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors">
              <Camera className="w-5 h-5" />
            </button>
            <div className="flex-1 relative">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="패션에 대해 궁금한 것을 물어보세요..."
                className="w-full px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <button
              onClick={handleSend}
              className="bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-full transition-colors"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* 사이드바 - 패션 용어 설명 */}
      <div className="w-80 bg-white border-l overflow-y-auto">
        <div className="p-4 border-b">
          <h2 className="text-lg font-bold text-gray-800 flex items-center">
            <BookOpen className="w-5 h-5 mr-2" />
            패션 위키백과
          </h2>
        </div>

        {showFashionTerm ? (
          <div className="p-4">
            <div className="mb-4">
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                {Object.keys(fashionTermsData).find((key) => fashionTermsData[key] === showFashionTerm)}
              </h3>
              <img
                src={showFashionTerm.image}
                alt="패션 스타일 예시"
                className="w-full h-48 object-cover rounded-lg mb-3"
              />
              <p className="text-gray-600 text-sm leading-relaxed mb-3">{showFashionTerm.definition}</p>
              <div className="bg-blue-50 p-3 rounded-lg mb-3">
                <p className="text-sm text-blue-800">
                  <Info className="w-4 h-4 inline mr-1" />
                  {showFashionTerm.tips}
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-700 mb-2">예시 아이템:</h4>
                <ul className="space-y-1">
                  {showFashionTerm.examples.map((example, index) => (
                    <li key={index} className="text-sm text-gray-600 flex items-center">
                      <Star className="w-3 h-3 mr-2 text-yellow-500" />
                      {example}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-4">
            <div className="text-center text-gray-500 mt-8">
              <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p className="text-sm">
                대화 중 패션 용어를 클릭하면
                <br />
                자세한 설명을 볼 수 있어요!
              </p>
            </div>

            {learnedTerms.length > 0 && (
              <div className="mt-6">
                <h3 className="font-semibold text-gray-700 mb-3">학습한 용어들</h3>
                <div className="space-y-2">
                  {learnedTerms.map((term, index) => (
                    <button
                      key={index}
                      onClick={() => handleFashionTermClick(term)}
                      className="w-full text-left p-2 bg-gray-50 hover:bg-gray-100 rounded-lg text-sm transition-colors"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default FashionChatUI;
