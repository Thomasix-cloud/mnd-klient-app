import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { mockInvoices } from '@/data/mock-invoices';
import { mockSupplyPoints } from '@/data/mock-supply-points';
import {
  formatCurrency,
  formatDate,
  getEnergyTypeLabel,
  getEnergyTypeIcon,
} from '@/utils/format';

export default function InvoiceDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const invoice = mockInvoices.find((i) => i.id === id);
  const sp = invoice
    ? mockSupplyPoints.find((s) => s.id === invoice.supplyPointId)
    : undefined;

  if (!invoice) {
    return (
      <View className="flex-1 items-center justify-center bg-[#F5F5F5]">
        <Text className="text-[#6B7280]">Faktura nenalezena</Text>
      </View>
    );
  }

  const statusConfig = (
    {
      PAID: {
        bg: '#E8F5E9',
        text: '#00A651',
        label: 'Zaplaceno',
        icon: 'checkmark-circle' as const,
      },
      UNPAID: {
        bg: '#FEF3C7',
        text: '#F59E0B',
        label: 'Nezaplaceno',
        icon: 'time' as const,
      },
      OVERDUE: {
        bg: '#FEE2E2',
        text: '#EF4444',
        label: 'Po splatnosti',
        icon: 'warning' as const,
      },
    } as const
  )[invoice.status];

  return (
    <ScrollView className="flex-1 bg-[#F5F5F5]">
      {/* Status Card */}
      <View
        className="mx-5 mt-4 rounded-2xl p-5 items-center"
        style={{ backgroundColor: statusConfig.bg }}
      >
        <Ionicons
          name={statusConfig.icon}
          size={40}
          color={statusConfig.text}
        />
        <Text
          className="text-lg font-bold mt-2"
          style={{ color: statusConfig.text }}
        >
          {statusConfig.label}
        </Text>
        <Text className="text-3xl font-bold text-[#1B1B1B] mt-1">
          {formatCurrency(invoice.amount)}
        </Text>
        <Text className="text-sm text-[#6B7280] mt-1">
          č. {invoice.invoiceNumber}
        </Text>
      </View>

      {/* Details */}
      <View className="bg-white mx-5 mt-4 rounded-2xl p-4 shadow-sm">
        <Text className="text-sm font-semibold text-[#1B1B1B] mb-3">
          Detail
        </Text>
        {[
          {
            label: 'Typ',
            value: invoice.type === 'ADVANCE' ? 'Záloha' : 'Vyúčtování',
          },
          { label: 'Energie', value: sp ? getEnergyTypeLabel(sp.type) : '-' },
          {
            label: 'Odběrné místo',
            value: sp ? `${sp.address.street}, ${sp.address.city}` : '-',
          },
          {
            label: 'Období',
            value: `${formatDate(invoice.period.from)} – ${formatDate(invoice.period.to)}`,
          },
          { label: 'Datum vystavení', value: formatDate(invoice.issuedDate) },
          { label: 'Splatnost', value: formatDate(invoice.dueDate) },
          ...(invoice.paidDate
            ? [{ label: 'Zaplaceno', value: formatDate(invoice.paidDate) }]
            : []),
        ].map((row, i) => (
          <View
            key={i}
            className="flex-row justify-between py-2.5 border-b border-[#F5F5F5]"
          >
            <Text className="text-sm text-[#6B7280]">{row.label}</Text>
            <Text className="text-sm font-medium text-[#1B1B1B]">
              {row.value}
            </Text>
          </View>
        ))}
      </View>

      {/* Breakdown */}
      {invoice.breakdown && (
        <View className="bg-white mx-5 mt-4 rounded-2xl p-4 shadow-sm">
          <Text className="text-sm font-semibold text-[#1B1B1B] mb-3">
            Rozpis
          </Text>
          {[
            {
              label: 'Regulovaná složka',
              value: invoice.breakdown.regulatedComponent,
            },
            {
              label: 'Neregulovaná složka',
              value: invoice.breakdown.unregulatedComponent,
            },
            { label: 'DPH', value: invoice.breakdown.tax },
          ].map((row, i) => (
            <View
              key={i}
              className="flex-row justify-between py-2.5 border-b border-[#F5F5F5]"
            >
              <Text className="text-sm text-[#6B7280]">{row.label}</Text>
              <Text className="text-sm text-[#1B1B1B]">
                {formatCurrency(row.value)}
              </Text>
            </View>
          ))}
          <View className="flex-row justify-between py-2.5 mt-1">
            <Text className="text-sm font-semibold text-[#1B1B1B]">Celkem</Text>
            <Text className="text-sm font-bold text-[#1B1B1B]">
              {formatCurrency(invoice.amount)}
            </Text>
          </View>
        </View>
      )}

      {/* QR Payment */}
      {invoice.qrPaymentData && invoice.status !== 'PAID' && (
        <View className="bg-white mx-5 mt-4 mb-6 rounded-2xl p-5 items-center shadow-sm">
          <Text className="text-sm font-semibold text-[#1B1B1B] mb-3">
            Rychlá platba QR kódem
          </Text>
          <View className="w-40 h-40 bg-[#F5F5F5] rounded-xl items-center justify-center mb-3">
            <Ionicons name="qr-code" size={80} color="#1B1B1B" />
          </View>
          <Text className="text-xs text-[#6B7280] text-center">
            Naskenujte QR kód v bankovní aplikaci
          </Text>
          <TouchableOpacity className="bg-[#00A651] rounded-xl py-3 px-8 mt-4">
            <Text className="text-white text-sm font-semibold">Zaplatit</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
}
