import { EmptyState } from '@/components/ui/EmptyState';

interface Props {
  onAddBook: () => void;
}

export function EmptyShelf({ onAddBook }: Props) {
  return (
    <EmptyState
      icon="📚"
      title="책장이 비어있어요"
      description="ISBN으로 첫 번째 책을 추가해보세요!"
      actionLabel="책 추가하기"
      onAction={onAddBook}
    />
  );
}
