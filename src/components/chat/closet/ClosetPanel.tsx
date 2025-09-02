import { cn } from '@/lib/utils';
import Image from 'next/image';
import { useState } from 'react';

interface ClothingItem {
  id: string;
  name: string;
  image: string;
  isSelected?: boolean;
}

// 샘플 옷 데이터
const sampleClothes: ClothingItem[] = [
  {
    id: '1',
    name: '베이직 티셔츠',
    image: '/cloth1.jpg',
  },
  {
    id: '2',
    name: '데님 팬츠',
    image: '/cloth2.jpg',
  },
  {
    id: '3',
    name: '옥스포드 셔츠',
    image: '/cloth3.jpg',
  },
  {
    id: '4',
    name: '슬랙스',
    image: '/cloth4.jpg',
  },
  {
    id: '5',
    name: '후드티',
    image: '/cloth5.jpg',
  },
  {
    id: '6',
    name: '레깅스',
    image: '/cloth6.jpg',
  },
  {
    id: '7',
    name: '블라우스',
    image: '/cloth7.jpg',
  },
  {
    id: '8',
    name: '미디 스커트',
    image: '/cloth8.jpg',
  },
  {
    id: '9',
    name: '니트 베스트',
    image: '/cloth9.jpg',
  },
];

function ClothingCard({ item, isSelected, onClick }: { item: ClothingItem; isSelected: boolean; onClick: () => void }) {
  return (
    <div
      onClick={onClick}
      className={cn(
        'relative bg-beige-200 border-2 cursor-pointer transition-all duration-200 hover:shadow-md group',
        isSelected ? 'border-blue-500 ring-2 ring-blue-200' : 'border-blue-100 hover:border-blue-300',
      )}
    >
      {/* 이미지 */}
      <div className="relative aspect-square w-full overflow-hidden">
        <Image
          src={item.image}
          alt={item.name}
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
        <h3 className="font-medium text-gray-900 text-sm mb-1 truncate">{item.name}</h3>
      </div>
    </div>
  );
}

export default function ClosetPanel({ tabs }: { tabs: string[] }) {
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [filterCategory, setFilterCategory] = useState<string>('전체');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const handleItemClick = (itemId: string) => {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(itemId)) {
      newSelected.delete(itemId);
    } else {
      newSelected.add(itemId);
    }
    setSelectedItems(newSelected);
  };

  return (
    <div className="h-full flex flex-col">
      <div className="overflow-y-auto p-4 grid grid-cols-3 gap-3">
        {sampleClothes.map((item) => (
          <ClothingCard
            key={item.id}
            item={item}
            isSelected={selectedItems.has(item.id)}
            onClick={() => handleItemClick(item.id)}
          />
        ))}
      </div>
      <button className="h-1/12 btn bg-navy text-2xl text-white">피팅하기</button>
    </div>
  );
}
