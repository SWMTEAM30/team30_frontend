'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { postChatRooms } from '@/api/chatAPI';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import LucideIcon from '@/components/ui/icons/LucideIcon';
import { useChatStream } from '@/hooks/useChatStream';
import { useAtomValue, useSetAtom } from 'jotai';
import { roomIdAtom } from '@/atoms/chatAtoms';
import { userAtom } from '@/atoms/authAtoms';

export default function NextChat() {
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { mutate } = useChatStream();
  const router = useRouter();
  const setRoomId = useSetAtom(roomIdAtom);
  const user = useAtomValue(userAtom);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    setIsLoading(true);

    try {
      // 채팅방 생성
      const response = await postChatRooms();
      console.log(response.data);
      if (response.status === 'success' && response.data) {
        router.push(`/chat`);
        setRoomId(response.data.id);
        console.log(response.data.id);
        mutate({ roomId: response.data.id, inputValue });
      } else console.error('Failed to create chat room:', response.message);
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
    <div className="w-full max-w-2xl mx-auto mt-8">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <Textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onClick={() => {
              console.log(user);
              if (!user) {
                alert('로그인이 필요합니다.');
                router.push('/signin');
                return;
              }
            }}
            placeholder="패션에 대해 마음대로 물어보세요! 예: '데이트룩 추천해줘'"
            className="
              w-full min-h-[60px] max-h-[120px] 
              text-lg px-6 py-4 
              bg-white border-2 border-blue-200 
              rounded-2xl 
              focus:border-blue-500 focus:ring-2 focus:ring-blue-200 
              resize-none
              placeholder:text-gray-400
              shadow-lg
            "
            disabled={isLoading}
          />
        </div>

        <div className="flex justify-center">
          <Button
            type="submit"
            disabled={!inputValue.trim() || isLoading}
            className="
              inline-flex items-center px-8 py-4 
              bg-blue text-beige-50 
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
                <LucideIcon name={'LoaderCircle'} color="beige-50" className="mr-3 w-5 h-5 animate-spin" />
                생성 중...
              </>
            ) : (
              <>
                <LucideIcon name={'Sparkles'} color="beige-50" className="mr-3 w-5 h-5" />
                채팅 시작하기
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
