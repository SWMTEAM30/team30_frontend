import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useToast } from './useToast';

describe('useToast', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should initialize with empty toasts', () => {
    const { result } = renderHook(() => useToast());
    expect(result.current.toasts).toHaveLength(0);
  });

  it('should add toast with addToast', () => {
    const { result } = renderHook(() => useToast());
    
    act(() => {
      result.current.addToast({ type: 'success', message: 'Test message' });
    });

    expect(result.current.toasts).toHaveLength(1);
    expect(result.current.toasts[0].type).toBe('success');
    expect(result.current.toasts[0].message).toBe('Test message');
    expect(result.current.toasts[0].duration).toBe(5000);
  });

  it('should use custom duration when provided', () => {
    const { result } = renderHook(() => useToast());
    
    act(() => {
      result.current.addToast({ type: 'info', message: 'Test', duration: 3000 });
    });

    expect(result.current.toasts[0].duration).toBe(3000);
  });

  it('should remove toast after duration', async () => {
    const { result } = renderHook(() => useToast());
    
    act(() => {
      result.current.addToast({ type: 'success', message: 'Test', duration: 100 });
    });

    expect(result.current.toasts).toHaveLength(1);

    // 타이머를 진행시키고 모든 pending 타이머를 실행
    await act(async () => {
      vi.advanceTimersByTime(150);
      // Promise를 resolve하여 setTimeout 콜백이 실행되도록 함
      await Promise.resolve();
    });

    expect(result.current.toasts).toHaveLength(0);
  });

  it('should remove toast manually', () => {
    const { result } = renderHook(() => useToast());
    
    act(() => {
      result.current.addToast({ type: 'success', message: 'Test' });
    });

    const toastId = result.current.toasts[0].id;
    
    act(() => {
      result.current.removeToast(toastId);
    });

    expect(result.current.toasts).toHaveLength(0);
  });

  it('should show success toast', () => {
    const { result } = renderHook(() => useToast());
    
    act(() => {
      result.current.showSuccess('Success message');
    });

    expect(result.current.toasts).toHaveLength(1);
    expect(result.current.toasts[0].type).toBe('success');
    expect(result.current.toasts[0].message).toBe('Success message');
  });

  it('should show error toast', () => {
    const { result } = renderHook(() => useToast());
    
    act(() => {
      result.current.showError('Error message');
    });

    expect(result.current.toasts).toHaveLength(1);
    expect(result.current.toasts[0].type).toBe('error');
    expect(result.current.toasts[0].message).toBe('Error message');
  });

  it('should show warning toast', () => {
    const { result } = renderHook(() => useToast());
    
    act(() => {
      result.current.showWarning('Warning message');
    });

    expect(result.current.toasts).toHaveLength(1);
    expect(result.current.toasts[0].type).toBe('warning');
  });

  it('should show info toast', () => {
    const { result } = renderHook(() => useToast());
    
    act(() => {
      result.current.showInfo('Info message');
    });

    expect(result.current.toasts).toHaveLength(1);
    expect(result.current.toasts[0].type).toBe('info');
  });

  it('should handle multiple toasts', () => {
    const { result } = renderHook(() => useToast());
    
    act(() => {
      result.current.showSuccess('First');
      result.current.showError('Second');
      result.current.showWarning('Third');
    });

    expect(result.current.toasts).toHaveLength(3);
  });

  it('should generate unique ids for toasts', () => {
    const { result } = renderHook(() => useToast());
    
    act(() => {
      result.current.showSuccess('First');
      result.current.showSuccess('Second');
    });

    expect(result.current.toasts[0].id).not.toBe(result.current.toasts[1].id);
  });
});

