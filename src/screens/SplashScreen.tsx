import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions } from 'react-native';
import { Video, ResizeMode } from 'expo-av';
import theme from '../theme/safeTheme';

const { colors, spacing } = theme;
const { width, height } = Dimensions.get('window');

interface SplashScreenProps {
  onFinish: () => void;
}


export default function SplashScreen({ onFinish }: SplashScreenProps) {
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const scaleAnim = React.useRef(new Animated.Value(0.8)).current;
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);

  // Array of video sources - all your bartending segments
  const videoSources = [
    require('../../assets/videos/bartending-splash.mov'),      // Video 1: Original MixedMindStudios video (30MB)
    require('../../assets/videos/bartending-splash-2.mov'),    // Video 2: Second MixedMindStudios video (12MB)
    require('../../assets/videos/bartending-splash-3.mov'),    // Video 3: Screen Recording 1 (12MB)
    require('../../assets/videos/bartending-splash-4.mov'),    // Video 4: Screen Recording 2 (9.4MB)
    require('../../assets/videos/bartending-splash-5.mov'),    // Video 5: Screen Recording 3 (8.0MB)
    require('../../assets/videos/bartending-splash-6.mov'),    // Video 6: Screen Recording 4 (13MB)
    require('../../assets/videos/bartending-splash-7.mov'),    // Video 7: Screen Recording 5 (10MB)
    require('../../assets/videos/bartending-splash-8.mov'),    // Video 8: Screen Recording 6 (8.0MB)
    require('../../assets/videos/bartending-splash-9.mov'),    // Video 9: Video 1780 display (13MB)
  ];

  // Randomly select a video each time the splash screen loads
  const [selectedVideo] = useState(() => {
    const randomIndex = Math.floor(Math.random() * videoSources.length);
    const selectedVideoFile = videoSources[randomIndex];
    console.log(`🎬 Splash Screen: Playing bartending video ${randomIndex + 1} of ${videoSources.length}`);
    return selectedVideoFile;
  });

  useEffect(() => {
    // Fade in animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();

    // Auto-finish after 5 seconds (longer to appreciate the video)
    const timer = setTimeout(onFinish, 5000);
    return () => clearTimeout(timer);
  }, [fadeAnim, scaleAnim, onFinish]);

  return (
    <View style={styles.container}>
      {/* Video Background */}
      <Video
        style={styles.backgroundVideo}
        source={selectedVideo}
        shouldPlay
        isLooping
        isMuted
        resizeMode={ResizeMode.COVER}
        onLoad={() => setIsVideoLoaded(true)}
        onError={(error) => {
          console.log('Video error:', error);
          setIsVideoLoaded(false);
        }}
      />

      {/* Video overlay for better text contrast */}
      <View style={styles.videoOverlay} />

      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        {/* App Name */}
        <Text style={styles.appName}>MixedMindStudios</Text>
        <Text style={styles.tagline}>Your ultimate bar & spirits companion</Text>
      </Animated.View>

      {/* Loading indicator */}
      <View style={styles.footer}>
        <View style={styles.loadingDots}>
          <Animated.View style={[styles.dot, { opacity: fadeAnim }]} />
          <Animated.View style={[styles.dot, { opacity: fadeAnim }]} />
          <Animated.View style={[styles.dot, { opacity: fadeAnim }]} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backgroundVideo: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    width: '100%',
    height: '100%',
    minWidth: width,
    minHeight: height,
  },
  videoOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.4)', // Slightly darker overlay for better text contrast
  },
  content: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    zIndex: 10, // Ensure content is above video
  },
  appName: {
    fontSize: 36,
    fontWeight: '900',
    color: 'rgba(255, 255, 255, 0.15)',
    textAlign: 'center',
    marginBottom: spacing(2),
    letterSpacing: 2,
    textShadowColor: 'rgba(255, 255, 255, 0.8)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
    shadowColor: 'rgba(0, 0, 0, 0.9)',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.8,
    shadowRadius: 12,
    elevation: 15,
  },
  tagline: {
    fontSize: 18,
    color: '#FFFFFF',
    textAlign: 'center',
    maxWidth: 320,
    lineHeight: 24,
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
    opacity: 0.95,
  },
  footer: {
    position: 'absolute',
    bottom: spacing(8),
    alignItems: 'center',
    zIndex: 10,
  },
  loadingDots: {
    flexDirection: 'row',
    gap: 10,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.7,
    shadowRadius: 4,
    elevation: 5,
  },
});