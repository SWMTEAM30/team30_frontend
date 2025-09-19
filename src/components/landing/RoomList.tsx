'use client';

import { getChatRoomsHistory } from '@/api/chatAPI';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function RoomList() {
  const [roomList, setRoomList] = useState<any[]>([]);
  useEffect(() => {
    (async () => {
      const response = await getChatRoomsHistory();
      console.log(response);
      if (response?.data?.all_rooms) setRoomList(response?.data.all_rooms);
    })();
  }, []);

  if (roomList.length == 0) {
    return <div>채팅을 불러올 수 없습니다.</div>;
  }

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
