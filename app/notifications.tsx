import { useMemo, useState } from 'react';
import { View, Text, FlatList, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { mockNotifications } from '@/data/mock-notifications';
import { formatDate } from '@/utils/format';
import { Notification as AppNotification } from '@/types';
import { Tones } from '@/constants/colors';
import { getNotificationTone, getNotificationIcon } from '@/utils/tones';
import { Card } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';

function groupByDate(items: AppNotification[]) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const weekAgo = new Date(today);
  weekAgo.setDate(weekAgo.getDate() - 7);

  const groups: Record<string, AppNotification[]> = {
    Dnes: [],
    Včera: [],
    'Tento týden': [],
    Starší: [],
  };

  items.forEach((n) => {
    const d = new Date(n.date);
    d.setHours(0, 0, 0, 0);
    if (d.getTime() === today.getTime()) groups['Dnes'].push(n);
    else if (d.getTime() === yesterday.getTime()) groups['Včera'].push(n);
    else if (d >= weekAgo) groups['Tento týden'].push(n);
    else groups['Starší'].push(n);
  });

  return Object.entries(groups)
    .filter(([, list]) => list.length > 0)
    .map(([title, data]) => ({ title, data }));
}

type Row =
  | { kind: 'header'; title: string }
  | { kind: 'item'; item: AppNotification };

export default function NotificationsScreen() {
  const [readSet, setReadSet] = useState<Set<string>>(
    new Set(mockNotifications.filter((n) => n.read).map((n) => n.id)),
  );

  const items = useMemo(
    () => mockNotifications.map((n) => ({ ...n, read: readSet.has(n.id) })),
    [readSet],
  );
  const unreadCount = items.filter((n) => !n.read).length;

  const rows: Row[] = useMemo(() => {
    const groups = groupByDate(items);
    const out: Row[] = [];
    groups.forEach((g) => {
      out.push({ kind: 'header', title: g.title });
      g.data.forEach((item) => out.push({ kind: 'item', item }));
    });
    return out;
  }, [items]);

  const markAllRead = () => {
    setReadSet(new Set(mockNotifications.map((n) => n.id)));
  };
  const toggleRead = (id: string) => {
    setReadSet((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const renderItem = (row: Row) => {
    if (row.kind === 'header') {
      return (
        <View className="px-5 pt-4 pb-2">
          <Text className="text-xs font-bold text-ink-muted uppercase tracking-wider">
            {row.title}
          </Text>
        </View>
      );
    }
    const n = row.item;
    const tone = getNotificationTone(n.type);
    const c = Tones[tone];
    return (
      <Pressable onPress={() => toggleRead(n.id)} className="mx-5 mb-2">
        {({ pressed }) => (
          <Card padding="md" style={{ opacity: pressed ? 0.85 : 1 }}>
            <View className="flex-row items-start">
              <View
                className="w-10 h-10 rounded-full items-center justify-center mr-3"
                style={{ backgroundColor: c.bg }}
              >
                <Ionicons
                  name={getNotificationIcon(n.type)}
                  size={20}
                  color={c.solid}
                />
              </View>
              <View className="flex-1 min-w-0">
                <View className="flex-row items-center">
                  <Text
                    className={`text-sm flex-1 ${
                      n.read
                        ? 'font-medium text-ink-muted'
                        : 'font-bold text-ink'
                    }`}
                    numberOfLines={1}
                  >
                    {n.title}
                  </Text>
                  {!n.read && (
                    <View className="w-2 h-2 rounded-full bg-mnd-green ml-2" />
                  )}
                </View>
                <Text
                  className={`text-xs mt-1 ${
                    n.read ? 'text-ink-subtle' : 'text-ink-muted'
                  }`}
                  numberOfLines={2}
                >
                  {n.message}
                </Text>
                <Text className="text-2xs text-ink-subtle mt-2">
                  {formatDate(n.date)}
                </Text>
              </View>
            </View>
          </Card>
        )}
      </Pressable>
    );
  };

  return (
    <View className="flex-1 bg-surface">
      {unreadCount > 0 && (
        <View className="px-5 pt-3 flex-row items-center justify-between">
          <Text className="text-xs text-ink-muted">
            {unreadCount} nepřečteno
          </Text>
          <Pressable onPress={markAllRead} hitSlop={8}>
            {({ pressed }) => (
              <Text
                className="text-sm font-semibold text-mnd-green"
                style={{ opacity: pressed ? 0.6 : 1 }}
              >
                Označit vše jako přečtené
              </Text>
            )}
          </Pressable>
        </View>
      )}

      <FlatList
        data={rows}
        keyExtractor={(r, i) =>
          r.kind === 'header' ? `h-${r.title}-${i}` : `i-${r.item.id}`
        }
        renderItem={({ item }) => renderItem(item)}
        contentContainerStyle={{ paddingBottom: 32 }}
        ListEmptyComponent={
          <EmptyState
            icon="notifications-off-outline"
            title="Žádná upozornění"
            message="Až vám něco důležitého pošleme, najdete to tady."
          />
        }
      />
    </View>
  );
}
