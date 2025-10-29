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
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-300"></div>
          <div className="relative">
            <div
              className="
              w-full min-h-[70px] max-h-[140px] 
              bg-white dark:bg-slate-700 border-2 border-gray-200 dark:border-slate-700
              rounded-2xl 
              focus-within:border-blue-400 focus-within:ring-4 focus-within:ring-blue-100 
              shadow-lg hover:shadow-xl
              transition-all duration-300 ease-out
              backdrop-blur-sm
              flex items-end justify-between p-4
            "
            >
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
                  flex-1 resize-none
                  bg-transparent dark:bg-slate-700
                  text-lg
                  border-none focus-visible:border-0 focus:outline-none focus:ring-0
                  placeholder:text-gray-400
                  min-h-[42px] max-h-[112px]
                  pr-4
                "
                disabled={isLoading}
              />
              <Button
                type="submit"
                disabled={!inputValue.trim() || isLoading}
                className="
                  flex-shrink-0 
                  flex items-center justify-center
                  w-12 h-12 rounded-full
                  bg-blue text-white
                  hover:bg-navy-600 
                  disabled:bg-gray-300 disabled:text-gray-500
                  transition-all duration-200
                "
              >
                {isLoading ? (
                  <LucideIcon name={'LoaderCircle'} color="blue-50" className="w-5 h-5 animate-spin" />
                ) : (
                  <LucideIcon name={'Send'} color="blue-50" className="w-5 h-5" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
