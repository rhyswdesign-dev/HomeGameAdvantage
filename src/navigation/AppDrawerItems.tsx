import * as React from 'react';
import { View } from 'react-native';
import {
  DrawerContentComponentProps,
  DrawerItem,
} from '@react-navigation/drawer';

/**
 * AppDrawerItems
 * Renders drawer routes and navigates with onPress only.
 * No `to` or `buildLink` usage (avoids "buildLink is not a function" crash).
 */
export default function AppDrawerItems({
  state,
  navigation,
  descriptors,
}: DrawerContentComponentProps) {
  return (
    <View>
      {state.routes.map((route, index) => {
        const focused = index === state.index;
        const options = descriptors[route.key]?.options ?? {};
        const label =
          typeof options.drawerLabel === 'string'
            ? options.drawerLabel
            : options.title ?? route.name;

        return (
          <DrawerItem
            key={route.key}
            label={label}
            focused={focused}
            onPress={() => {
              if (route.params) {
                navigation.navigate(route.name as string, route.params);
              } else {
                navigation.navigate(route.name as string);
              }
            }}
            icon={options.drawerIcon}
          />
        );
      })}
    </View>
  );
}
