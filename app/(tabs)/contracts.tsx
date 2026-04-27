import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { mockContracts } from '@/data/mock-contracts';
import { mockSupplyPoints } from '@/data/mock-supply-points';
import { Colors } from '@/constants/colors';
import {
  getEnergyTypeIcon,
  getEnergyTypeLabel,
  getFixationLabel,
  formatCurrency,
  formatDate,
} from '@/utils/format';
import { Contract } from '@/types';

export default function ContractsScreen() {
  const activeContracts = mockContracts.filter((c) => c.status === 'ACTIVE');
  const pastContracts = mockContracts.filter((c) => c.status === 'TERMINATED');

  const getSupplyPoint = (spId: string) =>
    mockSupplyPoints.find((sp) => sp.id === spId);

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

  const renderContract = ({ item }: { item: Contract }) => {
    const sp = getSupplyPoint(item.supplyPointId);
    const fixStyle = getFixationColor(item.fixation.type);
    const isTerminated = item.status === 'TERMINATED';

    return (
      <TouchableOpacity
        className="bg-white rounded-2xl p-4 mx-5 mb-3 shadow-sm"
        style={{ opacity: isTerminated ? 0.6 : 1 }}
        onPress={() => router.push(`/contracts/${item.id}`)}
      >
        <View className="flex-row items-center justify-between mb-3">
          <View className="flex-row items-center">
            <View
              className="w-11 h-11 rounded-full items-center justify-center mr-3"
              style={{
                backgroundColor:
                  item.type === 'ELECTRICITY' ? '#DBEAFE' : '#FEF3C7',
              }}
            >
              <Ionicons
                name={getEnergyTypeIcon(item.type) as any}
                size={22}
                color={
                  item.type === 'ELECTRICITY' ? Colors.electricity : Colors.gas
                }
              />
            </View>
            <View>
              <Text className="text-sm font-semibold text-[#1B1B1B]">
                {getEnergyTypeLabel(item.type)}
              </Text>
              <Text className="text-xs text-[#6B7280]">
                {sp?.contractNumber}
              </Text>
            </View>
          </View>
          {isTerminated ? (
            <View className="bg-[#F5F5F5] rounded-full px-2.5 py-1">
              <Text className="text-xs text-[#6B7280] font-medium">
                Ukončena
              </Text>
            </View>
          ) : (
            <View className="bg-[#E8F5E9] rounded-full px-2.5 py-1">
              <Text className="text-xs text-[#00A651] font-medium">
                Aktivní
              </Text>
            </View>
          )}
        </View>

        {/* Price Plan */}
        <Text className="text-sm text-[#1B1B1B] mb-2">{item.pricePlan}</Text>

        {/* Fixation & Price */}
        <View className="flex-row items-center gap-2 mb-2">
          <View
            className="rounded-full px-2.5 py-1"
            style={{ backgroundColor: fixStyle.bg }}
          >
            <Text
              className="text-xs font-medium"
              style={{ color: fixStyle.text }}
            >
              {getFixationLabel(item.fixation.type)}
            </Text>
          </View>
          <Text className="text-xs text-[#6B7280]">
            {formatCurrency(item.fixation.pricePerMWh)}/MWh
          </Text>
          {item.fixation.validUntil && (
            <Text className="text-xs text-[#6B7280]">
              do {formatDate(item.fixation.validUntil)}
            </Text>
          )}
        </View>

        {/* Business Opportunities */}
        {item.businessOpportunities.length > 0 && (
          <View className="flex-row gap-2 mt-1">
            {item.businessOpportunities.map((opp, i) => (
              <View key={i} className="bg-[#FEF3C7] rounded-full px-2.5 py-1">
                <Text className="text-xs text-[#F59E0B] font-medium">
                  💡 {opp}
                </Text>
              </View>
            ))}
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View className="flex-1 bg-[#F5F5F5]">
      <FlatList
        data={[...activeContracts, ...pastContracts]}
        keyExtractor={(item) => item.id}
        renderItem={renderContract}
        contentContainerStyle={{ paddingTop: 12, paddingBottom: 20 }}
        ListHeaderComponent={
          <View className="px-5 mb-2">
            <Text className="text-xs text-[#6B7280]">
              {activeContracts.length} aktivní
              {activeContracts.length > 1 ? 'ch' : ''} smluv
            </Text>
          </View>
        }
      />
    </View>
  );
}
