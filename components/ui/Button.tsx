import {
  ActivityIndicator,
  Pressable,
  PressableProps,
  Text,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Tones, ToneName, Colors } from '@/constants/colors';

type IoniconName = React.ComponentProps<typeof Ionicons>['name'];

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps extends Omit<PressableProps, 'children'> {
  label: string;
  variant?: Variant;
  size?: Size;
  icon?: IoniconName;
  iconPosition?: 'left' | 'right';
  loading?: boolean;
  fullWidth?: boolean;
  tone?: ToneName; // optional override for primary
}

const sizeMap: Record<
  Size,
  { padding: string; text: string; icon: number; height: number }
> = {
  sm: { padding: 'px-3', text: 'text-sm', icon: 16, height: 36 },
  md: { padding: 'px-4', text: 'text-sm', icon: 18, height: 44 },
  lg: { padding: 'px-5', text: 'text-base', icon: 20, height: 52 },
};

export function Button({
  label,
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'left',
  loading = false,
  disabled,
  fullWidth = false,
  tone,
  style,
  ...rest
}: ButtonProps) {
  const s = sizeMap[size];
  const isDisabled = disabled || loading;

  let bg: string = Colors.primary;
  let fg: string = '#FFFFFF';
  const borderColor = 'transparent';
  const borderWidth = 0;

  if (variant === 'primary') {
    const t = tone ? Tones[tone] : null;
    bg = t ? t.solid : Colors.primary;
  } else if (variant === 'secondary') {
    bg = Colors.primaryLight;
    fg = Colors.primary;
  } else if (variant === 'ghost') {
    bg = 'transparent';
    fg = Colors.primary;
  } else if (variant === 'danger') {
    bg = Tones.danger.bg;
    fg = Tones.danger.text;
  }

  return (
    <Pressable
      disabled={isDisabled}
      android_ripple={{ color: 'rgba(0,0,0,0.06)' }}
      style={({ pressed }) => [
        {
          backgroundColor: bg,
          height: s.height,
          opacity: isDisabled ? 0.5 : pressed ? 0.85 : 1,
          borderColor,
          borderWidth,
          borderRadius: 14,
        },
        fullWidth ? { width: '100%' } : null,
        style as any,
      ]}
      {...rest}
    >
      <View
        className={`flex-row items-center justify-center ${s.padding}`}
        style={{ height: '100%' }}
      >
        {loading ? (
          <ActivityIndicator color={fg} size="small" />
        ) : (
          <>
            {icon && iconPosition === 'left' && (
              <Ionicons
                name={icon}
                size={s.icon}
                color={fg}
                style={{ marginRight: 8 }}
              />
            )}
            <Text
              className={`${s.text} font-semibold`}
              style={{ color: fg }}
              numberOfLines={1}
            >
              {label}
            </Text>
            {icon && iconPosition === 'right' && (
              <Ionicons
                name={icon}
                size={s.icon}
                color={fg}
                style={{ marginLeft: 8 }}
              />
            )}
          </>
        )}
      </View>
    </Pressable>
  );
}
