import { useMemo } from 'react';
import { View, Text, SectionList, Pressable } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { mockContracts } from '@/data/mock-contracts';
import { mockSupplyPoints } from '@/data/mock-supply-points';
import { Colors } from '@/constants/colors';
import {
  getEnergyTypeLabel,
  getFixationLabel,
  formatCurrency,
  formatDate,
} from '@/utils/format';
import { getFixationTone, getContractTone } from '@/utils/tones';
import { Contract } from '@/types';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { EnergyAvatar } from '@/components/ui/EnergyAvatar';

export default function ContractsScreen() {
  const sections = useMemo(() => {
    const active = mockContracts.filter((c) => c.status === 'ACTIVE');
    const pending = mockContracts.filter((c) => c.status === 'PENDING');
    const terminated = mockContracts.filter((c) => c.status === 'TERMINATED');
    const out: { title: string; data: Contract[] }[] = [];
    if (active.length) out.push({ title: 'Aktivní', data: active });
    if (pending.length) out.push({ title: 'Čekající', data: pending });
    if (terminated.length) out.push({ title: 'Ukončené', data: terminated });
    return out;
  }, []);

  const getSupplyPoint = (spId: string) =>
    mockSupplyPoints.find((sp) => sp.id === spId);

  const renderContract = ({ item }: { item: Contract }) => {
    const sp = getSupplyPoint(item.supplyPointId);
    const isTerminated = item.status === 'TERMINATED';
    const fixTone = getFixationTone(item.fixation.type);

    return (
      <Pressable
        onPress={() => router.push(`/contracts/${item.id}`)}
        className="mx-5 mb-3"
      >
        {({ pressed }) => (
          <Card
            style={{
              opacity: isTerminated ? 0.6 : pressed ? 0.85 : 1,
            }}
          >
            <View className="flex-row items-center justify-between mb-3">
              <View className="flex-row items-center flex-1 min-w-0">
                <EnergyAvatar type={item.type} size="md" />
                <View className="ml-3 flex-1 min-w-0">
                  <Text
                    className="text-sm font-semibold text-ink"
                    numberOfLines={1}
                  >
                    {getEnergyTypeLabel(item.type)}
                  </Text>
                  <Text className="text-xs text-ink-muted" numberOfLines={1}>
                    {sp?.contractNumber}
                  </Text>
                </View>
              </View>
              <Badge
                label={
                  isTerminated
                    ? 'Ukončena'
                    : item.status === 'PENDING'
                      ? 'Čekající'
                      : 'Aktivní'
                }
                tone={getContractTone(item.status)}
              />
            </View>

            <Text className="text-sm text-ink mb-3" numberOfLines={2}>
              {item.pricePlan}
            </Text>

            <View className="flex-row flex-wrap items-center gap-2 mb-2">
              <Badge
                label={getFixationLabel(item.fixation.type)}
                tone={fixTone}
              />
              <View className="flex-row items-center">
                <Ionicons
                  name="pricetag-outline"
                  size={12}
                  color={Colors.gray}
                />
                <Text className="text-xs text-ink-muted ml-1">
                  {formatCurrency(item.fixation.pricePerMWh)}/MWh
                </Text>
              </View>
              {item.fixation.validUntil && (
                <View className="flex-row items-center">
                  <Ionicons
                    name="calendar-outline"
                    size={12}
                    color={Colors.gray}
                  />
                  <Text className="text-xs text-ink-muted ml-1">
                    do {formatDate(item.fixation.validUntil)}
                  </Text>
                </View>
              )}
            </View>

            {item.businessOpportunities.length > 0 && !isTerminated && (
              <View className="flex-row flex-wrap gap-2 mt-1 pt-3 border-t border-line-subtle">
                {item.businessOpportunities.map((opp, i) => (
                  <Badge key={i} label={opp} tone="warning" icon="bulb" />
                ))}
              </View>
            )}
          </Card>
        )}
      </Pressable>
    );
  };

  return (
    <View className="flex-1 bg-surface">
      <SectionList
        sections={sections}
        keyExtractor={(item) => item.id}
        renderItem={renderContract}
        renderSectionHeader={({ section: { title, data } }) => (
          <View className="px-5 pt-4 pb-2 flex-row items-baseline">
            <Text className="text-xs font-bold text-ink-muted uppercase tracking-wider">
              {title}
            </Text>
            <Text className="text-2xs text-ink-subtle ml-2">
              ({data.length})
            </Text>
          </View>
        )}
        contentContainerStyle={{ paddingBottom: 32 }}
        stickySectionHeadersEnabled={false}
        ListEmptyComponent={
          <EmptyState
            icon="document-text-outline"
            title="Žádné smlouvy"
            message="Aktuálně u nás nemáte žádnou smlouvu."
          />
        }
      />
    </View>
  );
}
