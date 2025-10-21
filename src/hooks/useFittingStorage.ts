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

export const useFittingStorage = (codinationId?: string) => {
  const [virtualFittingStatus, setVirtualFittingStatus] = useAtom(virtualFittingStatusAtom);

  const shouldUseStorage = Boolean(codinationId && codinationId.trim() !== '');

  const {
    data: storedFittingStatus,
    saveData: saveFittingStatusToStorage,
    loadData: loadFittingStatusFromStorage,
    clearData: clearFittingStatusStorage,
    isLoading: isFittingStatusLoading,
    error: fittingStatusError,
  } = useIndexedDB<VirtualFittingStatus>({
    storeName: 'FITTING_STATUS',
    storageKey: codinationId || 'default',
    initialValue: {
      codinationId: codinationId || null,
      status: 'idle',
      resultUrl: null,
      errorMessage: null,
      taskId: null,
    },
    showToast: false,
  });

  const updateFittingStatus = useCallback(
    async (newStatus: Partial<VirtualFittingStatus>) => {
      const updatedStatus = { ...virtualFittingStatus, ...newStatus };
      setVirtualFittingStatus(updatedStatus);

      // codinationId가 있을 때만 저장
      if (shouldUseStorage) await saveFittingStatusToStorage(updatedStatus);
    },
    [virtualFittingStatus, setVirtualFittingStatus, saveFittingStatusToStorage, shouldUseStorage],
  );

  const resetFittingStatus = useCallback(async () => {
    const initialStatus: VirtualFittingStatus = {
      codinationId: codinationId || null,
      status: 'idle',
      resultUrl: null,
      errorMessage: null,
      taskId: null,
    };
    setVirtualFittingStatus(initialStatus);

    // codinationId가 있을 때만 저장
    if (shouldUseStorage) {
      await saveFittingStatusToStorage(initialStatus);
    }
  }, [setVirtualFittingStatus, saveFittingStatusToStorage, shouldUseStorage, codinationId]);

  useEffect(() => {
    const initializeFittingStatus = async () => {
      if (!isFittingStatusLoading && shouldUseStorage) {
        const loadedData = await loadFittingStatusFromStorage();
        if (loadedData && loadedData.status !== 'idle') {
          setVirtualFittingStatus(loadedData);
        }
      }
    };

    initializeFittingStatus();
  }, [isFittingStatusLoading, loadFittingStatusFromStorage, setVirtualFittingStatus, shouldUseStorage]);

  useEffect(() => {
    if (virtualFittingStatus.status !== 'idle' && shouldUseStorage) {
      saveFittingStatusToStorage(virtualFittingStatus);
    }
  }, [virtualFittingStatus, saveFittingStatusToStorage, shouldUseStorage]);

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
