// components/ImagePanel.tsx

import Image from 'next/image';
import ImageDetailPanel from '@/components/ImageDetailPanel';
import { ChevronLeft } from 'lucide-react';

export default function ImagePanel({
  isOpen,
  onToggle, // 패널을 여닫는 함수
  openTabs,
  activeTabId,
  onTabSelect,
  onTabClose,
}: {
  isOpen: boolean;
  onToggle: () => void;
  openTabs: any[];
  activeTabId: string | null;
  onTabSelect: (id: string) => void;
  onTabClose: (id: string) => void;
}) {
  const activeTabData = openTabs.find((tab) => tab.src === activeTabId);

  return (
    <div
      className={`fixed top-0 right-0 h-full bg-beige border-l border-gray-200 shadow-xl z-40 
                 flex flex-row transition-transform duration-500 ease-in-out
                 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
    >
      <button
        onClick={onToggle}
        className="absolute top-36 -translate-y-1/2 left-0 h-36 -translate-x-full z-20 bg-beige p-2 rounded-l-lg border border-gray-200 hover:bg-gray-100 transition-colors"
        title={isOpen ? '패널 닫기' : '패널 열기'}
      >
        <ChevronLeft size={20} className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : 'rotate-0'}`} />
      </button>
      {/* 왼쪽: 세로 탭 바 (1/3) */}
      <div className="h-full w-28 border-r border-gray-200 bg-beige flex flex-col items-center gap-2 overflow-y-auto p-2">
        {openTabs.map((tab) => (
          <button
            key={tab.src}
            onClick={() => onTabSelect(tab.src)}
            className={`relative overflow-hidden flex-shrink-0 
                       transition-all duration-200
                       ${activeTabId === tab.src ? 'ring-2 ring-blue-500 ring-offset-2' : 'hover:opacity-80'}`}
          >
            <Image src={tab.src} alt={tab.name} width={64} height={64} className="h-32 w-28 object-cover" />
            <button
              onClick={(e) => {
                e.stopPropagation();
                onTabClose(tab.src);
              }}
              className="absolute top-0 right-0 m-1 w-5 h-5 bg-black/50 text-white text-xs rounded-full flex items-center justify-center hover:bg-red-500"
              title="탭 닫기"
            >
              ×
            </button>
          </button>
        ))}
      </div>
      {/* 오른쪽: 상세 이미지 영역 (2/3) */}
      <div className="flex-1 w-96 h-full overflow-y-auto">
        {activeTabData ? (
          <ImageDetailPanel imageData={activeTabData} onClose={() => onTabClose(activeTabData.src)} />
        ) : (
          <div className="p-8 text-center text-gray-500">선택된 이미지가 없습니다.</div>
        )}
      </div>
    </div>
  );
}
