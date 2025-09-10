import { Pressable, Text, View } from 'react-native';
import { colors, radii, spacing } from '../theme/tokens';

export default function Chip({
  label,
  selected = false,
  onPress,
}: {
  label: string;
  selected?: boolean;
  onPress?: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={{
        marginRight: spacing(1),
        borderRadius: 999,
        backgroundColor: selected ? colors.chipActive : colors.chipBg,
        paddingHorizontal: spacing(1.75),
        paddingVertical: 10,
        borderWidth: 1,
        borderColor: selected ? 'transparent' : colors.chipBorder,
      }}>
      <Text
        style={{
          color: selected ? colors.goldText : colors.text,
          fontWeight: '800',
        }}>
        {label}
      </Text>
    </Pressable>
  );
}
