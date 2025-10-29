'use client';

import ChatMenu from '@/components/chat/ChatMenu';
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
  }, [roomId, mutate, setTempMessage, tempMessage?.roomId, tempMessage?.userMessage]);


  return (
    <Suspense>
      <div className="flex flex-col">
        {/* 상단에 메뉴 표시 */}
        <div>
          <ChatMenu />
        </div>
        <div className="flex h-[100vh] min-[1440px]:pl-28">
          {/* 단일 패널 레이아웃 */}
          <div className="w-full h-[calc(100vh-4.1rem)] min-[1440px]:h-[100vh]">
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
