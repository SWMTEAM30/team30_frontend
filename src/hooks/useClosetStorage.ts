/**
 * 옷장 데이터를 IndexedDB에 저장하고 불러오는 훅
 */
import { useAtom } from 'jotai';
import { useEffect, useCallback } from 'react';
import { closetAtom } from '@/atoms/chatAtoms';
import { useIndexedDB } from '@/hooks/useIndexedDB';

const CLOSET_STORAGE_KEY = 'closet_data';

export const useClosetStorage = () => {
  const [closet, setCloset] = useAtom(closetAtom);

  // 새로운 IndexedDB 훅 사용
  const {
    data: storedCloset,
    saveData: saveClosetToStorage,
    loadData: loadClosetFromStorage,
    clearData: clearClosetStorage,
    isLoading: isClosetLoading,
    error: closetError,
  } = useIndexedDB<ClosetCloth[]>({
    storeName: 'CLOSET',
    storageKey: CLOSET_STORAGE_KEY,
    initialValue: [],
    showToast: false, // 옷장은 자동 저장이므로 토스트 비활성화
  });

  /**
   * 옷장에 아이템을 추가합니다.
   */
  const addClothToCloset = useCallback(
    async (cloth: ClosetCloth) => {
      const newCloset = [...closet, cloth];
      setCloset(newCloset);
      await saveClosetToStorage(newCloset);
    },
    [closet, setCloset, saveClosetToStorage],
  );

  /**
   * 옷장에서 아이템을 제거합니다.
   */
  const removeClothFromCloset = useCallback(
    async (clothId: string) => {
      const newCloset = closet.filter((cloth) => cloth.id !== clothId);
      setCloset(newCloset);
      await saveClosetToStorage(newCloset);
    },
    [closet, setCloset, saveClosetToStorage],
  );

  /**
   * 옷장 데이터를 초기화합니다.
   */
  const clearCloset = useCallback(async () => {
    setCloset([]);
    await saveClosetToStorage([]);
  }, [setCloset, saveClosetToStorage]);

  /**
   * 컴포넌트 마운트 시 저장된 옷장 데이터를 불러옵니다.
   */
  useEffect(() => {
    const initializeCloset = async () => {
      if (closet.length === 0 && !isClosetLoading) {
        const loadedData = await loadClosetFromStorage();
        if (loadedData && loadedData.length > 0) {
          setCloset(loadedData);
        }
      }
    };

    initializeCloset();
  }, [closet.length, isClosetLoading, loadClosetFromStorage, setCloset]);

  /**
   * 옷장 데이터가 변경될 때마다 자동으로 저장합니다.
   */
  useEffect(() => {
    if (closet.length > 0) {
      saveClosetToStorage(closet);
    }
  }, [closet, saveClosetToStorage]);

  return {
    closet,
    addClothToCloset,
    removeClothFromCloset,
    clearCloset,
    saveClosetToStorage,
    loadClosetFromStorage,
    isLoading: isClosetLoading,
    error: closetError,
  };
};
