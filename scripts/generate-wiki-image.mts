import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

// .env 파일에서 API 키를 로드합니다.
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const HUGGING_FACE_API_KEY = process.env.GEMINI_API_KEY;
const MODEL_ID = 'stabilityai/stable-diffusion-xl-base-1.0'; // 사용하려는 모델 ID

const IMAGE_DIR = path.join(process.cwd(), 'public/images/wiki');

const KEYWORDS = {
  style: [
    { name: '스트리트', fileName: 'street-style' },
    { name: '놈코어', fileName: 'normcore' },
    { name: '고프코어', fileName: 'gorpcore' },
    { name: '시티보이', fileName: 'city-boy' },
  ],
};

async function findAndSaveImages(keyword, enKeyword) {
  console.log(`- "${keyword}"에 대한 이미지 생성 프롬프트 준비 중...`);

  // 여기서는 프롬프트만 생성하는 간단한 예시입니다.
  // Gemini API를 사용하여 프롬프트를 만드는 코드를 그대로 활용할 수 있습니다.
  const queries = {
    representativeQuery: `A photorealistic image of ${keyword} fashion, high detail, fashion magazine style`,
    stylingQuery: `A full body shot of a model wearing a complete outfit in ${keyword} style, photorealistic`,
    matchingQuery: `A flat lay of items for a ${keyword} outfit, high detail, realistic lighting`,
  };

  const generateAndSaveImage = async (imagePrompt, fileName, type) => {
    console.log(`  - [${type}] "${imagePrompt}" 프롬프트로 이미지 생성 중...`);
    try {
      const response = await fetch(`https://api-inference.huggingface.co/models/${MODEL_ID}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${HUGGING_FACE_API_KEY}`,
          'Content-Type': 'application/json', // 👈 이 줄을 추가합니다.
        },
        body: JSON.stringify({ inputs: imagePrompt }), // 👈 body에 JSON 형식으로 데이터를 보냅니다.
      });

      if (!response.ok) {
        throw new Error(`Hugging Face API 에러: ${await response.text()}`);
      }

      const imageBuffer = await response.arrayBuffer();
      const filePath = path.join(IMAGE_DIR, fileName);
      fs.writeFileSync(filePath, Buffer.from(imageBuffer));
      console.log(`  - [${type}] 이미지를 ${filePath}에 저장했습니다.`);
    } catch (error) {
      console.error(`  - [${type}] 이미지 처리 실패:`, error);
    }
  };

  await Promise.all([
    generateAndSaveImage(queries.representativeQuery, `${enKeyword}-rep.jpg`, '대표'),
    generateAndSaveImage(queries.stylingQuery, `${enKeyword}-style.jpg`, '스타일링'),
    generateAndSaveImage(queries.matchingQuery, `${enKeyword}-match.jpg`, '조합'),
  ]);
}

KEYWORDS.style.forEach((image) => {
  findAndSaveImages(image.name, image.fileName);
});
