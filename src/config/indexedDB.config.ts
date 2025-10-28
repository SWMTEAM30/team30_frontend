export const DB_NAME = 'TheFirstTakeDB';
export const DB_VERSION = 4;

export const DEFAULT_RETRY_CONFIG: RetryConfig = {
  maxRetries: 5,
  baseDelayMs: 500,
  maxDelayMs: 10000,
  backoffMultiplier: 2,
};

export const STORE_NAMES = {
  CLOSET: 'closet',
  CODINATIONS: 'codinations',
  FITTING_STATUS: 'fittingStatus',
  USER_PROFILE: 'userProfile',
  USER_SETTINGS: 'userSettings',
} as const;
