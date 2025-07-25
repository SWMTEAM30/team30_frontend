'use client';

import { useMemo } from 'react';
import { useChatHandlers } from '@/components/chat/ChatContextProvider';
import { useWikiData } from '@/queries/useWiki';

interface MessageParserProps {
  text: string;
}

export default function MessageParser({ text }: MessageParserProps) {
  const { data: wikiList, isLoading } = useWikiData();
  const { handleOpenTab } = useChatHandlers();

  // text나 wikiList가 바뀔 때만 파싱을 다시 실행하도록 메모이제이션
  const parsedText = useMemo(() => {
    if (!wikiList || wikiList.length === 0) return [text];

    const keywords = Object.keys(wikiList);
    const regex = new RegExp(`(${keywords.join('|')})`, 'g');
    return text.split(regex);
  }, [text, wikiList]);

  if (isLoading) return <>위키 로딩 중...</>;

  return (
    <>
      {parsedText.map((part, index) => {
        const matchedWiki = Object.keys(wikiList).find((word: string) => word === part);

        if (matchedWiki) {
          return (
            <span
              key={index}
              onClick={() => handleOpenTab(wikiList[matchedWiki], 'wiki')}
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
