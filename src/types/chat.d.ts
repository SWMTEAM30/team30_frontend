type Message = {
  id: string;
  text: string;
  user: User;
  timestamp: Date;
  images?: PanelData[]; // AI 메시지에 포함될 이미지 URL 배열
};

type AgentMessage = {
  agent_id: string;
  agent_name: string;
  agent_role: string;
  message: string;
  order: number;
  product_image_url: string;
};

interface PanelData {
  src: string;
  name: string;
  content: any;
  tags: string[];
}

interface MessageImage extends PanelData {
  content: string;
}
interface MessageWiki extends PanelData {
  content: MDXRemoteSerializeResult<Record<string, unknown>, Record<string, unknown>>;
}

type WikiIndex = Record<string, MessageWiki>;

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
