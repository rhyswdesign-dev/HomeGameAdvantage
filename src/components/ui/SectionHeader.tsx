import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { colors, spacing } from '../../theme';

type Props = {
  title: string;
  style?: ViewStyle;
  titleStyle?: TextStyle;
  right?: React.ReactNode;
};

export default function SectionHeader({ title, style, titleStyle, right }: Props) {
  return (
    <View style={[styles.row, style]}>
      <Text style={[styles.title, titleStyle]}>{title}</Text>
      {right ? <View style={styles.right}>{right}</View> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing(2),
    marginBottom: spacing(1.5),
  },
  title: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 0.2,
  },
  right: { marginLeft: 'auto' },
});
