import React from 'react';
import { Pressable, Text, View, StyleSheet, ViewStyle } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { colors, textStyles, layouts, spacing, radii } from '../theme/tokens';

type Props = {
  icon: keyof typeof Feather.glyphMap;
  label: string;
  onPress?: () => void;
  style?: ViewStyle;
};

export default function InfoPill({ icon, label, onPress, style }: Props) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.row,
        style,
        pressed && { opacity: 0.7 }
      ]}
      android_ripple={{ color: 'rgba(255,255,255,0.08)' }}
    >
      <View style={styles.iconWrap}>
        <Feather name={icon} size={20} color={colors.accentLight} />
      </View>
      <Text style={styles.label}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    ...layouts.row,
    paddingVertical: spacing(1.25),
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: radii.md,
    ...layouts.center,
    backgroundColor: colors.card,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.line,
    marginRight: spacing(1.5),
  },
  label: {
    ...textStyles.bodyMedium,
    color: colors.textMuted,
  },
});
