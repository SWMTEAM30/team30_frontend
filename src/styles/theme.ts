type ColorSet = {
  blue: string;
  beige: string;
  navy: string;
  yellow: string;
};

type ColorTheme = {
  light: ColorSet;
  dark: ColorSet;
};

export const ColorThemes: ColorTheme = {
  light: {
    blue: '#27548a',
    beige: '#f5eedc',
    navy: '#183b4e',
    yellow: '#dda853',
  },
  dark: {
    blue: '#27548a',
    beige: '#f5eedc',
    navy: '#183b4e',
    yellow: '#dda853',
  },
};
