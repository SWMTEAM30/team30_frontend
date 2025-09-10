'use client';

import React, { useCallback, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ExternalLink, ShoppingBag } from 'lucide-react';
import { useAtom, useSetAtom } from 'jotai';
import { activeClothAtom, closetAtom, panelAtom } from '@/atoms/chatAtoms';
import { getChatProduct } from '@/api/chatAPI';

interface PhotoModalProps {
  product: Product;
  children: React.ReactNode;
}

export default function PhotoModal({ product, children }: PhotoModalProps) {
  const [activeCloth, setActiveCloth] = useAtom(activeClothAtom);
  const [closet, setCloset] = useAtom(closetAtom);
  const [isOpen, setIsOpen] = useState(false);
  const setPanel = useSetAtom(panelAtom);

  const handleOpenChange = useCallback(
    async (open: boolean) => {
      if (open) {
        // 모달을 열 때 API 호출하여 상품 데이터 가져오기
        const data = await getChatProduct(product);
        if (data.status === 'fail') return;
        setActiveCloth(data.data);
        setIsOpen(true);
      } else {
        // 모달을 닫을 때
        setActiveCloth(null);
        setIsOpen(false);
      }
    },
    [product, setActiveCloth],
  );

  const handleAddClosetCloth = useCallback(() => {
    setCloset((prevTabs) => {
      if (!activeCloth || prevTabs.some((tab) => tab.id === activeCloth.id)) return prevTabs;
      return [...prevTabs, activeCloth];
    });
    setPanel('closet');
    setIsOpen(false);
  }, [setCloset, setCloset, setPanel, activeCloth]);

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      {activeCloth && (
        <DialogContent className="w-[90vw] h-[85vh] xl:max-w-7xl p-0">
          <div className="flex flex-col xl:flex-row h-full xl:max-w-7xl">
            {/* 위쪽/왼쪽: 이미지 영역 */}
            <div className="flex-1 flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-8 min-h-0 lg:border-r lg:border-gray-200 lg:dark:border-gray-700">
              <div className="relative w-full h-full max-w-xl">
                <Image
                  src={activeCloth.url}
                  alt={activeCloth.id}
                  fill
                  className="object-cover rounded-lg"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 60vw"
                />
              </div>
            </div>

            {/* 아래쪽/오른쪽: 상품 정보 영역 */}
            <div className="h-80 lg:h-full lg:max-w-xl bg-white dark:bg-gray-800 border-t lg:border-t-0 border-gray-200 dark:border-gray-700 p-8 overflow-y-auto">
              <DialogHeader className="mb-6">
                <DialogTitle className="text-4xl font-bold text-gray-900 dark:text-white">
                  {activeCloth.name}
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-6">
                {/* 상품 설명 */}
                <div>
                  <h3 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">상품 설명</h3>
                  <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{activeCloth.description}</p>
                  </div>
                </div>

                {/* 스타일 정보 */}
                <div>
                  <h3 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">스타일 정보</h3>
                  <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                    <div className="flex flex-wrap gap-2">
                      {activeCloth.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-sm rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 액션 버튼들 */}
                <div>
                  <h3 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">액션</h3>
                  <div className="space-y-3">
                    <Button
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white h-12 text-lg"
                      onClick={() => {
                        // 상품 페이지로 이동하는 로직
                        window.open(`https://www.musinsa.com/products/${activeCloth.id}`, '_blank');
                      }}
                    >
                      <ExternalLink className="w-5 h-5 mr-2" />
                      상품 페이지 보기
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full border-green-300 text-green-600 hover:bg-green-50 h-12 text-lg"
                      onClick={() => {
                        handleAddClosetCloth();
                      }}
                    >
                      <ShoppingBag className="w-5 h-5 mr-2" />
                      옷장에 추가하기
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      )}
    </Dialog>
  );
}
