import { useState, useEffect } from 'react';
import { StyleSheet, Platform } from 'react-native';
import { Dialog, Portal, TextInput, Button } from 'react-native-paper';
import { colors } from '@/lib/theme/colors';
import type { BookResponseDto } from '@/api/generated/models';

interface Props {
  visible: boolean;
  book: BookResponseDto | null;
  onSave: (title: string, author: string) => void;
  onDismiss: () => void;
  isLoading?: boolean;
}

export function BookEditDialog({
  visible,
  book,
  onSave,
  onDismiss,
  isLoading,
}: Props) {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');

  useEffect(() => {
    if (book) {
      setTitle(book.title);
      setAuthor(book.author);
    }
  }, [book]);

  return (
    <Portal>
      <Dialog visible={visible} onDismiss={onDismiss} style={styles.dialog}>
        <Dialog.Title style={styles.title}>책 정보 수정</Dialog.Title>
        <Dialog.Content>
          <TextInput
            label="제목"
            value={title}
            onChangeText={setTitle}
            mode="flat"
            underlineColor={colors.shelfHighlight}
            activeUnderlineColor={colors.shelfBrown}
            style={styles.input}
            theme={{ colors: { background: 'transparent' } }}
          />
          <TextInput
            label="저자"
            value={author}
            onChangeText={setAuthor}
            mode="flat"
            underlineColor={colors.shelfHighlight}
            activeUnderlineColor={colors.shelfBrown}
            style={styles.input}
            theme={{ colors: { background: 'transparent' } }}
          />
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={onDismiss} textColor={colors.textMuted}>취소</Button>
          <Button
            onPress={() => onSave(title, author)}
            loading={isLoading}
            disabled={isLoading || !title.trim()}
            textColor={colors.shelfBrown}
          >
            저장
          </Button>
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
    fontFamily: Platform.select({ ios: 'Georgia', android: 'serif', default: 'serif' }),
    color: colors.textPrimary,
    fontWeight: '700',
  },
  input: {
    marginBottom: 12,
    backgroundColor: 'transparent',
    fontFamily: Platform.select({ ios: 'Georgia', android: 'serif', default: 'serif' }),
  },
});
