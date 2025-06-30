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
  const [inputValue, setInputValue] = useState('');
  const [currentChatId, setCurrentChatId] = useState<string>('');

  /** chat state 관리하는 hook */
  const { messages, isLoading: isChatLoading, sendMessage } = useChat(currentChatId);
  const { rooms: chatRooms, isLoading: isRoomsLoading, createChat, isCreating } = useChatRooms();

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      user: { user_id: 'asdf', username: 'mindul' },
      timestamp: new Date(),
    };

    sendMessage(userMessage);
    setInputValue('');
  };

  const handleChatSelect = (chatId: string) => {
    setCurrentChatId(chatId);
  };

  useEffect(() => {
    if (!currentChatId && chatRooms.length > 0) {
      setCurrentChatId(chatRooms[0].id);
    }
  }, [chatRooms, currentChatId]);

  const handleNewChat = () => {
    createChat(undefined, {
      onSuccess: (newRoom) => {
        setCurrentChatId(newRoom.id);
      },
    });
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
              <ChatArea messages={messages} isLoading={isChatLoading && messages.length === 0} />
            </div>
            <ChatSubmit inputValue={inputValue} setInputValue={setInputValue} handleSendMessage={handleSendMessage} />
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
