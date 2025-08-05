type APIMessage = {
  id: number;
  content: string;
  image_url: string | null;
  message_type: string | 'USER';
  created_at: string;
  agent_type: string | null;
  agent_name: string | null;
  product_image_url: string;
};

type APIRoomHistory = {
  all_rooms: {
    id: number;
    title: string;
    createdAt: string;
  }[];
};

type APIRoomIdMessages = {
  messages: AgentMessage[];
};
