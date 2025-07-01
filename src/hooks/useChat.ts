import { getChatReceive, postChatSend } from '@/api/chatAPI';
import { queryKeys } from '@/lib/queryKeys';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';

export const useChat = (chatId: number) => {
  const queryClient = useQueryClient();

  const accumulatedMessagesKey = queryKeys.chatMessages.list(chatId); // 채팅방 별로 데이터 저장하는 키
  const newChatMessageFetcherKey = queryKeys.chatMessages.fetcher(chatId); // 채팅방 별로 API 받아오는 키

  const { data: queryResult, status } = useQuery({
    queryKey: newChatMessageFetcherKey, // 여기서는 API를 받아서 가공할 예정
    queryFn: () => getChatReceive(chatId),
    refetchInterval: 3000,
    refetchIntervalInBackground: true,
  });

  useEffect(() => {
    /**
     * newChatMessageFetcherKey로부터 접근한 state data는
     * [data, error] 형식으로 된 API response를 queryResult로 저장함.
     *
     * accumulatedMessagesKey로 state data를 접근함
     *
     * state를 refresh하여 chat data를 누적함
     */

    // response가 없으면 ignore
    if (!chatId || status !== 'success' || !queryResult.ok) return;

    // chat message accumulating
    queryClient.setQueryData<Message[]>(accumulatedMessagesKey, (oldMessages = []) => {
      const existingIds = new Set(oldMessages.map((msg) => msg.id));
      const res: Message[] = [...oldMessages];

      for (const newMessage of queryResult.data.data) {
        if (!existingIds.has(newMessage.id)) res.push(newMessage);
      }

      return res;
    });
  }, [queryResult, status, queryClient, accumulatedMessagesKey, chatId]);

  // ✨ '메시지 보내기'를 위한 useMutation 로직 수정
  const { mutate: sendMessage } = useMutation({
    mutationFn: (variables: { roomId: number; newMessage: Message }) =>
      postChatSend(variables.roomId, { content: variables.newMessage.text }),
    onMutate: async (newMessageData) => {
      await queryClient.cancelQueries({ queryKey: newChatMessageFetcherKey });
      const previousMessages = queryClient.getQueryData<Message[]>(accumulatedMessagesKey) || [];
      queryClient.setQueryData<Message[]>(accumulatedMessagesKey, (old = []) => [...old, newMessageData.newMessage]);

      // 에러 발생 시 롤백에 사용할 스냅샷을 context로 반환
      return { previousMessages };
    },

    // 3. onError: 뮤테이션이 실패했을 때 실행
    onError: (err, newMessage, context) => {
      console.error('메시지 전송 실패:', err);
      if (context?.previousMessages) {
        queryClient.setQueryData(accumulatedMessagesKey, context.previousMessages);
      }
    },
    onSettled: () => {
      // 최신 서버 상태와 동기화하기 위해 메시지 목록 쿼리를 무효화
      // 이렇게 하면 임시 ID가 실제 서버 ID로 교체되는 등의 작업 가능
      queryClient.invalidateQueries({ queryKey: accumulatedMessagesKey });
      queryClient.invalidateQueries({ queryKey: newChatMessageFetcherKey }); // 폴링 쿼리도 동기화
    },
  });

  // hook에 맞게 messages를 출력
  const allMessages = queryClient.getQueryData<Message[]>(accumulatedMessagesKey) || [];

  return {
    messages: allMessages,
    isLoading: status === 'pending' && allMessages.length === 0, // 초기 로딩 상태
    error: status === 'error',
    sendMessage: sendMessage,
  };
};
