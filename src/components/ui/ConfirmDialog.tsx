import { Dialog, Portal, Button, Text } from 'react-native-paper';
import { StyleSheet } from 'react-native';
import { colors } from '@/lib/theme/colors';

interface Props {
  visible: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  onConfirm: () => void;
  onDismiss: () => void;
}

export function ConfirmDialog({
  visible,
  title,
  message,
  confirmLabel = '확인',
  onConfirm,
  onDismiss,
}: Props) {
  return (
    <Portal>
      <Dialog visible={visible} onDismiss={onDismiss} style={styles.dialog}>
        <Dialog.Title style={styles.title}>{title}</Dialog.Title>
        <Dialog.Content>
          <Text style={styles.content}>{message}</Text>
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={onDismiss} textColor={colors.textMuted}>취소</Button>
          <Button onPress={onConfirm} textColor={colors.shelfBrown}>{confirmLabel}</Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
}

const styles = StyleSheet.create({
  dialog: {
    backgroundColor: colors.paper,
    borderRadius: 2,
    borderWidth: 1,
    borderColor: '#D7CCC8',
  },
  title: {

    color: colors.textPrimary,
    fontWeight: '700',
  },
  content: {

    color: colors.textSecondary,
    fontSize: 16,
  },
});
