import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { formatCurrency } from '@/utils/format';

type EnergyType = 'ELECTRICITY' | 'GAS';
type CustomerType = 'HOUSEHOLD' | 'BUSINESS';

interface PriceResult {
  planName: string;
  monthlyPayment: number;
  pricePerMWh: number;
  fixationType: string;
}

export default function CalculatorScreen() {
  const [postalCode, setPostalCode] = useState('13000');
  const [consumption, setConsumption] = useState('4.5');
  const [energyType, setEnergyType] = useState<EnergyType>('ELECTRICITY');
  const [customerType, setCustomerType] = useState<CustomerType>('HOUSEHOLD');
  const [results, setResults] = useState<PriceResult[] | null>(null);

  const calculate = () => {
    const mwh = parseFloat(consumption);

    if (isNaN(mwh) || mwh <= 0 || mwh > 1000) {
      setResults(null);
      return;
    }

    if (energyType === 'ELECTRICITY') {
      setResults([
        {
          planName: 'Pevná cena — Ceník Srpen 28',
          monthlyPayment: Math.round((mwh * 3200) / 12 + 520),
          pricePerMWh: 3200,
          fixationType: 'Pevná cena do 08/2028',
        },
        {
          planName: 'Klesající ceník Prosinec 28',
          monthlyPayment: Math.round((mwh * 2900) / 12 + 520),
          pricePerMWh: 2900,
          fixationType: 'Klesající cena do 12/2028',
        },
        {
          planName: 'Standard — bez závazků',
          monthlyPayment: Math.round((mwh * 3400) / 12 + 520),
          pricePerMWh: 3400,
          fixationType: 'Bez fixace, výpověď 3 měs.',
        },
      ]);
    } else {
      setResults([
        {
          planName: 'Plyn z první ruky — Ceník Srpen 28',
          monthlyPayment: Math.round((mwh * 1647) / 12 + 380),
          pricePerMWh: 1647,
          fixationType: 'Pevná cena do 08/2028',
        },
        {
          planName: 'Klesající ceník Prosinec 28',
          monthlyPayment: Math.round((mwh * 1500) / 12 + 380),
          pricePerMWh: 1500,
          fixationType: 'Klesající cena do 12/2028',
        },
        {
          planName: 'Standard — bez závazků',
          monthlyPayment: Math.round((mwh * 1800) / 12 + 380),
          pricePerMWh: 1800,
          fixationType: 'Bez fixace, výpověď 3 měs.',
        },
      ]);
    }
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-[#F5F5F5]"
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={{ paddingBottom: 30 }}
        keyboardShouldPersistTaps="handled"
      >
        {/* Input Form */}
        <View className="bg-white mx-5 mt-4 rounded-2xl p-5 shadow-sm">
          {/* Energy Type Toggle */}
          <Text className="text-sm font-semibold text-[#1B1B1B] mb-2">
            Typ energie
          </Text>
          <View className="flex-row bg-[#F5F5F5] rounded-xl p-1 mb-4">
            {(['ELECTRICITY', 'GAS'] as EnergyType[]).map((type) => (
              <TouchableOpacity
                key={type}
                className="flex-1 rounded-lg py-2.5 items-center"
                style={{
                  backgroundColor:
                    energyType === type ? '#FFFFFF' : 'transparent',
                }}
                onPress={() => setEnergyType(type)}
              >
                <View className="flex-row items-center">
                  <Ionicons
                    name={type === 'ELECTRICITY' ? 'flash' : 'flame'}
                    size={16}
                    color={type === 'ELECTRICITY' ? '#3B82F6' : '#F59E0B'}
                  />
                  <Text
                    className="ml-1.5 text-sm font-medium"
                    style={{
                      color: energyType === type ? '#1B1B1B' : '#6B7280',
                    }}
                  >
                    {type === 'ELECTRICITY' ? 'Elektřina' : 'Plyn'}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>

          {/* Customer Type */}
          <Text className="text-sm font-semibold text-[#1B1B1B] mb-2">
            Typ odběratele
          </Text>
          <View className="flex-row bg-[#F5F5F5] rounded-xl p-1 mb-4">
            {(['HOUSEHOLD', 'BUSINESS'] as CustomerType[]).map((type) => (
              <TouchableOpacity
                key={type}
                className="flex-1 rounded-lg py-2.5 items-center"
                style={{
                  backgroundColor:
                    customerType === type ? '#FFFFFF' : 'transparent',
                }}
                onPress={() => setCustomerType(type)}
              >
                <Text
                  className="text-sm font-medium"
                  style={{
                    color: customerType === type ? '#1B1B1B' : '#6B7280',
                  }}
                >
                  {type === 'HOUSEHOLD' ? 'Domácnost' : 'Firma'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* PSČ */}
          <Text className="text-sm font-semibold text-[#1B1B1B] mb-1.5">
            PSČ odběrného místa
          </Text>
          <TextInput
            className="bg-[#F5F5F5] rounded-xl px-4 py-3 text-base text-[#1B1B1B] mb-4"
            value={postalCode}
            onChangeText={setPostalCode}
            keyboardType="number-pad"
            maxLength={5}
            placeholder="Např. 13000"
            placeholderTextColor="#9CA3AF"
          />

          {/* Consumption */}
          <Text className="text-sm font-semibold text-[#1B1B1B] mb-1.5">
            Roční spotřeba ({energyType === 'ELECTRICITY' ? 'MWh' : 'MWh'})
          </Text>
          <TextInput
            className="bg-[#F5F5F5] rounded-xl px-4 py-3 text-base text-[#1B1B1B] mb-5"
            value={consumption}
            onChangeText={setConsumption}
            keyboardType="decimal-pad"
            placeholder="Např. 4.5"
            placeholderTextColor="#9CA3AF"
          />

          <TouchableOpacity
            className="bg-[#00A651] rounded-xl py-3.5 items-center"
            onPress={calculate}
          >
            <Text className="text-white text-base font-semibold">
              Spočítat cenu
            </Text>
          </TouchableOpacity>
        </View>

        {/* Results */}
        {results && (
          <View className="px-5 mt-4">
            <Text className="text-base font-semibold text-[#1B1B1B] mb-3">
              Porovnání ceníků
            </Text>
            {results.map((r, i) => (
              <View
                key={i}
                className="bg-white rounded-2xl p-4 mb-3 shadow-sm"
                style={
                  i === 0 ? { borderWidth: 2, borderColor: '#00A651' } : {}
                }
              >
                {i === 0 && (
                  <View className="bg-[#00A651] rounded-full px-2.5 py-0.5 self-start mb-2">
                    <Text className="text-xs text-white font-semibold">
                      Doporučujeme
                    </Text>
                  </View>
                )}
                <Text className="text-sm font-semibold text-[#1B1B1B] mb-1">
                  {r.planName}
                </Text>
                <Text className="text-xs text-[#6B7280] mb-3">
                  {r.fixationType}
                </Text>
                <View className="flex-row items-end justify-between">
                  <View>
                    <Text className="text-xs text-[#6B7280]">
                      Měsíční platba
                    </Text>
                    <Text className="text-2xl font-bold text-[#1B1B1B]">
                      {formatCurrency(r.monthlyPayment)}
                    </Text>
                  </View>
                  <View className="items-end">
                    <Text className="text-xs text-[#6B7280]">Cena za MWh</Text>
                    <Text className="text-base font-semibold text-[#1B1B1B]">
                      {formatCurrency(r.pricePerMWh)}
                    </Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
