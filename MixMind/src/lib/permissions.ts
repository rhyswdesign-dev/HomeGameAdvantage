import { analytics } from './analytics';

export type PermissionType = 'notifications' | 'location' | 'camera' | 'contacts';

/**
 * Pre-permission explainer functions (no actual permission requests)
 * These are used in onboarding to educate users about permissions
 * before the actual permission request happens later in the app flow
 */

export function explainNotificationPermission(): void {
  analytics.track('onboarding_permission_explainer', {
    permission_type: 'notifications',
    action: 'viewed',
  });
  
  if (__DEV__) {
    console.log('📱 Permission Explainer: Notifications');
    console.log('We\'ll ask for notification permission to send you updates about new recipes and events.');
  }
}

export function explainLocationPermission(): void {
  analytics.track('onboarding_permission_explainer', {
    permission_type: 'location',
    action: 'viewed',
  });
  
  if (__DEV__) {
    console.log('📱 Permission Explainer: Location');
    console.log('We\'ll ask for location permission to find nearby bars and liquor stores.');
  }
}

export function explainCameraPermission(): void {
  analytics.track('onboarding_permission_explainer', {
    permission_type: 'camera',
    action: 'viewed',
  });
  
  if (__DEV__) {
    console.log('📱 Permission Explainer: Camera');
    console.log('We\'ll ask for camera permission to let you share photos of your cocktail creations.');
  }
}

export function explainContactsPermission(): void {
  analytics.track('onboarding_permission_explainer', {
    permission_type: 'contacts',
    action: 'viewed',
  });
  
  if (__DEV__) {
    console.log('📱 Permission Explainer: Contacts');
    console.log('We\'ll ask for contacts permission to help you invite friends to MixMind.');
  }
}

export function dismissPermissionExplainer(permissionType: PermissionType): void {
  analytics.track('onboarding_permission_explainer', {
    permission_type: permissionType,
    action: 'dismissed',
  });
}