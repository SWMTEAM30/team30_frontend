import fs from 'fs';
import path from 'path';
import { ColorThemes } from '@/styles/theme';
import { toneMap } from '@nextcss/color-tools';

console.log('🎨 Generating theme files with light/dark modes for Tailwind CSS v4...');

// --- 헬퍼 함수: Hex to RGB ---
// Tailwind의 투명도 수식자(e.g., bg-blue/50)를 지원하려면 rgb 값으로 변환해야 합니다.
const hexToRgb = (hex: string): string => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? `rgb(${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)})` : '';
};

// --- 작업 1: CSS 변수 생성 ---
const cssBlocks = Object.entries(ColorThemes).map(([themeName, themeColors]) => {
  const isLight = themeName === 'light';
  const selector = isLight ? '@theme' : `.${themeName}`;
  let cssBlock = `${selector} {\n`;
  const fullPalette = Object.entries(themeColors).reduce<Record<string, any>>((acc, [name, baseColor]) => {
    acc[name] = { ...toneMap(baseColor as string), DEFAULT: baseColor as string };
    return acc;
  }, {});

  for (const [colorName, shades] of Object.entries(fullPalette)) {
    for (const [shadeName, hexValue] of Object.entries(shades)) {
      const key = shadeName === 'DEFAULT' ? '' : `-${shadeName}`;
      // Tailwind v4는 rgb 컴포넌트를 값으로 사용합니다.
      cssBlock += `  --color-${colorName}${key}: ${hexToRgb(hexValue as string)};\n`;
    }
  }
  cssBlock += '}\n';
  return cssBlock;
});

// `globals.css` 파일에 주입
const cssFilePath = path.join(process.cwd(), 'app', 'globals.css');
try {
  const originalCssContent = fs.readFileSync(cssFilePath, 'utf-8');
  const markerRegex = /\/\* @theme-colors-start \*\/[\s\S]*?\/\* @theme-colors-end \*\//;
  const replacementBlock = `/* @theme-colors-start */\n/* 🤖 이 구역은 스크립트로 만들어지는 CSS 속성입니다. */\n${cssBlocks.join('\n')}\n/* @theme-colors-end */`;
  fs.writeFileSync(cssFilePath, originalCssContent.replace(markerRegex, replacementBlock));
  console.log(`✅ Injected CSS variables into: ${cssFilePath}`);
} catch (error) {
  console.error(`❌ Error updating globals.css:`, error);
}

// --- 작업 2: TypeScript 팔레트 객체 생성 ---
const finalPalette: Record<string, any> = {};
for (const [themeName, themeColors] of Object.entries(ColorThemes)) {
  finalPalette[themeName] = {};
  for (const [colorName, baseColor] of Object.entries(themeColors)) {
    // 여기서는 실제 hex 코드를 값으로 가집니다.
    finalPalette[themeName][colorName] = { ...toneMap(baseColor as string), DEFAULT: baseColor as string };
  }
}

const tsFileContent = `// Auto-generated file...
export const colorSet = ${JSON.stringify(finalPalette, null, 2)} as const;
`;

// `generated-palette.ts` 파일 생성
const tsOutputPath = path.join(process.cwd(), 'src', 'styles', 'generated-palette.ts');
fs.mkdirSync(path.dirname(tsOutputPath), { recursive: true });
fs.writeFileSync(tsOutputPath, tsFileContent);
console.log(`✅ TypeScript palette object generated at: ${tsOutputPath}`);
