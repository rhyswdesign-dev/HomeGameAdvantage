import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { buttons, colors } from '../../theme/tokens';

type PillButtonVariant = 'filled' | 'outline' | 'ghost';

interface PillButtonProps {
  title: string;
  onPress: () => void;
  variant?: PillButtonVariant;
  style?: ViewStyle;
  textStyle?: TextStyle;
  disabled?: boolean;
}

const getLuminance = (hex: string): number => {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;

  const toLinear = (c: number) => c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);

  return 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);
};

const getTextColor = (backgroundColor: string): string => {
  const luminance = getLuminance(backgroundColor);
  return luminance > 0.5 ? '#000000' : '#FFFFFF';
};

const PillButton: React.FC<PillButtonProps> = ({
  title,
  onPress,
  variant = 'filled',
  style,
  textStyle,
  disabled = false,
}) => {
  const getButtonStyle = () => {
    const baseStyle = variant === 'filled' ? buttons.pill : 
                      variant === 'outline' ? buttons.secondary : 
                      buttons.ghost;
    return [baseStyle, style];
  };

  const getTextStyle = () => {
    const baseStyle = variant === 'filled' ? 
      { color: buttons.pill.color, fontSize: buttons.pill.fontSize, fontWeight: buttons.pill.fontWeight } :
      { color: buttons.ghost.color, fontSize: buttons.ghost.fontSize, fontWeight: buttons.ghost.fontWeight };
    return [baseStyle, textStyle];
  };

  return (
    <TouchableOpacity
      style={[getButtonStyle(), disabled && styles.disabled]}
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={title}
      activeOpacity={0.7}
    >
      <Text style={getTextStyle()}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  disabled: {
    opacity: 0.5,
  },
});

export default PillButton;
