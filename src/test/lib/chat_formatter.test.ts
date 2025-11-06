import { describe, it, expect } from 'vitest';
import { formatMessage, formatRoomMessage } from '@/lib/chat_formatter';

describe('chat_formatter', () => {
  describe('formatMessage', () => {
    it('should format APIResponseMessage with USER role', () => {
      const apiMsg: APIResponseMessage = {
        message: 'Hello',
        order: 1,
        agent_id: 'user1',
        agent_name: 'user',
        agent_role: 'USER',
        products: [],
      };

      const result = formatMessage(apiMsg);
      expect(result.user).toBeTruthy();
      expect(result.agent).toBeNull();
      expect(result.content).toBe('Hello');
      expect(result.message_type).toBe('USER');
    });

    it('should format APIResponseMessage with AI role', () => {
      const apiMsg: APIResponseMessage = {
        message: 'Hi there',
        order: 1,
        agent_id: 'ai1',
        agent_name: 'assistant',
        agent_role: 'AI',
        products: [],
      };

      const result = formatMessage(apiMsg);
      expect(result.user).toBeNull();
      expect(result.agent).toBeTruthy();
      expect(result.agent?.agentType).toBe('AI');
      expect(result.agent?.agentname).toBe('assistant');
      expect(result.content).toBe('Hi there');
    });

    it('should format APIRoomIdMessage with USER type', () => {
      const apiMsg: APIRoomIdMessage = {
        id: 1,
        content: 'Hello',
        image_url: null,
        message_type: 'USER',
        created_at: '2024-01-01T00:00:00Z',
        agent_type: null,
        agent_name: null,
        product_image_url: null,
      };

      const result = formatMessage(apiMsg);
      expect(result.user).toBeTruthy();
      expect(result.agent).toBeNull();
      expect(result.content).toBe('Hello');
    });

    it('should format APIRoomIdMessage with AI type', () => {
      const apiMsg: APIRoomIdMessage = {
        id: 1,
        content: 'Reply',
        image_url: null,
        message_type: 'AI',
        created_at: '2024-01-01T00:00:00Z',
        agent_type: 'ASSISTANT',
        agent_name: 'assistant',
        product_image_url: null,
      };

      const result = formatMessage(apiMsg);
      expect(result.user).toBeNull();
      expect(result.agent).toBeTruthy();
      expect(result.agent?.agentType).toBe('ASSISTANT');
      expect(result.agent?.agentname).toBe('assistant');
    });

    it('should handle products in APIResponseMessage', () => {
      const apiMsg: APIResponseMessage = {
        message: 'Check these products',
        order: 1,
        agent_id: 'ai1',
        agent_name: 'assistant',
        agent_role: 'AI',
        products: [
          { product_url: 'url1', product_id: 'id1' },
          { product_url: 'url2', product_id: 'id2' },
        ],
      };

      const result = formatMessage(apiMsg);
      expect(result.products).toHaveLength(2);
      expect(result.products[0].product_id).toBe('id1');
    });
  });

  describe('formatRoomMessage', () => {
    it('should format message with user when agent_type is null', () => {
      const apiMsg: APIRoomIdMessage = {
        id: 1,
        content: 'User message',
        image_url: null,
        message_type: 'USER',
        created_at: '2024-01-01T00:00:00Z',
        agent_type: null,
        agent_name: null,
        product_image_url: null,
      };

      const result = formatRoomMessage(apiMsg);
      expect(result.user).toBeTruthy();
      expect(result.agent).toBeNull();
      expect(result.id).toBe('1');
    });

    it('should format message with agent when agent_type is provided', () => {
      const apiMsg: APIRoomIdMessage = {
        id: 2,
        content: 'AI message',
        image_url: null,
        message_type: 'AI',
        created_at: '2024-01-01T00:00:00Z',
        agent_type: 'ASSISTANT',
        agent_name: 'assistant',
        product_image_url: null,
      };

      const result = formatRoomMessage(apiMsg);
      expect(result.user).toBeNull();
      expect(result.agent).toBeTruthy();
      expect(result.agent?.agentType).toBe('ASSISTANT');
    });

    it('should parse product_image_url correctly', () => {
      const apiMsg: APIRoomIdMessage = {
        id: 3,
        content: 'Products',
        image_url: null,
        message_type: 'AI',
        created_at: '2024-01-01T00:00:00Z',
        agent_type: 'ASSISTANT',
        agent_name: 'assistant',
        product_image_url: ['https://example.com/image1.jpg', 'https://example.com/image2.jpg'],
      };

      const result = formatRoomMessage(apiMsg);
      expect(result.products).toHaveLength(2);
      expect(result.products[0].product_url).toBe('https://example.com/image1.jpg');
    });

    it('should handle empty product_image_url', () => {
      const apiMsg: APIRoomIdMessage = {
        id: 4,
        content: 'No products',
        image_url: null,
        message_type: 'AI',
        created_at: '2024-01-01T00:00:00Z',
        agent_type: 'ASSISTANT',
        agent_name: 'assistant',
        product_image_url: null,
      };

      const result = formatRoomMessage(apiMsg);
      expect(result.products).toHaveLength(0);
    });
  });
});

