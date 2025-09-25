'use client';

import Image from 'next/image';
import { useAtomValue } from 'jotai';
import { activeCodinationAtom, virtualFittingStatusAtom } from '@/atoms/chatAtoms';

export default function FittingCard() {
  const activeCodination = useAtomValue(activeCodinationAtom);
  const virtualFittingStatus = useAtomValue(virtualFittingStatusAtom);

  // 현재 활성 코디네이션에 대한 가상피팅 상태 확인
  const currentFittingStatus =
    activeCodination && virtualFittingStatus.codinationId === activeCodination.id
      ? virtualFittingStatus
      : { status: 'idle' as const, resultUrl: null, errorMessage: null };

  const renderContent = () => {
    switch (currentFittingStatus.status) {
      case 'pending':
        return (
          <div className="text-blue-400 dark:text-navy-500 text-center">
            <div className="w-20 h-20 mx-auto mb-4 bg-yellow-150 dark:bg-slate-600 rounded-full flex items-center justify-center">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
            </div>
            <p className="text-base font-medium">가상피팅 진행 중...</p>
            <p className="text-sm mt-1">잠시만 기다려주세요</p>
          </div>
        );

      case 'success':
        return (
          <div className="w-full h-full p-2">
            {currentFittingStatus.resultUrl && (
              <div className="relative w-full h-full">
                <Image src={currentFittingStatus.resultUrl} alt="가상피팅 결과" fill className="object-cover" />
              </div>
            )}
          </div>
        );

      case 'error':
        return (
          <div className="text-red-400 dark:text-red-500 text-center">
            <div className="w-20 h-20 mx-auto mb-4 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
            <p className="text-base font-medium">가상피팅 실패</p>
            <p className="text-sm mt-1">{currentFittingStatus.errorMessage || '오류가 발생했습니다'}</p>
          </div>
        );

      default:
        return (
          <div className="text-blue-400 dark:text-navy-500 text-center">
            <div className="w-20 h-20 mx-auto mb-4 bg-yellow-150 dark:bg-slate-600 rounded-full flex items-center justify-center">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </div>
            <p className="text-base font-medium">피팅 이미지</p>
            <p className="text-sm mt-1">현재 뷰: 정면</p>
          </div>
        );
    }
  };

  return (
    <div className="flex bg-beige-300 flex-col h-[60vh]">
      <div className="flex h-full items-center justify-center">{renderContent()}</div>
    </div>
  );
}
