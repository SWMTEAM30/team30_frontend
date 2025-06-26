import { requestAPI } from '@/api/API';

// GET
export const getSessionStart = async () => requestAPI(`/api/flow/session-start`, 'GET');
export const getUserInfo = async () => requestAPI(`/api/flow/user-info`, 'GET');
export const getClientInfo = async () => requestAPI(`/api/flow/client-info`, 'GET');
export const getAdditionalInfo = async () => requestAPI(`/api/flow/additional-info`, 'GET');

// POST
export const postSaveInfo = async (info: any) => requestAPI(`/api/flow/save-info`, 'POST', info);
