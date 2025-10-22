'use client';

import { useToast } from '@/hooks/useToast';
import { ToastContainer } from '@/components/ui/Toast';

interface StorageInitializerProps {
  children: React.ReactNode;
}

export default function ToastInitializer({ children }: StorageInitializerProps) {
  // 토스트 시스템 초기화
  const { toasts, removeToast } = useToast();

  return (
    <>
      {children}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </>
  );
}
