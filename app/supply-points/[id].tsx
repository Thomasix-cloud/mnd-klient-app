import { useMemo } from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { mockSupplyPoints } from '@/data/mock-supply-points';
import { mockContracts } from '@/data/mock-contracts';
import { mockConsumption } from '@/data/mock-consumption';
import { mockAdvancePayments } from '@/data/mock-advance-payments';
import { Colors, Tones } from '@/constants/colors';
import { formatCurrency, formatEAN, getEnergyTypeLabel } from '@/utils/format';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { InfoRow } from '@/components/ui/InfoRow';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { EnergyAvatar } from '@/components/ui/EnergyAvatar';
import { Alert } from '@/components/ui/Alert';
import { EmptyState } from '@/components/ui/EmptyState';

const MONTH_NAMES = [
  'Led',
  'Úno',
  'Bře',
  'Dub',
  'Kvě',
  'Čer',
  'Čvc',
  'Srp',
  'Zář',
  'Říj',
  'Lis',
  'Pro',
];

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

  const insights = useMemo(() => {
    if (!consumption || consumption.monthly.length < 4) return null;
    const last = consumption.monthly[consumption.monthly.length - 1];
    const prev3 =
      consumption.monthly.slice(-4, -1).reduce((s, m) => s + m.value, 0) / 3;
    const yoyIdx = consumption.monthly.length - 13;
    const yoy = yoyIdx >= 0 ? consumption.monthly[yoyIdx] : null;
    const change = prev3 > 0 ? ((last.value - prev3) / prev3) * 100 : 0;
    const yoyChange =
      yoy && yoy.value > 0
        ? ((last.value - yoy.value) / yoy.value) * 100
        : null;
    return { last, prev3, change, yoyChange };
  }, [consumption]);

  if (!sp) {
    return (
      <View className="flex-1 bg-surface">
        <EmptyState
          icon="alert-circle-outline"
          title="Odběrné místo nenalezeno"
        />
      </View>
    );
  }

  const advTone =
    advance?.status === 'OPTIMAL'
      ? 'success'
      : advance?.status === 'TOO_LOW'
        ? 'danger'
        : 'warning';
  const advLabel =
    advance?.status === 'OPTIMAL'
      ? 'Optimální'
      : advance?.status === 'TOO_LOW'
        ? 'Příliš nízké'
        : 'Příliš vysoké';
  const advPalette = Tones[advTone];

  const monthly = consumption?.monthly ?? [];
  const maxMonthly = Math.max(...monthly.map((m) => m.value), 1);
  const energyColor =
    sp.type === 'ELECTRICITY' ? Colors.electricity : Colors.gas;

  return (
    <ScrollView
      className="flex-1 bg-surface"
      contentContainerStyle={{ paddingBottom: 32 }}
    >
      {/* Hero */}
      <View className="px-5 mt-4">
        <Card padding="lg">
          <View className="flex-row items-center mb-4">
            <EnergyAvatar type={sp.type} size="lg" />
            <View className="flex-1 ml-3 min-w-0">
              <Text className="text-lg font-bold text-ink">
                {getEnergyTypeLabel(sp.type)}
              </Text>
              <Text className="text-sm text-ink-muted" numberOfLines={1}>
                {sp.address.street}, {sp.address.postalCode} {sp.address.city}
              </Text>
            </View>
            <Badge label="Aktivní" tone="success" />
          </View>
          <View className="border-t border-line-subtle pt-1">
            <InfoRow
              label={sp.type === 'ELECTRICITY' ? 'EAN' : 'EIC'}
              value={formatEAN(sp.identifier)}
              icon="finger-print-outline"
            />
            <InfoRow
              label="Číslo smlouvy"
              value={sp.contractNumber}
              icon="document-outline"
            />
            <InfoRow
              label="Ceník"
              value={contract?.pricePlan ?? '—'}
              icon="pricetag-outline"
              withDivider={false}
            />
          </View>
        </Card>
      </View>

      {/* Insights / anomaly */}
      {insights && Math.abs(insights.change) >= 15 && (
        <View className="px-5 mt-4">
          <Alert
            tone={insights.change > 0 ? 'warning' : 'success'}
            icon={insights.change > 0 ? 'trending-up' : 'trending-down'}
            title={
              insights.change > 0
                ? `Spotřeba +${insights.change.toFixed(0)} % vs. průměr`
                : `Šetříte ${Math.abs(insights.change).toFixed(0)} % oproti průměru`
            }
            message={
              insights.change > 0
                ? 'Spotřeba v posledním měsíci je výrazně vyšší než průměr. Zkontrolujte spotřebiče.'
                : 'Skvělá práce — držíte spotřebu pod průměrem posledních měsíců.'
            }
          />
        </View>
      )}

      {/* Advance payment */}
      {advance && (
        <View className="px-5 mt-5">
          <SectionHeader title="Měsíční zálohy" />
          <Card padding="lg">
            <View className="flex-row items-center mb-4">
              <View className="flex-1">
                <Text className="text-2xs text-ink-muted uppercase tracking-wider">
                  Platíte
                </Text>
                <Text className="text-2xl font-bold text-ink mt-1">
                  {formatCurrency(advance.monthlyAdvance)}
                </Text>
                <Text className="text-2xs text-ink-muted mt-0.5">/měsíc</Text>
              </View>
              <Badge label={advLabel} tone={advTone} />
            </View>

            {advance.status !== 'OPTIMAL' && (
              <View
                className="rounded-xl p-3 mb-3"
                style={{
                  backgroundColor: advPalette.bg,
                  borderWidth: 1,
                  borderColor: advPalette.border,
                }}
              >
                <View className="flex-row items-center">
                  <Ionicons
                    name={
                      advance.status === 'TOO_LOW'
                        ? 'arrow-up-circle'
                        : 'arrow-down-circle'
                    }
                    size={18}
                    color={advPalette.solid}
                  />
                  <Text
                    className="ml-2 text-xs font-semibold flex-1"
                    style={{ color: advPalette.text }}
                  >
                    Doporučená záloha:{' '}
                    {formatCurrency(advance.recommendedAdvance)}/měsíc
                  </Text>
                </View>
              </View>
            )}

            <Button
              label="Změnit zálohy"
              icon="cash-outline"
              variant={advance.status === 'OPTIMAL' ? 'secondary' : 'primary'}
              fullWidth
            />
          </Card>
        </View>
      )}

      {/* Monthly consumption */}
      {monthly.length > 0 && (
        <View className="px-5 mt-5">
          <SectionHeader title="Spotřeba — 12 měsíců" />
          <Card padding="lg">
            <View className="flex-row mb-4">
              <View className="flex-1">
                <Text className="text-2xs text-ink-muted">Tento měsíc</Text>
                <Text className="text-base font-bold text-ink mt-0.5">
                  {monthly[monthly.length - 1].value}{' '}
                  {monthly[monthly.length - 1].unit}
                </Text>
              </View>
              {insights?.yoyChange !== null &&
                insights?.yoyChange !== undefined && (
                  <View className="flex-1">
                    <Text className="text-2xs text-ink-muted">
                      Rok meziročně
                    </Text>
                    <Text
                      className="text-base font-bold mt-0.5"
                      style={{
                        color:
                          insights.yoyChange > 0 ? Colors.red : Colors.primary,
                      }}
                    >
                      {insights.yoyChange > 0 ? '+' : ''}
                      {insights.yoyChange.toFixed(0)} %
                    </Text>
                  </View>
                )}
              <View className="flex-1">
                <Text className="text-2xs text-ink-muted">Roční celkem</Text>
                <Text className="text-base font-bold text-ink mt-0.5">
                  {monthly.reduce((s, m) => s + m.value, 0)} {monthly[0].unit}
                </Text>
              </View>
            </View>

            <View className="flex-row items-end h-32 gap-1">
              {monthly.map((m, i) => {
                const h = (m.value / maxMonthly) * 100;
                const monthIdx = parseInt(m.date.split('-')[1], 10) - 1;
                const isLast = i === monthly.length - 1;
                return (
                  <View key={i} className="flex-1 items-center">
                    <View
                      style={{
                        height: 100,
                        width: '100%',
                        justifyContent: 'flex-end',
                        alignItems: 'center',
                      }}
                    >
                      <View
                        style={{
                          width: '70%',
                          height: Math.max(h, 3),
                          borderRadius: 4,
                          backgroundColor: isLast
                            ? energyColor
                            : energyColor + 'A0',
                        }}
                      />
                    </View>
                    <Text
                      className={`text-2xs mt-1 ${
                        isLast ? 'font-bold text-ink' : 'text-ink-muted'
                      }`}
                    >
                      {MONTH_NAMES[monthIdx]}
                    </Text>
                  </View>
                );
              })}
            </View>
          </Card>
        </View>
      )}

      {/* Quick actions */}
      <View className="px-5 mt-5">
        <SectionHeader title="Akce" />
        <View className="flex-row gap-3">
          <View className="flex-1">
            <Pressable onPress={() => router.push('/meter-reading' as any)}>
              {({ pressed }) => (
                <Card padding="md" style={{ opacity: pressed ? 0.85 : 1 }}>
                  <View
                    className="w-10 h-10 rounded-xl items-center justify-center mb-2"
                    style={{ backgroundColor: Colors.primaryLight }}
                  >
                    <Ionicons
                      name="speedometer-outline"
                      size={20}
                      color={Colors.primary}
                    />
                  </View>
                  <Text className="text-sm font-semibold text-ink">
                    Samoodečet
                  </Text>
                  <Text className="text-2xs text-ink-muted mt-0.5">
                    Naskenujte měřič
                  </Text>
                </Card>
              )}
            </Pressable>
          </View>
          <View className="flex-1">
            <Pressable
              onPress={() =>
                contract && router.push(`/contracts/${contract.id}` as any)
              }
            >
              {({ pressed }) => (
                <Card padding="md" style={{ opacity: pressed ? 0.85 : 1 }}>
                  <View
                    className="w-10 h-10 rounded-xl items-center justify-center mb-2"
                    style={{ backgroundColor: '#DBEAFE' }}
                  >
                    <Ionicons
                      name="document-text-outline"
                      size={20}
                      color={Colors.electricity}
                    />
                  </View>
                  <Text className="text-sm font-semibold text-ink">
                    Detail smlouvy
                  </Text>
                  <Text className="text-2xs text-ink-muted mt-0.5">
                    Cena, fixace
                  </Text>
                </Card>
              )}
            </Pressable>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
