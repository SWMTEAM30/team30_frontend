import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useCloset } from '@/hooks/useCloset';
import { useAtom } from 'jotai';
import { closetAtom } from '@/atoms/chatAtoms';

// 모킹
vi.mock('jotai', () => ({
  useAtom: vi.fn(),
}));

vi.mock('@/atoms/chatAtoms', () => ({
  closetAtom: {},
}));

vi.mock('@/lib/indexedDB', () => ({
  saveToIndexedDB: vi.fn().mockResolvedValue(undefined),
  clearIndexedDB: vi.fn().mockResolvedValue(undefined),
}));

vi.mock('@/config/indexedDB.config', () => ({
  STORE_NAMES: {
    CLOSET: 'closet',
  },
}));

describe('useCloset', () => {
  const mockCloset: ClosetCloth[] = [
    {
      id: '1',
      name: 'Shirt',
      url: 'https://example.com/shirt.jpg',
      description: 'A nice shirt',
      tags: ['casual'],
    },
    {
      id: '2',
      name: 'Pants',
      url: 'https://example.com/pants.jpg',
      description: 'Comfortable pants',
      tags: ['formal'],
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    const mockSetCloset = vi.fn();
    vi.mocked(useAtom).mockReturnValue([mockCloset, mockSetCloset] as any);
  });

  it('should initialize with closet from atom', () => {
    const { result } = renderHook(() => useCloset());
    expect(result.current.closet).toEqual(mockCloset);
  });

  it('should add cloth to closet', async () => {
    const mockSetCloset = vi.fn();
    vi.mocked(useAtom).mockReturnValue([mockCloset, mockSetCloset] as any);
    const { saveToIndexedDB } = await import('@/lib/indexedDB');

    const newCloth: ClosetCloth = {
      id: '3',
      name: 'Jacket',
      url: 'https://example.com/jacket.jpg',
      description: 'Warm jacket',
      tags: ['winter'],
    };

    const { result } = renderHook(() => useCloset());

    await act(async () => {
      await result.current.addClothToCloset(newCloth);
    });

      expect(mockSetCloset).toHaveBeenCalledWith([...mockCloset, newCloth]);
      expect(saveToIndexedDB).toHaveBeenCalled();
  });

  it('should add multiple clothes to closet', async () => {
    const mockSetCloset = vi.fn();
    vi.mocked(useAtom).mockReturnValue([mockCloset, mockSetCloset] as any);

    const newClothes: ClosetCloth[] = [
      {
        id: '3',
        name: 'Jacket',
        url: 'https://example.com/jacket.jpg',
        description: 'Warm jacket',
        tags: ['winter'],
      },
      {
        id: '4',
        name: 'Shoes',
        url: 'https://example.com/shoes.jpg',
        description: 'Comfortable shoes',
        tags: ['sport'],
      },
    ];

    const { result } = renderHook(() => useCloset());

    await act(async () => {
      await result.current.addClothesToCloset(newClothes);
    });

    expect(mockSetCloset).toHaveBeenCalledWith([...mockCloset, ...newClothes]);
  });

  it('should not add duplicate clothes', async () => {
    const mockSetCloset = vi.fn();
    vi.mocked(useAtom).mockReturnValue([mockCloset, mockSetCloset] as any);

    const duplicateCloth: ClosetCloth = {
      id: '1', // 이미 존재하는 id
      name: 'Duplicate Shirt',
      url: 'https://example.com/shirt2.jpg',
      description: 'Another shirt',
      tags: ['casual'],
    };

    const { result } = renderHook(() => useCloset());

    await act(async () => {
      await result.current.addClothesToCloset([duplicateCloth]);
    });

    // 중복된 아이템은 추가되지 않아야 함
    const callArgs = mockSetCloset.mock.calls[0][0];
    const ids = callArgs.map((c: ClosetCloth) => c.id);
    expect(ids.filter((id: string) => id === '1')).toHaveLength(1);
  });

  it('should remove cloth from closet', async () => {
    const mockSetCloset = vi.fn();
    vi.mocked(useAtom).mockReturnValue([mockCloset, mockSetCloset] as any);

    const { result } = renderHook(() => useCloset());

    await act(async () => {
      await result.current.removeClothFromCloset('1');
    });

    expect(mockSetCloset).toHaveBeenCalledWith([mockCloset[1]]);
  });

  it('should clear closet', async () => {
    const mockSetCloset = vi.fn();
    vi.mocked(useAtom).mockReturnValue([mockCloset, mockSetCloset] as any);

    const { result } = renderHook(() => useCloset());

    await act(async () => {
      await result.current.clearCloset();
    });

    expect(mockSetCloset).toHaveBeenCalledWith([]);
  });

  it('should handle empty clothes array', async () => {
    const mockSetCloset = vi.fn();
    vi.mocked(useAtom).mockReturnValue([mockCloset, mockSetCloset] as any);

    const { result } = renderHook(() => useCloset());

    await act(async () => {
      await result.current.addClothesToCloset([]);
    });

    // 빈 배열이면 setCloset이 호출되지 않아야 함
    expect(mockSetCloset).not.toHaveBeenCalled();
  });
});

