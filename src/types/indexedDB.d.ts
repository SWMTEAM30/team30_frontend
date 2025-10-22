// Navigator Connection API 타입 확장
declare global {
  interface Navigator {
    connection?: {
      effectiveType?: 'slow-2g' | '2g' | '3g' | '4g';
      downlink?: number;
      rtt?: number;
    };
  }
}

// 재시도 설정 타입
interface RetryConfig {
  maxRetries: number; // 최대 재시도 횟수
  baseDelayMs: number; // 기본 지연 시간 (ms)
  maxDelayMs: number; // 최대 지연 시간 (ms)
  backoffMultiplier: number; // 지수 백오프 배수
}

// useIndexedDB 훅 옵션 타입
interface UseIndexedDBOptions<T> {
  storeName: keyof typeof import('@/lib/indexedDB').STORE_NAMES;
  storageKey: string;
  initialValue: T;
  onError?: (error: Error) => void;
  showToast?: boolean;
  retryConfig?: Partial<RetryConfig>;
}

// IndexedDB 저장 데이터 구조 타입
interface IndexedDBStoredData<T> {
  id?: string;
  codinationId?: string;
  data: T;
  lastUpdated: string;
}

// Object Store 이름들 타입
type StoreName = 'closet' | 'codinations' | 'fittingStatus';

// IndexedDB 지원 여부 확인 함수 타입
type IndexedDBSupportChecker = () => boolean;
