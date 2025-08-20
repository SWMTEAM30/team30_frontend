'use client';

import { draggedNodeIdAtom, groupInitialSizesAtom, groupModelsAtom, hoveredGroupIdAtom } from '@/atoms/graphAtoms';
import { initialEdges, initialNodes, snapToGrid } from '@/lib/graph';
import {
  useNodesState,
  useEdgesState,
  Node,
  NodeChange,
  Connection,
  addEdge,
  OnEdgesChange,
  Edge,
} from '@xyflow/react';
import { useAtom } from 'jotai';
import { createContext, Dispatch, ReactNode, SetStateAction, useCallback, useContext, useEffect } from 'react';

type GraphActionsContextType = {
  nodes: Node[];
  setNodes: Dispatch<SetStateAction<Node[]>>;
  handleNodesChange: (changes: NodeChange[]) => void;
  edges: Edge[];
  setEdges: Dispatch<SetStateAction<Edge[]>>;
  onEdgesChange: OnEdgesChange<Edge>;
  onConnect: (params: Connection) => void;
  onNodeDragStart: (event: React.MouseEvent, node: Node) => void;
  onNodeDrag: (event: React.MouseEvent, node: Node) => void;
  onNodeDragStop: (event: React.MouseEvent, node: Node) => void;
  addNewPhotoNode: () => void;
  addNewGroup: () => void;
};
const GraphActionsContext = createContext<GraphActionsContextType | undefined>(undefined);

export const useGraphHandlers = () => {
  const context = useContext(GraphActionsContext);
  if (context === undefined) throw new Error('useGraphActions must be used within a GraphProvider');
  return context;
};

export default function GraphContextProvider({ children }: { children: ReactNode }) {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [groupModels, setGroupModels] = useAtom(groupModelsAtom);
  const [groupInitialSizes, setGroupInitialSizes] = useAtom(groupInitialSizesAtom);
  const [draggedNodeId, setDraggedNodeId] = useAtom(draggedNodeIdAtom);
  const [hoveredGroupId, setHoveredGroupId] = useAtom(hoveredGroupIdAtom);

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

  const actionsValue: GraphActionsContextType = {
    nodes,
    setNodes,
    handleNodesChange,
    edges,
    setEdges,
    onEdgesChange,
    onConnect,
    onNodeDragStart,
    onNodeDrag,
    onNodeDragStop,
    addNewPhotoNode,
    addNewGroup,
  };
  return <GraphActionsContext.Provider value={actionsValue}>{children}</GraphActionsContext.Provider>;
}
