import { MDXClient } from 'next-mdx-remote-client';
import { useAtom, useAtomValue } from 'jotai';
import { activeWikiTabIdAtom, wikiTabsAtom } from '@/atoms/chatAtoms';
import PanelFrame from '@/components/chat/panel/PanelFrame';
import { useChatHandlers } from '@/components/chat/area/ChatContextProvider';

function WikiTabButton({ tab }: { tab: any }) {
  const [activeWikiTabId, setActiveWikiTabId] = useAtom(activeWikiTabIdAtom);
  const { handleCloseTab } = useChatHandlers();

  return (
    <button
      onClick={() => setActiveWikiTabId(tab.src)}
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
  );
}

function WikiDetailPanel({ wiki }: { wiki: MessageWiki | null }) {
  if (!wiki) return null;
  return (
    <div className="p-5 prose text-lg prose-sm max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-ul:text-gray-700 prose-li:text-gray-700 prose-img:w-[300px] prose-img:h-auto prose-img:rounded-lg prose-img:shadow-md prose-img:mx-auto prose-img:my-6 prose-img:block">
      <MDXClient {...wiki.content} />
    </div>
  );
}

export default function WikiPanel() {
  const wikiTabs = useAtomValue(wikiTabsAtom);
  const activeWikiTabId = useAtomValue(activeWikiTabIdAtom);
  const activeTabData = wikiTabs.find((tab) => tab.src === activeWikiTabId);
  return (
    <PanelFrame<MessageWiki>
      panelType={'wiki'}
      activeTabData={activeTabData}
      tabs={wikiTabs}
      renderTab={(tab) => <WikiTabButton tab={tab} />}
      renderContent={(activeTab) => <WikiDetailPanel wiki={activeTab} />}
      detailNoExistsText="단어가 선택되지 않았습니다."
    />
  );
}
