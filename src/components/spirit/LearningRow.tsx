import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { LearningModule } from '../../types/spirit';

export default function LearningRow({ module }: { module: LearningModule }) {
  return (
    <View style={s.row}>
      <Ionicons name={module.icon as any || 'book'} size={24} color="#E58B2B" />
      <Text style={s.title}>{module.title}</Text>
    </View>
  );
}

const s = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#2B231C',
    borderRadius: 18
  },
  title: {
    color: '#F4ECE4',
    fontSize: 18,
    fontWeight: '700',
    marginLeft: 12
  }
});