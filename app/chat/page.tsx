'use client';

import ChatHeader from '@/components/chat/ChatHeader';
import ClosetPanel from '@/components/chat/closet/ClosetPanel';
import FittingPanel from '@/components/chat/fitting/FittingPanel';
import ChatPanel from '@/components/chat/message/ChatPanel';
import { useAtomValue, useSetAtom } from 'jotai';
import { panelAtom } from '@/atoms/chatAtoms';
import { Suspense, useEffect } from 'react';

export default function Chat() {
  const panel = useAtomValue(panelAtom);
  const setPanel = useSetAtom(panelAtom);

  // md 이상일 때 panel이 'chat'이면 자동으로 'closet'으로 전환
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)');
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
          {panel === 'closet' && (
            <div className="hidden lg:flex flex-col h-full w-full lg:w-1/2 bg-beige border-l border-navy-200">
              <div className="flex-shrink-0">
                <ChatHeader />
              </div>
              <div className="flex-1 min-h-0">
                <ClosetPanel />
              </div>
            </div>
          )}
          {panel === 'fitting' && (
            <div className="hidden lg:flex flex-col h-full w-full lg:w-1/2 bg-beige border-l border-navy-200">
              <div className="flex-shrink-0">
                <ChatHeader />
              </div>
              <div className="flex-1 min-h-0">
                <FittingPanel />
              </div>
            </div>
          )}

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
