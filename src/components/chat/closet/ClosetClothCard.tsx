'use client';

import Image from 'next/image';
import ClothModal from '@/components/chat/modal/ClothModal';

interface ClosetClothCardProps {
  cloth: ClosetCloth;
}

export default function ClosetClothCard({ cloth }: ClosetClothCardProps) {
  // ClosetCloth를 Product 타입으로 변환
  const product: Product = {
    product_id: cloth.id,
    product_url: cloth.url,
  };

  return (
    <div className="aspect-[3/4] flex flex-col relative border-2 transition-all duration-200 hover:shadow-md group dark:bg-blue-800">
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
