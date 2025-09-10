import { SafeAreaView } from 'react-native-safe-area-context';
import { Slide } from '../../src/features/onboarding/components/Slide';
import { ProgressDots } from '../../src/features/onboarding/components/ProgressDots';
import { FooterNav } from '../../src/features/onboarding/components/FooterNav';
import { useOnboarding } from '../../src/features/onboarding/useOnboarding';
import { slideCopy } from '../../src/features/onboarding/copy';
import { PermissionsIllustration } from '../../src/styles/illustrations';

const SLIDE_IDS = ['welcome', 'features', 'community', 'commerce', 'permissions'];

export default function PermissionsSlide() {
  const onboarding = useOnboarding({
    totalSlides: SLIDE_IDS.length,
    slideIds: SLIDE_IDS,
  });

  const content = slideCopy.permissions;

  return (
    <SafeAreaView className="flex-1 bg-gray-900" edges={['top', 'left', 'right']}>
      <FooterNav 
        onSkip={onboarding.skip}
        onBack={onboarding.back}
        onDone={onboarding.complete}
        showSkip={false}
        showBack
        showNext={false}
        showDone
      />
      
      <Slide
        illustration={<PermissionsIllustration />}
        title={content.title}
        subtitle={content.subtitle}
        bullets={content.bullets}
        ctaLabel={content.ctaLabel}
        onPress={onboarding.complete}
      />

      <ProgressDots
        total={SLIDE_IDS.length}
        current={onboarding.index}
        onPress={onboarding.goToSlide}
      />
    </SafeAreaView>
  );
}