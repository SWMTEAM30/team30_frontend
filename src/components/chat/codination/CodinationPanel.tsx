'use client';

import { Plus } from 'lucide-react';
import CodinationCard from '@/components/chat/codination/CodinationCard';
import { useCodination } from '@/hooks/useCodination';

export default function CodinationPanel() {
  const { codinations } = useCodination();

  if (codinations.length === 0)
    return (
      <div className="h-full flex flex-col dark:bg-slate-800">
        <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
          <div className="w-24 h-24 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mb-6">
            <Plus className="w-12 h-12 " />
          </div>
          <h3 className="text-xl font-semibold mb-3">아직 코디가 없습니다</h3>
          <p className="mb-6 max-w-md">AI와 대화하여 가상피팅에 사용할 옷 조합들을 추가해보세요</p>
        </div>
      </div>
    );

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 overflow-y-auto">
        <div className="flex flex-col gap-4 p-4">
          {codinations.map((codination, key) => (
            <CodinationCard codination={codination} key={key} />
          ))}
        </div>
      </div>
    </div>
  );
}
