type Message = {
  id: string;
  text: string;
  user: {
    userId: string;
    username: string;
  };
  timestamp: Date;
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
