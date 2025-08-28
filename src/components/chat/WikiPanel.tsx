import { wikiTabsAtom, activeWikiTabIdAtom } from '@/atoms/chatAtoms';
import PanelExtensionButton from '@/components/chat/PanelExtensionButton';
import PanelFrame from '@/components/chat/PanelFrame';
import { useAtomValue, useAtom } from 'jotai';
import { MDXClient } from 'next-mdx-remote-client';
import React from 'react';

export default function WikiPanel({ top }: { top: number }) {
  const wikiTabs = useAtomValue(wikiTabsAtom);
  const [activeWikiTabId, setActiveWikiTabId] = useAtom(activeWikiTabIdAtom);
  const activeTabData = wikiTabs.find((tab) => tab.src === activeWikiTabId);

  return (
    <>
      <PanelExtensionButton panelType={'wiki'} top={top} />
      <PanelFrame
        panelType={'wiki'}
        openedTabs={wikiTabs}
        activeTabId={activeWikiTabId}
        handleTabSelect={setActiveWikiTabId}
        DetailPanel={<MDXClient {...(activeTabData?.content ?? '')} />}
        detailNoExistsText={'선택된 위키가 없습니다.'}
      />
    </>
  );
}
