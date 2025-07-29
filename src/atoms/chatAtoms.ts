import { atom } from 'jotai';
import { atomFamily } from 'jotai/utils';

export const inputValueAtom = atom<string>('');
export const inputImageAtom = atom<MessageImage | undefined>(undefined);
export const currentChatIdAtom = atom<number | null>(null);
export const isAIRespondingAtom = atom<boolean>(false);
export const hasUserSentMessageAtom = atom<boolean>(false);
export const isSidebarOpenAtom = atom<boolean>(false);

export const activePanelTypeAtom = atom<'image' | 'wiki' | null>(null);
export const imageTabsAtom = atom<MessageImage[]>([]);
export const wikiTabsAtom = atom<MessageWiki[]>([]);
export const activeImageTabIdAtom = atom<string | null>(null);
export const activeWikiTabIdAtom = atom<string | null>(null);

export const messagesAtomFamily = atomFamily((chatId: number | null) => atom<Message[]>([]));
export const examplesAtomFamily = atomFamily((chatId: number | null) =>
  atom<string[]>([
    '소개팅을 가야 하는 상황이야.',
    '조금 특별한 데이트를 하고 싶은데, 입을 만한 옷을 추천해줘.',
    '면접을 보러 가야하는데, 가장 적합한 옷이 무엇일지 몰라서. 추천받고 싶어.',
    '꾸민 듯 안 꾸민 듯한 꾸안꾸 패션을 추구해보고 싶어.',
  ]),
);
