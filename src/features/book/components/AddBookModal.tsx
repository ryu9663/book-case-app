import { useState, useEffect, useRef } from 'react';
import {
  View,
  ScrollView,
  Image,
  Pressable,
  StyleSheet,
  Keyboard,
  useWindowDimensions,
  TextInput as RNTextInput,
} from 'react-native';
import {
  Portal,
  TextInput,
  Button,
  Text,
  ActivityIndicator,
  TouchableRipple,
} from 'react-native-paper';
import { BlurView } from 'expo-blur';
import { useQueryClient } from '@tanstack/react-query';
import {
  useBookControllerSearch,
  useBookControllerCreate,
  getBookControllerFindAllQueryKey,
} from '@/api/generated/books/books';
import type { BookSearchResultDto } from '@/api/generated/models';
import { colors } from '@/lib/theme/colors';
import { styles } from './AddBookModal.styles';

interface AddBookModalProps {
  visible: boolean;
  onDismiss: () => void;
  onSuccess: (message: string) => void;
}

export function AddBookModal({
  visible,
  onDismiss,
  onSuccess,
}: AddBookModalProps) {
  const { width: screenWidth } = useWindowDimensions();
  const queryClient = useQueryClient();
  const createBook = useBookControllerCreate();

  // refs로 텍스트 값 추적 (한글 IME 조합 깨짐 방지)
  const searchTextRef = useRef('');
  const searchInputRef = useRef<RNTextInput>(null);
  const manualTitleRef = useRef('');
  const manualAuthorRef = useRef('');
  const manualPublisherRef = useRef('');

  const [submittedTitle, setSubmittedTitle] = useState('');
  const [error, setError] = useState('');
  const [manualMode, setManualMode] = useState(false);
  // manualMode 전환 시 defaultValue 갱신을 위한 key
  const [manualFormKey, setManualFormKey] = useState(0);

  const { data: searchResults, isFetching } = useBookControllerSearch(
    { title: submittedTitle },
    { query: { enabled: submittedTitle.length > 0 } },
  );

  useEffect(() => {
    if (!visible) {
      searchTextRef.current = '';
      searchInputRef.current?.clear();
      setSubmittedTitle('');
      setError('');
      setManualMode(false);
      manualTitleRef.current = '';
      manualAuthorRef.current = '';
      manualPublisherRef.current = '';
    }
  }, [visible]);

  const handleSearch = () => {
    const title = searchTextRef.current.trim();
    if (!title) return;
    Keyboard.dismiss();
    setError('');
    setManualMode(false);
    setSubmittedTitle(title);
  };

  const handleSelect = async (item: BookSearchResultDto) => {
    try {
      await createBook.mutateAsync({
        data: {
          title: item.title,
          author: item.authors.join(', '),
          publisher: item.publisher ?? undefined,
          thumbnail: item.thumbnail ?? undefined,
        },
      });
      await queryClient.invalidateQueries({
        queryKey: getBookControllerFindAllQueryKey(),
      });
      onSuccess('책이 추가되었습니다!');
      onDismiss();
    } catch {
      setError('책 추가에 실패했습니다.');
    }
  };

  const handleShowManualForm = () => {
    manualTitleRef.current = submittedTitle;
    manualAuthorRef.current = '';
    manualPublisherRef.current = '';
    setManualFormKey((prev) => prev + 1);
    setManualMode(true);
  };

  const handleManualSubmit = async () => {
    if (!manualTitleRef.current.trim() || !manualAuthorRef.current.trim())
      return;
    try {
      await createBook.mutateAsync({
        data: {
          title: manualTitleRef.current.trim(),
          author: manualAuthorRef.current.trim(),
          publisher: manualPublisherRef.current.trim() || undefined,
        },
      });
      await queryClient.invalidateQueries({
        queryKey: getBookControllerFindAllQueryKey(),
      });
      onSuccess('책이 추가되었습니다!');
      onDismiss();
    } catch {
      setError('책 추가에 실패했습니다.');
    }
  };

  const isTablet = screenWidth >= 768;
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
            <ScrollView
              bounces={false}
              keyboardShouldPersistTaps="handled"
              style={styles.scrollView}
            >
              {/* Header */}
              <Text style={styles.title}>새 책 등록</Text>
              <Text style={styles.subtitle}>
                제목을 검색하여 책을 추가합니다.
              </Text>

              {/* Search Input — uncontrolled (한글 IME 호환) */}
              <TextInput
                ref={searchInputRef}
                testID="search-input"
                label="책 제목"
                onChangeText={(text) => {
                  searchTextRef.current = text;
                }}
                mode="outlined"
                outlineColor={'#8CEE2B'}
                activeOutlineColor={'#8CEE2B'}
                style={styles.searchInput}
                onSubmitEditing={handleSearch}
              />

              {/* Action Buttons */}
              <View
                style={[
                  styles.actionRow,
                  isTablet && styles.actionRowHorizontal,
                ]}
              >
                <Button
                  mode="contained"
                  onPress={handleSearch}
                  disabled={isFetching}
                  style={[
                    styles.searchButton,
                    isTablet && styles.searchButtonTablet,
                  ]}
                  labelStyle={styles.searchButtonLabel}
                >
                  검색
                </Button>
                <Button
                  mode="text"
                  onPress={onDismiss}
                  style={[
                    styles.cancelButton,
                    isTablet && styles.cancelButtonTablet,
                  ]}
                  labelStyle={styles.cancelButtonLabel}
                >
                  취소
                </Button>
              </View>

              {error ? <Text style={styles.error}>{error}</Text> : null}

              {/* Search Results */}
              {isFetching ? (
                <View style={styles.centerContent}>
                  <ActivityIndicator size="large" color={colors.shelfBrown} />
                </View>
              ) : submittedTitle.length > 0 && searchResults ? (
                searchResults.length > 0 ? (
                  <View style={styles.resultList}>
                    {searchResults.map((item, index) => (
                      <TouchableRipple
                        key={index}
                        onPress={() => handleSelect(item)}
                        disabled={createBook.isPending}
                        style={styles.resultItem}
                      >
                        <View style={styles.resultRow}>
                          {item.thumbnail ? (
                            <Image
                              source={{ uri: item.thumbnail }}
                              style={styles.thumbnail}
                            />
                          ) : (
                            <View
                              style={[styles.thumbnail, styles.noThumbnail]}
                            >
                              <Text style={styles.noThumbnailText}>
                                No Image
                              </Text>
                            </View>
                          )}
                          <View style={styles.resultInfo}>
                            <Text style={styles.resultTitle} numberOfLines={2}>
                              {item.title}
                            </Text>
                            <Text style={styles.resultAuthor} numberOfLines={1}>
                              {item.authors.join(', ')}
                            </Text>
                            {item.publisher ? (
                              <Text
                                style={styles.resultPublisher}
                                numberOfLines={1}
                              >
                                {item.publisher}
                              </Text>
                            ) : null}
                          </View>
                        </View>
                      </TouchableRipple>
                    ))}
                  </View>
                ) : manualMode ? (
                  <View key={manualFormKey} style={styles.manualForm}>
                    <Text style={styles.manualFormTitle}>직접 입력</Text>
                    <TextInput
                      testID="manual-title"
                      label="제목"
                      defaultValue={submittedTitle}
                      onChangeText={(text) => {
                        manualTitleRef.current = text;
                      }}
                      mode="outlined"
                      outlineColor={colors.accentGreen}
                      activeOutlineColor={colors.accentGreen}
                      style={styles.manualInput}
                    />
                    <TextInput
                      testID="manual-author"
                      label="저자"
                      onChangeText={(text) => {
                        manualAuthorRef.current = text;
                      }}
                      mode="outlined"
                      outlineColor={colors.accentGreen}
                      activeOutlineColor={colors.accentGreen}
                      style={styles.manualInput}
                    />
                    <TextInput
                      testID="manual-publisher"
                      label="출판사 (선택)"
                      onChangeText={(text) => {
                        manualPublisherRef.current = text;
                      }}
                      mode="outlined"
                      outlineColor={colors.accentGreen}
                      activeOutlineColor={colors.accentGreen}
                      style={styles.manualInput}
                    />
                    <Button
                      mode="contained"
                      onPress={handleManualSubmit}
                      loading={createBook.isPending}
                      disabled={createBook.isPending}
                      style={styles.searchButton}
                      labelStyle={styles.searchButtonLabel}
                    >
                      책장에 꽂기
                    </Button>
                  </View>
                ) : (
                  <View style={styles.centerContent}>
                    <Text style={styles.emptyText}>검색 결과가 없습니다.</Text>
                    <Button
                      mode="outlined"
                      onPress={handleShowManualForm}
                      style={styles.manualButton}
                      labelStyle={styles.manualButtonLabel}
                    >
                      직접 입력하기
                    </Button>
                  </View>
                )
              ) : null}

              {/* Loading Overlay */}
              {createBook.isPending ? (
                <View style={styles.overlay}>
                  <ActivityIndicator size="large" color={colors.paper} />
                  <Text style={styles.overlayText}>등록 중...</Text>
                </View>
              ) : null}
            </ScrollView>
          </View>
        </View>
      </View>
    </Portal>
  );
}
