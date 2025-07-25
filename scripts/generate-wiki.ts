import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const contentDirectory = path.join(process.cwd(), 'content/wiki');
const outputFilePath = path.join(process.cwd(), 'public/wiki-data.json');

/**
 * 지정된 디렉토리와 그 모든 하위 디렉토리를 재귀적으로 탐색하여
 * 모든 .mdx 파일의 전체 경로 목록을 반환하는 함수
 * @param {string} dir - 탐색을 시작할 디렉토리
 * @returns {string[]} - 모든 mdx 파일의 전체 경로 배열
 */
function findMdxFiles(dir: string): string[] {
  const dirents = fs.readdirSync(dir, { withFileTypes: true });
  const files = dirents.flatMap((dirent) => {
    const res = path.resolve(dir, dirent.name);
    return dirent.isDirectory() ? findMdxFiles(res) : res;
  });
  return files.filter((file) => file.endsWith('.mdx'));
}

type WikiIndex = Record<string, MessageWiki>;
function getIndexedWikiData() {
  const allMdxFilePaths = findMdxFiles(contentDirectory);

  const indexedWikis = allMdxFilePaths.reduce<WikiIndex>((acc, filePath) => {
    try {
      const fileContents = fs.readFileSync(filePath, 'utf8');
      const { data, content } = matter(fileContents);
      if (!data.name) {
        return acc;
      }

      const relativePath = path
        .relative(contentDirectory, filePath)
        .replace(/\.mdx$/, '')
        .split(path.sep)
        .join('/');

      acc[data.name] = {
        src: relativePath,
        name: data.name,
        content: content || '',
        tags: data.tags || [],
      };
    } catch (error) {
      console.error(`Error processing file ${filePath}:`, error);
    }
    return acc;
  }, {});

  return indexedWikis;
}

// 스크립트 실행
const wikiData = getIndexedWikiData();
fs.writeFileSync(outputFilePath, JSON.stringify(wikiData, null, 2));
console.log(`✅ Indexed wiki data generated at: ${outputFilePath}`);
