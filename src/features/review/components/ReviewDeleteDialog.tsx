import { ConfirmDialog } from '@/components/ui/ConfirmDialog';

interface Props {
  visible: boolean;
  reviewTitle: string;
  onConfirm: () => void;
  onDismiss: () => void;
}

export function ReviewDeleteDialog({
  visible,
  reviewTitle,
  onConfirm,
  onDismiss,
}: Props) {
  return (
    <ConfirmDialog
      visible={visible}
      title="독후감 삭제"
      message={`"${reviewTitle}"을(를) 삭제하시겠습니까?`}
      confirmLabel="삭제"
      onConfirm={onConfirm}
      onDismiss={onDismiss}
    />
  );
}
