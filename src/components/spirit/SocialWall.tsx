import React from 'react';
import { ScrollView, View, Image, Text, StyleSheet } from 'react-native';
import type { SocialPost } from '../../types/spirit';

const cardWidth = 160;

export default function SocialWall({ posts }: { posts: SocialPost[] }) {
  return (
    <ScrollView 
      horizontal 
      nestedScrollEnabled
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={s.scrollContainer}
    >
      {posts.map((post) => (
        <View key={post.id} style={s.card}>
          <Image source={{ uri: post.image }} style={s.image} />
          <View style={s.content}>
            {post.handle && <Text style={s.handle}>{post.handle}</Text>}
            {post.caption && <Text style={s.caption}>{post.caption}</Text>}
          </View>
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
    overflow: 'hidden'
  },
  image: {
    width: '100%',
    height: 140
  },
  content: {
    padding: 12
  },
  handle: {
    color: '#E58B2B',
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 4
  },
  caption: {
    color: '#C9BEB3',
    fontSize: 12,
    lineHeight: 16
  }
});