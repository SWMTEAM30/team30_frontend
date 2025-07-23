type Message = {
  id: string;
  text: string;
  user: User;
  timestamp: Date;
  images?: MessageImage[]; // AI 메시지에 포함될 이미지 URL 배열
};

type AgentMessage = {
  agent_id: string;
  agent_name: string;
  agent_role: string;
  message: string;
  order: number;
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
