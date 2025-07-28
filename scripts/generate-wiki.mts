import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { serialize } from 'next-mdx-remote/serialize';

// 콘텐츠 소스 폴더와 JSON 결과물 파일 경로를 정의합니다.
const contentDirectory = path.join(process.cwd(), 'content/wiki');
const outputFilePath = path.join(process.cwd(), 'public/wiki-data.json');

/**
 * 지정된 디렉토리와 그 모든 하위 디렉토리를 재귀적으로 탐색하여
 * 모든 .mdx 파일의 전체 경로 목록을 반환하는 함수입니다.
 * @param {string} dir - 탐색을 시작할 디렉토리입니다.
 * @returns {string[]} - 모든 mdx 파일의 전체 경로 배열입니다.
 */
function findMdxFiles(dir: string): string[] {
  const dirents = fs.readdirSync(dir, { withFileTypes: true });
  const files = dirents.flatMap((dirent) => {
    const res = path.resolve(dir, dirent.name);
    return dirent.isDirectory() ? findMdxFiles(res) : res;
  });
  return files.filter((file) => file.endsWith('.mdx'));
}

/**
 * 모든 mdx 파일을 읽고, 파싱 및 직렬화하여
 * 검색에 용이한 '색인' 객체를 생성하는 비동기 함수입니다.
 */
async function getIndexedWikiData() {
  const allMdxFilePaths = findMdxFiles(contentDirectory);
  const indexedWikis: WikiIndex = {};

  // for...of 루프는 내부에서 await를 사용하기에 적합합니다.
  for (const filePath of allMdxFilePaths) {
    try {
      const fileContents = fs.readFileSync(filePath, 'utf8');
      // gray-matter로 frontmatter(data)와 본문(content)을 파싱합니다.
      const { data, content } = matter(fileContents);

      // frontmatter에 name이 없으면 이 파일을 건너뜁니다.
      if (!data.name) {
        console.warn(`Skipping file without a name: ${filePath}`);
        continue;
      }

      // contentDirectory를 기준으로 한 상대 경로를 계산합니다.
      const relativePath = path
        .relative(contentDirectory, filePath)
        .replace(/\\/g, '/') // Windows 경로 구분자를 '/'로 통일합니다.
        .replace(/\.mdx$/, '');

      // MDX 콘텐츠를 클라이언트에서 렌더링할 수 있도록 직렬화합니다.
      const mdxSource = await serialize(content);

      // 'name'을 key로, 나머지 정보를 value로 하는 객체를 생성합니다.
      indexedWikis[data.name] = {
        src: relativePath, // 예: 'style/classic'
        name: data.name,
        tags: data.tags || [],
        content: mdxSource, // 직렬화된 결과를 content 필드에 저장합니다.
      };
    } catch (error) {
      console.error(`Error processing file ${filePath}:`, error);
    }
  }

  return indexedWikis;
}

/**
 * 스크립트의 메인 실행 함수입니다.
 */
async function build() {
  console.log('Generating wiki data...');
  const wikiData = await getIndexedWikiData();
  fs.writeFileSync(outputFilePath, JSON.stringify(wikiData, null, 2));
  console.log(`✅ Serialized wiki data generated successfully at: ${outputFilePath}`);
}

// 스크립트를 실행합니다.
build();
