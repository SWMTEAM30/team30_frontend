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

export function getStringNumbersOnly(str: string) {
  if (typeof str !== 'string') return '';
  return str.replace(/\D/g, '');
}

export const elapsedTimeText = (date: any): string => {
  const start = new Date(date);
  const end = new Date();

  const seconds = Math.floor((end.getTime() - start.getTime()) / 1000);
  if (seconds < 10) return `방금 전`;
  if (seconds < 60) return `${Math.floor(seconds)}초 전`;

  const minutes = seconds / 60;
  if (minutes < 60) return `${Math.floor(minutes)}분 전`;

  const hours = minutes / 60;
  if (hours < 24) return `${Math.floor(hours)}시간 전`;

  const days = hours / 24;
  if (days < 7) return `${Math.floor(days)}일 전`;

  return `${start.toLocaleDateString()}`;
};
