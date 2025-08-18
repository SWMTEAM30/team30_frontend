'use client';

import { memo } from 'react';
import { NodeResizer } from '@xyflow/react';

interface GroupNodeProps {
  data: {
    label: string;
    description: string;
  };
}

export const GroupNode = ({ data }: GroupNodeProps) => {
  return (
    <>
      <NodeResizer minWidth={200} minHeight={150} />
      <div className="w-full h-full border-2 border-dashed border-[#4993FA] bg-[#4993FA]/5 rounded-lg p-4 backdrop-blur-sm">
        <div className="bg-white/80 rounded p-2 inline-block">
          <h3 className="font-bold text-[#4993FA] text-sm">{data.label}</h3>
          <p className="text-xs text-gray-600 mt-1">{data.description}</p>
        </div>
      </div>
    </>
  );
};
