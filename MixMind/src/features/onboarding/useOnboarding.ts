import { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import { useSession } from '../../stores/useSession';
import { analytics } from '../../lib/analytics';

export interface UseOnboardingOptions {
  totalSlides: number;
  slideIds: string[];
}

export function useOnboarding({ totalSlides, slideIds }: UseOnboardingOptions) {
  const [index, setIndex] = useState(0);
  const router = useRouter();
  const setOnboardingCompleted = useSession((state) => state.setOnboardingCompleted);
  
  const currentSlideId = slideIds[index];
  const isFirst = index === 0;
  const isLast = index === totalSlides - 1;
  
  // Track slide views
  useEffect(() => {
    analytics.track('onboarding_slide_viewed', {
      slide_id: currentSlideId,
      slide_index: index,
      total_slides: totalSlides,
    });
  }, [currentSlideId, index, totalSlides]);

  const goToSlide = (newIndex: number) => {
    if (newIndex >= 0 && newIndex < totalSlides && newIndex !== index) {
      analytics.track('onboarding_slide_jump', {
        from_slide_id: currentSlideId,
        to_slide_id: slideIds[newIndex],
        from_index: index,
        to_index: newIndex,
        method: 'progress_dot',
      });
      
      const routes = ['', 'features', 'community', 'commerce', 'permissions'];
      router.push(`/onboarding/${routes[newIndex]}`);
      setIndex(newIndex);
    }
  };

  const next = () => {
    if (isLast) {
      complete();
    } else {
      const newIndex = index + 1;
      analytics.track('onboarding_slide_next', {
        from_slide_id: currentSlideId,
        to_slide_id: slideIds[newIndex],
        slide_index: index,
      });
      
      const routes = ['', 'features', 'community', 'commerce', 'permissions'];
      router.push(`/onboarding/${routes[newIndex]}`);
      setIndex(newIndex);
    }
  };

  const back = () => {
    if (!isFirst) {
      const newIndex = index - 1;
      analytics.track('onboarding_slide_back', {
        from_slide_id: currentSlideId,
        to_slide_id: slideIds[newIndex],
        slide_index: index,
      });
      
      const routes = ['', 'features', 'community', 'commerce', 'permissions'];
      router.push(`/onboarding/${routes[newIndex]}`);
      setIndex(newIndex);
    }
  };

  const skip = () => {
    analytics.track('onboarding_skipped', {
      current_slide_id: currentSlideId,
      slide_index: index,
      total_slides: totalSlides,
    });
    complete();
  };

  const complete = () => {
    analytics.track('onboarding_completed', {
      completion_method: isLast ? 'done_button' : 'slide_completion',
    });
    
    setOnboardingCompleted(true);
    router.replace('/');
  };

  return {
    index,
    currentSlideId,
    isFirst,
    isLast,
    next,
    back,
    skip,
    complete,
    goToSlide,
  };
}