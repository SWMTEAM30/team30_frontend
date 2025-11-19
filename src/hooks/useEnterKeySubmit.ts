'use client';

import { KeyboardEvent, useCallback } from 'react';

interface UseEnterKeySubmitOptions {
  /**
   * 현재 입력값
   */
  inputValue: string;
  /**
   * Enter 키를 눌렀을 때 실행할 콜백 함수
   */
  onSubmit: () => void;
  /**
   * Shift + Enter를 허용할지 여부 (기본값: true)
   */
  allowShiftEnter?: boolean;
}

/**
 * 한글 입력 시 마지막 글자 중복 방지를 포함한 Enter 키 처리 hook
 * 
 * @example
 * ```tsx
 * const handleKeyDown = useEnterKeySubmit({
 *   inputValue: inputValue,
 *   onSubmit: () => handleSendMessage(),
 * });
 * 
 * <Textarea onKeyDown={handleKeyDown} />
 * ```
 */
export function useEnterKeySubmit({
  inputValue,
  onSubmit,
  allowShiftEnter = true,
}: UseEnterKeySubmitOptions) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLTextAreaElement>) => {
      const isEmpty = !inputValue.trim();
      const isComposing = e.nativeEvent.isComposing;

      // IME 조합 중이면 Enter 키 무시
      if (isComposing) {
        return;
      }

      const isEnter = e.key === 'Enter';
      const isShiftEnter = isEnter && e.shiftKey;
      const isPlainEnter = isEnter && !e.shiftKey;

      // Shift + Enter는 허용 (allowShiftEnter가 true인 경우)
      if (allowShiftEnter && isShiftEnter) {
        return; // 기본 동작 허용 (줄바꿈)
      }

      // Enter 키 처리
      if (isPlainEnter) {
        const ignoreOnEnter = isEmpty;
        const submitOnEnter = !isEmpty;

        // 빈 값일 때 Enter 키 무시
        if (ignoreOnEnter) {
          e.preventDefault();
          return;
        }

        // 값이 있을 때 제출
        if (submitOnEnter) {
          e.preventDefault();
          onSubmit();
        }
      }
    },
    [inputValue, onSubmit, allowShiftEnter],
  );

  return handleKeyDown;
}

