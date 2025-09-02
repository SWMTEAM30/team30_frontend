'use client';

import { useMemo } from 'react';
import { useWikiData } from '@/queries/useWiki';
import { activePanelTypeAtom, wikiTabsAtom, activeWikiTabIdAtom } from '@/atoms/chatAtoms';
import { useAtom } from 'jotai';

export default function MessageParser({ text }: { text: string }) {
  const { data: wikiIndex, isLoading } = useWikiData();

  const [activePanelType, setActivePanelType] = useAtom(activePanelTypeAtom);
  const [wikiTabs, setWikiTabs] = useAtom(wikiTabsAtom);
  const [activeWikiTabId, setActiveWikiTabId] = useAtom(activeWikiTabIdAtom);

  const handleOpenTab = (data: PanelData) => {
    setWikiTabs((prevTabs) => {
      if (prevTabs.some((tab) => tab.src === data.src)) return prevTabs;
      return [...prevTabs, data];
    });
    setActiveWikiTabId(data.src);
    setActivePanelType('wiki');
  };

  const parsedText = useMemo(() => {
    if (isLoading || !wikiIndex) return [text];
    const keywords = Object.keys(wikiIndex);
    if (keywords.length === 0) return [text];
    const regex = new RegExp(`(${keywords.join('|')})`, 'g');
    return text.split(regex);
  }, [text, wikiIndex, isLoading]);

  if (isLoading) return <>위키 로딩 중...</>;
  return (
    <>
      {parsedText.map((part, index) => {
        const matchedWiki = wikiIndex?.[part];

        if (matchedWiki) {
          return (
            <span
              key={index}
              onClick={() => handleOpenTab(matchedWiki)}
              className="font-semibold text-blue-600 hover:underline cursor-pointer"
            >
              {part}
            </span>
          );
        }
        return <span key={index}>{part}</span>;
      })}
    </>
  );
}
