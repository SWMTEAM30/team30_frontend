import { useQuery } from '@tanstack/react-query';

const fetchWikiData = async (): Promise<WikiIndex> => {
  const response = await fetch('/wiki-data.json');
  if (!response.ok) {
    throw new Error('Failed to fetch wiki data');
  }
  return response.json();
};

export const useWikiData = () => {
  return useQuery({
    queryKey: ['wikiData'],
    queryFn: fetchWikiData,
    staleTime: Infinity,
    gcTime: Infinity,
  });
};
