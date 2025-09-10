import React from 'react';
import { ScrollView, View, Image, Text, StyleSheet } from 'react-native';
import type { Ambassador } from '../../types/spirit';

export default function AmbassadorsRow({ people }: { people: Ambassador[] }) {
  return (
    <ScrollView 
      horizontal 
      nestedScrollEnabled
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ paddingHorizontal: 16, gap: 20 }}
    >
      {people.map((person) => (
        <View key={person.id} style={s.person}>
          <Image source={{ uri: person.avatar }} style={s.avatar} />
          <Text style={s.name}>{person.name}</Text>
          <Text style={s.role}>{person.role}</Text>
        </View>
      ))}
    </ScrollView>
  );
}

const s = StyleSheet.create({
  person: {
    alignItems: 'center',
    width: 100
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40
  },
  name: {
    color: '#F4ECE4',
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
    marginTop: 8
  },
  role: {
    color: '#C9BEB3',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 2
  }
});