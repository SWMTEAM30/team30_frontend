'use client';

import { activeCodinationAtom, panelAtom } from '@/atoms/chatAtoms';
import { useAtom, useSetAtom } from 'jotai';
import { Trash2, ChevronDown, ChevronUp, Edit } from 'lucide-react';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import React from 'react';
import { Dialog } from '@/components/ui/dialog';
import { postFittingTryonCombo } from '@/api/fittingAPI';
import { useCodination } from '@/hooks/useCodination';
import { useFitting } from '@/hooks/useFitting';
import { getFittingStatusTaskId } from '@/api/fittingAPI';
import { loadUserProfile } from '@/lib/indexedDB';
import { userAtom } from '@/atoms/authAtoms';
import ClothModal from '@/components/chat/modal/ClothModal';

interface ClosetCloth {
  id: string;
  name: string;
  url: string;
  description: string;
  tags: string[];
}

type Product = {
  product_url: string;
  product_id: string;
};

export default function CodinationCard({ codination }: { codination: any }) {
  const setPanel = useSetAtom(panelAtom);
  const [activeCodination, setActiveCodination] = useAtom(activeCodinationAtom);
  const [user] = useAtom(userAtom);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingCodination, setEditingCodination] = useState(codination);
  const [isClothModalOpen, setIsClothModalOpen] = useState(false);
  const [activeCloth, setActiveCloth] = useState<ClosetCloth | null>(null);

  // codination이 변경될 때 editingCodination도 업데이트
  useEffect(() => {
    setEditingCodination(codination);
  }, [codination]);

  // 스토리지 훅 사용
  const { codinations, removeCodination, updateCodination } = useCodination();
  const { updateFittingStatus } = useFitting(codination.id);

  // 비동기 피팅 결과 폴링 함수
  const pollFittingResult = async (taskId: string) => {
    const maxAttempts = 10; // 최대 10번 시도
    const pollInterval = 10000; // 10초마다 폴링

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      try {
        await new Promise((resolve) => setTimeout(resolve, pollInterval));

        const response = await getFittingStatusTaskId(taskId);
        console.log(`피팅 상태 확인 (${attempt + 1}/${maxAttempts}):`, response);

        if (response.status === 'success' && response.data?.download_url) {
          // 피팅 완료
          console.log('🎉 피팅 성공! 상태 업데이트 중...', response.data.download_url);
          await updateFittingStatus({
            status: 'success',
            resultUrl: response.data.download_url,
            taskId: taskId,
          });
          console.log('✅ 피팅 결과 폴링 완료:', response.data.download_url);
          return;
        } else if (response.status === 'fail') {
          // 피팅 실패
          console.log('💥 피팅 실패! 에러 상태 업데이트 중...', response.message);
          await updateFittingStatus({
            status: 'error',
            errorMessage: response.message || '피팅 처리 중 오류가 발생했습니다.',
            taskId: taskId,
          });
          console.error('❌ 피팅 폴링 실패:', response.message);
          return;
        }
        // 아직 처리 중이면 계속 폴링
      } catch (error) {
        console.error(`피팅 상태 확인 오류 (${attempt + 1}/${maxAttempts}):`, error);
        if (attempt === maxAttempts - 1) {
          // 마지막 시도에서도 실패하면 에러 처리
          await updateFittingStatus({
            status: 'error',
            errorMessage: '피팅 결과를 가져오는 중 오류가 발생했습니다.',
            taskId: taskId,
          });
        }
      }
    }

    // 최대 시도 횟수 초과
    await updateFittingStatus({
      status: 'error',
      errorMessage: '피팅 처리 시간이 초과되었습니다.',
      taskId: taskId,
    });
    console.error('⏰ 피팅 폴링 시간 초과');
  };

  const handleRemoveCodination = async (codi_id: string) => {
    await removeCodination(codi_id);
  };

  const handleEditCodination = () => {
    setEditingCodination(codination);
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = async () => {
    await updateCodination(editingCodination);
    setIsEditModalOpen(false);
    setEditingCodination(codination); // 상태 초기화
  };

  const handleCancelEdit = () => {
    setEditingCodination(codination);
    setIsEditModalOpen(false);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    // 모달이 완전히 닫힌 후 상태 초기화
    setTimeout(() => {
      setEditingCodination(codination);
    }, 100);
  };

  const handleRemoveClothFromEdit = (clothId: string) => {
    setEditingCodination((prev: { cloths: any[] }) => ({
      ...prev,
      cloths: prev.cloths.filter((cloth) => cloth.id !== clothId),
    }));
  };

  const handleVirtualFitting = async () => {
    // 상의와 하의가 모두 있는지 확인
    const upperCloth = codination.cloths.find((cloth: ClosetCloth) => cloth.url.includes('TOP'));
    const lowerCloth = codination.cloths.find((cloth: ClosetCloth) => cloth.url.includes('BOTTOM'));

    if (!upperCloth || !lowerCloth) {
      alert('상의와 하의를 각각 하나씩 포함한 코디네이션만 가상 피팅이 가능합니다.');
      return;
    }

    // 사용자 프로필의 모델 이미지 체크
    // if (user?.userId) {
    //   try {
    //     const userProfile = await loadUserProfile(user.userId);
    //     console.log(userProfile);
    //     if (!userProfile?.modelImage) {
    //       // 세팅 패널 모달 띄우기
    //       setPanel('settings');
    //       console.log('???');
    //       return;
    //     }
    //   } catch (error) {
    //     console.error('사용자 프로필 로드 실패:', error);
    //     // 세팅 패널 모달 띄우기
    //     setPanel('settings');
    //     return;
    //   }
    // }

    // 가상피팅 요청 시작
    console.log('🚀 가상피팅 시작:', { upperId: upperCloth.id, lowerId: lowerCloth.id });

    // 즉시 pending 상태로 설정
    await updateFittingStatus({
      codinationId: codination.id,
      status: 'pending',
      resultUrl: null,
      errorMessage: null,
      taskId: null,
    });

    // 패널을 피팅으로 변경
    setPanel('fitting');

    // 사용자 모델 이미지 가져오기
    let modelImageUrl = user?.modelImage || '/model_image.jpg'; // 기본값

    // API 호출
    postFittingTryonCombo(upperCloth.id, lowerCloth.id, modelImageUrl)
      .then(async (response) => {
        console.log('가상피팅 응답:', response);
        if (response.status === 'success') {
          // 결과가 바로 있는 경우 (동기 응답)
          if (response.data?.download_url) {
            await updateFittingStatus({
              codinationId: codination.id,
              status: 'success',
              resultUrl: response.data.download_url,
              errorMessage: null,
              taskId: response.data.task_id,
            });
          }
          // taskId만 있는 경우 (비동기 처리)
          else if (response.data?.task_id) {
            await updateFittingStatus({
              codinationId: codination.id,
              taskId: response.data.task_id,
            });

            // 비동기 피팅 결과 폴링 시작
            pollFittingResult(response.data.task_id);
          }
        } else {
          await updateFittingStatus({
            codinationId: codination.id,
            status: 'error',
            resultUrl: null,
            errorMessage: response.message || '가상 피팅에 실패했습니다.',
            taskId: null,
          });
        }
      })
      .catch(async (error) => {
        console.error('가상피팅 오류:', error);
        await updateFittingStatus({
          codinationId: codination.id,
          status: 'error',
          resultUrl: null,
          errorMessage: '가상 피팅 중 오류가 발생했습니다.',
          taskId: null,
        });
      });
  };

  return (
    <div className="w-full bg-white dark:bg-slate-800 rounded-2xl transition-all duration-300 border-2 overflow-hidden shadow-sm hover:shadow-md">
      {/* 메인 카드 헤더 */}
      <div
        className={`flex flex-row border-b-2 cursor-pointer transition-all duration-300 ${
          codination.id === activeCodination?.id
            ? 'border-blue-500 ring-2 ring-blue-200'
            : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
        } ${isExpanded ? 'border-b-slate-200 dark:border-b-slate-700' : 'border-b-transparent'}`}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {/* 아이템 이미지들 */}
        <div className="flex-shrink-0 p-4">
          <div className="grid grid-cols-2 gap-3 max-w-[200px]">
            {codination.cloths.map((product: ClosetCloth, clothKey: number) => (
              <div key={clothKey} className="relative aspect-square">
                <Image
                  className="object-cover rounded-lg border border-slate-200 w-full h-full"
                  src={product.url}
                  alt={product.name}
                  fill
                />
              </div>
            ))}
          </div>
        </div>

        {/* 코디 정보 */}
        <div className="flex-1 p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="font-semibold text-2xl">
                코디
                <span className="text-lg"> {codination.cloths.length}개 아이템</span>
              </p>
              {isExpanded ? (
                <ChevronUp className="w-5 h-5 text-slate-400" />
              ) : (
                <ChevronDown className="w-5 h-5 text-slate-400" />
              )}
            </div>

            {/* Description을 먼저 표시 */}
            {codination.description && (
              <div className="mb-3 p-3 bg-slate-50 dark:bg-slate-700 rounded-lg border-l-4 border-blue-500">
                <p className="text-sm text-slate-700 dark:text-slate-300 italic">"{codination.description}"</p>
              </div>
            )}

            <div className="flex flex-col gap-1">
              {codination.cloths.map((product: ClosetCloth, clothKey: number) => (
                <span key={clothKey} className="px-2 py-1 text-lg rounded-full">
                  - {product.name}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 콜랩스 컨텐츠 */}
      <div
        className={`transition-all duration-300 overflow-hidden ${
          isExpanded ? 'max-h-none opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="p-4 space-y-2">
          {/* 옷 아이템들 */}
          {codination.cloths.map((cloth: ClosetCloth, index: number) => {
            // ClosetCloth를 Product 타입으로 변환
            const product: Product = {
              product_id: cloth.id,
              product_url: cloth.url,
            };

            return (
              <div
                key={cloth.id}
                className="flex items-center gap-4 p-4 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer transition-colors"
                onClick={() => {
                  setActiveCloth(cloth);
                  setIsClothModalOpen(true);
                }}
              >
                <div className="relative w-20 h-20 flex-shrink-0">
                  <Image
                    className="object-cover rounded-lg border border-slate-200"
                    src={cloth.url}
                    alt={cloth.name}
                    fill
                  />
                </div>
                <div className="flex flex-col flex-1 min-w-0">
                  <span className="text-lg font-semibold dark:text-white truncate">{cloth.name}</span>
                  <span className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2">{cloth.description}</span>
                </div>
              </div>
            );
          })}

          {/* 구분선 */}
          <div className="border-t border-slate-200 dark:border-slate-700 my-3" />

          {/* 액션 버튼들 */}
          <div className="space-y-2">
            {codination.fitting_image ? (
              <button
                onClick={handleVirtualFitting}
                className="w-full flex items-center gap-2 p-3 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/20 text-green-600 dark:text-green-400 transition-colors"
              >
                <div className="w-4 h-4 rounded-full bg-green-500"></div>
                <span className="text-lg">피팅 결과 보기</span>
              </button>
            ) : (
              <button
                onClick={handleVirtualFitting}
                className="w-full flex items-center gap-2 p-3 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 text-blue-600 dark:text-blue-400 transition-colors"
              >
                <div className="w-4 h-4 rounded-full bg-blue-500"></div>
                <span className="text-lg">가상 피팅하기</span>
              </button>
            )}

            {/* 수정하기 버튼 숨김 */}
            {/* <button
              onClick={handleEditCodination}
              className="w-full flex items-center gap-2 p-3 rounded-lg hover:bg-yellow-50 dark:hover:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400 transition-colors"
            >
              <Edit className="w-4 h-4" />
              <span className="text-lg">수정하기</span>
            </button> */}

            <button
              onClick={() => handleRemoveCodination(codination.id)}
              className="w-full flex items-center gap-2 p-3 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              <span className="text-lg">삭제하기</span>
            </button>
          </div>
        </div>
      </div>

      {/* 옷 모달 */}
      <Dialog open={isClothModalOpen} onOpenChange={setIsClothModalOpen}>
        {activeCloth && (
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 max-w-4xl w-full max-h-[80vh] overflow-y-auto">
            <div className="flex flex-col lg:flex-row gap-6">
              {/* 이미지 영역 */}
              <div className="flex-1 flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-6 rounded-lg">
                <div className="relative w-full h-96 max-w-md">
                  <Image
                    src={activeCloth.url}
                    alt={activeCloth.name}
                    fill
                    className="object-cover rounded-lg"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 40vw"
                  />
                </div>
              </div>

              {/* 정보 영역 */}
              <div className="flex-1 space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{activeCloth.name}</h2>
                  <button
                    onClick={() => setIsClothModalOpen(false)}
                    className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                  >
                    ✕
                  </button>
                </div>

                {/* 상품 설명 */}
                <div>
                  <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300 mb-2">상품 설명</h3>
                  <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{activeCloth.description}</p>
                  </div>
                </div>

                {/* 스타일 태그 */}
                <div>
                  <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300 mb-2">스타일 태그</h3>
                  <div className="flex flex-wrap gap-2">
                    {activeCloth.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-sm rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* 액션 버튼들 */}
                <div className="space-y-3 pt-4">
                  <button
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg transition-colors"
                    onClick={() => {
                      window.open(`https://www.musinsa.com/products/${activeCloth.id}`, '_blank');
                    }}
                  >
                    상품 페이지 보기
                  </button>
                  <button
                    className="w-full border border-green-300 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 py-3 px-4 rounded-lg transition-colors"
                    onClick={() => {
                      // 옷장에 추가하는 로직 (필요시 구현)
                      setIsClothModalOpen(false);
                    }}
                  >
                    옷장에 추가하기
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </Dialog>

      {/* 수정 모달 */}
      {isEditModalOpen && (
        <Dialog open={isEditModalOpen} onOpenChange={handleCloseEditModal}>
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">코디네이션 수정</h2>
              <button
                onClick={handleCloseEditModal}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-3 text-slate-700 dark:text-slate-300">코디네이션 설명</h3>
                <textarea
                  value={editingCodination.description || ''}
                  onChange={(e) => setEditingCodination((prev: any) => ({ ...prev, description: e.target.value }))}
                  placeholder="이 코디네이션에 대한 설명을 입력하세요..."
                  className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  rows={3}
                />
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3 text-slate-700 dark:text-slate-300">현재 아이템들</h3>
                <div className="space-y-2">
                  {editingCodination.cloths.map((cloth: ClosetCloth, index: number) => (
                    <div
                      key={cloth.id}
                      className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 dark:border-slate-700"
                    >
                      <Image
                        className="object-contain rounded border border-slate-200"
                        src={cloth.url}
                        alt={cloth.name}
                        width={48}
                        height={48}
                        style={{ width: '48px', height: '48px' }}
                      />
                      <div className="flex-1">
                        <span className="text-lg font-semibold dark:text-white">{cloth.name}</span>
                        <p className="text-sm text-slate-600 dark:text-slate-400">{cloth.description}</p>
                      </div>
                      <button
                        onClick={() => handleRemoveClothFromEdit(cloth.id)}
                        className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {editingCodination.cloths.length === 0 && (
                <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                  모든 아이템이 제거되었습니다. 최소 하나의 아이템이 필요합니다.
                </div>
              )}

              <div className="flex gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
                <button
                  onClick={handleCloseEditModal}
                  className="flex-1 px-4 py-2 text-slate-600 dark:text-slate-400 border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                >
                  취소
                </button>
                <button
                  onClick={handleSaveEdit}
                  disabled={editingCodination.cloths.length === 0}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors"
                >
                  저장
                </button>
              </div>
            </div>
          </div>
        </Dialog>
      )}
    </div>
  );
}
