import { requestAPI } from '@/api/API';

const formatfromAPIMessagetoMessage = (apiMsg: APIMessage): Message => {
  let message: Message;
  const imageUrls: MessageImage[] = apiMsg.product_image_url
    ? [
        {
          src: apiMsg.product_image_url,
          name: '얇은 비키니',
          content:
            '몰라요, 그냥 일단 비키니라고 예시를 넣었는데, 만약 이 글을 발견했다면 프론트엔드 개발자한테 chatAPI.ts 수정하라고 하세요',
          tags: ['섹시한', '도발적인', '노출이심한', '과감한', '매력적인'],
        },
      ]
    : [];

  if (apiMsg.message_type === 'USER') {
    message = {
      id: apiMsg.id.toString(),
      content: apiMsg.content,
      user: { userId: apiMsg.id.toString(), username: 'asdf' },
      agent: null,
      message_type: 'USER',
      createdAt: new Date(apiMsg.created_at),
      imageUrls: imageUrls,
    };
  } else {
    message = {
      id: apiMsg.id.toString(),
      content: apiMsg.content,
      user: null,
      agent: {
        agentType: apiMsg.agent_type!,
        agentname: apiMsg.agent_name!,
      },
      message_type: apiMsg.message_type,
      createdAt: new Date(apiMsg.created_at),
      imageUrls: imageUrls,
    };
  }
  return message;
};

const formatfromAPIResponsetoMessage = (apiMsg: APIResponseMessage): Message => {
  return formatfromAPIMessagetoMessage({
    id: apiMsg.order || 1,
    content: apiMsg.message,
    image_url: null,
    message_type: apiMsg.agent_role,
    created_at: new Date().toString(),
    agent_type: apiMsg.agent_role,
    agent_name: apiMsg.agent_name,
    product_image_url: apiMsg.product_image_url,
  });
};

// GET
export const getChatReceive = async (roomId: number | null): Promise<APIResponse<Message>> => {
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
    data: formatfromAPIResponsetoMessage(response.data),
  };
};

export const getChatRoomsHistory = async () => requestAPI<APIRoomHistory>(`/api/chat/rooms/history`, 'GET');

export const getChatRoomsRoomIdMessages = async (roomId: number): Promise<APIResponse<RoomIdMessages>> => {
  const response = await requestAPI<APIRoomIdMessages>(`/api/chat/rooms/${roomId}/messages`, 'GET');
  if (response.status === 'fail') {
    console.error(new Error(response.message));
    return response;
  }

  return {
    status: response.status,
    message: response.message,
    data: {
      messages: response.data.messages.map((e) => formatfromAPIMessagetoMessage(e)),
    },
  };
};

// POST
export const postChatSend = async (roomId: number | null, message: Message) => {
  return requestAPI<number>(`/api/chat/send${roomId ? `?roomId=${roomId}` : ''}`, 'POST', {
    content: message.content,
    imageUrl: message.imageUrls?.[0]?.src,
  });
};

export const postChatUpload = async (file: any) => requestAPI<string>(`/api/chat/upload`, 'POST', file, {});

const imageset = [
  [
    {
      src: '/cloth1.jpg',
      name: '캐주얼 셔츠',
      description:
        '편안하면서도 스타일리시한 캐주얼 셔츠입니다. 데일리 룩부터 세미 포멀까지 다양한 상황에 활용할 수 있는 만능 아이템입니다.',
      tags: ['캐주얼', '셔츠', '데일리', '베이직'],
    },
    {
      src: '/cloth2.jpg',
      name: '데님 자켓',
      description:
        '클래식한 데님 자켓으로 어떤 룩에도 잘 어울리는 아이템입니다. 레이어링의 핵심 아이템으로 활용하기 좋습니다.',
      tags: ['데님', '자켓', '클래식', '레이어링'],
    },
    {
      src: '/cloth3.jpg',
      name: '스니커즈',
      description: '편안하면서도 스타일리시한 스니커즈입니다. 캐주얼 룩의 완성도를 높여주는 필수 아이템입니다.',
      tags: ['스니커즈', '신발', '캐주얼', '편안함'],
    },
  ],
  [
    {
      src: '/cloth4.jpg',
      name: '청바지',
      description: '클래식한 청바지로 어떤 상의와도 잘 어울립니다. 데일리 룩의 기본이 되는 아이템입니다.',
      tags: ['청바지', '데님', '클래식', '데일리'],
    },
    {
      src: '/cloth5.jpg',
      name: '니트 스웨터',
      description: '따뜻하고 편안한 니트 스웨터입니다. 가을과 겨울 시즌에 활용하기 좋은 아이템입니다.',
      tags: ['니트', '스웨터', '가을', '겨울'],
    },
    {
      src: '/cloth6.jpg',
      name: '트렌치 코트',
      description: '클래식한 트렌치 코트로 우아하고 세련된 룩을 완성할 수 있습니다.',
      tags: ['트렌치', '코트', '클래식', '세련'],
    },
  ],
  [
    {
      src: '/cloth7.jpg',
      name: '미니 스커트',
      description: '귀엽고 여성스러운 미니 스커트입니다. 다양한 상의와 매칭하여 활용할 수 있습니다.',
      tags: ['미니', '스커트', '여성스러움', '귀여움'],
    },
    {
      src: '/cloth8.jpg',
      name: '플랫 슈즈',
      description: '편안하면서도 우아한 플랫 슈즈입니다. 데일리 룩부터 세미 포멀까지 활용 가능합니다.',
      tags: ['플랫', '슈즈', '편안함', '우아함'],
    },
    {
      src: '/cloth9.jpg',
      name: '백팩',
      description: '실용적이면서도 스타일리시한 백팩입니다. 데일리 룩의 완성도를 높여주는 액세서리입니다.',
      tags: ['백팩', '가방', '실용적', '스타일리시'],
    },
  ],
];
