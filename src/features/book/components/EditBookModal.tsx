import { useState, useEffect } from 'react';
import { View, Pressable, StyleSheet, useWindowDimensions } from 'react-native';
import { Portal, TextInput, Button, Text } from 'react-native-paper';
import { BlurView } from 'expo-blur';
import { colors } from '@/lib/theme/colors';
import { styles } from './EditBookModal.styles';
import type { BookResponseDto } from '@/api/generated/models';

interface Props {
  visible: boolean;
  book: BookResponseDto | null;
  onSave: (title: string, author: string) => void;
  onDismiss: () => void;
  isLoading?: boolean;
}

export function EditBookModal({
  visible,
  book,
  onSave,
  onDismiss,
  isLoading,
}: Props) {
  const { width: screenWidth } = useWindowDimensions();
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');

  useEffect(() => {
    if (book) {
      setTitle(book.title ?? '');
      setAuthor(book.author ?? '');
    }
  }, [book]);

  const modalWidth = screenWidth * 0.85;

  if (!visible) return null;

  return (
    <Portal>
      <View style={StyleSheet.absoluteFill}>
        {/* Blur + Dim backdrop */}
        <Pressable style={StyleSheet.absoluteFill} onPress={onDismiss}>
          <BlurView
            intensity={20}
            tint="dark"
            experimentalBlurMethod="dimezisBlurView"
            style={StyleSheet.absoluteFill}
          />
          <View style={styles.dimOverlay} />
        </Pressable>

        {/* Modal Card */}
        <View style={styles.modalContainer} pointerEvents="box-none">
          <View style={[styles.modal, { width: modalWidth }]}>
            <Text style={styles.title}>책 정보 수정</Text>

            <TextInput
              testID="edit-title"
              label="제목"
              value={title}
              onChangeText={setTitle}
              mode="outlined"
              outlineColor={'#8CEE2B'}
              activeOutlineColor={'#8CEE2B'}
              style={styles.input}
            />
            <TextInput
              testID="edit-author"
              label="저자"
              value={author}
              onChangeText={setAuthor}
              mode="outlined"
              outlineColor={'#8CEE2B'}
              activeOutlineColor={'#8CEE2B'}
              style={styles.input}
            />

            <View style={styles.actionRow}>
              <Button
                mode="contained"
                onPress={() => onSave(title, author)}
                loading={isLoading}
                disabled={isLoading || !title.trim()}
                style={styles.saveButton}
                labelStyle={styles.saveButtonLabel}
              >
                저장
              </Button>
              <Button
                mode="text"
                onPress={onDismiss}
                style={styles.cancelButton}
                labelStyle={styles.cancelButtonLabel}
              >
                취소
              </Button>
            </View>
          </View>
        </View>
      </View>
    </Portal>
  );
}
