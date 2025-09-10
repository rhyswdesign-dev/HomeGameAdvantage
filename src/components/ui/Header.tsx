import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { colors, spacing, fonts } from '../../theme/tokens';

interface HeaderProps {
  title?: string;
  subtitle?: string;
  showBackButton?: boolean;
  showSearch?: boolean;
  showFilter?: boolean;
  showMenu?: boolean;
  onSearch?: () => void;
  onFilter?: () => void;
  onMenu?: () => void;
  centerTitle?: boolean;
  rightComponent?: React.ReactNode;
  leftComponent?: React.ReactNode;
}

export default function Header({
  title,
  subtitle,
  showBackButton = true,
  showSearch = false,
  showFilter = false,
  showMenu = false,
  onSearch,
  onFilter,
  onMenu,
  centerTitle = false,
  rightComponent,
  leftComponent,
}: HeaderProps) {
  const navigation = useNavigation();

  const handleBack = () => {
    navigation.goBack();
  };

  const renderLeftContent = () => {
    if (leftComponent) return leftComponent;
    
    if (showBackButton) {
      return (
        <Pressable hitSlop={12} onPress={handleBack} style={styles.iconButton}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </Pressable>
      );
    }
    
    return <View style={styles.iconButton} />;
  };

  const renderRightContent = () => {
    if (rightComponent) return rightComponent;

    const icons = [];
    
    if (showSearch) {
      icons.push(
        <Pressable key="search" hitSlop={10} onPress={onSearch} style={styles.iconButton}>
          <Ionicons name="search-outline" size={20} color={colors.text} />
        </Pressable>
      );
    }
    
    if (showFilter) {
      icons.push(
        <Pressable key="filter" hitSlop={10} onPress={onFilter} style={styles.iconButton}>
          <Ionicons name="funnel-outline" size={20} color={colors.text} />
        </Pressable>
      );
    }
    
    if (showMenu) {
      icons.push(
        <Pressable key="menu" hitSlop={10} onPress={onMenu} style={styles.iconButton}>
          <Ionicons name="ellipsis-horizontal" size={20} color={colors.text} />
        </Pressable>
      );
    }

    if (icons.length === 0) {
      return <View style={styles.iconButton} />;
    }

    return (
      <View style={styles.rightContainer}>
        {icons}
      </View>
    );
  };

  return (
    <SafeAreaView edges={['top']} style={styles.container}>
      <View style={styles.header}>
        {renderLeftContent()}
        
        <View style={[styles.titleContainer, centerTitle && styles.centerTitle]}>
          {title && (
            <Text style={[styles.title, centerTitle && styles.centerTitleText]}>
              {title}
            </Text>
          )}
          {subtitle && (
            <Text style={[styles.subtitle, centerTitle && styles.centerTitleText]}>
              {subtitle}
            </Text>
          )}
        </View>
        
        {renderRightContent()}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.bg,
    borderBottomWidth: 0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing(2),
    paddingVertical: spacing(1.5),
    minHeight: 56,
  },
  iconButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleContainer: {
    flex: 1,
    paddingHorizontal: spacing(2),
  },
  centerTitle: {
    alignItems: 'center',
  },
  title: {
    color: colors.text,
    fontSize: fonts.h2,
    fontWeight: '900',
  },
  centerTitleText: {
    textAlign: 'center',
  },
  subtitle: {
    color: colors.subtext,
    fontSize: fonts.caption,
    marginTop: 2,
  },
  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing(1),
  },
});