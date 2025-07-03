/**
 * TanStack Query의 queryKey를 중앙에서 관리하는 객체입니다.
 * 모든 키는 이 객체를 통해 생성하여 일관성과 안정성을 유지합니다.
 */
export const queryKeys = {
  // 전체를 가리키는 루트 키 (모든 쿼리 무효화 등에 사용)
  all: ['all'] as const,

  // 채팅방 관련 키
  chatRooms: {
    all: () => ['chatRooms'] as const, // 모든 채팅방 목록
    detail: (roomId: number) => ['chatRooms', 'detail', roomId] as const, // 특정 채팅방 상세 정보
  },

  // 채팅 메시지 관련 키
  chatMessages: {
    list: (chatId: number) => ['chatMessages', chatId] as const, // 특정 채팅방의 누적 메시지 목록
    fetcher: (chatId: number) => ['chatMessages', 'fetcher', chatId] as const, // 새 메시지를 가져오는 폴링용
  },

  // 사용자 관련 키
  users: {
    all: () => ['users'] as const,
    me: () => ['users', 'me'] as const, // 현재 로그인한 사용자 정보
    detail: (userId: number) => ['users', 'detail', userId] as const,
  },
};
