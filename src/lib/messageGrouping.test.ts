import { describe, it, expect } from 'vitest';
import { groupMessagesIntoPosts, addMessageToGroups, type MessageGroup } from './messageGrouping';

describe('messageGrouping', () => {
  const createUserMessage = (id: string, content: string, createdAt?: Date): Message => ({
    id,
    content,
    user: { userId: 'user1', username: 'test', modelImage: null },
    agent: null,
    message_type: 'USER',
    products: [],
    createdAt: createdAt || new Date(),
  });

  const createAgentMessage = (id: string, content: string, createdAt?: Date): Message => ({
    id,
    content,
    user: null,
    agent: { agentType: 'AI', agentname: 'assistant' },
    message_type: 'AI',
    products: [],
    createdAt: createdAt || new Date(),
  });

  describe('groupMessagesIntoPosts', () => {
    it('should group user message and agent replies', () => {
      const messages: Message[] = [
        createUserMessage('1', 'Hello'),
        createAgentMessage('2', 'Hi there'),
        createAgentMessage('3', 'How can I help?'),
      ];

      const groups = groupMessagesIntoPosts(messages);
      expect(groups).toHaveLength(1);
      expect(groups[0].mainPost.id).toBe('1');
      expect(groups[0].replies).toHaveLength(2);
      expect(groups[0].replies[0].id).toBe('2');
      expect(groups[0].replies[1].id).toBe('3');
    });

    it('should create separate groups for consecutive user messages', () => {
      const messages: Message[] = [
        createUserMessage('1', 'First message'),
        createAgentMessage('2', 'Reply 1'),
        createUserMessage('3', 'Second message'),
        createAgentMessage('4', 'Reply 2'),
      ];

      const groups = groupMessagesIntoPosts(messages);
      expect(groups).toHaveLength(2);
      expect(groups[0].mainPost.id).toBe('1');
      expect(groups[0].replies).toHaveLength(1);
      expect(groups[1].mainPost.id).toBe('3');
      expect(groups[1].replies).toHaveLength(1);
    });

    it('should mark first message as new session', () => {
      const messages: Message[] = [
        createUserMessage('1', 'First message'),
        createAgentMessage('2', 'Reply'),
      ];

      const groups = groupMessagesIntoPosts(messages);
      expect(groups[0].isNewSession).toBe(true);
    });

    it('should not mark subsequent groups as new session', () => {
      const messages: Message[] = [
        createUserMessage('1', 'First'),
        createAgentMessage('2', 'Reply'),
        createUserMessage('3', 'Second'),
      ];

      const groups = groupMessagesIntoPosts(messages);
      expect(groups[0].isNewSession).toBe(true);
      expect(groups[1].isNewSession).toBe(false);
    });

    it('should handle empty messages array', () => {
      const groups = groupMessagesIntoPosts([]);
      expect(groups).toHaveLength(0);
    });

    it('should remove duplicate messages by id', () => {
      const messages: Message[] = [
        createUserMessage('1', 'First'),
        createUserMessage('1', 'Duplicate'),
        createAgentMessage('2', 'Reply'),
      ];

      const groups = groupMessagesIntoPosts(messages);
      expect(groups).toHaveLength(1);
      expect(groups[0].mainPost.content).toBe('First');
    });

    it('should handle user message without agent reply', () => {
      const messages: Message[] = [createUserMessage('1', 'Hello')];
      const groups = groupMessagesIntoPosts(messages);
      expect(groups).toHaveLength(1);
      expect(groups[0].replies).toHaveLength(0);
    });

    it('should handle consecutive user messages as separate groups', () => {
      const messages: Message[] = [
        createUserMessage('1', 'First'),
        createAgentMessage('2', 'Reply 1'),
        createUserMessage('3', 'Second'), // 다른 id 사용
        createAgentMessage('4', 'Reply 2'),
      ];

      const groups = groupMessagesIntoPosts(messages);
      expect(groups).toHaveLength(2);
      expect(groups[0].id).not.toBe(groups[1].id);
      expect(groups[0].mainPost.id).toBe('1');
      expect(groups[1].mainPost.id).toBe('3');
    });
  });

  describe('addMessageToGroups', () => {
    it('should add user message as new group', () => {
      const existingGroups: MessageGroup[] = [
        {
          id: 'group-1-1',
          mainPost: createUserMessage('1', 'First'),
          replies: [createAgentMessage('2', 'Reply')],
          timestamp: new Date(),
        },
      ];

      const newMessage = createUserMessage('3', 'Second');
      const updatedGroups = addMessageToGroups(existingGroups, newMessage);

      expect(updatedGroups).toHaveLength(2);
      expect(updatedGroups[1].mainPost.id).toBe('3');
      expect(updatedGroups[1].replies).toHaveLength(0);
    });

    it('should add agent message to last group as reply', () => {
      const existingGroups: MessageGroup[] = [
        {
          id: 'group-1-1',
          mainPost: createUserMessage('1', 'First'),
          replies: [],
          timestamp: new Date(),
        },
      ];

      const newMessage = createAgentMessage('2', 'Reply');
      const updatedGroups = addMessageToGroups(existingGroups, newMessage);

      expect(updatedGroups).toHaveLength(1);
      expect(updatedGroups[0].replies).toHaveLength(1);
      expect(updatedGroups[0].replies[0].id).toBe('2');
    });

    it('should handle agent message when no groups exist', () => {
      const existingGroups: MessageGroup[] = [];
      const newMessage = createAgentMessage('1', 'Standalone reply');
      const updatedGroups = addMessageToGroups(existingGroups, newMessage);

      expect(updatedGroups).toHaveLength(1);
      expect(updatedGroups[0].mainPost.user).toBeTruthy();
    });

    it('should generate unique group ids for same message id', () => {
      const existingGroups: MessageGroup[] = [
        {
          id: 'group-1-1',
          mainPost: createUserMessage('1', 'First'),
          replies: [],
          timestamp: new Date(),
        },
      ];

      const newMessage = createUserMessage('1', 'Second');
      const updatedGroups = addMessageToGroups(existingGroups, newMessage);

      expect(updatedGroups[1].id).toBe('group-1-2');
    });
  });
});

