import { inferBarTier, resolveTier } from '../inferBarTier';
import { BarContent } from '../../types/bar';

describe('inferBarTier', () => {
  const createBarContent = (overrides: Partial<BarContent> = {}): BarContent => ({
    id: 'test-bar',
    name: 'Test Bar',
    hero: { image: 'test.jpg' },
    ...overrides,
  });

  describe('Gold tier detection', () => {
    it('should return gold when team exists', () => {
      const bar = createBarContent({
        team: [{ name: 'John', role: 'Manager', avatar: 'avatar.jpg' }]
      });
      expect(inferBarTier(bar)).toBe('gold');
    });

    it('should return gold when rewards exist', () => {
      const bar = createBarContent({
        rewards: [{ image: 'reward.jpg', name: 'VIP Access', xp: 100 }]
      });
      expect(inferBarTier(bar)).toBe('gold');
    });

    it('should return gold when long story exists', () => {
      const bar = createBarContent({
        story: { 
          short: 'Short story',
          long: 'This is a much longer story about our bar...'
        }
      });
      expect(inferBarTier(bar)).toBe('gold');
    });

    it('should return gold when 3+ events exist', () => {
      const bar = createBarContent({
        events: [
          { title: 'Event 1', dateISO: '2024-01-01' },
          { title: 'Event 2', dateISO: '2024-01-02' },
          { title: 'Event 3', dateISO: '2024-01-03' }
        ]
      });
      expect(inferBarTier(bar)).toBe('gold');
    });

    it('should return gold when 4+ signature drinks exist', () => {
      const bar = createBarContent({
        signatureDrinks: [
          { image: 'drink1.jpg', name: 'Drink 1' },
          { image: 'drink2.jpg', name: 'Drink 2' },
          { image: 'drink3.jpg', name: 'Drink 3' },
          { image: 'drink4.jpg', name: 'Drink 4' }
        ]
      });
      expect(inferBarTier(bar)).toBe('gold');
    });

    it('should return gold when 3+ social posts exist', () => {
      const bar = createBarContent({
        social: [
          { image: 'social1.jpg', handle: '@user1' },
          { image: 'social2.jpg', handle: '@user2' },
          { image: 'social3.jpg', handle: '@user3' }
        ]
      });
      expect(inferBarTier(bar)).toBe('gold');
    });

    it('should return gold when challenge exists with 2+ events', () => {
      const bar = createBarContent({
        challenge: { image: 'challenge.jpg', title: 'Challenge Title' },
        events: [
          { title: 'Event 1', dateISO: '2024-01-01' },
          { title: 'Event 2', dateISO: '2024-01-02' }
        ]
      });
      expect(inferBarTier(bar)).toBe('gold');
    });

    it('should return gold when challenge exists with 3+ signature drinks', () => {
      const bar = createBarContent({
        challenge: { image: 'challenge.jpg', title: 'Challenge Title' },
        signatureDrinks: [
          { image: 'drink1.jpg', name: 'Drink 1' },
          { image: 'drink2.jpg', name: 'Drink 2' },
          { image: 'drink3.jpg', name: 'Drink 3' }
        ]
      });
      expect(inferBarTier(bar)).toBe('gold');
    });
  });

  describe('Silver tier detection', () => {
    it('should return silver when quickInfo exists', () => {
      const bar = createBarContent({
        quickInfo: { music: 'Jazz', vibe: 'Relaxed' }
      });
      expect(inferBarTier(bar)).toBe('silver');
    });

    it('should return silver when 2 signature drinks exist', () => {
      const bar = createBarContent({
        signatureDrinks: [
          { image: 'drink1.jpg', name: 'Drink 1' },
          { image: 'drink2.jpg', name: 'Drink 2' }
        ]
      });
      expect(inferBarTier(bar)).toBe('silver');
    });

    it('should return silver when 3 signature drinks exist', () => {
      const bar = createBarContent({
        signatureDrinks: [
          { image: 'drink1.jpg', name: 'Drink 1' },
          { image: 'drink2.jpg', name: 'Drink 2' },
          { image: 'drink3.jpg', name: 'Drink 3' }
        ]
      });
      expect(inferBarTier(bar)).toBe('silver');
    });

    it('should return silver when 1 event exists', () => {
      const bar = createBarContent({
        events: [{ title: 'Event 1', dateISO: '2024-01-01' }]
      });
      expect(inferBarTier(bar)).toBe('silver');
    });

    it('should return silver when 2 events exist', () => {
      const bar = createBarContent({
        events: [
          { title: 'Event 1', dateISO: '2024-01-01' },
          { title: 'Event 2', dateISO: '2024-01-02' }
        ]
      });
      expect(inferBarTier(bar)).toBe('silver');
    });

    it('should return silver when crowdTags exist', () => {
      const bar = createBarContent({
        crowdTags: ['Young Professionals', 'Date Night']
      });
      expect(inferBarTier(bar)).toBe('silver');
    });

    it('should return silver when bartender exists', () => {
      const bar = createBarContent({
        bartender: { name: 'Jane Smith', avatar: 'bartender.jpg' }
      });
      expect(inferBarTier(bar)).toBe('silver');
    });

    it('should return silver when challenge exists (without gold triggers)', () => {
      const bar = createBarContent({
        challenge: { image: 'challenge.jpg', title: 'Challenge Title' }
      });
      expect(inferBarTier(bar)).toBe('silver');
    });
  });

  describe('Bronze tier detection', () => {
    it('should return bronze for minimal content', () => {
      const bar = createBarContent({
        quickTags: ['Cozy', 'Casual']
      });
      expect(inferBarTier(bar)).toBe('bronze');
    });

    it('should return bronze when only basic hero exists', () => {
      const bar = createBarContent();
      expect(inferBarTier(bar)).toBe('bronze');
    });

    it('should return bronze when only 1 signature drink exists', () => {
      const bar = createBarContent({
        signatureDrinks: [{ image: 'drink1.jpg', name: 'Signature Cocktail' }]
      });
      expect(inferBarTier(bar)).toBe('bronze');
    });
  });

  describe('Manual override with resolveTier', () => {
    it('should return manual tier when provided, even for gold content', () => {
      const bar = createBarContent({
        team: [{ name: 'John', role: 'Manager', avatar: 'avatar.jpg' }],
        rewards: [{ image: 'reward.jpg', name: 'VIP Access', xp: 100 }],
        story: { short: 'Short', long: 'Long story' }
      });
      
      // Without override, should be gold
      expect(inferBarTier(bar)).toBe('gold');
      
      // With bronze override, should be bronze
      expect(resolveTier('bronze', bar)).toBe('bronze');
    });

    it('should return inferred tier when no manual tier provided', () => {
      const bar = createBarContent({
        quickInfo: { music: 'Jazz' }
      });
      
      expect(resolveTier(undefined, bar)).toBe('silver');
    });

    it('should return manual tier for all tier types', () => {
      const bar = createBarContent();
      
      expect(resolveTier('bronze', bar)).toBe('bronze');
      expect(resolveTier('silver', bar)).toBe('silver');
      expect(resolveTier('gold', bar)).toBe('gold');
    });
  });

  describe('Edge cases', () => {
    it('should prioritize gold over silver when both conditions met', () => {
      const bar = createBarContent({
        quickInfo: { music: 'Jazz' }, // Silver trigger
        team: [{ name: 'John', role: 'Manager', avatar: 'avatar.jpg' }] // Gold trigger
      });
      expect(inferBarTier(bar)).toBe('gold');
    });

    it('should handle empty arrays correctly', () => {
      const bar = createBarContent({
        events: [],
        signatureDrinks: [],
        team: [],
        rewards: [],
        social: [],
        crowdTags: []
      });
      expect(inferBarTier(bar)).toBe('bronze');
    });
  });
});