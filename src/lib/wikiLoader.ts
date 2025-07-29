import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

// 위키 데이터의 타입을 정의합니다.
export interface WikiData {
  slug: string; // 파일 이름 (예: 'style')
  name: string; // frontmatter의 name (예: '클래식')
  description: string; // frontmatter의 description
}

const wikiDirectory = path.join(process.cwd(), 'content/wiki');

export const getAllWikiData = (): WikiData[] => {
  const fileNames = fs.readdirSync(wikiDirectory);

  const allWikis = fileNames.map((fileName) => {
    // '.mdx' 확장자를 제거하여 slug로 사용
    const slug = fileName.replace(/\.mdx$/, '');

    // 파일 전체를 문자열로 읽어옵니다.
    const fullPath = path.join(wikiDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, 'utf8');

    // gray-matter를 사용해 frontmatter를 파싱합니다.
    const { data } = matter(fileContents);

    return {
      slug,
      name: data.name,
      description: data.description,
    } as WikiData;
  });

  return allWikis;
};
