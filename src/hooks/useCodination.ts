import { useAtom } from 'jotai';
import { useEffect, useCallback, useState } from 'react';
import { codinationsAtom } from '@/atoms/chatAtoms';
import { saveToIndexedDB, clearIndexedDB } from '@/lib/indexedDB';
import { STORE_NAMES } from '@/config/indexedDB.config';

export const useCodination = () => {
  const [codinations, setCodinations] = useAtom(codinationsAtom);
  const [error, setError] = useState<Error | null>(null);

  // IndexedDB 저장 (개별 아이템별)
  const saveCodinationsToStorage = useCallback(async (codinationsData: Codination[]): Promise<boolean> => {
    try {
      setError(null);

      // 기존 데이터 모두 삭제
      await clearIndexedDB(STORE_NAMES.CODINATIONS);

      // 각 아이템을 개별적으로 저장
      for (const codination of codinationsData) {
        const dataToSave = {
          id: codination.id,
          data: codination,
          lastUpdated: new Date().toISOString(),
        };
        console.log('코디네이션 저장:', codination.id);
        await saveToIndexedDB(STORE_NAMES.CODINATIONS, dataToSave);
      }

      return true;
    } catch (error) {
      console.error('코디네이션 데이터 저장 실패:', error);
      setError(error as Error);
      return false;
    }
  }, []);

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
    error,
  };
};
