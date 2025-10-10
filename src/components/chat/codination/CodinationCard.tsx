'use client';

import { activeCodinationAtom, closetCodinationAtom, codinationsAtom, panelAtom } from '@/atoms/chatAtoms';
import { useAtom, useSetAtom } from 'jotai';
import { Button } from '@/components/ui/button';
import { Trash2, Plus } from 'lucide-react';
import Image from 'next/image';

export default function CodinationCard({ codination }: { codination: any }) {
  const setPanel = useSetAtom(panelAtom);
  const [codinations, setCodinations] = useAtom(codinationsAtom);
  const [activeCodination, setActiveCodination] = useAtom(activeCodinationAtom);
  const setClosetCodination = useSetAtom(closetCodinationAtom);

  const handleRemoveCodination = (codi_id: string) => {
    setCodinations((prev: Codination[]) => prev.filter((codination) => codination.id !== codi_id));
  };

  const handleEditCodination = (codination: Codination) => {
    setPanel('closet');
    setClosetCodination(codination);
  };

  const selectCodination = (codination: Codination) => {
    setActiveCodination(codination);
  };

  return (
    <div
      className={`w-full bg-white dark:bg-slate-800 rounded-2xl transition-all duration-300 flex flex-row border-2 ${
        codination.id === activeCodination?.id
          ? 'border-blue-500 ring-2 ring-blue-200'
          : 'border-slate-200 dark:border-slate-700'
      }`}
    >
      {/* 아이템 이미지들 */}
      <div className="flex-shrink-0 p-4">
        <div className="flex gap-2">
          {codination.cloths.map((product: ClosetCloth, clothKey: number) => (
            <div key={clothKey} className="relative">
              <Image
                className="object-cover w-20 h-20 rounded-lg border border-slate-200"
                src={product.url}
                alt={product.name}
                width={80}
                height={80}
              />
            </div>
          ))}
        </div>
      </div>

      {/* 코디 정보 */}
      <div className="flex-1 p-4 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-2">
            <p className="font-semibold text-slate-900 dark:text-white text-lg">
              코디
              <span className="text-slate-600 dark:text-slate-400 text-md"> {codination.cloths.length}개 아이템</span>
            </p>

            <Button
              size="icon"
              variant="ghost"
              onClick={() => handleRemoveCodination(codination.id)}
              className="w-8 h-8 text-slate-400 hover:text-red-500"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
          <div className="flex flex-wrap gap-1">
            {codination.cloths.map((product: ClosetCloth, clothKey: number) => (
              <span
                key={clothKey}
                className="px-2 py-1 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs rounded-full"
              >
                {product.name}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* 액션 버튼들 */}
      <div className="flex-shrink-0 p-4 flex flex-col gap-2">
        <Button
          className="w-24 bg-yellow hover:bg-yellow/90 text-navy font-medium"
          size="sm"
          onClick={() => {
            handleEditCodination(codination);
          }}
        >
          수정
        </Button>
      </div>
    </div>
  );
}
