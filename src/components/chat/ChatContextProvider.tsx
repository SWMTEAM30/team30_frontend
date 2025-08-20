'use client';

import { useAtom, useAtomValue } from 'jotai';
import {
  inputValueAtom,
  inputProductAtom,
  currentChatIdAtom,
  isAIRespondingAtom,
  activePanelTypeAtom,
  imageTabsAtom,
  wikiTabsAtom,
  activeImageTabIdAtom,
  activeWikiTabIdAtom,
  isSidebarOpenAtom,
  messagesAtomFamily,
} from '@/atoms/chatAtoms';
import { ChangeEvent, createContext, ReactNode, useCallback, useContext, useEffect } from 'react';
import { useChatRooms } from '@/queries/useChatRoom';
import { useChatMessage } from '@/queries/useChatMessage';
import { userAtom } from '@/atoms/authAtoms';
import { tmpUserId, tmpUsername } from '@/queries/useUser';
import { postChatUpload, getChatRoomsRoomIdMessages, getChatProduct } from '@/api/chatAPI';

type ChatActionsContextType = {
  handleSendMessage: () => void;
  handleNewChat: () => void;
  handleChatSelect: (chatId: number) => void;
  handleExampleSelect: (exampleText: string) => void;
  handleOpenTab: (data: any, type: 'image' | 'wiki') => void;
  handleFileChange: (event: ChangeEvent<HTMLInputElement>) => void;
  handleCloseTab: (targetTabId: string) => void;
  setIsSidebarOpen: (isOpen: boolean) => void;
  addExistingMessages: (chatId: number | null, existingMessages: Message[]) => void;
};
const ChatActionsContext = createContext<ChatActionsContextType | undefined>(undefined);

export const useChatHandlers = () => {
  const context = useContext(ChatActionsContext);
  if (context === undefined) throw new Error('useChatActions must be used within a ChatProvider');
  return context;
};

export default function ChatContextProvider({ children }: { children: ReactNode }) {
  const [inputValue, setInputValue] = useAtom(inputValueAtom);
  const [inputProduct, setInputProduct] = useAtom(inputProductAtom);
  const [currentChatId, setCurrentChatId] = useAtom(currentChatIdAtom);
  const [isAIResponding, setIsAIResponding] = useAtom(isAIRespondingAtom);
  const [isSidebarOpen, setIsSidebarOpen] = useAtom(isSidebarOpenAtom);

  const [activePanelType, setActivePanelType] = useAtom(activePanelTypeAtom);
  const [imageTabs, setImageTabs] = useAtom(imageTabsAtom);
  const [wikiTabs, setWikiTabs] = useAtom(wikiTabsAtom);
  const [activeImageTabId, setActiveImageTabId] = useAtom(activeImageTabIdAtom);
  const [activeWikiTabId, setActiveWikiTabId] = useAtom(activeWikiTabIdAtom);

  const user = useAtomValue(userAtom);

  const { sendMessage, addExistingMessages } = useChatMessage();
  const { error: chatRoomError } = useChatRooms();
  const messages = useAtomValue(messagesAtomFamily(currentChatId));

  // AI 응답이 오면 스피너를 제거
  useEffect(() => {
    console.log('1', isAIResponding);
    if (messages.length > 0 && isAIResponding) {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage?.user) setIsAIResponding('style');
    }
  }, [messages, isAIResponding]);

  const resetAtomState = useCallback(() => {
    setIsAIResponding('');
    setInputValue('');
    setInputProduct(undefined);
  }, [setIsAIResponding, setInputValue, setInputProduct]);

  const sendMsg = useCallback(
    (inputValue: string, products?: Product) => {
      resetAtomState();
      setIsAIResponding('style');
      const userMessage: Message = {
        id: Date.now().toString(),
        content: inputValue,
        user: { userId: user?.userId || tmpUserId, username: user?.username || tmpUsername },
        agent: null,
        message_type: 'USER',
        products: products ? [products] : [],
        createdAt: new Date(),
      };
      sendMessage(userMessage);
      console.log('2', isAIResponding);
    },
    [currentChatId, sendMessage, setCurrentChatId, setIsAIResponding],
  );

  const handleExampleSelect = useCallback(
    (exampleText: string) => {
      sendMsg(exampleText);
    },
    [sendMsg],
  );

  const handleSendMessage = useCallback(() => {
    if (!inputValue.trim()) return;
    sendMsg(inputValue, inputProduct);
  }, [inputValue, inputProduct, sendMsg, setInputValue, setInputProduct]);

  const handleChatSelect = useCallback(
    async (chatId: number) => {
      const response = await getChatRoomsRoomIdMessages(chatId);
      if (response.status == 'fail') return;
      setCurrentChatId(chatId);
      addExistingMessages(chatId, response.data.messages);
      resetAtomState();
    },
    [setCurrentChatId, resetAtomState],
  );

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const formData = new FormData();
      formData.append('file', files[0]);
      const response = await postChatUpload(formData);
      if (response.status === 'fail') {
        console.error(response.message);
        return;
      }
      const newMessageImage: Product = {
        product_url: response.data,
        product_id: 'user',
      };
      setInputProduct(newMessageImage);
    }
  };

  const handleNewChat = useCallback(() => {
    if (chatRoomError) return;
    setCurrentChatId(null);
    resetAtomState();
  }, [chatRoomError, setCurrentChatId, resetAtomState]);

  const handleOpenTab = useCallback(
    (data: PanelData, type: 'image' | 'wiki') => {
      if (type === 'image') {
        setImageTabs((prevTabs) => {
          if (prevTabs.some((tab) => tab.src === data.src)) return prevTabs;
          return [...prevTabs, data];
        });
        setActiveImageTabId(data.src);
      } else {
        setWikiTabs((prevTabs) => {
          if (prevTabs.some((tab) => tab.src === data.src)) return prevTabs;
          return [...prevTabs, data];
        });
        setActiveWikiTabId(data.src);
      }
      setActivePanelType(type);
    },
    [setImageTabs, setActiveImageTabId, setWikiTabs, setActiveWikiTabId, setActivePanelType],
  );

  const handleCloseTab = useCallback(
    (targetTabId: string) => {
      // ✨ if 블록 안에서는 모든 변수가 'image' 관련 타입임이 보장됩니다.
      if (activePanelType === 'image') {
        const remainingTabs = imageTabs.filter((tab) => tab.src !== targetTabId);
        setImageTabs(remainingTabs);

        if (activeImageTabId === targetTabId) {
          if (remainingTabs.length > 0) {
            setActiveImageTabId(remainingTabs[remainingTabs.length - 1].src);
          } else {
            setActiveImageTabId(null);
            setActivePanelType(null);
          }
        }
      }
      // ✨ else 블록 안에서는 모든 변수가 'wiki' 관련 타입임이 보장됩니다.
      else if (activePanelType === 'wiki') {
        const remainingTabs = wikiTabs.filter((tab) => tab.src !== targetTabId);
        setWikiTabs(remainingTabs);

        if (activeWikiTabId === targetTabId) {
          if (remainingTabs.length > 0) {
            setActiveWikiTabId(remainingTabs[remainingTabs.length - 1].src);
          } else {
            setActiveWikiTabId(null);
            setActivePanelType(null);
          }
        }
      }
    },
    [
      activePanelType,
      imageTabs,
      setImageTabs,
      activeImageTabId,
      setActiveImageTabId,
      handleFileChange,
      wikiTabs,
      setWikiTabs,
      activeWikiTabId,
      setActiveWikiTabId,
      setActivePanelType,
    ],
  );

  const actionsValue: ChatActionsContextType = {
    handleExampleSelect,
    handleSendMessage,
    handleChatSelect,
    handleFileChange,
    handleNewChat,
    handleOpenTab,
    handleCloseTab,
    setIsSidebarOpen,
    addExistingMessages,
  };

  return <ChatActionsContext.Provider value={actionsValue}>{children}</ChatActionsContext.Provider>;
}
