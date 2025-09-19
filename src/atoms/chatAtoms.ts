import { atom } from 'jotai';
import { atomFamily } from 'jotai/utils';

export const inputValueAtom = atom<string>('');
export const inputProductAtom = atom<Product | undefined>(undefined);
export const roomIdAtom = atom<string | null>(null);
export const messagesAtomFamily = atomFamily(() => atom<Message[]>([]));
export const streamingMessageAtom = atom<Map<string, Message>>(new Map());
export const examplesAtom = atom<string[]>([
  '소개팅을 가야 하는 상황이야.',
  '조금 특별한 데이트를 하고 싶은데, 입을 만한 옷을 추천해줘.',
  '면접을 보러 가야하는데, 가장 적합한 옷이 무엇일지 몰라서. 추천받고 싶어.',
  '꾸민 듯 안 꾸민 듯한 꾸안꾸 패션을 추구해보고 싶어.',
]);

export const isAIRespondingAtom = atom<'style' | 'trend' | 'color' | 'codi' | ''>('');
export const isSidebarOpenAtom = atom<boolean>(false);

export const panelAtom = atom<'chat' | 'closet' | 'fitting'>('chat');
export const codinationsAtom = atom<Codination[]>([]);
export const activeCodinationAtom = atom<Codination | null>(null);
export const closetCodinationAtom = atom<Codination | null>(null);
export const closetAtom = atom<ClosetCloth[]>([]);
export const activeClothAtom = atom<ClosetCloth | null>(null);
