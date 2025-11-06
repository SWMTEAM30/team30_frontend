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

  return (
    <div className="flex bg-gray-100 dark:bg-slate-800 flex-col h-full min-h-[400px]">
      <div className="flex h-full items-center justify-center">
        <FittingStatus
          status={fittingStatus.status}
          resultUrl={fittingStatus.resultUrl}
          errorMessage={fittingStatus.errorMessage}
          userModelImage={user?.modelImage}
          displayImage={fittingStatus.resultUrl}
        />
      </div>
    </div>
  );
}
