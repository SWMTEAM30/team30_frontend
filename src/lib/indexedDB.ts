import { DEFAULT_RETRY_CONFIG, DB_NAME, DB_VERSION, STORE_NAMES } from '@/config/indexedDB.config';

interface RetryConfig {
  maxRetries: number; // 최대 재시도 횟수
  baseDelayMs: number; // 기본 지연 시간 (ms)
  maxDelayMs: number; // 최대 지연 시간 (ms)
  backoffMultiplier: number; // 지수 백오프 배수
}

let globalRetryConfig: RetryConfig = { ...DEFAULT_RETRY_CONFIG };

let dbInstance: IDBDatabase | null = null;

const setRetryConfig = (config: Partial<RetryConfig>) => {
  globalRetryConfig = { ...globalRetryConfig, ...config };
};

const getRetryConfig = (): RetryConfig => {
  return { ...globalRetryConfig };
};

const isIndexedDBSupported = (): boolean => {
  return typeof window !== 'undefined' && 'indexedDB' in window;
};

const initDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    if (dbInstance) {
      resolve(dbInstance);
      return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => {
      console.error('IndexedDB 열기 실패:', request.error);
      reject(request.error);
    };

    request.onsuccess = () => {
      dbInstance = request.result;
      resolve(dbInstance);
    };

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      const oldVersion = event.oldVersion;
      const newVersion = event.newVersion;

      // 옷장 데이터 저장소
      if (!db.objectStoreNames.contains(STORE_NAMES.CLOSET)) {
        const closetStore = db.createObjectStore(STORE_NAMES.CLOSET, { keyPath: 'id' });
        //closetStore.createIndex('name', 'name', { unique: false });
      }

      // 코디네이션 데이터 저장소
      if (!db.objectStoreNames.contains(STORE_NAMES.CODINATIONS)) {
        const codinationStore = db.createObjectStore(STORE_NAMES.CODINATIONS, { keyPath: 'id' });
        //codinationStore.createIndex('createdAt', 'createdAt', { unique: false });
      }

      // 피팅 상태 데이터 저장소
      if (!db.objectStoreNames.contains(STORE_NAMES.FITTING_STATUS)) {
        db.createObjectStore(STORE_NAMES.FITTING_STATUS, { keyPath: 'codinationId' });
      }

      // 사용자 프로필 데이터 저장소
      if (!db.objectStoreNames.contains(STORE_NAMES.USER_PROFILE)) {
        db.createObjectStore(STORE_NAMES.USER_PROFILE, { keyPath: 'userId' });
      }
    };
  });
};

export const saveToIndexedDB = async <T>(
  storeName: string,
  data: T,
  retryConfig?: Partial<RetryConfig>,
): Promise<void> => {
  if (!isIndexedDBSupported()) {
    throw new Error('IndexedDB가 지원되지 않는 브라우저입니다.');
  }

  const config = { ...globalRetryConfig, ...retryConfig };

  // 데이터 유효성 검사
  if (!data || typeof data !== 'object') {
    throw new Error('저장할 데이터가 유효하지 않습니다.');
  }

  // FITTING_STATUS 스토어의 경우 id 필드 검증
  if (storeName === STORE_NAMES.FITTING_STATUS) {
    const fittingData = data as any;
    if (!fittingData.codinationId || fittingData.codinationId.trim() === '') {
      throw new Error('FITTING_STATUS 저장 시 id가 필요합니다.');
    }
  }

  // CLOSET, CODINATIONS 스토어의 경우 id 필드 검증
  if (storeName === STORE_NAMES.CLOSET || storeName === STORE_NAMES.CODINATIONS) {
    const storeData = data as any;
    if (!storeData.id || storeData.id.trim() === '') {
      throw new Error(`${storeName} 저장 시 id가 필요합니다.`);
    }
  }

  if (storeName === STORE_NAMES.USER_PROFILE) {
    const storeData = data as any;
    if (!storeData.userId || storeData.userId.trim() === '') {
      throw new Error(`${storeName} 저장 시 id가 필요합니다.`);
    }
  }

  for (let attempt = 0; attempt < config.maxRetries; attempt++) {
    try {
      const db = await initDB();
      const transaction = db.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);

      await new Promise<void>((resolve, reject) => {
        console.log(data);
        const request = store.put(data);
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      });

      return;
    } catch (error) {
      console.error(`IndexedDB 저장 실패 (시도 ${attempt + 1}/${config.maxRetries}, ${storeName}):`, error);
      if (attempt < config.maxRetries - 1) {
        const delay = Math.min(config.baseDelayMs * Math.pow(config.backoffMultiplier, attempt), config.maxDelayMs);
        await new Promise((r) => setTimeout(r, delay));
        continue;
      }

      throw error;
    }
  }
};

export const loadFromIndexedDB = async <T>(
  storeName: string,
  key?: string,
  retryConfig?: Partial<RetryConfig>,
): Promise<T | null> => {
  if (!isIndexedDBSupported()) {
    throw new Error('IndexedDB가 지원되지 않는 브라우저입니다.');
  }

  const config = { ...globalRetryConfig, ...retryConfig };

  for (let attempt = 0; attempt < config.maxRetries; attempt++) {
    try {
      const db = await initDB();
      const transaction = db.transaction([storeName], 'readonly');
      const store = transaction.objectStore(storeName);

      return await new Promise<T | null>((resolve, reject) => {
        const request = key ? store.get(key) : store.getAll();
        request.onsuccess = () => resolve(request.result || null);
        request.onerror = () => reject(request.error);
      });
    } catch (error) {
      console.error(`IndexedDB 불러오기 실패 (시도 ${attempt + 1}/${config.maxRetries}, ${storeName}):`, error);
      if (attempt < config.maxRetries - 1) {
        const delay = Math.min(config.baseDelayMs * Math.pow(config.backoffMultiplier, attempt), config.maxDelayMs);
        await new Promise((r) => setTimeout(r, delay));
        continue;
      }
      return null;
    }
  }
  return null;
};

export const deleteFromIndexedDB = async (storeName: string, key: string): Promise<void> => {
  if (!isIndexedDBSupported()) {
    throw new Error('IndexedDB가 지원되지 않는 브라우저입니다.');
  }

  try {
    const db = await initDB();
    const transaction = db.transaction([storeName], 'readwrite');
    const store = transaction.objectStore(storeName);

    await new Promise<void>((resolve, reject) => {
      const request = store.delete(key);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    console.error(`IndexedDB 삭제 실패 (${storeName}):`, error);
    throw error;
  }
};

export const clearIndexedDB = async (storeName: string): Promise<void> => {
  if (!isIndexedDBSupported()) {
    throw new Error('IndexedDB가 지원되지 않는 브라우저입니다.');
  }

  try {
    const db = await initDB();
    const transaction = db.transaction([storeName], 'readwrite');
    const store = transaction.objectStore(storeName);

    await new Promise<void>((resolve, reject) => {
      const request = store.clear();
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    console.error(`IndexedDB 전체 삭제 실패 (${storeName}):`, error);
    throw error;
  }
};

// ===== 재시도 설정 프리셋 함수들 =====

// 개발 환경용 설정 (빠른 재시도)
export const setDevelopmentRetryConfig = () => {
  setRetryConfig({
    maxRetries: 3,
    baseDelayMs: 200,
    maxDelayMs: 2000,
    backoffMultiplier: 1.5,
  });
};

// 프로덕션 환경용 설정 (안정적인 재시도)
export const setProductionRetryConfig = () => {
  setRetryConfig({
    maxRetries: 5,
    baseDelayMs: 500,
    maxDelayMs: 10000,
    backoffMultiplier: 2,
  });
};

// 느린 네트워크용 설정 (더 많은 재시도)
export const setSlowNetworkRetryConfig = () => {
  setRetryConfig({
    maxRetries: 8,
    baseDelayMs: 1000,
    maxDelayMs: 15000,
    backoffMultiplier: 1.8,
  });
};

// 빠른 네트워크용 설정 (적은 재시도)
export const setFastNetworkRetryConfig = () => {
  setRetryConfig({
    maxRetries: 3,
    baseDelayMs: 100,
    maxDelayMs: 1000,
    backoffMultiplier: 2.5,
  });
};

// 사용자 정의 설정 예시
export const setCustomRetryConfig = (config: Partial<RetryConfig>) => {
  setRetryConfig(config);
};

// 환경별 자동 설정
export const initializeRetryConfig = () => {
  const isDevelopment = process.env.NODE_ENV === 'development';
  const isSlowNetwork =
    navigator.connection?.effectiveType === 'slow-2g' || navigator.connection?.effectiveType === '2g';

  if (isDevelopment) {
    setDevelopmentRetryConfig();
  } else if (isSlowNetwork) {
    setSlowNetworkRetryConfig();
  } else {
    setProductionRetryConfig();
  }

  console.log('IndexedDB 재시도 설정이 초기화되었습니다.');
};

// ===== User 전용 함수들 =====

export const saveUserProfile = async (user: User): Promise<void> => {
  if (!user.userId) {
    throw new Error('사용자 ID가 필요합니다.');
  }

  await saveToIndexedDB(STORE_NAMES.USER_PROFILE, user);
};

export const loadUserProfile = async (userId: string): Promise<User | null> => {
  const Data = await loadFromIndexedDB<any>(STORE_NAMES.USER_PROFILE, userId);
  if (!Data) return null;
  return Data;
};

export const deleteUserProfile = async (userId: string): Promise<void> => {
  await deleteFromIndexedDB(STORE_NAMES.USER_PROFILE, userId);
};
