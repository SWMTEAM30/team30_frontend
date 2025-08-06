import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';

const KEYWORDS = {
  style: [{ name: '캐주얼', fileName: 'casual' }],
};

// .env 파일에서 API 키를 로드합니다.
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

// Gemini API 클라이언트를 초기화합니다.
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const textModel = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
const IMAGE_DIR = path.join(process.cwd(), 'public/images/wiki');

/**
 * ✨ 역할 변경: 키워드에 맞는 이미지를 검색하여 public 폴더에 '저장'만 합니다.
 * @param keyword - 패션 키워드
 * @param enKeyword - 파일명으로 사용할 영어 키워드
 */
async function findAndSaveImages(keyword: string, enKeyword: string): Promise<void> {
  console.log(`- "${keyword}"에 대한 3가지 타입의 이미지 프롬프트 생성 중...`);

  const prompt = `
    패션 키워드 "${keyword}"에 대해, 사실적인 이미지를 생성하기 위한 구체적인 영어 프롬프트 3개를 다음 JSON 형식으로 제안해줘. 각 프롬프트는 'photorealistic, fashion magazine style, high detail' 같은 키워드를 포함해야 해.
    {
      "representativeQuery": "제품의 특징이 잘 보이는 대표 이미지 프롬프트",
      "stylingQuery": "모델이 실제 착용한 코디 예시를 위한 프롬프트",
      "matchingQuery": "함께 매치하면 좋은 아이템 조합을 보여주는 플랫레이(flat lay) 스타일 프롬프트"
    }
  `;
  const result = await textModel.generateContent(prompt);
  const jsonString = result.response
    .text()
    .trim()
    .replace(/```json|```/g, '');
  const queries = JSON.parse(jsonString);

  console.log(`- 생성된 프롬프트:`, queries);

  /**
   * Gemini 이미지 생성 모델을 호출하고 이미지를 저장하는 내부 함수
   */
  const generateAndSaveImage = async (imagePrompt: string, fileName: string, type: string) => {
    console.log(`  - [${type}] "${imagePrompt}" 프롬프트로 이미지 생성 중...`);
    try {
      // 2. Gemini 이미지 생성 모델(imagen-3.0-generate-002)을 호출합니다.
      const apiKey = process.env.GEMINI_API_KEY;
      const url = `https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-002:predict?key=${apiKey}`;

      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          instances: [{ prompt: imagePrompt }],
          parameters: { sampleCount: 1 },
        }),
      });

      if (!response.ok) {
        throw new Error(`Gemini Image API 에러: ${await response.text()}`);
      }

      const data = await response.json();
      const base64Image = data.predictions?.[0]?.bytesBase64Encoded;

      if (!base64Image) {
        throw new Error('API 응답에서 이미지 데이터를 찾을 수 없습니다.');
      }

      // 3. Base64 데이터를 이미지 파일로 변환하여 저장합니다.
      const buffer = Buffer.from(base64Image, 'base64');
      const filePath = path.join(IMAGE_DIR, fileName);
      fs.writeFileSync(filePath, buffer);
      console.log(`  - [${type}] 이미지를 ${filePath}에 저장했습니다.`);
    } catch (error) {
      console.error(`  - [${type}] 이미지 처리 실패:`, error);
    }
  };

  // 3가지 타입의 이미지를 병렬로 생성하고 저장합니다.
  await Promise.all([
    generateAndSaveImage(queries.representativeQuery, `${enKeyword}-rep.jpg`, '대표'),
    generateAndSaveImage(queries.stylingQuery, `${enKeyword}-style.jpg`, '스타일링'),
    generateAndSaveImage(queries.matchingQuery, `${enKeyword}-match.jpg`, '조합'),
  ]);
}

KEYWORDS.style.forEach((image) => {
  findAndSaveImages(image.name, image.fileName);
});
