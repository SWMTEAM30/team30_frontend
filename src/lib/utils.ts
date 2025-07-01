import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// id 프로퍼티를 가진 모든 객체 배열에 사용할 수 있도록 제네릭을 사용합니다.
interface HasId {
  id: string | number;
}

/**
 * 배열에서 특정 id를 가진 요소를 맨 앞으로 옮긴 새로운 배열을 반환합니다.
 * @param array - 원본 배열
 * @param id - 맨 앞으로 옮길 요소의 id
 * @returns - 재정렬된 새로운 배열
 */
export const moveItemToFront = <T extends HasId>(array: T[], id: string | number): T[] => {
  const targetItem = array.find((item) => item.id === id);
  if (!targetItem) return array;
  const restOfItems = array.filter((item) => item.id !== id);
  return [targetItem, ...restOfItems];
};
