import { Tabs } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '@/lib/theme/colors';

export default function MainLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.headerBg,
          borderTopWidth: 0,
        },
        tabBarActiveTintColor: colors.accentGold,
        tabBarInactiveTintColor: colors.shelfHighlight,
      }}
    >
      <Tabs.Screen
        name="(bookshelf)"
        options={{
          title: '나의 서재',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="bookshelf"
              size={size}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="calendar/index"
        options={{
          title: '캘린더',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="calendar-month"
              size={size}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="settings/index"
        options={{
          title: '설정',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="cog" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
