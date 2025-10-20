import { useState, useCallback } from 'react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
  id: string;
  type: ToastType;
  message: string;
  duration?: number;
}

export const useToast = () => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((toast: Omit<Toast, 'id'>) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const newToast: Toast = {
      id,
      duration: 5000, // 기본 5초
      ...toast,
    };

    setToasts((prev) => [...prev, newToast]);

    // 자동 제거
    setTimeout(() => {
      removeToast(id);
    }, newToast.duration);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const showSuccess = useCallback(
    (message: string, duration?: number) => {
      addToast({ type: 'success', message, duration });
    },
    [addToast],
  );

  const showError = useCallback(
    (message: string, duration?: number) => {
      addToast({ type: 'error', message, duration });
    },
    [addToast],
  );

  const showWarning = useCallback(
    (message: string, duration?: number) => {
      addToast({ type: 'warning', message, duration });
    },
    [addToast],
  );

  const showInfo = useCallback(
    (message: string, duration?: number) => {
      addToast({ type: 'info', message, duration });
    },
    [addToast],
  );

  return {
    toasts,
    addToast,
    removeToast,
    showSuccess,
    showError,
    showWarning,
    showInfo,
  };
};

