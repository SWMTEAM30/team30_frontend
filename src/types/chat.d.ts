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

interface RoomStart {
  new_room_id: number;
  all_rooms: {
    id: number;
    title: string;
    created_at: string;
  }[];
}
