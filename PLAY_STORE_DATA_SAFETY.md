# Play Store Data Safety Form — HEKA Calendar Pro v2.2.1

**Use this guide to complete the Data Safety section in Google Play Console.**

Last updated: May 7, 2026

---

## Section 1: Overview

**App Name:** HEKA Calendar Pro  
**Privacy Policy:** https://heka-calendar-pro.vercel.app/privacy.html  
**App Category:** Lifestyle / Health & Fitness

---

## Section 2: Does your app collect or share any of the required user data types?

**Answer:** ✅ **Yes**

---

## Section 3: Data Types Collected

### Location

| Question | Answer |
|----------|--------|
| **Approximate location** | ✅ Yes |
| **Precise location** | ✅ Yes |
| **Purpose** | App functionality |
| **Optional?** | ✅ Yes — can be disabled in settings |
| **Shared?** | ❌ No |

**Details:**
- Approximate: User-selected region for sunrise/sunset calculations and regional holidays
- Precise: Real-time geolocation for live sky calculations in the Stars Hub and weather data
- Both are stored locally by default
- Only synced to cloud if user creates an optional account and enables cloud sync

**Play Console Selections:**
- [x] Approximate location → App functionality
- [x] Precise location → App functionality

---

### Personal Info

| Data Type | Collected? | Optional? | Purpose |
|-----------|------------|-----------|---------|
| **Name** | ✅ Yes | ✅ Yes | Profile identification, social features (Cosmic Circle) |
| **Email address** | ✅ Yes | ✅ Yes | Account authentication (Firebase Auth) |
| **Phone number** | ❌ No | N/A | N/A |
| **Other info** | ✅ Yes | ✅ Yes | Birth date, time, and location for astrological calculations |

**Play Console Selections:**
- [x] Name
- [x] Email address
- [x] Other info: Birth date, time, and location for astrology
- Purpose: App functionality, Account management

---

### Health & Fitness

| Data Type | Collected? | Optional? | Stored |
|-----------|------------|-----------|--------|
| **Menstrual cycle** | ✅ Yes | ✅ Yes | Local (IndexedDB) |
| **Mood** | ✅ Yes | ✅ Yes | Local (IndexedDB) |
| **Sleep** | ✅ Yes | ✅ Yes | Local (IndexedDB) |
| **Energy levels** | ✅ Yes | ✅ Yes | Local (IndexedDB) |
| **Medication** | ✅ Yes | ✅ Yes | Local (IndexedDB) |
| **Symptoms** | ✅ Yes | ✅ Yes | Local (IndexedDB) |
| **Exercise** | ✅ Yes | ✅ Yes | Local (IndexedDB) |
| **Nutrition** | ✅ Yes | ✅ Yes | Local (IndexedDB) |

**Details:**
- All health data is stored **locally on device** by default using IndexedDB
- No health data is transmitted to external servers unless user explicitly enables cloud sync
- On-device insights (cycle predictions, fertility windows, symptom patterns) are computed locally
- Encryption keys are device-bound

**Play Console Selections:**
- [x] Health & fitness → App functionality

---

### Photos & Videos

| Question | Answer |
|----------|--------|
| **Collected?** | ✅ Yes |
| **Optional?** | ✅ Yes |
| **Purpose** | App functionality (journal attachments) |
| **Shared?** | ❌ No |

**Details:** Photos and videos can be attached to journal entries. Stored locally in IndexedDB. Never shared unless user explicitly shares via the app's share feature.

**Play Console Selections:**
- [x] Photos & videos → App functionality

---

### Audio

| Question | Answer |
|----------|--------|
| **Collected?** | ✅ Yes |
| **Optional?** | ✅ Yes |
| **Purpose** | App functionality (audio journal attachments) |
| **Shared?** | ❌ No |

**Details:** Audio recordings can be attached to journal entries. Stored locally in IndexedDB.

**Play Console Selections:**
- [x] Audio → App functionality

---

### Files & Documents

| Question | Answer |
|----------|--------|
| **Collected?** | ✅ Yes |
| **Optional?** | ✅ Yes |
| **Purpose** | App functionality (journal attachments, PDF export) |
| **Shared?** | ❌ No |

**Details:** Users can attach files to journal entries and export data as PDF/JSON. All file operations are local.

**Play Console Selections:**
- [x] Files & docs → App functionality

---

### Messages

| Question | Answer |
|----------|--------|
| **Collected?** | ✅ Yes |
| **Optional?** | ✅ Yes |
| **Purpose** | App functionality (Cosmic Circle direct messages) |
| **Shared?** | ✅ Yes (with Firebase Firestore if enabled) |

**Details:** The Cosmic Circle social feature allows authenticated users to send direct messages to friends. Messages are stored in Firebase Firestore and are encrypted in transit.

**Play Console Selections:**
- [x] Messages → App functionality

---

### App Activity

| Data Type | Collected? | Purpose |
|-----------|------------|---------|
| **App interactions** | ✅ Yes | Feature discovery, tutorials, onboarding |
| **In-app search history** | ✅ Yes | Full-text journal search index (local) |
| **Installed apps** | ❌ No | N/A |
| **Other user-generated content** | ✅ Yes | Calendar notes, journal entries, tracker data |
| **Other actions** | ✅ Yes | Achievement progress, settings, daily oracle cards |

**Play Console Selections:**
- [x] App interactions → App functionality, Personalization
- [x] Other user-generated content → App functionality

---

### App Info & Performance

| Data Type | Collected? | Purpose | Shared? |
|-----------|------------|---------|---------|
| **Crash logs** | ✅ Yes | App stability | ✅ Yes (Firebase Crashlytics, anonymous) |
| **Diagnostics** | ✅ Yes | Performance optimization | ✅ Yes (Firebase Crashlytics, anonymous) |
| **Other app performance data** | ❌ No | N/A | N/A |

**Play Console Selections:**
- [x] Crash logs → Analytics
- [x] Diagnostics → Analytics

---

### Device or Other IDs

| Question | Answer |
|----------|--------|
| **Collected?** | ✅ Yes |
| **Optional?** | ❌ No |
| **Purpose** | App functionality (energy voting device identification) |
| **Shared?** | ❌ No |

**Details:** A persistent device ID (`heka-energy-device-id`) is generated locally for anonymous energy voting participation. This ID is never shared with third parties.

**Play Console Selections:**
- [x] Device or other IDs → App functionality

---

## Section 4: Data Sharing

### Is data shared with third parties?

**Answer:** ✅ **Yes, under specific conditions**

| Third Party | Data Shared | Purpose | User Control |
|-------------|-------------|---------|--------------|
| **Firebase (Google)** | Email, encrypted user data, crash logs | Cloud sync, Authentication, Analytics | User must create account |
| **OpenAI / Groq / Anthropic** | Astrological context, mood summary | AI-enhanced insights | User must provide own API key and explicitly trigger |
| **Open-Meteo** | Latitude, longitude | Weather data | Only when location is enabled |
| **NOAA** | Latitude, longitude | Sunrise/sunset times | Only when location is enabled |

**Important Notes:**
- Core app functionality requires NO data sharing
- AI features are completely optional and user-controlled
- Health data is NEVER shared with AI providers
- All data sharing requires explicit user action

**Play Console Selections:**
- [x] Data is shared (with user consent)
- [x] Data is collected

---

## Section 5: Security Practices

### Data Encryption

| Type | Status |
|------|--------|
| **Data encrypted in transit** | ✅ Yes (HTTPS/TLS 1.3, Firebase TLS) |
| **Data encrypted at rest** | ✅ Yes (AES-256 for cloud sync, device-native encryption for local data) |

**Play Console Selections:**
- [x] Data encrypted in transit
- [x] Data encrypted at rest

---

## Section 6: User Control & Deletion

### Can users request deletion of their data?

**Answer:** ✅ **Yes**

| Data Type | How to Delete |
|-----------|---------------|
| Local app data | Uninstall app or clear app storage |
| Cloud account data | Delete account in Settings → Data Management |
| Individual notes/items | Delete within app |
| Export before deletion | JSON export available in Settings |

**Play Console Selections:**
- [x] Users can request deletion of their data
- Deletion method: In-app account deletion

---

## Section 7: Required Disclosures

| Question | Answer |
|----------|--------|
| Collect data while user is not using the app? | ❌ No (background notifications use local scheduling only) |
| Use data for advertising? | ❌ No |
| Share data for advertising? | ❌ No |
| Use data for personalization? | ✅ Yes (user preferences, astrology settings) |
| Use data for analytics? | ✅ Yes (anonymous crash reports) |
| Collect sensitive personal data? | ✅ Birth data for astrology (optional) |
| Use AI-generated content? | ✅ Yes (optional LLM-enhanced insights) |

---

## Section 8: Family Policy Compliance

**Is your app designed for children?**

**Answer:** ❌ **No**

**Play Console Selections:**
- [ ] Designed for families
- [ ] Target audience includes children under 13
- ✅ Primary audience: Adults (18+) interested in astrology, wellness tracking, and calendar tools

**Note:** The app contains health tracking features (menstrual cycle, fertility) and wellness tools intended for adult users.

---

## Section 9: AI-Generated Content

**Does your app use AI-generated content?**

**Answer:** ✅ **Yes**

**Details:**
- AI-enhanced celestial insights are available as an **optional, opt-in feature**
- Users must provide their own API key (OpenAI, Groq, Anthropic, or Ollama)
- AI features are **disabled by default**
- All AI-generated content is clearly labeled as AI-enhanced
- Users can use the app fully without enabling AI features (template-based insights are default)

---

## Section 10: Content Rating

**Target Audience:** Adults 18+  
**Content Descriptors:**
- Health & wellness references
- Astrology and spiritual content
- Crisis support resources (988 Lifeline, Crisis Text Line — displayed for user safety)

---

## Quick Reference: Play Console Checkboxes

### Data Types:
- [x] Location → Approximate + Precise
- [x] Personal info → Name, Email, Other info (birth data)
- [ ] Financial info
- [x] Health & fitness
- [x] Messages
- [x] Photos & videos
- [x] Audio
- [x] Files & docs
- [ ] Calendar (system calendar — not accessed)
- [ ] Contacts
- [x] App activity → App interactions, Other user-generated content
- [ ] Web browsing
- [x] App info & performance → Crash logs, Diagnostics
- [x] Device or other IDs

### Data Usage:
- [x] App functionality
- [x] Analytics
- [x] Developer communications
- [ ] Advertising or marketing
- [ ] Fraud prevention, security, compliance
- [x] Personalization
- [x] Account management

### Data Sharing:
- [x] Data is shared (with user consent)
- [x] Data is collected

### Security:
- [x] Data encrypted in transit
- [x] Data encrypted at rest

### User Control:
- [x] Users can request data deletion

---

*This document reflects the actual data practices of HEKA Calendar Pro v2.2.1. Review and update with each release.*
