import { getChatRoomsHistory } from '@/api/chatAPI';
import { useRouter } from 'next/navigation';

export default async function RoomList() {
  const response = await getChatRoomsHistory();
  const router = useRouter();
  console.log(response);
  if (response.status == 'fail') {
    return <div>채팅을 불러올 수 없습니다.</div>;
  }

  const handleRoute = (roomId: number) => {
    router.push(`/chat?roomID=${roomId}`);
  };

  const roomList = response.data.all_rooms;
  return (
    <div className="flex flex-col">
      {roomList.map((room, i) => (
        <div key={i} onClick={() => handleRoute(room.id)}>
          <h3 className="text-4xl">{room.title}</h3>
          <div>{room.createdAt}</div>
        </div>
      ))}
    </div>
  );
}
