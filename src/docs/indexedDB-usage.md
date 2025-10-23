# IndexedDB 재시도 설정 사용법

## 기본 사용법

### 1. 전역 설정 변경
```typescript
import { setRetryConfig } from '@/lib/indexedDB';

// 개발 환경용 (빠른 재시도)
setRetryConfig({
  maxRetries: 2,
  baseDelayMs: 100,
  maxDelayMs: 1000,
  backoffMultiplier: 1.5,
});
```

### 2. 개별 훅에서 설정
```typescript
import { useIndexedDB } from '@/hooks/useIndexedDB';

const { data, saveData } = useIndexedDB({
  storeName: 'CLOSET',
  storageKey: 'my-closet',
  initialValue: [],
  retryConfig: {
    maxRetries: 5,        // 5번 재시도
    baseDelayMs: 200,     // 200ms부터 시작
    maxDelayMs: 3000,     // 최대 3초 대기
    backoffMultiplier: 2, // 2배씩 증가
  },
});
```

## 설정 옵션 설명

### RetryConfig 인터페이스
```typescript
interface RetryConfig {
  maxRetries: number;        // 최대 재시도 횟수 (기본값: 5)
  baseDelayMs: number;       // 기본 지연 시간 (기본값: 500ms)
  maxDelayMs: number;        // 최대 지연 시간 (기본값: 10000ms)
  backoffMultiplier: number; // 지수 백오프 배수 (기본값: 2)
}
```

### 지연 시간 계산 (프로덕션 기준)
```
시도 1: baseDelayMs * (backoffMultiplier ^ 0) = 500ms
시도 2: baseDelayMs * (backoffMultiplier ^ 1) = 1000ms
시도 3: baseDelayMs * (backoffMultiplier ^ 2) = 2000ms
시도 4: baseDelayMs * (backoffMultiplier ^ 3) = 4000ms
시도 5: baseDelayMs * (backoffMultiplier ^ 4) = 8000ms
시도 6: baseDelayMs * (backoffMultiplier ^ 5) = 10000ms (최대값)
```

## 환경별 권장 설정

### 개발 환경
```typescript
setRetryConfig({
  maxRetries: 3,
  baseDelayMs: 200,
  maxDelayMs: 2000,
  backoffMultiplier: 1.5,
});
```

### 프로덕션 환경 (기본값)
```typescript
setRetryConfig({
  maxRetries: 5,
  baseDelayMs: 500,
  maxDelayMs: 10000,
  backoffMultiplier: 2,
});
```

### 느린 네트워크
```typescript
setRetryConfig({
  maxRetries: 8,
  baseDelayMs: 1000,
  maxDelayMs: 15000,
  backoffMultiplier: 1.8,
});
```

### 빠른 네트워크
```typescript
setRetryConfig({
  maxRetries: 3,
  baseDelayMs: 100,
  maxDelayMs: 1000,
  backoffMultiplier: 2.5,
});
```

## 자동 환경 감지

`src/config/indexedDB.ts`의 `initializeRetryConfig()` 함수가 자동으로 환경을 감지하여 적절한 설정을 적용합니다:

- **개발 환경**: 빠른 재시도 설정
- **느린 네트워크**: 더 많은 재시도와 긴 지연
- **일반 환경**: 안정적인 프로덕션 설정

## 현재 설정 확인

```typescript
import { getRetryConfig } from '@/lib/indexedDB';

const currentConfig = getRetryConfig();
console.log('현재 재시도 설정:', currentConfig);
```

## 실제 사용 예시

### 옷장 데이터 저장 (빠른 재시도)
```typescript
const { saveData } = useIndexedDB({
  storeName: 'CLOSET',
  storageKey: 'closet-data',
  initialValue: [],
  retryConfig: {
    maxRetries: 2,
    baseDelayMs: 100,
    maxDelayMs: 500,
    backoffMultiplier: 2,
  },
});
```

### 중요한 데이터 저장 (안정적인 재시도)
```typescript
const { saveData } = useIndexedDB({
  storeName: 'CODINATIONS',
  storageKey: 'codinations-data',
  initialValue: [],
  retryConfig: {
    maxRetries: 8,
    baseDelayMs: 500,
    maxDelayMs: 10000,
    backoffMultiplier: 1.5,
  },
});
```
