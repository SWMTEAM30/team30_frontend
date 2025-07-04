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

  /** chat state 관리하는 hook */
  const { messages, isLoading: isChatLoading, sendMessage } = useChat(currentChatId);
  const { rooms: chatRooms, error: chatRoomError } = useChatRooms();

  useEffect(() => {
    if (currentChatId && chatRooms.length > 0) {
      console.log(chatRooms);
    }
  }, [chatRooms, currentChatId]);

  const handleNewChat = () => {
    if (chatRoomError) return;
    setCurrentChatId(null);
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      user: { userId: 'asdf', username: 'mindul' },
      timestamp: new Date(),
    };

    sendMessage(
      { roomId: currentChatId, newMessage: userMessage },
      {
        onSuccess: (responseFromServer) => {
          if (!currentChatId && responseFromServer.ok) {
            setCurrentChatId(responseFromServer.data);
          }
        },
      },
    );
    setInputValue('');
  };

  const handleChatSelect = (chatId: number) => {
    setCurrentChatId(chatId);
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
              <ChatArea userID={'asdf'} messages={messages} isLoading={isChatLoading && messages.length === 0} />
            </div>
            <ChatSubmit inputValue={inputValue} setInputValue={setInputValue} handleSendMessage={handleSendMessage} />
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
