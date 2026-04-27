import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { mockNotifications } from '@/data/mock-notifications';
import { formatDate } from '@/utils/format';
import { Notification as AppNotification } from '@/types';

export default function NotificationsScreen() {
  const getTypeConfig = (type: AppNotification['type']) => {
    switch (type) {
      case 'OVERDUE_WARNING':
        return { icon: 'warning', color: '#EF4444', bg: '#FEE2E2' };
      case 'INVOICE':
        return { icon: 'receipt', color: '#F59E0B', bg: '#FEF3C7' };
      case 'PAYMENT':
        return { icon: 'checkmark-circle', color: '#00A651', bg: '#E8F5E9' };
      case 'PRICE_CHANGE':
        return { icon: 'trending-up', color: '#3B82F6', bg: '#DBEAFE' };
      case 'CONTRACT':
        return { icon: 'document-text', color: '#00A651', bg: '#E8F5E9' };
      case 'INFO':
      default:
        return { icon: 'information-circle', color: '#6B7280', bg: '#F5F5F5' };
    }
  };

  const renderNotification = ({ item }: { item: AppNotification }) => {
    const config = getTypeConfig(item.type);
    return (
      <View
        className="bg-white rounded-xl p-4 mx-5 mb-2 flex-row items-start shadow-sm"
        style={{ opacity: item.read ? 0.7 : 1 }}
      >
        <View
          className="w-10 h-10 rounded-full items-center justify-center mr-3 mt-0.5"
          style={{ backgroundColor: config.bg }}
        >
          <Ionicons name={config.icon as any} size={20} color={config.color} />
        </View>
        <View className="flex-1">
          <View className="flex-row items-center justify-between">
            <Text
              className={`text-sm ${
                !item.read ? 'font-semibold' : 'font-medium'
              } text-[#1B1B1B] flex-1`}
            >
              {item.title}
            </Text>
            {!item.read && (
              <View className="w-2.5 h-2.5 rounded-full bg-[#00A651] ml-2" />
            )}
          </View>
          <Text className="text-xs text-[#6B7280] mt-1 leading-4">
            {item.message}
          </Text>
          <Text className="text-[11px] text-[#D1D5DB] mt-2">
            {formatDate(item.date)}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <View className="flex-1 bg-[#F5F5F5]">
      <FlatList
        data={mockNotifications}
        keyExtractor={(item) => item.id}
        renderItem={renderNotification}
        contentContainerStyle={{ paddingTop: 12, paddingBottom: 20 }}
        ListEmptyComponent={
          <View className="items-center py-12">
            <Ionicons
              name="notifications-off-outline"
              size={48}
              color="#D1D5DB"
            />
            <Text className="text-[#6B7280] mt-3">Žádná upozornění</Text>
          </View>
        }
      />
    </View>
  );
}
