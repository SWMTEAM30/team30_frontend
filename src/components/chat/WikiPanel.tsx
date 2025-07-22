import React from 'react';

interface WikiPanelProps {
  openTabs: any[];
  activeTabId: string | null;
  onTabSelect: (id: string) => void;
  onTabClose: (id: string) => void;
  className?: string;
}

const WikiPanel: React.FC<WikiPanelProps> = ({ openTabs, activeTabId, onTabSelect, onTabClose, className }) => {
  const activeTabData = openTabs.find((tab) => tab.src === activeTabId);

  return (
    <div className={`flex h-full w-96 bg-beige border-l border-gray-200 ${className || ''}`}>
      {/* 탭 목록 */}
      <div className="w-28 border-r border-gray-200 flex flex-col items-center gap-2 p-2 overflow-y-auto">
        {openTabs.map((tab) => (
          <button
            key={tab.src}
            onClick={() => onTabSelect(tab.src)}
            className={`w-full p-2 rounded-lg mb-2 ${activeTabId === tab.src ? 'bg-blue-200' : 'hover:bg-gray-100'}`}
          >
            <span>{tab.name || tab.src}</span>
            <button
              onClick={e => { e.stopPropagation(); onTabClose(tab.src); }}
              className="ml-2 text-xs text-red-500 hover:underline"
            >
              닫기
            </button>
          </button>
        ))}
      </div>
      {/* 탭 내용 */}
      <div className="flex-1 p-4 overflow-y-auto">
        {activeTabData ? (
          <div>
            <h2 className="text-lg font-bold mb-2">{activeTabData.name || activeTabData.src}</h2>
            <div>{activeTabData.content || '위키 내용이 없습니다.'}</div>
          </div>
        ) : (
          <div className="text-gray-500">선택된 위키가 없습니다.</div>
        )}
      </div>
    </div>
  );
};

export default WikiPanel; 