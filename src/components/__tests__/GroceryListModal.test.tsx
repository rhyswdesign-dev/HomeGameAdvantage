/**
 * GroceryListModal Tests
 */

import { describe, it, expect, vi } from 'vitest';
import { GroceryListService } from '../../services/groceryListService';

describe('GroceryListModal', () => {
  describe('GroceryListService', () => {
    it('should generate grocery list from ingredients', () => {
      const ingredients = ['2 oz Gin', '4 oz Tonic Water', '1 Lime'];
      const result = GroceryListService.generateGroceryList(
        'Gin & Tonic',
        ingredients
      );

      expect(result.name).toContain('Gin & Tonic');
      expect(result.items.length).toBeGreaterThan(0);
    });

    it('should categorize ingredients correctly', () => {
      const mockList = {
        id: 'list1',
        userId: 'user1',
        name: 'Test List',
        items: [
          {
            id: 'item1',
            name: 'Gin',
            quantity: '2 oz',
            category: 'Spirits' as const,
            purchased: false,
          },
          {
            id: 'item2',
            name: 'Lemon',
            quantity: '1',
            category: 'Produce' as const,
            purchased: false,
          },
        ],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const grouped = GroceryListService.groupByCategory(mockList);

      expect(grouped).toHaveProperty('Spirits');
      expect(grouped).toHaveProperty('Produce');
      expect(grouped['Spirits']).toHaveLength(1);
      expect(grouped['Produce']).toHaveLength(1);
    });

    it('should calculate total cost correctly', () => {
      const mockList = {
        id: 'list1',
        userId: 'user1',
        name: 'Test List',
        items: [
          {
            id: 'item1',
            name: 'Gin',
            quantity: '2 oz',
            category: 'Spirits' as const,
            purchased: false,
            estimatedPrice: 25.99,
          },
          {
            id: 'item2',
            name: 'Tonic',
            quantity: '4 oz',
            category: 'Mixers' as const,
            purchased: false,
            estimatedPrice: 3.99,
          },
        ],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const total = GroceryListService.calculateTotalCost(mockList);

      expect(total).toBeCloseTo(29.98, 2);
    });
  });
});
