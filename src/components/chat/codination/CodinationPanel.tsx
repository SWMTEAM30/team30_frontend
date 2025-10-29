'use client';

import { activeCodinationAtom, closetAtom, closetCodinationAtom, panelAtom } from '@/atoms/chatAtoms';
import { useAtom, useSetAtom } from 'jotai';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import CodinationCard from '@/components/chat/codination/CodinationCard';
import { useCodination } from '@/hooks/useCodination';
import { useVirtualFitting } from '@/hooks/useVirtualFitting';
import { userAtom } from '@/atoms/authAtoms';

export default function CodinationPanel() {
  const setPanel = useSetAtom(panelAtom);
  const setActiveCodination = useSetAtom(activeCodinationAtom);
  const [closetCodination, setClosetCodination] = useAtom(closetCodinationAtom);
  const [activeCodination] = useAtom(activeCodinationAtom);
  const [user] = useAtom(userAtom);

  // 스토리지 훅 사용
  const { codinations, updateCodination } = useCodination();
  const { executeVirtualFitting } = useVirtualFitting({
    codinationId: closetCodination?.id || activeCodination?.id || '',
  });
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
    if (isDisabled || !closetCodination) return;

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

    // 가상피팅 실행
    const success = await executeVirtualFitting(closetCodination.cloths);

    if (success) {
      // 즉시 fitting 패널로 이동
      setPanel('fitting');
      setActiveCodination(closetCodination);
      setClosetCodination(null);

      // 코디네이션 업데이트
      await updateCodination(closetCodination);
    }
  };

  if (codinations.length === 0)
    return (
      <div className="h-full flex flex-col dark:bg-slate-800">
        <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
          <div className="w-24 h-24 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mb-6">
            <Plus className="w-12 h-12 " />
          </div>
          <h3 className="text-xl font-semibold mb-3">아직 코디가 없습니다</h3>
          <p className="mb-6 max-w-md">AI와 대화하여 가상피팅에 사용할 옷 조합들을 추가해보세요</p>
          <Button
            onClick={handleAddNewCodination}
            className="bg-blue-600  hover:bg-blue-700 dark:hover:bg-blue-500 text-white px-6 py-3"
          >
            <Plus className="w-4 h-4 mr-2" />
            코디 추가하기
          </Button>
        </div>
        {closetCodination && closetCodination.cloths.length > 0 && (
          <div className="p-4 border-t border-slate-200 dark:border-slate-700">
            <button
              className={`w-full cursor-pointer h-12 btn bg-navy dark:bg-blue-600 text-lg text-white disabled:bg-blue-50 dark:disabled:bg-slate-600`}
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
              closetCodination.fitting_image ? 'bg-green-600 hover:bg-green-700' : 'bg-navy'
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
