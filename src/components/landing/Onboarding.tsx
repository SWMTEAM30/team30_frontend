'use client';

import LucideIcon from '@/components/icons/LucideIcon';
import SituationOption from '@/components/landing/SituationOption';
import { matchThevalueinMessage } from '@/lib/validation';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

export default function Onboarding() {
  const [message, setMessage] = useState('');
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [onboardingStep, setOnboardingStep] = useState(0);
  const [userInfo, setUserInfo] = useState({ height: 0, weight: 0 });
  const router = useRouter();
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const onboardingMessages = [{ text: '어떤 상황에서 입을 옷을 찾고 계신가요?', type: 'bot' }];
  const [chatHistory, setChatHistory] = useState(onboardingMessages);

  // 상황별 선택지
  const situationOptions = [
    { text: '회사 면접', icon: 'Briefcase', description: '면접용 정장이나 비즈니스 룩' },
    { text: '데이트', icon: 'Heart', description: '연인과의 특별한 만남' },
    { text: '친구 모임', icon: 'Users', description: '친구들과의 캐주얼한 모임' },
    { text: '결혼식', icon: 'Cake', description: '결혼식이나 축하 행사' },
    { text: '여행', icon: 'MapPin', description: '여행용 편안한 옷' },
    { text: '운동/스포츠', icon: 'Dumbbell', description: '운동이나 스포츠 활동' },
  ];

  const handleSituationSelect = (situation: string) => {
    setShowOnboarding(true);
    setChatHistory((onboardingMessages) => [
      ...onboardingMessages,
      { text: situation, type: 'user' },
      {
        text: '멋진 선택이네요! 더 정확한 추천을 위해 몇 가지 정보가 필요해요. 키를 알려주세요 (예: 170cm)',
        type: 'bot',
      },
    ]);
    setMessage('');
  };

  const handleInitialMessage = () => {
    if (!message.trim()) return;
    setShowOnboarding(true);
    setChatHistory((onboardingMessages) => [
      ...onboardingMessages,
      { text: message, type: 'user' },
      {
        text: '멋진 질문이네요! 더 정확한 추천을 위해 몇 가지 정보가 필요해요. 키를 알려주세요 (예: 170cm)',
        type: 'bot',
      },
    ]);
    setMessage('');
  };

  const handleOnboardingMessage = () => {
    if (!message.trim()) return;
    const newHistory = [...chatHistory, { text: message, type: 'user' }];
    if (onboardingStep === 0) {
      // 키 입력 검증
      const height = matchThevalueinMessage(message);
      if (height && height >= 100 && height <= 220) {
        setUserInfo((prev) => ({ ...prev, height: height }));
        newHistory.push({ text: '좋아요! 이제 몸무게를 알려주세요 (예: 60kg)', type: 'bot' });
        setOnboardingStep(1);
      } else {
        newHistory.push({
          text: '올바른 키를 입력해주세요. 100cm~220cm 사이의 숫자로 입력해주세요. (예: 170cm)',
          type: 'bot',
        });
      }
    } else if (onboardingStep === 1) {
      // 몸무게 입력 검증
      const weight = matchThevalueinMessage(message);
      if (weight && weight >= 30 && weight <= 150) {
        setUserInfo((prev) => ({ ...prev, weight: weight }));
        newHistory.push({
          text: '완료! 이제 당신만의 스타일 어시스턴트와 대화를 시작할 수 있어요. 채팅 페이지로 이동하시겠어요?',
          type: 'bot',
        });
        setOnboardingStep(2);
        console.log(userInfo, weight);
      } else {
        newHistory.push({
          text: '올바른 몸무게를 입력해주세요. 30kg~150kg 사이의 숫자로 입력해주세요. (예: 60kg)',
          type: 'bot',
        });
      }
    } else {
      // 온보딩 완료 - 채팅 버튼이 표시됨
      setOnboardingStep(2);
    }

    setChatHistory(newHistory);
    setMessage('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      if (showOnboarding) handleOnboardingMessage();
      else handleInitialMessage();
    }
  };

  const handleBackToInitial = () => {
    setShowOnboarding(false);
    setOnboardingStep(0);
    setUserInfo({ height: 0, weight: 0 });
    setChatHistory(onboardingMessages);
    setMessage('');
  };

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory]);

  return (
    <>
      {/* 뒤로 가기 버튼 - 온보딩 중에만 표시 */}
      {showOnboarding && (
        <div className="mt-32 mb-8">
          <button
            onClick={handleBackToInitial}
            className="inline-flex items-center px-4 py-2 bg-white/90 rounded-full shadow-lg hover:bg-white transition-colors text-gray-700"
          >
            <LucideIcon name={'ArrowLeft'} color="blue-500" className="w-5 h-5 mr-2" />
            <span className="text-sm font-medium">뒤로 가기</span>
          </button>
        </div>
      )}

      {/* Chat History - slides down when onboarding starts */}
      <div
        className={`max-w-6xl mx-auto transition-all duration-700 ease-out ${
          showOnboarding
            ? 'transform translate-y-0 opacity-100'
            : 'transform -translate-y-8 opacity-0 pointer-events-none absolute'
        }`}
      >
        <div
          className="space-y-4 mb-6 h-[400px] overflow-y-auto scrollbar-hide flex flex-col justify-start"
          ref={chatContainerRef}
        >
          {chatHistory.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-2xl p-6 rounded-3xl ${
                  msg.type === 'user' ? 'bg-blue text-beige-50' : 'bg-white/80 border border-gray-200'
                }`}
              >
                <p className="text-2xl leading-relaxed">{msg.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Interface - slides to different positions */}
      <div
        className={`transition-all duration-700 ease-out ${
          showOnboarding ? 'max-w-6xl mx-auto transform translate-y-0' : 'transform -translate-y-16'
        }`}
      >
        <div
          className={`bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden ${
            showOnboarding ? 'max-w-6xl mx-auto' : ''
          }`}
        >
          {/* Input Section */}
          <div className="bg-gray-50 p-8">
            <div className="text-center space-y-6">
              {!showOnboarding ? (
                <>
                  {/* 상황별 선택지 */}
                  <div className="mb-8">
                    <h3 className="text-2xl font-bold text-gray-900 mb-6">어떤 상황에서 입을 옷을 찾고 계신가요?</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                      {situationOptions.map((option, index) => (
                        <SituationOption key={index} option={option} handleSituationSelect={handleSituationSelect} />
                      ))}
                    </div>
                  </div>

                  {/* 직접 입력 옵션 */}
                  <div className="w-full">
                    <textarea
                      ref={inputRef}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyDown={handleKeyPress}
                      placeholder="직접 상황을 설명해주세요 (예: 대학 졸업식, 친구 생일파티 등)"
                      className="w-full px-12 py-10 text-2xl border-2 border-blue/20 rounded-3xl focus:border-blue focus:outline-none transition-all duration-300 resize-none"
                      rows={3}
                    />
                  </div>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <button
                      onClick={handleInitialMessage}
                      className="inline-flex items-center px-12 py-4 bg-blue text-beige-50 font-bold rounded-2xl hover:bg-navy-600 transition-all transform hover:scale-105 shadow-lg text-xl"
                    >
                      <LucideIcon name={'Sparkles'} color="beige-50" className="mr-4 w-8 h-8" />
                      시작하기
                    </button>
                    <button
                      onClick={() => router.push('/chat')}
                      className="inline-flex items-center px-8 py-4 bg-gray-100 text-gray-700 font-bold rounded-2xl hover:bg-gray-200 transition-all transform hover:scale-105 shadow-lg text-xl"
                    >
                      <LucideIcon name={'SkipForward'} color="blue-400" className="mr-4 w-6 h-6" />
                      건너뛰기
                    </button>
                  </div>
                </>
              ) : (
                <>
                  {onboardingStep === 2 ? (
                    // 마지막 단계: 채팅 버튼만 표시
                    <div className="text-center">
                      <button
                        onClick={() => router.push('/chat')}
                        className="inline-flex items-center px-12 py-6 bg-blue text-beige-50 font-bold rounded-2xl hover:bg-navy-600 transition-all transform hover:scale-105 shadow-lg text-xl"
                      >
                        <LucideIcon name={'MessageSquare'} color="beige-50" className="mr-4 w-8 h-8" />
                        채팅 시작하기
                      </button>
                    </div>
                  ) : (
                    // 온보딩 중: 기존 입력창 표시
                    <>
                      <div className="w-full">
                        <textarea
                          ref={inputRef}
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          onKeyDown={handleKeyPress}
                          placeholder={onboardingStep === 0 ? '키를 입력해주세요' : '몸무게를 입력해주세요'}
                          className="w-full px-12 py-10 text-2xl border-2 border-blue/20 rounded-3xl focus:border-blue focus:outline-none transition-all duration-300 resize-none"
                          rows={3}
                        />
                      </div>
                      <div>
                        <button
                          onClick={handleOnboardingMessage}
                          className="inline-flex items-center px-12 py-4 bg-blue text-beige-50 font-bold rounded-2xl hover:bg-navy-600 transition-all transform hover:scale-105 shadow-lg"
                        >
                          <LucideIcon name={'ArrowRight'} color="beige-50" className="w-8 h-8" />
                        </button>
                      </div>
                    </>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
