import { getChatReceive, postChatSend } from '@/api/chatAPI';
import { currentChatIdAtom, messagesAtomFamily } from '@/atoms/chatAtoms';
import { queryKeys } from '@/lib/queryKeys';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { SetStateAction, useAtom, useStore } from 'jotai';
import { useCallback, useEffect, useState } from 'react';

export const useChatMessage = () => {
  const [chatId, setChatId] = useAtom(currentChatIdAtom);
  const queryClient = useQueryClient();
  const [pollCount, setPollCount] = useState(0);
  const store = useStore();
  const newChatMessageFetcherKey = queryKeys.chatMessages.fetcher(chatId!); // 채팅방 별로 API 받아오는 키

  const {
    data: queryResult,
    status,
    isFetching,
  } = useQuery({
    queryKey: newChatMessageFetcherKey, // 여기서는 API를 받아서 가공할 예정
    queryFn: () => getChatReceive(chatId!),
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
    if (!chatId || status !== 'success' || !queryResult.ok) return;
    store.set(messagesAtomFamily(chatId), (oldMessages = []) => {
      const newMessage = queryResult.data;
      if (oldMessages.some((msg) => msg.id === newMessage.id)) return oldMessages;
      return [...oldMessages, newMessage];
    });
  }, [queryResult, status, queryClient, chatId]);

  // 메시지 보내기 mutation
  const { mutate, isPending: isSending } = useMutation({
    mutationFn: (newMessage: Message) =>
      postChatSend(chatId, {
        content: newMessage.text,
        imageUrl: newMessage.images?.[0].src,
      }),
    onSuccess: (responseFromServer, newMessage) => {
      if (!responseFromServer.ok) return;
      const newChatId = responseFromServer.data;
      store.set(messagesAtomFamily(newChatId), (oldMessages) => [...oldMessages, newMessage]);
      if (!chatId && newChatId) {
        setChatId(newChatId);
        queryClient.invalidateQueries({ queryKey: queryKeys.chatRooms.all() });
      }
    },
    onSettled: () => {
      setPollCount(0);
      queryClient.invalidateQueries({ queryKey: newChatMessageFetcherKey });
    },
  });

  if (!chatId) {
    return {
      isLoading: false,
      error: false,
      sendMessage: mutate,
      isSending: isSending,
    };
  }

  return {
    isLoading: status === 'pending',
    error: status === 'error',
    sendMessage: mutate,
    isSending: isSending,
  };
};
