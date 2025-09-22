import { requestAPI } from '@/api/API';

/// GET
export const getFittingProxyImage = async () => requestAPI<APIFitting>('/api/fitting/proxy-image', 'GET');

export const getFittingStatusTaskId = async (taskId: string) =>
  requestAPI<APIFitting>(`/api/fitting/status/${taskId}`, 'GET');

export const getFittingProxyTest = async () => requestAPI<APIFitting>('/api/fitting/proxy-test', 'GET');

/// POST
export const postFittingTryon = async () => requestAPI<APIFitting>('/api/fitting/try-on', 'POST');

export const postFittingTryonCombo = async () => requestAPI<APIFitting>('/api/fitting/try-on/combo', 'POST');
