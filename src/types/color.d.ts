import { colorSet } from '@/styles/generated-palette';

declare global {
  type ThemeName = keyof typeof colorSet;
  type ColorName = keyof (typeof colorSet)['light'];
  type ShadeName<T extends ColorName> = keyof (typeof colorSet)['light'][T];
  type ColorShadeFormat<T extends ColorName = ColorName> = `${T}-${ShadeName<T>}`;
}

export {};
