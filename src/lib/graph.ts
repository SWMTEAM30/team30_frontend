import { Node, Edge } from '@xyflow/react';
import { GroupNode } from '@/components/graph/GroupNode';
import { PhotoNode } from '@/components/graph/PhotoNode';

export const GRID_SIZE = 20;

export const snapToGrid = (position: { x: number; y: number }) => ({
  x: Math.round(position.x / GRID_SIZE) * GRID_SIZE,
  y: Math.round(position.y / GRID_SIZE) * GRID_SIZE,
});

export const nodeTypes = {
  photo: PhotoNode,
  group: GroupNode,
};

export const initialNodes: Node[] = [
  {
    id: '1',
    type: 'photo',
    position: { x: 250, y: 100 },
    data: {
      imageUrl: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=200&h=200&fit=crop',
      label: '캐주얼 셔츠',
      tags: ['셔츠', '캐주얼'],
    },
  },
  {
    id: '2',
    type: 'photo',
    position: { x: 400, y: 200 },
    data: {
      imageUrl: '/cloth1.jpg',
      label: '데님 자켓',
      tags: ['자켓', '데님'],
    },
  },
  {
    id: '3',
    type: 'photo',
    position: { x: 100, y: 200 },
    data: {
      imageUrl: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=200&h=200&fit=crop',
      label: '스니커즈',
      tags: ['신발', '스니커즈'],
    },
  },
  {
    id: '4',
    type: 'photo',
    position: { x: 250, y: 300 },
    data: {
      imageUrl: 'https://images.unsplash.com/photo-1521577352947-9bb58764b69a?w=200&h=200&fit=crop',
      label: '청바지',
      tags: ['바지', '데님'],
    },
  },
  {
    id: 'group-1',
    type: 'group',
    position: { x: 50, y: 50 },
    style: {
      width: 400,
      height: 300,
      zIndex: -1,
    },
    data: {
      label: '캐주얼 룩',
      description: '편안하고 활동적인 스타일',
    },
  },
];

export const initialEdges: Edge[] = [
  {
    id: 'e1-2',
    source: '3',
    target: '4',
    type: 'straight',
    style: { stroke: '#4993FA', strokeWidth: 2 },
    label: '캐주얼한 하반신',
  },
  {
    id: 'e1-4',
    source: '2',
    target: '1',
    type: 'straight',
    style: { stroke: '#4993FA', strokeWidth: 2 },
    label: '아우터 조합',
  },
  {
    id: 'e3-4',
    source: '1',
    target: '4',
    type: 'straight',
    style: { stroke: '#4993FA', strokeWidth: 2 },
    label: '무난한 상하의 조합',
  },
];
