import { http, HttpResponse } from 'msw';

const API_BASE = process.env.NEXT_PUBLIC_TFT_BACKEND_URL || '';

export const handlers = [
	// Auth
	http.get(`${API_BASE}/api/auth/me`, () => {
		return HttpResponse.json({ status: 'success', message: 'ok', data: { userId: 'u1', nickname: 'tester' } });
	}),
	http.post(`${API_BASE}/api/auth/refresh`, () => {
		return HttpResponse.json({ status: 'success', message: 'refreshed', data: null });
	}),
	// Chat
	http.post(`${API_BASE}/api/chat/send`, async ({ request }) => {
		return HttpResponse.json({ status: 'success', message: 'sent', data: 1 });
	}),
	http.get(`${API_BASE}/api/chat/rooms/history`, () => {
		return HttpResponse.json({ status: 'success', message: 'ok', data: { all_rooms: [] } });
	}),
	http.get(`${API_BASE}/api/chat/rooms/:roomId/messages`, ({ params }) => {
		return HttpResponse.json({
			status: 'success',
			message: 'ok',
			data: { messages: [] },
		});
	}),
	// Cloth/Flow
	http.get(`${API_BASE}/api/flow/user-info`, () => {
		return HttpResponse.json({ status: 'success', message: 'ok', data: {} });
	}),
	// Fitting
	http.post(`${API_BASE}/api/fitting/try-on`, () => {
		return HttpResponse.json({ status: 'success', message: 'ok', data: { image_url: '/mock/fit.jpg' } });
	}),
];

