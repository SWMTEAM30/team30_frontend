import { useAtom } from 'jotai';
import { useCallback } from 'react';
import { closetCodinationAtom, panelAtom } from '@/atoms/chatAtoms';
import { useCodination } from './useCodination';

export const useCodinationCreation = () => {
  const [closetCodination, setClosetCodination] = useAtom(closetCodinationAtom);
  const setPanel = useAtom(panelAtom)[1];
  const { codinations, addCodination } = useCodination();

  // 두 코디네이션이 같은 옷들로 구성되어 있는지 확인하는 함수
  const isSameCodination = useCallback((codination1: Codination, codination2: Codination) => {
    if (codination1.cloths.length !== codination2.cloths.length) {
      return false;
    }

    // 각 코디네이션의 옷 ID들을 정렬하여 비교
    const clothIds1 = codination1.cloths.map((cloth) => cloth.id).sort();
    const clothIds2 = codination2.cloths.map((cloth) => cloth.id).sort();

    return clothIds1.every((id, index) => id === clothIds2[index]);
  }, []);

  // 코디네이션 생성 로직
  const createCodination = useCallback(async () => {
    if (!closetCodination || closetCodination.cloths.length === 0) {
      alert('코디네이션에 추가할 옷을 선택해주세요.');
      return false;
    }

    // 기존 코디네이션들과 중복 체크
    const isDuplicate = codinations.some((existingCodination) =>
      isSameCodination(existingCodination, {
        id: '',
        fitting_image: null,
        cloths: closetCodination.cloths,
      }),
    );

    if (isDuplicate) {
      alert('이미 같은 코디네이션이 저장되어 있습니다.');
      return false;
    }

    const newCodination: Codination = {
      id: `codination-${Date.now()}`,
      fitting_image: null,
      cloths: [...closetCodination.cloths],
    };

    try {
      // IndexedDB에 저장하면서 코디네이션 추가
      await addCodination(newCodination);
      setClosetCodination(null);
      setPanel('codination');
      
      console.log('새 코디네이션 생성됨:', newCodination);
      return true;
    } catch (error) {
      console.error('코디네이션 생성 실패:', error);
      alert('코디네이션 생성에 실패했습니다.');
      return false;
    }
  }, [closetCodination, codinations, isSameCodination, addCodination, setClosetCodination, setPanel]);

  return {
    createCodination,
    hasSelectedCloths: closetCodination && closetCodination.cloths.length > 0,
  };
};
