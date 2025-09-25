/**
 * 이미지 URL을 FormData로 변환하는 함수
 * @param imageUrl - 변환할 이미지의 URL (예: "/model.png")
 * @returns Promise<FormData> - 이미지 파일이 포함된 FormData
 */
export async function imageToFormData(imageUrl: string): Promise<FormData> {
  try {
    // 이미지 URL이 상대 경로인 경우 절대 경로로 변환
    const fullUrl = imageUrl;

    // 이미지를 fetch로 가져오기
    const response = await fetch(fullUrl);

    if (!response.ok) {
      throw new Error(`이미지를 가져올 수 없습니다: ${response.status} ${response.statusText}`);
    }

    // 이미지를 Blob으로 변환
    const blob = await response.blob();

    // FormData 생성
    const formData = new FormData();

    // 파일명 추출 (URL에서 마지막 부분)
    const fileName = imageUrl.split('/').pop() || 'image.png';

    // FormData에 파일 추가
    formData.append('model_image', blob, fileName);

    return formData;
  } catch (error) {
    console.error('이미지 FormData 변환 오류:', error);
    throw error;
  }
}

/**
 * 이미지 URL을 base64 형태로 변환하는 함수
 * @param imageUrl - 변환할 이미지의 URL (예: "/model.png")
 * @returns Promise<string> - base64로 인코딩된 이미지 데이터
 */
export async function imgToBase64(imageUrl: string): Promise<string> {
  try {
    // 이미지 URL이 상대 경로인 경우 절대 경로로 변환
    const fullUrl = imageUrl.startsWith('/') ? `${window.location.origin}${imageUrl}` : imageUrl;

    // 이미지를 fetch로 가져오기
    const response = await fetch(fullUrl);

    if (!response.ok) {
      throw new Error(`이미지를 가져올 수 없습니다: ${response.status} ${response.statusText}`);
    }

    // 이미지를 Blob으로 변환
    const blob = await response.blob();

    // Blob을 base64로 변환
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = () => {
        const result = reader.result as string;
        resolve(result.slice('data:image/png;base64,'.length));
      };

      reader.onerror = () => {
        reject(new Error('이미지를 base64로 변환하는 중 오류가 발생했습니다.'));
      };

      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error('이미지 변환 오류:', error);
    throw error;
  }
}
