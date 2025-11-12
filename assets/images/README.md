# Image Assets Catalog

This folder contains all organized images for the HomeGameAdvantage app, sourced from the "Pictures for the KOOPE" collection.

## 📁 Folder Structure

```
assets/images/
├── spirits/          # Base spirits (gin, rum, tequila, brandy)
├── ingredients/      # Fruits, herbs, liquors, bitters
├── syrups/          # Flavored syrups
├── glassware/       # Cocktail glasses and serving vessels
├── techniques/      # Bartending methods and tools
├── branding/        # MixedMinds branded assets
└── games/           # Drinking game visual guides
```

## 🎯 Usage

### Import from Category Files

```typescript
import { spirits } from '@/assets/images/spirits';
import { ingredients } from '@/assets/images/ingredients';
import { games } from '@/assets/images/games';

<Image source={spirits.gin} />
<Image source={ingredients.mint} />
<Image source={games.beerPong} />
```

### Import from Main Index

```typescript
import { spirits, ingredients, games } from '@/assets/images';
// or
import images from '@/assets/images';

<Image source={images.spirits.gin} />
<Image source={images.games.kingsCup} />
```

## 📊 Image Inventory

### Spirits (6 images)
- Gin (2 variants)
- Rum (2 variants)
- Tequila
- Brandy

**Keys**: `gin`, `gin1`, `rum`, `rum1`, `tequila`, `brandy`

---

### Ingredients (23 images)

#### Fruits (10)
- Blueberry, Cherry, Grapefruit, Lemon, Lime
- Orange, Pineapple, Raspberry, Strawberry, Watermelon

**Keys**: `blueberry`, `cherry`, `grapefruit`, `lemon`, `lime`, `orange`, `pineapple`, `raspberry`, `strawberry`, `watermelon`

#### Herbs (4)
- Basil, Lavender, Mint, Rose

**Keys**: `basil`, `lavender`, `mint`, `rose`

#### Liquors (6)
- Amaro, Anise Liquor, Creme de Cacao
- Elderflower, Espresso, Orange Liquor

**Keys**: `amaro`, `aniseLiquor`, `cremeDeCacao`, `elderflowerLiquor`, `espressoLiquor`, `orangeLiquor`

#### Bitters (3)
- Bitters (3 variants)

**Keys**: `bitters`, `bitters1`, `bitters3`

---

### Syrups (6 images)
- Blueberry, Mango, Raspberry, Herbal
- Simple Syrup (2 variants)

**Keys**: `blueberry`, `mango`, `raspberry`, `herbal`, `simple`, `simple1`

---

### Glassware (6 images)
- Collins Glass, Coupe, Martini Glass
- Rocks Glass, Brandy Snifter, Shot Glass

**Keys**: `collins`, `coupe`, `martini`, `rocks`, `brandySnifter`, `shot`

---

### Techniques (10 images)
- Bartools, Muddling, Stirring, Layered
- Sour Cocktail, Infusion, Negroni
- Citrus Juice, Juices, Fruit

**Keys**: `bartools`, `muddling`, `stirring`, `layered`, `sour`, `infusion`, `negroni`, `citrusJuice`, `juices`, `fruit`

---

### Branding (6 images)
- MMS Backsplash
- MMS Gin, Scotch, Tequila, Vodka, Whiskey

**Keys**: `backsplash`, `gin`, `scotch`, `tequila`, `vodka`, `whiskey`

---

### Games (44 images)
Complete visual guides for drinking games:

- **21** (3 variants)
- **Anchorman, Arrogance, Baseball**
- **Beer Pong** (2 variants)
- **Boat Race** (2 variants)
- **Buffalo Club, Centurion, Circle of Death, Civil War**
- **Dice Games**
- **Drink While You Think** (2 variants)
- **Drunk Jenga** (3 variants)
- **Drunk Uno, Flip Cup**
- **Fuzzy Duck** (4 variants)
- **Kings Cup** (3 variants)
- **Most Likely To, Never Have I Ever**
- **Paranoia, Power Hour, Quarters**
- **Rage Cage, Ride the Bus**
- **Ring of Fire** (2 variants)
- **Spoons, Thumper, Truth or Dare**

**Example Keys**: `beerPong`, `kingsCup`, `fuzzyDuck`, `neverHaveIEver`, `truthOrDare`

---

## 🎨 Design Notes

- All images are **PNG format** for transparency support
- File sizes range from ~100KB to ~3MB
- Larger files are primarily game images with detailed graphics
- Images maintain consistent quality and styling

---

## 🔧 TypeScript Support

All image imports are **fully typed** with TypeScript:

```typescript
import { SpiritKey, IngredientKey, GameKey } from '@/assets/images';

const spiritKey: SpiritKey = 'gin'; // ✅ Type-safe
const invalidKey: SpiritKey = 'vodka'; // ❌ Type error
```

---

## 📝 File Naming Convention

Original filenames have been preserved for reference, but you can access them via camelCase keys:

| File | Key |
|------|-----|
| `Gin.png` | `gin` |
| `Mint.png` | `mint` |
| `MMS Gin.png` | `gin` (in branding) |
| `Games - Beer Pong.png` | `beerPong` |

---

## 🚀 Quick Start Example

```typescript
import React from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { spirits, games } from '@/assets/images';

export default function CocktailScreen() {
  return (
    <View style={styles.container}>
      <Image source={spirits.gin} style={styles.spirit} />
      <Image source={games.beerPong} style={styles.game} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  spirit: { width: 200, height: 300, resizeMode: 'contain' },
  game: { width: '100%', height: 400, resizeMode: 'contain' },
});
```

---

## 📦 Total Assets

- **Spirits**: 6 images
- **Ingredients**: 23 images
- **Syrups**: 6 images
- **Glassware**: 6 images
- **Techniques**: 10 images
- **Branding**: 6 images
- **Games**: 44 images

**Total: 101 images**

---

*Last updated: November 2025*
