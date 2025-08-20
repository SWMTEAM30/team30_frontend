import React from 'react';
import * as icons from '@radix-ui/react-icons'; // Radix Icon 컴포넌트 import
import { IconProps } from '@radix-ui/react-icons/dist/types';
import { cn } from '@/lib/utils';
import { parseColorSet } from '@/lib/color';

export interface RadixIconProps extends IconProps {
  name: keyof typeof icons;
  size?: number;
  color?: ColorShadeFormat;
}

function RadixIcon({ name, size = 16, color = 'blue-500', ...props }: RadixIconProps) {
  const SelectRadixIcon = icons[name];

  const isClickEvent = !!props.onClick;
  const pointerStyle = isClickEvent ? 'cursor-pointer' : '';

  return (
    <SelectRadixIcon
      width={size}
      height={size}
      className={cn(pointerStyle, props.className)}
      {...props}
      color={parseColorSet(color, props.className?.includes('dark'))}
    />
  );
}

export default RadixIcon;
