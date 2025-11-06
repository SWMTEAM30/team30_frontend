'use client';

import { useState } from 'react';
import { useAtom, useAtomValue } from 'jotai';
import { closetAtom, closetCodinationAtom } from '@/atoms/chatAtoms';
import { useCodinationCreation } from '@/hooks/useCodinationCreation';
import { X } from 'lucide-react';
import Image from 'next/image';

interface CodinationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CodinationModal({ isOpen, onClose }: CodinationModalProps) {
  const [closetCodination, setClosetCodination] = useAtom(closetCodinationAtom);
  const closet = useAtomValue(closetAtom);
  const { createCodination } = useCodinationCreation();
  const [isCreating, setIsCreating] = useState(false);

  if (!isOpen) return null;

  const handleCreateCodination = async () => {
    setIsCreating(true);
    try {
      const success = await createCodination();
      if (success) {
        onClose();
      }
    } catch (error) {
      console.error('코디네이션 생성 실패:', error);
    } finally {
      setIsCreating(false);
    }
  };

  const selectedCloths = closetCodination?.cloths || [];

  // 옷 선택/해제 핸들러
  const handleClothToggle = (cloth: ClosetCloth) => {
    if (!closetCodination) {
      setClosetCodination({
        id: '',
        fitting_id: null,
        cloths: [cloth],
      });
      return;
    }

    const isSelected = closetCodination.cloths.some((c) => c.id === cloth.id);
    if (isSelected) {
      // 선택 해제
      setClosetCodination({
        ...closetCodination,
        cloths: closetCodination.cloths.filter((c) => c.id !== cloth.id),
      });
    } else {
      // 선택 추가
      setClosetCodination({
        ...closetCodination,
        cloths: [...closetCodination.cloths, cloth],
      });
    }
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50 p-4"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.3)' }}
    >
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 sm:p-6 w-full md:w-4/5 max-w-4xl max-h-[95vh] flex flex-col">
        {/* 헤더 */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">코디하기</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
            <X size={24} />
          </button>
        </div>

        {/* 선택된 옷들 표시 */}
        {selectedCloths.length > 0 && (
          <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <h3 className="font-medium mb-2">선택된 옷 ({selectedCloths.length}개)</h3>
            <div className="flex flex-wrap gap-2">
              {selectedCloths.map((cloth) => (
                <div
                  key={cloth.id}
                  className="flex items-center space-x-2 px-2 py-1 bg-blue-100 dark:bg-blue-800/30 rounded"
                >
                  <Image
                    src={cloth.url}
                    alt={cloth.name}
                    width={300}
                    height={300}
                    className="w-6 h-6 object-cover rounded"
                  />
                  <span className=" truncate max-w-20">{cloth.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 옷장 옷들 그리드 */}
        <div className="flex-1 overflow-y-auto min-h-0">
          <h3 className="font-medium   mb-3">옷장에서 선택하세요</h3>
          {closet.length === 0 ? (
            <div className="text-center py-8  ">
              <p>옷장이 비어있습니다</p>
              <p className=" mt-1">AI와 대화하여 패션 아이템을 옷장에 추가해보세요</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {closet.map((cloth) => {
                const isSelected = selectedCloths.some((c) => c.id === cloth.id);
                return (
                  <div
                    key={cloth.id}
                    onClick={() => handleClothToggle(cloth)}
                    className={`relative cursor-pointer border-2 rounded-lg overflow-hidden transition-all duration-200 hover:shadow-md ${
                      isSelected
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-gray-200 dark:border-gray-600 hover:border-blue-300'
                    }`}
                  >
                    {/* 선택 표시 */}
                    {isSelected && (
                      <div className="absolute top-2 right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center z-10">
                        <span className=" text-xs text-white">✓</span>
                      </div>
                    )}

                    {/* 이미지 */}
                    <div className="relative aspect-[3/4] w-full overflow-hidden">
                      <Image src={cloth.url} alt={cloth.name} fill className="object-cover" />
                    </div>

                    {/* 정보 */}
                    <div className="p-2">
                      <h4 className="font-medium  text-sm truncate">{cloth.name}</h4>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* 버튼들 */}
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 mt-4">
          <button
            onClick={onClose}
            className="w-full sm:flex-1 px-4 py-3  bg-gray-200 dark:bg-blue-600 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
          >
            취소
          </button>
          <button
            onClick={handleCreateCodination}
            disabled={selectedCloths.length === 0 || isCreating}
            className="w-full sm:flex-1 px-4 py-3 bg-blue-600 rounded-lg text-white hover:bg-blue-700 dark:hover:bg-blue-500  disabled:bg-blue-200 disabled:dark:bg-blue-800 disabled:dark:hover:bg-blue-800 disabled:cursor-not-allowed transition-colors"
          >
            {isCreating ? '생성 중...' : `코디 생성 (${selectedCloths.length}개)`}
          </button>
        </div>
      </div>
    </div>
  );
}
