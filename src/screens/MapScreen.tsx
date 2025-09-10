import React from 'react';
import { View, Text, Linking, Button } from 'react-native';
import { colors, spacing, textStyles } from '../theme/tokens';

export default function MapScreen() {
  return (
    <View style={{ flex: 1, backgroundColor: colors.bg, padding: spacing(2) }}>
      <Text style={[textStyles.h3, { marginBottom: 12 }]}>
        Maps
      </Text>
      <Text style={{ color: colors.textMuted, marginBottom: 16 }}>
        Hook this up to your embedded map or deep-link to Apple/Google Maps.
      </Text>
      <Button title="Open Apple Maps" onPress={() => Linking.openURL('http://maps.apple.com/?q=Bar')} />
    </View>
  );
}
