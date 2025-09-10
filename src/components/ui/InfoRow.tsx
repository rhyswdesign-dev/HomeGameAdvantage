import React from 'react';
import { View, Text } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

type Props = {
  icon: string;
  text: string;
};

export default function InfoRow({ icon, text }: Props) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginVertical: 6 }}>
      <View
        style={{
          width: 40,
          height: 40,
          borderRadius: 10,
          backgroundColor: 'rgba(255,255,255,0.06)',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <MaterialCommunityIcons name={icon as any} size={22} color="#EADBC8" />
      </View>
      <Text style={{ color: '#EDE6DE', fontSize: 16 }}>{text}</Text>
    </View>
  );
}