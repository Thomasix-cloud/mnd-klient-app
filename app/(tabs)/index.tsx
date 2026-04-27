import { useMemo } from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
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
  getEnergyTypeLabel,
} from '@/utils/format';
import { Alert } from '@/components/ui/Alert';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { ConsumptionChart } from '@/components/ui/ConsumptionChart';
import { EnergyAvatar } from '@/components/ui/EnergyAvatar';
import { SectionHeader } from '@/components/ui/SectionHeader';

type IoniconName = React.ComponentProps<typeof Ionicons>['name'];

interface QuickAction {
  icon: IoniconName;
  label: string;
  tone: 'brand' | 'info' | 'warning' | 'neutral';
  route?: string;
}

const QUICK_ACTIONS: QuickAction[] = [
  {
    icon: 'speedometer-outline',
    label: 'Samoodečet',
    tone: 'brand',
  },
  {
    icon: 'cash-outline',
    label: 'Změnit zálohy',
    tone: 'info',
  },
  {
    icon: 'calculator-outline',
    label: 'Kalkulačka',
    tone: 'warning',
    route: '/calculator',
  },
  {
    icon: 'call-outline',
    label: 'Kontakt',
    tone: 'neutral',
  },
];

export default function DashboardScreen() {
  const insets = useSafeAreaInsets();
  const user = useAuthStore((s) => s.user);

  const overdueInvoices = mockInvoices.filter((i) => i.status === 'OVERDUE');
  const unpaidInvoices = mockInvoices.filter(
    (i) => i.status === 'UNPAID' || i.status === 'OVERDUE',
  );
  const totalUnpaid = unpaidInvoices.reduce((s, i) => s + i.amount, 0);

  const currentMonth = `${new Date().getFullYear()}-${String(
    new Date().getMonth() + 1,
  ).padStart(2, '0')}`;
  const totalMonthly = mockInvoices
    .filter(
      (i) => i.type === 'ADVANCE' && i.period.from.startsWith(currentMonth),
    )
    .reduce((s, i) => s + i.amount, 0);

  const unreadNotifications = mockNotifications.filter((n) => !n.read);

  // Consumption: current 7 days vs previous 7 days
  const sp1Consumption = mockConsumption.find((c) => c.supplyPointId === 'sp1');
  const { current7, prev7 } = useMemo(() => {
    const all = sp1Consumption?.daily ?? [];
    return {
      current7: all.slice(-7),
      prev7: all.slice(-14, -7),
    };
  }, [sp1Consumption]);

  const initials = `${user?.firstName?.[0] ?? ''}${user?.lastName?.[0] ?? ''}`;

  return (
    <ScrollView
      className="flex-1 bg-surface"
      contentContainerStyle={{
        paddingTop: insets.top + 8,
        paddingBottom: 32,
      }}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View className="px-5 flex-row items-center justify-between mb-5">
        <View className="flex-row items-center flex-1">
          <View
            className="w-11 h-11 rounded-full items-center justify-center mr-3"
            style={{ backgroundColor: Colors.primaryLight }}
          >
            <Text className="text-base font-bold text-mnd-green">
              {initials}
            </Text>
          </View>
          <View className="flex-1 min-w-0">
            <Text className="text-xs text-ink-muted">{getGreeting()},</Text>
            <Text className="text-lg font-bold text-ink" numberOfLines={1}>
              {user?.firstName} {user?.lastName}
            </Text>
          </View>
        </View>
        <Pressable
          hitSlop={8}
          onPress={() => router.push('/notifications')}
          className="relative w-11 h-11 rounded-full items-center justify-center"
          style={{ backgroundColor: Colors.surfaceSubtle }}
        >
          <Ionicons
            name="notifications-outline"
            size={22}
            color={Colors.text}
          />
          {unreadNotifications.length > 0 && (
            <View className="absolute top-1.5 right-1.5 bg-danger rounded-full min-w-[18px] h-[18px] px-1 items-center justify-center border-2 border-white">
              <Text className="text-white text-[10px] font-bold">
                {unreadNotifications.length}
              </Text>
            </View>
          )}
        </Pressable>
      </View>

      {/* ========== ALERTS ========== */}
      {overdueInvoices.length > 0 && (
        <View className="px-5 mb-5">
          <Alert
            tone="danger"
            icon="warning"
            title="Faktura po splatnosti"
            message={`${formatCurrency(
              overdueInvoices.reduce((s, i) => s + i.amount, 0),
            )} — klepněte pro detail`}
            onPress={() =>
              router.push(`/invoices/${overdueInvoices[0].id}` as any)
            }
          />
        </View>
      )}

      {/* ========== KEY METRICS ========== */}
      <View className="px-5 mb-6">
        <Card padding="lg">
          <Text className="text-2xs text-ink-muted uppercase tracking-wider mb-1">
            K úhradě tento měsíc
          </Text>
          <View className="flex-row items-baseline">
            <Text
              className={`text-3xl font-bold ${
                totalUnpaid > 0 ? 'text-danger-text' : 'text-ink'
              }`}
            >
              {formatCurrency(totalUnpaid)}
            </Text>
          </View>
          <View className="flex-row mt-4 pt-4 border-t border-line-subtle">
            <View className="flex-1 pr-3 border-r border-line-subtle">
              <Text className="text-2xs text-ink-muted">Měsíční zálohy</Text>
              <Text className="text-sm font-bold text-ink mt-1">
                {formatCurrency(totalMonthly)}
              </Text>
            </View>
            <View className="flex-1 pl-3">
              <Text className="text-2xs text-ink-muted">Odběrná místa</Text>
              <Text className="text-sm font-bold text-ink mt-1">
                {mockSupplyPoints.length} aktivní
              </Text>
            </View>
          </View>
        </Card>
      </View>

      {/* ========== QUICK ACTIONS (2x2) ========== */}
      <View className="px-5 mb-6">
        <SectionHeader title="Rychlé akce" />
        <View className="flex-row flex-wrap -mx-1.5">
          {QUICK_ACTIONS.map((action, i) => {
            const palette = {
              brand: { bg: '#E8F5E9', icon: Colors.primary },
              info: { bg: '#DBEAFE', icon: Colors.electricity },
              warning: { bg: '#FEF3C7', icon: Colors.gas },
              neutral: { bg: '#F1F5F9', icon: Colors.gray },
            }[action.tone];
            return (
              <View key={i} className="w-1/2 px-1.5 mb-3">
                <Pressable
                  onPress={() => {
                    if (action.route) router.push(action.route as any);
                  }}
                >
                  {({ pressed }) => (
                    <Card padding="md" style={{ opacity: pressed ? 0.85 : 1 }}>
                      <View className="flex-row items-center">
                        <View
                          className="w-11 h-11 rounded-xl items-center justify-center mr-3"
                          style={{ backgroundColor: palette.bg }}
                        >
                          <Ionicons
                            name={action.icon}
                            size={22}
                            color={palette.icon}
                          />
                        </View>
                        <Text
                          className="text-sm font-semibold text-ink flex-1"
                          numberOfLines={1}
                        >
                          {action.label}
                        </Text>
                      </View>
                    </Card>
                  )}
                </Pressable>
              </View>
            );
          })}
        </View>
      </View>

      {/* ========== CONSUMPTION ========== */}
      <View className="px-5 mb-6">
        <SectionHeader
          title="Spotřeba elektřiny"
          actionLabel="Detail"
          onActionPress={() => router.push('/supply-points/sp1' as any)}
        />
        {current7.length > 0 && (
          <ConsumptionChart
            data={current7}
            previous={prev7.length === 7 ? prev7 : undefined}
            unit="kWh"
          />
        )}
      </View>

      {/* ========== SUPPLY POINTS ========== */}
      <View className="px-5 mb-6">
        <SectionHeader
          title="Odběrná místa"
          actionLabel="Vše"
          onActionPress={() => router.push('/supply-points')}
        />
        {mockSupplyPoints.map((sp) => (
          <Pressable
            key={sp.id}
            onPress={() => router.push(`/supply-points/${sp.id}`)}
            className="mb-3"
          >
            {({ pressed }) => (
              <Card padding="md" style={{ opacity: pressed ? 0.85 : 1 }}>
                <View className="flex-row items-center">
                  <EnergyAvatar type={sp.type} size="md" />
                  <View className="flex-1 ml-3 min-w-0">
                    <Text
                      className="text-sm font-semibold text-ink"
                      numberOfLines={1}
                    >
                      {getEnergyTypeLabel(sp.type)}
                    </Text>
                    <Text
                      className="text-xs text-ink-muted mt-0.5"
                      numberOfLines={1}
                    >
                      {sp.address.street}, {sp.address.city}
                    </Text>
                  </View>
                  <Badge label="Aktivní" tone="success" />
                  <Ionicons
                    name="chevron-forward"
                    size={16}
                    color={Colors.grayMedium}
                    style={{ marginLeft: 8 }}
                  />
                </View>
              </Card>
            )}
          </Pressable>
        ))}
      </View>

      {/* ========== RECENT NOTIFICATIONS ========== */}
      <View className="px-5">
        <SectionHeader
          title="Poslední upozornění"
          actionLabel="Vše"
          onActionPress={() => router.push('/notifications')}
        />
        {mockNotifications.slice(0, 3).map((n) => {
          const tone =
            n.type === 'OVERDUE_WARNING'
              ? 'danger'
              : n.type === 'PAYMENT'
                ? 'success'
                : n.type === 'PRICE_CHANGE'
                  ? 'info'
                  : 'warning';
          const palette = {
            danger: { bg: '#FEE2E2', icon: Colors.red },
            success: { bg: '#E8F5E9', icon: Colors.primary },
            info: { bg: '#DBEAFE', icon: Colors.blue },
            warning: { bg: '#FEF3C7', icon: Colors.orange },
          }[tone];
          const iconName: IoniconName =
            n.type === 'OVERDUE_WARNING'
              ? 'warning'
              : n.type === 'PAYMENT'
                ? 'checkmark-circle'
                : n.type === 'PRICE_CHANGE'
                  ? 'trending-up'
                  : n.type === 'INVOICE'
                    ? 'receipt'
                    : 'information-circle';
          return (
            <Card key={n.id} padding="md" className="mb-2">
              <View className="flex-row items-start">
                <View
                  className="w-9 h-9 rounded-full items-center justify-center mr-3"
                  style={{ backgroundColor: palette.bg }}
                >
                  <Ionicons name={iconName} size={18} color={palette.icon} />
                </View>
                <View className="flex-1">
                  <Text
                    className={`text-sm ${
                      n.read
                        ? 'font-medium text-ink-muted'
                        : 'font-semibold text-ink'
                    }`}
                    numberOfLines={1}
                  >
                    {n.title}
                  </Text>
                  <Text
                    className="text-xs text-ink-muted mt-0.5"
                    numberOfLines={2}
                  >
                    {n.message}
                  </Text>
                </View>
                {!n.read && (
                  <View className="w-2 h-2 rounded-full bg-mnd-green mt-1.5 ml-2" />
                )}
              </View>
            </Card>
          );
        })}
      </View>
    </ScrollView>
  );
}
