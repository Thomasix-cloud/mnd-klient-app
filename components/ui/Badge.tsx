import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Tones, ToneName } from '@/constants/colors';

type IoniconName = React.ComponentProps<typeof Ionicons>['name'];

interface BadgeProps {
  label: string;
  tone?: ToneName;
  icon?: IoniconName;
  size?: 'sm' | 'md';
  variant?: 'soft' | 'solid' | 'outline';
}

export function Badge({
  label,
  tone = 'neutral',
  icon,
  size = 'sm',
  variant = 'soft',
}: BadgeProps) {
  const c = Tones[tone];
  const padding = size === 'sm' ? 'px-2.5 py-0.5' : 'px-3 py-1';
  const fontSize = size === 'sm' ? 'text-2xs' : 'text-xs';
  const iconSize = size === 'sm' ? 12 : 14;

  let bg = c.bg;
  let textColor = c.text;
  let border = 'transparent';

  if (variant === 'solid') {
    bg = c.solid;
    textColor = '#FFFFFF';
  } else if (variant === 'outline') {
    bg = 'transparent';
    border = c.border;
  }

  return (
    <View
      className={`flex-row items-center self-start rounded-full ${padding}`}
      style={{
        backgroundColor: bg,
        borderWidth: variant === 'outline' ? 1 : 0,
        borderColor: border,
      }}
    >
      {icon && (
        <Ionicons
          name={icon}
          size={iconSize}
          color={textColor}
          style={{ marginRight: 4 }}
        />
      )}
      <Text
        className={`${fontSize} font-semibold`}
        style={{ color: textColor }}
      >
        {label}
      </Text>
    </View>
  );
}
