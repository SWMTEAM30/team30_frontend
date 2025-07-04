import { useQuery } from '@tanstack/react-query';
import { getChatRoomsHistory } from '@/api/chatAPI';
import { queryKeys } from '@/lib/queryKeys';

export const useChatRooms = () => {
  const queryKey = queryKeys.chatRooms.all();

  // 가장 최근의 채팅방을 가져오는 useQuery
  const {
    data: rooms,
    isLoading,
    error,
  } = useQuery<ChatRoom[]>({
    queryKey: queryKey,
    queryFn: async (): Promise<ChatRoom[]> => {
      const result = await getChatRoomsHistory();
      console.log(result);
      if (result.ok) {
        // api 받아온 거를 ChatRoom[] 모양에 맞게 formatting 해줘야 함.
        return result.data.all_rooms.map((chatRoom) => ({
          id: chatRoom.id,
          title: chatRoom.title,
          timestamp: new Date(chatRoom.createdAt),
        }));
      } else
        // 만약 error가 있다면 에러를 표기
        throw new Error(result.error || '채팅방 목록을 가져오는 데 실패했습니다.');
    },
  });

  return {
    rooms: rooms || [], // 데이터가 없을 때 빈 배열을 반환
    isLoading,
    error,
  };
};
