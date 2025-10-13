'use client';

import {
  activeCodinationAtom,
  closetAtom,
  closetCodinationAtom,
  codinationsAtom,
  panelAtom,
  virtualFittingStatusAtom,
} from '@/atoms/chatAtoms';
import ClosetClothCard from '@/components/chat/closet/ClosetClothCard';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { postFittingTryonCombo } from '@/api/fittingAPI';

export default function ClosetPanel() {
  const setPanel = useSetAtom(panelAtom);
  const closet = useAtomValue(closetAtom);
  const [codinations, setCodinations] = useAtom(codinationsAtom);
  const setActiveCodination = useSetAtom(activeCodinationAtom);
  const [closetCodination, setClosetCodination] = useAtom(closetCodinationAtom);
  const setVirtualFittingStatus = useSetAtom(virtualFittingStatusAtom);

  // 상의와 하의가 모두 선택되었는지 확인
  const hasUpperAndLower =
    closetCodination &&
    closetCodination.cloths.some((cloth) => cloth.url.includes('TOP')) &&
    closetCodination.cloths.some((cloth) => cloth.url.includes('BOTTOM'));

  const isDisabled = !closetCodination || closetCodination.cloths.length === 0 || !hasUpperAndLower;

  // 두 코디네이션이 같은 옷들로 구성되어 있는지 확인하는 함수
  const isSameCodination = (codination1: Codination, codination2: Codination) => {
    if (codination1.cloths.length !== codination2.cloths.length) {
      return false;
    }

    // 각 코디네이션의 옷 ID들을 정렬하여 비교
    const clothIds1 = codination1.cloths.map(cloth => cloth.id).sort();
    const clothIds2 = codination2.cloths.map(cloth => cloth.id).sort();

    return clothIds1.every((id, index) => id === clothIds2[index]);
  };

  const handleCreateCodination = () => {
    if (!closetCodination || closetCodination.cloths.length === 0) {
      alert('코디네이션에 추가할 옷을 선택해주세요.');
      return;
    }

    // 기존 코디네이션들과 중복 체크
    const isDuplicate = codinations.some(existingCodination => 
      isSameCodination(existingCodination, {
        id: '',
        fitting_image: null,
        cloths: closetCodination.cloths
      })
    );

    if (isDuplicate) {
      alert('이미 같은 코디네이션이 저장되어 있습니다.');
      return;
    }

    const newCodination: Codination = {
      id: `codination-${Date.now()}`,
      fitting_image: null,
      cloths: [...closetCodination.cloths],
    };

    setCodinations((prev) => [...prev, newCodination]);
    setClosetCodination(null);
    setPanel('codination');

    console.log('새 코디네이션 생성됨:', newCodination);
  };

  return (
    <div className="h-full flex flex-col">
      <div className="overflow-y-auto p-4 h-11/12">
        {closet.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <h3 className="text-xl font-semibold text-blue dark:text-white mb-2">옷장이 비어있습니다</h3>
            <p className="text-blue mb-4">AI와 대화하여 패션 아이템을 옷장에 추가해보세요</p>
            <p className="text-sm text-blue">추천받은 아이템을 클릭하면 옷장에 자동으로 추가됩니다</p>
          </div>
        ) : (
          <div className="grid grid-cols-4 gap-3">
            {closet.map((cloth, key) => (
              <ClosetClothCard key={key} cloth={cloth} />
            ))}
          </div>
        )}
      </div>
      <button
        className={`cursor-pointer h-1/12 btn bg-navy text-2xl text-white disabled:bg-blue-50`}
        disabled={isDisabled}
        onClick={handleCreateCodination}
      >
        코디하기
      </button>
    </div>
  );
}
