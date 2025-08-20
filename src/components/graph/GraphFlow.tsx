'use client';

import { Background, BackgroundVariant, Controls, ReactFlow } from '@xyflow/react';
import { useGraphHandlers } from '@/components/graph/GraphContextProvider';
import { GRID_SIZE, nodeTypes } from '@/lib/graph';
import { useAtomValue } from 'jotai';
import { draggedNodeIdAtom, hoveredGroupIdAtom } from '@/atoms/graphAtoms';

export default function GraphFlow() {
  const { nodes, handleNodesChange, edges, onEdgesChange, onConnect, onNodeDragStart, onNodeDrag, onNodeDragStop } =
    useGraphHandlers();
  const hoveredGroupId = useAtomValue(hoveredGroupIdAtom);
  const draggedNodeId = useAtomValue(draggedNodeIdAtom);

  return (
    <ReactFlow
      nodes={nodes.map((node: any) => ({
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
  );
}
