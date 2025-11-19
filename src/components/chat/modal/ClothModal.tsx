'use client';

import React, { useCallback, useState, KeyboardEvent } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ExternalLink, ShoppingBag, Loader2 } from 'lucide-react';
import { useAtom, useSetAtom } from 'jotai';
import { activeClothAtom, panelAtom } from '@/atoms/chatAtoms';
import { getChatProduct, getChatProductDescription } from '@/api/chatAPI';
import { useCloset } from '@/hooks/useCloset';

interface ClothModalProps {
  product?: Product;
  cloth?: ClosetCloth;
  children: React.ReactNode;
}

export default function ClothModal({ product, cloth, children }: ClothModalProps) {
  const [activeCloth, setActiveCloth] = useAtom(activeClothAtom);
  const [isOpen, setIsOpen] = useState(false);
  const setPanel = useSetAtom(panelAtom);
  const [productDescription, setProductDescription] = useState('');
  const [isLoadingDescription, setIsLoadingDescription] = useState(false);
  const [showQuestionInput, setShowQuestionInput] = useState(false);
  const [questionInput, setQuestionInput] = useState('');

  // 스토리지 훅 사용
  const { closet, addClothToCloset } = useCloset();

  const handleOpenChange = useCallback(
    async (open: boolean) => {
      if (open) {
        // cloth가 직접 제공된 경우 (코디네이션에서 사용)
        if (cloth) {
          setActiveCloth(cloth);
          setIsOpen(true);
          return;
        }

        // product가 제공된 경우 (기존 로직)
        if (product) {
          if (product.product_id == 'user') {
            setActiveCloth({
              id: 'user',
              description: '사용자의 모델입니다.',
              name: '유저 모델',
              tags: ['피팅모델'],
              url: product.product_url,
            });
            setIsOpen(true);
            return;
          }

          const data = await getChatProduct(product);
          if (data.status === 'fail') {
            console.log(data.message);
            return;
          }
          setActiveCloth(data.data);
          setIsOpen(true);
        }
      } else {
        // 모달을 닫을 때
        setActiveCloth(null);
        setIsOpen(false);
        setProductDescription('');
        setIsLoadingDescription(false);
        setShowQuestionInput(false);
        setQuestionInput('');
      }
    },
    [product, cloth, setActiveCloth],
  );

  const handleAddClosetCloth = useCallback(async () => {
    if (!activeCloth) return;

    // 중복 체크
    const exists = closet.some((cloth) => cloth.id === activeCloth.id);
    if (!exists) {
      await addClothToCloset(activeCloth);
    }

    setPanel('closet');
    setIsOpen(false);
  }, [activeCloth, closet, addClothToCloset, setPanel]);

  const handleGetProductDescription = useCallback(async () => {
    if (!activeCloth || activeCloth.id === 'user' || !questionInput.trim()) return;
    setIsLoadingDescription(true);
    const res = await getChatProductDescription(activeCloth.id, questionInput.trim());
    setProductDescription(
      res.status === 'success' ? (typeof res.data === 'string' ? res.data : '') : '',
    );
    setIsLoadingDescription(false);
  }, [activeCloth, questionInput]);

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      {activeCloth && (
        <DialogContent className="w-[90vw] h-[85vh] sm:max-w-7xl p-0">
          <div className="flex flex-col lg:flex-row h-full xl:max-w-7xl">
            {/* 위쪽/왼쪽: 이미지 영역 */}
            <div className="flex-1 flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-8 min-h-0 lg:border-r lg:border-gray-200 lg:dark:border-gray-700">
              <div className="relative w-full h-full max-w-xl">
                <Image
                  src={activeCloth.url}
                  alt={activeCloth.id}
                  fill
                  className="object-contain rounded-lg"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 60vw"
                />
              </div>
            </div>

            {/* 아래쪽/오른쪽: 상품 정보 영역 */}
            <div className="h-80 lg:h-full lg:max-w-xl bg-white dark:bg-gray-800 border-t lg:border-t-0 border-gray-200 dark:border-gray-700 p-8 overflow-y-auto">
              <DialogHeader className="mb-6">
                <DialogTitle className="text-4xl font-bold ">{activeCloth.name}</DialogTitle>
              </DialogHeader>

              <div className="space-y-6">
                {/* 스타일 정보 */}
                <div>
                  <h3 className="text-2xl font-semibold mb-4">스타일 정보</h3>
                  <div className=" p-4 rounded-lg">
                    <div className="flex flex-wrap gap-2">
                      {activeCloth.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="px-3 py-2 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-md rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 액션 버튼들 */}
                <div>
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
                    <Button
                      variant="outline"
                      className="w-full h-12 text-lg"
                      onClick={() => {
                        if (!activeCloth || activeCloth.id === 'user') return;
                        setShowQuestionInput(!showQuestionInput);
                        if (showQuestionInput) {
                          setQuestionInput('');
                        }
                      }}
                    >
                      상품 설명 보기
                    </Button>
                    {showQuestionInput && (
                      <div className="mt-3 space-y-2">
                        <Textarea
                          value={questionInput}
                          onChange={(e) => setQuestionInput(e.target.value)}
                          placeholder="상품에 대해 궁금한 점에 대해 물어보세요!"
                          onKeyDown={(e: KeyboardEvent<HTMLTextAreaElement>) => {
                            const isEmpty = !questionInput.trim();
                            const isComposing = e.nativeEvent.isComposing;

                            if (isComposing) {
                              return;
                            }

                            const isEnter = e.key === 'Enter' && !e.shiftKey;
                            const submitOnEnter = isEnter && !isEmpty;

                            if (submitOnEnter) {
                              e.preventDefault();
                              handleGetProductDescription();
                            }
                          }}
                          className="w-full min-h-[80px] resize-none"
                          rows={3}
                        />
                        <Button
                          className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                          onClick={handleGetProductDescription}
                          disabled={!questionInput.trim() || isLoadingDescription}
                        >
                          {isLoadingDescription ? (
                            <>
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              설명을 불러오는 중...
                            </>
                          ) : (
                            '질문하기'
                          )}
                        </Button>
                      </div>
                    )}
                  </div>
                  {isLoadingDescription && (
                    <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 flex items-center gap-3">
                      <Loader2 className="w-5 h-5 animate-spin text-gray-500" />
                      <span className="text-sm text-gray-600 dark:text-gray-300">설명을 불러오는 중...</span>
                    </div>
                  )}
                  {productDescription.length > 0 && (
                    <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
                      <h3 className="text-xl font-semibold mb-2">상품 설명</h3>
                      <p className="text-sm leading-6 whitespace-pre-wrap">{productDescription}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      )}
    </Dialog>
  );
}
