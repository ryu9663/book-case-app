import { useRef, useState, useEffect } from 'react';
import { View, Pressable, StyleSheet, useWindowDimensions } from 'react-native';
import { Portal, TextInput, Button, Text } from 'react-native-paper';
import { BlurView } from 'expo-blur';
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

  // refs로 텍스트 값 추적 (한글 IME 조합 깨짐 방지)
  const titleRef = useRef('');
  const authorRef = useRef('');
  // book 변경 시 defaultValue 갱신을 위한 key
  const [formKey, setFormKey] = useState(0);

  useEffect(() => {
    if (book) {
      titleRef.current = book.title ?? '';
      authorRef.current = book.author ?? '';
      setFormKey((prev) => prev + 1);
    }
  }, [book]);

  const handleSave = () => {
    const title = titleRef.current.trim();
    const author = authorRef.current.trim();
    if (!title) return;
    onSave(title, author);
  };

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
          <View key={formKey} style={[styles.modal, { width: modalWidth }]}>
            <Text style={styles.title}>책 정보 수정</Text>

            <TextInput
              testID="edit-title"
              label="제목"
              defaultValue={titleRef.current}
              onChangeText={(text) => {
                titleRef.current = text;
              }}
              mode="outlined"
              outlineColor={'#8CEE2B'}
              activeOutlineColor={'#8CEE2B'}
              style={styles.input}
            />
            <TextInput
              testID="edit-author"
              label="저자"
              defaultValue={authorRef.current}
              onChangeText={(text) => {
                authorRef.current = text;
              }}
              mode="outlined"
              outlineColor={'#8CEE2B'}
              activeOutlineColor={'#8CEE2B'}
              style={styles.input}
            />

            <View style={styles.actionRow}>
              <Button
                mode="contained"
                onPress={handleSave}
                loading={isLoading}
                disabled={isLoading}
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
