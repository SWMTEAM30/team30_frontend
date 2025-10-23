import { useAtom } from 'jotai';
import { useEffect, useCallback, useState } from 'react';
import { codinationsAtom, fittingStatusAtom } from '@/atoms/chatAtoms';
import { saveToIndexedDB, loadFromIndexedDB } from '@/lib/indexedDB';
import { STORE_NAMES } from '@/config/indexedDB.config';

type VirtualFittingStatus = {
  codinationId: string | null;
  status: 'idle' | 'pending' | 'success' | 'error';
  resultUrl: string | null;
  errorMessage: string | null;
  taskId: string | null;
};

export const useFitting = (codinationId?: string) => {
  const [codinations, setCodinations] = useAtom(codinationsAtom);
  const [fittingStatus, setFittingStatus] = useAtom(fittingStatusAtom);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const shouldUseStorage = Boolean(codinationId && codinationId.trim() !== '');

  // IndexedDB 저장
  const saveFittingStatusToStorage = useCallback(
    async (fittingData: VirtualFittingStatus): Promise<boolean> => {
      if (!shouldUseStorage) {
        return false;
      }

      try {
        setError(null);
        const dataToSave = {
          codinationId: codinationId!,
          data: fittingData,
          lastUpdated: new Date().toISOString(),
        };
        console.log('💾 saveFittingStatusToStorage 호출', { store: STORE_NAMES.FITTING_STATUS, dataToSave });
        await saveToIndexedDB(STORE_NAMES.FITTING_STATUS, dataToSave);
        return true;
      } catch (error) {
        console.error('피팅 상태 데이터 저장 실패:', error);
        setError(error as Error);
        return false;
      }
    },
    [codinationId, shouldUseStorage],
  );

  // IndexedDB 불러오기
  const loadFittingStatusFromStorage = useCallback(async (): Promise<VirtualFittingStatus | null> => {
    if (!shouldUseStorage) {
      return null;
    }

    try {
      setError(null);
      setIsLoading(true);
      const result = await loadFromIndexedDB<{ id: string; data: VirtualFittingStatus; lastUpdated: string }>(
        STORE_NAMES.FITTING_STATUS,
        codinationId!,
      );
      console.log('📥 loadFittingStatusFromStorage 결과', { store: STORE_NAMES.FITTING_STATUS, result });
      const loaded = result?.data || null;
      console.log('📦 매핑된 피팅 데이터', loaded);
      return loaded;
    } catch (error) {
      console.error('피팅 상태 데이터 불러오기 실패:', error);
      setError(error as Error);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [codinationId, shouldUseStorage]);

  const updateFittingStatus = useCallback(
    async (newStatus: Partial<VirtualFittingStatus>) => {
      console.log('🔄 useFitting updateFittingStatus 호출:', {
        codinationId,
        currentStatus: fittingStatus,
        newStatus,
      });

      const updatedStatus = { ...fittingStatus, ...newStatus };
      console.log('📝 업데이트된 상태:', updatedStatus);

      setFittingStatus(updatedStatus);

      // success 상태이고 resultUrl이 있으면 코디네이션에도 저장
      if (updatedStatus.status === 'success' && updatedStatus.resultUrl && codinationId) {
        console.log('🎯 피팅 성공! 코디네이션에 resultUrl 저장:', updatedStatus.resultUrl);
        const updatedCodinations = codinations.map((codination) =>
          codination.id === codinationId ? { ...codination, fitting_image: updatedStatus.resultUrl } : codination,
        );
        setCodinations(updatedCodinations);
      }

      // codinationId가 있을 때만 저장
      if (shouldUseStorage) {
        console.log('💾 IndexedDB에 피팅 상태 저장:', updatedStatus);
        await saveFittingStatusToStorage(updatedStatus);
      }
    },
    [
      fittingStatus,
      setFittingStatus,
      saveFittingStatusToStorage,
      shouldUseStorage,
      codinationId,
      codinations,
      setCodinations,
    ],
  );

  const resetFittingStatus = useCallback(async () => {
    const initialStatus: VirtualFittingStatus = {
      codinationId: codinationId || null,
      status: 'idle',
      resultUrl: null,
      errorMessage: null,
      taskId: null,
    };
    setFittingStatus(initialStatus);

    // codinationId가 있을 때만 저장
    if (shouldUseStorage) {
      await saveFittingStatusToStorage(initialStatus);
    }
  }, [setFittingStatus, saveFittingStatusToStorage, shouldUseStorage, codinationId]);

  useEffect(() => {
    const initializeFittingStatus = async () => {
      console.log('🚚 피팅 초기화 시작', { codinationId, shouldUseStorage });
      if (!isLoading && shouldUseStorage) {
        const loadedData = await loadFittingStatusFromStorage();
        console.log('✅ 피팅 초기화 로드 완료', loadedData);
        if (loadedData && loadedData.status !== 'idle') {
          setFittingStatus(loadedData);
        }
      }
    };

    initializeFittingStatus();
  }, [isLoading, loadFittingStatusFromStorage, setFittingStatus, shouldUseStorage]);

  useEffect(() => {
    if (fittingStatus.status !== 'idle' && shouldUseStorage) {
      saveFittingStatusToStorage(fittingStatus);
    }
  }, [fittingStatus, saveFittingStatusToStorage, shouldUseStorage]);

  return {
    fittingStatus,
    updateFittingStatus,
    resetFittingStatus,
    isLoading,
    error,
  };
};
