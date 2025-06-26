import { colorSet } from '@/styles/generated-palette';

export const parseColorSet = (
  colorShade: ColorShadeFormat,
  isDark: boolean = false,
  defaultColor: string = '#27548a',
): string => {
  const [color, shade] = colorShade.split('-') as [ColorName, ShadeName<ColorName>];
  const colorSetTheme = colorSet[isDark ? 'dark' : 'light'];
  if (Object.keys(colorSetTheme).includes(color) && Object.keys(colorSetTheme[color]).includes(shade)) {
    return colorSetTheme[color][shade];
  }
  return defaultColor;
};
