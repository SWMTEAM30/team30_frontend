import { requestAPI } from '@/api/API';
import { imageToFormData } from '@/lib/image';

/// GET
export const getFittingProxyImage = async () => requestAPI<APIFitting>('/api/fitting/proxy-image', 'GET');

export const getFittingStatusTaskId = async (taskId: string) =>
  requestAPI<APIFitting>(`/api/fitting/status/${taskId}`, 'GET');

export const getFittingProxyTest = async () => requestAPI<APIFitting>('/api/fitting/proxy-test', 'GET');

/// POST
export const postFittingTryon = async (userImageUrl: string, clothImageUrl: string) =>
  requestAPI<APIFitting>('/api/fitting/try-on', 'POST', {
    userImageUrl,
    clothImageUrl,
  });

export const postFittingTryonCombo = async (upper_product_id: string, lower_product_id: string) => {
  const formData = await imageToFormData('/model_image.jpg');
  return requestAPI<APIFitting>(
    `/api/fitting/try-on/combo?upper_product_id=${upper_product_id}&lower_product_id=${lower_product_id}`,
    'POST',
    formData,
    { 'Content-Type': 'multipart/form-data' },
  );
};
