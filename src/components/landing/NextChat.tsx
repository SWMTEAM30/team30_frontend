'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { postChatRooms } from '@/api/chatAPI';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import LucideIcon from '@/components/ui/icons/LucideIcon';
import { useAtomValue, useSetAtom } from 'jotai';
import { tempMessageAtom } from '@/atoms/chatAtoms';
import { userAtom } from '@/atoms/authAtoms';
import { useAuthCheck } from '@/hooks/useAuthCheck';

export default function NextChat() {
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const setTempMessage = useSetAtom(tempMessageAtom);
  const user = useAtomValue(userAtom);
  const { checkAuth } = useAuthCheck();

  // 상황별 프리셋 메시지들
  const situationPresets = [
    { text: '결혼식 하객룩', message: '결혼식 하객으로 갈 때 입을 옷을 추천해주세요' },
    { text: '소개팅할 때 입을 옷', message: '소개팅에서 입을 옷을 추천해주세요' },
    { text: '특별한 파티룩', message: '특별한 파티에서 입을 옷을 추천해주세요' },
    { text: '면접에서 입을 옷', message: '면접에서 입을 옷을 추천해주세요' },
    { text: '친구 만날 때 입을 옷', message: '친구들과 만날 때 입을 옷을 추천해주세요' },
    { text: '데이트할 때 입을 옷', message: '데이트할 때 입을 옷을 추천해주세요' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    await createChatRoom(inputValue);
  };

  const handleSituationClick = async (message: string) => {
    await createChatRoom(message);
  };

  const createChatRoom = async (message: string) => {
    setIsLoading(true);

    try {
      // 로그인 확인
      const authResult = await checkAuth({
        alertMessage: '채팅을 시작하려면 로그인이 필요합니다.',
      });

      if (!authResult.isAuthenticated) {
        return; // checkAuth에서 이미 리다이렉트 처리됨
      }

      // 채팅방 생성
      const response = await postChatRooms();
      console.log('NextChat - room creation response:', response.data);
      if (response.status === 'success' && response.data) {
        const newRoomId = response.data.id.toString();
        console.log('NextChat - setting roomId to:', newRoomId);

        // 임시 저장소에 메시지 저장
        setTempMessage({
          roomId: newRoomId,
          userMessage: message,
        });

        // 페이지 이동
        router.push(`/chat/${newRoomId}`);
      } else {
        console.error('Failed to create chat room:', response.message);
      }
    } catch (error) {
      console.error('Error creating chat room:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto mt-8">
      {/* 상황별 버튼들 */}
      <div className="mb-8">
        <div className="text-center mb-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-2">어떤 상황에서 입을 옷을 찾고 계신가요?</h3>
          <p className="text-gray-500 text-sm">상황을 선택하거나 직접 입력해보세요</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {situationPresets.map((preset, index) => (
            <button
              key={index}
              onClick={async () => {
                const authResult = await checkAuth({
                  alertMessage: '채팅을 시작하려면 로그인이 필요합니다.',
                });

                if (authResult.isAuthenticated) {
                  handleSituationClick(preset.message);
                }
              }}
              disabled={isLoading}
              className="
                group relative
                px-6 py-4 
                bg-gradient-to-br from-white to-gray-50
                border border-gray-200 
                rounded-2xl 
                hover:border-blue-400 hover:from-blue-50 hover:to-blue-100
                hover:shadow-lg hover:-translate-y-1
                transition-all duration-300 ease-out
                text-sm font-semibold text-gray-700
                disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0
                shadow-sm
                overflow-hidden
              "
            >
              {/* 배경 그라데이션 효과 */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-purple-500/0 to-pink-500/0 group-hover:from-blue-500/5 group-hover:via-purple-500/5 group-hover:to-pink-500/5 transition-all duration-300"></div>

              {/* 버튼 내용 */}
              <div className="relative z-10 flex items-center justify-center">
                <span className="text-center leading-tight">{preset.text}</span>
              </div>

              {/* 호버 시 아이콘 효과 */}
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
              </div>
            </button>
          ))}
        </div>

        {/* 구분선 */}
        <div className="flex items-center my-6">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
          <span className="px-4 text-sm text-gray-400 font-medium">또는</span>
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-300"></div>
          <div className="relative">
            <Textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              onClick={async () => {
                await checkAuth({
                  alertMessage: '채팅을 시작하려면 로그인이 필요합니다.',
                });
              }}
              placeholder="패션에 대해 마음대로 물어보세요! 예: '데이트룩 추천해줘'"
              className="
                w-full min-h-[70px] max-h-[140px] 
                text-lg px-6 py-5 
                bg-white border-2 border-gray-200 
                rounded-2xl 
                focus:border-blue-400 focus:ring-4 focus:ring-blue-100 
                resize-none
                placeholder:text-gray-400
                shadow-lg hover:shadow-xl
                transition-all duration-300 ease-out
                backdrop-blur-sm
              "
              disabled={isLoading}
            />
          </div>
        </div>

        <div className="flex justify-center">
          <Button
            type="submit"
            disabled={!inputValue.trim() || isLoading}
            className="
              inline-flex items-center px-8 py-4 
              bg-blue text-white 
              font-bold rounded-2xl 
              hover:bg-navy-600 
              disabled:bg-gray-300 disabled:text-gray-500
              transition-all transform hover:scale-105 
              shadow-lg text-lg
              min-w-[200px]
            "
          >
            {isLoading ? (
              <>
                <LucideIcon name={'LoaderCircle'} color="blue-50" className="mr-3 w-5 h-5 animate-spin" />
                채팅방 생성 중...
              </>
            ) : (
              <>
                <LucideIcon name={'Sparkles'} color="blue-50" className="mr-3 w-5 h-5" />
                채팅 시작하기
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
