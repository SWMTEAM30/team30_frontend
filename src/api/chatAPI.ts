import { requestAPI } from '@/api/API';
import { formatMessage, formatRoomMessage } from '@/lib/chat_formatter';

// GET
export const getChatReceive = async (roomId: string | null): Promise<APIResponse<Message>> => {
  if (!roomId)
    return {
      status: 'fail',
      message: 'Room ID is required to receive messages.',
      data: null,
    };

  const response = await requestAPI<APIResponseMessage>(`/api/chat/receive?roomId=${roomId}`, 'GET');
  if (response.status === 'fail')
    return {
      status: 'fail',
      message: response.message,
      data: null,
    };

  return {
    status: response.status,
    message: response.message,
    data: formatMessage(response.data),
  };
};

export const getChatRoomsHistory = async () => requestAPI<APIRoomHistory>(`/api/chat/rooms/history`, 'GET');

export const getChatRoomsRoomIdMessages = async (
  roomId: string,
  before?: Date,
): Promise<APIResponse<{ messages: Message[] }>> => {
  const response = await requestAPI<APIRoomIdMessages>(
    `/api/chat/rooms/${roomId}/messages${before ? `?before=${before.toISOString()}` : ''}`,
    'GET',
  );
  if (response.status === 'fail') {
    console.error(new Error(response.message));
    return response;
  }

  return {
    status: response.status,
    message: response.message,
    data: {
      messages: response.data.messages.map((e) => formatRoomMessage(e)),
    },
  };
};

export const getChatProduct = async (product: Product): Promise<APIResponse<ClosetCloth>> => {
  const response = await requestAPI<APIProduct>(`/api/chat/product/${product.product_id}`, 'GET');
  if (response.status === 'fail') {
    console.error(new Error(response.message));
    return response;
  }

  return {
    status: response.status,
    message: response.message,
    data: {
      id: product.product_id,
      name: response.data.product_name,
      description: response.data.comprehensive_description,
      tags: [...response.data.style_tags, ...response.data.tpo_tags],
      url: product.product_url,
    },
  };
};

// POST
export const postChatSend = async (roomId: string | null, message: Message) => {
  return requestAPI<number>(`/api/chat/send${roomId ? `?roomId=${roomId}` : ''}`, 'POST', {
    content: message.content,
    imageUrl: message.products[0]?.product_url,
  });
};

export const postChatUpload = async (file: any) => requestAPI<string>(`/api/chat/upload`, 'POST', file, {});

export const postChatRooms = async () => requestAPI<ChatRoom>('/api/chat/rooms', 'POST');
