import { getChatRoomsHistory } from '@/api/chatAPI';

export default async function RoomList() {
  const response = await getChatRoomsHistory();
  if (response.status == 'fail') {
    return <div>채팅을 불러올 수 없습니다.</div>;
  }

  const roomList = response.data.all_rooms;
  return (
    <div>
      {roomList.map((room, i) => (
        <div key={i}>
          <h3>{room.title}</h3>
          <div>{room.createdAt}</div>
        </div>
      ))}
    </div>
  );
}
