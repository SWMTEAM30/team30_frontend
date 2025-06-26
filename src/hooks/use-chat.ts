import { getChatReceive } from '@/api/chatAPI';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';

export const useChat = (chatId: string | null) => {
  // 1. 훅 내부에서 queryClient를 직접 가져옵니다.
  const queryClient = useQueryClient();

  const accumulatedMessagesKey = ['chatMessages', chatId];
  const newChatMessageFetcherKey = ['newChatMessageFetcher', chatId];

  // 3. useQuery는 '새로운' 메시지를 가져오는 역할에만 집중합니다.
  const {
    data: queryResult,
    status,
    error,
  } = useQuery({
    queryKey: newChatMessageFetcherKey,
    queryFn: getChatReceive,
    refetchInterval: 3000,
    refetchIntervalInBackground: true,
  });

  console.log('useChat Hook Render:', { chatId, status, error, queryResult });

  useEffect(() => {
    console.log('useEffect Triggered:', { chatId, status, queryResult });

    if (!chatId || status !== 'success' || !queryResult?.[0]?.data) {
      return;
    }

    const newMessage = {
      id: queryResult[0].data,
      text: queryResult[0].data,
      user: {
        user_id: '1',
        username: 'mindul',
      },
      timestamp: new Date(),
    };

    queryClient.setQueryData<Message[]>(accumulatedMessagesKey, (oldMessages = []) => {
      console.log(oldMessages);
      const existingIds = new Set(oldMessages.map((msg) => msg.id));

      if (!existingIds.has(newMessage.id)) {
        return [...oldMessages, newMessage];
      }
      return oldMessages;
    });
  }, [queryResult, status, queryClient, accumulatedMessagesKey]);

  const allMessages = queryClient.getQueryData<Message[]>(accumulatedMessagesKey) || [];

  return {
    messages: allMessages,
    isLoading: status === 'pending' && allMessages.length === 0, // 초기 로딩 상태
    error: status === 'error',
  };
};
