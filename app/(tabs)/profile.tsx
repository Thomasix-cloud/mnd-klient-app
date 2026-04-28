import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '@/store/auth-store';
import { formatDate } from '@/utils/format';
import { mockNotifications } from '@/data/mock-notifications';

type IconName = React.ComponentProps<typeof Ionicons>['name'];

export default function ProfileScreen() {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  const unreadCount = mockNotifications.filter((n) => !n.read).length;

  const handleLogout = () => {
    logout();
    router.replace('/login');
  };

  const menuItems: {
    icon: IconName;
    label: string;
    route: string | null;
    badge: number | null;
  }[] = [
    {
      icon: 'location-outline',
      label: 'Odběrná místa',
      route: '/supply-points',
      badge: null,
    },
    {
      icon: 'notifications-outline',
      label: 'Upozornění',
      route: '/notifications',
      badge: unreadCount > 0 ? unreadCount : null,
    },
    {
      icon: 'calculator-outline',
      label: 'Kalkulačka cen',
      route: '/calculator',
      badge: null,
    },
    {
      icon: 'document-outline',
      label: 'Dokumenty ke stažení',
      route: null,
      badge: null,
    },
    {
      icon: 'information-circle-outline',
      label: 'O aplikaci',
      route: null,
      badge: null,
    },
  ];

  return (
    <ScrollView className="flex-1 bg-[#F5F5F5]">
      {/* Profile Header */}
      <View className="bg-white px-5 pt-4 pb-6 items-center">
        {/* Avatar */}
        <View className="w-24 h-24 rounded-full bg-[#E8F5E9] items-center justify-center mb-3">
          {user?.avatarUrl ? (
            <Image
              source={{ uri: user.avatarUrl }}
              className="w-24 h-24 rounded-full"
            />
          ) : (
            <Text className="text-3xl font-bold text-[#00A651]">
              {user?.firstName?.[0]}
              {user?.lastName?.[0]}
            </Text>
          )}
        </View>
        <TouchableOpacity className="mb-3">
          <Text className="text-xs text-[#00A651] font-medium">
            Změnit fotku
          </Text>
        </TouchableOpacity>

        <Text className="text-xl font-bold text-[#1B1B1B]">
          {user?.firstName} {user?.lastName}
        </Text>

        {/* Customer Status Badge */}
        <View className="mt-1.5 flex-row items-center gap-2">
          <View className="bg-[#E8F5E9] rounded-full px-3 py-1">
            <Text className="text-xs text-[#00A651] font-semibold">
              {user?.status}
            </Text>
          </View>
          <Text className="text-xs text-[#6B7280]">
            č. {user?.customerNumber}
          </Text>
        </View>
      </View>

      {/* Personal Info */}
      <View className="bg-white mx-5 mt-4 rounded-2xl p-4 shadow-sm">
        <Text className="text-sm font-semibold text-[#1B1B1B] mb-3">
          Osobní údaje
        </Text>

        {(
          [
            {
              icon: 'calendar-outline' as const,
              label: 'Datum narození',
              value: user?.dateOfBirth ? formatDate(user.dateOfBirth) : '',
            },
            {
              icon: 'call-outline' as const,
              label: 'Telefon',
              value: user?.phone,
            },
            {
              icon: 'mail-outline' as const,
              label: 'E-mail',
              value: user?.email,
            },
            {
              icon: 'location-outline' as const,
              label: 'Adresa',
              value: `${user?.address.street}, ${user?.address.postalCode} ${user?.address.city}`,
            },
          ] as const
        ).map((item, i) => (
          <View
            key={i}
            className="flex-row items-center py-3 border-b border-[#F5F5F5]"
          >
            <Ionicons
              name={item.icon}
              size={18}
              color="#6B7280"
              style={{ marginRight: 12 }}
            />
            <View className="flex-1">
              <Text className="text-xs text-[#6B7280]">{item.label}</Text>
              <Text className="text-sm text-[#1B1B1B]">{item.value}</Text>
            </View>
          </View>
        ))}
      </View>

      {/* Menu */}
      <View className="bg-white mx-5 mt-4 rounded-2xl shadow-sm overflow-hidden">
        {menuItems.map((item, i) => (
          <TouchableOpacity
            key={i}
            className="flex-row items-center px-4 py-3.5 border-b border-[#F5F5F5]"
            onPress={() => {
              if (item.route) router.push(item.route as any);
            }}
          >
            <Ionicons
              name={item.icon}
              size={20}
              color="#6B7280"
              style={{ marginRight: 12 }}
            />
            <Text className="flex-1 text-sm text-[#1B1B1B]">{item.label}</Text>
            {item.badge && (
              <View className="bg-[#EF4444] rounded-full w-5 h-5 items-center justify-center mr-2">
                <Text className="text-white text-xs font-bold">
                  {item.badge}
                </Text>
              </View>
            )}
            <Ionicons name="chevron-forward" size={16} color="#D1D5DB" />
          </TouchableOpacity>
        ))}
      </View>

      {/* Logout */}
      <TouchableOpacity
        className="mx-5 mt-4 mb-8 bg-white rounded-2xl py-3.5 items-center shadow-sm"
        onPress={handleLogout}
      >
        <View className="flex-row items-center">
          <Ionicons name="log-out-outline" size={20} color="#EF4444" />
          <Text className="ml-2 text-sm font-medium text-[#EF4444]">
            Odhlásit se
          </Text>
        </View>
      </TouchableOpacity>
    </ScrollView>
  );
}
