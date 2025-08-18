import { atom } from 'jotai';

export const isModelSectionOpenAtom = atom<boolean>(false);
export const draggedNodeIdAtom = atom<string | null>(null);
export const hoveredGroupIdAtom = atom<string | null>(null);
export const groupModelsAtom = atom<
  Record<
    string,
    {
      modelImage: string;
      wornItems: string[];
    }
  >
>({
  'group-1': {
    modelImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=400&fit=crop',
    wornItems: [],
  },
});

export const groupInitialSizesAtom = atom<Record<string, { width: number; height: number }>>({});
