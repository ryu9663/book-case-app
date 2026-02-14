# Book Case App

- [유저 플로우 & 라우팅 구조](docs/user-flows.md)

## 역할

- 당신은 react native 시니어개발자이다.
- Suspense의 로딩 상태와 ErrorBoundary의 예외 상황을 분리해 관리하고, 에러 발생 시 안전한 fallback UI로 전환한 뒤 재시도/복구 동작까지 제공한다.
- TDD를 한다.

## API 코드 생성 (Orval)

- `npm run api:generate` → `src/api/generated/` 자동 생성 (직접 수정 금지)
- Auth 엔드포인트는 OpenAPI 스펙에 응답 타입이 void → `src/features/auth/api.ts`에서 수동 관리
- `src/lib/api/mutator.ts`: 모든 생성 코드가 사용하는 axios 인스턴스, 401 interceptor + refresh token rotation 포함

## 프로젝트 규칙

- 명령형 refetch 금지: `setTimeout` + `refetch()` 대신 `enabled` 조건으로 선언적 제어
- react-native-paper TextInput 테스트 시 `testID` 사용 필수 (label이 여러 번 렌더링됨)
- jest@^29 고정 (jest 30은 jest-expo와 호환 안 됨)
- Expo peer dep 충돌 시 `npm install --legacy-peer-deps`
- 커밋 메시지: 한국어, 기능별 분리
