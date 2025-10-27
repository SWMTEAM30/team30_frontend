'use client';

import Image from 'next/image';
import { memo } from 'react';
import ClothModal from '@/components/chat/modal/ClothModal';

interface CodinationClothItemProps {
  cloth: ClosetCloth;
}

const CodinationClothItem = memo(function CodinationClothItem({ cloth }: CodinationClothItemProps) {
  return (
    <ClothModal cloth={cloth}>
      <div className="flex items-center gap-4 p-4 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer transition-colors">
        <div className="relative w-20 aspect-[3/4] flex-shrink-0">
          <Image className="object-cover rounded-lg border border-slate-200" src={cloth.url} alt={cloth.name} fill />
        </div>
        <div className="flex flex-col flex-1 min-w-0">
          <span className="text-lg font-semibold dark:text-white truncate">{cloth.name}</span>
          <span className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2">{cloth.description}</span>
        </div>
      </div>
    </ClothModal>
  );
});

export default CodinationClothItem;
