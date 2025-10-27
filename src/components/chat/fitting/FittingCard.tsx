'use client';

import { useAtomValue } from 'jotai';
import { activeCodinationAtom } from '@/atoms/chatAtoms';
import { userAtom } from '@/atoms/authAtoms';
import { useFitting } from '@/hooks/useFitting';
import FittingStatus from './FittingStatus';

export default function FittingCard() {
  const activeCodination = useAtomValue(activeCodinationAtom);
  const user = useAtomValue(userAtom);
  const { fittingStatus } = useFitting(activeCodination?.id);

  // 코디네이션에 저장된 피팅 이미지가 있으면 우선 표시
  const displayImage = activeCodination?.fitting_image || fittingStatus.resultUrl;

  return (
    <div className="flex bg-gray-100 flex-col h-full min-h-[400px]">
      <div className="flex h-full items-center justify-center">
        <FittingStatus
          status={fittingStatus.status}
          resultUrl={fittingStatus.resultUrl}
          errorMessage={fittingStatus.errorMessage}
          userModelImage={user?.modelImage}
          displayImage={displayImage}
        />
      </div>
    </div>
  );
}
