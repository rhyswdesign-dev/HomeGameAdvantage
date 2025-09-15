import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TextInput,
  Pressable,
  ScrollView,
  Image,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, radii } from '../theme/tokens';
import { searchService, SearchableItem } from '../services/searchService';

interface SearchModalProps {
  visible: boolean;
  onClose: () => void;
  onSearch: (query: string) => void;
  initialQuery?: string;
}

export default function SearchModal({
  visible,
  onClose,
  onSearch,
  initialQuery = '',
}: SearchModalProps) {
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<SearchableItem[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([
    'Old Fashioned',
    'Whiskey',
    'Mixology Class',
    'Sarah Chen',
  ]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (visible) {
      setQuery(initialQuery);
      if (initialQuery) {
        handleSearch(initialQuery);
      } else {
        // Show popular/trending items when no query
        setResults(searchService.search(''));
      }
    }
  }, [visible, initialQuery]);

  const handleSearch = (searchQuery: string) => {
    setIsSearching(true);
    const searchResults = searchService.search(searchQuery);
    setResults(searchResults);
    setIsSearching(false);

    // Add to recent searches if not empty
    if (searchQuery.trim()) {
      setRecentSearches(prev => {
        const updated = [searchQuery, ...prev.filter(s => s !== searchQuery)];
        return updated.slice(0, 5); // Keep only 5 recent searches
      });
    }
  };

  const handleSubmit = () => {
    if (query.trim()) {
      onSearch(query);
      onClose();
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'recipe': return 'restaurant';
      case 'spirit': return 'wine';
      case 'event': return 'calendar';
      case 'user': return 'person';
      case 'bar': return 'business';
      case 'game': return 'game-controller';
      default: return 'search';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'recipe': return '#FF6B6B';
      case 'spirit': return '#4ECDC4';
      case 'event': return '#45B7D1';
      case 'user': return '#96CEB4';
      case 'bar': return '#FFEAA7';
      case 'game': return '#DDA0DD';
      default: return colors.accent;
    }
  };

  const renderSearchResult = ({ item }: { item: SearchableItem }) => (
    <Pressable 
      style={styles.resultItem}
      onPress={() => {
        onSearch(item.title);
        onClose();
      }}
    >
      <View style={styles.resultImageContainer}>
        {item.image ? (
          <Image source={{ uri: item.image }} style={styles.resultImage} />
        ) : (
          <View style={[styles.resultImagePlaceholder, { backgroundColor: getCategoryColor(item.category) + '20' }]}>
            <Ionicons 
              name={getCategoryIcon(item.category) as any} 
              size={24} 
              color={getCategoryColor(item.category)} 
            />
          </View>
        )}
      </View>
      
      <View style={styles.resultInfo}>
        <View style={styles.resultHeader}>
          <Text style={styles.resultTitle} numberOfLines={1}>
            {item.title}
          </Text>
          <View style={[styles.categoryBadge, { backgroundColor: getCategoryColor(item.category) }]}>
            <Text style={styles.categoryBadgeText}>
              {item.category}
            </Text>
          </View>
        </View>
        
        {item.subtitle && (
          <Text style={styles.resultSubtitle} numberOfLines={1}>
            {item.subtitle}
          </Text>
        )}
        
        {item.description && (
          <Text style={styles.resultDescription} numberOfLines={2}>
            {item.description}
          </Text>
        )}

        <View style={styles.resultMeta}>
          {item.difficulty && (
            <View style={styles.metaItem}>
              <Ionicons name="bar-chart" size={14} color={colors.subtext} />
              <Text style={styles.metaText}>{item.difficulty}</Text>
            </View>
          )}
          {item.abv && (
            <View style={styles.metaItem}>
              <Ionicons name="thermometer" size={14} color={colors.subtext} />
              <Text style={styles.metaText}>{item.abv}% ABV</Text>
            </View>
          )}
          {item.time && (
            <View style={styles.metaItem}>
              <Ionicons name="time" size={14} color={colors.subtext} />
              <Text style={styles.metaText}>{item.time}m</Text>
            </View>
          )}
        </View>
      </View>
    </Pressable>
  );

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="fullScreen">
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.searchBar}>
            <Ionicons name="search" size={20} color={colors.subtext} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search recipes, spirits, events, users..."
              value={query}
              onChangeText={(text) => {
                setQuery(text);
                if (text.trim()) {
                  handleSearch(text);
                } else {
                  setResults(searchService.search(''));
                }
              }}
              onSubmitEditing={handleSubmit}
              placeholderTextColor={colors.subtext}
              autoFocus
              returnKeyType="search"
            />
            {query.length > 0 && (
              <Pressable onPress={() => setQuery('')}>
                <Ionicons name="close-circle" size={20} color={colors.subtext} />
              </Pressable>
            )}
          </View>
          <Pressable style={styles.cancelButton} onPress={onClose}>
            <Text style={styles.cancelText}>Cancel</Text>
          </Pressable>
        </View>

        {/* Content */}
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Recent Searches */}
          {!query && recentSearches.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Recent Searches</Text>
              <View style={styles.recentSearches}>
                {recentSearches.map((search, index) => (
                  <Pressable
                    key={index}
                    style={styles.recentSearchItem}
                    onPress={() => {
                      setQuery(search);
                      handleSearch(search);
                    }}
                  >
                    <Ionicons name="time" size={16} color={colors.subtext} />
                    <Text style={styles.recentSearchText}>{search}</Text>
                  </Pressable>
                ))}
              </View>
            </View>
          )}

          {/* Search Results */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {query ? `Results for "${query}"` : 'Popular & Trending'}
            </Text>
            <FlatList
              data={results}
              renderItem={renderSearchResult}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
              ItemSeparatorComponent={() => <View style={{ height: spacing(2) }} />}
              ListEmptyComponent={() => (
                <View style={styles.emptyState}>
                  <Ionicons name="search" size={48} color={colors.subtext} />
                  <Text style={styles.emptyText}>
                    {query ? 'No results found' : 'Start typing to search'}
                  </Text>
                  <Text style={styles.emptySubtext}>
                    Try searching for recipes, spirits, events, or users
                  </Text>
                </View>
              )}
            />
          </View>
        </ScrollView>
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
    paddingHorizontal: spacing(3),
    paddingVertical: spacing(2),
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
    gap: spacing(2),
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: radii.lg,
    paddingHorizontal: spacing(3),
    paddingVertical: spacing(2),
    gap: spacing(2),
    borderWidth: 1,
    borderColor: colors.line,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
  },
  cancelButton: {
    paddingVertical: spacing(1),
  },
  cancelText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.accent,
  },
  content: {
    flex: 1,
  },
  section: {
    paddingVertical: spacing(3),
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.text,
    paddingHorizontal: spacing(3),
    marginBottom: spacing(2),
  },
  recentSearches: {
    paddingHorizontal: spacing(3),
    gap: spacing(2),
  },
  recentSearchItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing(2),
    gap: spacing(2),
  },
  recentSearchText: {
    fontSize: 16,
    color: colors.text,
  },
  resultItem: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    borderRadius: radii.lg,
    padding: spacing(3),
    marginHorizontal: spacing(3),
    borderWidth: 1,
    borderColor: colors.line,
    gap: spacing(3),
  },
  resultImageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  resultImage: {
    width: 60,
    height: 60,
    borderRadius: radii.md,
  },
  resultImagePlaceholder: {
    width: 60,
    height: 60,
    borderRadius: radii.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  resultInfo: {
    flex: 1,
    gap: spacing(1),
  },
  resultHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: spacing(2),
  },
  resultTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  categoryBadge: {
    paddingHorizontal: spacing(1.5),
    paddingVertical: spacing(0.5),
    borderRadius: radii.sm,
  },
  categoryBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.white,
    textTransform: 'uppercase',
  },
  resultSubtitle: {
    fontSize: 14,
    color: colors.subtext,
    fontWeight: '600',
  },
  resultDescription: {
    fontSize: 14,
    color: colors.subtext,
    lineHeight: 20,
  },
  resultMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing(3),
    marginTop: spacing(1),
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing(0.5),
  },
  metaText: {
    fontSize: 12,
    color: colors.subtext,
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing(8),
    paddingHorizontal: spacing(4),
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginTop: spacing(2),
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    color: colors.subtext,
    marginTop: spacing(1),
    textAlign: 'center',
    lineHeight: 20,
  },
});