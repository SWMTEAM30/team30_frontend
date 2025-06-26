import { requestAPI } from '@/api/API';

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
