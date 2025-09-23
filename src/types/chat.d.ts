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
  content: {
    product_id: string;
    content: string;
  };
}

interface ClosetCloth {
  id: string;
  name: string;
  url: string;
  description: string;
  tags: string[];
}

interface MessageWiki extends PanelData {
  content: MDXRemoteSerializeResult<Record<string, unknown>, Record<string, unknown>>;
}

type WikiIndex = Record<string, MessageWiki>;

type ChatRoom = {
  id: string;
  title: string;
  createdAt: Date;
};

type RoomHistory = {
  all_rooms: ChatRoom[];
};

type RoomIdMessages = {
  messages: {
    id: string;
    content: string;
    image_url: string | null;
    message_type: string;
    created_at: string;
    agent_type: string | null;
    agent_name: string | null;
    product_image_url: string[] | null;
  }[];
};

type Codination = {
  id: string;
  fitting_image: string | null;
  cloths: ClosetCloth[];
};
