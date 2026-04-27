import { View, Text, ScrollView, Pressable, Image } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '@/store/auth-store';
import { formatDate } from '@/utils/format';
import { mockNotifications } from '@/data/mock-notifications';
import { Colors } from '@/constants/colors';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { InfoRow } from '@/components/ui/InfoRow';
import { Button } from '@/components/ui/Button';
import { SectionHeader } from '@/components/ui/SectionHeader';

type IconName = React.ComponentProps<typeof Ionicons>['name'];

interface MenuItem {
  icon: IconName;
  label: string;
  route: string | null;
  badge?: number;
}

export default function ProfileScreen() {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  const unreadCount = mockNotifications.filter((n) => !n.read).length;

  const menuItems: MenuItem[] = [
    {
      icon: 'location-outline',
      label: 'Odběrná místa',
      route: '/supply-points',
    },
    {
      icon: 'notifications-outline',
      label: 'Upozornění',
      route: '/notifications',
      badge: unreadCount > 0 ? unreadCount : undefined,
    },
    {
      icon: 'calculator-outline',
      label: 'Kalkulačka cen',
      route: '/calculator',
    },
    {
      icon: 'document-outline',
      label: 'Dokumenty ke stažení',
      route: null,
    },
    {
      icon: 'information-circle-outline',
      label: 'O aplikaci',
      route: null,
    },
  ];

  return (
    <ScrollView
      className="flex-1 bg-surface"
      contentContainerStyle={{ paddingBottom: 32 }}
    >
      {/* Hero */}
      <View className="bg-white px-5 pt-4 pb-7 items-center">
        <View
          className="w-24 h-24 rounded-full items-center justify-center mb-3"
          style={{ backgroundColor: Colors.primaryLight }}
        >
          {user?.avatarUrl ? (
            <Image
              source={{ uri: user.avatarUrl }}
              className="w-24 h-24 rounded-full"
            />
          ) : (
            <Text className="text-3xl font-bold text-mnd-green">
              {user?.firstName?.[0]}
              {user?.lastName?.[0]}
            </Text>
          )}
        </View>

        <Text className="text-xl font-bold text-ink">
          {user?.firstName} {user?.lastName}
        </Text>

        <View className="mt-2 flex-row items-center gap-2">
          {user?.status && <Badge label={user.status} tone="brand" />}
          <Text className="text-xs text-ink-muted">
            č. {user?.customerNumber}
          </Text>
        </View>
      </View>

      {/* Personal info */}
      <View className="px-5 mt-5">
        <SectionHeader title="Osobní údaje" />
        <Card padding="md">
          <InfoRow
            icon="calendar-outline"
            label="Datum narození"
            value={user?.dateOfBirth ? formatDate(user.dateOfBirth) : ''}
          />
          <InfoRow icon="call-outline" label="Telefon" value={user?.phone} />
          <InfoRow icon="mail-outline" label="E-mail" value={user?.email} />
          <InfoRow
            icon="location-outline"
            label="Adresa"
            value={
              user
                ? `${user.address.street}, ${user.address.postalCode} ${user.address.city}`
                : ''
            }
            withDivider={false}
          />
        </Card>
      </View>

      {/* Menu */}
      <View className="px-5 mt-5">
        <SectionHeader title="Nastavení a více" />
        <Card padding="none">
          {menuItems.map((item, i) => {
            const disabled = !item.route;
            return (
              <Pressable
                key={i}
                disabled={disabled}
                onPress={() => item.route && router.push(item.route as any)}
              >
                {({ pressed }) => (
                  <View
                    className={`flex-row items-center px-4 py-3.5 ${
                      i < menuItems.length - 1
                        ? 'border-b border-line-subtle'
                        : ''
                    }`}
                    style={{
                      opacity: disabled ? 0.4 : pressed ? 0.6 : 1,
                    }}
                  >
                    <Ionicons
                      name={item.icon}
                      size={20}
                      color={Colors.gray}
                      style={{ marginRight: 12 }}
                    />
                    <Text className="flex-1 text-sm text-ink">
                      {item.label}
                    </Text>
                    {item.badge !== undefined && (
                      <View className="bg-danger rounded-full min-w-[20px] h-5 px-1.5 items-center justify-center mr-2">
                        <Text className="text-white text-2xs font-bold">
                          {item.badge}
                        </Text>
                      </View>
                    )}
                    {!disabled && (
                      <Ionicons
                        name="chevron-forward"
                        size={16}
                        color={Colors.grayMedium}
                      />
                    )}
                  </View>
                )}
              </Pressable>
            );
          })}
        </Card>
      </View>

      {/* Logout */}
      <View className="px-5 mt-6">
        <Button
          label="Odhlásit se"
          variant="danger"
          icon="log-out-outline"
          fullWidth
          onPress={() => {
            logout();
            router.replace('/login');
          }}
        />
      </View>
    </ScrollView>
  );
}
