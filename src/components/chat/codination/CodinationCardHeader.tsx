'use client';

import CodinationClothItem from '@/components/chat/codination/CodinationClothItem';
import { ChevronDown, ChevronUp } from 'lucide-react';
import Image from 'next/image';
import { memo } from 'react';

interface CodinationCardHeaderProps {
  codination: Codination;
  isExpanded: boolean;
  isActive: boolean;
  onToggleExpanded: () => void;
}

const CodinationCardHeader = memo(function CodinationCardHeader({
  codination,
  isExpanded,
  isActive,
  onToggleExpanded,
}: CodinationCardHeaderProps) {
  return (
    <div
      className={`flex flex-row border-b-2 cursor-pointer transition-all duration-300 ${
        isActive
          ? 'border-blue-500 ring-2 ring-blue-200'
          : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
      } ${isExpanded ? 'border-b-slate-200 dark:border-b-slate-700' : 'border-b-transparent'}`}
      onClick={onToggleExpanded}
    >
      {/* 코디 정보 */}
      <div className="flex-1 p-4 flex flex-col justify-between">
        <div>
          <div className="mb-2">
            <p className="font-semibold text-3xl">
              코디
              <span className="text-lg"> {codination.cloths.length}개 아이템</span>
            </p>
          </div>

          {/* Description을 먼저 표시 */}
          {codination.description && (
            <div className="mb-3 p-3 ">
              <p className="text-xl">"{codination.description}"</p>
            </div>
          )}

          {/* 옷 아이템들 */}
          {codination.cloths.map((cloth: ClosetCloth) => (
            <CodinationClothItem key={cloth.id} cloth={cloth} />
          ))}

          {/* <div className="flex flex-col gap-1">
            {codination.cloths.map((product: ClosetCloth, clothKey: number) => (
              <span key={clothKey} className="px-2 py-1 text-xl rounded-full">
                - {product.name}
              </span>
            ))}
          </div> */}
        </div>

        {/* Chevron 아이콘을 헤더 하단에 배치 */}
        <div className="flex justify-center">
          {isExpanded ? (
            <ChevronUp className="w-10 h-10 text-slate-400" />
          ) : (
            <ChevronDown className="w-10 h-10 text-slate-400" />
          )}
        </div>
      </div>
    </div>
  );
});

export default CodinationCardHeader;
