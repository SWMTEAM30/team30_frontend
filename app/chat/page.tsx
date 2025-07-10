'use client';

import { useCallback, useEffect, useState } from 'react';
import { AppSidebar } from '@/components/AppSidebar';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import ChatHeader from '@/components/ChatHeader';
import ChatSubmit from '@/components/ChatSubmit';
import ChatArea from '@/components/ChatArea';
import { useChat } from '@/hooks/useChat';
import { useChatRooms } from '@/hooks/useChatRoom';

export default function Chat() {
  const [inputValue, setInputValue] = useState<string>('');
  const [inputImage, setInputImage] = useState<MessageImage[]>([]);
  const [currentChatId, setCurrentChatId] = useState<number | null>(null);
  const [isAIResponding, setIsAIResponding] = useState<boolean>(false);
  const [hasUserSentMessage, setHasUserSentMessage] = useState<boolean>(false);

  /** chat state 관리하는 hook */
  const { messages, examples, isLoading: isChatLoading, sendMessage, addMessageToCache } = useChat(currentChatId);
  const { rooms: chatRooms, error: chatRoomError } = useChatRooms();

  // AI 응답이 오면 스피너를 숨기는 효과
  useEffect(() => {
    if (messages.length > 0 && hasUserSentMessage) {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage && lastMessage.user.userId !== 'asdf') setIsAIResponding(false);
    }
  }, [messages, hasUserSentMessage]);

  const sendMsg = useCallback(
    (inputValue: string, inputImage?: MessageImage[]) => {
      const userMessage: Message = {
        id: Date.now().toString(),
        text: inputValue,
        user: { userId: 'asdf', username: 'mindul' },
        images: inputImage,
        timestamp: new Date(),
      };

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
            setIsAIResponding(false); // 에러 발생 시에도 스피너 숨김
          },
        },
      );
    },
    [inputValue],
  );

  const handleExampleSelect = (exampleText: string) => {
    setHasUserSentMessage(true);
    setIsAIResponding(true);
    sendMsg(exampleText);
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;
    setHasUserSentMessage(true);
    setIsAIResponding(true);
    sendMsg(inputValue, inputImage);
    setInputValue('');
  };

  const handleChatSelect = (chatId: number) => {
    setIsAIResponding(false);
    setHasUserSentMessage(false);
    setCurrentChatId(chatId);
  };

  const handleNewChat = () => {
    if (chatRoomError) return;
    setCurrentChatId(null);
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
                examples={examples}
                onExampleSelect={handleExampleSelect}
              />
            </div>
            <ChatSubmit
              inputValue={inputValue}
              setInputValue={setInputValue}
              inputImage={inputImage}
              setInputImage={setInputImage}
              handleSendMessage={handleSendMessage}
            />
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
