'use client';

import { useAtom, useAtomValue } from 'jotai';
import {
  inputValueAtom,
  inputProductAtom,
  currentChatIdAtom,
  isAIRespondingAtom,
  isSidebarOpenAtom,
  messagesAtomFamily,
} from '@/atoms/chatAtoms';
import { useCallback, useEffect } from 'react';
import { useChatRooms } from '@/queries/useChatRoom';
import { useChatMessage } from '@/queries/useChatMessage';
import { userAtom } from '@/atoms/authAtoms';
import { tmpUserId, tmpUsername } from '@/queries/useUser';
import { getChatRoomsRoomIdMessages } from '@/api/chatAPI';

type ChatActionsContextType = {
  sendMsg: (inputValue: string, products?: Product) => void;
  handleNewChat: () => void;
  handleChatSelect: (chatId: number) => void;
  handleExampleSelect: (exampleText: string) => void;
  setIsSidebarOpen: (isOpen: boolean) => void;
  addExistingMessages: (chatId: number | null, existingMessages: Message[]) => void;
};

export function useChatHandlers() {
  const [inputValue, setInputValue] = useAtom(inputValueAtom);
  const [inputProduct, setInputProduct] = useAtom(inputProductAtom);
  const [currentChatId, setCurrentChatId] = useAtom(currentChatIdAtom);
  const [isAIResponding, setIsAIResponding] = useAtom(isAIRespondingAtom);
  const [isSidebarOpen, setIsSidebarOpen] = useAtom(isSidebarOpenAtom);

  const user = useAtomValue(userAtom);

  const { sendMessage, addExistingMessages } = useChatMessage();
  const { error: chatRoomError } = useChatRooms();
  const messages = useAtomValue(messagesAtomFamily(currentChatId));

  // AI 응답이 오면 스피너를 제거
  useEffect(() => {
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
    },
    [currentChatId, sendMessage, setCurrentChatId, setIsAIResponding],
  );

  const handleExampleSelect = useCallback(
    (exampleText: string) => {
      sendMsg(exampleText);
    },
    [sendMsg],
  );

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

  const handleNewChat = useCallback(() => {
    if (chatRoomError) return;
    setCurrentChatId(null);
    resetAtomState();
  }, [chatRoomError, setCurrentChatId, resetAtomState]);

  const actionsValue: ChatActionsContextType = {
    sendMsg,
    handleExampleSelect,
    handleChatSelect,
    handleNewChat,
    setIsSidebarOpen,
    addExistingMessages,
  };

  return actionsValue;
}
