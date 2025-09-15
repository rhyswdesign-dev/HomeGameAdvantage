# FIRESTORE SCHEMA - VAULT ECONOMY SYSTEM

## Collection Structure Overview

The Vault economy system requires the following Firestore collections to manage XP + Keys transactions, scarcity mechanics, and real-money purchases.

```
vault_db/
├── vaultItems/           # Available items to unlock (admin managed)
├── vaultCycles/          # 30-day cycles for item rotation
├── userVaultProfiles/    # User XP, Keys, unlocked items
├── monetizationItems/    # Keys/Boosters for real money
├── vaultCarts/          # Shopping carts (Keys/Boosters only)
├── vaultAddresses/      # User shipping addresses
├── vaultTransactions/   # All unlock transactions (audit log)
├── vaultPurchases/      # All real money purchases (audit log)
├── xpTransactions/      # XP earning history (audit log)
└── vaultAnalytics/      # Cycle performance metrics
```

## Detailed Schema Definitions

### 1. vaultItems Collection

**Document ID**: Auto-generated or custom (e.g., "vault_shaker_gold")

```typescript
{
  // Basic Info
  id: string;                          // Document ID
  name: string;                        // "Golden Hour Shaker Set"
  description: string;                 // Item description
  image: string;                       // Image URL
  category: "cocktail-kit" | "bar-tools" | "glassware" | "spirits" | "books" | "merch" | "experiences" | "digital";
  type: "physical" | "digital" | "experience" | "mystery";
  rarity: "common" | "limited" | "rare" | "prestige" | "mystery";
  
  // XP + Keys Pricing
  xpCost: number;                      // 3500
  keysCost: number;                    // 2
  
  // XP-as-Discount Option (optional)
  discountOption?: {
    reducedXP: number;                 // 1750 (half XP)
    cashPrice: number;                 // 12.99 (USD)
  };
  
  // Scarcity Mechanics
  totalStock: number;                  // 50
  currentStock: number;                // 12
  cycleId: string;                     // "cycle_2025_03"
  
  // Metadata
  contents?: string[];                 // ["Gold-plated Shaker", "Strainer", "Gift Box"]
  estimatedValue?: string;             // "$120 Value"
  isActive: boolean;                   // true
  releaseDate: string;                 // ISO timestamp
  expiryDate?: string;                 // Auto-remove date
  
  // Mystery Drop Specifics
  mysteryPool?: string[];              // ["Premium Shaker", "Crystal Glass"]
  mysteryTags?: string[];              // ["premium", "limited"]
  
  // Audit
  createdAt: string;                   // ISO timestamp
  updatedAt: string;                   // ISO timestamp
}
```

**Indexes Required**:
- `cycleId, isActive`
- `rarity, isActive`
- `category, isActive`
- `type, isActive`

---

### 2. vaultCycles Collection

**Document ID**: Cycle identifier (e.g., "cycle_2025_03")

```typescript
{
  id: string;                          // "cycle_2025_03"
  name: string;                        // "March 2025 Collection"
  startDate: string;                   // "2025-03-01T00:00:00Z"
  endDate: string;                     // "2025-03-31T23:59:59Z"
  isActive: boolean;                   // true
  
  // Featured items for this cycle
  featuredItemIds: string[];           // ["vault_shaker_gold", "vault_mystery_premium"]
  mysteryDropPool: string[];           // Mystery items available this cycle
  
  // Statistics
  totalItemsReleased: number;          // 12
  totalUnlocks: number;                // 847 (across all users)
  
  createdAt: string;                   // ISO timestamp
}
```

**Indexes Required**:
- `isActive`
- `startDate, endDate`

---

### 3. userVaultProfiles Collection

**Document ID**: User ID

```typescript
{
  userId: string;                      // Document ID = User ID
  
  // Current Balances
  xpBalance: number;                   // 8450 (earned through lessons/challenges)
  keysBalance: number;                 // 3 (purchased)
  
  // Lifetime Statistics
  totalXpEarned: number;               // 15200
  totalKeysEarned: number;             // 8
  totalXpSpent: number;                // 6750
  totalKeysSpent: number;              // 5
  
  // Unlocked Items History
  unlockedItems: UnlockedVaultItem[];  // Array of unlocked items
  
  // Active Booster
  activeBooster?: {
    type: "xp_multiplier" | "double_keys" | "mystery_luck";
    multiplier?: number;               // 2.0 for 2x XP
    expiresAt: string;                 // ISO timestamp
    remainingUses?: number;            // For use-based boosters
  };
  
  updatedAt: string;                   // ISO timestamp
}
```

**Sub-document Structure for unlockedItems**:
```typescript
{
  itemId: string;                      // "vault_shaker_gold"
  itemName: string;                    // "Golden Hour Shaker Set"
  unlockedAt: string;                  // ISO timestamp
  cycleId: string;                     // "cycle_2025_03"
  
  // Cost paid to unlock
  xpSpent: number;                     // 1750
  keysSpent: number;                   // 2
  cashSpent?: number;                  // 12.99 (if used discount option)
  
  // Fulfillment (for physical items)
  fulfillmentStatus?: "pending" | "processing" | "shipped" | "delivered";
  trackingNumber?: string;             // "UPS123456789"
  shippingAddress?: VaultAddress;
}
```

**Indexes Required**:
- `userId` (automatic)
- `xpBalance` (for leaderboards)
- `totalXpEarned` (for leaderboards)

---

### 4. monetizationItems Collection

**Document ID**: Auto-generated or custom (e.g., "keys_starter_pack")

```typescript
{
  id: string;                          // "keys_starter_pack"
  type: "keys" | "booster" | "pass" | "merch";
  name: string;                        // "Starter Key Pack"
  description: string;                 // "Perfect for your first Vault unlocks"
  image: string;                       // Image URL
  
  // Real money pricing (USD cents)
  price: number;                       // 299 ($2.99)
  originalPrice?: number;              // 399 (show discount)
  
  // What you get
  keysGranted?: number;                // 2
  boosterEffect?: {
    type: "xp_multiplier" | "double_keys" | "mystery_luck";
    multiplier?: number;               // 2.0
    duration: number;                  // Hours active (24)
    description: string;               // "Double XP for 24 hours"
  };
  
  // Bundle info
  isBundle: boolean;                   // false
  bundleItems?: {
    type: "keys" | "booster";
    quantity: number;
    name: string;
  }[];
  
  // Availability
  inStock: boolean;                    // true
  stockLimit?: number;                 // For limited items
  
  // Stripe integration
  stripePriceId: string;               // "price_keys_starter_pack"
  stripeProductId: string;             // "prod_keys_starter_pack"
  
  createdAt: string;                   // ISO timestamp
  updatedAt: string;                   // ISO timestamp
}
```

**Indexes Required**:
- `type, inStock`
- `price` (for sorting)

---

### 5. vaultCarts Collection

**Document ID**: User ID

```typescript
{
  userId: string;                      // Document ID = User ID
  
  items: {
    monetizationItemId: string;        // "keys_starter_pack"
    quantity: number;                  // 2
    unitPrice: number;                 // 299 (USD cents)
    totalPrice: number;                // 598
  }[];
  
  // Totals (USD cents)
  subtotal: number;                    // 598
  tax: number;                         // 48 (8%)
  total: number;                       // 646
  
  updatedAt: string;                   // ISO timestamp
}
```

---

### 6. vaultAddresses Collection

**Document ID**: Auto-generated

```typescript
{
  id: string;                          // Document ID
  userId: string;                      // Owner
  firstName: string;
  lastName: string;
  street1: string;
  street2?: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;                     // "US"
  isDefault: boolean;                  // true
  createdAt: string;                   // ISO timestamp
}
```

**Indexes Required**:
- `userId`
- `userId, isDefault`

---

### 7. vaultTransactions Collection (Audit Log)

**Document ID**: Auto-generated transaction ID

```typescript
{
  transactionId: string;               // "unlock_1710234567_abc123"
  userId: string;
  type: "unlock";
  
  // Item unlocked
  itemId: string;                      // "vault_shaker_gold"
  itemName: string;                    // "Golden Hour Shaker Set"
  cycleId: string;                     // "cycle_2025_03"
  
  // Resources spent
  xpSpent: number;                     // 1750
  keysSpent: number;                   // 2
  cashSpent?: number;                  // 12.99
  usedDiscountOption: boolean;         // true
  
  // Payment info (if cash was involved)
  stripePaymentIntentId?: string;      // "pi_1234567890"
  
  // Shipping (for physical items)
  shippingAddress?: VaultAddress;
  
  timestamp: string;                   // ISO timestamp
}
```

**Indexes Required**:
- `userId, timestamp`
- `itemId, timestamp`
- `cycleId, timestamp`
- `type, timestamp`

---

### 8. vaultPurchases Collection (Audit Log)

**Document ID**: Auto-generated purchase ID

```typescript
{
  purchaseId: string;                  // "purchase_1710234567_def456"
  userId: string;
  
  // Item purchased
  monetizationItemId: string;          // "keys_starter_pack"
  itemName: string;                    // "Starter Key Pack"
  quantity: number;                    // 1
  
  // Payment
  totalPaid: number;                   // 299 (USD cents)
  stripePaymentIntentId: string;       // "pi_0987654321"
  
  // Rewards granted
  keysGranted: number;                 // 2
  boosterGranted?: {
    type: string;
    multiplier?: number;
    duration: number;
    description: string;
  };
  
  timestamp: string;                   // ISO timestamp
}
```

**Indexes Required**:
- `userId, timestamp`
- `monetizationItemId, timestamp`

---

### 9. xpTransactions Collection (Audit Log)

**Document ID**: Auto-generated

```typescript
{
  userId: string;
  amount: number;                      // 150 (XP earned)
  originalAmount: number;              // 100 (before booster)
  source: string;                      // "lesson_complete", "challenge_win", "video_watch"
  
  // Booster info (if applicable)
  boosterApplied?: {
    type: string;                      // "xp_multiplier"
    multiplier: number;                // 1.5
  };
  
  timestamp: string;                   // ISO timestamp
}
```

**Indexes Required**:
- `userId, timestamp`
- `source, timestamp`

---

### 10. vaultAnalytics Collection

**Document ID**: Cycle ID

```typescript
{
  cycleId: string;                     // "cycle_2025_03"
  
  // Item performance
  itemUnlocks: Record<string, number>; // itemId -> unlock count
  xpSpentByItem: Record<string, number>; // itemId -> total XP spent
  keysSpentByItem: Record<string, number>; // itemId -> total Keys spent
  
  // User behavior
  totalActiveUsers: number;            // Users who unlocked something
  avgXpPerUser: number;               // Average XP balance
  avgKeysPerUser: number;             // Average Keys balance
  
  // Revenue metrics (USD cents)
  keysSold: number;                   // Total keys sold this cycle
  boostersSold: number;               // Total boosters sold
  totalRevenue: number;               // Total USD revenue
  
  updatedAt: string;                  // ISO timestamp
}
```

## Security Rules Examples

```javascript
// vaultItems - Read-only for users
match /vaultItems/{itemId} {
  allow read: if request.auth != null;
  allow write: if hasRole('admin');
}

// userVaultProfiles - Users can only access their own
match /userVaultProfiles/{userId} {
  allow read, write: if request.auth != null && request.auth.uid == userId;
}

// vaultTransactions - Read-only audit log
match /vaultTransactions/{transactionId} {
  allow read: if request.auth != null && resource.data.userId == request.auth.uid;
  allow create: if request.auth != null; // Service account only
}

// monetizationItems - Read-only for users
match /monetizationItems/{itemId} {
  allow read: if request.auth != null;
  allow write: if hasRole('admin');
}
```

## Recommended Compound Indexes

```javascript
// For efficient queries
vaultItems: [['cycleId', 'isActive', 'rarity'], ['category', 'isActive']]
userVaultProfiles: [['totalXpEarned', 'desc']] // Leaderboards
vaultTransactions: [['userId', 'timestamp', 'desc'], ['cycleId', 'timestamp', 'desc']]
xpTransactions: [['userId', 'timestamp', 'desc'], ['source', 'timestamp', 'desc']]
```

## Cloud Functions Triggers

```typescript
// Auto-update user profile when XP transaction is created
exports.updateUserXP = functions.firestore
  .document('xpTransactions/{transactionId}')
  .onCreate(async (snap, context) => {
    // Increment user XP balance
  });

// Auto-decrement item stock when unlocked
exports.decrementStock = functions.firestore
  .document('vaultTransactions/{transactionId}')
  .onCreate(async (snap, context) => {
    // Decrement vaultItem.currentStock
  });

// Auto-activate new cycles
exports.activateNewCycle = functions.pubsub
  .schedule('0 0 1 * *') // First day of each month
  .onRun(async (context) => {
    // Create new cycle, deactivate old ones
  });
```

This schema supports the full Vault economy with XP + Keys mechanics, scarcity systems, 30-day cycles, and Stripe integration while maintaining data consistency and audit trails.