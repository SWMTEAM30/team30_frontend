'use client';

import { useAtom, Provider as JotaiProvider, useSetAtom } from 'jotai';
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
import { createContext, ReactNode, useCallback, useContext, useEffect, useState } from 'react';
import { useChatRooms } from '@/queries/useChatRoom';
import { useChatMessage } from '@/queries/useChatMessage';

type ChatActionsContextType = {
  handleSendMessage: () => void;
  handleNewChat: () => void;
  handleChatSelect: (chatId: number) => void;
  handleExampleSelect: (exampleText: string) => void;
  handleOpenTab: (data: any, type: 'image' | 'wiki') => void;
  handleCloseTab: (targetTabId: string) => void;
  setIsSidebarOpen: (isOpen: boolean) => void;
};
const ChatActionsContext = createContext<ChatActionsContextType | undefined>(undefined);

export const useChatHandlers = () => {
  const context = useContext(ChatActionsContext);
  if (context === undefined) throw new Error('useChatActions must be used within a ChatProvider');
  return context;
};

const ChatLogicProvider = ({ children }: { children: ReactNode }) => {
  const [inputValue, setInputValue] = useAtom(inputValueAtom);
  const [inputImage, setInputImage] = useAtom(inputImageAtom);
  const [currentChatId, setCurrentChatId] = useAtom(currentChatIdAtom);
  const [hasUserSentMessage, setHasUserSentMessage] = useAtom(hasUserSentMessageAtom);
  const [isAIResponding, setIsAIResponding] = useAtom(isAIRespondingAtom);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [activePanelType, setActivePanelType] = useAtom(activePanelTypeAtom);
  const [imageTabs, setImageTabs] = useAtom(imageTabsAtom);
  const [wikiTabs, setWikiTabs] = useAtom(wikiTabsAtom);
  const [activeImageTabId, setActiveImageTabId] = useAtom(activeImageTabIdAtom);
  const [activeWikiTabId, setActiveWikiTabId] = useAtom(activeWikiTabIdAtom);

  const { messages, examples, isLoading, sendMessage, addMessageToCache } = useChatMessage();
  const { rooms: chatRooms, error: chatRoomError } = useChatRooms();

  // AI 응답이 오면 스피너를 제거
  useEffect(() => {
    if (messages.length > 0 && hasUserSentMessage) {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage && lastMessage.user.userId !== 'asdf') {
        setIsAIResponding(false);
      }
    }
  }, [messages, hasUserSentMessage]);

  const sendMsg = useCallback(
    (inputValue: string, inputImage?: MessageImage) => {
      resetAtomState(true);
      console.log(isAIResponding);
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
    [currentChatId, sendMessage, addMessageToCache, setCurrentChatId, setIsAIResponding, setHasUserSentMessage],
  );

  const resetAtomState = useCallback(
    (flag: boolean) => {
      setHasUserSentMessage(flag);
      setIsAIResponding(flag);
      setInputValue('');
      setInputImage(undefined);
    },
    [setHasUserSentMessage, setIsAIResponding, setInputValue, setInputImage],
  );

  const handleExampleSelect = useCallback(
    (exampleText: string) => {
      sendMsg(exampleText);
    },
    [sendMsg],
  );

  const handleSendMessage = useCallback(() => {
    if (!inputValue.trim()) return;
    sendMsg(inputValue, inputImage);
  }, [inputValue, inputImage, sendMsg, setInputValue, setInputImage]);

  const handleChatSelect = useCallback(
    (chatId: number) => {
      setCurrentChatId(chatId);
      resetAtomState(false);
    },
    [setCurrentChatId, resetAtomState],
  );

  const handleNewChat = useCallback(() => {
    if (chatRoomError) return;
    setCurrentChatId(null);
    resetAtomState(false);
  }, [chatRoomError, setCurrentChatId, resetAtomState]);

  const handleOpenTab = useCallback(
    (data: any, type: 'image' | 'wiki') => {
      if (type === 'image') {
        setImageTabs((prevTabs) => {
          if (prevTabs.some((tab) => tab.id === data.id)) return prevTabs;
          return [...prevTabs, data];
        });
        setActiveImageTabId(data.id);
      } else {
        setWikiTabs((prevTabs) => {
          if (prevTabs.some((tab) => tab.id === data.id)) return prevTabs;
          return [...prevTabs, data];
        });
        setActiveWikiTabId(data.id);
      }
      setActivePanelType(type);
    },
    [setImageTabs, setActiveImageTabId, setWikiTabs, setActiveWikiTabId, setActivePanelType],
  );

  const handleCloseTab = useCallback(
    (targetTabId: string) => {
      const isImageType = activePanelType === 'image';
      const currentTabs = isImageType ? imageTabs : wikiTabs;
      const setCurrentTabs = isImageType ? setImageTabs : setWikiTabs;
      const activeTabId = isImageType ? activeImageTabId : activeImageTabId;
      const setActiveTabId = isImageType ? setActiveImageTabId : setActiveWikiTabId;

      const remainingTabs = currentTabs.filter((tab) => tab.src !== targetTabId);
      setCurrentTabs(remainingTabs);

      if (activeTabId === targetTabId) {
        if (remainingTabs.length > 0) {
          setActiveTabId(remainingTabs[remainingTabs.length - 1].src);
        } else {
          setActiveTabId(null);
          setActivePanelType(null);
        }
      }
    },
    [
      activePanelType,
      imageTabs,
      setImageTabs,
      activeImageTabId,
      setActiveImageTabId,
      wikiTabs,
      setWikiTabs,
      activeWikiTabId,
      setActiveWikiTabId,
    ],
  );

  const actionsValue: ChatActionsContextType = {
    handleExampleSelect,
    handleSendMessage,
    handleChatSelect,
    handleNewChat,
    handleOpenTab,
    handleCloseTab,
    setIsSidebarOpen,
  };

  return <ChatActionsContext.Provider value={actionsValue}>{children}</ChatActionsContext.Provider>;
};

// 최종적으로 export할 Provider
export const ChatProvider = ({ children }: { children: ReactNode }) => {
  return (
    <JotaiProvider>
      <ChatLogicProvider>{children}</ChatLogicProvider>
    </JotaiProvider>
  );
};
