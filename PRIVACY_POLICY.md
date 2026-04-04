# Privacy Policy for HEKA Calendar

**Last Updated:** March 27, 2026  
**Effective Date:** March 27, 2026

---

## Overview

HEKA Calendar ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your information when you use our mobile application.

**Key Principle:** HEKA Calendar is designed to work primarily offline. Most of your data stays on your device, and you control what (if anything) is shared.

---

## Information We Collect

### 1. Information You Provide (Stored Locally on Your Device)

**Calendar Notes & Journal Entries:**
- Daily notes and reflections you write
- Journal entries with mood ratings
- Category tags you assign
- **Storage:** Local device only (unless you enable optional cloud sync)

**Birth Chart Data (Optional):**
- Birth date, time, and location you enter
- Name (optional, for profile identification)
- Calculated astrological charts
- **Storage:** Local device only (unless you enable optional cloud sync)
- **Note:** Location is used for sunrise/sunset calculations only

**Energy Ratings:**
- Daily energy votes (1-10 scale)
- **Storage:** Local device only, never synced to cloud
- **Purpose:** Personal tracking only

**App Preferences:**
- Theme and font selections
- Display settings
- Location/region selection
- **Storage:** Local device only

### 2. Information from Third-Party Services (Optional, User-Initiated)

**AI-Enhanced Readings:**
- If you choose to use AI features, you may provide your own API key for:
  - OpenAI
  - Groq
  - Anthropic
- **Data Sent:** Astrological context (planet positions, transits) + your API key
- **Control:** You choose whether to use AI; we never send data without your explicit action
- **Storage:** Your API keys stored only on your device

### 3. Cosmic Circle Data (Optional)

**If You Use Social Features:**
- Your profile (display name, avatar/photo)
- Friend connections you create
- Task rituals you create or receive
- Messages with friends
- **Storage:** Encrypted cloud storage (Firebase)
- **Note:** You choose who to connect with via invite codes
- **Security:** End-to-end encryption for messages

### 4. Account Information (Optional Cloud Sync)

**If You Create an Account:**
- Email address (for authentication)
- Display name and profile photo (optional)
- Encrypted backup of your local data
- **Service:** Firebase (Google)
- **Purpose:** Cross-device sync and Cosmic Circle features
- **Encryption:** All data encrypted in transit (HTTPS) and at rest

### 5. What We Do NOT Collect

HEKA Calendar does **NOT** collect:
- ❌ Precise GPS location (we only use your selected region)
- ❌ Device ID or fingerprinting
- ❌ Contacts from your phone
- ❌ Photos, camera access, or microphone
- ❌ SMS, call logs, or other apps on your device
- ❌ Browsing history
- ❌ IP addresses
- ❌ Advertising identifiers

---

## How We Use Your Information

### Local Data Usage
Your locally stored data is used to:
- Display your calendar and notes
- Calculate personalized astrological readings
- Track your achievement progress
- Remember your preferences

### Cloud Data Usage (If Enabled)
Your encrypted cloud data is used to:
- Sync across your devices
- Backup your data for recovery

### AI Features (If You Opt In)
Astrological context is sent to AI services only when:
- You explicitly request an AI-enhanced reading
- You have provided your own API key
- You initiate the action

---

## Data Storage & Security

### Local-First Architecture
```
┌─────────────────────────────────────┐
│        YOUR DEVICE                  │
│  ┌─────────────────────────────┐    │
│  │  Calendar Notes             │    │
│  │  Journal Entries            │    │
│  │  Birth Charts               │    │
│  │  Energy Votes               │    │
│  │  Preferences                │    │
│  └─────────────────────────────┘    │
│    (Device-Encrypted Storage)       │
└─────────────────────────────────────┘
```

### Security Measures
- All local data uses your device's built-in encryption
- Cloud data encrypted with AES-256
- HTTPS for all network communications
- No data sold to third parties
- No advertising tracking

---

## Your Rights & Choices

### You Can:
✅ **Use the app completely offline** - No account required  
✅ **Export your data** - Built-in export functionality in Settings  
✅ **Delete your data** - Clear app storage or uninstall  
✅ **Opt out of cloud sync** - Use local-only mode  
✅ **Delete your account** - Removes all cloud data within 30 days  
✅ **Control AI usage** - Only use AI if you provide your own API key

### Data Portability
You can export all your data at any time from:
- Settings → Export Data
- Profile Manager → Export Charts
- Journal → Export Entries

### Accessing Your Data
All your data can be accessed and managed within the app. We provide full transparency about what data we store.

---

## Third-Party Services

We use the following third-party services:

### Firebase (Google) - Optional
- **Purpose:** Authentication and optional cloud sync
- **Data:** Email address (if you create account), encrypted user data
- **Location:** Google data centers
- **Opt-out:** Don't create an account
- **Privacy Policy:** [firebase.google.com/support/privacy](https://firebase.google.com/support/privacy)

### Swiss Ephemeris (Astronomical Calculations)
- **Purpose:** Precise astrology calculations
- **Data:** No personal data transmitted
- **Note:** Runs entirely locally on your device via WebAssembly
- **No network access required**

### AI Services (User-Configured, Optional)
- **Services:** OpenAI, Groq, Anthropic (user provides API key)
- **Purpose:** Enhanced astrological readings
- **Data Sent:** Astrological context only when you request a reading
- **Control:** You control if/when to use these features

---

## Location Data Clarification

**We do NOT track your GPS location.**

**What we do:**
- You select a country/region from a dropdown list
- We use this selection to calculate:
  - Sunrise and sunset times
  - Local holidays
  - Season information
- This data is stored as a region code (e.g., "US", "AU")
- No precise coordinates are ever accessed or stored

**Why we request location permission:**
The Android manifest includes location permissions for calculating sunrise/sunset times based on your selected region's latitude/longitude. This is used for the planetary hours feature and accurate astrological calculations.

---

## Children's Privacy

HEKA Calendar is not intended for children under 13. We do not knowingly collect personal information from children under 13. If you are a parent and believe your child has provided us with personal information, please contact us.

---

## Data Retention

### Local Data:
- Retained until you uninstall the app
- Or until you manually delete within the app
- You have full control

### Cloud Data (if applicable):
- Retained while your account is active
- Deleted within 30 days of account deletion
- You can delete your account anytime in Settings

---

## Changes to This Policy

We may update this Privacy Policy from time to time. We will notify you of any changes by:
- Updating the "Last Updated" date
- Posting the new policy in the app
- Notifying you via email (for account holders)

Continued use of the app after changes constitutes acceptance of the updated policy.

---

## Related Documents

- **Terms of Service:** [TERMS_OF_SERVICE.md](./TERMS_OF_SERVICE.md)
- **Privacy Policy:** This document

## Contact Us

If you have questions about this Privacy Policy, please contact us:

**Email:** hekacalendar@gmail.com  
**Developer:** HEKA Calendar Team

We will respond to privacy inquiries within 30 days.

---

## Compliance

This app complies with:
- ✅ **GDPR** (General Data Protection Regulation) - EU
- ✅ **CCPA** (California Consumer Privacy Act)
- ✅ **Google Play Store** privacy requirements
- ✅ **Apple App Store** privacy requirements

### Your Rights Under GDPR:
- Right to access your data
- Right to rectification (correct inaccurate data)
- Right to erasure (delete your data)
- Right to data portability
- Right to object to processing
- Right to withdraw consent

### Your Rights Under CCPA:
- Right to know what data we collect
- Right to delete your data
- Right to opt-out of data sale (we never sell data)
- Right to non-discrimination for exercising your rights

---

## Summary Table

| Data Type | Storage | Shared? | Purpose |
|-----------|---------|---------|---------|
| Calendar Notes | Local Device | ❌ No | Personal record keeping |
| Journal Entries | Local Device | ❌ No | Personal reflection |
| Mood/Energy Ratings | Local Device | ❌ No | Personal tracking |
| Calendar Notes | Local Device | ❌ No | Personal record keeping |
| Journal Entries | Local Device | ❌ No | Personal reflection |
| Birth Chart Data | Local Device | ❌ No | Astrological calculations |
| Cosmic Circle Profile | Firebase (Encrypted) | ✅ Only with friends you choose | Social features |
| Messages/Tasks | Firebase (Encrypted) | ✅ Only with connected friends | Communication |
| Email (optional) | Firebase | ⚠️ With Google (encrypted) | Account authentication |
| Cloud Backup (optional) | Firebase | ⚠️ With Google (encrypted) | Cross-device sync |
| AI Requests | External APIs | ✅ Only when you initiate | Enhanced readings |

**Bottom Line:** Your personal data stays on your device unless you explicitly choose to enable cloud sync. We believe in privacy by design.

---

*This Privacy Policy is effective as of the date listed above.*
