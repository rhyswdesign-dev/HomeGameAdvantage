import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';

interface SectionProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  style?: ViewStyle;
}

const Section: React.FC<SectionProps> = ({ title, subtitle, children, style }) => {
  return (
    <View style={[styles.section, style]}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      </View>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    marginBottom: 24,
  },
  header: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFFFFF', // textPrimary
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#CFC8C0', // textSecondary
  },
});

export default Section;