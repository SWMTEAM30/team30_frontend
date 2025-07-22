import { atom } from 'jotai';

export const inputValueAtom = atom<string>('');
export const inputImageAtom = atom<MessageImage | undefined>(undefined);
export const currentChatIdAtom = atom<number | null>(null);
export const isAIRespondingAtom = atom<boolean>(false);
export const hasUserSentMessageAtom = atom<boolean>(false);

export const activePanelTypeAtom = atom<'image' | 'wiki' | null>(null);
export const imageTabsAtom = atom<any[]>([]);
export const wikiTabsAtom = atom<any[]>([]);
export const activeImageTabIdAtom = atom<string | null>(null);
export const activeWikiTabIdAtom = atom<string | null>(null);
