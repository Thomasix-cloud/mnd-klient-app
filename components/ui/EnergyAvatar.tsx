import { View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/colors';
import { EnergyType } from '@/types';

interface EnergyAvatarProps {
  type: EnergyType;
  size?: 'sm' | 'md' | 'lg';
}

const sizeMap = {
  sm: { wrap: 36, icon: 16 },
  md: { wrap: 44, icon: 22 },
  lg: { wrap: 56, icon: 26 },
} as const;

export function EnergyAvatar({ type, size = 'md' }: EnergyAvatarProps) {
  const s = sizeMap[size];
  const isElec = type === 'ELECTRICITY';
  return (
    <View
      style={{
        width: s.wrap,
        height: s.wrap,
        borderRadius: s.wrap / 2,
        backgroundColor: isElec ? Colors.electricityBg : Colors.gasBg,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Ionicons
        name={isElec ? 'flash' : 'flame'}
        size={s.icon}
        color={isElec ? Colors.electricity : Colors.gas}
      />
    </View>
  );
}
