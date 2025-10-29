'use client';

import Image from 'next/image';
import ClothModal from '@/components/chat/modal/ClothModal';
import LucideIcon from '@/components/ui/icons/LucideIcon';
import { useCloset } from '@/hooks/useCloset';

interface ClosetClothCardProps {
  cloth: ClosetCloth;
}

export default function ClosetClothCard({ cloth }: ClosetClothCardProps) {
  const { removeClothFromCloset } = useCloset();
  // ClosetCloth를 Product 타입으로 변환
  const product: Product = {
    product_id: cloth.id,
    product_url: cloth.url,
  };

  return (
    <div className="aspect-[3/4] flex flex-col relative border-2 transition-all duration-200 hover:shadow-md group dark:bg-blue-800">
      {/* 삭제 버튼 (우상단) */}
      <button
        aria-label="remove-from-closet"
        className="absolute top-2 right-2 z-10 w-8 h-8 rounded-full bg-white/90 dark:bg-slate-700 text-slate-600 dark:text-slate-200 shadow hover:bg-white dark:hover:bg-slate-600 flex items-center justify-center"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          removeClothFromCloset(cloth.id);
        }}
      >
        <LucideIcon name={'X'} size={16} />
      </button>
      {/* ClothModal로 감싸기 */}
      <ClothModal product={product}>
        <div className="h-full flex flex-col cursor-pointer">
          {/* 이미지 */}
          <div className="relative w-full flex-grow overflow-hidden">
            <Image
              src={cloth.url}
              alt={cloth.id}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-200"
            />
          </div>

          {/* 정보 */}
          <div className="p-3">
            <h3 className="font-medium  text-lg mb-1 truncate ">{cloth.name}</h3>
          </div>
        </div>
      </ClothModal>
    </div>
  );
}
