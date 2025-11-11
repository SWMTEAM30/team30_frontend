'use client';

import ChatMenu from '@/components/chat/ChatMenu';
import ClosetPanel from '@/components/chat/closet/ClosetPanel';
import FittingPanel from '@/components/chat/fitting/FittingPanel';
import ChatPanel from '@/components/chat/message/ChatPanel';
import { useAtomValue, useSetAtom } from 'jotai';
import { panelAtom, roomIdAtom } from '@/atoms/chatAtoms';
import { Suspense, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { postChatRooms } from '@/api/chatAPI';
import JsonLd from '@/components/seo/JsonLd';
import { createSoftwareApplicationSchema } from '@/lib/schema';

export default function Chat() {
  const softwareApplicationSchema = createSoftwareApplicationSchema(
    'The First Take - AI 패션 채팅',
    'AI 패션 어시스턴트와 실시간으로 대화하며 맞춤형 스타일 추천을 받아보세요.',
    'https://the-first-take.com/chat',
    '/TFT_icon.png'
  );
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
      <JsonLd data={softwareApplicationSchema} />
      <main className="flex flex-col">
        {/* 모바일/태블릿에서는 상단에 메뉴 표시 */}
        <nav className="lg:hidden">
          <ChatMenu />
        </nav>
        <div className="flex h-[calc(100vh-5rem)] lg:h-[100vh] min-[1440px]:pl-28">
          {/* 데스크톱: 좌우 분할 레이아웃 */}
          <section className="hidden lg:flex w-full lg:w-1/2 h-full lg:transition-all lg:duration-300">
            <ChatPanel />
          </section>

          <aside className="hidden lg:flex flex-col h-full w-full lg:w-1/2 border-l border-navy-200">
            <nav className="flex-shrink-0">
              <ChatMenu />
            </nav>
            <div className="flex-1 min-h-0">
              {panel === 'closet' && <ClosetPanel />}
              {panel === 'fitting' && <FittingPanel />}
            </div>
          </aside>

          {/* 모바일/태블릿: 단일 패널 레이아웃 */}
          <section className="lg:hidden w-full h-[calc(100vh-5rem)] min-[1440px]:h-[100vh]">
            {panel === 'chat' && <ChatPanel />}
            {panel === 'closet' && <ClosetPanel />}
            {panel === 'fitting' && <FittingPanel />}
          </section>
        </div>
      </main>
    </Suspense>
  );
}
