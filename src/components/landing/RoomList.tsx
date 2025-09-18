import { getChatRoomsHistory } from '@/api/chatAPI';
import Link from 'next/link';

export default async function RoomList() {
  const response = await getChatRoomsHistory();

  console.log(response);
  if (response.status == 'fail') {
    return <div>채팅을 불러올 수 없습니다.</div>;
  }

  const roomList = response.data.all_rooms;
  return (
    <div className="flex flex-col">
      {roomList.map((room, i) => (
        <Link key={i} href={`/chat?roomID=${room.id}`}>
          <h3 className="text-4xl">{room.title}</h3>
          <div>{room.createdAt}</div>
        </Link>
      ))}
    </div>
  );
}
