import { useState, useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { Dialog, Portal, TextInput, Button } from 'react-native-paper';
import { colors } from '@/lib/theme/colors';
import type { Book } from '@/types/models';

interface Props {
  visible: boolean;
  book: Book | null;
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
      <Dialog visible={visible} onDismiss={onDismiss}>
        <Dialog.Title>책 정보 수정</Dialog.Title>
        <Dialog.Content>
          <TextInput
            label="제목"
            value={title}
            onChangeText={setTitle}
            mode="outlined"
            style={styles.input}
          />
          <TextInput
            label="저자"
            value={author}
            onChangeText={setAuthor}
            mode="outlined"
            style={styles.input}
          />
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={onDismiss}>취소</Button>
          <Button
            onPress={() => onSave(title, author)}
            loading={isLoading}
            disabled={isLoading || !title.trim()}
          >
            저장
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
}

const styles = StyleSheet.create({
  input: {
    marginBottom: 12,
    backgroundColor: colors.warmWhite,
  },
});
