import { useState } from 'react';
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  FlatList,
  Image,
} from 'react-native';
import {
  TextInput,
  Button,
  Text,
  Snackbar,
  ActivityIndicator,
  TouchableRipple,
} from 'react-native-paper';
import { useQueryClient } from '@tanstack/react-query';
import { router } from 'expo-router';
import {
  useBookControllerSearch,
  useBookControllerCreate,
  getBookControllerFindAllQueryKey,
} from '@/api/generated/books/books';
import type { BookSearchResultDto } from '@/api/generated/models';
import { colors } from '@/lib/theme/colors';

export function AddBookScreen() {
  const queryClient = useQueryClient();
  const createBook = useBookControllerCreate();

  const [searchTitle, setSearchTitle] = useState('');
  const [submittedTitle, setSubmittedTitle] = useState('');
  const [searched, setSearched] = useState(false);
  const [snackbar, setSnackbar] = useState('');
  const [error, setError] = useState('');
  const [manualMode, setManualMode] = useState(false);
  const [manualTitle, setManualTitle] = useState('');
  const [manualAuthor, setManualAuthor] = useState('');
  const [manualPublisher, setManualPublisher] = useState('');

  const {
    data: searchResults,
    isFetching,
    refetch,
  } = useBookControllerSearch(
    { title: submittedTitle },
    { query: { enabled: false } },
  );

  const handleSearch = async () => {
    if (!searchTitle.trim()) return;
    setError('');
    setManualMode(false);
    setSubmittedTitle(searchTitle.trim());
    setSearched(true);
    setTimeout(() => refetch(), 0);
  };

  const handleManualSubmit = async () => {
    if (!manualTitle.trim() || !manualAuthor.trim()) return;
    try {
      await createBook.mutateAsync({
        data: {
          title: manualTitle.trim(),
          author: manualAuthor.trim(),
          publisher: manualPublisher.trim() || undefined,
        },
      });
      await queryClient.invalidateQueries({
        queryKey: getBookControllerFindAllQueryKey(),
      });
      setSnackbar('책이 추가되었습니다!');
      setTimeout(() => router.back(), 500);
    } catch {
      setError('책 추가에 실패했습니다.');
    }
  };

  const handleShowManualForm = () => {
    setManualMode(true);
    setManualTitle(submittedTitle);
    setManualAuthor('');
    setManualPublisher('');
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
      setSnackbar('책이 추가되었습니다!');
      setTimeout(() => router.back(), 500);
    } catch {
      setError('책 추가에 실패했습니다.');
    }
  };

  const renderItem = ({ item }: { item: BookSearchResultDto }) => (
    <TouchableRipple
      onPress={() => handleSelect(item)}
      disabled={createBook.isPending}
      style={styles.resultItem}
    >
      <View style={styles.resultRow}>
        {item.thumbnail ? (
          <Image source={{ uri: item.thumbnail }} style={styles.thumbnail} />
        ) : (
          <View style={[styles.thumbnail, styles.noThumbnail]}>
            <Text style={styles.noThumbnailText}>No Image</Text>
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
            <Text style={styles.resultPublisher} numberOfLines={1}>
              {item.publisher}
            </Text>
          ) : null}
        </View>
      </View>
    </TouchableRipple>
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.card}>
        <Text style={styles.title}>새 책 등록</Text>
        <Text style={styles.subtitle}>
          제목을 검색하여 책을 추가합니다.
        </Text>

        <View style={styles.searchRow}>
          <TextInput
            label="책 제목"
            value={searchTitle}
            onChangeText={setSearchTitle}
            mode="flat"
            underlineColor={colors.shelfHighlight}
            activeUnderlineColor={colors.shelfBrown}
            style={styles.input}
            theme={{ colors: { background: 'transparent' } }}
            onSubmitEditing={handleSearch}
          />
          <Button
            mode="contained"
            onPress={handleSearch}
            disabled={isFetching || !searchTitle.trim()}
            loading={isFetching}
            style={styles.searchButton}
            labelStyle={styles.searchButtonLabel}
            compact
          >
            검색
          </Button>
        </View>

        {error ? <Text style={styles.error}>{error}</Text> : null}
      </View>

      {isFetching ? (
        <View style={styles.centerContent}>
          <ActivityIndicator size="large" color={colors.paper} />
        </View>
      ) : searched && searchResults ? (
        searchResults.length > 0 ? (
          <FlatList
            data={searchResults}
            renderItem={renderItem}
            keyExtractor={(_, index) => index.toString()}
            contentContainerStyle={styles.listContent}
          />
        ) : manualMode ? (
          <View style={styles.manualForm}>
            <Text style={styles.manualFormTitle}>직접 입력</Text>
            <TextInput
              label="제목"
              value={manualTitle}
              onChangeText={setManualTitle}
              mode="flat"
              underlineColor={colors.shelfHighlight}
              activeUnderlineColor={colors.shelfBrown}
              style={styles.manualInput}
              theme={{ colors: { background: 'transparent' } }}
            />
            <TextInput
              label="저자"
              value={manualAuthor}
              onChangeText={setManualAuthor}
              mode="flat"
              underlineColor={colors.shelfHighlight}
              activeUnderlineColor={colors.shelfBrown}
              style={styles.manualInput}
              theme={{ colors: { background: 'transparent' } }}
            />
            <TextInput
              label="출판사 (선택)"
              value={manualPublisher}
              onChangeText={setManualPublisher}
              mode="flat"
              underlineColor={colors.shelfHighlight}
              activeUnderlineColor={colors.shelfBrown}
              style={styles.manualInput}
              theme={{ colors: { background: 'transparent' } }}
            />
            <Button
              mode="contained"
              onPress={handleManualSubmit}
              loading={createBook.isPending}
              disabled={
                createBook.isPending ||
                !manualTitle.trim() ||
                !manualAuthor.trim()
              }
              style={styles.manualSubmitButton}
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

      {createBook.isPending ? (
        <View style={styles.overlay}>
          <ActivityIndicator size="large" color={colors.paper} />
          <Text style={styles.overlayText}>등록 중...</Text>
        </View>
      ) : null}

      <Snackbar
        visible={!!snackbar}
        onDismiss={() => setSnackbar('')}
        duration={1500}
        style={{ backgroundColor: colors.shelfDark }}
      >
        <Text style={{ color: colors.paper }}>{snackbar}</Text>
      </Snackbar>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.shelfBrown,
  },
  card: {
    backgroundColor: colors.paper,
    padding: 24,
    margin: 16,
    marginBottom: 0,
    borderRadius: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
    borderWidth: 1,
    borderColor: '#D7CCC8',
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 8,
    fontFamily: Platform.select({
      ios: 'Georgia',
      android: 'serif',
      default: 'serif',
    }),
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: colors.textMuted,
    marginBottom: 24,
    fontFamily: Platform.select({
      ios: 'Georgia',
      android: 'serif',
      default: 'serif',
    }),
    textAlign: 'center',
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
  },
  input: {
    flex: 1,
    backgroundColor: 'transparent',
    fontSize: 16,
    fontFamily: Platform.select({
      ios: 'Georgia',
      android: 'serif',
      default: 'serif',
    }),
    color: colors.textPrimary,
  },
  searchButton: {
    backgroundColor: colors.shelfDark,
    borderRadius: 8,
    marginBottom: 6,
  },
  searchButtonLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.warmWhite,
  },
  error: {
    color: colors.error,
    fontSize: 13,
    marginTop: 12,
    textAlign: 'center',
    fontFamily: Platform.select({
      ios: 'Georgia',
      android: 'serif',
      default: 'serif',
    }),
  },
  listContent: {
    padding: 16,
    gap: 8,
  },
  resultItem: {
    backgroundColor: colors.paper,
    borderRadius: 2,
    borderWidth: 1,
    borderColor: '#D7CCC8',
  },
  resultRow: {
    flexDirection: 'row',
    padding: 12,
  },
  thumbnail: {
    width: 50,
    height: 70,
    borderRadius: 2,
  },
  noThumbnail: {
    backgroundColor: colors.shelfHighlight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noThumbnailText: {
    fontSize: 8,
    color: colors.warmWhite,
  },
  resultInfo: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'center',
  },
  resultTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    fontFamily: Platform.select({
      ios: 'Georgia',
      android: 'serif',
      default: 'serif',
    }),
  },
  resultAuthor: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 4,
    fontFamily: Platform.select({
      ios: 'Georgia',
      android: 'serif',
      default: 'serif',
    }),
  },
  resultPublisher: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 2,
    fontFamily: Platform.select({
      ios: 'Georgia',
      android: 'serif',
      default: 'serif',
    }),
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: colors.warmWhite,
    fontFamily: Platform.select({
      ios: 'Georgia',
      android: 'serif',
      default: 'serif',
    }),
  },
  manualButton: {
    marginTop: 16,
    borderColor: colors.warmWhite,
  },
  manualButtonLabel: {
    color: colors.warmWhite,
    fontFamily: Platform.select({
      ios: 'Georgia',
      android: 'serif',
      default: 'serif',
    }),
  },
  manualForm: {
    backgroundColor: colors.paper,
    margin: 16,
    padding: 24,
    borderRadius: 2,
    borderWidth: 1,
    borderColor: '#D7CCC8',
  },
  manualFormTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 16,
    fontFamily: Platform.select({
      ios: 'Georgia',
      android: 'serif',
      default: 'serif',
    }),
    textAlign: 'center',
  },
  manualInput: {
    marginBottom: 12,
    backgroundColor: 'transparent',
    fontFamily: Platform.select({
      ios: 'Georgia',
      android: 'serif',
      default: 'serif',
    }),
  },
  manualSubmitButton: {
    marginTop: 8,
    backgroundColor: colors.shelfDark,
    borderRadius: 8,
    paddingVertical: 4,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlayText: {
    color: colors.paper,
    marginTop: 12,
    fontSize: 16,
    fontFamily: Platform.select({
      ios: 'Georgia',
      android: 'serif',
      default: 'serif',
    }),
  },
});
