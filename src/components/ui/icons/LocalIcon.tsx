import { HTMLAttributes } from 'react';

export interface LocalIconProps extends HTMLAttributes<HTMLSpanElement> {
  iconSrc: string;
  iconSize?: number;
  onClick?: (e: React.MouseEvent<HTMLSpanElement, MouseEvent>) => void;
  className?: string;
  onPointerDown?: (e: React.PointerEvent<HTMLSpanElement>) => void;
}

export default function LocalIcon({
  iconSrc,
  iconSize = 16,
  onClick,
  onPointerDown,
  className,
  ...props
}: LocalIconProps) {
  const defaultStyle: React.CSSProperties = {
    display: 'inline-block',
    flexShrink: 0,
    background: `url(${iconSrc}) center center/contain`,
    backgroundRepeat: 'no-repeat',
    width: `${iconSize}px`,
    height: `${iconSize}px`,
  };

  return (
    <span
      className={className}
      onClick={onClick}
      onPointerDown={onPointerDown}
      style={onClick || onPointerDown ? { cursor: 'pointer', ...defaultStyle } : { ...defaultStyle }}
      {...props}
    />
  );
}
