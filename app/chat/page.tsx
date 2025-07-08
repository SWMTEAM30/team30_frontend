'use client';

import { useEffect, useState } from 'react';
import { AppSidebar } from '@/components/AppSidebar';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import ChatHeader from '@/components/ChatHeader';
import ChatSubmit from '@/components/ChatSubmit';
import ChatArea from '@/components/ChatArea';
import { useChat } from '@/hooks/useChat';
import { useChatRooms } from '@/hooks/useChatRoom';

export default function Chat() {
  const [inputValue, setInputValue] = useState<string>('');
  const [currentChatId, setCurrentChatId] = useState<number | null>(null);
  const [isAIResponding, setIsAIResponding] = useState<boolean>(false);
  const [hasUserSentMessage, setHasUserSentMessage] = useState<boolean>(false);

  /** chat state 관리하는 hook */
  const { messages, isLoading: isChatLoading, sendMessage, addMessageToCache } = useChat(currentChatId);
  const { rooms: chatRooms, error: chatRoomError } = useChatRooms();

  // AI 응답이 오면 스피너를 숨기는 효과
  useEffect(() => {
    if (messages.length > 0 && hasUserSentMessage) {
      const lastMessage = messages[messages.length - 1];
      // 마지막 메시지가 AI 응답이면 스피너 숨김
      if (lastMessage && lastMessage.user.userId !== 'asdf') {
        setIsAIResponding(false);
      }
    }
  }, [messages, hasUserSentMessage]);

  const handleNewChat = () => {
    if (chatRoomError) return;
    setCurrentChatId(null);
    setIsAIResponding(false);
    setHasUserSentMessage(false);
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      user: { userId: 'asdf', username: 'mindul' },
      timestamp: new Date(),
    };

    // 사용자가 메시지를 보냈다고 표시
    setHasUserSentMessage(true);

    // 사용자 메시지를 즉시 캐시에 추가

    // AI 응답 준비 중 상태로 설정
    setIsAIResponding(true);

    sendMessage(
      { roomId: currentChatId, newMessage: userMessage },
      {
        onSuccess: (responseFromServer) => {
          if (responseFromServer.ok) {
            addMessageToCache(userMessage, responseFromServer.data);
            if (currentChatId == null) setCurrentChatId(responseFromServer.data);
          }
        },
        onError: () => {
          // 에러 발생 시에도 스피너 숨김
          setIsAIResponding(false);
        },
      },
    );
    setInputValue('');
  };

  const handleChatSelect = (chatId: number) => {
    setCurrentChatId(chatId);
    setIsAIResponding(false);
    setHasUserSentMessage(false);
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen w-full relative">
        <AppSidebar
          currentChatId={currentChatId}
          onChatSelect={handleChatSelect}
          onNewChat={handleNewChat}
          chatRooms={chatRooms}
        />
        <SidebarInset className="flex flex-col h-[100dvh] md:pl-16 md:transition-all md:duration-300">
          <div className="flex flex-col h-full">
            <ChatHeader chatId={currentChatId} />
            <div className="flex-1 min-h-0">
              <ChatArea
                userID={'asdf'}
                messages={messages}
                isLoading={isChatLoading && messages.length === 0}
                isAIResponding={isAIResponding && hasUserSentMessage}
              />
            </div>
            <ChatSubmit inputValue={inputValue} setInputValue={setInputValue} handleSendMessage={handleSendMessage} />
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
