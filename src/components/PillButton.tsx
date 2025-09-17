import React from 'react';
import { Pressable, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { colors } from '../theme/tokens';

type Props = {
  title: string;
  onPress?: () => void;
  style?: ViewStyle;
  textStyle?: TextStyle;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'outline';
};

function getLuminance(hex: string) {
  const c = hex.replace('#','');
  const r = parseInt(c.substring(0,2),16) / 255;
  const g = parseInt(c.substring(2,4),16) / 255;
  const b = parseInt(c.substring(4,6),16) / 255;
  const lin = (v: number) => (v <= 0.03928 ? v/12.92 : Math.pow((v+0.055)/1.055, 2.4));
  const [R,G,B] = [lin(r), lin(g), lin(b)];
  return 0.2126*R + 0.7152*G + 0.0722*B;
}

function bestTextColor(bgHex: string) {
  const L = getLuminance(bgHex);
  // Simple threshold: darker bg -> white text; lighter bg -> black text
  return L < 0.5 ? colors.pillTextOnDark : colors.pillTextOnLight;
}

export const PillButton: React.FC<Props> = ({ title, onPress, style, textStyle, disabled, variant = 'primary' }) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'secondary':
        return { backgroundColor: colors.secondary, color: colors.secondaryText };
      case 'outline':
        return { backgroundColor: 'transparent', color: colors.text, borderWidth: 1, borderColor: colors.line };
      default:
        return { backgroundColor: colors.pillButtonColor, color: bestTextColor(colors.pillButtonColor) };
    }
  };
  
  const variantStyles = getVariantStyles();
  const bg = variantStyles.backgroundColor;
  const txt = variantStyles.color;
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.base,
        { 
          backgroundColor: bg, 
          opacity: pressed ? 0.9 : 1,
          ...(variantStyles.borderWidth && { borderWidth: variantStyles.borderWidth }),
          ...(variantStyles.borderColor && { borderColor: variantStyles.borderColor })
        },
        disabled && { opacity: 0.6 },
        style,
      ]}
    >
      <Text style={[styles.text, { color: txt }, textStyle]}>{title}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  base: {
    borderRadius: 9999,
    paddingHorizontal: 16,
    paddingVertical: 8,
    alignSelf: 'flex-start',
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
  },
});

export default PillButton;