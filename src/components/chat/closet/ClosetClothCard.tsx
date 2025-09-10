import { closetCodinationAtom } from '@/atoms/chatAtoms';
import { useCodination } from '@/hooks/useCodination';
import { cn } from '@/lib/utils';
import { useAtom } from 'jotai';
import Image from 'next/image';

interface ClosetClothCardProps {
  cloth: ClosetCloth;
}

export default function ClosetClothCard({ cloth }: ClosetClothCardProps) {
  const { addNewCodination } = useCodination();
  const [closetCodination, setClosetCodination] = useAtom(closetCodinationAtom);
  const isSelected = closetCodination?.cloths.some((c) => c.id == cloth.id);

  const handleClothClick = (cloth: ClosetCloth) => {
    if (!isSelected)
      // 추가하는 상황
      setClosetCodination((prev) => {
        if (!prev) return addNewCodination([cloth]);
        return {
          id: prev.id,
          fitting_image: prev.fitting_image,
          cloths: [...prev.cloths, cloth],
        };
      });
    else
      // 제거하는 상황
      setClosetCodination((prev) => {
        if (!prev) return addNewCodination([]);
        return {
          id: prev.id,
          fitting_image: prev.fitting_image,
          cloths: prev.cloths.filter((c) => c.id !== cloth.id),
        };
      });
  };

  return (
    <div
      onClick={() => handleClothClick(cloth)}
      className={cn(
        'h-128 flex flex-col relative  bg-beige-200 border-2 cursor-pointer transition-all duration-200 hover:shadow-md group',
        isSelected ? 'border-blue-500 ring-2 ring-blue-200' : 'border-blue-100 hover:border-blue-300',
      )}
    >
      {/* 이미지 */}
      <div className="relative aspect-square w-full h-full flex-grow overflow-hidden">
        <Image
          src={cloth.url}
          alt={cloth.id}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-200"
        />

        {/* 선택 상태 오버레이 */}
        {isSelected && (
          <div className="absolute inset-0 bg-blue-500/20 flex items-center justify-center">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>
        )}
      </div>

      {/* 정보 */}
      <div className="p-3">
        <h3 className="font-medium text-gray-900 text-lg mb-1 truncate">{cloth.name}</h3>
      </div>
    </div>
  );
}
