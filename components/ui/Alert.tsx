import { ReactNode } from 'react';
import { Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Tones, ToneName } from '@/constants/colors';

type IoniconName = React.ComponentProps<typeof Ionicons>['name'];

interface AlertProps {
  tone?: ToneName;
  icon?: IoniconName;
  title: string;
  message?: string;
  onPress?: () => void;
  trailing?: ReactNode;
}

const defaultIcon: Record<ToneName, IoniconName> = {
  brand: 'information-circle',
  success: 'checkmark-circle',
  warning: 'alert-circle',
  danger: 'warning',
  info: 'information-circle',
  neutral: 'information-circle',
};

export function Alert({
  tone = 'info',
  icon,
  title,
  message,
  onPress,
  trailing,
}: AlertProps) {
  const c = Tones[tone];
  const Wrapper: any = onPress ? Pressable : View;
  const ic = icon ?? defaultIcon[tone];

  return (
    <Wrapper
      onPress={onPress}
      android_ripple={onPress ? { color: 'rgba(0,0,0,0.04)' } : undefined}
      style={({ pressed }: any) => ({
        opacity: pressed && onPress ? 0.85 : 1,
      })}
    >
      <View
        className="flex-row items-center rounded-2xl p-3.5"
        style={{
          backgroundColor: c.bg,
          borderWidth: 1,
          borderColor: c.border,
        }}
      >
        <View
          className="w-9 h-9 rounded-full items-center justify-center mr-3"
          style={{ backgroundColor: c.solid }}
        >
          <Ionicons name={ic} size={18} color="#FFFFFF" />
        </View>
        <View className="flex-1">
          <Text
            className="text-sm font-semibold"
            style={{ color: c.text }}
            numberOfLines={2}
          >
            {title}
          </Text>
          {message && (
            <Text
              className="text-xs mt-0.5"
              style={{ color: c.text, opacity: 0.85 }}
              numberOfLines={2}
            >
              {message}
            </Text>
          )}
        </View>
        {trailing}
        {!trailing && onPress && (
          <Ionicons
            name="chevron-forward"
            size={18}
            color={c.text}
            style={{ marginLeft: 6 }}
          />
        )}
      </View>
    </Wrapper>
  );
}
