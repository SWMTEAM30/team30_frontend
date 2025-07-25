import { useQuery } from '@tanstack/react-query';

export const useWikiData = () => {
  return useQuery({
    queryKey: ['wikiData'],
    queryFn: async () => (await fetch('/wiki-data.json')).json(),
    staleTime: Infinity,
  });
};
