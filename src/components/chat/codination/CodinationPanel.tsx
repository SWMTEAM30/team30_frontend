'use client';

import { activeCodinationAtom, closetAtom, closetCodinationAtom, codinationsAtom, panelAtom } from '@/atoms/chatAtoms';
import { useAtom, useSetAtom } from 'jotai';
import { postFittingTryonCombo } from '@/api/fittingAPI';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import CodinationCard from '@/components/chat/codination/CodinationCard';
import { useCodination } from '@/hooks/useCodination';
import { useFitting } from '@/hooks/useFitting';
import { getFittingStatusTaskId } from '@/api/fittingAPI';
import { userAtom } from '@/atoms/authAtoms';

export default function CodinationPanel() {
  const setPanel = useSetAtom(panelAtom);
  const setActiveCodination = useSetAtom(activeCodinationAtom);
  const [closetCodination, setClosetCodination] = useAtom(closetCodinationAtom);
  const [activeCodination] = useAtom(activeCodinationAtom);
  const [user] = useAtom(userAtom);
  
  // 스토리지 훅 사용
  const { codinations, updateCodination } = useCodination();
  const { updateFittingStatus } = useFitting(activeCodination?.id);

  // 비동기 피팅 결과 폴링 함수
  const pollFittingResult = async (taskId: string) => {
    const maxAttempts = 30; // 최대 30번 시도 (약 5분)
    const pollInterval = 10000; // 10초마다 폴링
    
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      try {
        await new Promise(resolve => setTimeout(resolve, pollInterval));
        
        const response = await getFittingStatusTaskId(taskId);
        console.log(`피팅 상태 확인 (${attempt + 1}/${maxAttempts}):`, response);
        
        if (response.status === 'success' && response.data?.download_url) {
          // 피팅 완료
          console.log('🎉 피팅 성공! 상태 업데이트 중...', response.data.download_url);
          await updateFittingStatus({
            status: 'success',
            resultUrl: response.data.download_url,
            taskId: taskId,
          });
          console.log('✅ 피팅 결과 폴링 완료:', response.data.download_url);
          return;
        } else if (response.status === 'fail') {
          // 피팅 실패
          console.log('💥 피팅 실패! 에러 상태 업데이트 중...', response.message);
          await updateFittingStatus({
            status: 'error',
            errorMessage: response.message || '피팅 처리 중 오류가 발생했습니다.',
            taskId: taskId,
          });
          console.error('❌ 피팅 폴링 실패:', response.message);
          return;
        }
        // 아직 처리 중이면 계속 폴링
      } catch (error) {
        console.error(`피팅 상태 확인 오류 (${attempt + 1}/${maxAttempts}):`, error);
        if (attempt === maxAttempts - 1) {
          // 마지막 시도에서도 실패하면 에러 처리
          await updateFittingStatus({
            status: 'error',
            errorMessage: '피팅 결과를 가져오는 중 오류가 발생했습니다.',
            taskId: taskId,
          });
        }
      }
    }
    
    // 최대 시도 횟수 초과
    await updateFittingStatus({
      status: 'error',
      errorMessage: '피팅 처리 시간이 초과되었습니다.',
      taskId: taskId,
    });
    console.error('⏰ 피팅 폴링 시간 초과');
  };
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

  const handleSubmitFitting = async () => {
    if (isDisabled) return;

    // 선택된 옷들을 upper/lower로 분류
    const upperCloth = closetCodination.cloths.find((cloth) => cloth.url.includes('TOP'));
    const lowerCloth = closetCodination.cloths.find((cloth) => cloth.url.includes('BOTTOM'));

    // upper와 lower 옷이 모두 있는지 확인
    if (!upperCloth || !lowerCloth) {
      alert('상의와 하의를 각각 하나씩 선택해주세요.');
      return;
    }

    // 사용자 프로필의 모델 이미지 체크
    if (user?.userId) {
      try {
        const { loadUserProfile } = await import('@/lib/indexedDB');
        const userProfile = await loadUserProfile(user.userId);
        if (!userProfile?.modelImage) {
          // 세팅 패널 모달 띄우기
          setPanel('settings');
          return;
        }
      } catch (error) {
        console.error('사용자 프로필 로드 실패:', error);
        // 세팅 패널 모달 띄우기
        setPanel('settings');
        return;
      }
    }

    // 가상피팅 요청 시작 (비동기로 실행, 결과를 기다리지 않음)
    console.log('🚀 startVirtualFitting 호출:', { upperId: upperCloth.id, lowerId: lowerCloth.id });

    // 즉시 pending 상태로 설정
    await updateFittingStatus({
      codinationId: closetCodination.id,
      status: 'pending',
      resultUrl: null,
      errorMessage: null,
      taskId: null,
    });

    // 사용자 모델 이미지 가져오기
    let modelImageUrl = '/model_image.jpg'; // 기본값
    if (user?.modelImage) {
      modelImageUrl = user.modelImage;
    }

    // API 호출
    postFittingTryonCombo(upperCloth.id, lowerCloth.id, modelImageUrl)
      .then(async (response) => {
        console.log('📡 API 응답:', response);
        if (response.status === 'success') {
          console.log('✅ 가상피팅 요청 성공:', response.data);

          // 결과가 바로 있는 경우 (동기 응답)
          if (response.data?.download_url) {
            await updateFittingStatus({
              status: 'success',
              resultUrl: response.data.download_url,
              taskId: response.data.task_id || null,
            });
          }
          // taskId만 있는 경우 (비동기 처리)
          else if (response.data?.task_id) {
            await updateFittingStatus({
              taskId: response.data.task_id,
            });
            
            // 비동기 피팅 결과 폴링 시작
            pollFittingResult(response.data.task_id);
          }
        } else {
          console.error('❌ 가상피팅 요청 실패:', response.message);
          await updateFittingStatus({
            status: 'error',
            errorMessage: response.message,
          });
        }
      })
      .catch(async (error) => {
        console.error('❌ 가상피팅 요청 에러:', error);
        await updateFittingStatus({
          status: 'error',
          errorMessage: error.message,
        });
      });

    // 즉시 fitting 패널로 이동
    setPanel('fitting');
    setActiveCodination(closetCodination);
    setClosetCodination(null);
    
    // 코디네이션 업데이트
    await updateCodination(closetCodination);
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
            className={`w-full cursor-pointer h-12 btn ${
              closetCodination.fitting_image 
                ? 'bg-green-600 hover:bg-green-700' 
                : 'bg-navy'
            } text-lg text-white disabled:bg-blue-50`}
            disabled={isDisabled}
            onClick={handleSubmitFitting}
          >
            {closetCodination.fitting_image ? '피팅 결과 보기' : '가상피팅하기'}
          </button>
        </div>
      )}
    </div>
  );
}
