'use client';

import { groupModelsAtom, isModelSectionOpenAtom } from '@/atoms/graphAtoms';
import { useGraphHandlers } from '@/components/graph/GraphContextProvider';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAtom, useAtomValue } from 'jotai';
import { ChevronRight } from 'lucide-react';
import Image from 'next/image';

export default function ModelSession() {
  const [isModelSectionOpen, setIsModelSectionOpen] = useAtom(isModelSectionOpenAtom);
  const groupModels = useAtomValue(groupModelsAtom);
  const { nodes } = useGraphHandlers();
  return (
    <div
      className={`fixed top-0 right-0 h-full w-80 bg-white border-l border-gray-200 shadow-lg z-50 transition-transform duration-300 ease-in-out ${
        isModelSectionOpen ? 'translate-x-0' : 'translate-x-full'
      }`}
    >
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-800">모델 미리보기</h2>
        <Button variant="ghost" size="sm" onClick={() => setIsModelSectionOpen(false)}>
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>

      <ScrollArea className="h-[calc(100vh-80px)]">
        <div className="p-4 space-y-6">
          {Object.entries(groupModels).map(([groupId, modelData]) => {
            const groupNode = nodes.find((n) => n.id === groupId);
            if (!groupNode) return null;

            return (
              <div key={groupId} className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-medium text-gray-800 mb-3">{(groupNode.data?.label as string) || '그룹'}</h3>

                {/* 모델 이미지 */}
                <div className="relative mb-3">
                  <Image
                    width={300}
                    height={300}
                    src={modelData.modelImage}
                    alt="모델"
                    className="w-full h-48 object-cover rounded-lg"
                  />
                </div>

                {/* 착용 아이템 목록 */}
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-gray-600">착용 아이템:</h4>
                  {modelData.wornItems.length > 0 ? (
                    <div className="space-y-1">
                      {modelData.wornItems.map((item, index) => (
                        <div key={index} className="text-sm text-gray-700 bg-gray-50 px-2 py-1 rounded">
                          {item}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">아무 옷도 입고 있지 않음</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
}
