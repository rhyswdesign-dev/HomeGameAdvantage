import { Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing } from '../theme/tokens';

export default function SectionHeader({
  title,
  onPress,
}: {
  title: string;
  onPress?: () => void;
}) {
  const Content = (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
      <Text style={{ color: colors.text, fontSize: 22, fontWeight: '900' }}>{title}</Text>
      {onPress ? <Ionicons name="chevron-forward" size={18} color={colors.text} /> : null}
    </View>
  );
  return (
    <View style={{ paddingHorizontal: spacing(2), marginTop: spacing(2), marginBottom: spacing(1) }}>
      {onPress ? <Pressable onPress={onPress}>{Content}</Pressable> : Content}
    </View>
  );
}
