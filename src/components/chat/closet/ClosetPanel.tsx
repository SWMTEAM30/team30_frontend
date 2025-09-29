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
    <div className="h-full flex flex-col">
      <div className="overflow-y-auto p-4 h-11/12">
        {closet.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <h3 className="text-xl font-semibold text-blue dark:text-white mb-2">옷장이 비어있습니다</h3>
            <p className="text-blue mb-4">AI와 대화하여 패션 아이템을 옷장에 추가해보세요</p>
            <p className="text-sm text-blue">추천받은 아이템을 클릭하면 옷장에 자동으로 추가됩니다</p>
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
        onClick={handleSubmitFitting}
      >
        코디 추가하기
      </button>
    </div>
  );
}
