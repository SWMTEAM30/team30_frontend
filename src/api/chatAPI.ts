import { requestAPI } from '@/api/API';
import { timeStamp } from 'console';

// GET
export const getChatReceive = async (): Promise<[APIResponseType<string>, any]> => {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return [
    {
      status: '200',
      message: 'ok',
      data: `옷은 이렇게 입는 겁니다. ${new Date().getTime()}`,
    },
    undefined,
  ];
  //requestAPI(`/api/chat/receive`, 'GET');
};

// POST
export const postChatSend = async (chat: { content: string }) => requestAPI(`/api/chat/send`, 'POST', chat);

/**
 *
 *
 *
 *
 *
 *
 *
 * for test
 */
// 전체 채팅방 목록을 가져오는 함수
export const getChatRoomList = async (): Promise<ChatRoom[]> => {
  return new Promise((resolve) => setTimeout(() => resolve(mockChatRooms), 500));
};

// 새로운 채팅방을 생성하는 함수
export const createNewChatRoom = async (): Promise<ChatRoom> => {
  const newRoom: ChatRoom = { id: `room-${Date.now()}`, title: '새로운 대화', timestamp: new Date() };
  mockChatRooms.unshift(newRoom); // 가짜 DB에 추가
  return new Promise((resolve) => setTimeout(() => resolve(newRoom), 500));
};

// (테스트용 가짜 DB)
let mockChatRooms: ChatRoom[] = [
  { id: 'room1', title: '리액트 질문방', timestamp: new Date() },
  { id: 'room2', title: 'Next.js 아키텍처', timestamp: new Date() },
];
