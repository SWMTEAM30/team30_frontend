'use client';

import { closetCodinationAtom } from '@/atoms/chatAtoms';
import { useCodination } from '@/hooks/useCodination';
import { cn } from '@/lib/utils';
import { useAtom } from 'jotai';
import Image from 'next/image';
import ClothModal from '@/components/chat/modal/ClothModal';

interface ClosetClothCardProps {
  cloth: ClosetCloth;
}

export default function ClosetClothCard({ cloth }: ClosetClothCardProps) {
  const { addCodination } = useCodination();
  const [closetCodination, setClosetCodination] = useAtom(closetCodinationAtom);
  const isSelected = closetCodination?.cloths.some((c) => c.id == cloth.id);

  const handleClothClick = (cloth: ClosetCloth) => {
    if (!isSelected)
      // 추가하는 상황
      setClosetCodination((prev) => {
        if (!prev) {
          const newCodination = {
            id: new Date().getTime().toString(),
            fitting_image: null,
            cloths: [cloth],
          };
          addCodination(newCodination);
          return newCodination;
        }
        return {
          id: prev.id,
          fitting_image: prev.fitting_image,
          cloths: [...prev.cloths, cloth],
        };
      });
    else
      // 제거하는 상황
      setClosetCodination((prev) => {
        if (!prev) return null;
        return {
          id: prev.id,
          fitting_image: prev.fitting_image,
          cloths: prev.cloths.filter((c) => c.id !== cloth.id),
        };
      });
  };

  // ClosetCloth를 Product 타입으로 변환
  const product: Product = {
    product_id: cloth.id,
    product_url: cloth.url
  };

  return (
    <div className="h-128 flex flex-col relative border-2 transition-all duration-200 hover:shadow-md group">
      {/* ClothModal로 감싸기 */}
      <ClothModal product={product}>
        <div className="h-full flex flex-col cursor-pointer">
          {/* 이미지 */}
          <div className="relative aspect-square w-full h-full flex-grow overflow-hidden">
            <Image
              src={cloth.url}
              alt={cloth.id}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-200"
            />
          </div>

          {/* 정보 */}
          <div className="p-3">
            <h3 className="font-medium text-gray-900 text-lg mb-1 truncate">{cloth.name}</h3>
          </div>
        </div>
      </ClothModal>

      {/* 선택 버튼 */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          handleClothClick(cloth);
        }}
        className={cn(
          'absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200',
          isSelected 
            ? 'bg-blue-500 text-white' 
            : 'bg-white/80 text-gray-600 hover:bg-blue-500 hover:text-white'
        )}
      >
        {isSelected ? (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
        ) : (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        )}
      </button>
    </div>
  );
}
