import { useCallback, useMemo, useState } from 'react';
import { useSetAtom } from 'jotai';
import { activeCodinationAtom, panelAtom } from '@/atoms/chatAtoms';
import { getChatProduct } from '@/api/chatAPI';
import { useCloset } from '@/hooks/useCloset';
import { useCodination } from '@/hooks/useCodination';

export function useCodinationSave() {
  const setPanel = useSetAtom(panelAtom);
  const setActiveCodination = useSetAtom(activeCodinationAtom);
  const { addCodination } = useCodination();
  const [locallySavedKeys, setLocallySavedKeys] = useState<Set<string>>(new Set());

  // 스토리지 훅 사용
  const { closet, addClothesToCloset } = useCloset();
  const { codinations } = useCodination();

  const makeProductsKey = useCallback((products: Product[]) => {
    const ids = products
      .map((p) => p.product_id || p.product_url)
      .filter(Boolean)
      .sort();
    return ids.join('|');
  }, []);

  const makeCodinationKey = useCallback((c: Codination) => {
    const ids = c.cloths
      .map((cl) => cl.id)
      .filter(Boolean)
      .sort();
    return ids.join('|');
  }, []);

  const savedKeysFromStore = useMemo(() => {
    const s = new Set<string>();
    for (const c of codinations) {
      s.add(makeCodinationKey(c));
    }
    return s;
  }, [codinations, makeCodinationKey]);

  // 기존 코디네이션과 동일한 착장인지 비교 (옷 ID 기준, 순서 무관)
  const isSameCodination = (a: Codination, b: Codination) => {
    if (a.cloths.length !== b.cloths.length) return false;
    const aIds = a.cloths.map((c) => c.id).sort();
    const bIds = b.cloths.map((c) => c.id).sort();
    return aIds.every((id, idx) => id === bIds[idx]);
  };

  const addCodinationFromProducts = useCallback(
    async (products: Product[], sourceMessage?: Message, replies?: Message[]) => {
      if (!products || products.length === 0) return;

      const results = await Promise.all(products.map((p) => getChatProduct(p)));
      const clothsMap = new Map<string, ClosetCloth>();
      const failedProducts: Product[] = [];

      for (let i = 0; i < results.length; i++) {
        const res = results[i];
        if (res.status === 'success' && res.data) {
          const cloth = res.data as ClosetCloth;
          clothsMap.set(cloth.id, cloth);
        } else {
          failedProducts.push(products[i]);
          console.warn(`상품 정보 가져오기 실패: ${products[i].product_id}`, res.message);
        }
      }

      const cloths = Array.from(clothsMap.values());
      if (cloths.length === 0) {
        console.error('모든 상품 정보 가져오기 실패');
        return;
      }

      // 일부만 성공한 경우 사용자에게 알림
      if (failedProducts.length > 0) {
        console.warn(`${failedProducts.length}개 상품 정보를 가져오지 못했습니다.`);
      }

      // AI 전문가의 본문 내용을 description으로 사용
      let agentDescription = '';

      if (sourceMessage?.agent?.agentname) {
        // sourceMessage가 AI 전문가의 메시지인 경우 (reply.products로 호출된 경우)
        agentDescription = `${sourceMessage.agent.agentname} - ${sourceMessage.content}`;
      } else {
        // sourceMessage가 없거나 사용자 메시지인 경우, replies에서 AI 전문가 메시지 찾기
        const aiMessage = replies?.find((reply) => reply.agent?.agentname);
        agentDescription = aiMessage?.agent?.agentname
          ? `${aiMessage.agent.agentname} - ${aiMessage.content}`
          : sourceMessage?.content || '';
      }

      const newCodination = {
        id: new Date().getTime().toString(),
        fitting_image: null,
        cloths: cloths,
        description: agentDescription,
      };
      console.log(newCodination);

      // 중복 코디네이션 방지: 동일 조합이 이미 저장되어 있으면 추가하지 않음
      const isDuplicate = codinations.some((existing) => isSameCodination(existing, newCodination));
      if (isDuplicate) {
        alert('이미 같은 코디네이션이 저장되어 있습니다.');
        return;
      }

      // IndexedDB에 저장하면서 코디네이션 추가
      await addCodination(newCodination);

      // 옷장에 아이템들 일괄 추가 (중복 제거 포함)
      await addClothesToCloset(cloths);

      setActiveCodination(newCodination);
      setPanel('codination');
      // 저장됨 표시를 위해 로컬 키 기록
      const key = makeProductsKey(products);
      setLocallySavedKeys((prev) => new Set(prev).add(key));
    },
    [codinations, addCodination, setActiveCodination, setPanel, addClothesToCloset, makeProductsKey],
  );

  const isSaved = useCallback(
    (products: Product[]) => {
      const key = makeProductsKey(products);
      return locallySavedKeys.has(key) || savedKeysFromStore.has(key);
    },
    [locallySavedKeys, savedKeysFromStore, makeProductsKey],
  );

  return {
    addCodinationFromProducts,
    isSaved,
  };
}

