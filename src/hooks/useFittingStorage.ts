import { useAtom } from 'jotai';
import { useEffect, useCallback } from 'react';
import { virtualFittingStatusAtom } from '@/atoms/chatAtoms';
import { useIndexedDB } from '@/hooks/useIndexedDB';

type VirtualFittingStatus = {
  codinationId: string | null;
  status: 'idle' | 'pending' | 'success' | 'error';
  resultUrl: string | null;
  errorMessage: string | null;
  taskId: string | null;
};

const FITTING_STATUS_STORAGE_KEY = 'fitting_status_data';

export const useFittingStorage = () => {
  const [virtualFittingStatus, setVirtualFittingStatus] = useAtom(virtualFittingStatusAtom);

  // 새로운 IndexedDB 훅 사용
  const {
    data: storedFittingStatus,
    saveData: saveFittingStatusToStorage,
    loadData: loadFittingStatusFromStorage,
    clearData: clearFittingStatusStorage,
    isLoading: isFittingStatusLoading,
    error: fittingStatusError,
  } = useIndexedDB<VirtualFittingStatus>({
    storeName: 'FITTING_STATUS',
    storageKey: FITTING_STATUS_STORAGE_KEY,
    initialValue: {
      codinationId: null,
      status: 'idle',
      resultUrl: null,
      errorMessage: null,
      taskId: null,
    },
    showToast: false, // 피팅 상태는 자동 저장이므로 토스트 비활성화
  });

  const updateFittingStatus = useCallback(
    async (newStatus: Partial<VirtualFittingStatus>) => {
      const updatedStatus = { ...virtualFittingStatus, ...newStatus };
      setVirtualFittingStatus(updatedStatus);
      await saveFittingStatusToStorage(updatedStatus);
    },
    [virtualFittingStatus, setVirtualFittingStatus, saveFittingStatusToStorage],
  );

  const resetFittingStatus = useCallback(async () => {
    const initialStatus: VirtualFittingStatus = {
      codinationId: null,
      status: 'idle',
      resultUrl: null,
      errorMessage: null,
      taskId: null,
    };
    setVirtualFittingStatus(initialStatus);
    await saveFittingStatusToStorage(initialStatus);
  }, [setVirtualFittingStatus, saveFittingStatusToStorage]);

  useEffect(() => {
    const initializeFittingStatus = async () => {
      if (!isFittingStatusLoading) {
        const loadedData = await loadFittingStatusFromStorage();
        if (loadedData && loadedData.status !== 'idle') {
          setVirtualFittingStatus(loadedData);
        }
      }
    };

    initializeFittingStatus();
  }, [isFittingStatusLoading, loadFittingStatusFromStorage, setVirtualFittingStatus]);

  useEffect(() => {
    if (virtualFittingStatus.status !== 'idle') {
      saveFittingStatusToStorage(virtualFittingStatus);
    }
  }, [virtualFittingStatus, saveFittingStatusToStorage]);

  return {
    virtualFittingStatus,
    updateFittingStatus,
    resetFittingStatus,
    saveFittingStatusToStorage,
    loadFittingStatusFromStorage,
    isLoading: isFittingStatusLoading,
    error: fittingStatusError,
  };
};
