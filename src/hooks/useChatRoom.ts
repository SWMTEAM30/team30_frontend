import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getChatRoomsNew, getChatRoomsStart } from '@/api/chatAPI';
import { queryKeys } from '@/lib/queryKeys';

export const useChatRooms = () => {
  const queryClient = useQueryClient();
  const queryKey = queryKeys.chatRooms.all();

  // 가장 최근의 채팅방을 가져오는 useQuery
  const {
    data: rooms,
    isLoading,
    error,
  } = useQuery<ChatRoom[]>({
    queryKey: queryKey,
    queryFn: async (): Promise<ChatRoom[]> => {
      // getChatRoomsStart는 { ok, data, error } 객체를 포함한 Promise를 반환합니다.
      const result = await getChatRoomsStart();

      // 성공했고 데이터가 존재할 때만 data를 반환합니다.
      if (result.ok && result.data) {
        // 🚨 중요: 여기서 result.data의 타입이 ChatRoom[]이어야 합니다.
        // 아래 추가 설명을 확인해주세요.
        return [result.data.data.newChat, ...result.data.data.chatRooms].map((chatRoomId) => ({
          id: chatRoomId,
          title: '새 채팅',
          timestamp: new Date(),
        }));
      }

      // 실패했거나 데이터가 없으면 에러를 발생시켜 error 상태로 만듭니다.
      throw new Error(result.error || '채팅방 목록을 가져오는 데 실패했습니다.');
    },
  });

  // 새로운 채팅방을 만드는 useMutation
  const { mutate: createChat, isPending: isCreating } = useMutation({
    mutationFn: getChatRoomsNew,
    onSuccess: (getChatRoomsNewResponse) => {
      if (!getChatRoomsNewResponse.ok) throw Error('no new room');
      queryClient.invalidateQueries({ queryKey: queryKey });
      queryClient.setQueryData(['chatMessages', getChatRoomsNewResponse.data.data], []);
    },
  });

  return {
    rooms: rooms || [], // 데이터가 없을 때 빈 배열을 반환
    isLoading,
    error,
    createChat, // 컴포넌트에서 호출할 수 있도록 반환
    isCreating, // 채팅방 생성 중 로딩 상태
  };
};
