import { getChatReceive } from '@/api/chatAPI';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';

export const useChat = (chatId?: string) => {
  const queryClient = useQueryClient();

  const accumulatedMessagesKey = ['chatMessages', chatId]; // 채팅방 별로 데이터 저장하는 키
  const newChatMessageFetcherKey = ['newChatMessageFetcher', chatId]; // 채팅방 별로 API 받아오는 키

  const { data: queryResult, status } = useQuery({
    queryKey: newChatMessageFetcherKey, // 여기서는 API를 받아서 가공할 예정
    queryFn: getChatReceive,
    refetchInterval: 3000,
    refetchIntervalInBackground: true,
  });

  useEffect(() => {
    /**
     * newChatMessageFetcherKey로부터 접근한 state data는
     * [data, error] 형식으로 된 API response를 queryResult로 저장함.
     *
     * queryResult를 적절히 formatting한 후에 accumulatedMessagesKey로 state data를 접근함
     *
     * state를 refresh하여 chat data를 누적함
     */

    // response가 없으면 ignore
    if (!chatId || status !== 'success' || !queryResult?.[0]?.data) {
      return;
    }

    // API response를 Message format에 맞게 formatting
    const newMessage = {
      id: queryResult[0].data,
      text: queryResult[0].data,
      user: {
        user_id: '1',
        username: 'mindul',
      },
      timestamp: new Date(),
    };

    // chat message accumulating
    queryClient.setQueryData<Message[]>(accumulatedMessagesKey, (oldMessages = []) => {
      const existingIds = new Set(oldMessages.map((msg) => msg.id));

      if (!existingIds.has(newMessage.id)) {
        return [...oldMessages, newMessage];
      }
      return oldMessages;
    });
  }, [queryResult, status, queryClient, accumulatedMessagesKey, chatId]);

  // hook에 맞게 messages를 출력
  const allMessages = queryClient.getQueryData<Message[]>(accumulatedMessagesKey) || [];

  return {
    messages: allMessages,
    isLoading: status === 'pending' && allMessages.length === 0, // 초기 로딩 상태
    error: status === 'error',
  };
};
