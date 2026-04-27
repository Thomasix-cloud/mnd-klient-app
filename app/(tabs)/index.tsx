import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuthStore } from '@/store/auth-store';
import { mockSupplyPoints } from '@/data/mock-supply-points';
import { mockInvoices } from '@/data/mock-invoices';
import { mockNotifications } from '@/data/mock-notifications';
import { mockConsumption } from '@/data/mock-consumption';
import { Colors } from '@/constants/colors';
import {
  formatCurrency,
  getGreeting,
  getEnergyTypeIcon,
  getEnergyTypeLabel,
} from '@/utils/format';

export default function DashboardScreen() {
  const insets = useSafeAreaInsets();
  const user = useAuthStore((s) => s.user);

  const unpaidInvoices = mockInvoices.filter(
    (i) => i.status === 'UNPAID' || i.status === 'OVERDUE',
  );
  const overdueInvoices = mockInvoices.filter((i) => i.status === 'OVERDUE');
  const totalUnpaid = unpaidInvoices.reduce((sum, i) => sum + i.amount, 0);
  const totalMonthly = mockInvoices
    .filter((i) => i.type === 'ADVANCE' && i.period.from.startsWith('2026-04'))
    .reduce((sum, i) => sum + i.amount, 0);

  const unreadNotifications = mockNotifications.filter((n) => !n.read);

  // Last 7 days consumption for sp1
  const sp1Consumption = mockConsumption.find((c) => c.supplyPointId === 'sp1');
  const last7Days = sp1Consumption?.daily.slice(-7) ?? [];

  return (
    <ScrollView
      className="flex-1 bg-[#F5F5F5]"
      contentContainerStyle={{ paddingTop: insets.top + 8, paddingBottom: 20 }}
    >
      {/* Header */}
      <View className="px-5 flex-row items-center justify-between mb-4">
        <View>
          <Text className="text-sm text-[#6B7280]">{getGreeting()}</Text>
          <Text className="text-2xl font-bold text-[#1B1B1B]">
            {user?.firstName} {user?.lastName}
          </Text>
        </View>
        <TouchableOpacity
          className="relative"
          onPress={() => router.push('/notifications')}
        >
          <Ionicons name="notifications-outline" size={26} color="#1B1B1B" />
          {unreadNotifications.length > 0 && (
            <View className="absolute -top-1 -right-1 bg-[#EF4444] rounded-full w-5 h-5 items-center justify-center">
              <Text className="text-white text-xs font-bold">
                {unreadNotifications.length}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Overdue Warning Banner */}
      {overdueInvoices.length > 0 && (
        <TouchableOpacity
          className="mx-5 mb-4 bg-[#FEE2E2] border border-[#EF4444] rounded-xl p-4 flex-row items-center"
          onPress={() => router.push('/invoices/' + overdueInvoices[0].id)}
        >
          <View className="w-10 h-10 rounded-full bg-[#EF4444] items-center justify-center mr-3">
            <Ionicons name="warning" size={20} color="white" />
          </View>
          <View className="flex-1">
            <Text className="text-[#EF4444] font-semibold text-sm">
              Neuhrazená platba po splatnosti
            </Text>
            <Text className="text-[#6B7280] text-xs mt-0.5">
              {formatCurrency(
                overdueInvoices.reduce((s, i) => s + i.amount, 0),
              )}{' '}
              — klikněte pro detail
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color="#EF4444" />
        </TouchableOpacity>
      )}

      {/* Summary Cards */}
      <View className="flex-row px-5 gap-3 mb-5">
        <View className="flex-1 bg-white rounded-2xl p-4 shadow-sm">
          <View className="w-9 h-9 rounded-full bg-[#E8F5E9] items-center justify-center mb-2">
            <Ionicons name="wallet-outline" size={18} color="#00A651" />
          </View>
          <Text className="text-xs text-[#6B7280]">Měsíční zálohy</Text>
          <Text className="text-lg font-bold text-[#1B1B1B]">
            {formatCurrency(totalMonthly)}
          </Text>
        </View>
        <View className="flex-1 bg-white rounded-2xl p-4 shadow-sm">
          <View className="w-9 h-9 rounded-full bg-[#FEE2E2] items-center justify-center mb-2">
            <Ionicons name="time-outline" size={18} color="#EF4444" />
          </View>
          <Text className="text-xs text-[#6B7280]">K úhradě</Text>
          <Text className="text-lg font-bold text-[#EF4444]">
            {formatCurrency(totalUnpaid)}
          </Text>
        </View>
        <View className="flex-1 bg-white rounded-2xl p-4 shadow-sm">
          <View className="w-9 h-9 rounded-full bg-[#DBEAFE] items-center justify-center mb-2">
            <Ionicons name="location-outline" size={18} color="#3B82F6" />
          </View>
          <Text className="text-xs text-[#6B7280]">Odběrná místa</Text>
          <Text className="text-lg font-bold text-[#1B1B1B]">
            {mockSupplyPoints.length}
          </Text>
        </View>
      </View>

      {/* Supply Point Tiles */}
      <View className="px-5 mb-5">
        <View className="flex-row items-center justify-between mb-3">
          <Text className="text-base font-semibold text-[#1B1B1B]">
            Odběrná místa
          </Text>
          <TouchableOpacity onPress={() => router.push('/supply-points')}>
            <Text className="text-sm text-[#00A651] font-medium">
              Zobrazit vše
            </Text>
          </TouchableOpacity>
        </View>
        {mockSupplyPoints.map((sp) => (
          <TouchableOpacity
            key={sp.id}
            className="bg-white rounded-2xl p-4 mb-3 flex-row items-center shadow-sm"
            onPress={() => router.push(`/supply-points/${sp.id}`)}
          >
            <View
              className="w-11 h-11 rounded-full items-center justify-center mr-3"
              style={{
                backgroundColor:
                  sp.type === 'ELECTRICITY' ? '#DBEAFE' : '#FEF3C7',
              }}
            >
              <Ionicons
                name={getEnergyTypeIcon(sp.type) as any}
                size={22}
                color={
                  sp.type === 'ELECTRICITY' ? Colors.electricity : Colors.gas
                }
              />
            </View>
            <View className="flex-1">
              <Text className="text-sm font-semibold text-[#1B1B1B]">
                {getEnergyTypeLabel(sp.type)}
              </Text>
              <Text className="text-xs text-[#6B7280]">
                {sp.address.street}, {sp.address.city}
              </Text>
            </View>
            <View className="items-end">
              <View className="bg-[#E8F5E9] rounded-full px-2 py-0.5">
                <Text className="text-xs text-[#00A651] font-medium">
                  Aktivní
                </Text>
              </View>
            </View>
            <Ionicons
              name="chevron-forward"
              size={16}
              color="#D1D5DB"
              style={{ marginLeft: 8 }}
            />
          </TouchableOpacity>
        ))}
      </View>

      {/* Consumption Mini Chart (simplified) */}
      <View className="px-5 mb-5">
        <Text className="text-base font-semibold text-[#1B1B1B] mb-3">
          Spotřeba elektřiny — 7 dní
        </Text>
        <View className="bg-white rounded-2xl p-4 shadow-sm">
          <View className="flex-row items-end justify-between h-24">
            {last7Days.map((d, i) => {
              const maxVal = Math.max(...last7Days.map((x) => x.value));
              const height = maxVal > 0 ? (d.value / maxVal) * 80 : 0;
              const dayLabel = new Date(d.date).toLocaleDateString('cs-CZ', {
                weekday: 'short',
              });
              return (
                <View key={i} className="items-center flex-1">
                  <Text className="text-[10px] text-[#6B7280] mb-1">
                    {d.value}
                  </Text>
                  <View
                    className="w-6 rounded-t-md bg-[#00A651]"
                    style={{ height: Math.max(height, 4) }}
                  />
                  <Text className="text-[10px] text-[#6B7280] mt-1">
                    {dayLabel}
                  </Text>
                </View>
              );
            })}
          </View>
          <Text className="text-xs text-[#6B7280] text-center mt-2">
            kWh/den • Koněvova 123
          </Text>
        </View>
      </View>

      {/* Quick Actions */}
      <View className="px-5 mb-5">
        <Text className="text-base font-semibold text-[#1B1B1B] mb-3">
          Rychlé akce
        </Text>
        <View className="flex-row gap-3">
          {[
            {
              icon: 'speedometer-outline',
              label: 'Samoodečet',
              color: '#00A651',
            },
            { icon: 'cash-outline', label: 'Změnit zálohy', color: '#3B82F6' },
            {
              icon: 'calculator-outline',
              label: 'Kalkulačka',
              color: '#F59E0B',
              route: '/calculator',
            },
            { icon: 'call-outline', label: 'Kontakt', color: '#6B7280' },
          ].map((action, i) => (
            <TouchableOpacity
              key={i}
              className="flex-1 bg-white rounded-2xl p-3 items-center shadow-sm"
              onPress={() => {
                if (action.route) router.push(action.route as any);
              }}
            >
              <View
                className="w-10 h-10 rounded-full items-center justify-center mb-1.5"
                style={{ backgroundColor: action.color + '15' }}
              >
                <Ionicons
                  name={action.icon as any}
                  size={20}
                  color={action.color}
                />
              </View>
              <Text className="text-[11px] text-[#1B1B1B] font-medium text-center">
                {action.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Recent Notifications */}
      <View className="px-5">
        <View className="flex-row items-center justify-between mb-3">
          <Text className="text-base font-semibold text-[#1B1B1B]">
            Poslední upozornění
          </Text>
          <TouchableOpacity onPress={() => router.push('/notifications')}>
            <Text className="text-sm text-[#00A651] font-medium">Vše</Text>
          </TouchableOpacity>
        </View>
        {mockNotifications.slice(0, 3).map((n) => (
          <View
            key={n.id}
            className="bg-white rounded-xl p-3.5 mb-2 flex-row items-start shadow-sm"
          >
            <View
              className="w-8 h-8 rounded-full items-center justify-center mr-3 mt-0.5"
              style={{
                backgroundColor:
                  n.type === 'OVERDUE_WARNING'
                    ? '#FEE2E2'
                    : n.type === 'INVOICE'
                      ? '#FEF3C7'
                      : n.type === 'PRICE_CHANGE'
                        ? '#DBEAFE'
                        : '#E8F5E9',
              }}
            >
              <Ionicons
                name={
                  n.type === 'OVERDUE_WARNING'
                    ? 'warning'
                    : n.type === 'INVOICE'
                      ? 'receipt'
                      : n.type === 'PRICE_CHANGE'
                        ? 'trending-up'
                        : ('information-circle' as any)
                }
                size={16}
                color={
                  n.type === 'OVERDUE_WARNING'
                    ? '#EF4444'
                    : n.type === 'INVOICE'
                      ? '#F59E0B'
                      : n.type === 'PRICE_CHANGE'
                        ? '#3B82F6'
                        : '#00A651'
                }
              />
            </View>
            <View className="flex-1">
              <Text
                className={`text-sm ${
                  !n.read ? 'font-semibold' : 'font-medium'
                } text-[#1B1B1B]`}
              >
                {n.title}
              </Text>
              <Text className="text-xs text-[#6B7280] mt-0.5" numberOfLines={2}>
                {n.message}
              </Text>
            </View>
            {!n.read && (
              <View className="w-2 h-2 rounded-full bg-[#00A651] mt-1.5" />
            )}
          </View>
        ))}
      </View>
    </ScrollView>
  );
}
