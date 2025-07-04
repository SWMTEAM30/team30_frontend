import { requestAPI } from '@/api/API';

// GET
export const getChatReceive = async (roomId: number | null) => {
  if (!roomId)
    return {
      ok: false,
      error: new Error('no have room id'),
    } as APIErrorResponse;
  const response = await requestAPI<string[]>(`/api/chat/receive?roomId=${roomId}`, 'GET');
  if (response.ok === true) {
    return {
      ok: response.ok,
      status: response.status,
      message: response.message,
      data: response.data.map((e: string) => ({
        id: Date.now().toString(),
        text: e,
        user: { userId: 'qwer', username: 'mendul' },
        timestamp: new Date(),
      })),
    } as APISuccessResponse<Message[]>;
  } else {
    return response;
  }
};

export const getChatRoomsHistory = async () => requestAPI<RoomHistory>(`/api/chat/rooms/history`, 'GET');

// POST
export const postChatSend = async (roomId: number | null, message: { content: string }) =>
  requestAPI<number>(`/api/chat/send${roomId ? `?roomId=${roomId}` : ''}`, 'POST', message);
