'use client';

import {
  activeCodinationAtom,
  closetAtom,
  closetCodinationAtom,
  codinationsAtom,
  panelAtom,
  virtualFittingStatusAtom,
} from '@/atoms/chatAtoms';
import { useAtom, useSetAtom } from 'jotai';
import { postFittingTryonCombo } from '@/api/fittingAPI';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import CodinationCard from '@/components/chat/codination/CodinationCard';

export default function CodinationPanel() {
  const setPanel = useSetAtom(panelAtom);
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

  const handleAddNewCodination = () => {
    setPanel('closet');
    setActiveCodination(null);
    setClosetCodination(null);
  };

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

  if (codinations.length === 0)
    return (
      <div className="h-full flex flex-col">
        <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
          <div className="w-24 h-24 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-6">
            <Plus className="w-12 h-12 text-slate-400" />
          </div>
          <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">아직 코디가 없습니다</h3>
          <p className="text-slate-600 dark:text-slate-400 mb-6 max-w-md">
            AI와 대화하여 가상피팅에 사용할 옷 조합들을 추가해보세요
          </p>
          <Button onClick={handleAddNewCodination} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3">
            <Plus className="w-4 h-4 mr-2" />
            코디 추가하기
          </Button>
        </div>
        {closetCodination && closetCodination.cloths.length > 0 && (
          <div className="p-4 border-t border-slate-200 dark:border-slate-700">
            <button
              className={`w-full cursor-pointer h-12 btn bg-navy text-lg text-white disabled:bg-blue-50`}
              disabled={isDisabled}
              onClick={handleSubmitFitting}
            >
              가상피팅하기
            </button>
          </div>
        )}
      </div>
    );

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 overflow-y-auto">
        <div className="flex flex-col gap-4 p-4">
          {codinations.map((codination, key) => (
            <CodinationCard codination={codination} key={key}></CodinationCard>
          ))}
        </div>
      </div>
      {closetCodination && closetCodination.cloths.length > 0 && (
        <div className="p-4 border-t border-slate-200 dark:border-slate-700">
          <button
            className={`w-full cursor-pointer h-12 btn bg-navy text-lg text-white disabled:bg-blue-50`}
            disabled={isDisabled}
            onClick={handleSubmitFitting}
          >
            가상피팅하기
          </button>
        </div>
      )}
    </div>
  );
}
