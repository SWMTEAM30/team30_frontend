import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getChatRoomList, createNewChatRoom } from '@/api/chatAPI';

export const useChatRooms = () => {
  const queryClient = useQueryClient();
  const queryKey = ['chatRooms'];

  // 1. 채팅방 목록을 가져오는 useQuery
  const {
    data: rooms,
    isLoading,
    error,
  } = useQuery<ChatRoom[]>({
    queryKey: queryKey,
    queryFn: getChatRoomList,
  });

  // 2. 새로운 채팅방을 만드는 useMutation
  const { mutate: createChat, isPending: isCreating } = useMutation({
    mutationFn: createNewChatRoom,

    // ✨ 핵심: 뮤테이션 성공 시 실행될 로직
    onSuccess: (newlyCreatedRoom) => {
      console.log('새 채팅방 생성 성공!', newlyCreatedRoom);

      // 채팅방 목록 쿼리를 '무효화' 시켜서 최신 데이터로 다시 불러오게 만듭니다.
      queryClient.invalidateQueries({ queryKey: queryKey });

      // (선택사항) 새로 만든 채팅방의 메시지 캐시를 빈 배열로 초기화할 수도 있습니다.
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
