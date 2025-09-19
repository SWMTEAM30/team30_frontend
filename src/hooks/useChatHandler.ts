'use client';

import { useAtomValue, useSetAtom } from 'jotai';
import { inputValueAtom, inputProductAtom, messagesAtomFamily, roomIdAtom } from '@/atoms/chatAtoms';
import { useCallback } from 'react';
import { userAtom } from '@/atoms/authAtoms';
import { tmpUserId, tmpUsername } from '@/queries/useUser';
import { postChatSend } from '@/api/chatAPI';

export function useChatHandlers(): {
  sendMessage: (inputValue: string, products?: Product) => void;
  handleExampleSelect: (exampleText: string) => void;
} {
  const roomId = useAtomValue(roomIdAtom);
  const setMessages = useSetAtom(messagesAtomFamily(roomId));
  const setInputValue = useSetAtom(inputValueAtom);
  const setInputProduct = useSetAtom(inputProductAtom);
  const user = useAtomValue(userAtom);

  const resetAtomState = useCallback(() => {
    setInputValue('');
    setInputProduct(undefined);
  }, [setInputValue, setInputProduct]);

  const sendMessage = useCallback(
    async (inputValue: string, products?: Product) => {
      const userMessage: Message = {
        id: Date.now().toString(),
        content: inputValue,
        user: { userId: user?.userId || tmpUserId, username: user?.username || tmpUsername },
        agent: null,
        message_type: 'USER',
        products: products ? [products] : [],
        createdAt: new Date(),
      };
      resetAtomState();

      const response = await postChatSend(roomId, userMessage);
      if (response.status == 'fail') {
        console.error(response.message);
        return;
      }

      setMessages((prev) => [...prev, userMessage]);
    },
    [roomId],
  );

  const handleExampleSelect = useCallback(
    (exampleText: string) => {
      sendMessage(exampleText);
    },
    [sendMessage],
  );

  return {
    sendMessage,
    handleExampleSelect,
  };
}
