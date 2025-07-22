'use client';

import { useCallback, useEffect, useState } from 'react';
import { ChatSidebar } from '@/components/ChatSidebar';
import { SidebarInset } from '@/components/ui/sidebar';
import ChatHeader from '@/components/ChatHeader';
import ChatSubmit from '@/components/ChatSubmit';
import ChatArea from '@/components/ChatArea';
import { useChat } from '@/hooks/useChat';
import { useChatRooms } from '@/hooks/useChatRoom';
import { ChevronLeft } from 'lucide-react';
import SidePanel from '@/components/SidePanel';
import { useAtom, Provider, useSetAtom } from 'jotai';
import {
  inputValueAtom,
  inputImageAtom,
  currentChatIdAtom,
  isAIRespondingAtom,
  hasUserSentMessageAtom,
  activePanelTypeAtom,
  imageTabsAtom,
  wikiTabsAtom,
  activeImageTabIdAtom,
  activeWikiTabIdAtom,
} from '@/atoms/chatAtoms';

export default function Chat() {
  const [inputValue, setInputValue] = useAtom(inputValueAtom);
  const [inputImage, setInputImage] = useAtom(inputImageAtom);
  const [currentChatId, setCurrentChatId] = useAtom(currentChatIdAtom);
  const [hasUserSentMessage, setHasUserSentMessage] = useAtom(hasUserSentMessageAtom);
  const setIsAIResponding = useSetAtom(isAIRespondingAtom);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [activePanelType, setActivePanelType] = useAtom(activePanelTypeAtom);
  const [imageTabs, setImageTabs] = useAtom(imageTabsAtom);
  const [wikiTabs, setWikiTabs] = useAtom(wikiTabsAtom);
  const [activeImageTabId, setActiveImageTabId] = useAtom(activeImageTabIdAtom);
  const [activeWikiTabId, setActiveWikiTabId] = useAtom(activeWikiTabIdAtom);

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

  const handleOpenTab = (data: any, type: 'image' | 'wiki') => {
    if (type === 'image') {
      if (!imageTabs.some((tab) => tab.id === data.id)) setImageTabs((prev) => [...prev, data]);
      setActiveImageTabId(data.id);
    } else {
      if (!wikiTabs.some((tab) => tab.id === data.id)) setWikiTabs((prev) => [...prev, data]);
      setActiveWikiTabId(data.id);
    }

    setActivePanelType(type); // 해당 종류의 패널을 엽니다.
  };

  const handleCloseTab = (targetTabId: string) => {
    if (activePanelType === 'image') {
      const remainingTabs = imageTabs.filter((tab) => tab.src !== targetTabId);
      setImageTabs(remainingTabs);
      if (activeImageTabId === targetTabId) {
        if (remainingTabs.length > 0) setActiveImageTabId(remainingTabs[remainingTabs.length - 1].src);
        else setActiveImageTabId(null);
      }
    } else {
      const remainingTabs = wikiTabs.filter((tab) => tab.src !== targetTabId);
      setWikiTabs(remainingTabs);
      if (activeWikiTabId === targetTabId) {
        if (remainingTabs.length > 0) setActiveWikiTabId(remainingTabs[remainingTabs.length - 1].src);
        else setActiveWikiTabId(null);
      }
    }
  };

  return (
    <Provider>
      <div className="flex min-h-screen w-full relative">
        <div className="hidden lg:block">
          <ChatSidebar onChatSelect={handleChatSelect} onNewChat={handleNewChat} chatRooms={chatRooms} />
        </div>
        <SidebarInset className="flex flex-col h-[100dvh] lg:transition-all lg:duration-300">
          <div className="flex flex-col h-full">
            <ChatHeader
              onChatSelect={handleChatSelect}
              onNewChat={handleNewChat}
              chatRooms={chatRooms}
              setIsSidebarOpen={setIsSidebarOpen}
            />
            <div className="flex-1 min-h-0">
              <ChatArea
                userID={'asdf'}
                messages={messages}
                isLoading={isChatLoading && messages.length === 0}
                examples={examples}
                onExampleSelect={handleExampleSelect}
                setSelectedImage={handleOpenTab}
              />
            </div>
            <ChatSubmit handleSendMessage={handleSendMessage} />
          </div>
        </SidebarInset>
        <div
          className={`fixed top-0 right-0 h-full bg-beige border-l border-gray-200 shadow-xl z-40 
                 flex flex-row transition-transform duration-500 ease-in-out
                 ${activePanelTypeAtom != null ? 'translate-x-0' : 'translate-x-full'}`}
        >
          <button
            onClick={() => {
              if (activePanelType == 'image') setActivePanelType(null);
              else setActivePanelType('image');
            }}
            className="absolute top-36 -translate-y-1/2 left-0 h-36 -translate-x-full z-20 bg-beige p-2 rounded-l-lg border border-gray-200 hover:bg-gray-100 transition-colors"
            title={activePanelType === 'image' ? '패널 닫기' : '패널 열기'}
          >
            <ChevronLeft
              size={20}
              className={`transition-transform duration-300 ${activePanelType === 'image' ? 'rotate-180' : 'rotate-0'}`}
            />
          </button>
          <button
            onClick={() => {
              if (activePanelType == 'wiki') setActivePanelType(null);
              else setActivePanelType('wiki');
            }}
            className="absolute top-72 -translate-y-1/2 left-0 h-36 -translate-x-full z-20 bg-beige p-2 rounded-l-lg border border-gray-200 hover:bg-gray-100 transition-colors"
            title={activePanelType === 'wiki' ? '패널 닫기' : '패널 열기'}
          >
            <ChevronLeft
              size={20}
              className={`transition-transform duration-300 ${activePanelType === 'wiki' ? 'rotate-180' : 'rotate-0'}`}
            />
          </button>
          <SidePanel
            className={`${activePanelType === 'wiki' ? '-translate-x-full' : 'translate-x-full'}`}
            openTabs={[]}
            activeTabId={null}
            onTabSelect={function (id: string): void {
              throw new Error('Function not implemented.');
            }}
            onTabClose={function (id: string): void {
              throw new Error('Function not implemented.');
            }}
          />
        </div>
      </div>
    </Provider>
  );
}
