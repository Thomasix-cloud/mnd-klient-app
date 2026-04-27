import { useEffect, useRef } from 'react';
import { Animated, View, ViewStyle } from 'react-native';
import { Colors } from '@/constants/colors';

interface SkeletonProps {
  width?: number | string;
  height?: number;
  radius?: number;
  style?: ViewStyle;
}

export function Skeleton({
  width = '100%',
  height = 16,
  radius = 8,
  style,
}: SkeletonProps) {
  const opacity = useRef(new Animated.Value(0.5)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 700,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.5,
          duration: 700,
          useNativeDriver: true,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [opacity]);

  return (
    <Animated.View
      style={[
        {
          width: width as any,
          height,
          borderRadius: radius,
          backgroundColor: Colors.borderSubtle,
          opacity,
        },
        style,
      ]}
    />
  );
}

export function SkeletonCard({ height = 88 }: { height?: number }) {
  return (
    <View className="bg-white rounded-2xl p-4 mb-3" style={{ height }}>
      <View className="flex-row items-center">
        <Skeleton width={40} height={40} radius={20} />
        <View className="flex-1 ml-3">
          <Skeleton width="60%" height={14} />
          <Skeleton width="40%" height={12} style={{ marginTop: 8 }} />
        </View>
      </View>
    </View>
  );
}
