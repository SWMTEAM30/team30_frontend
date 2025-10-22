'use client';

import ChatHeader from '@/components/chat/ChatHeader';
import ClosetPanel from '@/components/chat/closet/ClosetPanel';
import FittingPanel from '@/components/chat/fitting/FittingPanel';
import ChatPanel from '@/components/chat/message/ChatPanel';
import { useAtom } from 'jotai';
import { panelAtom, roomIdAtom, tempMessageAtom } from '@/atoms/chatAtoms';
import { Suspense, useEffect } from 'react';
import { useChatStream } from '@/hooks/useChatStream';
import CodinationPanel from '@/components/chat/codination/CodinationPanel';

interface ChatRoomPageProps {
  params: Promise<{
    roomId: string;
  }>;
}

export default function ChatRoomPage({ params }: ChatRoomPageProps) {
  const [panel, setPanel] = useAtom(panelAtom);
  const [roomId, setRoomId] = useAtom(roomIdAtom);
  const [tempMessage, setTempMessage] = useAtom(tempMessageAtom);
  const { mutate } = useChatStream();

  // params에서 roomId 추출
  useEffect(() => {
    params.then((resolvedParams) => {
      setRoomId(resolvedParams.roomId);
    });
  }, [params, setRoomId]);

  // roomId가 변경되고 나서 리셋해야 함
  useEffect(() => {
    if (tempMessage?.roomId != roomId || !tempMessage?.userMessage) return;
    mutate({ inputValue: tempMessage.userMessage });
    setTempMessage(null);
  }, [roomId]);

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
              {panel === 'codination' && <CodinationPanel />}
              {panel === 'fitting' && <FittingPanel />}
            </div>
          </div>

          {/* 모바일/태블릿: 단일 패널 레이아웃 */}
          <div className="lg:hidden w-full h-[calc(100vh-5rem)]">
            {panel === 'chat' && <ChatPanel />}
            {panel === 'closet' && <ClosetPanel />}
            {panel === 'codination' && <CodinationPanel />}
            {panel === 'fitting' && <FittingPanel />}
          </div>
        </div>
      </div>
    </Suspense>
  );
}
