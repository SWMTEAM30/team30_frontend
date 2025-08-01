import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import inquirer from 'inquirer';
import { GoogleGenerativeAI } from '@google/generative-ai';

const KEYWORDS = {
  style: [
    { name: '미니멀리즘', fileName: 'minimalism' },
    { name: '클래식', fileName: 'classic' },
    { name: '아메카지', fileName: 'amekaji' },
    { name: '프레피', fileName: 'preppy' },
    { name: '스트리트', fileName: 'street-style' },
    { name: '놈코어', fileName: 'normcore' },
    { name: '고프코어', fileName: 'gorpcore' },
    { name: '시티보이', fileName: 'city-boy' },
    { name: '그런지', fileName: 'grunge' },
    { name: '빈티지', fileName: 'vintage' },
    { name: '레트로', fileName: 'retro' },
    { name: '아방가르드', fileName: 'avant-garde' },
    { name: '댄디', fileName: 'dandy' },
    { name: '캐주얼', fileName: 'casual' },
    { name: '포멀', fileName: 'formal' },
    { name: '비즈니스 캐주얼', fileName: 'business-casual' },
    { name: '스마트 캐주얼', fileName: 'smart-casual' },
    { name: '모던', fileName: 'modern' },
    { name: '페미닌', fileName: 'feminine' },
    { name: '매니시', fileName: 'mannish' },
    { name: '보헤미안', fileName: 'bohemian' },
    { name: '히피', fileName: 'hippie' },
    { name: '펑크', fileName: 'punk' },
    { name: '테크웨어', fileName: 'techwear' },
    { name: '유틸리티', fileName: 'utility' },
    { name: '워크웨어', fileName: 'workwear' },
    { name: '밀리터리', fileName: 'military' },
    { name: '마린', fileName: 'marine' },
    { name: '바시티', fileName: 'varsity' },
    { name: '고딕', fileName: 'gothic' },
    { name: '올드머니', fileName: 'old-money' },
    { name: '발레코어', fileName: 'balletcore' },
    { name: '블록코어', fileName: 'blokecore' },
  ],
  item: [
    { name: '티셔츠', fileName: 't-shirt' },
    { name: '셔츠', fileName: 'shirt' },
    { name: '블라우스', fileName: 'blouse' },
    { name: '스웨터', fileName: 'sweater' },
    { name: '니트', fileName: 'knit' },
    { name: '가디건', fileName: 'cardigan' },
    { name: '맨투맨', fileName: 'sweatshirt' },
    { name: '후드티', fileName: 'hoodie' },
    { name: '폴로 셔츠', fileName: 'polo-shirt' },
    { name: '헨리넥', fileName: 'henley-neck' },
    { name: '터틀넥', fileName: 'turtleneck' },
    { name: '목폴라', fileName: 'turtleneck-kr' },
    { name: '크롭탑', fileName: 'crop-top' },
    { name: '튜닉', fileName: 'tunic' },
    { name: '뷔스티에', fileName: 'bustier' },
    { name: '슬리브리스', fileName: 'sleeveless' },
    { name: '옥스포드 셔츠', fileName: 'oxford-shirt' },
    { name: '플란넬 셔츠', fileName: 'flannel-shirt' },
    { name: '샴브레이 셔츠', fileName: 'chambray-shirt' },
    { name: '보트넥', fileName: 'boat-neck' },
    { name: '브이넥', fileName: 'v-neck' },
    { name: '크루넥', fileName: 'crewneck' },
    { name: '청바지', fileName: 'jeans' },
    { name: '데님', fileName: 'denim' },
    { name: '슬랙스', fileName: 'slacks' },
    { name: '치노 팬츠', fileName: 'chino-pants' },
    { name: '카고 팬츠', fileName: 'cargo-pants' },
    { name: '조거 팬츠', fileName: 'jogger-pants' },
    { name: '와이드 팬츠', fileName: 'wide-pants' },
    { name: '스키니 진', fileName: 'skinny-jeans' },
    { name: '부츠컷', fileName: 'bootcut' },
    { name: '스트레이트 핏', fileName: 'straight-fit' },
    { name: '테이퍼드 핏', fileName: 'tapered-fit' },
    { name: '배기 팬츠', fileName: 'baggy-pants' },
    { name: '버뮤다 팬츠', fileName: 'bermuda-pants' },
    { name: '숏팬츠', fileName: 'shorts' },
    { name: '스커트', fileName: 'skirt' },
    { name: '미니 스커트', fileName: 'mini-skirt' },
    { name: '롱 스커트', fileName: 'long-skirt' },
    { name: '플리츠 스커트', fileName: 'pleated-skirt' },
    { name: 'A라인 스커트', fileName: 'a-line-skirt' },
    { name: '레깅스', fileName: 'leggings' },
    { name: '핀턱', fileName: 'pintuck' },
    { name: '자켓', fileName: 'jacket' },
    { name: '블레이저', fileName: 'blazer' },
    { name: '코트', fileName: 'coat' },
    { name: '트렌치 코트', fileName: 'trench-coat' },
    { name: '블루종', fileName: 'blouson' },
    { name: '스타디움 자켓', fileName: 'stadium-jacket' },
    { name: '바시티 자켓', fileName: 'varsity-jacket' },
    { name: 'MA-1', fileName: 'ma-1' },
    { name: 'M-65 필드자켓', fileName: 'm-65-field-jacket' },
    { name: '데님 자켓', fileName: 'denim-jacket' },
    { name: '레더 자켓', fileName: 'leather-jacket' },
    { name: '무스탕', fileName: 'mustang-jacket' },
    { name: '패딩', fileName: 'padded-jacket' },
    { name: '다운 파카', fileName: 'down-parka' },
    { name: '아노락', fileName: 'anorak' },
    { name: '윈드브레이커', fileName: 'windbreaker' },
    { name: '더플 코트', fileName: 'duffle-coat' },
    { name: '피코트', fileName: 'pea-coat' },
    { name: '체스터필드 코트', fileName: 'chesterfield-coat' },
    { name: '발마칸 코트', fileName: 'balmacaan-coat' },
    { name: '가운 코트', fileName: 'robe-coat' },
    { name: '스니커즈', fileName: 'sneakers' },
    { name: '캔버스화', fileName: 'canvas-shoes' },
    { name: '러닝화', fileName: 'running-shoes' },
    { name: '어글리 슈즈', fileName: 'ugly-shoes' },
    { name: '구두', fileName: 'dress-shoes' },
    { name: '로퍼', fileName: 'loafer' },
    { name: '페니 로퍼', fileName: 'penny-loafer' },
    { name: '태슬 로퍼', fileName: 'tassel-loafer' },
    { name: '더비 슈즈', fileName: 'derby-shoes' },
    { name: '옥스포드화', fileName: 'oxford-shoes' },
    { name: '윙팁', fileName: 'wingtips' },
    { name: '첼시 부츠', fileName: 'chelsea-boots' },
    { name: '워커', fileName: 'walker-boots' },
    { name: '데저트 부츠', fileName: 'desert-boots' },
    { name: '샌들', fileName: 'sandal' },
    { name: '슬리퍼', fileName: 'slippers' },
    { name: '뮬', fileName: 'mule' },
    { name: '에스파듀', fileName: 'espadrilles' },
    { name: '플랫 슈즈', fileName: 'flat-shoes' },
    { name: '펌프스', fileName: 'pumps' },
    { name: '힐', fileName: 'heels' },
    { name: '백팩', fileName: 'backpack' },
    { name: '토트백', fileName: 'tote-bag' },
    { name: '숄더백', fileName: 'shoulder-bag' },
    { name: '크로스백', fileName: 'crossbody-bag' },
    { name: '에코백', fileName: 'eco-bag' },
    { name: '클러치', fileName: 'clutch' },
    { name: '브리프케이스', fileName: 'briefcase' },
    { name: '메신저백', fileName: 'messenger-bag' },
    { name: '벨트', fileName: 'belt' },
    { name: '모자', fileName: 'hat' },
    { name: '볼캡', fileName: 'ball-cap' },
    { name: '비니', fileName: 'beanie' },
    { name: '버킷햇', fileName: 'bucket-hat' },
    { name: '페도라', fileName: 'fedora' },
    { name: '스카프', fileName: 'scarf' },
    { name: '머플러', fileName: 'muffler' },
    { name: '넥타이', fileName: 'necktie' },
    { name: '보타이', fileName: 'bowtie' },
    { name: '양말', fileName: 'socks' },
    { name: '장갑', fileName: 'gloves' },
    { name: '시계', fileName: 'watch' },
    { name: '팔찌', fileName: 'bracelet' },
    { name: '목걸이', fileName: 'necklace' },
    { name: '반지', fileName: 'ring' },
    { name: '귀걸이', fileName: 'earrings' },
    { name: '안경', fileName: 'eyeglasses' },
    { name: '선글라스', fileName: 'sunglasses' },
    { name: '브로치', fileName: 'brooch' },
  ],
  definition: [
    { name: '면', fileName: 'cotton' },
    { name: '린넨', fileName: 'linen' },
    { name: '울', fileName: 'wool' },
    { name: '캐시미어', fileName: 'cashmere' },
    { name: '실크', fileName: 'silk' },
    { name: '코듀로이', fileName: 'corduroy' },
    { name: '가죽', fileName: 'leather' },
    { name: '스웨이드', fileName: 'suede' },
    { name: '나일론', fileName: 'nylon' },
    { name: '폴리에스터', fileName: 'polyester' },
    { name: '레이온', fileName: 'rayon' },
    { name: '아크릴', fileName: 'acrylic' },
    { name: '트위드', fileName: 'tweed' },
    { name: '시어서커', fileName: 'seersucker' },
    { name: '플리스', fileName: 'fleece' },
    { name: '벨벳', fileName: 'velvet' },
    { name: '새틴', fileName: 'satin' },
    { name: '헤링본', fileName: 'herringbone' },
    { name: '시폰', fileName: 'chiffon' },
    { name: '오간자', fileName: 'organza' },
    { name: '스트라이프', fileName: 'stripe' },
    { name: '체크', fileName: 'check' },
    { name: '타탄 체크', fileName: 'tartan-check' },
    { name: '글렌 체크', fileName: 'glen-check' },
    { name: '하운드투스', fileName: 'houndstooth' },
    { name: '도트', fileName: 'dot-pattern' },
    { name: '페이즐리', fileName: 'paisley' },
    { name: '플로럴', fileName: 'floral' },
    { name: '카모플라쥬', fileName: 'camouflage' },
    { name: '레오파드', fileName: 'leopard-print' },
    { name: '지브라', fileName: 'zebra-print' },
    { name: '실루엣', fileName: 'silhouette' },
    { name: '오버핏', fileName: 'overfit' },
    { name: '루즈핏', fileName: 'loose-fit' },
    { name: '슬림핏', fileName: 'slim-fit' },
    { name: 'A라인', fileName: 'a-line' },
    { name: 'H라인', fileName: 'h-line' },
    { name: '드롭숄더', fileName: 'drop-shoulder' },
    { name: '라글란', fileName: 'raglan' },
    { name: '퍼프 소매', fileName: 'puff-sleeve' },
    { name: '카라', fileName: 'collar' },
    { name: '라펠', fileName: 'lapel' },
    { name: '밑단', fileName: 'hem' },
    { name: '워싱', fileName: 'washing' },
    { name: '톤온톤', fileName: 'tone-on-tone' },
    { name: '톤인톤', fileName: 'tone-in-tone' },
    { name: '레이어드', fileName: 'layered' },
    { name: '믹스매치', fileName: 'mix-and-match' },
    { name: '패치워크', fileName: 'patchwork' },
    { name: '빈티지 워싱', fileName: 'vintage-washing' },
    { name: '디스트로이드', fileName: 'destroyed-detail' },
    { name: '로우엣지', fileName: 'raw-edge' },
    { name: 'TPO', fileName: 'tpo' },
    { name: '퍼스널 컬러', fileName: 'personal-color' },
    { name: '애슬레저', fileName: 'athleisure' },
    { name: '컨템포러리', fileName: 'contemporary' },
  ],
};

// .env 파일 로드
dotenv.config();

// --- ✨ 디버깅을 위한 console.log 추가 ---
console.log('Loading GEMINI_API_KEY:', process.env.GEMINI_API_KEY);
// ------------------------------------

// Gemini API 클라이언트 초기화
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

const WIKI_DIR = path.join(process.cwd(), 'content/wiki');

/**
 * 키워드에 맞는 3가지 종류의 이미지 URL을 검색합니다.
 * (실제로는 Pinterest/Google Image API 등을 사용해야 합니다)
 * @param keyword - 패션 키워드
 * @returns 3개의 이미지 URL이 담긴 객체
 */
async function findImageUrls(keyword: string, enKeyword: string) {
  console.log(`- "${keyword}" 이미지 검색 중... (현재는 예시 URL 사용)`);
  // 실제 이미지 검색 API 대신, 내용을 유추할 수 있는 placeholder 이미지 경로를 생성합니다.
  // 이 이미지들은 public/images/wiki/ 폴더에 미리 준비되어 있어야 합니다.
  return {
    representative: `/images/wiki/${enKeyword}-rep.jpg`, // 대표 이미지
    styling: `/images/wiki/${enKeyword}-style.jpg`, // 스타일링 예시
    matching: `/images/wiki/${enKeyword}-match.jpg`, // 아이템 조합 예시
  };
}

/**
 * [스타일/아이템용] Gemini API를 호출하여 상세 정보를 JSON으로 받아옵니다.
 */
async function generateDetailedContent(keyword: string) {
  const prompt = `
    당신은 전문 패션 에디터입니다. 한국 패션 용어 "${keyword}"에 대해 아래 JSON 형식에 맞춰 상세하고 매력적인 설명을 한국어로 작성해주세요.

    {
      "description": "2-3 문장의 간결하고 핵심적인 설명",
      "howToWear": "어떻게 입어야 멋진지에 대한 스타일링 팁 (문단)",
      "matchingItems": "함께 매치하면 좋은 아이템 목록 (배열)",
      "occasions": "입기 좋은 상황(TPO) 목록 (배열)",
      "goodFor": "이 스타일이 잘 어울리는 사람의 특징 (문단)",
      "badFor": "이 스타일을 피하면 좋은 사람의 특징 (문단)"
    }
  `;
  const result = await model.generateContent(prompt);
  const jsonString = result.response
    .text()
    .trim()
    .replace(/```json|```/g, '');
  return JSON.parse(jsonString);
}

/**
 * [정의용] Gemini API를 호출하여 간단한 정의를 받아옵니다.
 */
async function generateSimpleDefinition(keyword: string) {
  const prompt = `패션 용어 "${keyword}"에 대해, 전문적이면서도 이해하기 쉬운 백과사전 스타일의 정의를 3-4 문장으로 작성해줘.`;
  const result = await model.generateContent(prompt);
  return result.response.text().trim();
}

/**
 * [스타일/아이템용] 상세 가이드 MDX 파일 내용을 생성합니다.
 */
function createDetailedMdxContent(data: any): string {
  const { keyword, content, images } = data;
  return `---
name: ${keyword}
description: "${content.description}"
tags: ['스타일가이드', '자동생성']
---

## ${keyword} 스타일 가이드

${content.description}

![${keyword} 대표 이미지](${images.representative})

### 어떻게 입을까?
${content.howToWear}

![${keyword} 스타일링 예시](${images.styling})

### 추천 아이템 조합
${content.matchingItems.map((item: string) => `- ${item}`).join('\n')}

![${keyword} 아이템 조합 예시](${images.matching})

### 언제 입을까?
${content.occasions.map((item: string) => `- ${item}`).join('\n')}

### 이런 분에게 추천해요
${content.goodFor}

### 이런 분은 고민해보세요
${content.badFor}
`;
}

/**
 * [정의용] 간단한 사전 형식 MDX 파일 내용을 생성합니다.
 */
function createSimpleMdxContent(data: any): string {
  const { keyword, definition, imageUrl } = data;
  return `---
name: ${keyword}
description: "${definition.split('.')[0]}."
tags: ['용어사전', '자동생성']
---

## ${keyword}

![${keyword} 대표 이미지](${imageUrl})

${definition}
`;
}

/**
 * 메인 실행 함수
 */
async function main() {
  const allKeywords = [...KEYWORDS.style, ...KEYWORDS.item, ...KEYWORDS.definition];
  console.log(`총 ${allKeywords.length}개의 위키 파일 생성을 시작합니다...`);

  if (!fs.existsSync(WIKI_DIR)) {
    fs.mkdirSync(WIKI_DIR, { recursive: true });
  }

  for (const keyword of allKeywords) {
    try {
      console.log(`\n[작업 시작] "${keyword.name}"`);
      let mdxContent = '';

      // ✨ 키워드 카테고리에 따라 다른 로직을 실행합니다.
      if (KEYWORDS.style.includes(keyword) || KEYWORDS.item.includes(keyword)) {
        const [content, images] = await Promise.all([
          generateDetailedContent(keyword.name),
          findImageUrls(keyword.name, keyword.fileName), // 3개의 이미지 URL을 가져옴
        ]);
        mdxContent = createDetailedMdxContent({ keyword, content, images });
      } else {
        // definition
        const [definition, images] = await Promise.all([
          generateSimpleDefinition(keyword.name),
          findImageUrls(keyword.name, keyword.fileName), // 대표 이미지만 사용
        ]);
        mdxContent = createSimpleMdxContent({ keyword, definition, imageUrl: images.representative });
      }

      const filePath = path.join(WIKI_DIR, `${keyword.fileName}.mdx`);
      fs.writeFileSync(filePath, mdxContent);

      console.log(`[작업 완료] "${keyword}" -> ${filePath}`);
    } catch (error) {
      console.error(`❌ "${keyword}" 처리 중 오류 발생:`, error);
    }
  }
  console.log('\n모든 위키 파일 생성이 완료되었습니다.');
}

main();
