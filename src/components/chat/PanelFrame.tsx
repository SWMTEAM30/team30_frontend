import Image from 'next/image';
import ImageDetailPanel from '@/components/chat/ImageDetailPanel';
import { cn } from '@/lib/utils';

export default function PanelFrame({
  openTabs,
  activeTabId,
  onTabSelect,
  onTabClose,
  className,
}: {
  openTabs: any[];
  activeTabId: string | null;
  onTabSelect: (id: string) => void;
  onTabClose: (id: string) => void;
  className?: string;
}) {
  const activeTabData = openTabs.find((tab) => tab.src === activeTabId);

  return (
    <>
      {/* 왼쪽: 세로 탭 바 (1/3) */}
      <div
        className={cn(
          className,
          `h-full w-28 border-r border-gray-200 bg-beige flex flex-col items-center gap-2 overflow-y-auto p-2`,
        )}
      >
        {openTabs.map((tab) => (
          <div
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
          </div>
        ))}
      </div>
      {/* 오른쪽: 상세 이미지 영역 (2/3) */}
      <div className="flex-1 w-96 h-full overflow-y-auto">
        {activeTabData ? (
          <ImageDetailPanel imageData={activeTabData} />
        ) : (
          <div className="p-8 text-center text-gray-500">선택된 이미지가 없습니다.</div>
        )}
      </div>
    </>
  );
}
