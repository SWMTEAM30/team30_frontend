'use client';

import { Trash2 } from 'lucide-react';
import { memo } from 'react';

interface CodinationActionsProps {
  codination: Codination;
  onVirtualFitting: () => void;
  onRemoveCodination: (codinationId: string) => void;
}

const CodinationActions = memo(function CodinationActions({
  codination,
  onVirtualFitting,
  onRemoveCodination,
}: CodinationActionsProps) {
  return (
    <div className="space-y-2">
      {codination.fitting_id ? (
        <button
          onClick={onVirtualFitting}
          className="w-full flex items-center gap-2 p-3 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/20 text-green-600 dark:text-green-400 transition-colors"
        >
          <div className="w-4 h-4 rounded-full bg-green-500"></div>
          <span className="text-lg">피팅 결과 보기</span>
        </button>
      ) : (
        <button
          onClick={onVirtualFitting}
          className="w-full flex items-center gap-2 p-3 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 text-blue-600 dark:text-blue-400 transition-colors"
        >
          <div className="w-4 h-4 rounded-full bg-blue-500 dark:bg-blue-400"></div>
          <span className="text-lg">가상 피팅하기</span>
        </button>
      )}

      <button
        onClick={() => onRemoveCodination(codination.id)}
        className="w-full flex items-center gap-2 p-3 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 transition-colors"
      >
        <Trash2 className="w-4 h-4" />
        <span className="text-lg">삭제하기</span>
      </button>
    </div>
  );
});

export default CodinationActions;
