'use client';

import {
  activeCodinationAtom,
  closetCodinationAtom,
  codinationsAtom,
  panelAtom,
  activeClothAtom,
  virtualFittingStatusAtom,
} from '@/atoms/chatAtoms';
import { useAtom, useSetAtom } from 'jotai';
import { Button } from '@/components/ui/button';
import { Trash2, Plus, ChevronDown, ChevronUp } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { postFittingTryonCombo } from '@/api/fittingAPI';
import { useCodinationStorage } from '@/hooks/useCodinationStorage';
import { useFittingStorage } from '@/hooks/useFittingStorage';
import { getFittingStatusTaskId } from '@/api/fittingAPI';

export default function CodinationCard({ codination }: { codination: any }) {
  const setPanel = useSetAtom(panelAtom);
  const [activeCodination, setActiveCodination] = useAtom(activeCodinationAtom);
  const setClosetCodination = useSetAtom(closetCodinationAtom);
  const [activeCloth, setActiveCloth] = useAtom(activeClothAtom);
  const [isClothModalOpen, setIsClothModalOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  
  // 스토리지 훅 사용
  const { codinations, removeCodination } = useCodinationStorage();
  const { updateFittingStatus } = useFittingStorage();

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
          await updateFittingStatus({
            status: 'success',
            resultUrl: response.data.download_url,
            taskId: taskId,
          });
          console.log('✅ 피팅 결과 폴링 완료:', response.data.download_url);
          return;
        } else if (response.status === 'fail') {
          // 피팅 실패
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

  const handleRemoveCodination = async (codi_id: string) => {
    await removeCodination(codi_id);
  };

  const handleClothClick = (cloth: ClosetCloth) => {
    setActiveCloth(cloth);
    setIsClothModalOpen(true);
  };

  const handleVirtualFitting = async () => {
    // 상의와 하의가 모두 있는지 확인
    const upperCloth = codination.cloths.find((cloth: ClosetCloth) => cloth.url.includes('TOP'));
    const lowerCloth = codination.cloths.find((cloth: ClosetCloth) => cloth.url.includes('BOTTOM'));

    if (!upperCloth || !lowerCloth) {
      alert('상의와 하의를 각각 하나씩 포함한 코디네이션만 가상 피팅이 가능합니다.');
      return;
    }

    // 가상피팅 요청 시작
    console.log('🚀 가상피팅 시작:', { upperId: upperCloth.id, lowerId: lowerCloth.id });

    // 즉시 pending 상태로 설정
    await updateFittingStatus({
      codinationId: codination.id,
      status: 'pending',
      resultUrl: null,
      errorMessage: null,
      taskId: null,
    });

    // 패널을 피팅으로 변경
    setPanel('fitting');

    // API 호출
    postFittingTryonCombo(upperCloth.id, lowerCloth.id)
      .then(async (response) => {
        console.log('가상피팅 응답:', response);
        if (response.status === 'success') {
          // 결과가 바로 있는 경우 (동기 응답)
          if (response.data?.download_url) {
            await updateFittingStatus({
              codinationId: codination.id,
              status: 'success',
              resultUrl: response.data.download_url,
              errorMessage: null,
              taskId: response.data.task_id,
            });
          }
          // taskId만 있는 경우 (비동기 처리)
          else if (response.data?.task_id) {
            await updateFittingStatus({
              codinationId: codination.id,
              taskId: response.data.task_id,
            });
            
            // 비동기 피팅 결과 폴링 시작
            pollFittingResult(response.data.task_id);
          }
        } else {
          await updateFittingStatus({
            codinationId: codination.id,
            status: 'error',
            resultUrl: null,
            errorMessage: response.message || '가상 피팅에 실패했습니다.',
            taskId: null,
          });
        }
      })
      .catch(async (error) => {
        console.error('가상피팅 오류:', error);
        await updateFittingStatus({
          codinationId: codination.id,
          status: 'error',
          resultUrl: null,
          errorMessage: '가상 피팅 중 오류가 발생했습니다.',
          taskId: null,
        });
      });
  };

  return (
    <div className="w-full bg-white dark:bg-slate-800 rounded-2xl transition-all duration-300 border-2 overflow-hidden">
      {/* 메인 카드 헤더 */}
      <div
        className={`flex flex-row border-b-2 cursor-pointer transition-all duration-300 ${
          codination.id === activeCodination?.id
            ? 'border-blue-500 ring-2 ring-blue-200'
            : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
        } ${isExpanded ? 'border-b-slate-200 dark:border-b-slate-700' : 'border-b-transparent'}`}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {/* 아이템 이미지들 */}
        <div className="flex-shrink-0 p-4">
          <div className="flex gap-2">
            {codination.cloths.map((product: ClosetCloth, clothKey: number) => (
              <div key={clothKey} className="relative">
                <Image
                  className="object-contain rounded-lg border border-slate-200"
                  src={product.url}
                  alt={product.name}
                  width={64}
                  height={64}
                  style={{ width: '64px', height: '64px' }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* 코디 정보 */}
        <div className="flex-1 p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="font-semibold text-2xl">
                코디
                <span className="text-lg"> {codination.cloths.length}개 아이템</span>
              </p>
              {isExpanded ? (
                <ChevronUp className="w-5 h-5 text-slate-400" />
              ) : (
                <ChevronDown className="w-5 h-5 text-slate-400" />
              )}
            </div>
            <div className="flex flex-col gap-1">
              {codination.cloths.map((product: ClosetCloth, clothKey: number) => (
                <span key={clothKey} className="px-2 py-1 text-lg rounded-full">
                  - {product.name}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 콜랩스 컨텐츠 */}
      <div
        className={`transition-all duration-300 overflow-hidden ${
          isExpanded ? 'max-h-none opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="p-4 space-y-2">
          {/* 옷 아이템들 */}
          {codination.cloths.map((cloth: ClosetCloth, index: number) => (
            <div
              key={cloth.id}
              onClick={() => handleClothClick(cloth)}
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer transition-colors"
            >
              <Image
                className="object-contain rounded border border-slate-200"
                src={cloth.url}
                alt={cloth.name}
                width={64}
                height={64}
                style={{ width: '64px', height: '64px' }}
              />
              <div className="flex flex-col">
                <span className="text-lg font-semibold dark:text-white">{cloth.name}</span>
                <span className="">{cloth.description}</span>
              </div>
            </div>
          ))}

          {/* 구분선 */}
          <div className="border-t border-slate-200 dark:border-slate-700 my-3" />

          {/* 액션 버튼들 */}
          <div className="space-y-2">
            <button
              onClick={handleVirtualFitting}
              className="w-full flex items-center gap-2 p-3 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 text-blue-600 dark:text-blue-400 transition-colors"
            >
              <div className="w-4 h-4 rounded-full bg-blue-500"></div>
              <span className="text-lg">가상 피팅하기</span>
            </button>

            <button
              onClick={() => handleRemoveCodination(codination.id)}
              className="w-full flex items-center gap-2 p-3 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              <span className="text-lg">삭제하기</span>
            </button>
          </div>
        </div>
      </div>

      {/* 옷 모달 */}
      <Dialog open={isClothModalOpen} onOpenChange={setIsClothModalOpen}>
        {activeCloth && <></>}
      </Dialog>
    </div>
  );
}
