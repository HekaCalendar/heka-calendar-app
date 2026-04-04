# Play Store Data Safety Form - HEKA Calendar

**Use this guide to complete the Data Safety section in Google Play Console**

---

## Section 1: Overview

**App Name:** HEKA Calendar  
**Data Safety URL:** [Link to your privacy policy]

---

## Section 2: Data Collection

### Does your app collect or share any of the required user data types?

**Answer:** ✅ **Yes**

### Data Types Collected

| Data Type | Collected? | Shared? | Purpose | Encryption |
|-----------|------------|---------|---------|------------|
| **Location** | ✅ Yes | ❌ No | App functionality | N/A (not transmitted) |
| **Personal Info** | ✅ Yes | ⚠️ Optional* | App functionality | ✅ Encrypted |
| **Financial Info** | ❌ No | ❌ No | N/A | N/A |
| **Health & Fitness** | ❌ No | ❌ No | N/A | N/A |
| **Messages** | ❌ No | ❌ No | N/A | N/A |
| **Photos/Videos** | ❌ No | ❌ No | N/A | N/A |
| **Audio** | ❌ No | ❌ No | N/A | N/A |
| **Files/Docs** | ❌ No | ❌ No | N/A | N/A |
| **Calendar** | ❌ No | ❌ No | N/A | N/A |
| **Contacts** | ❌ No | ❌ No | N/A | N/A |
| **App Activity** | ✅ Yes | ❌ No | App functionality | ✅ Encrypted |
| **Web Browsing** | ❌ No | ❌ No | N/A | N/A |
| **App Info/Performance** | ✅ Yes | ❌ No | Analytics | ✅ Encrypted |
| **Device/Other IDs** | ❌ No | ❌ No | N/A | N/A |

\* Only shared with Firebase if user creates an account (optional)

---

## Section 3: Location Data Details

### Is location data collected?

**Answer:** ✅ **Yes**

### Location Data Details:

| Question | Answer |
|----------|--------|
| **Type of location data** | Approximate location (region/country selection) |
| **Purpose** | Calculate sunrise/sunset times and show regional holidays |
| **Is it optional?** | No (required for core features) |
| **Is it continuous?** | No (user selects once, can change in settings) |
| **Is precise GPS used?** | **NO** - Only user-selected region from dropdown |
| **Is it shared?** | No |
| **Is it processed ephemerally?** | N/A (stored locally) |

**Play Console Selections:**
- [x] Approximate location
- [ ] Precise location
- Purpose: App functionality

---

## Section 4: Personal Info Details

### Is personal info collected?

**Answer:** ✅ **Yes**

### Personal Info Details:

| Data Type | Collected? | Optional? | Purpose |
|-----------|------------|-----------|---------|
| **Name** | ✅ Yes | ✅ Yes | Profile identification |
| **Email** | ✅ Yes | ✅ Yes | Account authentication (optional) |
| **Birth date/time** | ✅ Yes | ✅ Yes | Astrological calculations |
| **Birth location** | ✅ Yes | ✅ Yes | Astrological calculations |
| **Address** | ❌ No | N/A | N/A |
| **Phone** | ❌ No | N/A | N/A |
| **Race/Ethnicity** | ❌ No | N/A | N/A |
| **Political/Religious** | ❌ No | N/A | N/A |
| **Sexual Orientation** | ❌ No | N/A | N/A |

**Play Console Selections:**
- [x] Name
- [x] Email address
- [ ] Phone number
- [x] Other info: Birth date, time, and location for astrology
- Purpose: App functionality, Account management

---

## Section 5: App Activity Details

### Is app activity data collected?

**Answer:** ✅ **Yes** (locally only)

### App Activity Details:

| Data Type | Collected? | Purpose |
|-----------|------------|---------|
| **App interactions** | ✅ Yes | Feature discovery, tutorials |
| **In-app search history** | ❌ No | N/A |
| **Installed apps** | ❌ No | N/A |
| **Other user-generated content** | ✅ Yes | Calendar notes, journal entries |
| **Other actions** | ✅ Yes | Achievement progress, settings |

**Play Console Selections:**
- [x] App interactions
- [x] Other user-generated content: Calendar notes, journal entries, mood tracking
- Purpose: App functionality, Personalization

---

## Section 6: App Info & Performance

### Is app info and performance data collected?

**Answer:** ✅ **Yes**

### App Info Details:

| Data Type | Collected? | Purpose |
|-----------|------------|---------|
| **Crash logs** | ✅ Yes | App stability improvements |
| **Diagnostics** | ✅ Yes | Performance optimization |
| **Other app performance data** | ❌ No | N/A |

**Play Console Selections:**
- [x] Crash logs
- [x] Diagnostics
- Purpose: Analytics

---

## Section 7: Data Sharing

### Is data shared with third parties?

**Answer:** ⚠️ **Yes, but only under specific conditions**

### Data Sharing Details:

| Third Party | Data Shared | Purpose | User Control |
|-------------|-------------|---------|--------------|
| **Firebase (Google)** | Email, encrypted user data | Cloud sync, Authentication | User must create account |
| **OpenAI/Groq/Anthropic** | Astrological context | AI-enhanced readings | User must provide own API key and initiate request |
| **Other third parties** | ❌ None | N/A | N/A |

**Important Notes for Play Console:**
- Data is only shared when user explicitly opts in
- Core app functionality requires NO data sharing
- AI features are completely optional and user-controlled

---

## Section 8: Security Practices

### Data Encryption

| Type | Status |
|------|--------|
| **Data encrypted in transit** | ✅ Yes (HTTPS/TLS 1.3) |
| **Data encrypted at rest** | ✅ Yes (AES-256) |

### Play Console Selections:
- [x] Data encrypted in transit
- [x] Data encrypted at rest

---

## Section 9: User Control & Deletion

### Can users request deletion of their data?

**Answer:** ✅ **Yes**

### Deletion Methods:

| Data Type | How to Delete |
|-----------|---------------|
| Local app data | Uninstall app or clear app storage |
| Cloud account data | Delete account in Settings |
| Individual notes/items | Delete within app |

### Play Console Selections:
- [x] Users can request deletion of their data
- Deletion method: In-app or email request

---

## Section 10: Required Disclosures

### Does your app:

| Question | Answer |
|----------|--------|
| Collect data while user is not using the app? | ❌ No |
| Use data for advertising? | ❌ No |
| Share data for advertising? | ❌ No |
| Use data for personalization? | ✅ Yes (user preferences only) |
| Use data for analytics? | ✅ Yes (crash reports, app performance) |
| Collect sensitive personal data? | ⚠️ Birth data for astrology (optional) |

---

## Section 11: Family Policy Compliance

### Is your app designed for children?

**Answer:** ❌ **No**

### Play Console Selections:
- [ ] Designed for families
- [ ] Target audience includes children under 13
- ✅ Primary audience: Adults interested in astrology and calendar tracking

---

## Section 12: Security & Compliance Statements

### Security Certifications
- [ ] ISO 27001
- [ ] SOC 2
- [x] Follows OWASP Mobile Security guidelines

### Compliance
- [x] GDPR compliant
- [x] CCPA compliant

---

## Quick Reference: Play Console Checkboxes

### Data Types (Check all that apply):
- [x] Location → Approximate location
- [x] Personal info → Name, Email, Other info (birth data)
- [ ] Financial info
- [ ] Health & fitness
- [ ] Messages
- [ ] Photos & videos
- [ ] Audio
- [ ] Files & docs
- [ ] Calendar
- [ ] Contacts
- [x] App activity → App interactions, Other user-generated content
- [ ] Web browsing
- [x] App info & performance → Crash logs, Diagnostics
- [ ] Device or other IDs

### Data Usage:
- [x] App functionality
- [x] Analytics
- [x] Developer communications (optional - for support)
- [ ] Advertising or marketing
- [ ] Fraud prevention, security, compliance
- [x] Personalization
- [ ] Account management

### Data Sharing:
- [x] Data is shared (but only with user consent)
- [x] Data is collected

### Security:
- [x] Data encrypted in transit
- [x] Data encrypted at rest

### User Control:
- [x] Users can request data deletion

---

## Developer Notes

### When Completing Play Console Form:

1. **Be transparent** - Better to over-disclose than under-disclose
2. **Emphasize local-first** - Most data never leaves device
3. **Highlight user control** - Everything optional except core functionality
4. **Explain location clearly** - It's region selection, not GPS tracking

### Common Questions:

**Q: Why do you collect location if you don't use GPS?**
A: Users select a region from a list, which we use to calculate sunrise/sunset times for astrological features.

**Q: Is the astrology data sensitive?**
A: Birth data is treated as personal information. It's stored locally and only synced to cloud if user creates optional account.

**Q: Can users use the app without sharing any data?**
A: Yes! The app works completely offline with no account required.

---

*Use this document as your reference when filling out the Data Safety section in Google Play Console.*
