import { useState } from 'react';
import { View, Text, ScrollView, Pressable, TextInput } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { mockSupplyPoints } from '@/data/mock-supply-points';
import { Colors } from '@/constants/colors';
import { formatEAN, getEnergyTypeLabel } from '@/utils/format';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/ui/Alert';
import { EnergyAvatar } from '@/components/ui/EnergyAvatar';
import { SectionHeader } from '@/components/ui/SectionHeader';

type Step = 'select' | 'capture' | 'review' | 'done';

export default function MeterReadingScreen() {
  const [step, setStep] = useState<Step>('select');
  const [selectedSpId, setSelectedSpId] = useState<string | null>(null);
  const [scanning, setScanning] = useState(false);
  const [reading, setReading] = useState('');

  const sp = selectedSpId
    ? mockSupplyPoints.find((s) => s.id === selectedSpId)
    : null;

  const startScan = () => {
    setScanning(true);
    setTimeout(() => {
      // Simulated OCR result
      const fake = (12450 + Math.floor(Math.random() * 600)).toString();
      setReading(fake);
      setScanning(false);
      setStep('review');
    }, 1800);
  };

  const submit = () => {
    setStep('done');
  };

  // ---------- STEP 1: select supply point ----------
  if (step === 'select') {
    return (
      <ScrollView
        className="flex-1 bg-surface"
        contentContainerStyle={{ paddingBottom: 32 }}
      >
        <View className="px-5 pt-4">
          <Text className="text-xs font-bold text-ink-muted uppercase tracking-wider mb-2">
            Krok 1 / 3
          </Text>
          <Text className="text-2xl font-bold text-ink">
            Vyberte odběrné místo
          </Text>
          <Text className="text-sm text-ink-muted mt-1">
            Pro které místo chcete zadat samoodečet?
          </Text>
        </View>

        <View className="px-5 mt-5">
          {mockSupplyPoints.map((p) => {
            const active = selectedSpId === p.id;
            return (
              <Pressable
                key={p.id}
                onPress={() => setSelectedSpId(p.id)}
                className="mb-3"
              >
                {({ pressed }) => (
                  <Card
                    padding="md"
                    style={{
                      borderWidth: 2,
                      borderColor: active ? Colors.primary : 'transparent',
                      opacity: pressed ? 0.85 : 1,
                    }}
                  >
                    <View className="flex-row items-center">
                      <EnergyAvatar type={p.type} size="md" />
                      <View className="flex-1 ml-3 min-w-0">
                        <Text className="text-sm font-semibold text-ink">
                          {getEnergyTypeLabel(p.type)}
                        </Text>
                        <Text
                          className="text-xs text-ink-muted"
                          numberOfLines={1}
                        >
                          {p.address.street}, {p.address.city}
                        </Text>
                      </View>
                      {active ? (
                        <Ionicons
                          name="checkmark-circle"
                          size={24}
                          color={Colors.primary}
                        />
                      ) : (
                        <View
                          className="w-6 h-6 rounded-full"
                          style={{
                            borderWidth: 2,
                            borderColor: Colors.grayMedium,
                          }}
                        />
                      )}
                    </View>
                  </Card>
                )}
              </Pressable>
            );
          })}
        </View>

        <View className="px-5 mt-5">
          <Button
            label="Pokračovat"
            icon="arrow-forward"
            iconPosition="right"
            size="lg"
            disabled={!selectedSpId}
            fullWidth
            onPress={() => setStep('capture')}
          />
        </View>
      </ScrollView>
    );
  }

  // ---------- STEP 2: capture (OCR mock) ----------
  if (step === 'capture' && sp) {
    return (
      <View className="flex-1 bg-surface">
        <ScrollView contentContainerStyle={{ paddingBottom: 32 }}>
          <View className="px-5 pt-4">
            <Text className="text-xs font-bold text-ink-muted uppercase tracking-wider mb-2">
              Krok 2 / 3
            </Text>
            <Text className="text-2xl font-bold text-ink">
              Naskenujte měřič
            </Text>
            <Text className="text-sm text-ink-muted mt-1">
              Namiřte fotoaparát na ciferník — stav přečteme automaticky.
            </Text>
          </View>

          {/* Camera viewfinder mock */}
          <View className="px-5 mt-5">
            <View
              className="rounded-3xl overflow-hidden items-center justify-center"
              style={{
                backgroundColor: '#0F172A',
                aspectRatio: 1,
              }}
            >
              {/* Crosshair frame */}
              <View
                style={{
                  position: 'absolute',
                  width: '78%',
                  aspectRatio: 2.4,
                  borderRadius: 12,
                  borderWidth: 2,
                  borderColor: scanning ? Colors.primary : '#fff',
                  borderStyle: scanning ? 'solid' : 'dashed',
                }}
              />
              {scanning ? (
                <>
                  <Ionicons name="scan" size={56} color={Colors.primary} />
                  <Text className="text-white text-sm font-semibold mt-3">
                    Rozpoznávání…
                  </Text>
                </>
              ) : (
                <>
                  <Ionicons
                    name="camera"
                    size={56}
                    color="rgba(255,255,255,0.7)"
                  />
                  <Text className="text-white text-sm mt-3 opacity-70">
                    Náhled fotoaparátu
                  </Text>
                </>
              )}
            </View>
          </View>

          <View className="px-5 mt-5">
            <Card padding="md">
              <View className="flex-row items-center">
                <EnergyAvatar type={sp.type} size="sm" />
                <View className="flex-1 ml-3 min-w-0">
                  <Text className="text-xs text-ink-muted">
                    {sp.type === 'ELECTRICITY' ? 'EAN' : 'EIC'}
                  </Text>
                  <Text className="text-sm font-semibold text-ink">
                    {formatEAN(sp.identifier)}
                  </Text>
                </View>
              </View>
            </Card>
          </View>

          <View className="px-5 mt-3">
            <Alert
              tone="info"
              icon="information-circle"
              title="Tip pro nejlepší výsledek"
              message="Zajistěte dobré osvětlení a držte telefon rovně nad ciferníkem."
            />
          </View>
        </ScrollView>

        <View
          className="px-5 pt-3 pb-7 bg-white border-t border-line-subtle"
          style={{
            shadowColor: '#000',
            shadowOpacity: 0.06,
            shadowRadius: 12,
            shadowOffset: { width: 0, height: -4 },
            elevation: 8,
          }}
        >
          <Button
            label={scanning ? 'Skenuji…' : 'Spustit skenování'}
            icon="scan-outline"
            size="lg"
            loading={scanning}
            fullWidth
            onPress={startScan}
          />
          <Pressable
            onPress={() => {
              setReading('');
              setStep('review');
            }}
            className="mt-3"
            hitSlop={6}
          >
            {({ pressed }) => (
              <Text
                className="text-sm font-semibold text-mnd-green text-center"
                style={{ opacity: pressed ? 0.6 : 1 }}
              >
                Zadat ručně
              </Text>
            )}
          </Pressable>
        </View>
      </View>
    );
  }

  // ---------- STEP 3: review ----------
  if (step === 'review' && sp) {
    return (
      <View className="flex-1 bg-surface">
        <ScrollView contentContainerStyle={{ paddingBottom: 32 }}>
          <View className="px-5 pt-4">
            <Text className="text-xs font-bold text-ink-muted uppercase tracking-wider mb-2">
              Krok 3 / 3
            </Text>
            <Text className="text-2xl font-bold text-ink">
              Zkontrolujte údaje
            </Text>
            <Text className="text-sm text-ink-muted mt-1">
              {reading
                ? 'Stav jsme rozpoznali z fotky. Pokud nesedí, opravte ho ručně.'
                : 'Zadejte stav měřiče.'}
            </Text>
          </View>

          <View className="px-5 mt-5">
            <Card padding="lg">
              <Text className="text-2xs text-ink-muted uppercase tracking-wider mb-2">
                Stav měřiče
              </Text>
              <View className="flex-row items-baseline">
                <TextInput
                  value={reading}
                  onChangeText={setReading}
                  keyboardType="numeric"
                  placeholder="0"
                  placeholderTextColor={Colors.grayMedium}
                  className="flex-1 text-3xl font-bold text-ink"
                />
                <Text className="text-base text-ink-muted ml-2">
                  {sp.type === 'ELECTRICITY' ? 'kWh' : 'm³'}
                </Text>
              </View>
              {reading && (
                <View className="mt-3">
                  <Badge
                    label="Rozpoznáno z fotografie"
                    tone="success"
                    icon="sparkles"
                  />
                </View>
              )}
            </Card>
          </View>

          <View className="px-5 mt-4">
            <SectionHeader title="Údaje samoodečtu" />
            <Card padding="md">
              <View className="flex-row items-center py-3 border-b border-line-subtle">
                <Text className="flex-1 text-xs text-ink-muted">
                  Odběrné místo
                </Text>
                <Text className="text-sm font-semibold text-ink">
                  {sp.address.street}
                </Text>
              </View>
              <View className="flex-row items-center py-3 border-b border-line-subtle">
                <Text className="flex-1 text-xs text-ink-muted">Energie</Text>
                <Text className="text-sm font-semibold text-ink">
                  {getEnergyTypeLabel(sp.type)}
                </Text>
              </View>
              <View className="flex-row items-center py-3">
                <Text className="flex-1 text-xs text-ink-muted">
                  Datum odečtu
                </Text>
                <Text className="text-sm font-semibold text-ink">
                  {new Date().toLocaleDateString('cs-CZ')}
                </Text>
              </View>
            </Card>
          </View>
        </ScrollView>

        <View
          className="px-5 pt-3 pb-7 bg-white border-t border-line-subtle"
          style={{
            shadowColor: '#000',
            shadowOpacity: 0.06,
            shadowRadius: 12,
            shadowOffset: { width: 0, height: -4 },
            elevation: 8,
          }}
        >
          <Button
            label="Odeslat odečet"
            icon="checkmark"
            size="lg"
            disabled={!reading.trim()}
            fullWidth
            onPress={submit}
          />
        </View>
      </View>
    );
  }

  // ---------- STEP 4: done ----------
  return (
    <View className="flex-1 bg-surface items-center justify-center px-8">
      <View
        className="w-20 h-20 rounded-full items-center justify-center mb-5"
        style={{ backgroundColor: Colors.primary }}
      >
        <Ionicons name="checkmark" size={40} color="#fff" />
      </View>
      <Text className="text-2xl font-bold text-ink text-center">
        Odečet odeslán
      </Text>
      <Text className="text-sm text-ink-muted text-center mt-2">
        Děkujeme! Odečet jsme přijali a zpracujeme ho do nejbližšího vyúčtování.
      </Text>
      <View className="w-full mt-8">
        <Button
          label="Hotovo"
          size="lg"
          fullWidth
          onPress={() => router.back()}
        />
      </View>
    </View>
  );
}
