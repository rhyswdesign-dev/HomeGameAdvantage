import React from 'react';
import { Text, StyleSheet } from 'react-native';

export default function SectionTitle({ children }: { children: string }) {
  return <Text style={s.title}>{children}</Text>;
}

const s = StyleSheet.create({
  title: {
    color: '#F4ECE4',
    fontSize: 24,
    fontWeight: '700',
    marginTop: 24,
    marginBottom: 12
  }
});