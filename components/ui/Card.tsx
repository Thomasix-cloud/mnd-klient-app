import { View, ViewProps } from 'react-native';
import { Colors } from '@/constants/colors';

interface CardProps extends ViewProps {
  /** Visual padding inside the card */
  padding?: 'none' | 'sm' | 'md' | 'lg';
  /** Add a subtle elevation shadow */
  elevated?: boolean;
}

const padMap = {
  none: '',
  sm: 'p-3',
  md: 'p-4',
  lg: 'p-5',
} as const;

export function Card({
  padding = 'md',
  elevated = true,
  className = '',
  style,
  children,
  ...rest
}: CardProps) {
  return (
    <View
      className={`bg-white rounded-2xl ${padMap[padding]} ${className}`}
      style={[
        elevated && {
          shadowColor: '#0F172A',
          shadowOpacity: 0.04,
          shadowRadius: 12,
          shadowOffset: { width: 0, height: 4 },
          elevation: 2,
        },
        style,
      ]}
      {...rest}
    >
      {children}
    </View>
  );
}

export const CardBackground = Colors.card;
