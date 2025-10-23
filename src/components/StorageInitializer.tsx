'use client';

import { useEffect, useState } from 'react';
import { useSetAtom } from 'jotai';
import { closetAtom, codinationsAtom } from '@/atoms/chatAtoms';
import { isInitializedAtom } from '@/atoms/authAtoms';
import { loadFromIndexedDB } from '@/lib/indexedDB';
import { STORE_NAMES } from '@/config/indexedDB.config';

type WithEnvelope<T> = { id: string; data: T; lastUpdated: string };

interface StorageInitializerProps {
  children: React.ReactNode;
}

export default function StorageInitializer({ children }: StorageInitializerProps) {
  const setCloset = useSetAtom(closetAtom);
  const setCodinations = useSetAtom(codinationsAtom);
  const setIsInitialized = useSetAtom(isInitializedAtom);

  useEffect(() => {
    const initialize = async () => {
      try {
        // Closet 초기화
        const closetResult = await loadFromIndexedDB<WithEnvelope<ClosetCloth>[]>(STORE_NAMES.CLOSET);
        if (Array.isArray(closetResult)) {
          setCloset(closetResult.map((e) => e.data));
        }

        // Codinations 초기화
        const codinationsResult = await loadFromIndexedDB<WithEnvelope<Codination>[]>(STORE_NAMES.CODINATIONS);
        if (Array.isArray(codinationsResult)) {
          setCodinations(codinationsResult.map((e) => e.data));
        }

        console.log('스토리지 초기화 완료');
      } catch (e) {
        console.error('스토리지 초기화 실패:', e);
      } finally {
        setIsInitialized(true);
      }
    };

    initialize();
  }, [setCloset, setCodinations, setIsInitialized]);

  // 초기화 중에는 children을 그대로 렌더링하여 UI 차단을 최소화
  // 필요 시 로딩 스피너를 노출하려면 아래를 조정
  return <>{children}</>;
}
