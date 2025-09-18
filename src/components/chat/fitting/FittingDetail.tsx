'use client';

import Image from 'next/image';
import { useAtom } from 'jotai';
import { activeCodinationAtom } from '@/atoms/chatAtoms';

export default function FittingDetail() {
  const [activeCodination, setActiveCodination] = useAtom(activeCodinationAtom);
  return (
    <div className="flex flex-col space-y-4 h-[60vh]">
      {/* 기본 정보 */}
      <div className="h-full bg-beige-300 dark:bg-slate-800 rounded-2xl p-4">
        <h3 className="text-4xl font-bold text-navy-500 dark:text-white my-6">코디 아이템</h3>
        <h4 className="text-2xl font-semibold text-navy-500 dark:text-white mt-8 mb-4"></h4>
        <div className="space-y-2">
          {activeCodination
            ? activeCodination.cloths.map((cloth: ClosetCloth, index: number) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-beige-500 rounded-lg">
                  <div className="flex-shrink-0 flex items-center justify-center h-40">
                    <Image
                      src={cloth.url}
                      alt={cloth.name}
                      width={80}
                      height={80}
                      className="rounded-lg object-cover h-full"
                    />
                  </div>
                  {/* 텍스트 영역 */}
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-xl text-navy-500 dark:text-white mb-1 line-clamp-2">{cloth.name}</p>
                    <p className="text-md text-navy-400 dark:text-navy-300 line-clamp-3">{cloth.description}</p>
                  </div>
                </div>
              ))
            : '구성된 아이템이 없습니다'}
        </div>
      </div>
    </div>
  );
}
