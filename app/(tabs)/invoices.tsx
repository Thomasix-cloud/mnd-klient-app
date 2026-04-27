import { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { mockInvoices } from '@/data/mock-invoices';
import { mockSupplyPoints } from '@/data/mock-supply-points';
import {
  formatCurrency,
  formatDate,
  getEnergyTypeIcon,
  getEnergyTypeLabel,
} from '@/utils/format';
import { Invoice, InvoiceStatus } from '@/types';

const FILTERS: { label: string; value: InvoiceStatus | 'ALL' }[] = [
  { label: 'Všechny', value: 'ALL' },
  { label: 'Nezaplacené', value: 'UNPAID' },
  { label: 'Po splatnosti', value: 'OVERDUE' },
  { label: 'Zaplacené', value: 'PAID' },
];

export default function InvoicesScreen() {
  const [filter, setFilter] = useState<InvoiceStatus | 'ALL'>('ALL');

  const filtered =
    filter === 'ALL'
      ? mockInvoices
      : mockInvoices.filter((i) => i.status === filter);

  const totalUnpaid = mockInvoices
    .filter((i) => i.status === 'UNPAID' || i.status === 'OVERDUE')
    .reduce((s, i) => s + i.amount, 0);

  const getSupplyPoint = (spId: string) =>
    mockSupplyPoints.find((sp) => sp.id === spId);

  const getStatusColor = (status: InvoiceStatus) => {
    switch (status) {
      case 'PAID':
        return { bg: '#E8F5E9', text: '#00A651' };
      case 'UNPAID':
        return { bg: '#FEF3C7', text: '#F59E0B' };
      case 'OVERDUE':
        return { bg: '#FEE2E2', text: '#EF4444' };
    }
  };

  const getStatusLabel = (status: InvoiceStatus) => {
    switch (status) {
      case 'PAID':
        return 'Zaplaceno';
      case 'UNPAID':
        return 'Nezaplaceno';
      case 'OVERDUE':
        return 'Po splatnosti';
    }
  };

  const renderInvoice = ({ item }: { item: Invoice }) => {
    const sp = getSupplyPoint(item.supplyPointId);
    const statusStyle = getStatusColor(item.status);
    return (
      <TouchableOpacity
        className="bg-white rounded-2xl p-4 mx-5 mb-3 shadow-sm"
        onPress={() => router.push(`/invoices/${item.id}`)}
      >
        <View className="flex-row items-center justify-between mb-2">
          <View className="flex-row items-center">
            <View
              className="w-9 h-9 rounded-full items-center justify-center mr-2.5"
              style={{
                backgroundColor:
                  sp?.type === 'ELECTRICITY' ? '#DBEAFE' : '#FEF3C7',
              }}
            >
              <Ionicons
                name={sp ? (getEnergyTypeIcon(sp.type) as any) : 'receipt'}
                size={18}
                color={sp?.type === 'ELECTRICITY' ? '#3B82F6' : '#F59E0B'}
              />
            </View>
            <View>
              <Text className="text-sm font-semibold text-[#1B1B1B]">
                {item.type === 'ADVANCE' ? 'Záloha' : 'Vyúčtování'} •{' '}
                {sp ? getEnergyTypeLabel(sp.type) : ''}
              </Text>
              <Text className="text-xs text-[#6B7280]">
                č. {item.invoiceNumber}
              </Text>
            </View>
          </View>
          <View
            className="rounded-full px-2.5 py-1"
            style={{ backgroundColor: statusStyle.bg }}
          >
            <Text
              className="text-xs font-medium"
              style={{ color: statusStyle.text }}
            >
              {getStatusLabel(item.status)}
            </Text>
          </View>
        </View>
        <View className="flex-row items-center justify-between">
          <View>
            <Text className="text-xs text-[#6B7280]">
              {sp?.address.street}, {sp?.address.city}
            </Text>
            <Text className="text-xs text-[#6B7280]">
              Splatnost: {formatDate(item.dueDate)}
            </Text>
          </View>
          <Text className="text-lg font-bold text-[#1B1B1B]">
            {formatCurrency(item.amount)}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View className="flex-1 bg-[#F5F5F5]">
      {/* Summary */}
      {totalUnpaid > 0 && (
        <View className="mx-5 mt-3 mb-2 bg-[#FEE2E2] rounded-xl p-3.5 flex-row items-center">
          <Ionicons name="alert-circle" size={20} color="#EF4444" />
          <Text className="ml-2 text-sm text-[#EF4444] font-medium">
            K úhradě celkem: {formatCurrency(totalUnpaid)}
          </Text>
        </View>
      )}

      {/* Filters */}
      <View className="flex-row px-5 py-3 gap-2">
        {FILTERS.map((f) => (
          <TouchableOpacity
            key={f.value}
            className="rounded-full px-3.5 py-2"
            style={{
              backgroundColor: filter === f.value ? '#00A651' : '#FFFFFF',
            }}
            onPress={() => setFilter(f.value)}
          >
            <Text
              className="text-xs font-medium"
              style={{
                color: filter === f.value ? '#FFFFFF' : '#6B7280',
              }}
            >
              {f.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* List */}
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={renderInvoice}
        contentContainerStyle={{ paddingBottom: 20 }}
        ListEmptyComponent={
          <View className="items-center py-12">
            <Ionicons name="receipt-outline" size={48} color="#D1D5DB" />
            <Text className="text-[#6B7280] mt-3">Žádné faktury</Text>
          </View>
        }
      />
    </View>
  );
}
