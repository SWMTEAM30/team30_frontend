type Message = {
  id: string;
  text: string;
  user: {
    user_id: string;
    username: string;
  };
  timestamp: Date;
  images?: string[];
};

interface Photo {
  id: string;
  url: string;
  description: string;
  tags: string[];
}

type ChatRoom = {
  id: string;
  title: string;
  timestamp: Date;
};
