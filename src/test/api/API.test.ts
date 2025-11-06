import { describe, it, expect } from 'vitest';
import { requestAPI } from '@/api/API';

// Ensure env for tests
process.env.NEXT_PUBLIC_TFT_BACKEND_URL = 'http://localhost:3000';

describe('requestAPI (MSW)', () => {
	it('should return success for mocked endpoint', async () => {
		const res = await requestAPI('/api/auth/me', 'GET');
		expect(res.status).toBe('success');
		expect(res.data).toBeTruthy();
	});

	it('should handle POST send chat', async () => {
		const res = await requestAPI('/api/chat/send', 'POST', { content: 'hello' });
		expect(res.status).toBe('success');
	});
});

