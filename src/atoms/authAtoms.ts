import { atom } from 'jotai';

export const userAtom = atom<User | null>(null);
export const darkModeAtom = atom<boolean>(false);
export const isInitializedAtom = atom<boolean>(false);
