'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import LucideIcon from '@/components/icons/LucideIcon';

export default function Home() {
  const [message, setMessage] = useState('');
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [onboardingStep, setOnboardingStep] = useState(0);
  const [userInfo, setUserInfo] = useState({ height: 0, weight: 0 });
  const router = useRouter();
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const onboardingMessages = [{ text: '어떤 상황에서 입을 옷을 찾고 계신가요?', type: 'bot' }];

  const [chatHistory, setChatHistory] = useState(onboardingMessages);

  const handleInitialMessage = () => {
    if (!message.trim()) return;

    // 기존 사용자 정보가 없다고 가정하고 온보딩 시작
    setShowOnboarding(true);
    setChatHistory([
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
      const heightMatch = message.match(/(\d+)/);
      const height = heightMatch ? parseInt(heightMatch[1]) : null;

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
      const weightMatch = message.match(/(\d+)/);
      const weight = weightMatch ? parseInt(weightMatch[1]) : null;

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
      if (showOnboarding) {
        handleOnboardingMessage();
      } else {
        handleInitialMessage();
      }
    }
  };

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [showOnboarding]);

  // Auto scroll to bottom when chat history updates
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory]);

  // Scroll animation effect
  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px',
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.remove('opacity-0', 'translate-y-12', 'pointer-events-none');
          entry.target.classList.add('opacity-100', 'translate-y-0');
        }
      });
    }, observerOptions);

    const cards = document.querySelectorAll('[data-scroll="card"]');
    cards.forEach((card) => observer.observe(card));

    return () => {
      cards.forEach((card) => observer.unobserve(card));
    };
  }, []);

  return (
    <div className="bg-beige-400 font-sans">
      {/* Main Content Section - 100vh */}
      <div className="h-screen flex items-center justify-center">
        <div className="max-w-5xl mx-auto px-4 w-full">
          {/* Hero Section - slides up when onboarding starts */}
          <div
            className={`text-center transition-all duration-700 ease-out ${
              showOnboarding ? 'hidden' : 'transform translate-y-0 opacity-100'
            }`}
          >
            <div className="my-16">
              <div className="inline-flex items-center px-6 py-3 bg-white/80 text-blue rounded-full text-lg font-medium shadow-sm">
                <LucideIcon name={'Clock'} color={'blue-500'} className="w-5 h-5 mr-2 dark" />
                패션을 잘 모르겠다면?
              </div>

              <h2 className="text-7xl font-bold text-gray-900 my-24 leading-tight">
                <span className="text-blue font-">The First Take</span>
              </h2>
              <div className="text-2xl font-bold text-gray-900 mb-32 leading-tight font-sans">
                패션 전문가가 아니더라도
                <br />
                완벽한 한 벌을 찾을 수 있어요
              </div>
            </div>
          </div>

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
              {/* Step Indicator - only show when not onboarding */}
              {!showOnboarding && (
                <div className="bg-gray-50 px-8 py-6 border-b border-gray-100">
                  <div className="flex items-center justify-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-blue text-white rounded-full flex items-center justify-center text-sm font-bold">
                        1
                      </div>
                      <span className="text-gray-900 font-medium">상황 설명</span>
                    </div>
                    <LucideIcon name={'ArrowRight'} className="w-5 h-5 text-gray-400" />
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-gray-200 text-gray-500 rounded-full flex items-center justify-center text-sm font-bold">
                        2
                      </div>
                      <span className="text-gray-500">AI 분석</span>
                    </div>
                    <LucideIcon name={'ArrowRight'} className="w-5 h-5 text-gray-400" />
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-gray-200 text-gray-500 rounded-full flex items-center justify-center text-sm font-bold">
                          3
                        </div>
                        <span className="text-gray-500">완벽한 한 벌</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Input Section */}
              <div className="bg-gray-50 p-8">
                <div className="text-center space-y-6">
                  {!showOnboarding ? (
                    <>
                      <div className="w-full">
                        <textarea
                          ref={inputRef}
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          onKeyPress={handleKeyPress}
                          placeholder="어떤 상황에서 입을 옷을 찾고 계신가요?"
                          className="w-full px-12 py-10 text-2xl border-2 border-blue/20 rounded-3xl focus:border-blue focus:outline-none transition-all duration-300 resize-none"
                          rows={3}
                        />
                      </div>
                      <div>
                        <button
                          onClick={handleInitialMessage}
                          className="inline-flex items-center px-12 py-4 bg-blue text-beige-50 font-bold rounded-2xl hover:bg-navy-600 transition-all transform hover:scale-105 shadow-lg text-xl"
                        >
                          <LucideIcon name={'Sparkles'} color="beige-50" className="mr-4 w-8 h-8" />
                          시작하기
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
                              onKeyPress={handleKeyPress}
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
                  {!showOnboarding && <p className="text-gray-500 mt-4 text-lg">⏱️ 30초면 완성! 복잡한 설문 없어요</p>}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Service Description Cards Section - Separate from main content */}
      <div className="transition-all duration-700 ease-out">
        <div className="py-16 space-y-8 max-w-6xl mx-auto px-4">
          {/* Scroll hint message */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-8 py-4 bg-blue/10 text-blue rounded-2xl">
              <LucideIcon name={'ArrowDown'} color="blue-500" className="w-6 h-6 mr-3 animate-bounce" />
              <span className="text-lg font-semibold">아래에서 더 많은 정보를 확인하세요!</span>
            </div>
          </div>

          {/* Card 1: 자연스러운 대화 */}
          <div
            className="opacity-0 translate-y-12 transition-all duration-1000 ease-out pointer-events-none"
            data-scroll="card"
          >
            <div className="bg-white/90 p-8 rounded-3xl border border-gray-200 shadow-xl">
              <div className="flex items-start space-x-6">
                <div className="flex-shrink-0 w-16 h-16 bg-blue rounded-2xl flex items-center justify-center">
                  <LucideIcon name={'MessageSquare'} color="beige-50" className="w-8 h-8" />
                </div>
                <div>
                  <h4 className="text-2xl font-bold text-gray-900 mb-3">자연스러운 대화로 취향 파악</h4>
                  <p className="text-lg text-gray-600 leading-relaxed">
                    복잡한 설문 없이 자연스러운 대화를 통해 당신의 스타일과 상황을 정확히 파악합니다. "회사 면접용 옷을
                    찾고 있어요" 같은 간단한 설명만으로도 완벽한 추천을 받을 수 있어요.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: 맞춤 추천 */}
          <div
            className="opacity-0 translate-y-12 transition-all duration-1000 ease-out pointer-events-none"
            data-scroll="card"
            style={{ transitionDelay: '200ms' }}
          >
            <div className="bg-white/90 p-8 rounded-3xl border border-gray-200 shadow-xl">
              <div className="flex items-start space-x-6">
                <div className="flex-shrink-0 w-16 h-16 bg-blue rounded-2xl flex items-center justify-center">
                  <LucideIcon name={'Sparkles'} color="beige-50" className="w-8 h-8" />
                </div>
                <div>
                  <h4 className="text-2xl font-bold text-gray-900 mb-3">체형과 상황을 고려한 맞춤 추천</h4>
                  <p className="text-lg text-gray-600 leading-relaxed">
                    키, 몸무게, 선호도까지 모두 고려하여 당신에게 가장 어울리는 딱 한 벌만 추천합니다. 여러 옵션 중에서
                    고르는 스트레스 없이 바로 구매할 수 있는 완벽한 코디를 제안해드려요.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Card 3: 간편함 */}
          <div
            className="opacity-0 translate-y-12 transition-all duration-1000 ease-out pointer-events-none"
            data-scroll="card"
            style={{ transitionDelay: '400ms' }}
          >
            <div className="bg-white/90 p-8 rounded-3xl border border-gray-200 shadow-xl">
              <div className="flex items-start space-x-6">
                <div className="flex-shrink-0 w-16 h-16 bg-blue rounded-2xl flex items-center justify-center">
                  <LucideIcon name={'Timer'} color="beige-50" className="w-8 h-8" />
                </div>
                <div>
                  <h4 className="text-2xl font-bold text-gray-900 mb-3">30초면 완성되는 간편함</h4>
                  <p className="text-lg text-gray-600 leading-relaxed">
                    긴 설문이나 복잡한 과정 없이 30초 만에 완벽한 스타일을 찾을 수 있습니다. 바쁜 일상 속에서도 빠르고
                    정확한 패션 솔루션을 제공해드려요.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Card 4: 실용성 */}
          <div
            className="opacity-0 translate-y-12 transition-all duration-1000 ease-out pointer-events-none"
            data-scroll="card"
            style={{ transitionDelay: '600ms' }}
          >
            <div className="bg-white/90 p-8 rounded-3xl border border-gray-200 shadow-xl">
              <div className="flex items-start space-x-6">
                <div className="flex-shrink-0 w-16 h-16 bg-blue rounded-2xl flex items-center justify-center">
                  <LucideIcon name={'ShoppingBag'} color="beige-50" className="w-8 h-8" />
                </div>
                <div>
                  <h4 className="text-2xl font-bold text-gray-900 mb-3">바로 구매 가능한 실용성</h4>
                  <p className="text-lg text-gray-600 leading-relaxed">
                    추천받은 아이템을 바로 구매할 수 있어요. 패션에 대한 지식이 없어도 AI가 골라준 완벽한 한 벌로 자신감
                    넘치는 스타일을 완성하세요.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Final Card */}
          <div
            className="opacity-0 translate-y-12 transition-all duration-1000 ease-out pointer-events-none"
            data-scroll="card"
            style={{ transitionDelay: '800ms' }}
          >
            <div className="bg-white/90 p-8 rounded-3xl border border-gray-200 shadow-xl text-center">
              <div className="inline-flex items-center px-8 py-4 bg-blue/10 text-blue rounded-2xl">
                <LucideIcon name={'Check'} color="blue-500" className="w-6 h-6 mr-3" />
                <span className="text-lg font-semibold">패션 고민, 이제 끝!</span>
              </div>
            </div>
          </div>

          {/* Bottom spacing */}
          <div className="h-48"></div>
        </div>
      </div>
    </div>
  );
}
