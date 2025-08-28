import Image from 'next/image';
import { cn } from '@/lib/utils';
import { useAtomValue } from 'jotai';
import { activePanelTypeAtom } from '@/atoms/chatAtoms';
import { useChatHandlers } from '@/components/chat/ChatContextProvider';

export default function PanelFrame({
  panelType,
  openedTabs,
  activeTabId,
  handleTabSelect,
  className,
  DetailPanel,
  detailNoExistsText = '선택된 데이터가 없습니다.',
}: {
  panelType: 'image' | 'wiki' | 'fitting';
  openedTabs: any[];
  activeTabId: string | null;
  handleTabSelect: (id: string) => void;
  className?: string;
  DetailPanel: React.ReactNode;
  detailNoExistsText: string;
}) {
  const activeTabData = openedTabs.find((tab) => tab.src === activeTabId);
  const activePanelType = useAtomValue(activePanelTypeAtom);
  const { handleCloseTab } = useChatHandlers();

  return activePanelType == panelType ? (
    <>
      {/* 왼쪽: 세로 탭 바 (1/3) */}
      <div
        className={cn(
          className,
          `h-full w-60 border-r border-gray-200 bg-beige flex flex-col items-center gap-2 overflow-y-auto p-2`,
        )}
      >
        {openedTabs.map((tab, key) => (
          <button
            key={key}
            onClick={() => handleTabSelect(tab.src)}
            className={`relative overflow-hidden flex-shrink-0 
                       transition-all duration-200
                       ${activeTabId === tab.src ? 'ring-2 ring-blue-500 ring-offset-2' : 'hover:opacity-80'}`}
          >
            <Image src={tab.src} alt={tab.name} width={64} height={64} className="h-64 w-56 object-cover" />
            <div
              onClick={(e) => {
                e.stopPropagation();
                handleCloseTab(tab.src);
              }}
              className="absolute top-0 right-0 m-1 w-5 h-5 bg-black/50 text-white text-xs rounded-full flex items-center justify-center hover:bg-red-500"
              title="탭 닫기"
            >
              ×
            </div>
          </button>
        ))}
      </div>
      {/* 오른쪽: 상세 이미지 영역 (2/3) */}
      <div className="flex-1 w-160 h-full overflow-y-auto">
        {activeTabData ? <>{DetailPanel}</> : <div className="p-8 text-center text-gray-500">{detailNoExistsText}</div>}
      </div>
    </>
  ) : null;
}
