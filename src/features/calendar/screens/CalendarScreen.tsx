import React, { useState, useCallback } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import { colors } from '@/lib/theme/colors';
import { LoadingScreen } from '@/components/ui/LoadingScreen';
import { ErrorScreen } from '@/components/ui/ErrorScreen';
import { EmptyState } from '@/components/ui/EmptyState';
import { useCalendarData } from '../hooks/useCalendarData';
import { CalendarDayCell } from '../components/CalendarDayCell';
import { DayBookList } from '../components/DayBookList';
import { styles } from './CalendarScreen.style';

LocaleConfig.locales['ko'] = {
  monthNames: [
    '1월',
    '2월',
    '3월',
    '4월',
    '5월',
    '6월',
    '7월',
    '8월',
    '9월',
    '10월',
    '11월',
    '12월',
  ],
  monthNamesShort: [
    '1월',
    '2월',
    '3월',
    '4월',
    '5월',
    '6월',
    '7월',
    '8월',
    '9월',
    '10월',
    '11월',
    '12월',
  ],
  dayNames: [
    '일요일',
    '월요일',
    '화요일',
    '수요일',
    '목요일',
    '금요일',
    '토요일',
  ],
  dayNamesShort: ['일', '월', '화', '수', '목', '금', '토'],
  today: '오늘',
};
LocaleConfig.defaultLocale = 'ko';

export function CalendarScreen() {
  const insets = useSafeAreaInsets();
  const { dateToBookMap, isLoading, isError, isEmpty, refetch } =
    useCalendarData();
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const handleDayPress = useCallback((dateString: string) => {
    setSelectedDate((prev) => (prev === dateString ? null : dateString));
  }, []);

  if (isLoading) {
    return <LoadingScreen message="독서 기록을 불러오는 중..." />;
  }

  if (isError) {
    return (
      <ErrorScreen
        message="독서 기록을 불러오는 데 실패했습니다."
        onRetry={refetch}
      />
    );
  }

  if (isEmpty) {
    return (
      <EmptyState
        icon="📅"
        title="독서 기록이 없습니다"
        description="독후감을 작성하면 캘린더에 독서 기록이 표시됩니다."
      />
    );
  }

  const selectedBooks = selectedDate
    ? (dateToBookMap[selectedDate]?.books ?? [])
    : [];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
        <Text style={styles.headerTitle}>캘린더</Text>
      </View>

      <ScrollView style={styles.scroll}>
        <Calendar
          dayComponent={({ date, state }) => (
            <CalendarDayCell
              date={date!}
              state={state ?? ''}
              dateToBookMap={dateToBookMap}
              onPress={handleDayPress}
              isSelected={date?.dateString === selectedDate}
            />
          )}
          theme={{
            calendarBackground: colors.cream,
            monthTextColor: colors.textPrimary,
            arrowColor: colors.shelfBrown,
            todayTextColor: colors.shelfBrown,
            textSectionTitleColor: colors.textSecondary,
          }}
        />
        <DayBookList selectedDate={selectedDate} books={selectedBooks} />
      </ScrollView>
    </View>
  );
}
