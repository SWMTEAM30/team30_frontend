import { useAtom } from 'jotai';
import { useEffect, useCallback, useState } from 'react';
import { closetAtom } from '@/atoms/chatAtoms';
import { saveToIndexedDB, clearIndexedDB } from '@/lib/indexedDB';
import { STORE_NAMES } from '@/config/indexedDB.config';

export const useCloset = () => {
  const [closet, setCloset] = useAtom(closetAtom);
  const [error, setError] = useState<Error | null>(null);

  // IndexedDB 저장 (개별 아이템별)
  const saveClosetToStorage = useCallback(async (closetData: ClosetCloth[]): Promise<boolean> => {
    try {
      setError(null);

      // 기존 데이터 모두 삭제
      await clearIndexedDB(STORE_NAMES.CLOSET);

      // 각 아이템을 개별적으로 저장
      for (const cloth of closetData) {
        const dataToSave = {
          id: cloth.id,
          data: cloth,
          lastUpdated: new Date().toISOString(),
        };
        await saveToIndexedDB(STORE_NAMES.CLOSET, dataToSave);
      }

      return true;
    } catch (error) {
      console.error('옷장 데이터 저장 실패:', error);
      setError(error as Error);
      return false;
    }
  }, []);

  const addClothToCloset = useCallback(
    async (cloth: ClosetCloth) => {
      const newCloset = [...closet, cloth];
      setCloset(newCloset);
      await saveClosetToStorage(newCloset);
    },
    [closet, setCloset, saveClosetToStorage],
  );

  const addClothesToCloset = useCallback(
    async (clothes: ClosetCloth[]) => {
      if (!clothes || clothes.length === 0) return;

      const existingIds = new Set(closet.map((c) => c.id));
      const mergedCloset: ClosetCloth[] = [...closet];
      for (const cloth of clothes) {
        if (!existingIds.has(cloth.id)) {
          mergedCloset.push(cloth);
          existingIds.add(cloth.id);
        }
      }

      setCloset(mergedCloset);
      await saveClosetToStorage(mergedCloset);
    },
    [closet, setCloset, saveClosetToStorage],
  );

  const removeClothFromCloset = useCallback(
    async (clothId: string) => {
      const newCloset = closet.filter((cloth) => cloth.id !== clothId);
      setCloset(newCloset);
      await saveClosetToStorage(newCloset);
    },
    [closet, setCloset, saveClosetToStorage],
  );

  const clearCloset = useCallback(async () => {
    setCloset([]);
    await saveClosetToStorage([]);
  }, [setCloset, saveClosetToStorage]);

  useEffect(() => {
    if (closet.length > 0) {
      saveClosetToStorage(closet);
    }
  }, [closet, saveClosetToStorage]);

  return {
    closet,
    addClothToCloset,
    addClothesToCloset,
    removeClothFromCloset,
    clearCloset,
    error,
  };
};
