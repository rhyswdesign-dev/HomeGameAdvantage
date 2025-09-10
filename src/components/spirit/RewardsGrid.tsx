import React from 'react';
import { ScrollView, View, Image, Text, StyleSheet } from 'react-native';
import type { RewardItem } from '../../types/spirit';

const cardWidth = 180;

export default function RewardsGrid({ items }: { items: RewardItem[] }) {
  return (
    <ScrollView 
      horizontal 
      nestedScrollEnabled
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={s.scrollContainer}
    >
      {items.map((item) => (
        <View key={item.id} style={s.card}>
          <Image source={{ uri: item.image }} style={s.image} />
          <Text style={s.name}>{item.name}</Text>
          <Text style={s.xp}>{item.xp} XP</Text>
        </View>
      ))}
    </ScrollView>
  );
}

const s = StyleSheet.create({
  scrollContainer: {
    flexDirection: 'row',
    gap: 16,
    paddingHorizontal: 16
  },
  card: {
    width: cardWidth,
    backgroundColor: '#2B231C',
    borderRadius: 18,
    padding: 12
  },
  image: {
    width: '100%',
    height: 120,
    borderRadius: 12
  },
  name: {
    color: '#F4ECE4',
    fontSize: 16,
    fontWeight: '700',
    marginTop: 8
  },
  xp: {
    color: '#E58B2B',
    fontSize: 14,
    fontWeight: '600',
    marginTop: 4
  }
});