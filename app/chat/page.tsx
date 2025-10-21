'use client';

import ChatHeader from '@/components/chat/ChatHeader';
import ClosetPanel from '@/components/chat/closet/ClosetPanel';
import FittingPanel from '@/components/chat/fitting/FittingPanel';
import ChatPanel from '@/components/chat/message/ChatPanel';
import { useAtomValue, useSetAtom } from 'jotai';
import { panelAtom, roomIdAtom } from '@/atoms/chatAtoms';
import { Suspense, useEffect } from 'react';
import { userAtom } from '@/atoms/authAtoms';
import { useRouter } from 'next/navigation';
import { postChatRooms } from '@/api/chatAPI';
import { useAuthCheck } from '@/hooks/useAuthCheck';
import { getAuthCookie, getAuthJWT, isValidJWT, getUserFromJWT } from '@/lib/auth';
import { getAuthMe, postAuthRefresh } from '@/api/authAPI';

export default function Chat() {
  const panel = useAtomValue(panelAtom);
  const setPanel = useSetAtom(panelAtom);
  const user = useAtomValue(userAtom);
  const router = useRouter();
  const setRoomId = useSetAtom(roomIdAtom);
  const { isAuthenticated, isChecking, checkAuth } = useAuthCheck();

  // Auth 관련 정보를 콘솔에 출력
  useEffect(() => {
    const logAuthInfo = async () => {
      console.log('=== AUTH 정보 확인 (단방향) ===');
      
      // 1. Jotai 상태 확인
      console.log('🔹 Jotai User State:', user);
      console.log('🔹 isChecking:', isChecking);
      
      // 2. 서버 API 기반 인증 확인
      const authStatus = await isAuthenticated();
      console.log('🔹 isAuthenticated (서버 API 기반):', authStatus);
      
      // 3. 쿠키에서 JWT 토큰 확인
      try {
        const jwtToken = await getAuthJWT();
        console.log('🔹 JWT Token:', jwtToken ? '존재함' : '없음');
        
        if (jwtToken) {
          console.log('🔹 JWT 유효성:', isValidJWT(jwtToken));
          const userFromJWT = getUserFromJWT(jwtToken);
          console.log('🔹 JWT에서 추출한 사용자:', userFromJWT);
        }
        
        const userFromCookie = await getAuthCookie();
        console.log('🔹 쿠키에서 가져온 사용자:', userFromCookie);
      } catch (error) {
        console.log('🔹 Auth 확인 중 오류:', error);
      }
      
      console.log('=== AUTH 정보 확인 완료 ===');
    };
    
    logAuthInfo();
  }, [user, isChecking, isAuthenticated]);

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
