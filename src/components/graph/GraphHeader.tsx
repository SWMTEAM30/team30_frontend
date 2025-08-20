'use client';

import { isModelSectionOpenAtom } from '@/atoms/graphAtoms';
import { useGraphHandlers } from '@/components/graph/GraphContextProvider';
import { Button } from '@/components/ui/button';
import { useAtom } from 'jotai';
import { ArrowLeft, Plus, ChevronRight, ChevronLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function GraphHeader() {
  const router = useRouter();
  const { addNewPhotoNode, addNewGroup } = useGraphHandlers();
  const [isModelSectionOpen, setIsModelSectionOpen] = useAtom(isModelSectionOpenAtom);
  return (
    <div className="bg-white border-b border-gray-200 p-4 flex justify-between items-center">
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          onClick={() => router.push('/chat')}
          className="border-[#4993FA] text-[#4993FA] hover:bg-[#4993FA] hover:text-white"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          채팅으로 돌아가기
        </Button>
        <h1 className="text-2xl font-bold text-[#4993FA]">패션 아이템 연결 그래프</h1>
      </div>
      <div className="flex gap-2">
        <Button onClick={addNewPhotoNode} className="bg-[#4993FA] hover:bg-[#3A7BD8] text-white">
          <Plus className="w-4 h-4 mr-2" />
          사진 노드 추가
        </Button>
        <Button
          onClick={addNewGroup}
          variant="outline"
          className="border-[#4993FA] text-[#4993FA] hover:bg-[#4993FA] hover:text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          그룹 추가
        </Button>
        <Button
          onClick={() => setIsModelSectionOpen(!isModelSectionOpen)}
          variant="outline"
          className="border-[#4993FA] text-[#4993FA] hover:bg-[#4993FA] hover:text-white"
        >
          {isModelSectionOpen ? <ChevronRight className="w-4 h-4 mr-2" /> : <ChevronLeft className="w-4 h-4 mr-2" />}
          모델 미리보기
        </Button>
      </div>
    </div>
  );
}
