'use client';

import ChatHeader from '@/components/chat/ChatHeader';
import ClosetPanel from '@/components/chat/closet/ClosetPanel';
import FittingPanel from '@/components/chat/fitting/FittingPanel';
import ChatPanel from '@/components/chat/message/ChatPanel';
import { useAtomValue, useSetAtom } from 'jotai';
import { panelAtom, roomIdAtom } from '@/atoms/chatAtoms';
import { Suspense, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { postChatRooms } from '@/api/chatAPI';

export default function Chat() {
  const panel = useAtomValue(panelAtom);
  const setPanel = useSetAtom(panelAtom);
  const router = useRouter();
  const setRoomId = useSetAtom(roomIdAtom);

  // 새로운 채팅방 생성
  useEffect(() => {
    const createNewRoom = async () => {
      try {
        const response = await postChatRooms();
        if (response.status === 'success' && response.data) {
          console.log('Creating new room:', response.data.id);
          setRoomId(response.data.id);
          router.push(`/chat/${response.data.id}`);
        } else {
          console.error('Failed to create chat room:', response.message);
        }
      } catch (error) {
        console.error('Error creating chat room:', error);
      }
    };

    createNewRoom();
  }, [router, setRoomId]);

  // lg 이상일 때 panel이 'chat'이면 자동으로 'closet'으로 전환
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)');
    const enforceDesktopPanel = (matches: boolean) => {
      if (matches && panel === 'chat') {
        setPanel('closet');
      }
    };

    // 초기 상태에서도 한 번 체크
    enforceDesktopPanel(mq.matches);

    const handler = (e: MediaQueryListEvent) => enforceDesktopPanel(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, [panel, setPanel]);

  return (
    <Suspense>
      <div className="flex flex-col">
        {/* 모바일/태블릿에서는 상단에 헤더 표시 */}
        <div className="lg:hidden">
          <ChatHeader />
        </div>
        <div className="flex h-[calc(100vh-5rem)] lg:h-[100vh]">
          {/* 데스크톱: 좌우 분할 레이아웃 */}
          <div className="hidden lg:flex w-full lg:w-1/2 h-full lg:transition-all lg:duration-300">
            <ChatPanel />
          </div>

          <div className="hidden lg:flex flex-col h-full w-full lg:w-1/2 border-l border-navy-200">
            <div className="flex-shrink-0">
              <ChatHeader />
            </div>
            <div className="flex-1 min-h-0">
              {panel === 'closet' && <ClosetPanel />}
              {panel === 'fitting' && <FittingPanel />}
            </div>
          </div>

          {/* 모바일/태블릿: 단일 패널 레이아웃 */}
          <div className="lg:hidden w-full h-[calc(100vh-5rem)]">
            {panel === 'chat' && <ChatPanel />}
            {panel === 'closet' && <ClosetPanel />}
            {panel === 'fitting' && <FittingPanel />}
          </div>
        </div>
      </div>
    </Suspense>
  );
}
