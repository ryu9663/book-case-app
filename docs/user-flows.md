# User Flows

## 라우팅 구조

```
/
├── index.tsx → /(auth)/login 리다이렉트
├── (auth)/
│   ├── login.tsx → LoginScreen
│   └── register.tsx → RegisterScreen
└── (main)/
    ├── index.tsx → BookshelfScreen
    ├── add-book.tsx → AddBookScreen
    ├── book/[id].tsx → BookDetailScreen
    └── review/
        ├── create.tsx → ReviewFormScreen (생성)
        └── [id].tsx → ReviewFormScreen (수정)
```

## 인증 흐름

- `AuthGate` (`_layout.tsx`): user 유무에 따라 `(auth)` ↔ `(main)` 자동 리다이렉트
- `login()`: 토큰 저장 → JWT decode로 user 추출 → storage 저장 → setUser
- `logout()`: storage.clear() → setUser(null) → AuthGate가 로그인으로 이동
- 회원가입: `POST /users` → 자동 로그인 (`POST /auth/login`)

## 메인 흐름

```
BookshelfScreen (책장)
├── 책 클릭 → BookDetailScreen
│   ├── 수정: BookEditDialog → PATCH /books/{id}
│   ├── 삭제: ConfirmDialog → DELETE /books/{id} → router.back()
│   └── 독후감 추가 → ReviewFormScreen (create)
│       └── POST /reviews/{bookId} → router.back()
│   └── 독후감 수정 → ReviewFormScreen (update)
│       └── PATCH /reviews/{bookId}/{id} → router.back()
├── "+" 버튼 → AddBookScreen
│   ├── 검색: GET /books/search?title=...
│   ├── 결과 선택 or 직접 입력 → POST /books → router.back()
│   └── 검색 결과 없으면 수동 입력 모드
└── 로그아웃 → storage.clear() → /(auth)/login
```

## 쿼리 무효화 맵

| 액션 | invalidate 대상 |
|------|----------------|
| 책 추가/삭제 | `getBookControllerFindAllQueryKey()` |
| 책 수정 | `FindAll` + `FindOne(bookId)` |
| 독후감 생성/수정 | `getReviewControllerFindAllQueryKey(bookId)` + (수정 시) `FindOne` |

## 토큰 갱신

- `mutator.ts`의 401 interceptor가 자동 처리
- refresh promise 공유로 동시 요청 시 중복 갱신 방지
- 갱신 실패 시 Alert + `/(auth)/login`으로 이동
