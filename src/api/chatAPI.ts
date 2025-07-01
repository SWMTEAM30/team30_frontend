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

export const getChatRoomsStart = async () => requestAPI<RoomStart>(`/api/chat/rooms/start`, 'GET');

export const getChatRoomsNew = async () => requestAPI<number>(`/api/chat/rooms/new`, 'GET');

// POST
export const postChatSend = async (roomId: number, message: Message) =>
  requestAPI(`/api/chat/send?roomId=${roomId}`, 'POST', message.text);
