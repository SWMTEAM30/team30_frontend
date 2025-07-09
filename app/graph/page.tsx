'use client';

import { useCallback, useState, useEffect } from 'react';
import {
  ReactFlow,
  addEdge,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  Connection,
  Edge,
  Node,
  BackgroundVariant,
  NodeChange,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { PhotoNode } from '@/components/PhotoNode';
import { GroupNode } from '@/components/GroupNode';
import { ScrollArea } from '@/components/ui/scroll-area';
import Image from 'next/image';

const nodeTypes = {
  photo: PhotoNode,
  group: GroupNode,
};

// 격자 크기 (픽셀)
const GRID_SIZE = 20;

// 격자에 맞춰 위치 조정하는 함수
const snapToGrid = (position: { x: number; y: number }) => ({
  x: Math.round(position.x / GRID_SIZE) * GRID_SIZE,
  y: Math.round(position.y / GRID_SIZE) * GRID_SIZE,
});

const initialNodes: Node[] = [
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

const initialEdges: Edge[] = [
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

export default function GraphPage() {
  const router = useRouter();

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [isModelSectionOpen, setIsModelSectionOpen] = useState(false);
  const [draggedNodeId, setDraggedNodeId] = useState<string | null>(null);
  const [hoveredGroupId, setHoveredGroupId] = useState<string | null>(null);
  // 그룹과 모델 매핑 상태
  const [groupModels, setGroupModels] = useState<
    Record<
      string,
      {
        modelImage: string;
        wornItems: string[];
      }
    >
  >({
    'group-1': {
      modelImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=400&fit=crop',
      wornItems: [],
    },
  });

  // 그룹의 초기 크기 저장
  const [groupInitialSizes, setGroupInitialSizes] = useState<Record<string, { width: number; height: number }>>({});

  // 노드가 그룹 내부에 있는지 확인하는 함수
  const isNodeInsideGroup = (photoNode: Node, groupNode: Node) => {
    const groupBounds = {
      left: groupNode.position.x,
      right: groupNode.position.x + ((groupNode.style?.width as number) || 300),
      top: groupNode.position.y,
      bottom: groupNode.position.y + ((groupNode.style?.height as number) || 200),
    };

    return (
      photoNode.position.x >= groupBounds.left &&
      photoNode.position.x <= groupBounds.right &&
      photoNode.position.y >= groupBounds.top &&
      photoNode.position.y <= groupBounds.bottom
    );
  };

  // 노드 변경을 감지하여 그룹 내 사진 노드들을 추적
  useEffect(() => {
    const groupNodes = nodes.filter((node) => node.type === 'group');
    const photoNodes = nodes.filter((node) => node.type === 'photo');

    const newGroupModels: Record<
      string,
      {
        modelImage: string;
        wornItems: string[];
      }
    > = {};
    const newGroupSizes: Record<string, { width: number; height: number }> = {};

    groupNodes.forEach((groupNode) => {
      // 그룹의 초기 크기 저장
      if (!groupInitialSizes[groupNode.id]) {
        newGroupSizes[groupNode.id] = {
          width: (groupNode.style?.width as number) || 300,
          height: (groupNode.style?.height as number) || 200,
        };
      } else {
        newGroupSizes[groupNode.id] = groupInitialSizes[groupNode.id];
      }

      // 그룹 영역 내에 있는 사진 노드들 찾기
      const photosInGroup = photoNodes.filter((photoNode) => isNodeInsideGroup(photoNode, groupNode));

      newGroupModels[groupNode.id] = {
        modelImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=400&fit=crop',
        wornItems: photosInGroup.map((photo) => (photo.data?.label as string) || '아이템'),
      };
    });

    setGroupModels(newGroupModels);
    setGroupInitialSizes(newGroupSizes);
  }, [nodes]);

  // 그룹 크기 복원은 별도로 처리하지 않고, 그룹 모델 업데이트만 처리

  // 드래그 시작 핸들러
  const onNodeDragStart = useCallback(
    (event: React.MouseEvent, node: Node) => {
      setDraggedNodeId(node.id);

      // 사진 노드가 드래그될 때 어떤 그룹 위에 있는지 확인
      if (node.type === 'photo') {
        const groupNodes = nodes.filter((n) => n.type === 'group');
        const hoveredGroup = groupNodes.find((groupNode) => isNodeInsideGroup(node, groupNode));

        if (hoveredGroup) {
          setHoveredGroupId(hoveredGroup.id);
        }
      }
    },
    [nodes],
  );

  // 드래그 중 핸들러
  const onNodeDrag = useCallback(
    (event: React.MouseEvent, node: Node) => {
      if (node.type === 'photo') {
        const groupNodes = nodes.filter((n) => n.type === 'group');
        const hoveredGroup = groupNodes.find((groupNode) => isNodeInsideGroup(node, groupNode));

        setHoveredGroupId(hoveredGroup?.id || null);
      }
    },
    [nodes],
  );

  // 드래그 종료 핸들러
  const onNodeDragStop = useCallback(
    (event: React.MouseEvent, node: Node) => {
      setDraggedNodeId(null);
      setHoveredGroupId(null);

      // 격자에 맞춰 위치 조정
      const snappedPosition = snapToGrid(node.position);

      setNodes((currentNodes) =>
        currentNodes.map((n) => {
          if (n.id === node.id) {
            let finalPosition = snappedPosition;

            // 사진 노드가 그룹 안에 드롭되었을 때 위치 재조정
            if (node.type === 'photo') {
              const groupNodes = currentNodes.filter((gn) => gn.type === 'group');
              const targetGroup = groupNodes.find((groupNode) =>
                isNodeInsideGroup({ ...node, position: snappedPosition }, groupNode),
              );

              if (targetGroup) {
                // 그룹 안쪽으로 위치 조정 (경계에서 약간 안쪽으로)
                const padding = 20;
                const groupBounds = {
                  left: targetGroup.position.x + padding,
                  right: targetGroup.position.x + ((targetGroup.style?.width as number) || 300) - padding,
                  top: targetGroup.position.y + padding,
                  bottom: targetGroup.position.y + ((targetGroup.style?.height as number) || 200) - padding,
                };

                finalPosition = {
                  x: Math.max(groupBounds.left, Math.min(groupBounds.right, snappedPosition.x)),
                  y: Math.max(groupBounds.top, Math.min(groupBounds.bottom, snappedPosition.y)),
                };

                // 격자에 다시 맞춤
                finalPosition = snapToGrid(finalPosition);
              }
            }

            return {
              ...n,
              position: finalPosition,
            };
          }
          return n;
        }),
      );
    },
    [setNodes],
  );

  // 커스텀 노드 변경 핸들러 (그룹 이동시 사진 노드들도 같이 이동)
  const handleNodesChange = useCallback(
    (changes: NodeChange[]) => {
      const moveChanges = changes.filter((change) => change.type === 'position');

      if (moveChanges.length > 0) {
        setNodes((currentNodes) => {
          let updatedNodes = [...currentNodes];

          moveChanges.forEach((change) => {
            if (change.type === 'position' && change.position) {
              const node = updatedNodes.find((n) => n.id === change.id);
              if (node?.type === 'group') {
                // 그룹이 이동할 때 그룹 내 사진 노드들도 같이 이동
                const oldPosition = node.position;
                const newPosition = snapToGrid(change.position); // 그룹도 격자에 맞춤
                const deltaX = newPosition.x - oldPosition.x;
                const deltaY = newPosition.y - oldPosition.y;

                // 그룹 영역 내의 사진 노드들 찾기
                const groupBounds = {
                  left: oldPosition.x,
                  right: oldPosition.x + ((node.style?.width as number) || 300),
                  top: oldPosition.y,
                  bottom: oldPosition.y + ((node.style?.height as number) || 200),
                };

                updatedNodes = updatedNodes.map((n) => {
                  if (n.id === change.id) {
                    return { ...n, position: newPosition };
                  }
                  if (
                    n.type === 'photo' &&
                    n.position.x >= groupBounds.left &&
                    n.position.x <= groupBounds.right &&
                    n.position.y >= groupBounds.top &&
                    n.position.y <= groupBounds.bottom
                  ) {
                    return {
                      ...n,
                      position: snapToGrid({
                        x: n.position.x + deltaX,
                        y: n.position.y + deltaY,
                      }),
                    };
                  }
                  return n;
                });
              } else {
                // 사진 노드는 격자에 맞춤
                updatedNodes = updatedNodes.map((n) => {
                  if (n.id === change.id) {
                    return { ...n, position: snapToGrid(change.position ?? { x: 1, y: 1 }) };
                  }
                  return n;
                });
              }
            }
          });

          return updatedNodes;
        });
      }

      onNodesChange(changes);
    },
    [onNodesChange, setNodes],
  );

  const onConnect = useCallback(
    (params: Connection) =>
      setEdges((eds) =>
        addEdge(
          {
            ...params,
            type: 'straight',
            style: { stroke: '#4993FA', strokeWidth: 2 },
          },
          eds,
        ),
      ),
    [setEdges],
  );

  const addNewPhotoNode = () => {
    const newNode: Node = {
      id: `photo-${Date.now()}`,
      type: 'photo',
      position: { x: Math.random() * 400 + 100, y: Math.random() * 300 + 100 },
      data: {
        imageUrl: 'https://images.unsplash.com/photo-1506629905607-c75a07f44f14?w=200&h=200&fit=crop',
        label: '새 아이템',
        tags: ['새로운', '아이템'],
      },
    };
    setNodes((nds) => nds.concat(newNode));
  };

  const addNewGroup = () => {
    const newGroup: Node = {
      id: `group-${Date.now()}`,
      type: 'group',
      position: { x: Math.random() * 200 + 500, y: Math.random() * 200 + 100 },
      style: {
        width: 300,
        height: 200,
        zIndex: -1,
      },
      data: {
        label: '새 그룹',
        description: '새로운 스타일 그룹',
      },
    };
    setNodes((nds) => nds.concat(newGroup));
  };

  return (
    <div className="h-screen bg-[#F1FAFB] flex relative">
      <div className="flex-1 flex flex-col">
        {/* 헤더 */}
        <div className="bg-white border-b border-gray-200 p-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              onClick={() => router.push('/chat')}
              className="border-[#4993FA] text-[#4993FA] hover:bg-[#4993FA] hover:text-white"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              채팅으로 돌아가기
            </Button>
            <h1 className="text-2xl font-bold text-[#4993FA]">패션 아이템 연결 그래프</h1>
          </div>
          <div className="flex gap-2">
            <Button onClick={addNewPhotoNode} className="bg-[#4993FA] hover:bg-[#3A7BD8] text-white">
              <Plus className="w-4 h-4 mr-2" />
              사진 노드 추가
            </Button>
            <Button
              onClick={addNewGroup}
              variant="outline"
              className="border-[#4993FA] text-[#4993FA] hover:bg-[#4993FA] hover:text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              그룹 추가
            </Button>
            <Button
              onClick={() => setIsModelSectionOpen(!isModelSectionOpen)}
              variant="outline"
              className="border-[#4993FA] text-[#4993FA] hover:bg-[#4993FA] hover:text-white"
            >
              {isModelSectionOpen ? (
                <ChevronRight className="w-4 h-4 mr-2" />
              ) : (
                <ChevronLeft className="w-4 h-4 mr-2" />
              )}
              모델 미리보기
            </Button>
          </div>
        </div>

        {/* React Flow */}
        <div className="flex-1">
          <ReactFlow
            nodes={nodes.map((node) => ({
              ...node,
              style: {
                ...node.style,
                // 드래그 중인 사진 노드와 호버된 그룹에 이펙트 적용
                ...(node.type === 'group' && node.id === hoveredGroupId
                  ? {
                      filter: 'brightness(0.8)',
                      transition: 'all 0.2s ease-in-out',
                      zIndex: -1,
                    }
                  : {}),
                ...(node.type === 'photo' && node.id === draggedNodeId
                  ? {
                      zIndex: 1000,
                    }
                  : {}),
              },
            }))}
            edges={edges}
            onNodesChange={handleNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeDragStart={onNodeDragStart}
            onNodeDrag={onNodeDrag}
            onNodeDragStop={onNodeDragStop}
            nodeTypes={nodeTypes}
            fitView
            snapToGrid={true}
            snapGrid={[GRID_SIZE, GRID_SIZE]}
            style={{ backgroundColor: '#F1FAFB' }}
          >
            <Controls className="bg-white border border-gray-200" />
            <Background variant={BackgroundVariant.Dots} gap={GRID_SIZE} size={1} color="#D1D5DB" />
          </ReactFlow>
        </div>
      </div>

      {/* 오른쪽 모델 세션 - 오버레이 형태 */}
      <div
        className={`fixed top-0 right-0 h-full w-80 bg-white border-l border-gray-200 shadow-lg z-50 transition-transform duration-300 ease-in-out ${
          isModelSectionOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-800">모델 미리보기</h2>
          <Button variant="ghost" size="sm" onClick={() => setIsModelSectionOpen(false)}>
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>

        <ScrollArea className="h-[calc(100vh-80px)]">
          <div className="p-4 space-y-6">
            {Object.entries(groupModels).map(([groupId, modelData]) => {
              const groupNode = nodes.find((n) => n.id === groupId);
              if (!groupNode) return null;

              return (
                <div key={groupId} className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-medium text-gray-800 mb-3">{(groupNode.data?.label as string) || '그룹'}</h3>

                  {/* 모델 이미지 */}
                  <div className="relative mb-3">
                    <Image
                      width={300}
                      height={300}
                      src={modelData.modelImage}
                      alt="모델"
                      className="w-full h-48 object-cover rounded-lg"
                    />
                  </div>

                  {/* 착용 아이템 목록 */}
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-gray-600">착용 아이템:</h4>
                    {modelData.wornItems.length > 0 ? (
                      <div className="space-y-1">
                        {modelData.wornItems.map((item, index) => (
                          <div key={index} className="text-sm text-gray-700 bg-gray-50 px-2 py-1 rounded">
                            {item}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500">아무 옷도 입고 있지 않음</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
