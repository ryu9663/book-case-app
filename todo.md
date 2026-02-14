# TODO

## AddBookScreen.tsx

- [x] 검색 refetch 타이밍 문제 (L55-57)
  - `setTimeout`으로 state 업데이트와 refetch 타이밍을 맞추고 있지만, `submittedTitle`이 아직 반영 안 된 상태에서 `refetch()`가 호출될 수 있음
  - 수정 방안: `submittedTitle` 대신 `searchTitle`을 직접 params로 쓰면서 `enabled`로 제어하거나, `queryClient`로 직접 fetch

- [ ] `handleSelect`와 `handleManualSubmit` 중복 (L60-77, L87-105)
  - `mutateAsync` → `invalidateQueries` → `setSnackbar` → `router.back()` 흐름이 거의 동일
  - 공통 함수로 추출

## BookInfoCard.tsx

- [x] `View` import 미사용 (L1)
  - JSX에서 사용하지 않는 `View` import 제거

## 테스트 코드

- [ ] AddBookScreen 테스트 작성
  - 검색 기능 (submittedTitle로 enabled 제어)
  - 검색 결과 선택 시 책 등록
  - 검색 결과 없을 때 수동 입력 모드 전환
  - 수동 입력으로 책 등록
  - 에러 핸들링

- [ ] BookDetailScreen 테스트 작성
  - 책 정보 렌더링 (제목, 저자, 출판사, 썸네일)
  - 수정/삭제 기능
  - 로딩/에러 상태 처리
