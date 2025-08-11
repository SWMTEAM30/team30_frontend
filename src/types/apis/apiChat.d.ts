type APIResponseMessage = {
  message: string;
  order: number;
  agent_id: string;
  agent_name: string;
  agent_role: string;
  product_image_url: string[];
};

type APIRoomHistory = {
  all_rooms: {
    id: number;
    title: string;
    createdAt: string;
  }[];
};

type APIRoomIdMessages = {
  messages: APIMessage[];
};
