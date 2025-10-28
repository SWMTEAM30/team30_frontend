'use client';

import { activeCodinationAtom } from '@/atoms/chatAtoms';
import { useAtom } from 'jotai';
import { useState, useCallback, memo } from 'react';
import { useCodination } from '@/hooks/useCodination';
import { useVirtualFitting } from '@/hooks/useVirtualFitting';
import CodinationCardHeader from './CodinationCardHeader';
import CodinationClothItem from './CodinationClothItem';
import CodinationActions from './CodinationActions';
import ClothModal from '@/components/chat/modal/ClothModal';

interface CodinationCardProps {
  codination: Codination;
}

const CodinationCard = memo(function CodinationCard({ codination }: CodinationCardProps) {
  const [activeCodination] = useAtom(activeCodinationAtom);
  const [isExpanded, setIsExpanded] = useState(false);

  // 스토리지 훅 사용
  const { removeCodination } = useCodination();
  const { executeVirtualFitting } = useVirtualFitting({ codinationId: codination.id });

  const handleRemoveCodination = useCallback(
    async (codi_id: string) => {
      await removeCodination(codi_id);
    },
    [removeCodination],
  );

  const handleVirtualFitting = useCallback(async () => {
    await executeVirtualFitting(codination.cloths);
  }, [executeVirtualFitting, codination.cloths]);

  const handleToggleExpanded = useCallback(() => {
    setIsExpanded((prev) => !prev);
  }, []);

  return (
    <div className="w-full bg-white dark:bg-slate-800 rounded-2xl transition-all duration-300 border-2 overflow-hidden shadow-sm hover:shadow-md">
      {/* 메인 카드 헤더 */}
      <CodinationCardHeader
        codination={codination}
        isExpanded={isExpanded}
        isActive={codination.id === activeCodination?.id}
        onToggleExpanded={handleToggleExpanded}
      />

      {/* 콜랩스 컨텐츠 */}
      <div
        className={`transition-all duration-300 overflow-hidden ${
          isExpanded ? 'max-h-none opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="p-4 space-y-2">
          {/* 액션 버튼들 */}
          <CodinationActions
            codination={codination}
            onVirtualFitting={handleVirtualFitting}
            onRemoveCodination={handleRemoveCodination}
          />
        </div>
      </div>
    </div>
  );
});

export default CodinationCard;
