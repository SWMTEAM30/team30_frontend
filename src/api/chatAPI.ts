import { requestAPI } from '@/api/API';

// GET
export const getChatReceive = async (roomId: number) => {
  const response = await requestAPI<string[]>(`/api/chat/receive?roomId=${roomId}`, 'GET');
  if (response.ok === true) {
    return {
      ok: response.ok,
      data: {
        status: response.data.status,
        message: response.data.message,
        data: response.data.data.map((e: string) => ({
          id: Date.now().toString(),
          text: e,
          user: { userId: 'qwer', username: 'mendul' },
          timestamp: new Date(),
        })),
      },
      error: response.error,
    } as APISuccessResponse<Message[]>;
  } else {
    return response;
  }
};

// POST
export const postChatSend = async (roomId: number, message: { content: string }) =>
  requestAPI(`/api/chat/send?roomId=${roomId}`, 'POST', message);

export const postChatRoomsStart = async () => requestAPI<RoomStart>(`/api/chat/rooms/start`, 'POST');

export const postChatRoomsNew = async () => requestAPI<number>(`/api/chat/rooms/new`, 'POST');
