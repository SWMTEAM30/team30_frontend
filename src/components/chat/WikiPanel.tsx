import { wikiTabsAtom, activeWikiTabIdAtom } from '@/atoms/chatAtoms';
import { useChatHandlers } from '@/components/chat/ChatContextProvider';
import { useAtomValue, useAtom } from 'jotai';
import { MDXClient } from 'next-mdx-remote-client';
import React from 'react';

export default function WikiPanel({ className }: { className?: string }) {
  const wikiTabs = useAtomValue(wikiTabsAtom);
  const [activeWikiTabId, setActiveImageTabId] = useAtom(activeWikiTabIdAtom);
  const activeTabData = wikiTabs.find((tab) => tab.src === activeWikiTabId);
  const { handleCloseTab } = useChatHandlers();

  return (
    <div className={`flex h-full bg-beige border-l border-gray-200 ${className || ''}`}>
      {/* 탭 목록 */}
      <div className="w-36 border-r border-gray-200 flex flex-col items-center gap-2 p-2 overflow-y-auto">
        {wikiTabs.map((tab, i) => (
          <button
            key={i}
            onClick={() => setActiveImageTabId(tab.src)}
            className={`w-full flex p-2 mb-2 ${activeWikiTabId === tab.src ? 'bg-beige-100' : 'hover:bg-beige-300'}`}
          >
            <span
              onClick={(e) => {
                e.stopPropagation();
                handleCloseTab(tab.src);
              }}
              className="me-3 text-md text-red-500"
            >
              x
            </span>
            <span>{tab.name || tab.src}</span>
          </button>
        ))}
      </div>
      {/* 탭 내용 */}
      <div className="w-88 flex-1 p-4 overflow-y-auto">
        {activeTabData ? (
          <div>
            <h2 className="text-lg font-bold mb-2">{activeTabData.name}</h2>
            <div>{activeTabData.content ? <MDXClient {...activeTabData.content} /> : '위키 내용이 없습니다.'}</div>
          </div>
        ) : (
          <div className="text-gray-500">선택된 위키가 없습니다.</div>
        )}
      </div>
    </div>
  );
}
