import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Pressable,
  ScrollView,
  Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import { colors, spacing, radii } from '../theme/tokens';
import { searchService, FilterOptions } from '../services/searchService';

interface FilterDrawerProps {
  visible: boolean;
  onClose: () => void;
  onApply: (filters: Partial<FilterOptions>) => void;
  currentFilters: Partial<FilterOptions>;
  searchQuery?: string;
}

export default function FilterDrawer({
  visible,
  onClose,
  onApply,
  currentFilters,
  searchQuery = '',
}: FilterDrawerProps) {
  const [filters, setFilters] = useState<Partial<FilterOptions>>(currentFilters);
  const [filterOptions, setFilterOptions] = useState<{
    categories: Array<{ key: string; label: string; count: number; }>;
    difficulties: Array<{ key: string; label: string; count: number; }>;
    abvRange: [number, number];
    timeRange: [number, number];
  }>({
    categories: [],
    difficulties: [],
    abvRange: [0, 50],
    timeRange: [0, 60],
  });

  useEffect(() => {
    if (visible) {
      setFilters(currentFilters);
      const options = searchService.getFilterOptions(searchQuery);
      setFilterOptions(options);
    }
  }, [visible, currentFilters, searchQuery]);

  const updateFilter = (key: keyof FilterOptions, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const toggleCategory = (category: string) => {
    const currentCategories = filters.categories || [];
    const updated = currentCategories.includes(category)
      ? currentCategories.filter(c => c !== category)
      : [...currentCategories, category];
    updateFilter('categories', updated);
  };

  const toggleDifficulty = (difficulty: string) => {
    const currentDifficulties = filters.difficulties || [];
    const updated = currentDifficulties.includes(difficulty)
      ? currentDifficulties.filter(d => d !== difficulty)
      : [...currentDifficulties, difficulty];
    updateFilter('difficulties', updated);
  };

  const clearFilters = () => {
    setFilters({});
  };

  const applyFilters = () => {
    onApply(filters);
  };

  const hasActiveFilters = () => {
    return (
      (filters.categories && filters.categories.length > 0) ||
      (filters.difficulties && filters.difficulties.length > 0) ||
      filters.abvRange ||
      filters.timeRange ||
      filters.sortBy
    );
  };

  const sortOptions = [
    { key: 'relevance', label: 'Relevance', icon: 'star' },
    { key: 'popularity', label: 'Popularity', icon: 'trending-up' },
    { key: 'recent', label: 'Most Recent', icon: 'time' },
    { key: 'difficulty', label: 'Difficulty', icon: 'bar-chart' },
    { key: 'time', label: 'Preparation Time', icon: 'timer' },
    { key: 'abv', label: 'Alcohol Content', icon: 'thermometer' },
  ];

  return (
    <Modal 
      visible={visible} 
      animationType="slide" 
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Pressable style={styles.headerButton} onPress={onClose}>
            <Ionicons name="close" size={24} color={colors.text} />
          </Pressable>
          <Text style={styles.headerTitle}>Filter & Sort</Text>
          <Pressable 
            style={styles.headerButton} 
            onPress={clearFilters}
            disabled={!hasActiveFilters()}
          >
            <Text style={[
              styles.clearText, 
              !hasActiveFilters() && { color: colors.subtext }
            ]}>
              Clear
            </Text>
          </Pressable>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Sort Options */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Sort By</Text>
            <View style={styles.sortGrid}>
              {sortOptions.map((option) => {
                const isSelected = filters.sortBy === option.key;
                return (
                  <Pressable
                    key={option.key}
                    style={[styles.sortOption, isSelected && styles.sortOptionSelected]}
                    onPress={() => updateFilter('sortBy', option.key)}
                  >
                    <Ionicons 
                      name={option.icon as any} 
                      size={18} 
                      color={isSelected ? colors.white : colors.text} 
                    />
                    <Text style={[
                      styles.sortOptionText,
                      isSelected && styles.sortOptionTextSelected
                    ]}>
                      {option.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            {/* Sort Order */}
            {filters.sortBy && filters.sortBy !== 'relevance' && (
              <View style={styles.sortOrder}>
                <Text style={styles.subSectionTitle}>Order</Text>
                <View style={styles.sortOrderOptions}>
                  <Pressable
                    style={[
                      styles.sortOrderOption,
                      filters.sortOrder === 'asc' && styles.sortOrderOptionSelected
                    ]}
                    onPress={() => updateFilter('sortOrder', 'asc')}
                  >
                    <Ionicons name="arrow-up" size={16} color={
                      filters.sortOrder === 'asc' ? colors.white : colors.text
                    } />
                    <Text style={[
                      styles.sortOrderText,
                      filters.sortOrder === 'asc' && styles.sortOrderTextSelected
                    ]}>
                      Ascending
                    </Text>
                  </Pressable>
                  <Pressable
                    style={[
                      styles.sortOrderOption,
                      filters.sortOrder === 'desc' && styles.sortOrderOptionSelected
                    ]}
                    onPress={() => updateFilter('sortOrder', 'desc')}
                  >
                    <Ionicons name="arrow-down" size={16} color={
                      filters.sortOrder === 'desc' ? colors.white : colors.text
                    } />
                    <Text style={[
                      styles.sortOrderText,
                      filters.sortOrder === 'desc' && styles.sortOrderTextSelected
                    ]}>
                      Descending
                    </Text>
                  </Pressable>
                </View>
              </View>
            )}
          </View>

          {/* Categories */}
          {filterOptions.categories.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Categories</Text>
              <View style={styles.filterGrid}>
                {filterOptions.categories.map((category) => {
                  const isSelected = filters.categories?.includes(category.key);
                  return (
                    <Pressable
                      key={category.key}
                      style={[styles.filterChip, isSelected && styles.filterChipSelected]}
                      onPress={() => toggleCategory(category.key)}
                    >
                      <Text style={[
                        styles.filterChipText,
                        isSelected && styles.filterChipTextSelected
                      ]}>
                        {category.label} ({category.count})
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>
          )}

          {/* Difficulties */}
          {filterOptions.difficulties.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Difficulty</Text>
              <View style={styles.filterGrid}>
                {filterOptions.difficulties.map((difficulty) => {
                  const isSelected = filters.difficulties?.includes(difficulty.key);
                  return (
                    <Pressable
                      key={difficulty.key}
                      style={[styles.filterChip, isSelected && styles.filterChipSelected]}
                      onPress={() => toggleDifficulty(difficulty.key)}
                    >
                      <Text style={[
                        styles.filterChipText,
                        isSelected && styles.filterChipTextSelected
                      ]}>
                        {difficulty.label} ({difficulty.count})
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>
          )}

          {/* ABV Range */}
          {filterOptions.abvRange[1] > filterOptions.abvRange[0] && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>
                Alcohol Content (ABV): {filters.abvRange?.[0] || filterOptions.abvRange[0]}% - {filters.abvRange?.[1] || filterOptions.abvRange[1]}%
              </Text>
              <View style={styles.sliderContainer}>
                <Slider
                  style={styles.slider}
                  minimumValue={filterOptions.abvRange[0]}
                  maximumValue={filterOptions.abvRange[1]}
                  value={filters.abvRange?.[0] || filterOptions.abvRange[0]}
                  onValueChange={(value) => {
                    const currentRange = filters.abvRange || filterOptions.abvRange;
                    updateFilter('abvRange', [Math.round(value), currentRange[1]]);
                  }}
                  minimumTrackTintColor={colors.accent}
                  maximumTrackTintColor={colors.line}
                />
                <Slider
                  style={styles.slider}
                  minimumValue={filterOptions.abvRange[0]}
                  maximumValue={filterOptions.abvRange[1]}
                  value={filters.abvRange?.[1] || filterOptions.abvRange[1]}
                  onValueChange={(value) => {
                    const currentRange = filters.abvRange || filterOptions.abvRange;
                    updateFilter('abvRange', [currentRange[0], Math.round(value)]);
                  }}
                  minimumTrackTintColor={colors.accent}
                  maximumTrackTintColor={colors.line}
                />
              </View>
            </View>
          )}

          {/* Time Range */}
          {filterOptions.timeRange[1] > filterOptions.timeRange[0] && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>
                Preparation Time: {filters.timeRange?.[0] || filterOptions.timeRange[0]}m - {filters.timeRange?.[1] || filterOptions.timeRange[1]}m
              </Text>
              <View style={styles.sliderContainer}>
                <Slider
                  style={styles.slider}
                  minimumValue={filterOptions.timeRange[0]}
                  maximumValue={filterOptions.timeRange[1]}
                  value={filters.timeRange?.[0] || filterOptions.timeRange[0]}
                  onValueChange={(value) => {
                    const currentRange = filters.timeRange || filterOptions.timeRange;
                    updateFilter('timeRange', [Math.round(value), currentRange[1]]);
                  }}
                  minimumTrackTintColor={colors.accent}
                  maximumTrackTintColor={colors.line}
                />
                <Slider
                  style={styles.slider}
                  minimumValue={filterOptions.timeRange[0]}
                  maximumValue={filterOptions.timeRange[1]}
                  value={filters.timeRange?.[1] || filterOptions.timeRange[1]}
                  onValueChange={(value) => {
                    const currentRange = filters.timeRange || filterOptions.timeRange;
                    updateFilter('timeRange', [currentRange[0], Math.round(value)]);
                  }}
                  minimumTrackTintColor={colors.accent}
                  maximumTrackTintColor={colors.line}
                />
              </View>
            </View>
          )}
        </ScrollView>

        {/* Footer */}
        <View style={styles.footer}>
          <Pressable style={styles.applyButton} onPress={applyFilters}>
            <Text style={styles.applyButtonText}>Apply Filters</Text>
            {hasActiveFilters() && (
              <View style={styles.filterCount}>
                <Text style={styles.filterCountText}>
                  {(filters.categories?.length || 0) + (filters.difficulties?.length || 0)}
                </Text>
              </View>
            )}
          </Pressable>
        </View>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing(3),
    paddingVertical: spacing(2),
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
  },
  headerButton: {
    padding: spacing(1),
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.text,
  },
  clearText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.accent,
  },
  content: {
    flex: 1,
  },
  section: {
    paddingVertical: spacing(3),
    paddingHorizontal: spacing(3),
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing(2),
  },
  subSectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing(2),
    marginTop: spacing(2),
  },
  sortGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing(2),
  },
  sortOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing(3),
    paddingVertical: spacing(2),
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.card,
    gap: spacing(1),
    minWidth: '48%',
  },
  sortOptionSelected: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  sortOptionText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  sortOptionTextSelected: {
    color: colors.white,
  },
  sortOrder: {
    marginTop: spacing(2),
  },
  sortOrderOptions: {
    flexDirection: 'row',
    gap: spacing(2),
  },
  sortOrderOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing(3),
    paddingVertical: spacing(2),
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.card,
    gap: spacing(1),
    flex: 1,
  },
  sortOrderOptionSelected: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  sortOrderText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  sortOrderTextSelected: {
    color: colors.white,
  },
  filterGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing(2),
  },
  filterChip: {
    paddingHorizontal: spacing(3),
    paddingVertical: spacing(2),
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.card,
  },
  filterChipSelected: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  filterChipText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  filterChipTextSelected: {
    color: colors.white,
  },
  sliderContainer: {
    paddingVertical: spacing(2),
  },
  slider: {
    width: '100%',
    height: 40,
  },
  footer: {
    paddingHorizontal: spacing(3),
    paddingVertical: spacing(2),
    borderTopWidth: 1,
    borderTopColor: colors.line,
  },
  applyButton: {
    backgroundColor: colors.accent,
    paddingVertical: spacing(3),
    borderRadius: radii.md,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing(2),
  },
  applyButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.white,
  },
  filterCount: {
    backgroundColor: colors.white + '30',
    borderRadius: 12,
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterCountText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.white,
  },
});