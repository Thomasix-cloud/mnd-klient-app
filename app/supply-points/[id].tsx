import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { mockSupplyPoints } from '@/data/mock-supply-points';
import { mockContracts } from '@/data/mock-contracts';
import { mockConsumption } from '@/data/mock-consumption';
import { mockAdvancePayments } from '@/data/mock-advance-payments';
import { Colors } from '@/constants/colors';
import {
  formatCurrency,
  formatEAN,
  getEnergyTypeIcon,
  getEnergyTypeLabel,
} from '@/utils/format';

export default function SupplyPointDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const sp = mockSupplyPoints.find((s) => s.id === id);
  const contract = sp
    ? mockContracts.find((c) => c.id === sp.linkedContractId)
    : undefined;
  const consumption = sp
    ? mockConsumption.find((c) => c.supplyPointId === sp.id)
    : undefined;
  const advance = sp
    ? mockAdvancePayments.find((a) => a.supplyPointId === sp.id)
    : undefined;

  if (!sp) {
    return (
      <View className="flex-1 items-center justify-center bg-[#F5F5F5]">
        <Text className="text-[#6B7280]">Odběrné místo nenalezeno</Text>
      </View>
    );
  }

  const advanceColor =
    advance?.status === 'OPTIMAL'
      ? '#00A651'
      : advance?.status === 'TOO_LOW'
        ? '#EF4444'
        : '#F59E0B';

  const advanceLabel =
    advance?.status === 'OPTIMAL'
      ? 'Optimální nastavení'
      : advance?.status === 'TOO_LOW'
        ? 'Zálohy jsou příliš nízké'
        : 'Zálohy jsou příliš vysoké';

  const advanceBg =
    advance?.status === 'OPTIMAL'
      ? '#E8F5E9'
      : advance?.status === 'TOO_LOW'
        ? '#FEE2E2'
        : '#FEF3C7';

  // Monthly consumption chart
  const monthlyData = consumption?.monthly ?? [];
  const maxMonthly = Math.max(...monthlyData.map((m) => m.value), 1);

  return (
    <ScrollView className="flex-1 bg-[#F5F5F5]">
      {/* Header */}
      <View className="bg-white mx-5 mt-4 rounded-2xl p-5 shadow-sm">
        <View className="flex-row items-center mb-3">
          <View
            className="w-14 h-14 rounded-full items-center justify-center mr-4"
            style={{
              backgroundColor:
                sp.type === 'ELECTRICITY' ? '#DBEAFE' : '#FEF3C7',
            }}
          >
            <Ionicons
              name={getEnergyTypeIcon(sp.type)}
              size={28}
              color={
                sp.type === 'ELECTRICITY' ? Colors.electricity : Colors.gas
              }
            />
          </View>
          <View className="flex-1">
            <Text className="text-lg font-bold text-[#1B1B1B]">
              {getEnergyTypeLabel(sp.type)}
            </Text>
            <Text className="text-sm text-[#6B7280]">
              {sp.address.street}, {sp.address.postalCode} {sp.address.city}
            </Text>
          </View>
          <View className="bg-[#E8F5E9] rounded-full px-2.5 py-1">
            <Text className="text-xs text-[#00A651] font-medium">Aktivní</Text>
          </View>
        </View>

        {[
          {
            label: sp.type === 'ELECTRICITY' ? 'EAN' : 'EIC',
            value: formatEAN(sp.identifier),
          },
          { label: 'Číslo smlouvy', value: sp.contractNumber },
          { label: 'Ceník', value: contract?.pricePlan ?? '-' },
        ].map((row, i) => (
          <View
            key={i}
            className="flex-row justify-between py-2 border-b border-[#F5F5F5]"
          >
            <Text className="text-sm text-[#6B7280]">{row.label}</Text>
            <Text className="text-sm font-medium text-[#1B1B1B] max-w-[60%] text-right">
              {row.value}
            </Text>
          </View>
        ))}
      </View>

      {/* Advance Payment "Budík" */}
      {advance && (
        <View className="bg-white mx-5 mt-4 rounded-2xl p-5 shadow-sm">
          <Text className="text-sm font-semibold text-[#1B1B1B] mb-3">
            Budík záloh
          </Text>

          {/* Gauge visualization */}
          <View className="items-center mb-4">
            <View
              className="w-32 h-32 rounded-full items-center justify-center border-8"
              style={{ borderColor: advanceColor }}
            >
              <Text className="text-2xl font-bold text-[#1B1B1B]">
                {formatCurrency(advance.monthlyAdvance)}
              </Text>
              <Text className="text-xs text-[#6B7280]">/měsíc</Text>
            </View>
          </View>

          <View
            className="rounded-xl p-3 mb-3"
            style={{ backgroundColor: advanceBg }}
          >
            <View className="flex-row items-center">
              <Ionicons
                name={
                  advance.status === 'OPTIMAL'
                    ? 'checkmark-circle'
                    : advance.status === 'TOO_LOW'
                      ? 'arrow-down-circle'
                      : 'arrow-up-circle'
                }
                size={20}
                color={advanceColor}
              />
              <Text
                className="ml-2 text-sm font-medium"
                style={{ color: advanceColor }}
              >
                {advanceLabel}
              </Text>
            </View>
            {advance.status !== 'OPTIMAL' && (
              <Text className="text-xs text-[#6B7280] mt-1 ml-7">
                Doporučená záloha: {formatCurrency(advance.recommendedAdvance)}
                /měsíc
              </Text>
            )}
          </View>

          <TouchableOpacity className="bg-[#00A651] rounded-xl py-3 items-center">
            <Text className="text-white text-sm font-semibold">
              Změnit zálohy
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Consumption Chart */}
      {monthlyData.length > 0 && (
        <View className="bg-white mx-5 mt-4 rounded-2xl p-5 shadow-sm">
          <Text className="text-sm font-semibold text-[#1B1B1B] mb-4">
            Spotřeba — posledních 12 měsíců
          </Text>

          <View className="flex-row items-end justify-between h-36">
            {monthlyData.map((m, i) => {
              const height = (m.value / maxMonthly) * 120;
              const monthLabel = m.date.split('-')[1];
              return (
                <View key={i} className="items-center flex-1">
                  <Text className="text-[9px] text-[#6B7280] mb-1">
                    {m.value}
                  </Text>
                  <View
                    className="w-4 rounded-t-sm"
                    style={{
                      height: Math.max(height, 4),
                      backgroundColor:
                        sp.type === 'ELECTRICITY'
                          ? Colors.electricity
                          : Colors.gas,
                    }}
                  />
                  <Text className="text-[9px] text-[#6B7280] mt-1">
                    {monthLabel}
                  </Text>
                </View>
              );
            })}
          </View>
          <Text className="text-xs text-[#6B7280] text-center mt-2">
            {consumption?.monthly[0]?.unit === 'kWh' ? 'kWh' : 'm³'} / měsíc
          </Text>
        </View>
      )}

      {/* Quick Actions */}
      <View className="flex-row mx-5 mt-4 mb-6 gap-3">
        <TouchableOpacity className="flex-1 bg-white rounded-2xl p-4 items-center shadow-sm">
          <Ionicons name="speedometer-outline" size={24} color="#00A651" />
          <Text className="text-xs text-[#1B1B1B] font-medium mt-2 text-center">
            Zadat samoodečet
          </Text>
        </TouchableOpacity>
        <TouchableOpacity className="flex-1 bg-white rounded-2xl p-4 items-center shadow-sm">
          <Ionicons name="cash-outline" size={24} color="#3B82F6" />
          <Text className="text-xs text-[#1B1B1B] font-medium mt-2 text-center">
            Změnit zálohy
          </Text>
        </TouchableOpacity>
        <TouchableOpacity className="flex-1 bg-white rounded-2xl p-4 items-center shadow-sm">
          <Ionicons name="document-text-outline" size={24} color="#F59E0B" />
          <Text className="text-xs text-[#1B1B1B] font-medium mt-2 text-center">
            Detail smlouvy
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
