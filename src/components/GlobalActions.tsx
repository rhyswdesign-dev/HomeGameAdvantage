import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  TextInput,
  Modal,
  Share,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, radii } from '../theme/tokens';
import { searchService, SearchableItem, FilterOptions } from '../services/searchService';
import SearchModal from './SearchModal';
import FilterDrawer from './FilterDrawer';
import CreateRecipeModal from './CreateRecipeModal';
import CreateCompetitionEntryModal from './CreateCompetitionEntryModal';

interface GlobalActionsProps {
  onSearch?: (results: SearchableItem[]) => void;
  onShare?: (content: any) => void;
  onAdd?: () => void;
  onUpload?: () => void;
  onDownload?: (item: any) => void;
  onRecipeCreated?: (recipeId: string) => void;
  onCompetitionEntryCreated?: (entryId: string) => void;
  showSearch?: boolean;
  showFilter?: boolean;
  showAdd?: boolean;
  showShare?: boolean;
  showUpload?: boolean;
  showDownload?: boolean;
  competitionId?: string;
  competitionTitle?: string;
}

export default function GlobalActions({
  onSearch,
  onShare,
  onAdd,
  onUpload,
  onDownload,
  onRecipeCreated,
  onCompetitionEntryCreated,
  showSearch = true,
  showFilter = true,
  showAdd = true,
  showShare = true,
  showUpload = false,
  showDownload = false,
  competitionId,
  competitionTitle,
}: GlobalActionsProps) {
  const [searchVisible, setSearchVisible] = useState(false);
  const [filterVisible, setFilterVisible] = useState(false);
  const [createRecipeVisible, setCreateRecipeVisible] = useState(false);
  const [createEntryVisible, setCreateEntryVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<Partial<FilterOptions>>({});

  const handleSearch = (query: string, newFilters?: Partial<FilterOptions>) => {
    const combinedFilters = { ...filters, ...newFilters };
    const results = searchService.search(query, combinedFilters);
    onSearch?.(results);
    setSearchQuery(query);
    setFilters(combinedFilters);
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: 'Check out this amazing cocktail app!',
        title: 'Home Game Advantage',
      });
    } catch (error) {
      Alert.alert('Error', 'Unable to share at this time');
    }
  };

  const handleAdd = () => {
    if (competitionId) {
      // We're in a competition context
      setCreateEntryVisible(true);
    } else {
      // General context - show options
      Alert.alert(
        'Create Content',
        'What would you like to create?',
        [
          { text: 'Recipe', onPress: () => setCreateRecipeVisible(true) },
          { text: 'Competition Entry', onPress: () => setCreateEntryVisible(true) },
          { text: 'Cancel', style: 'cancel' },
        ]
      );
    }
  };

  const handleUpload = () => {
    Alert.alert(
      'Upload Content',
      'What would you like to upload?',
      [
        { text: 'Photo', onPress: () => onUpload?.() },
        { text: 'Video', onPress: () => onUpload?.() },
        { text: 'Recipe', onPress: () => setCreateRecipeVisible(true) },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  return (
    <>
      <View style={styles.container}>
        <View style={styles.actionsRow}>
          {showSearch && (
            <Pressable 
              style={styles.actionButton} 
              onPress={() => setSearchVisible(true)}
            >
              <Ionicons name="search" size={20} color={colors.text} />
              <Text style={styles.actionLabel}>Search</Text>
            </Pressable>
          )}

          {showFilter && (
            <Pressable 
              style={styles.actionButton} 
              onPress={() => setFilterVisible(true)}
            >
              <Ionicons name="funnel" size={20} color={colors.text} />
              <Text style={styles.actionLabel}>Filter</Text>
            </Pressable>
          )}

          {showAdd && (
            <Pressable 
              style={styles.actionButton} 
              onPress={handleAdd}
            >
              <Ionicons name="add-circle" size={20} color={colors.accent} />
              <Text style={[styles.actionLabel, { color: colors.accent }]}>Add</Text>
            </Pressable>
          )}

          {showShare && (
            <Pressable 
              style={styles.actionButton} 
              onPress={handleShare}
            >
              <Ionicons name="share" size={20} color={colors.text} />
              <Text style={styles.actionLabel}>Share</Text>
            </Pressable>
          )}

          {showUpload && (
            <Pressable 
              style={styles.actionButton} 
              onPress={handleUpload}
            >
              <Ionicons name="cloud-upload" size={20} color={colors.text} />
              <Text style={styles.actionLabel}>Upload</Text>
            </Pressable>
          )}

          {showDownload && (
            <Pressable 
              style={styles.actionButton} 
              onPress={() => onDownload?.({})}
            >
              <Ionicons name="download" size={20} color={colors.text} />
              <Text style={styles.actionLabel}>Download</Text>
            </Pressable>
          )}
        </View>
      </View>

      {/* Search Modal */}
      <SearchModal
        visible={searchVisible}
        onClose={() => setSearchVisible(false)}
        onSearch={handleSearch}
        initialQuery={searchQuery}
      />

      {/* Filter Drawer */}
      <FilterDrawer
        visible={filterVisible}
        onClose={() => setFilterVisible(false)}
        onApply={(newFilters) => {
          handleSearch(searchQuery, newFilters);
          setFilterVisible(false);
        }}
        currentFilters={filters}
        searchQuery={searchQuery}
      />

      {/* Create Recipe Modal */}
      <CreateRecipeModal
        visible={createRecipeVisible}
        onClose={() => setCreateRecipeVisible(false)}
        onSuccess={(recipeId) => {
          onRecipeCreated?.(recipeId);
          setCreateRecipeVisible(false);
        }}
      />

      {/* Create Competition Entry Modal */}
      <CreateCompetitionEntryModal
        visible={createEntryVisible}
        onClose={() => setCreateEntryVisible(false)}
        onSuccess={(entryId) => {
          onCompetitionEntryCreated?.(entryId);
          setCreateEntryVisible(false);
        }}
        competitionId={competitionId || 'general'}
        competitionTitle={competitionTitle}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.bg,
    borderTopWidth: 1,
    borderTopColor: colors.line,
    paddingVertical: spacing(1),
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: spacing(2),
  },
  actionButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing(1.5),
    paddingHorizontal: spacing(2),
    minWidth: 60,
    gap: spacing(0.5),
  },
  actionLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.text,
  },
});