import React, { useState } from 'react';
import {
  View, Text, ScrollView, Pressable, Image, StyleSheet, Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, radii } from '../../theme/tokens';

export interface BrandVideo {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  duration: string;
  xpReward: number;
  watched: boolean;
}

interface BrandVideosProps {
  videos: BrandVideo[];
  onVideoPress: (video: BrandVideo) => void;
}

export default function BrandVideos({ videos, onVideoPress }: BrandVideosProps) {
  const [watchedVideos, setWatchedVideos] = useState<string[]>([]);
  const [playingVideo, setPlayingVideo] = useState<string | null>(null);

  const handleVideoPress = (video: BrandVideo) => {
    if (watchedVideos.includes(video.id)) {
      // Video already watched, just call onVideoPress
      onVideoPress(video);
      return;
    }

    // Start "playing" the video
    setPlayingVideo(video.id);
    onVideoPress(video);
    
    // Simulate video duration and award XP only after completion
    const duration = parseDuration(video.duration);
    setTimeout(() => {
      setPlayingVideo(null);
      setWatchedVideos(prev => [...prev, video.id]);
      Alert.alert(
        'Video Complete!',
        `You earned ${video.xpReward} XP for watching "${video.title}"`,
        [{ text: 'Continue', style: 'default' }]
      );
    }, duration);
  };

  // Parse duration string like "3:45" to milliseconds (shortened for demo)
  const parseDuration = (duration: string): number => {
    const parts = duration.split(':');
    const minutes = parseInt(parts[0]) || 0;
    const seconds = parseInt(parts[1]) || 0;
    // Convert to milliseconds but use shorter duration for demo (5 seconds max)
    return Math.min((minutes * 60 + seconds) * 1000, 5000);
  };

  return (
    <ScrollView 
      horizontal 
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {videos.map((video) => {
        const isWatched = watchedVideos.includes(video.id);
        const isPlaying = playingVideo === video.id;
        return (
          <Pressable
            key={video.id}
            style={[
              styles.videoCard, 
              isWatched && styles.watchedCard,
              isPlaying && styles.playingCard
            ]}
            onPress={() => handleVideoPress(video)}
          >
            <View style={styles.thumbnailContainer}>
              <Image source={{ uri: video.thumbnail }} style={styles.thumbnail} />
              <View style={styles.playButton}>
                <Ionicons 
                  name={isPlaying ? "pause" : "play"} 
                  size={20} 
                  color="white" 
                />
              </View>
              <View style={styles.durationBadge}>
                <Text style={styles.durationText}>{video.duration}</Text>
              </View>
              {isWatched && (
                <View style={styles.watchedBadge}>
                  <Ionicons name="checkmark-circle" size={20} color={colors.gold} />
                </View>
              )}
              {isPlaying && (
                <View style={styles.playingIndicator}>
                  <Text style={styles.playingText}>Playing...</Text>
                </View>
              )}
            </View>
            
            <View style={styles.videoInfo}>
              <Text style={styles.videoTitle} numberOfLines={2}>
                {video.title}
              </Text>
              <Text style={styles.videoDescription} numberOfLines={2}>
                {video.description}
              </Text>
              <View style={styles.xpBadge}>
                <Ionicons name="star" size={14} color={colors.gold} />
                <Text style={styles.xpText}>+{video.xpReward} XP</Text>
              </View>
            </View>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing(2),
    gap: spacing(2),
  },
  videoCard: {
    width: 200,
    backgroundColor: colors.card,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.line,
    overflow: 'hidden',
  },
  watchedCard: {
    borderColor: colors.gold,
    borderWidth: 2,
  },
  thumbnailContainer: {
    position: 'relative',
    width: '100%',
    height: 120,
  },
  thumbnail: {
    width: '100%',
    height: '100%',
    backgroundColor: colors.bg,
  },
  playButton: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -20 }, { translateY: -20 }],
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.7)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  durationBadge: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.8)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: radii.sm,
  },
  durationText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  watchedBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 10,
    padding: 2,
  },
  videoInfo: {
    padding: spacing(2),
  },
  videoTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing(0.5),
  },
  videoDescription: {
    fontSize: 12,
    color: colors.subtext,
    lineHeight: 16,
    marginBottom: spacing(1),
  },
  xpBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: colors.bg,
    paddingHorizontal: spacing(1),
    paddingVertical: spacing(0.5),
    borderRadius: radii.sm,
    gap: 4,
  },
  xpText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.gold,
  },
  playingCard: {
    borderColor: colors.accent,
    borderWidth: 2,
    shadowColor: colors.accent,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  playingIndicator: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    backgroundColor: colors.accent,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: radii.sm,
  },
  playingText: {
    color: 'white',
    fontSize: 10,
    fontWeight: '600',
  },
});