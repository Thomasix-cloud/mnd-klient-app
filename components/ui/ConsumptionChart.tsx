import { Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ConsumptionRecord } from '@/types';
import { Colors } from '@/constants/colors';

interface ConsumptionChartProps {
  data: ConsumptionRecord[];
  /** Optional previous-period data for comparison line */
  previous?: ConsumptionRecord[];
  unit?: string;
  /** Bar accent color override (defaults to brand) */
  color?: string;
}

const SHORT_DAY_FMT = new Intl.DateTimeFormat('cs-CZ', { weekday: 'short' });

export function ConsumptionChart({
  data,
  previous,
  unit = 'kWh',
  color = Colors.primary,
}: ConsumptionChartProps) {
  if (!data.length) return null;

  const totalCurrent = data.reduce((s, d) => s + d.value, 0);
  const totalPrev = previous?.reduce((s, d) => s + d.value, 0);
  const diff =
    totalPrev && totalPrev > 0
      ? ((totalCurrent - totalPrev) / totalPrev) * 100
      : null;

  const max = Math.max(
    ...data.map((d) => d.value),
    ...(previous?.map((d) => d.value) ?? [0]),
  );
  const avg = totalCurrent / data.length;

  const trendTone =
    diff === null
      ? 'neutral'
      : diff > 5
        ? 'danger'
        : diff < -5
          ? 'success'
          : 'neutral';

  const trendColor =
    trendTone === 'danger'
      ? Colors.red
      : trendTone === 'success'
        ? Colors.primary
        : Colors.gray;

  return (
    <View className="bg-white rounded-2xl p-4">
      {/* Summary header */}
      <View className="flex-row items-end justify-between mb-3">
        <View>
          <Text className="text-2xs text-ink-muted uppercase tracking-wider">
            Celkem za období
          </Text>
          <View className="flex-row items-baseline mt-0.5">
            <Text className="text-2xl font-bold text-ink">
              {totalCurrent.toLocaleString('cs-CZ')}
            </Text>
            <Text className="text-sm text-ink-muted ml-1">{unit}</Text>
          </View>
        </View>
        {diff !== null && (
          <View
            className="flex-row items-center rounded-full px-2.5 py-1"
            style={{ backgroundColor: trendColor + '1A' }}
          >
            <Ionicons
              name={diff >= 0 ? 'trending-up' : 'trending-down'}
              size={12}
              color={trendColor}
            />
            <Text
              className="text-2xs font-semibold ml-1"
              style={{ color: trendColor }}
            >
              {diff >= 0 ? '+' : ''}
              {diff.toFixed(0)}% vs. min. týden
            </Text>
          </View>
        )}
      </View>

      {/* Bars */}
      <View className="flex-row items-end h-28 gap-1.5">
        {data.map((d, i) => {
          const h = max > 0 ? (d.value / max) * 92 : 0;
          const prev = previous?.[i];
          const prevH = prev && max > 0 ? (prev.value / max) * 92 : 0;
          const day = SHORT_DAY_FMT.format(new Date(d.date));
          const isToday = i === data.length - 1;
          return (
            <View key={i} className="flex-1 items-center">
              <View
                style={{
                  height: 96,
                  width: '100%',
                  justifyContent: 'flex-end',
                  alignItems: 'center',
                  position: 'relative',
                }}
              >
                {/* Previous-period ghost bar (behind) */}
                {prev && (
                  <View
                    style={{
                      position: 'absolute',
                      bottom: 0,
                      width: '78%',
                      height: Math.max(prevH, 2),
                      borderRadius: 6,
                      backgroundColor: Colors.borderSubtle,
                    }}
                  />
                )}
                <View
                  style={{
                    width: '62%',
                    height: Math.max(h, 3),
                    borderRadius: 6,
                    backgroundColor: isToday ? color : color + 'B3',
                  }}
                />
              </View>
              <Text
                className={`text-2xs mt-1.5 ${
                  isToday ? 'font-bold text-ink' : 'text-ink-muted'
                }`}
              >
                {day}
              </Text>
            </View>
          );
        })}
      </View>

      {/* Footer stats */}
      <View className="flex-row mt-4 pt-3 border-t border-line-subtle">
        <View className="flex-1">
          <Text className="text-2xs text-ink-muted">Průměr / den</Text>
          <Text className="text-sm font-semibold text-ink mt-0.5">
            {avg.toFixed(1)} {unit}
          </Text>
        </View>
        <View className="flex-1">
          <Text className="text-2xs text-ink-muted">Maximum</Text>
          <Text className="text-sm font-semibold text-ink mt-0.5">
            {max} {unit}
          </Text>
        </View>
        {previous && (
          <View className="flex-1">
            <Text className="text-2xs text-ink-muted">Min. týden</Text>
            <Text className="text-sm font-semibold text-ink mt-0.5">
              {totalPrev} {unit}
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}
