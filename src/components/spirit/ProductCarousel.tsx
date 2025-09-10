import React from 'react';
import { ScrollView } from 'react-native';
import ProductCard from './ProductCard';
import type { ProductItem } from '../../types/spirit';

export default function ProductCarousel({ items }: { items: ProductItem[] }) {
  return (
    <ScrollView 
      horizontal 
      nestedScrollEnabled
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ paddingHorizontal: 20, gap: 20 }}
    >
      {items.map((item) => (
        <ProductCard key={item.id} item={item} />
      ))}
    </ScrollView>
  );
}