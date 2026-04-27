import { ReactNode } from 'react';
import { Pressable, Text, View } from 'react-native';

interface SectionHeaderProps {
  title: string;
  actionLabel?: string;
  onActionPress?: () => void;
  /** Optional subtitle / count right-aligned text when no action */
  trailing?: ReactNode;
}

export function SectionHeader({
  title,
  actionLabel,
  onActionPress,
  trailing,
}: SectionHeaderProps) {
  return (
    <View className="flex-row items-center justify-between mb-3">
      <Text className="text-base font-bold text-ink">{title}</Text>
      {actionLabel && onActionPress ? (
        <Pressable onPress={onActionPress} hitSlop={8}>
          {({ pressed }) => (
            <Text
              className="text-sm font-semibold text-mnd-green"
              style={{ opacity: pressed ? 0.6 : 1 }}
            >
              {actionLabel}
            </Text>
          )}
        </Pressable>
      ) : (
        trailing
      )}
    </View>
  );
}
