'use client';

import Image from 'next/image';
import { useAtom, useAtomValue } from 'jotai';
import { activeCodinationAtom } from '@/atoms/chatAtoms';
import { userAtom } from '@/atoms/authAtoms';

interface ClosetCloth {
  id: string;
  name: string;
  url: string;
  description: string;
  tags: string[];
}

export default function FittingDetail() {
  const [activeCodination, setActiveCodination] = useAtom(activeCodinationAtom);
  const user = useAtomValue(userAtom);

  return (
    <div className="flex flex-col space-y-4 h-full">
      {/* 모델 이미지 정보 */}
      <div className="border border-blue dark:bg-slate-800 rounded-2xl p-4">
        <h3 className="text-2xl font-bold text-navy-500 dark:text-white mb-4">피팅 모델</h3>
        <div className="flex items-center gap-4">
          {user?.modelImage ? (
            <>
              <div className="flex-shrink-0">
                <Image
                  src={user.modelImage}
                  alt="사용자 모델 이미지"
                  width={80}
                  height={80}
                  className="rounded-lg object-cover"
                />
              </div>
              <div className="flex-1">
                <p className="font-bold text-lg text-navy-500 dark:text-white mb-1">개인 모델 이미지</p>
                <p className="text-sm text-green-600 dark:text-green-400">✅ 설정된 모델 이미지가 사용됩니다</p>
              </div>
            </>
          ) : (
            <>
              <div className="flex-shrink-0 w-20 h-20 bg-gray-200 dark:bg-slate-600 rounded-lg flex items-center justify-center">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
              <div className="flex-1">
                <p className="font-bold text-lg text-navy-500 dark:text-white mb-1">기본 모델 이미지</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">설정에서 개인 모델 이미지를 업로드하세요</p>
              </div>
            </>
          )}
        </div>
      </div>

      {/* 코디 아이템 정보 */}
      <div className="flex-1 min-h-0 border border-blue dark:bg-slate-800 rounded-2xl p-4">
        <h3 className="text-2xl font-bold text-navy-500 dark:text-white mb-4">코디 아이템</h3>
        <div className="space-y-2 overflow-y-auto">
          {activeCodination
            ? activeCodination.cloths.map((cloth: ClosetCloth, index: number) => (
                <div key={index} className="flex items-center gap-3 p-3 rounded-lg">
                  <div className="flex-shrink-0 flex items-center justify-center w-15 aspect-[3/4]">
                    <Image src={cloth.url} alt={cloth.name} fill className="rounded-lg object-cover" />
                  </div>
                  {/* 텍스트 영역 */}
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-lg text-navy-500 dark:text-white mb-1 line-clamp-2">{cloth.name}</p>
                    <p className="text-sm text-navy-400 dark:text-navy-300 line-clamp-2">{cloth.description}</p>
                  </div>
                </div>
              ))
            : '구성된 아이템이 없습니다'}
        </div>
      </div>
    </div>
  );
}
