import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { mockSupplyPoints } from '@/data/mock-supply-points';
import { Colors } from '@/constants/colors';
import { getEnergyTypeIcon, getEnergyTypeLabel } from '@/utils/format';
import { SupplyPoint } from '@/types';

export default function SupplyPointsScreen() {
  const renderItem = ({ item }: { item: SupplyPoint }) => (
    <TouchableOpacity
      className="bg-white rounded-2xl p-4 mx-5 mb-3 flex-row items-center shadow-sm"
      onPress={() => router.push(`/supply-points/${item.id}`)}
    >
      <View
        className="w-12 h-12 rounded-full items-center justify-center mr-3"
        style={{
          backgroundColor: item.type === 'ELECTRICITY' ? '#DBEAFE' : '#FEF3C7',
        }}
      >
        <Ionicons
          name={getEnergyTypeIcon(item.type)}
          size={24}
          color={item.type === 'ELECTRICITY' ? Colors.electricity : Colors.gas}
        />
      </View>
      <View className="flex-1">
        <Text className="text-base font-semibold text-[#1B1B1B]">
          {getEnergyTypeLabel(item.type)}
        </Text>
        <Text className="text-sm text-[#6B7280]">
          {item.address.street}, {item.address.city}
        </Text>
        <Text className="text-xs text-[#6B7280] mt-0.5">
          {item.contractNumber}
        </Text>
      </View>
      <View className="items-end">
        <View className="bg-[#E8F5E9] rounded-full px-2.5 py-1 mb-1">
          <Text className="text-xs text-[#00A651] font-medium">Aktivní</Text>
        </View>
      </View>
      <Ionicons
        name="chevron-forward"
        size={16}
        color="#D1D5DB"
        style={{ marginLeft: 8 }}
      />
    </TouchableOpacity>
  );

  return (
    <View className="flex-1 bg-[#F5F5F5]">
      <FlatList
        data={mockSupplyPoints}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingTop: 12, paddingBottom: 20 }}
      />
    </View>
  );
}
