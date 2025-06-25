import { getChatReceive } from '@/shared/api/chatAPI';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';

export const useChat = () => {
  // 1. 훅 내부에서 queryClient를 직접 가져옵니다.
  const queryClient = useQueryClient();

  // 2. queryKey는 훅 내부에서 관리하는 것이 더 깔끔합니다.
  const queryKey = ['chatMessages'];

  // 3. useQuery는 '새로운' 메시지를 가져오는 역할에만 집중합니다.
  const { data: newMessages, status } = useQuery({
    queryKey: queryKey,
    queryFn: getChatReceive,
    refetchInterval: 3000,
    refetchIntervalInBackground: true,
    select: (queryResult): Message[] => {
      const [response, error] = queryResult;
      if (error || !response || !response.data) return [];
      const parsedData = response.data;
      return [
        {
          id: crypto.randomUUID(),
          text: parsedData,
          user: {
            user_id: '1',
            username: 'mindul',
          },
          timestamp: new Date(),
        },
      ];
    },
  });

  // 4. '메시지 누적'이라는 부수 효과(side effect)를 훅 내부에 캡슐화합니다.
  useEffect(() => {
    // 성공적으로 새로운 데이터를 받아왔을 때만 캐시를 업데이트합니다.
    if (status === 'success' && newMessages) {
      queryClient.setQueryData<Message[]>(queryKey, (oldMessages = []) => {
        const existingIds = new Set(oldMessages.map((msg) => msg.id));
        const uniqueNewMessages = newMessages.filter((msg) => !existingIds.has(msg.id));

        if (uniqueNewMessages.length > 0) {
          return [...oldMessages, ...uniqueNewMessages];
        }
        return oldMessages;
      });
    }
  }, [newMessages, status, queryClient, queryKey]);

  const allMessages = queryClient.getQueryData<Message[]>(queryKey) || [];

  return {
    messages: allMessages,
    isLoading: status === 'pending' && allMessages.length === 0, // 초기 로딩 상태
    error: status === 'error',
  };
};
