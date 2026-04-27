import { View, Text, ScrollView, Pressable } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { mockContracts } from '@/data/mock-contracts';
import { mockSupplyPoints } from '@/data/mock-supply-points';
import { Colors } from '@/constants/colors';
import {
  formatCurrency,
  formatDate,
  formatEAN,
  getEnergyTypeLabel,
  getFixationLabel,
} from '@/utils/format';
import { getContractTone, getFixationTone } from '@/utils/tones';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { InfoRow } from '@/components/ui/InfoRow';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { EnergyAvatar } from '@/components/ui/EnergyAvatar';
import { EmptyState } from '@/components/ui/EmptyState';

export default function ContractDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const contract = mockContracts.find((c) => c.id === id);
  const sp = contract
    ? mockSupplyPoints.find((s) => s.id === contract.supplyPointId)
    : undefined;

  if (!contract || !sp) {
    return (
      <View className="flex-1 bg-surface">
        <EmptyState icon="alert-circle-outline" title="Smlouva nenalezena" />
      </View>
    );
  }

  const fixTone = getFixationTone(contract.fixation.type);
  const isTerminated = contract.status === 'TERMINATED';

  // Days until fixation expires
  const daysUntilFixEnd = contract.fixation.validUntil
    ? Math.ceil(
        (new Date(contract.fixation.validUntil).getTime() - Date.now()) /
          (1000 * 60 * 60 * 24),
      )
    : null;

  return (
    <ScrollView
      className="flex-1 bg-surface"
      contentContainerStyle={{ paddingBottom: 32 }}
    >
      {/* Hero */}
      <View className="px-5 mt-4">
        <Card padding="lg" style={{ opacity: isTerminated ? 0.7 : 1 }}>
          <View className="flex-row items-center mb-4">
            <EnergyAvatar type={contract.type} size="lg" />
            <View className="flex-1 ml-3 min-w-0">
              <Text className="text-lg font-bold text-ink">
                {getEnergyTypeLabel(contract.type)}
              </Text>
              <Text className="text-sm text-ink-muted" numberOfLines={1}>
                {sp.contractNumber}
              </Text>
            </View>
            <Badge
              label={
                contract.status === 'ACTIVE'
                  ? 'Aktivní'
                  : contract.status === 'PENDING'
                    ? 'Čekající'
                    : 'Ukončena'
              }
              tone={getContractTone(contract.status)}
            />
          </View>
          <Text className="text-base font-semibold text-ink">
            {contract.pricePlan}
          </Text>
        </Card>
      </View>

      {/* Fixation card */}
      <View className="px-5 mt-5">
        <SectionHeader title="Cena a fixace" />
        <Card padding="lg">
          <View className="flex-row items-center mb-3">
            <Badge
              label={getFixationLabel(contract.fixation.type)}
              tone={fixTone}
              icon={
                contract.fixation.type === 'FIXED'
                  ? 'lock-closed'
                  : contract.fixation.type === 'DECLINING'
                    ? 'trending-down'
                    : 'lock-open'
              }
            />
          </View>

          <View className="flex-row mt-2">
            <View className="flex-1">
              <Text className="text-2xs text-ink-muted uppercase tracking-wider">
                Cena za MWh
              </Text>
              <Text className="text-xl font-bold text-ink mt-1">
                {formatCurrency(contract.fixation.pricePerMWh)}
              </Text>
            </View>
            {contract.fixation.validUntil && (
              <View className="flex-1">
                <Text className="text-2xs text-ink-muted uppercase tracking-wider">
                  Platnost do
                </Text>
                <Text className="text-xl font-bold text-ink mt-1">
                  {formatDate(contract.fixation.validUntil)}
                </Text>
                {daysUntilFixEnd !== null &&
                  daysUntilFixEnd > 0 &&
                  daysUntilFixEnd <= 90 && (
                    <Text className="text-2xs text-warning-text mt-1 font-semibold">
                      Končí za {daysUntilFixEnd} dní
                    </Text>
                  )}
              </View>
            )}
          </View>
        </Card>
      </View>

      {/* Detail */}
      <View className="px-5 mt-5">
        <SectionHeader title="Detail smlouvy" />
        <Card padding="md">
          <InfoRow
            icon="location-outline"
            label="Odběrné místo"
            value={`${sp.address.street}, ${sp.address.city}`}
          />
          <InfoRow
            icon="finger-print-outline"
            label={sp.type === 'ELECTRICITY' ? 'EAN' : 'EIC'}
            value={formatEAN(sp.identifier)}
          />
          <InfoRow
            icon="calendar-outline"
            label="Začátek smlouvy"
            value={formatDate(contract.startDate)}
            withDivider={!!contract.endDate}
          />
          {contract.endDate && (
            <InfoRow
              icon="stop-circle-outline"
              label="Konec smlouvy"
              value={formatDate(contract.endDate)}
              withDivider={false}
            />
          )}
        </Card>
      </View>

      {/* Business opportunities */}
      {contract.businessOpportunities.length > 0 && !isTerminated && (
        <View className="px-5 mt-5">
          <SectionHeader title="Příležitosti pro vás" />
          {contract.businessOpportunities.map((opp, i) => (
            <Pressable key={i} className="mb-2">
              {({ pressed }) => (
                <View
                  className="rounded-2xl p-4 flex-row items-center"
                  style={{
                    backgroundColor: '#FEF3C7',
                    borderWidth: 1,
                    borderColor: '#FCD34D',
                    opacity: pressed ? 0.85 : 1,
                  }}
                >
                  <View className="w-9 h-9 rounded-full bg-warning items-center justify-center mr-3">
                    <Ionicons name="bulb" size={18} color="#fff" />
                  </View>
                  <View className="flex-1">
                    <Text className="text-sm font-bold text-warning-text">
                      {opp}
                    </Text>
                    <Text className="text-xs text-warning-text opacity-80 mt-0.5">
                      Klikněte pro více informací
                    </Text>
                  </View>
                  <Ionicons
                    name="chevron-forward"
                    size={18}
                    color={Colors.orange}
                  />
                </View>
              )}
            </Pressable>
          ))}
        </View>
      )}

      {/* CTA */}
      {!contract.fixation.active && contract.status === 'ACTIVE' && (
        <View className="px-5 mt-6">
          <Button
            label="Požádat o cenovou fixaci"
            icon="lock-closed-outline"
            size="lg"
            fullWidth
          />
        </View>
      )}
    </ScrollView>
  );
}
