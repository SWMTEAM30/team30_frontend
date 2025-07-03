import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { postChatRoomsNew, postChatRoomsStart } from '@/api/chatAPI';
import { queryKeys } from '@/lib/queryKeys';
import { moveItemToFront } from '@/lib/utils';

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
      const result = await postChatRoomsStart();

      if (result.ok && result.data) {
        // api 받아온 거를 ChatRoom[] 모양에 맞게 formatting 해줘야 함.
        return moveItemToFront(
          result.data.data.all_rooms.map((chatRoom) => ({
            id: chatRoom.id,
            title: chatRoom.title,
            timestamp: new Date(chatRoom.created_at),
          })),
          result.data.data.new_room_id,
        );
      }

      // 만약 error가 있다면 에러를 표기
      throw new Error(result.error || '채팅방 목록을 가져오는 데 실패했습니다.');
    },
  });

  // 새로운 채팅방을 만드는 useMutation
  const { mutate: createChat, isPending: isCreating } = useMutation({
    mutationFn: postChatRoomsNew,
    onSuccess: (postChatRoomsNewResponse) => {
      if (!postChatRoomsNewResponse.ok) throw Error('no new room');
      queryClient.invalidateQueries({ queryKey: queryKey });
      queryClient.setQueryData(['chatMessages', postChatRoomsNewResponse.data.data], []);
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
