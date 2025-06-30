import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getChatRoomList, createNewChatRoom } from '@/api/chatAPI';
import { queryKeys } from '@/lib/queryKeys';

export const useChatRooms = () => {
  const queryClient = useQueryClient();
  const queryKey = queryKeys.chatRooms.all();

  // 채팅방 목록을 가져오는 useQuery
  const {
    data: rooms,
    isLoading,
    error,
  } = useQuery<ChatRoom[]>({
    queryKey: queryKey,
    queryFn: getChatRoomList,
  });

  // 새로운 채팅방을 만드는 useMutation
  const { mutate: createChat, isPending: isCreating } = useMutation({
    mutationFn: createNewChatRoom,
    onSuccess: (newlyCreatedRoom) => {
      queryClient.invalidateQueries({ queryKey: queryKey });
      queryClient.setQueryData(['chatMessages', newlyCreatedRoom.id], []);
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
