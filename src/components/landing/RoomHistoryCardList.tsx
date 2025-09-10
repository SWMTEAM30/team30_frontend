import { getChatRoomsHistory } from '@/api/chatAPI';
import Link from 'next/link';

export default async function RoomHistoryCardList() {
  // const response = await getChatRoomsHistory();
  // console.log(response);

  const response = {
    data: {
      all_rooms: [
        { id: 228, title: '새 메시지' },
        { id: 229, title: '새 메시지' },
        { id: 230, title: '새 메시지' },
        { id: 231, title: '새 메시지' },
      ],
    },
  };

  return (
    <div className="grid col-3">
      {response.data?.all_rooms.map((room: any, key: number) => (
        <Link key={key} className="h-96 w-96" href={'/chat'}>
          {room.title}
        </Link>
      ))}
    </div>
  );
}
