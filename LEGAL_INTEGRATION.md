# Legal/Policies System - Integration Guide

This guide explains how to integrate the comprehensive legal compliance system into your React Native app.

## 🚀 Quick Start

### 1. Add Routes to Navigation

First, add the legal screens to your navigation stack:

```typescript
// In your RootNavigator.tsx or main navigation file
import LegalHubScreen from '../screens/LegalHubScreen';
import PrivacyPolicyScreen from '../screens/PrivacyPolicyScreen';
import TermsScreen from '../screens/TermsScreen';
import ConsentCenterScreen from '../screens/ConsentCenterScreen';

// Add these routes to your stack
<Stack.Screen name="LegalHub" component={LegalHubScreen} />
<Stack.Screen name="PrivacyPolicy" component={PrivacyPolicyScreen} />
<Stack.Screen name="Terms" component={TermsScreen} />
<Stack.Screen name="ConsentCenter" component={ConsentCenterScreen} />
```

### 2. Add to Settings Screen

Add a "Legal & Policies" item to your settings screen:

```typescript
// In your SettingsScreen.tsx
import { Ionicons } from '@expo/vector-icons';

const settingsItems = [
  // ... your existing settings items
  {
    title: 'Legal & Policies',
    icon: 'shield-checkmark-outline',
    onPress: () => navigation.navigate('LegalHub'),
  },
];
```

### 3. Initialize Consent System

Add consent checking to your app's root component:

```typescript
// In your App.tsx or main app component
import React, { useEffect, useState } from 'react';
import { useConsent } from './src/hooks/useConsent';
import ConsentModal from './src/components/ConsentModal';
import { analyticsGuard } from './src/lib/analyticsGuard';

export default function App() {
  const consent = useConsent();
  const [showConsentModal, setShowConsentModal] = useState(false);

  // Check if consent prompt is needed
  useEffect(() => {
    if (!consent.loading && consent.needsPrompt) {
      setShowConsentModal(true);
    }
  }, [consent.loading, consent.needsPrompt]);

  // Initialize analytics guard
  useEffect(() => {
    if (!consent.loading) {
      analyticsGuard.initialize(consent);
    }
  }, [consent.loading]);

  return (
    <>
      {/* Your main app content */}
      <YourMainAppContent />

      {/* Consent Modal */}
      <ConsentModal
        visible={showConsentModal}
        onAcceptAll={async () => {
          await consent.acceptAllConsent();
          setShowConsentModal(false);
        }}
        onRejectAll={async () => {
          await consent.rejectAllConsent();
          setShowConsentModal(false);
        }}
        onSaveChoices={async (choices) => {
          await consent.saveAllConsent(choices);
          setShowConsentModal(false);
        }}
        reasons={consent.promptReasons}
      />
    </>
  );
}
```

### 4. Set Up Deep Linking

Configure deep linking in your main navigation component:

```typescript
// In your main navigation component
import React, { useEffect } from 'react';
import { setupDeepLinking } from './src/lib/deepLinking';

export default function Navigation() {
  const navigation = useNavigation();

  useEffect(() => {
    const cleanup = setupDeepLinking(navigation);
    return cleanup;
  }, [navigation]);

  return (
    // Your navigation stack
  );
}
```

### 5. Add URL Scheme to Expo Config

Update your `app.json` or `app.config.js`:

```json
{
  "expo": {
    "scheme": "homegameadvantage",
    "name": "Home Game Advantage",
    // ... rest of your config
  }
}
```

## 🔧 Advanced Configuration

### Regional Compliance

Update `/config/privacy.ts` for your target markets:

```typescript
export const privacyConfig: AppPrivacyConfig = {
  // Enable for EU users
  enforceGDPR: false,

  // Enable for California users
  enforceCPRA: false,

  // Enable for Quebec users (default: true)
  enforceQuebecLaw25: true,

  contact: {
    dataProtectionEmail: 'privacy@yourdomain.com',
    privacyOfficer: {
      name: 'Your Privacy Officer',
      email: 'privacy@yourdomain.com',
    },
  },
};
```

### Policy Versions

When updating policies, increment the versions in `/config/privacy.ts`:

```typescript
// Update these when policies change
export const PRIVACY_VERSION = '2025-09-21'; // Today's date
export const TERMS_VERSION = '2025-09-21';   // Today's date
```

This will automatically prompt users to review updated policies.

### Analytics Integration

Replace the mock analytics in `/src/lib/analyticsGuard.ts` with your actual SDKs:

```typescript
// Example: Replace with real Sentry integration
import * as Sentry from '@sentry/react-native';

private initializeCrashReporting() {
  try {
    Sentry.init({
      dsn: 'your-sentry-dsn',
    });
    this.crashReporter = Sentry;
    console.log('✅ Sentry initialized');
  } catch (error) {
    console.error('❌ Failed to initialize Sentry:', error);
  }
}
```

## 📱 Usage Examples

### Track Events with Consent

```typescript
import { useAnalyticsGuard } from './src/lib/analyticsGuard';

function MyComponent() {
  const analytics = useAnalyticsGuard();

  const handleLessonComplete = () => {
    // This will only track if user has consented to analytics
    analytics.trackEvent({
      name: 'Lesson Completed',
      properties: { lessonId: 'basic-cocktails' }
    });
  };

  return <YourComponent />;
}
```

### Check Consent Status

```typescript
import { useConsent } from './src/hooks/useConsent';

function MyComponent() {
  const { canTrack, choices } = useConsent();

  if (canTrack('analytics')) {
    // Show analytics-dependent features
  }

  return <YourComponent />;
}
```

### Generate Deep Links

```typescript
import { DeepLinks } from './src/lib/deepLinking';

// Link to privacy policy tracking section
const trackingLink = DeepLinks.trackingTechnologies();
// homegameadvantage://policy?doc=privacy&anchor=tracking-technologies

// Link to data rights
const rightsLink = DeepLinks.dataRights();
// homegameadvantage://policy?doc=privacy&anchor=your-privacy-rights
```

## 🧪 Testing

### Test Consent Flow

1. Clear app data to simulate first run
2. App should show consent modal
3. Test "Accept All", "Reject All", and custom choices
4. Verify analytics only work when consented

### Test Policy Updates

1. Increment `PRIVACY_VERSION` in config
2. App should prompt to review updated policy
3. Verify banner appears until policy is viewed

### Test Deep Links

```bash
# Test privacy policy link
npx expo start
# Then open: homegameadvantage://policy?doc=privacy&anchor=tracking-technologies

# Test terms link
# Open: homegameadvantage://policy?doc=terms
```

## 📋 Compliance Checklist

### ✅ Quebec Law 25
- [x] Explicit opt-in for non-essential tracking
- [x] Privacy officer contact information
- [x] Clear consent receipts with timestamps
- [x] Data portability and deletion rights

### ✅ GDPR (when enabled)
- [x] Consent is freely given, specific, informed
- [x] Easy to withdraw consent
- [x] Data minimization principles
- [x] Right to be forgotten

### ✅ CPRA (when enabled)
- [x] "Do Not Sell" opt-out mechanism
- [x] Enhanced data rights disclosures
- [x] Transparent privacy policy

## 🔄 Maintenance

### Regular Tasks

1. **Monthly**: Review consent metrics and user feedback
2. **Quarterly**: Update policy versions if needed
3. **Annually**: Review regional compliance requirements

### When to Update Policies

- Data collection practices change
- New third-party services added
- Legal requirements update
- User feedback suggests clarification needed

### Version Management

Always increment version dates when making changes:

```typescript
// Before change
export const PRIVACY_VERSION = '2025-09-20';

// After change
export const PRIVACY_VERSION = '2025-09-21';
```

This ensures users are prompted to review updates.

## 🆘 Troubleshooting

### Common Issues

**Consent modal not appearing**
- Check if `needsPrompt` is true
- Verify consent storage is working
- Check console for errors

**Analytics not working**
- Verify consent is given: `canTrack('analytics')`
- Check analytics guard initialization
- Review SDK integration

**Deep links not working**
- Verify URL scheme in app.json
- Check deep link parsing logic
- Test with development build

### Debug Mode

Enable verbose logging:

```typescript
// In development, add to App.tsx
if (__DEV__) {
  console.log('Consent state:', consent.choices);
  console.log('Needs prompt:', consent.needsPrompt);
}
```

## 📞 Support

For questions about this legal compliance system:

1. Check this integration guide
2. Review the code comments
3. Test with the provided examples
4. Check console logs for debugging info

The system is designed to be self-contained and handle edge cases gracefully.