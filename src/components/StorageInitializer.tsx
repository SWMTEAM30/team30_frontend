'use client';

import { useEffect, useState } from 'react';
import { useClosetStorage } from '@/hooks/useClosetStorage';
import { useCodinationStorage } from '@/hooks/useCodinationStorage';
import { useToast } from '@/hooks/useToast';
import { ToastContainer } from '@/components/ui/Toast';
import { isIndexedDBSupported, initializeRetryConfig } from '@/lib/indexedDB';

interface StorageInitializerProps {
  children: React.ReactNode;
}

export default function StorageInitializer({ children }: StorageInitializerProps) {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // 토스트 시스템 초기화
  const { toasts, removeToast } = useToast();

  // 각 스토리지 훅들을 초기화
  useClosetStorage();
  useCodinationStorage();
  // useFittingStorage는 특정 codinationId가 필요하므로 여기서는 초기화하지 않음

  useEffect(() => {
    const initializeStorage = async () => {
      try {
        if (!isIndexedDBSupported()) {
          console.warn('IndexedDB가 지원되지 않는 브라우저입니다. 로컬 스토리지 기능이 제한됩니다.');
          setIsInitialized(true);
          setIsLoading(false);
          return;
        }

        // 재시도 설정 초기화
        initializeRetryConfig();

        // 모든 스토리지 훅들이 자동으로 데이터를 불러오므로
        // 여기서는 초기화 완료 상태만 관리합니다.
        console.log('IndexedDB 스토리지 초기화 완료');
        setIsInitialized(true);
      } catch (error) {
        console.error('스토리지 초기화 중 오류 발생:', error);
        setIsInitialized(true); // 오류가 발생해도 앱은 계속 실행
      } finally {
        setIsLoading(false);
      }
    };

    initializeStorage();
  }, []);

  // 로딩 중일 때는 로딩 표시 (선택사항)
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-navy-500 mx-auto mb-4"></div>
          <p className="text-navy-500 dark:text-white">데이터를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {children}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </>
  );
}
