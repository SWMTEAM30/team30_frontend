type Message = {
  id: string;
  text: string;
  user: {
    userId: string;
    username: string;
  };
  timestamp: Date;
  images?: MessageImage[]; // AI 메시지에 포함될 이미지 URL 배열
};

type MessageImage = {
  src: string;
  name: string;
  description: string;
  tags: string[];
};

type ChatRoom = {
  id: number;
  title: string;
  timestamp: Date;
};

interface RoomHistory {
  all_rooms: {
    id: number;
    title: string;
    createdAt: string;
  }[];
}
