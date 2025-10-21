import { useState, useEffect, useCallback } from 'react';
import {
  saveToIndexedDB,
  loadFromIndexedDB,
  deleteFromIndexedDB,
  clearIndexedDB,
  STORE_NAMES,
  isIndexedDBSupported,
} from '@/lib/indexedDB';
import { useToast } from '@/hooks/useToast';

interface UseIndexedDBOptions<T> {
  storeName: keyof typeof STORE_NAMES;
  storageKey: string;
  initialValue: T;
  onError?: (error: Error) => void;
  showToast?: boolean;
  retryConfig?: Partial<RetryConfig>;
}

export function useIndexedDB<T>({
  storeName,
  storageKey,
  initialValue,
  onError,
  showToast = true,
  retryConfig,
}: UseIndexedDBOptions<T>) {
  const [data, setData] = useState<T>(initialValue);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { showError, showSuccess } = useToast();

  const handleError = useCallback(
    (error: Error, operation: string) => {
      console.error(`IndexedDB ${operation} 실패 (${storeName}):`, error);
      setError(error);

      if (showToast) {
        showError(`데이터 ${operation}에 실패했습니다. 브라우저 설정을 확인해주세요.`);
      }

      onError?.(error);
    },
    [storeName, showToast, showError, onError],
  );

  const handleSuccess = useCallback(
    (operation: string) => {
      setError(null);
      if (showToast) {
        showSuccess(`데이터 ${operation}이 완료되었습니다.`);
      }
    },
    [showToast, showSuccess],
  );

  // 데이터 불러오기
  const loadData = useCallback(async (): Promise<T | null> => {
    if (!isIndexedDBSupported()) {
      console.warn('IndexedDB가 지원되지 않는 브라우저입니다.');
      return null;
    }

    try {
      setIsLoading(true);
      const result = await loadFromIndexedDB<T>(STORE_NAMES[storeName], storageKey, retryConfig);
      // 결과에서 실제 데이터 추출 (keyPath 필드와 lastUpdated 제외)
      if (result && typeof result === 'object' && 'data' in result) {
        return (result as any).data;
      }
      return result;
    } catch (error) {
      handleError(error as Error, '불러오기');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 데이터 저장
  const saveData = useCallback(
    async (newData: T): Promise<boolean> => {
      if (!isIndexedDBSupported()) {
        console.warn('IndexedDB가 지원되지 않는 브라우저입니다.');
        return false;
      }

      // storageKey가 유효하지 않은 경우 오류 처리
      if (!storageKey || storageKey.trim() === '') {
        const error = new Error('저장 키가 유효하지 않습니다. storageKey를 확인해주세요.');
        handleError(error, '저장');
        return false;
      }

      try {
        // 각 store의 keyPath에 맞는 키 필드 설정
        const keyField = storeName === 'FITTING_STATUS' ? 'codinationId' : 'id';

        // 키 값이 유효한지 다시 한번 확인
        const keyValue = storageKey.trim();
        if (!keyValue) {
          throw new Error(`유효한 ${keyField} 값이 필요합니다.`);
        }

        const dataToSave = {
          [keyField]: keyValue,
          data: newData,
          lastUpdated: new Date().toISOString(),
        };

        await saveToIndexedDB(STORE_NAMES[storeName], dataToSave, retryConfig);

        setData(newData);
        handleSuccess('저장');
        return true;
      } catch (error) {
        handleError(error as Error, '저장');
        return false;
      }
    },
    [storeName, storageKey, handleSuccess, handleError],
  );

  // 데이터 삭제
  const deleteData = useCallback(async (): Promise<boolean> => {
    if (!isIndexedDBSupported()) {
      console.warn('IndexedDB가 지원되지 않는 브라우저입니다.');
      return false;
    }

    try {
      await deleteFromIndexedDB(STORE_NAMES[storeName], storageKey);
      setData(initialValue);
      handleSuccess('삭제');
      return true;
    } catch (error) {
      handleError(error as Error, '삭제');
      return false;
    }
  }, [storeName, storageKey, initialValue, handleSuccess, handleError]);

  // 전체 데이터 삭제
  const clearData = useCallback(async (): Promise<boolean> => {
    if (!isIndexedDBSupported()) {
      console.warn('IndexedDB가 지원되지 않는 브라우저입니다.');
      return false;
    }

    try {
      await clearIndexedDB(STORE_NAMES[storeName]);
      setData(initialValue);
      handleSuccess('전체 삭제');
      return true;
    } catch (error) {
      handleError(error as Error, '전체 삭제');
      return false;
    }
  }, [storeName, initialValue, handleSuccess, handleError]);

  // 컴포넌트 마운트 시 데이터 불러오기
  useEffect(() => {
    const initializeData = async () => {
      const loadedData = await loadData();
      if (loadedData) {
        setData(loadedData);
      }
    };

    initializeData();
  }, [loadData]);

  return {
    data,
    setData,
    isLoading,
    error,
    loadData,
    saveData,
    deleteData,
    clearData,
    isSupported: isIndexedDBSupported(),
  };
}
