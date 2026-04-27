import { Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/colors';

type IoniconName = React.ComponentProps<typeof Ionicons>['name'];

interface InfoRowProps {
  label: string;
  value?: string | null;
  icon?: IoniconName;
  emphasis?: 'default' | 'strong' | 'muted';
  withDivider?: boolean;
}

export function InfoRow({
  label,
  value,
  icon,
  emphasis = 'default',
  withDivider = true,
}: InfoRowProps) {
  const valueClass =
    emphasis === 'strong'
      ? 'text-base font-bold text-ink'
      : emphasis === 'muted'
        ? 'text-sm text-ink-muted'
        : 'text-sm font-medium text-ink';

  return (
    <View
      className={`flex-row items-center py-3 ${
        withDivider ? 'border-b border-line-subtle' : ''
      }`}
    >
      {icon && (
        <Ionicons
          name={icon}
          size={16}
          color={Colors.gray}
          style={{ marginRight: 10 }}
        />
      )}
      <Text className="flex-1 text-xs text-ink-muted">{label}</Text>
      <Text className={valueClass} numberOfLines={1}>
        {value ?? '—'}
      </Text>
    </View>
  );
}
