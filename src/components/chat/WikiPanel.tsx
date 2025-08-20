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
      <div className="w-60 border-r border-gray-200 flex flex-col items-center gap-2 p-2 overflow-y-auto">
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
      <div className="w-[50vw] flex-1 p-4 overflow-y-auto">
        {activeTabData ? (
          <div className="max-w-none">
            <h2 className="text-3xl font-bold text-gray-900 mb-4 border-b border-gray-200 pb-2">
              {activeTabData.name}
            </h2>
            <div className="text-2xl prose prose-sm max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-ul:text-gray-700 prose-li:text-gray-700 prose-img:w-[300px] prose-img:h-auto prose-img:rounded-lg prose-img:shadow-md prose-img:mx-auto prose-img:my-6 prose-img:block">
              {activeTabData.content ? <MDXClient {...activeTabData.content} /> : '위키 내용이 없습니다.'}
            </div>
          </div>
        ) : (
          <div className="text-gray-500">선택된 위키가 없습니다.</div>
        )}
      </div>
    </div>
  );
}
