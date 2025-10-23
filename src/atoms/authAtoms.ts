import { atom } from 'jotai';

export const userAtom = atom<User | null>(null);
export const isInitializedAtom = atom<boolean>(false);
