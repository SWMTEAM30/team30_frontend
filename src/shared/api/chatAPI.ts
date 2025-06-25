import { requestAPI } from '@/shared/api/API';

// GET
export const getChatReceive = async () => requestAPI(`/api/chat/receive`, 'GET');

// POST
export const postChatSend = async (chat: { content: string }) => requestAPI(`/api/chat/send`, 'POST', chat);
