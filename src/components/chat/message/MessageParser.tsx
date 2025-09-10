'use client';

import { useMemo } from 'react';
import { useWikiData } from '@/queries/useWiki';
import WikiModal from '@/components/chat/message/WikiModal';

export default function MessageParser({ text }: { text: string }) {
  const { data: wikiIndex, isLoading } = useWikiData();

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
            <WikiModal key={index} wiki={matchedWiki}>
              <span className="font-semibold text-blue-600 hover:underline cursor-pointer">{part}</span>
            </WikiModal>
          );
        }
        return <span key={index}>{part}</span>;
      })}
    </>
  );
}
