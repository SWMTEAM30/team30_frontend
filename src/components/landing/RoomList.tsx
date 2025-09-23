'use client';

import { getChatRoomsHistory } from '@/api/chatAPI';
import { roomIdAtom } from '@/atoms/chatAtoms';
import { useSetAtom } from 'jotai';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function RoomList() {
  const [roomList, setRoomList] = useState<any[]>([]);
  const setRoomId = useSetAtom(roomIdAtom);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      const response = await getChatRoomsHistory();
      if (response?.data?.all_rooms) setRoomList(response?.data.all_rooms);
    })();
  }, []);

  const handleClick = (roomId: string) => {
    // roomId를 null로 설정하여 SSE 연결 끊기
    setRoomId(null);
    // 잠시 후 새로운 roomId 설정하고 App Router 방식으로 이동
    setTimeout(() => {
      setRoomId(roomId);
      router.push(`/chat/${roomId}`);
    }, 100);
  };

  if (roomList.length == 0) {
    return <div>채팅을 불러올 수 없습니다.</div>;
  }

  return (
    <div className="flex flex-col">
      {roomList.map((room, i) => (
        <button
          key={i}
          onClick={() => {
            handleClick(room.id);
          }}
        >
          <h3 className="text-4xl">{room.title}</h3>
          <div>{room.createdAt}</div>
        </button>
      ))}
    </div>
  );
}
