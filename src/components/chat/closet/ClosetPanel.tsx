'use client';

import { useState } from 'react';
import { closetAtom } from '@/atoms/chatAtoms';
import ClosetClothCard from '@/components/chat/closet/ClosetClothCard';
import CodinationModal from '@/components/chat/modal/CodinationModal';
import { useAtomValue } from 'jotai';

export default function ClosetPanel() {
  const closet = useAtomValue(closetAtom);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="h-full flex flex-col">
      <div className="overflow-y-auto p-4 h-11/12">
        {closet.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <h3 className="text-xl font-semibold text-blue dark:text-white mb-2">옷장이 비어있습니다</h3>
            <p className="text-blue mb-4">AI와 대화하여 패션 아이템을 옷장에 추가해보세요</p>
            <p className="text-sm text-blue">추천받은 아이템을 클릭하면 옷장에 자동으로 추가됩니다</p>
          </div>
        ) : (
          <div className="grid grid-cols-4 gap-3">
            {closet.map((cloth, key) => (
              <ClosetClothCard key={key} cloth={cloth} />
            ))}
          </div>
        )}
      </div>
      <button
        className="cursor-pointer h-1/12 btn bg-navy text-2xl text-white hover:bg-navy-700 transition-colors"
        onClick={handleOpenModal}
      >
        코디하기
      </button>
      
      <CodinationModal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal} 
      />
    </div>
  );
}
