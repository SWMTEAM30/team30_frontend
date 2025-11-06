import { useCallback } from 'react';
import { useAtom } from 'jotai';
import { panelAtom } from '@/atoms/chatAtoms';
import { userAtom } from '@/atoms/authAtoms';
import { postFittingTryonCombo, getFittingStatusTaskId } from '@/api/fittingAPI';
import { useFitting } from '@/hooks/useFitting';

interface UseVirtualFittingProps {
  codinationId: string;
}

export const useVirtualFitting = ({ codinationId }: UseVirtualFittingProps) => {
  const setPanel = useAtom(panelAtom)[1];
  const [user] = useAtom(userAtom);
  const { updateFittingStatus } = useFitting(codinationId);

  // 비동기 피팅 결과 폴링 함수
  const pollFittingResult = useCallback(
    async (taskId: string) => {
      const maxAttempts = 10; // 최대 10번 시도
      const pollInterval = 10000; // 10초마다 폴링

      for (let attempt = 0; attempt < maxAttempts; attempt++) {
        try {
          await new Promise((resolve) => setTimeout(resolve, pollInterval));

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
    },
    [updateFittingStatus],
  );

  // 가상 피팅 실행 함수
  const executeVirtualFitting = useCallback(
    async (cloths: ClosetCloth[]) => {
      // 상의와 하의가 모두 있는지 확인
      const upperCloth = cloths.find((cloth) => cloth.url.includes('TOP'));
      const lowerCloth = cloths.find((cloth) => cloth.url.includes('BOTTOM'));

      if (!upperCloth || !lowerCloth) {
        alert('상의와 하의를 각각 하나씩 포함한 코디네이션만 가상 피팅이 가능합니다.');
        return false;
      }

      // 가상피팅 요청 시작
      console.log('🚀 가상피팅 시작:', { upperId: upperCloth.id, lowerId: lowerCloth.id });

      // 즉시 pending 상태로 설정
      await updateFittingStatus({
        codinationId: codinationId,
        status: 'pending',
        resultUrl: null,
        errorMessage: null,
        taskId: null,
      });

      // 패널을 피팅으로 변경
      setPanel('fitting');

      // 사용자 모델 이미지 가져오기
      let modelImageUrl = user?.modelImage || '/model_image.jpg'; // 기본값

      try {
        // API 호출
        const response = await postFittingTryonCombo(upperCloth.id, lowerCloth.id, modelImageUrl);
        console.log('가상피팅 응답:', response);

        if (response.status === 'success') {
          // 결과가 바로 있는 경우 (동기 응답)
          if (response.data?.download_url) {
            await updateFittingStatus({
              codinationId: codinationId,
              status: 'success',
              resultUrl: response.data.download_url,
              errorMessage: null,
              taskId: response.data.task_id,
            });
          }
          // taskId만 있는 경우 (비동기 처리)
          else if (response.data?.task_id) {
            await updateFittingStatus({
              codinationId: codinationId,
              taskId: response.data.task_id,
            });

            // 비동기 피팅 결과 폴링 시작
            pollFittingResult(response.data.task_id);
          }
          return true;
        } else {
          await updateFittingStatus({
            codinationId: codinationId,
            status: 'error',
            resultUrl: null,
            errorMessage: response.message || '가상 피팅에 실패했습니다.',
            taskId: null,
          });
          return false;
        }
      } catch (error) {
        console.error('가상피팅 오류:', error);
        await updateFittingStatus({
          codinationId: codinationId,
          status: 'error',
          resultUrl: null,
          errorMessage: '가상 피팅 중 오류가 발생했습니다.',
          taskId: null,
        });
        return false;
      }
    },
    [codinationId, updateFittingStatus, setPanel, user, pollFittingResult],
  );

  return {
    executeVirtualFitting,
  };
};
