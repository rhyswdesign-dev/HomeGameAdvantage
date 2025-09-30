/**
 * CONSENT & PRIVACY TYPES
 * Type definitions for legal compliance system
 * Supports PIPEDA, Quebec Law 25, GDPR, and CPRA
 */

export type ConsentCategory = 'essential' | 'analytics' | 'crash' | 'marketing';

/**
 * User consent choices for each tracking category
 * Essential is always true and immutable for app functionality
 */
export interface ConsentChoices {
  essential: true;             // immutable - required for app to function
  analytics: boolean;          // usage analytics, performance metrics
  crash: boolean;             // crash reporting and error logs
  marketing: boolean;         // advertising identifiers, promotional tracking
}

/**
 * Legal receipt of user's consent choices
 * Stored as audit trail for compliance requirements
 */
export interface ConsentReceipt {
  timestamp: string;           // ISO 8601 datetime
  appVersion: string;          // app version when consent given
  locale: string;             // user's locale (en-CA, fr-CA, etc.)
  regionFlags: {              // which privacy laws apply
    gdpr: boolean;            // GDPR (EU residents)
    cpra: boolean;            // CPRA (California residents)
    law25: boolean;           // Quebec Law 25
  };
  policyVersions: {           // versions of policies user agreed to
    privacy: string;          // privacy policy version (YYYY-MM-DD)
    terms: string;            // terms of service version (YYYY-MM-DD)
  };
  choices: ConsentChoices;    // actual consent selections
}

/**
 * Regional privacy configuration flags
 * Controls which compliance features are enabled
 */
export interface PrivacyConfig {
  enforceGDPR: boolean;         // EU GDPR compliance mode
  enforceCPRA: boolean;         // California CPRA compliance mode
  enforceQuebecLaw25: boolean;  // Quebec Law 25 compliance mode
}

/**
 * Privacy officer contact information
 * Required under Quebec Law 25 if applicable
 */
export interface PrivacyOfficer {
  name: string;
  email: string;
  address?: string;
  phone?: string;
}

/**
 * App configuration for privacy compliance
 */
export interface AppPrivacyConfig extends PrivacyConfig {
  contact?: {
    privacyOfficer?: PrivacyOfficer;
    dataProtectionEmail: string;
    supportEmail: string;
  };
}

/**
 * Markdown document metadata from front-matter
 */
export interface DocumentMetadata {
  title: string;
  updated: string;           // YYYY-MM-DD format
  version?: string;          // semver or date
  language?: string;         // ISO language code
}

/**
 * Deep link parameters for policy navigation
 */
export interface PolicyDeepLink {
  doc: 'privacy' | 'terms';
  anchor?: string;           // section anchor to scroll to
  lang?: string;            // language preference
}