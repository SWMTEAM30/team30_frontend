'use client';

import { useCallback, useEffect, useState } from 'react';
import { AppSidebar } from '@/components/AppSidebar';
import { SidebarInset } from '@/components/ui/sidebar';
import ChatHeader from '@/components/ChatHeader';
import ChatSubmit from '@/components/ChatSubmit';
import ChatArea from '@/components/ChatArea';
import { useChat } from '@/hooks/useChat';
import { useChatRooms } from '@/hooks/useChatRoom';
import ImagePanel from '@/components/ImagePanel';

export default function Chat() {
  const [inputValue, setInputValue] = useState<string>('');
  const [inputImage, setInputImage] = useState<MessageImage | undefined>(undefined);
  const [currentChatId, setCurrentChatId] = useState<number | null>(null);
  const [isAIResponding, setIsAIResponding] = useState<boolean>(false);
  const [hasUserSentMessage, setHasUserSentMessage] = useState<boolean>(false);
  const [openTabs, setOpenTabs] = useState<MessageImage[]>([]);
  const [activeTabId, setActiveTabId] = useState<string | null>(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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

  useEffect(() => {
    if (isSidebarOpen) {
      setIsPanelOpen(false);
    }
  }, [isSidebarOpen]);

  const sendMsg = useCallback(
    (inputValue: string, inputImage?: MessageImage) => {
      const userMessage: Message = {
        id: Date.now().toString(),
        text: inputValue,
        user: { userId: 'asdf', username: 'mindul' },
        images: inputImage && [inputImage],
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
    setInputImage(undefined);
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;
    setHasUserSentMessage(true);
    setIsAIResponding(true);
    sendMsg(inputValue, inputImage);
    setInputValue('');
    setInputImage(undefined);
  };

  const handleChatSelect = (chatId: number) => {
    setIsAIResponding(false);
    setHasUserSentMessage(false);
    setCurrentChatId(chatId);
    setInputImage(undefined);
  };

  const handleNewChat = () => {
    if (chatRoomError) return;
    setCurrentChatId(null);
    setIsAIResponding(false);
    setHasUserSentMessage(false);
    setInputImage(undefined);
  };

  const handleOpenTab = (newImageData: MessageImage) => {
    const isAlreadyOpen = openTabs.some((tab) => tab.src === newImageData.src);
    if (!isAlreadyOpen) {
      setOpenTabs((prevTabs) => [...prevTabs, newImageData]);
    }
    setActiveTabId(newImageData.src);
    setIsPanelOpen(true); // 이미지 클릭 시 패널 열기
  };

  // 3. 탭을 닫는 함수
  const handleCloseTab = (tabSrcToClose: string) => {
    const remainingTabs = openTabs.filter((tab) => tab.src !== tabSrcToClose);
    setOpenTabs(remainingTabs);
    if (activeTabId === tabSrcToClose) {
      if (remainingTabs.length > 0) {
        setActiveTabId(remainingTabs[remainingTabs.length - 1].src);
      } else {
        setActiveTabId(null);
      }
    }
  };

  const handleTogglePanel = () => {
    setIsPanelOpen(!isPanelOpen);
  };

  return (
    <div className="flex min-h-screen w-full relative">
      <div className="hidden lg:block">
        <AppSidebar
          currentChatId={currentChatId}
          onChatSelect={handleChatSelect}
          onNewChat={handleNewChat}
          chatRooms={chatRooms}
        />
      </div>
      <SidebarInset className="flex flex-col h-[100dvh] lg:transition-all lg:duration-300">
        <div className="flex flex-col h-full">
          <ChatHeader
            currentChatId={currentChatId}
            onChatSelect={handleChatSelect}
            onNewChat={handleNewChat}
            chatRooms={chatRooms}
            isSidebarOpen={isSidebarOpen}
            setIsSidebarOpen={setIsSidebarOpen}
            setIsPanelOpen={setIsPanelOpen}
          />
          <div className="flex-1 min-h-0">
            <ChatArea
              userID={'asdf'}
              messages={messages}
              isLoading={isChatLoading && messages.length === 0}
              isAIResponding={isAIResponding && hasUserSentMessage}
              examples={examples}
              onExampleSelect={handleExampleSelect}
              setSelectedImage={handleOpenTab}
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
      <ImagePanel
        isOpen={isPanelOpen}
        onToggle={handleTogglePanel}
        openTabs={openTabs}
        activeTabId={activeTabId}
        onTabSelect={setActiveTabId}
        onTabClose={handleCloseTab}
      />
    </div>
  );
}
