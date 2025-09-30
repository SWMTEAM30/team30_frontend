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
import ChatFittingCodination from '@/components/chat/codination/CodinationCard';

export default function CodinationPanel() {
  const setPanel = useSetAtom(panelAtom);
  const closet = useAtomValue(closetAtom);
  const setCodinations = useSetAtom(codinationsAtom);
  const setActiveCodination = useSetAtom(activeCodinationAtom);
  const [closetCodination, setClosetCodination] = useAtom(closetCodinationAtom);
  const setVirtualFittingStatus = useSetAtom(virtualFittingStatusAtom);
  // 상의와 하의가 모두 선택되었는지 확인
  const hasUpperAndLower =
    closetCodination &&
    closetCodination.cloths.some((cloth) => cloth.url.includes('TOP')) &&
    closetCodination.cloths.some((cloth) => cloth.url.includes('BOTTOM'));

  const isDisabled = !closetCodination || closetCodination.cloths.length === 0 || !hasUpperAndLower;

  const handleSubmitFitting = () => {
    if (isDisabled) return;

    // 선택된 옷들을 upper/lower로 분류
    const upperCloth = closetCodination.cloths.find((cloth) => cloth.url.includes('TOP'));
    const lowerCloth = closetCodination.cloths.find((cloth) => cloth.url.includes('BOTTOM'));

    // upper와 lower 옷이 모두 있는지 확인
    if (!upperCloth || !lowerCloth) {
      alert('상의와 하의를 각각 하나씩 선택해주세요.');
      return;
    }

    // 가상피팅 요청 시작 (비동기로 실행, 결과를 기다리지 않음)
    console.log('🚀 startVirtualFitting 호출:', { upperId: upperCloth.id, lowerId: lowerCloth.id });

    // 즉시 pending 상태로 설정
    setVirtualFittingStatus({
      codinationId: closetCodination.id,
      status: 'pending',
      resultUrl: null,
      errorMessage: null,
      taskId: null,
    });

    // API 호출
    postFittingTryonCombo(upperCloth.id, lowerCloth.id)
      .then((response) => {
        console.log('📡 API 응답:', response);
        if (response.status === 'success') {
          console.log('✅ 가상피팅 요청 성공:', response.data);

          // 결과가 바로 있는 경우 (동기 응답)
          if (response.data?.download_url) {
            setVirtualFittingStatus((prev) => ({
              ...prev,
              status: 'success',
              resultUrl: response.data.download_url,
              taskId: response.data.task_id || null,
            }));
          }
          // taskId만 있는 경우 (비동기 처리)
          else if (response.data?.task_id) {
            setVirtualFittingStatus((prev) => ({
              ...prev,
              taskId: response.data.task_id,
            }));
          }
        } else {
          console.error('❌ 가상피팅 요청 실패:', response.message);
          setVirtualFittingStatus((prev) => ({
            ...prev,
            status: 'error',
            errorMessage: response.message,
          }));
        }
      })
      .catch((error) => {
        console.error('❌ 가상피팅 요청 에러:', error);
        setVirtualFittingStatus((prev) => ({
          ...prev,
          status: 'error',
          errorMessage: error.message,
        }));
      });

    // 즉시 fitting 패널로 이동
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
    <>
      <ChatFittingCodination />
    </>
  );
}
