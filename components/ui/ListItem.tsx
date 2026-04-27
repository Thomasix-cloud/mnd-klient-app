import { ReactNode } from 'react';
import { Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/colors';

type IoniconName = React.ComponentProps<typeof Ionicons>['name'];

interface ListItemProps {
  title: string;
  subtitle?: string;
  description?: string;
  /** Either a left icon or a custom left element (e.g. EnergyAvatar) */
  leftIcon?: IoniconName;
  leftIconColor?: string;
  leftIconBg?: string;
  leftElement?: ReactNode;
  /** Right side: badge / value / chevron / custom */
  rightElement?: ReactNode;
  rightValue?: string;
  rightSubtext?: string;
  showChevron?: boolean;
  onPress?: () => void;
  disabled?: boolean;
  /** Visual hint for non-interactive (e.g. terminated) row */
  muted?: boolean;
}

export function ListItem({
  title,
  subtitle,
  description,
  leftIcon,
  leftIconColor = Colors.gray,
  leftIconBg = Colors.surfaceSubtle,
  leftElement,
  rightElement,
  rightValue,
  rightSubtext,
  showChevron = false,
  onPress,
  disabled = false,
  muted = false,
}: ListItemProps) {
  const Wrapper: any = onPress ? Pressable : View;

  const left =
    leftElement ??
    (leftIcon ? (
      <View
        className="w-10 h-10 rounded-full items-center justify-center"
        style={{ backgroundColor: leftIconBg }}
      >
        <Ionicons name={leftIcon} size={20} color={leftIconColor} />
      </View>
    ) : null);

  return (
    <Wrapper
      disabled={disabled}
      onPress={onPress}
      android_ripple={onPress ? { color: 'rgba(0,0,0,0.04)' } : undefined}
      style={({ pressed }: any) => ({
        opacity: muted ? 0.55 : pressed && onPress ? 0.7 : 1,
      })}
    >
      <View className="flex-row items-center py-3">
        {left && <View className="mr-3">{left}</View>}

        <View className="flex-1 min-w-0">
          <Text className="text-sm font-semibold text-ink" numberOfLines={1}>
            {title}
          </Text>
          {subtitle && (
            <Text className="text-xs text-ink-muted mt-0.5" numberOfLines={1}>
              {subtitle}
            </Text>
          )}
          {description && (
            <Text className="text-xs text-ink-muted mt-0.5" numberOfLines={2}>
              {description}
            </Text>
          )}
        </View>

        {rightElement ? (
          <View className="ml-2 items-end">{rightElement}</View>
        ) : rightValue ? (
          <View className="ml-2 items-end">
            <Text className="text-sm font-bold text-ink">{rightValue}</Text>
            {rightSubtext && (
              <Text className="text-2xs text-ink-muted mt-0.5">
                {rightSubtext}
              </Text>
            )}
          </View>
        ) : null}

        {showChevron && (
          <Ionicons
            name="chevron-forward"
            size={16}
            color={Colors.grayMedium}
            style={{ marginLeft: 8 }}
          />
        )}
      </View>
    </Wrapper>
  );
}
