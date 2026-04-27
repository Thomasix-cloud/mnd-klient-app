import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { mockContracts } from '@/data/mock-contracts';
import { mockSupplyPoints } from '@/data/mock-supply-points';
import { Colors } from '@/constants/colors';
import {
  formatCurrency,
  formatDate,
  getEnergyTypeIcon,
  getEnergyTypeLabel,
  getFixationLabel,
  formatEAN,
} from '@/utils/format';

export default function ContractDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const contract = mockContracts.find((c) => c.id === id);
  const sp = contract
    ? mockSupplyPoints.find((s) => s.id === contract.supplyPointId)
    : undefined;

  if (!contract) {
    return (
      <View className="flex-1 items-center justify-center bg-[#F5F5F5]">
        <Text className="text-[#6B7280]">Smlouva nenalezena</Text>
      </View>
    );
  }

  const getFixationColor = (type: 'FIXED' | 'DECLINING' | 'NONE') => {
    switch (type) {
      case 'FIXED':
        return { bg: '#E8F5E9', text: '#00A651' };
      case 'DECLINING':
        return { bg: '#DBEAFE', text: '#3B82F6' };
      case 'NONE':
        return { bg: '#FEF3C7', text: '#F59E0B' };
    }
  };

  const fixStyle = getFixationColor(contract.fixation.type);

  return (
    <ScrollView className="flex-1 bg-[#F5F5F5]">
      {/* Header Card */}
      <View className="bg-white mx-5 mt-4 rounded-2xl p-5 shadow-sm">
        <View className="flex-row items-center mb-4">
          <View
            className="w-14 h-14 rounded-full items-center justify-center mr-4"
            style={{
              backgroundColor:
                contract.type === 'ELECTRICITY' ? '#DBEAFE' : '#FEF3C7',
            }}
          >
            <Ionicons
              name={getEnergyTypeIcon(contract.type) as any}
              size={28}
              color={
                contract.type === 'ELECTRICITY'
                  ? Colors.electricity
                  : Colors.gas
              }
            />
          </View>
          <View className="flex-1">
            <Text className="text-lg font-bold text-[#1B1B1B]">
              {getEnergyTypeLabel(contract.type)}
            </Text>
            <Text className="text-sm text-[#6B7280]">{sp?.contractNumber}</Text>
          </View>
          <View
            className="rounded-full px-3 py-1"
            style={{
              backgroundColor:
                contract.status === 'ACTIVE' ? '#E8F5E9' : '#F5F5F5',
            }}
          >
            <Text
              className="text-xs font-semibold"
              style={{
                color: contract.status === 'ACTIVE' ? '#00A651' : '#6B7280',
              }}
            >
              {contract.status === 'ACTIVE' ? 'Aktivní' : 'Ukončena'}
            </Text>
          </View>
        </View>

        <Text className="text-base font-semibold text-[#1B1B1B] mb-3">
          {contract.pricePlan}
        </Text>

        {/* Fixation Info */}
        <View
          className="rounded-xl p-4 mb-2"
          style={{ backgroundColor: fixStyle.bg + '40' }}
        >
          <View className="flex-row items-center mb-2">
            <View
              className="rounded-full px-2.5 py-1"
              style={{ backgroundColor: fixStyle.bg }}
            >
              <Text
                className="text-xs font-semibold"
                style={{ color: fixStyle.text }}
              >
                {getFixationLabel(contract.fixation.type)}
              </Text>
            </View>
          </View>
          <View className="flex-row justify-between">
            <View>
              <Text className="text-xs text-[#6B7280]">Cena za MWh</Text>
              <Text className="text-lg font-bold text-[#1B1B1B]">
                {formatCurrency(contract.fixation.pricePerMWh)}
              </Text>
            </View>
            {contract.fixation.validUntil && (
              <View>
                <Text className="text-xs text-[#6B7280]">Platnost do</Text>
                <Text className="text-lg font-bold text-[#1B1B1B]">
                  {formatDate(contract.fixation.validUntil)}
                </Text>
              </View>
            )}
          </View>
        </View>
      </View>

      {/* Contract Details */}
      <View className="bg-white mx-5 mt-4 rounded-2xl p-4 shadow-sm">
        <Text className="text-sm font-semibold text-[#1B1B1B] mb-3">
          Detail smlouvy
        </Text>
        {[
          {
            label: 'Odběrné místo',
            value: sp ? `${sp.address.street}, ${sp.address.city}` : '-',
          },
          {
            label: sp?.type === 'ELECTRICITY' ? 'EAN' : 'EIC',
            value: sp ? formatEAN(sp.identifier) : '-',
          },
          { label: 'Začátek smlouvy', value: formatDate(contract.startDate) },
          ...(contract.endDate
            ? [{ label: 'Konec smlouvy', value: formatDate(contract.endDate) }]
            : []),
        ].map((row, i) => (
          <View
            key={i}
            className="flex-row justify-between py-2.5 border-b border-[#F5F5F5]"
          >
            <Text className="text-sm text-[#6B7280]">{row.label}</Text>
            <Text className="text-sm font-medium text-[#1B1B1B] max-w-[60%] text-right">
              {row.value}
            </Text>
          </View>
        ))}
      </View>

      {/* Business Opportunities */}
      {contract.businessOpportunities.length > 0 && (
        <View className="bg-white mx-5 mt-4 rounded-2xl p-4 shadow-sm">
          <Text className="text-sm font-semibold text-[#1B1B1B] mb-3">
            Obchodní příležitosti
          </Text>
          {contract.businessOpportunities.map((opp, i) => (
            <TouchableOpacity
              key={i}
              className="flex-row items-center bg-[#FEF3C7] rounded-xl p-3.5 mb-2"
            >
              <Ionicons name="bulb" size={20} color="#F59E0B" />
              <View className="flex-1 ml-3">
                <Text className="text-sm font-medium text-[#1B1B1B]">
                  {opp}
                </Text>
                <Text className="text-xs text-[#6B7280]">
                  Klikněte pro více informací
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color="#D1D5DB" />
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* CTA for fixation */}
      {!contract.fixation.active && contract.status === 'ACTIVE' && (
        <View className="mx-5 mt-4 mb-6">
          <TouchableOpacity className="bg-[#00A651] rounded-2xl py-4 items-center">
            <Text className="text-white text-base font-semibold">
              Požádat o cenovou fixaci
            </Text>
          </TouchableOpacity>
        </View>
      )}

      <View className="h-6" />
    </ScrollView>
  );
}
