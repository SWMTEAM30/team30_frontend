import { getChatReceive, postChatSend } from '@/api/chatAPI';
import { isAIRespondingAtom, messagesAtomFamily, roomIdAtom } from '@/atoms/chatAtoms';
import { queryKeys } from '@/lib/queryKeys';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAtom, useAtomValue, useStore } from 'jotai';
import { useCallback, useEffect, useState } from 'react';

export const useChatMessage = (chatId: string | null) => {
  const [isAIResponding, setIsAIResponding] = useAtom(isAIRespondingAtom);
  const roomId = useAtomValue(roomIdAtom);
  const messages = messagesAtomFamily(roomId);
  const queryClient = useQueryClient();
  const [pollCount, setPollCount] = useState(0);
  const store = useStore();
  const newChatMessageFetcherKey = queryKeys.chatMessages.fetcher(chatId); // 채팅방 별로 API 받아오는 키

  const {
    data: queryResult,
    status,
    isFetching,
  } = useQuery({
    queryKey: newChatMessageFetcherKey, // 여기서는 API를 받아서 가공할 예정
    queryFn: () => getChatReceive(chatId),
    refetchInterval: pollCount < 10 ? 3000 : false,
    refetchIntervalInBackground: true,
    enabled: !!chatId,
  });

  // poll count limiting
  useEffect(() => {
    setPollCount((c) => c + 1);
  }, [isFetching]);

  // chat message accumulating
  useEffect(() => {
    if (!chatId || status !== 'success' || queryResult.status === 'fail') {
      //if (queryResult?.status == 'fail') console.error(queryResult?.message);
      return;
    }

    store.set(messagesAtomFamily(roomId), (oldMessages = []) => {
      const newMessage = queryResult.data;
      if (oldMessages.some((msg) => msg.id === newMessage.id)) return oldMessages;
      return [...oldMessages, newMessage];
    });
  }, [queryResult, status, queryClient]);

  // 메시지 보내기 mutation
  const { mutate, isPending: isSending } = useMutation({
    mutationFn: (newMessage: Message) => postChatSend(chatId, newMessage),
    onSuccess: (responseFromServer, newMessage) => {
      if (responseFromServer.status === 'fail') return;
      const newChatId = responseFromServer.data;
      store.set(messagesAtomFamily(roomId), (oldMessages) => [...oldMessages, newMessage]);
      if (!chatId && newChatId) {
        //setChatId(newChatId);
        queryClient.invalidateQueries({ queryKey: queryKeys.chatRooms.all() });
      }
    },
    onSettled: () => {
      setPollCount(0);
      queryClient.invalidateQueries({ queryKey: newChatMessageFetcherKey });
    },
  });

  const addExistingMessages = useCallback(
    (chatId: number | null, existingMessages: Message[]) => {
      if (!chatId || !existingMessages.length) return;

      store.set(messagesAtomFamily(roomId), (currentMessages = []) => {
        const existingIds = new Set(currentMessages.map((msg) => msg.id));
        const newMessages = existingMessages.filter((msg) => !existingIds.has(msg.id));
        return [...currentMessages, ...newMessages].sort(
          (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
        );
      });
    },
    [chatId, store],
  );

  if (!chatId) {
    return {
      isLoading: false,
      error: false,
      sendMessage: mutate,
      isSending: isSending,
      addExistingMessages,
    };
  }

  return {
    isLoading: status === 'pending',
    error: status === 'error',
    sendMessage: mutate,
    isSending: isSending,
    addExistingMessages,
  };
};
