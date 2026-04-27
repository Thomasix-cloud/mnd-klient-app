import { ReactNode } from 'react';
import { Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/colors';

type IoniconName = React.ComponentProps<typeof Ionicons>['name'];

interface EmptyStateProps {
  icon?: IoniconName;
  title: string;
  message?: string;
  action?: ReactNode;
  compact?: boolean;
}

export function EmptyState({
  icon = 'albums-outline',
  title,
  message,
  action,
  compact = false,
}: EmptyStateProps) {
  return (
    <View
      className={`items-center justify-center px-8 ${
        compact ? 'py-8' : 'py-16'
      }`}
    >
      <View
        className="w-16 h-16 rounded-full items-center justify-center mb-4"
        style={{ backgroundColor: Colors.surfaceSubtle }}
      >
        <Ionicons name={icon} size={28} color={Colors.gray} />
      </View>
      <Text className="text-base font-semibold text-ink text-center">
        {title}
      </Text>
      {message && (
        <Text className="text-sm text-ink-muted text-center mt-1.5">
          {message}
        </Text>
      )}
      {action && <View className="mt-5 w-full">{action}</View>}
    </View>
  );
}
