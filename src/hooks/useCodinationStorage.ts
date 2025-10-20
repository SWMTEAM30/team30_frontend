/**
 * 코디네이션 데이터를 IndexedDB에 저장하고 불러오는 훅
 */
import { useAtom } from 'jotai';
import { useEffect, useCallback } from 'react';
import { codinationsAtom } from '@/atoms/chatAtoms';
import { useIndexedDB } from './useIndexedDB';

const CODINATIONS_STORAGE_KEY = 'codinations_data';

export const useCodinationStorage = () => {
  const [codinations, setCodinations] = useAtom(codinationsAtom);

  // 새로운 IndexedDB 훅 사용
  const {
    data: storedCodinations,
    saveData: saveCodinationsToStorage,
    loadData: loadCodinationsFromStorage,
    clearData: clearCodinationsStorage,
    isLoading: isCodinationsLoading,
    error: codinationsError,
  } = useIndexedDB<Codination[]>({
    storeName: 'CODINATIONS',
    storageKey: CODINATIONS_STORAGE_KEY,
    initialValue: [],
    showToast: false, // 코디네이션은 자동 저장이므로 토스트 비활성화
  });

  /**
   * 새로운 코디네이션을 추가합니다.
   */
  const addCodination = useCallback(
    async (codination: Codination) => {
      const newCodinations = [...codinations, codination];
      setCodinations(newCodinations);
      await saveCodinationsToStorage(newCodinations);
    },
    [codinations, setCodinations, saveCodinationsToStorage],
  );

  /**
   * 코디네이션을 삭제합니다.
   */
  const removeCodination = useCallback(
    async (codinationId: string) => {
      const newCodinations = codinations.filter((codination) => codination.id !== codinationId);
      setCodinations(newCodinations);
      await saveCodinationsToStorage(newCodinations);
    },
    [codinations, setCodinations, saveCodinationsToStorage],
  );

  /**
   * 코디네이션을 업데이트합니다.
   */
  const updateCodination = useCallback(
    async (updatedCodination: Codination) => {
      const newCodinations = codinations.map((codination) =>
        codination.id === updatedCodination.id ? updatedCodination : codination,
      );
      setCodinations(newCodinations);
      await saveCodinationsToStorage(newCodinations);
    },
    [codinations, setCodinations, saveCodinationsToStorage],
  );

  /**
   * 코디네이션 데이터를 초기화합니다.
   */
  const clearCodinations = useCallback(async () => {
    setCodinations([]);
    await saveCodinationsToStorage([]);
  }, [setCodinations, saveCodinationsToStorage]);

  /**
   * 컴포넌트 마운트 시 저장된 코디네이션 데이터를 불러옵니다.
   */
  useEffect(() => {
    const initializeCodinations = async () => {
      if (codinations.length === 0 && !isCodinationsLoading) {
        const loadedData = await loadCodinationsFromStorage();
        if (loadedData && loadedData.length > 0) {
          setCodinations(loadedData);
        }
      }
    };

    initializeCodinations();
  }, [codinations.length, isCodinationsLoading, loadCodinationsFromStorage, setCodinations]);

  /**
   * 코디네이션 데이터가 변경될 때마다 자동으로 저장합니다.
   */
  useEffect(() => {
    if (codinations.length > 0) {
      saveCodinationsToStorage(codinations);
    }
  }, [codinations, saveCodinationsToStorage]);

  return {
    codinations,
    addCodination,
    removeCodination,
    updateCodination,
    clearCodinations,
    saveCodinationsToStorage,
    loadCodinationsFromStorage,
    isLoading: isCodinationsLoading,
    error: codinationsError,
  };
};
