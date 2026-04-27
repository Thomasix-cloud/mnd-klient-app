import { useMemo, useState } from 'react';
import { View, Text, FlatList, Pressable } from 'react-native';
import { router } from 'expo-router';
import { mockInvoices } from '@/data/mock-invoices';
import { mockSupplyPoints } from '@/data/mock-supply-points';
import {
  formatCurrency,
  formatDate,
  getEnergyTypeLabel,
  getInvoiceStatusLabel,
} from '@/utils/format';
import { getInvoiceTone, getInvoiceIcon } from '@/utils/tones';
import { Invoice, InvoiceStatus } from '@/types';
import { Alert } from '@/components/ui/Alert';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { EnergyAvatar } from '@/components/ui/EnergyAvatar';

const FILTERS: { label: string; value: InvoiceStatus | 'ALL' }[] = [
  { label: 'Všechny', value: 'ALL' },
  { label: 'Po splatnosti', value: 'OVERDUE' },
  { label: 'Nezaplacené', value: 'UNPAID' },
  { label: 'Zaplacené', value: 'PAID' },
];

export default function InvoicesScreen() {
  const [filter, setFilter] = useState<InvoiceStatus | 'ALL'>('ALL');

  const filtered = useMemo(
    () =>
      filter === 'ALL'
        ? mockInvoices
        : mockInvoices.filter((i) => i.status === filter),
    [filter],
  );

  const totalUnpaid = mockInvoices
    .filter((i) => i.status === 'UNPAID' || i.status === 'OVERDUE')
    .reduce((s, i) => s + i.amount, 0);
  const overdueCount = mockInvoices.filter(
    (i) => i.status === 'OVERDUE',
  ).length;

  const getSupplyPoint = (spId: string) =>
    mockSupplyPoints.find((sp) => sp.id === spId);

  const renderInvoice = ({ item }: { item: Invoice }) => {
    const sp = getSupplyPoint(item.supplyPointId);
    const tone = getInvoiceTone(item.status);
    return (
      <Pressable
        onPress={() => router.push(`/invoices/${item.id}`)}
        className="mx-5 mb-3"
      >
        {({ pressed }) => (
          <Card style={{ opacity: pressed ? 0.85 : 1 }}>
            <View className="flex-row items-center justify-between mb-2.5">
              <View className="flex-row items-center flex-1 min-w-0">
                {sp && <EnergyAvatar type={sp.type} size="sm" />}
                <View className="ml-3 flex-1 min-w-0">
                  <Text
                    className="text-sm font-semibold text-ink"
                    numberOfLines={1}
                  >
                    {item.type === 'ADVANCE' ? 'Záloha' : 'Vyúčtování'}
                    {sp ? ` • ${getEnergyTypeLabel(sp.type)}` : ''}
                  </Text>
                  <Text className="text-xs text-ink-muted">
                    č. {item.invoiceNumber}
                  </Text>
                </View>
              </View>
              <Badge
                label={getInvoiceStatusLabel(item.status)}
                tone={tone}
                icon={getInvoiceIcon(item.status)}
              />
            </View>
            <View className="flex-row items-end justify-between pt-2.5 border-t border-line-subtle">
              <View className="flex-1 min-w-0">
                <Text className="text-xs text-ink-muted" numberOfLines={1}>
                  {sp?.address.street}, {sp?.address.city}
                </Text>
                <Text className="text-xs text-ink-muted mt-0.5">
                  Splatnost: {formatDate(item.dueDate)}
                </Text>
              </View>
              <Text className="text-lg font-bold text-ink ml-2">
                {formatCurrency(item.amount)}
              </Text>
            </View>
          </Card>
        )}
      </Pressable>
    );
  };

  return (
    <View className="flex-1 bg-surface">
      {totalUnpaid > 0 && (
        <View className="mx-5 mt-3 mb-1">
          <Alert
            tone={overdueCount > 0 ? 'danger' : 'warning'}
            title={
              overdueCount > 0
                ? `${overdueCount} faktura po splatnosti`
                : 'Máte neuhrazené faktury'
            }
            message={`K úhradě celkem: ${formatCurrency(totalUnpaid)}`}
          />
        </View>
      )}

      <View className="flex-row px-5 py-3 gap-2">
        {FILTERS.map((f) => {
          const active = filter === f.value;
          return (
            <Pressable
              key={f.value}
              onPress={() => setFilter(f.value)}
              hitSlop={6}
            >
              {({ pressed }) => (
                <View
                  className={`rounded-full px-3.5 py-2 ${
                    active ? 'bg-mnd-green' : 'bg-white'
                  }`}
                  style={{
                    opacity: pressed ? 0.8 : 1,
                    borderWidth: 1,
                    borderColor: active ? 'transparent' : '#E5E7EB',
                  }}
                >
                  <Text
                    className={`text-xs font-semibold ${
                      active ? 'text-white' : 'text-ink-muted'
                    }`}
                  >
                    {f.label}
                  </Text>
                </View>
              )}
            </Pressable>
          );
        })}
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={renderInvoice}
        contentContainerStyle={{ paddingBottom: 32 }}
        ListEmptyComponent={
          <EmptyState
            icon="receipt-outline"
            title="Žádné faktury"
            message="V tomto filtru nejsou žádné položky."
          />
        }
      />
    </View>
  );
}
