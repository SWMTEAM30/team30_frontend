# Cypress Mocking Test 구현 계획

## 📊 현재 상황 분석

### ✅ 완료된 테스트
- **Vitest Unit Tests**: lib, hooks에 대한 단위 테스트 완료 (87개 테스트 통과)
- **테스트 커버리지**: 유틸리티 함수, 훅, 메시지 처리 로직

### 🎯 Cypress Mocking Test가 필요한 이유

1. **복잡한 사용자 플로우**
   - 채팅 → AI 응답 → 제품 추천 → 코디네이션 저장
   - 로그인 → 옷장 관리 → 피팅 시뮬레이션
   - SSE 스트리밍 메시지 처리

2. **다양한 API 엔드포인트**
   - Auth API: `/api/auth/*` (로그인, 토큰 갱신)
   - Chat API: `/api/chat/*` (메시지 전송, 수신, 스트리밍)
   - Cloth API: `/api/flow/*` (옷 정보)
   - Fitting API: `/api/fitting/*` (가상 피팅)

3. **통합 테스트 필요성**
   - 컴포넌트 간 상호작용
   - 상태 관리 (Jotai + TanStack Query)
   - IndexedDB 저장/로드

## 🚀 구현 계획

### Phase 1: Cypress 설정 및 기본 인프라 (1-2일)

#### 1.1 Cypress 설치 및 설정
```bash
pnpm add -D -w cypress @cypress/react @cypress/webpack-dev-server
```

#### 1.2 설정 파일 생성
- `cypress.config.ts` - Cypress 설정
- `cypress/support/commands.ts` - 커스텀 커맨드
- `cypress/support/e2e.ts` - E2E 테스트 설정
- `cypress/support/component.ts` - 컴포넌트 테스트 설정

#### 1.3 환경 변수 설정
- `.env.cypress` - 테스트용 환경 변수
- API mocking 설정

### Phase 2: API Mocking 인프라 구축 (2-3일)

#### 2.1 API Interceptor 설정
- `cypress/support/interceptors.ts` - API 요청 인터셉터
- 주요 엔드포인트별 mock 응답 정의

#### 2.2 Mock 데이터 생성
```typescript
// cypress/fixtures/mocks/
- auth-mocks.ts        // 인증 관련 mock
- chat-mocks.ts        // 채팅 관련 mock
- cloth-mocks.ts       // 옷 정보 mock
- fitting-mocks.ts     // 피팅 mock
```

#### 2.3 SSE 스트리밍 Mock
- EventSource mocking
- 스트리밍 메시지 시뮬레이션

### Phase 3: 핵심 기능 E2E 테스트 작성 (3-4일)

#### 3.1 인증 플로우 테스트
- `cypress/e2e/auth/`
  - `login.cy.ts` - 로그인 플로우
  - `logout.cy.ts` - 로그아웃 플로우
  - `token-refresh.cy.ts` - 토큰 갱신

#### 3.2 채팅 플로우 테스트
- `cypress/e2e/chat/`
  - `chat-send.cy.ts` - 메시지 전송
  - `chat-stream.cy.ts` - 스트리밍 응답
  - `chat-history.cy.ts` - 채팅 기록 조회
  - `product-recommendation.cy.ts` - 제품 추천

#### 3.3 옷장 관리 테스트
- `cypress/e2e/closet/`
  - `closet-add.cy.ts` - 옷 추가
  - `closet-remove.cy.ts` - 옷 제거
  - `closet-save.cy.ts` - IndexedDB 저장

#### 3.4 코디네이션 테스트
- `cypress/e2e/codination/`
  - `codination-create.cy.ts` - 코디네이션 생성
  - `codination-save.cy.ts` - 코디네이션 저장
  - `codination-panel.cy.ts` - 패널 전환

#### 3.5 피팅 테스트
- `cypress/e2e/fitting/`
  - `fitting-upload.cy.ts` - 이미지 업로드
  - `fitting-tryon.cy.ts` - 가상 피팅 실행

### Phase 4: 컴포넌트 테스트 (선택사항, 2-3일)

#### 4.1 주요 컴포넌트 테스트
- `cypress/component/`
  - `ChatInputBox.cy.tsx` - 메시지 입력
  - `MessageBalloon.cy.tsx` - 메시지 표시
  - `ClosetPanel.cy.tsx` - 옷장 패널
  - `CodinationCard.cy.tsx` - 코디네이션 카드

## 📋 구현 우선순위

### 🔴 High Priority (필수)
1. **인증 플로우** - 로그인/로그아웃이 모든 기능의 기반
2. **채팅 메시지 전송** - 핵심 기능
3. **API Mocking 인프라** - 모든 테스트의 기반

### 🟡 Medium Priority (권장)
4. **채팅 스트리밍** - 실시간 기능
5. **옷장 관리** - 사용자 데이터 관리
6. **코디네이션 저장** - 주요 기능

### 🟢 Low Priority (선택)
7. **컴포넌트 테스트** - Vitest로 대체 가능
8. **피팅 기능** - 부가 기능

## 🛠 기술 스택

- **Cypress**: 13.x (최신 버전)
- **@cypress/react**: React 컴포넌트 테스트
- **TypeScript**: 타입 안정성
- **Next.js 15**: App Router 지원

## 📝 예상 결과

### 테스트 커버리지
- **E2E 테스트**: ~15-20개 테스트 시나리오
- **컴포넌트 테스트**: ~10-15개 주요 컴포넌트
- **API Mocking**: 모든 주요 엔드포인트 커버

### 예상 소요 시간
- **Phase 1-2**: 3-5일 (설정 및 인프라)
- **Phase 3**: 3-4일 (E2E 테스트)
- **Phase 4**: 2-3일 (컴포넌트 테스트, 선택)
- **총계**: 8-12일 (Phase 4 제외 시 6-9일)

## 🔄 대안: MSW + Vitest (더 빠른 대안)

Cypress 대신 **MSW (Mock Service Worker)**를 사용하여 Vitest에서 API mocking 테스트를 구현할 수도 있습니다.

### 장점
- ✅ 이미 Vitest 설정 완료
- ✅ 더 빠른 실행 속도
- ✅ 단위/통합 테스트에 적합
- ✅ 설정이 더 간단

### 단점
- ❌ 실제 브라우저 환경 아님
- ❌ E2E 테스트는 부족

## 💡 추천 방안

**단계적 접근**:
1. **1단계**: MSW + Vitest로 API mocking 통합 테스트 구현 (빠르고 효과적)
2. **2단계**: 필요 시 Cypress로 E2E 테스트 추가 (핵심 플로우만)

이렇게 하면:
- 빠른 피드백 (MSW)
- 실제 브라우저 검증 (Cypress, 선택)
- 비용 효율적

## 📚 참고 자료

- [Cypress 공식 문서](https://docs.cypress.io/)
- [Cypress API Mocking](https://docs.cypress.io/guides/guides/network-requests)
- [MSW 공식 문서](https://mswjs.io/)
- [Next.js Testing](https://nextjs.org/docs/app/building-your-application/testing)


