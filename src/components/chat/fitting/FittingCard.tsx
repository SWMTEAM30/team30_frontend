'use client';

import Image from 'next/image';
import { useAtom } from 'jotai';
import { activeCodinationAtom } from '@/atoms/chatAtoms';

export default function FittingCard() {
  return (
    <div className="flex bg-beige-300 flex-col h-[60vh]">
      <div className="flex h-full items-center justify-center">
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
      </div>
    </div>
  );
}
