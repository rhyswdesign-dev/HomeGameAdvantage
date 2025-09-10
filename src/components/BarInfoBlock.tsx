import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import InfoPill from './InfoPill';

type Props = {
  address?: string;
};

export default function BarInfoBlock({ address = '123 Main St, Anytown' }: Props) {
  return (
    <View style={styles.wrap}>
      {/* Address line */}
      <Text style={styles.address}>{address}</Text>

      {/* Vertical list of icon pills */}
      <View style={styles.pills}>
        <InfoPill icon="music"     label="Live Jazz" />
        <InfoPill icon="key"       label="Speakeasy" />
        <InfoPill icon="columns"   label="Classic Revival" />
        <InfoPill icon="calendar"  label="Saturdays" />
        <InfoPill icon="clock"     label="4–7 PM Weekdays" />
      </View>

      {/* Section title below (for your “Signature Drinks”) */}
      <Text style={styles.sectionTitle}>Signature Drinks</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    backgroundColor: '#201912',    // page background
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  address: {
    color: '#A79D8E',
    fontSize: 13,
    marginBottom: 8,
  },
  pills: {
    marginTop: 4,
    marginBottom: 12,
  },
  sectionTitle: {
    color: '#F1EAE0',
    fontSize: 20,
    fontWeight: '800',
    marginTop: 4,
    marginBottom: 8,
  },
});
