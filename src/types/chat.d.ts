type Product = {
  product_url: string;
  product_id: string;
};

type UserMessage = {
  id: string;
  content: string;
  user: User;
  agent: null;
  message_type: string;
  products: Product[];
  createdAt: Date;
};

type AgentMessage = {
  id: string;
  content: string;
  user: null;
  agent: Agent;
  message_type: string;
  products: Product[];
  createdAt: Date;
};

type Message = UserMessage | AgentMessage;

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

type RoomHistory = {
  all_rooms: ChatRoom[];
};

type RoomIdMessages = {
  messages: Message[];
};
