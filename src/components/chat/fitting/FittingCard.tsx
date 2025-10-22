'use client';

import Image from 'next/image';
import { useAtomValue } from 'jotai';
import { activeCodinationAtom } from '@/atoms/chatAtoms';
import { useFitting } from '@/hooks/useFitting';

export default function FittingCard() {
  const activeCodination = useAtomValue(activeCodinationAtom);
  const { fittingStatus } = useFitting(activeCodination?.id);

  // 코디네이션에 저장된 피팅 이미지가 있으면 우선 표시
  const displayImage = activeCodination?.fitting_image || fittingStatus.resultUrl;

  console.log('🔍 FittingCard 상태:', {
    activeCodination: activeCodination?.id,
    fittingStatus,
    displayImage,
  });

  const renderContent = () => {
    console.log('🎨 FittingCard 렌더링:', fittingStatus.status);
    
    // 저장된 피팅 이미지가 있으면 바로 표시
    if (displayImage) {
      console.log('🖼️ 저장된 피팅 이미지 표시:', displayImage);
      return (
        <div className="w-full h-full p-2">
          <div className="relative w-full h-full">
            <Image 
              src={displayImage} 
              alt="가상피팅 결과" 
              fill 
              className="object-cover rounded-lg" 
            />
          </div>
        </div>
      );
    }
    
    switch (fittingStatus.status) {
      case 'pending':
        console.log('⏳ Pending 상태 렌더링');
        return (
          <div className="text-blue-400 dark:text-navy-500 text-center">
            <div className="w-20 h-20 mx-auto mb-4 bg-gray-150 dark:bg-slate-600 rounded-full flex items-center justify-center">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
            </div>
            <p className="text-base font-medium">가상피팅 진행 중...</p>
            <p className="text-sm mt-1">잠시만 기다려주세요</p>
          </div>
        );

      case 'success':
        console.log('✅ Success 상태 렌더링:', fittingStatus.resultUrl);
        return (
          <div className="w-full h-full p-2">
            {fittingStatus.resultUrl ? (
              <div className="relative w-full h-full">
                <Image 
                  src={fittingStatus.resultUrl} 
                  alt="가상피팅 결과" 
                  fill 
                  className="object-cover rounded-lg" 
                />
              </div>
            ) : (
              <div className="text-center text-gray-500">
                <p>결과 이미지를 불러올 수 없습니다</p>
              </div>
            )}
          </div>
        );

      case 'error':
        console.log('❌ Error 상태 렌더링:', fittingStatus.errorMessage);
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
            <p className="text-sm mt-1">{fittingStatus.errorMessage || '오류가 발생했습니다'}</p>
          </div>
        );

      default:
        console.log('😴 Idle 상태 렌더링');
        return (
          <div className="text-blue-400 dark:text-navy-500 text-center">
            <div className="w-20 h-20 mx-auto mb-4 bg-gray-200 dark:bg-slate-600 rounded-full flex items-center justify-center">
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
          </div>
        );
    }
  };

  return (
    <div className="flex bg-gray-100 flex-col h-[60vh]">
      <div className="flex h-full items-center justify-center">{renderContent()}</div>
    </div>
  );
}
