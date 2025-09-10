import React, { useState, useRef } from 'react';
import {
  View, Text, ScrollView, Pressable, StyleSheet, Dimensions, Image
} from 'react-native';
import { Feather, MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { colors, spacing, radii, textStyles } from '../theme/tokens';
const { width } = Dimensions.get('window');

interface WelcomeCarouselProps {
  onComplete: () => void;
}

interface SlideData {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  icon: React.ReactNode;
  gradient: [string, string];
}

const slides: SlideData[] = [
  {
    id: 1,
    title: "Welcome to Home Game Advantage",
    subtitle: "Your ultimate bar & spirits companion",
    description: "Discover featured bars, learn about premium spirits, and master the art of cocktail crafting from home.",
    icon: <Text style={{ fontSize: 64 }}>🍻</Text>,
    gradient: [colors.bg, colors.card],
  },
  {
    id: 2,
    title: "Discover Premium Spirits",
    subtitle: "Curated selection of the finest",
    description: "Explore whiskey, gin, vodka, tequila and more. Learn tasting notes, origins, and perfect pairings for every occasion.",
    icon: <MaterialCommunityIcons name="glass-wine" size={64} color={colors.accent} />,
    gradient: [colors.bg, colors.card],
  },
  {
    id: 3,
    title: "Find Amazing Bars",
    subtitle: "Handpicked venues near you",
    description: "Browse featured bars, discover hidden gems, and explore different vibes from speakeasy to rooftop lounges.",
    icon: <Ionicons name="location" size={64} color={colors.accent} />,
    gradient: [colors.bg, colors.card],
  },
  {
    id: 4,
    title: "Master Fun Games",
    subtitle: "Classic drinking games & more",
    description: "Learn King's Cup, Beer Pong, and cultural games from around the world. Perfect for parties and gatherings.",
    icon: <MaterialCommunityIcons name="cards" size={64} color={colors.accent} />,
    gradient: [colors.bg, colors.card],
  },
  {
    id: 5,
    title: "You're All Set!",
    subtitle: "Start exploring now",
    description: "Everything is ready for your journey into the world of premium spirits and unforgettable experiences.",
    icon: <Feather name="check-circle" size={64} color={colors.accent} />,
    gradient: [colors.bg, colors.card],
  },
];

export default function WelcomeCarouselScreen({ onComplete }: WelcomeCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);

  const handleScroll = (event: any) => {
    const scrollX = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollX / width);
    setCurrentIndex(index);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    scrollViewRef.current?.scrollTo({ x: index * width, animated: true });
  };

  const nextSlide = () => {
    if (currentIndex < slides.length - 1) {
      goToSlide(currentIndex + 1);
    } else {
      onComplete();
    }
  };

  const skipToEnd = () => {
    onComplete();
  };

  const currentSlide = slides[currentIndex];
  const isLastSlide = currentIndex === slides.length - 1;

  return (
    <View style={styles.container}>
      {/* Skip Button */}
      {!isLastSlide && (
        <Pressable style={styles.skipButton} onPress={skipToEnd}>
          <Text style={styles.skipText}>Skip</Text>
        </Pressable>
      )}

      {/* Carousel */}
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        style={styles.carousel}
      >
        {slides.map((slide) => (
          <View key={slide.id} style={styles.slide}>
            {/* Icon */}
            <View style={styles.iconContainer}>
              {slide.icon}
            </View>

            {/* Content */}
            <View style={styles.content}>
              <Text style={styles.title}>{slide.title}</Text>
              <Text style={styles.subtitle}>{slide.subtitle}</Text>
              <Text style={styles.description}>{slide.description}</Text>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Bottom Section */}
      <View style={styles.bottom}>
        {/* Progress Dots */}
        <View style={styles.pagination}>
          {slides.map((_, index) => (
            <Pressable
              key={index}
              onPress={() => goToSlide(index)}
              style={[
                styles.dot,
                index === currentIndex && styles.activeDot
              ]}
            />
          ))}
        </View>

        {/* Navigation */}
        <View style={styles.navigation}>
          {currentIndex > 0 && (
            <Pressable style={styles.backButton} onPress={() => goToSlide(currentIndex - 1)}>
              <Feather name="chevron-left" size={20} color={colors.subtext} />
              <Text style={styles.backText}>Back</Text>
            </Pressable>
          )}

          <Pressable style={styles.nextButton} onPress={nextSlide}>
            <Text style={styles.nextText}>
              {isLastSlide ? "Get Started" : "Next"}
            </Text>
            {!isLastSlide && <Feather name="chevron-right" size={20} color={colors.goldText} />}
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  skipButton: {
    position: 'absolute',
    top: 60,
    right: spacing(2),
    zIndex: 10,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.muted,
  },
  skipText: {
    color: colors.subtext,
    fontSize: 16,
    fontWeight: '600',
  },
  carousel: {
    flex: 1,
  },
  slide: {
    width: width,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing(3),
  },
  iconContainer: {
    marginBottom: spacing(4),
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    alignItems: 'center',
    maxWidth: width - spacing(6),
  },
  title: {
    fontSize: 28,
    fontWeight: '900',
    color: colors.text,
    textAlign: 'center',
    marginBottom: spacing(1),
    lineHeight: 34,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.accent,
    textAlign: 'center',
    marginBottom: spacing(2),
    lineHeight: 24,
  },
  description: {
    fontSize: 16,
    color: colors.subtext,
    textAlign: 'center',
    lineHeight: 24,
    maxWidth: 320,
  },
  bottom: {
    paddingHorizontal: spacing(3),
    paddingBottom: spacing(5),
    paddingTop: spacing(2),
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: spacing(3),
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.muted,
  },
  activeDot: {
    backgroundColor: colors.accent,
    width: 24,
  },
  navigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    gap: 4,
  },
  backText: {
    color: colors.subtext,
    fontSize: 16,
    fontWeight: '600',
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.accent,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: radii.lg,
    gap: 8,
    minWidth: 120,
    justifyContent: 'center',
  },
  nextText: {
    color: colors.goldText,
    fontSize: 16,
    fontWeight: '800',
  },
});