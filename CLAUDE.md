# Book Case App

독서 기록 앱 (React Native/Expo + NestJS)

## 문서

- [유저 플로우 & 라우팅](docs/user-flows.md)

## 역할

- React Native 시니어 개발자로 동작한다.
- TDD를 한다.
- 에러 발생 시 ErrorBoundary fallback UI + 재시도를 제공한다.

## 프로젝트 구조

```
src/
├── app/                  # Expo Router (파일 기반 라우팅)
│   ├── _layout.tsx       # Root: QueryClient, PaperProvider, AuthGate
│   ├── (auth)/           # 로그인/회원가입
│   └── (main)/           # 탭: bookshelf, calendar, settings
├── features/             # 도메인별 코드
│   ├── auth/             # 수동 API + AuthContext + JWT 디코딩
│   ├── book/             # 책 상세, 추가
│   ├── bookshelf/        # 책장 그리드
│   ├── calendar/         # 독서 캘린더 (hooks, utils, types 분리)
│   └── review/           # 독후감 CRUD
├── api/generated/        # Orval 자동 생성 (직접 수정 금지)
├── components/ui/        # 공통 UI (LoadingScreen, ErrorScreen, EmptyState, ConfirmDialog)
└── lib/
    ├── api/mutator.ts    # Axios 인스턴스 + 401 interceptor + refresh rotation
    ├── theme/            # MD3 테마, 색상 시스템, 기본 폰트: Gowun Dodum (@expo-google-fonts/gowun-dodum)
    └── utils/storage.ts  # AsyncStorage 래퍼 (토큰, 유저)
```

## API 코드 생성 (Orval)

- `npm run api:generate` → `src/api/generated/` 자동 생성 (직접 수정 금지, .gitignore 포함)
- `orval.config.ts`: tags-split 모드, react-query 클라이언트
- **Auth는 수동 관리** (`src/features/auth/api.ts`): OpenAPI 스펙이 auth 응답을 void로 정의하여 생성 코드 사용 불가
- `src/lib/api/mutator.ts`: 모든 API 요청의 axios 인스턴스. 401 시 refresh token rotation + shared promise로 중복 갱신 방지

## 규칙

- **선언적 쿼리**: `setTimeout` + `refetch()` 금지 → `enabled` 조건으로 제어
- **테스트**: react-native-paper TextInput은 `testID` 필수 (label 중복 렌더링). jest@^29 고정 (jest 30은 jest-expo 호환 불가)
- **의존성**: Expo peer dep 충돌 시 `npm install --legacy-peer-deps`
- **이미지 import**: 상대 경로 금지 → `@assets/*` 절대 경로 사용 (e.g. `require('@assets/login/login-image.webp')`)
- **폰트**: 기본 폰트 Gowun Dodum (`@expo-google-fonts/gowun-dodum`). `_layout.tsx`에서 로드, `theme/index.ts`에서 `configureFonts`로 전역 적용
- **커밋**: 한국어, 기능별 분리
