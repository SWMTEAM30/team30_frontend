import { getChatReceive, postChatSend } from '@/api/chatAPI';
import { currentChatIdAtom, messagesAtomFamily } from '@/atoms/chatAtoms';
import { queryKeys } from '@/lib/queryKeys';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAtomValue, useSetAtom } from 'jotai';
import { useEffect, useState } from 'react';

export const useChatMessage = () => {
  const chatId = useAtomValue(currentChatIdAtom);
  const queryClient = useQueryClient();
  const setMessages = useSetAtom(messagesAtomFamily(chatId));

  const [pollCount, setPollCount] = useState(0);
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
    setMessages((oldMessages = []) => {
      const newMessage = queryResult.data;
      if (oldMessages.some((msg) => msg.id === newMessage.id)) return oldMessages;
      return [...oldMessages, newMessage];
    });
  }, [queryResult, status, queryClient, chatId]);

  // 메시지 보내기 mutation
  const { mutate: sendMessageMutation, isPending: isSending } = useMutation({
    mutationFn: (variables: { roomId: number | null; newMessage: Message }) =>
      postChatSend(variables.roomId, {
        content: variables.newMessage.text,
        imageUrl: variables.newMessage.images?.[0].src,
      }),
    onMutate: async (variables) => {
      await queryClient.cancelQueries({ queryKey: newChatMessageFetcherKey });
      const optimisticMessage = variables.newMessage;
      setMessages((oldMessages) => [...oldMessages, optimisticMessage]);
    },
    onSuccess: (responseFromServer) => {
      if (!responseFromServer.ok) {
        queryClient.invalidateQueries({ queryKey: newChatMessageFetcherKey });
        return;
      }
      const newChatId = responseFromServer.data;
      if (!chatId && newChatId) {
        queryClient.invalidateQueries({ queryKey: queryKeys.chatRooms.all() });
      }
    },
    // onError에서는 롤백 대신 invalidate를 통해 서버의 정확한 데이터로 덮어쓰는 것이 간단합니다.
    onError: () => {
      queryClient.invalidateQueries({ queryKey: newChatMessageFetcherKey });
    },
    onSettled: () => {
      // 최신 서버 상태와 동기화하기 위해 메시지 목록 쿼리를 무효화
      // 이렇게 하면 임시 ID가 실제 서버 ID로 교체되는 등의 작업 가능
      queryClient.invalidateQueries({ queryKey: newChatMessageFetcherKey }); // 폴링 쿼리도 동기화
    },
  });

  // sendMessage 함수를 래핑하여 콜백을 지원하도록 수정
  const sendMessage = (
    variables: { roomId: number | null; newMessage: Message },
    callbacks?: { onSuccess?: (response: any) => void; onError?: (error: any) => void },
  ) => {
    sendMessageMutation(variables, {
      onSuccess: (response) => {
        callbacks?.onSuccess?.(response);
      },
      onError: (error) => {
        callbacks?.onError?.(error);
      },
      onSettled: () => {
        setPollCount(0);
      },
    });
  };

  if (!chatId) {
    return {
      isLoading: false,
      error: false,
      sendMessage: sendMessage,
      isSending: isSending,
    };
  }

  return {
    isLoading: status === 'pending',
    error: status === 'error',
    sendMessage: sendMessage,
    isSending: isSending,
  };
};
