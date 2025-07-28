import { useQuery } from '@tanstack/react-query';

// API Route가 아닌, public 폴더의 정적 파일을 fetch합니다.
const fetchWikiData = async (): Promise<WikiIndex> => {
  const response = await fetch('/wiki-data.json');
  if (!response.ok) {
    throw new Error('Failed to fetch wiki data');
  }
  return response.json();
};

export const useWikiData = () => {
  return useQuery({
    queryKey: ['wikiData'], // 앱 전체에서 유일한 키
    queryFn: fetchWikiData,
    // 이 데이터는 빌드 시점에 생성되므로, 절대 바뀌지 않습니다.
    // staleTime과 gcTime을 Infinity로 설정하여 불필요한 재요청을 막습니다.
    staleTime: Infinity,
    gcTime: Infinity,
  });
};
