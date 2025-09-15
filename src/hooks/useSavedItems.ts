import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface SavedItem {
  id: string;
  name: string;
  subtitle?: string;
  image?: string;
  type: 'bar' | 'spirit' | 'cocktail' | 'event' | 'community' | 'vault' | 'game' | 'drink';
}

export interface SavedItemsState {
  savedBars: SavedItem[];
  savedSpirits: SavedItem[];
  savedCocktails: SavedItem[];
  savedEvents: SavedItem[];
  followedCommunities: SavedItem[];
  savedVaultItems: SavedItem[];
  savedGames: SavedItem[];
  savedDrinks: SavedItem[];
}

const STORAGE_KEY = 'savedItems';

export function useSavedItems() {
  const [savedItems, setSavedItems] = useState<SavedItemsState>({
    savedBars: [],
    savedSpirits: [],
    savedCocktails: [],
    savedEvents: [],
    followedCommunities: [],
    savedVaultItems: [],
    savedGames: [],
    savedDrinks: [],
  });

  // Load saved items from AsyncStorage on mount
  useEffect(() => {
    loadSavedItems();
  }, []);

  const loadSavedItems = async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsedItems = JSON.parse(stored);
        console.log('Loaded saved items:', parsedItems);
        
        // Ensure all required properties exist with default empty arrays
        const mergedItems: SavedItemsState = {
          savedBars: parsedItems.savedBars || [],
          savedSpirits: parsedItems.savedSpirits || [],
          savedCocktails: parsedItems.savedCocktails || [],
          savedEvents: parsedItems.savedEvents || [],
          followedCommunities: parsedItems.followedCommunities || [],
          savedVaultItems: parsedItems.savedVaultItems || [],
          savedGames: parsedItems.savedGames || [],
          savedDrinks: parsedItems.savedDrinks || [],
        };
        
        setSavedItems(mergedItems);
      }
    } catch (error) {
      console.log('Error loading saved items:', error);
    }
  };

  const saveToStorage = async (newItems: SavedItemsState) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newItems));
      console.log('Saved to storage:', newItems);
    } catch (error) {
      console.log('Error saving items:', error);
    }
  };

  const clearStorage = async () => {
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
      setSavedItems({
        savedBars: [],
        savedSpirits: [],
        savedCocktails: [],
        savedEvents: [],
        followedCommunities: [],
        savedVaultItems: [],
        savedGames: [],
        savedDrinks: [],
      });
      console.log('Storage cleared');
    } catch (error) {
      console.log('Error clearing storage:', error);
    }
  };

  const toggleSavedBar = (item: SavedItem | { id: string; name: string; subtitle?: string; image?: string }) => {
    const barItem: SavedItem = { ...item, type: 'bar' };
    console.log('Toggling bar:', barItem);
    setSavedItems(prev => {
      const exists = prev.savedBars.find(b => b.id === barItem.id);
      const newItems = {
        ...prev,
        savedBars: exists
          ? prev.savedBars.filter(b => b.id !== barItem.id)
          : [...prev.savedBars, barItem]
      };
      console.log('New saved bars:', newItems.savedBars);
      saveToStorage(newItems);
      return newItems;
    });
  };

  const toggleSavedSpirit = (item: SavedItem | { id: string; name: string; subtitle?: string; image?: string }) => {
    const spiritItem: SavedItem = { ...item, type: 'spirit' };
    setSavedItems(prev => {
      const exists = prev.savedSpirits.find(s => s.id === spiritItem.id);
      const newItems = {
        ...prev,
        savedSpirits: exists
          ? prev.savedSpirits.filter(s => s.id !== spiritItem.id)
          : [...prev.savedSpirits, spiritItem]
      };
      saveToStorage(newItems);
      return newItems;
    });
  };

  const toggleSavedCocktail = (item: SavedItem | { id: string; name: string; subtitle?: string; image?: string }) => {
    const cocktailItem: SavedItem = { ...item, type: 'cocktail' };
    setSavedItems(prev => {
      const exists = prev.savedCocktails.find(c => c.id === cocktailItem.id);
      const newItems = {
        ...prev,
        savedCocktails: exists
          ? prev.savedCocktails.filter(c => c.id !== cocktailItem.id)
          : [...prev.savedCocktails, cocktailItem]
      };
      saveToStorage(newItems);
      return newItems;
    });
  };

  const toggleSavedEvent = (item: SavedItem | { id: string; name: string; subtitle?: string; image?: string }) => {
    const eventItem: SavedItem = { ...item, type: 'event' };
    setSavedItems(prev => {
      const exists = prev.savedEvents.find(e => e.id === eventItem.id);
      const newItems = {
        ...prev,
        savedEvents: exists
          ? prev.savedEvents.filter(e => e.id !== eventItem.id)
          : [...prev.savedEvents, eventItem]
      };
      saveToStorage(newItems);
      return newItems;
    });
  };

  const toggleFollowedCommunity = (item: SavedItem | { id: string; name: string; subtitle?: string; image?: string }) => {
    const communityItem: SavedItem = { ...item, type: 'community' };
    setSavedItems(prev => {
      const exists = prev.followedCommunities.find(c => c.id === communityItem.id);
      const newItems = {
        ...prev,
        followedCommunities: exists
          ? prev.followedCommunities.filter(c => c.id !== communityItem.id)
          : [...prev.followedCommunities, communityItem]
      };
      saveToStorage(newItems);
      return newItems;
    });
  };

  const toggleSavedVaultItem = (item: SavedItem | { id: string; name: string; subtitle?: string; image?: string }) => {
    const vaultItem: SavedItem = { ...item, type: 'vault' };
    setSavedItems(prev => {
      const savedVaultItems = prev.savedVaultItems || [];
      const exists = savedVaultItems.find(v => v.id === vaultItem.id);
      const newItems = {
        ...prev,
        savedVaultItems: exists
          ? savedVaultItems.filter(v => v.id !== vaultItem.id)
          : [...savedVaultItems, vaultItem]
      };
      saveToStorage(newItems);
      return newItems;
    });
  };

  const toggleSavedGame = (item: SavedItem | { id: string; name: string; subtitle?: string; image?: string }) => {
    const gameItem: SavedItem = { ...item, type: 'game' };
    setSavedItems(prev => {
      const savedGames = prev.savedGames || [];
      const exists = savedGames.find(g => g.id === gameItem.id);
      const newItems = {
        ...prev,
        savedGames: exists
          ? savedGames.filter(g => g.id !== gameItem.id)
          : [...savedGames, gameItem]
      };
      saveToStorage(newItems);
      return newItems;
    });
  };

  const toggleSavedDrink = (item: SavedItem | { id: string; name: string; subtitle?: string; image?: string }) => {
    const drinkItem: SavedItem = { ...item, type: 'drink' };
    setSavedItems(prev => {
      const savedDrinks = prev.savedDrinks || [];
      const exists = savedDrinks.find(d => d.id === drinkItem.id);
      const newItems = {
        ...prev,
        savedDrinks: exists
          ? savedDrinks.filter(d => d.id !== drinkItem.id)
          : [...savedDrinks, drinkItem]
      };
      saveToStorage(newItems);
      return newItems;
    });
  };

  // Helper functions to check if items are saved
  const isBarSaved = (barId: string) => {
    if (!savedItems.savedBars || !Array.isArray(savedItems.savedBars)) return false;
    const isSaved = savedItems.savedBars.some(b => b.id === barId);
    console.log(`Checking if bar ${barId} is saved:`, isSaved, 'Saved bars:', savedItems.savedBars.map(b => b.id));
    return isSaved;
  };
  const isSpiritSaved = (spiritId: string) => savedItems.savedSpirits?.some(s => s.id === spiritId) || false;
  const isCocktailSaved = (cocktailId: string) => savedItems.savedCocktails?.some(c => c.id === cocktailId) || false;
  const isEventSaved = (eventId: string) => savedItems.savedEvents?.some(e => e.id === eventId) || false;
  const isCommunityFollowed = (communityId: string) => savedItems.followedCommunities?.some(c => c.id === communityId) || false;
  const isVaultItemSaved = (vaultId: string) => savedItems.savedVaultItems?.some(v => v.id === vaultId) || false;
  const isGameSaved = (gameId: string) => savedItems.savedGames?.some(g => g.id === gameId) || false;
  const isDrinkSaved = (drinkId: string) => savedItems.savedDrinks?.some(d => d.id === drinkId) || false;

  return {
    savedItems,
    toggleSavedBar,
    toggleSavedSpirit,
    toggleSavedCocktail,
    toggleSavedEvent,
    toggleFollowedCommunity,
    toggleSavedVaultItem,
    toggleSavedGame,
    toggleSavedDrink,
    isBarSaved,
    isSpiritSaved,
    isCocktailSaved,
    isEventSaved,
    isCommunityFollowed,
    isVaultItemSaved,
    isGameSaved,
    isDrinkSaved,
    clearStorage, // For debugging
  };
}