import React from 'react';
import { View, Image, Text, StyleSheet } from 'react-native';
import type { ProductItem } from '../../types/spirit';

export default function ProductCard({ item }: { item: ProductItem }) {
  return (
    <View style={s.card}>
      <Image source={{ uri: item.image }} style={s.image} />
      <View style={s.content}>
        <Text style={s.name}>{item.name}</Text>
        {item.blurb && <Text style={s.blurb}>{item.blurb}</Text>}
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  card: {
    width: 260,
    marginRight: 20
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 18
  },
  content: {
    marginTop: 16
  },
  name: {
    color: '#F4ECE4',
    fontSize: 18,
    fontWeight: '700'
  },
  blurb: {
    color: '#C9BEB3',
    fontSize: 15,
    lineHeight: 20,
    marginTop: 6
  }
});