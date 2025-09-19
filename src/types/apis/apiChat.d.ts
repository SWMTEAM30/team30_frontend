type APIResponseMessage = {
  message: string;
  order: number;
  agent_id: string;
  agent_name: string;
  agent_role: string;
  products: {
    product_url: string;
    product_id: string;
  }[];
};

type APIRoomIdMessage = {
  id: number;
  content: string;
  image_url: null;
  message_type: string;
  created_at: string;
  agent_type: string | null;
  agent_name: string | null;
  product_image_url: string[] | null;
};

type APIRoomHistory = {
  all_rooms: {
    id: string;
    title: string;
    createdAt: string;
  }[];
};

type APIRoomIdMessages = {
  messages: APIRoomIdMessage[];
};

type APIProduct = {
  product_name: string;
  comprehensive_description: string;
  style_tags: string[];
  tpo_tags: string[];
};
