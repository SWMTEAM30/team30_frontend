import { requestAPI } from '@/api/API';

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

// GET
export const getChatReceive = async (roomId: number | null) => {
  if (!roomId)
    return {
      ok: false,
      error: new Error('no have room id'),
    } as APIErrorResponse;
  const response = await requestAPI<AgentMessage>(`/api/chat/receive?roomId=${roomId}`, 'GET');
  if (response.ok === true) {
    console.log(imageset[0]);
    return {
      ok: response.ok,
      status: response.status,
      message: response.message,
      data: {
        id: Date.now().toString(),
        text: response.data.message,
        user: { userId: response.data.agent_id, username: response.data.agent_name },
        timestamp: new Date(),
        images: imageset[0],
      },
    } as APISuccessResponse<Message>;
  } else {
    return response;
  }
};

export const getChatRoomsHistory = async () => requestAPI<RoomHistory>(`/api/chat/rooms/history`, 'GET');

// POST
export const postChatSend = async (roomId: number | null, message: { content: string; imageUrl?: string }) => {
  return requestAPI<number>(`/api/chat/send${roomId ? `?roomId=${roomId}` : ''}`, 'POST', message);
};
export const postChatUpload = async (file: any) => requestAPI<string>(`/api/chat/upload`, 'POST', file, {});
