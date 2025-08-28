import { activePanelTypeAtom } from '@/atoms/chatAtoms';
import { cn } from '@/lib/utils';
import { useAtom } from 'jotai';
import { ChevronLeft } from 'lucide-react';

export default function PanelFrame<T>({
  panelType,
  top,
  tabs,
  activeTabData,
  renderTab,
  renderContent,
  detailNoExistsText = '선택된 컨텐츠가 없습니다',
}: {
  panelType: 'image' | 'wiki' | 'fitting';
  top: `top-${number}`;
  tabs: T[];
  activeTabData: any;
  renderTab: (item: T) => React.ReactNode;
  renderContent: (item: T) => React.ReactNode;
  detailNoExistsText?: string;
}) {
  const [activePanelType, setActivePanelType] = useAtom(activePanelTypeAtom);
  return (
    <>
      <button
        onClick={() => {
          if (activePanelType == panelType) setActivePanelType(null);
          else setActivePanelType(panelType);
        }}
        className={cn(
          top,
          `absolute -translate-y-1/2 left-0 h-36 -translate-x-full z-20 bg-beige p-2 rounded-l-lg border border-gray-200 hover:bg-gray-100 transition-colors`,
        )}
        title={activePanelType === panelType ? '패널 닫기' : '패널 열기'}
      >
        <ChevronLeft
          size={20}
          className={`transition-transform duration-300 ${activePanelType === panelType ? 'rotate-180' : 'rotate-0'}`}
        />
      </button>
      {activePanelType === panelType && (
        <>
          <div
            className={cn(
              `h-full w-60 border-r border-gray-200 bg-beige flex flex-col items-center gap-2 overflow-y-auto p-2`,
            )}
          >
            {tabs.map((tab, key) => (
              <div key={key} className="w-full">
                {renderTab(tab)}
              </div>
            ))}
          </div>
          <div className="flex-1 w-160 h-full overflow-y-auto">
            {activeTabData ? (
              <>{renderContent(activeTabData)}</>
            ) : (
              <div className="p-8 text-center text-gray-500">{detailNoExistsText}</div>
            )}
          </div>
        </>
      )}
    </>
  );
}
