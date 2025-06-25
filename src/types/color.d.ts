import { colorSet } from '@/styles/generated-colors';

type ThemeName = keyof typeof colorSet;
type ColorName = keyof (typeof colorSet)['light'];
type ShadeName<T extends ColorName> = keyof (typeof colorSet)['light'][T];
type ColorShadeFormat = `${ColorName}-${ShadeName<ColorName>}`;
