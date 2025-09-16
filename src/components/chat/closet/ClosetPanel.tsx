'use client';

import { activeCodinationAtom, closetAtom, closetCodinationAtom, codinationsAtom, panelAtom } from '@/atoms/chatAtoms';
import ClosetClothCard from '@/components/chat/closet/ClosetClothCard';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';

export default function ClosetPanel() {
  const setPanel = useSetAtom(panelAtom);
  const closet = useAtomValue(closetAtom);
  const setCodinations = useSetAtom(codinationsAtom);
  const setActiveCodination = useSetAtom(activeCodinationAtom);
  const [closetCodination, setClosetCodination] = useAtom(closetCodinationAtom);
  const isDisabled = !closetCodination || closetCodination.cloths.length == 0;

  const handleSubmitFitting = () => {
    if (isDisabled) return;
    setPanel('fitting');
    setActiveCodination(closetCodination);
    setClosetCodination(null);
    setCodinations((prev) => {
      if (!prev) return [closetCodination];
      const newCodinations = prev.filter((e) => e.id !== closetCodination.id);
      return [...newCodinations, closetCodination];
    });
  };

  return (
    <div className="h-full flex flex-col">
      <div className="overflow-y-auto p-4 h-11/12">
        {closet.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">옷장이 비어있습니다</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">AI와 대화하여 패션 아이템을 옷장에 추가해보세요</p>
            <p className="text-sm text-gray-500 dark:text-gray-500">
              추천받은 아이템을 클릭하면 옷장에 자동으로 추가됩니다
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-3 ">
            {closet.map((cloth, key) => (
              <ClosetClothCard key={key} cloth={cloth} />
            ))}
          </div>
        )}
      </div>
      <button
        className={`cursor-pointer h-1/12 btn bg-navy text-2xl text-white disabled:bg-blue-50`}
        disabled={isDisabled}
        onClick={() => {
          handleSubmitFitting();
        }}
      >
        코디 추가하기
      </button>
    </div>
  );
}
