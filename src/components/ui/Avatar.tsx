import React from 'react';
import { View, Image, Text, StyleSheet, ViewStyle } from 'react-native';

interface AvatarProps {
  image: string;
  name: string;
  subtitle?: string;
  size?: number;
  style?: ViewStyle;
}

const Avatar: React.FC<AvatarProps> = ({ 
  image, 
  name, 
  subtitle, 
  size = 44, 
  style 
}) => {
  return (
    <View style={[styles.container, style]}>
      <Image 
        source={{ uri: image }} 
        style={[styles.avatar, { width: size, height: size, borderRadius: size / 2 }]}
        accessibilityLabel={`${name} avatar`}
      />
      <View style={styles.textContainer}>
        <Text style={styles.name} numberOfLines={1}>{name}</Text>
        {subtitle && (
          <Text style={styles.subtitle} numberOfLines={1}>{subtitle}</Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 44,
  },
  avatar: {
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF', // textPrimary
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 14,
    color: '#CFC8C0', // textSecondary
  },
});

export default Avatar;