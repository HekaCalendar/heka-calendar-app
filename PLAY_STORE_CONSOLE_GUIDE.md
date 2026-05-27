# Google Play Console Submission Guide — HEKA Calendar Pro v2.2.1

**Use this guide to fill out the Play Console forms. Copy the answers exactly.**

---

## 1. AI-Generated Content Declaration

**Location:** Play Console → App content → AI-generated content

---

### Question 1: Does your app use AI-generated content?

**Answer:** ✅ **Yes**

**Select:** "Yes, this app uses AI-generated content"

---

### Question 2: What types of AI-generated content does your app use?

**Check all that apply:**

- [x] **Text / Written content**
  - Daily oracle card interpretations
  - Celestial guidance readings
  - Journal insight summaries

- [ ] **Images / Art**
  - (Oracle card artwork is procedural SVG geometry, not AI-generated)

- [ ] **Video**

- [ ] **Audio / Voice**

- [ ] **Code**

---

### Question 3: How does your app use AI-generated content?

**Check all that apply:**

- [x] **Generative AI** — Creates original content based on user input
  - The app generates personalized celestial readings based on the user's birth chart, current planetary positions, and journal context.

- [ ] **Conversational AI / Chatbot**

- [x] **Summarization** — Summarizes existing content
  - The app can summarize journal entries for AI insight generation.

- [ ] **Translation**

- [ ] **Other**

---

### Question 4: Is the AI-generated content created by the app provider or by users?

**Answer:** Select: **"Both"**

**Explanation to enter (if required):**
> The app provider supplies template-based celestial guidance by default. Users may optionally enable AI-enhanced insights by providing their own API key for third-party LLM providers (OpenAI, Groq, Anthropic, or local Ollama). All AI-generated content is clearly labeled as "AI-enhanced" when active.

---

### Question 5: Does your app allow users to create or share AI-generated content?

**Answer:** ❌ **No**

**Explanation:**
> AI-generated content (celestial insights, journal summaries) is displayed privately to the individual user only. It cannot be shared, exported as AI-generated, or posted publicly within the app. Users may export their own journal entries, which may include AI-enhanced text they authored.

---

### Question 6: Can users flag or report AI-generated content?

**Answer:** ❌ **No** *(not applicable)*

**Explanation:**
> AI-generated content is private to each user and not shared publicly. There is no social feed or public AI content to flag. Users can delete any AI-generated insight at any time.

---

### Question 7: Does your app verify or moderate AI-generated content before showing it to users?

**Answer:** ✅ **Yes**

**Explanation:**
> The app uses a template-based fallback system as the default. AI-enhanced content is only generated when the user explicitly opts in and provides their own API key.

---

### Question 8: Does your app disclose to users that content is AI-generated?

**Answer:** ✅ **Yes**

**Explanation:**
> AI-enhanced insights are clearly labeled with an "AI Enhanced" badge in the UI. Template-based (non-AI) insights are labeled "Template Powered." Users can see which mode is active in the Settings panel. The privacy policy also discloses AI usage.

---

### Question 9: Does your app collect user data to train AI models?

**Answer:** ❌ **No**

**Explanation:**
> No user data is used to train AI models. When users enable AI features, contextual data (celestial state, mood summary, task count) is sent directly to the user's chosen third-party LLM provider (OpenAI, Groq, Anthropic, or self-hosted Ollama). We do not store, log, or use this data for model training.

---

### Question 10: Additional information about AI use

**Enter this text:**

> HEKA Calendar Pro uses AI on an opt-in basis only. The default experience provides template-based celestial guidance with no AI involvement. Users who wish to enable AI-enhanced insights must:
> 1. Navigate to Settings → AI Provider
> 2. Select a provider (OpenAI, Groq, Anthropic, or Ollama)
> 3. Enter their own API key
> 4. Explicitly toggle AI enhancement on
>
> AI-generated content is private, not shareable within the app, and can be disabled at any time. No health data, journal text, or birth chart details are transmitted to AI providers — only anonymized contextual summaries (e.g., "mood: elevated, tasks: 3 pending, celestial: Mercury retrograde").

---

## 2. Content Rating Questionnaire (IARC)

**Location:** Play Console → App content → Content ratings

**App name:** HEKA Calendar Pro  
**Email:** hekacalendar@gmail.com  
**Category:** Lifestyle

---

### Step 1: Select Rating Authority

Choose your primary market. For each:

| Authority | Region | Likely Result |
|---|---|---|
| **ESRB** | North America | E (Everyone) or E10+ |
| **PEGI** | Europe | 3 or 7 |
| **USK** | Germany | 0 (no age restriction) |
| **ACMA** | Australia | G (General) |
| **ClassInd** | Brazil | Livre (all ages) |
| **Generic** | Global | Suitable for all ages |

---

### Step 2: Answer the Questionnaire

#### Category 1: References to Alcohol, Tobacco & Drugs

**Q1: Does the app contain references to or depictions of alcoholic beverages?**

**Answer:** ❌ **No**

**Q2: Does the app contain references to or depictions of tobacco products?**

**Answer:** ❌ **No**

**Q3: Does the app contain references to or depictions of illegal drugs or drug paraphernalia?**

**Answer:** ❌ **No**

**Q4: Does the app contain references to or depictions of pharmaceutical drugs (prescription or over-the-counter)?**

**Answer:** ✅ **Yes**

**Select:** "No"

**Explanation:** The app does not promote pharmaceutical products.

---

#### Category 2: Gambling

**Q5: Does the app contain gambling or casino-style games?**

**Answer:** ❌ **No**

**Q6: Does the app simulate gambling (e.g., loot boxes, gacha mechanics)?**

**Answer:** ❌ **No**

**Q7: Does the app contain references to gambling or betting?**

**Answer:** ❌ **No**

---

#### Category 3: Horror / Fear

**Q8: Does the app contain scary or frightening content?**

**Answer:** ❌ **No**

**Q9: Does the app contain blood, gore, or graphic violence?**

**Answer:** ❌ **No**

---

#### Category 4: Language

**Q10: Does the app contain profanity or crude humor?**

**Answer:** ❌ **No**

**Q11: Does the app allow users to generate or share profanity?**

**Answer:** ❌ **No**

---

#### Category 5: Sexual Content

**Q12: Does the app contain sexual content or nudity?**

**Answer:** ❌ **No**

**Q13: Does the app contain references to sexual activity or relationships?**

**Answer:** ⚠️ **Yes — but non-explicit**

**Select:** "Mild references" (if available) or "No" depending on options

**Explanation:** The app tracks menstrual cycles and fertility as part of health tracking. This is clinical/wellness data, not sexual content. If the questionnaire does not have a "clinical health" option, select **"No"** and note in the comment field.

**Comment field (if available):**
> The app includes menstrual cycle and fertility tracking as part of its health & wellness features. This is clinical health data input by users for personal tracking. There is no sexual imagery, descriptions, or adult content.

---

#### Category 6: Violence

**Q14: Does the app contain realistic violence?**

**Answer:** ❌ **No**

**Q15: Does the app contain fantasy violence?**

**Answer:** ❌ **No**

---

#### Category 7: User-Generated Content & Interactions

**Q16: Can users communicate with each other within the app?**

**Answer:** ✅ **Yes**

**Select:** "Yes, via direct messages between friends"

**Q17: Can users share user-generated content publicly?**

**Answer:** ❌ **No**

**Explanation:** Users can share tasks with specific friends via invite codes, but there is no public feed or open sharing.

**Q18: Is there any moderation of user-generated content?**

**Answer:** ✅ **Yes**

**Explanation:** The app provides spiritual oracle guidance based on user journal entries. No content is transmitted for moderation.

---

#### Category 8: Information Sharing

**Q19: Does the app share user location with other users?**

**Answer:** ❌ **No**

**Q20: Does the app share personal information with third parties?**

**Answer:** ⚠️ **Only with user consent**

**Select:** "Yes, but only when the user explicitly opts in"

**Explanation:** Data is only shared when users (a) create an account for cloud sync, (b) enable AI features with their own API key, or (c) participate in optional community voting.

---

#### Category 9: In-App Purchases

**Q21: Does the app offer in-app purchases?**

**Answer:** ❌ **No**

*(If you plan to add subscriptions later, answer Yes and select the appropriate type)*

---

### Step 3: Target Audience

**Q22: Who is the app designed for?**

**Select:**
- [ ] Age 0-3
- [ ] Age 4-6
- [ ] Age 7-12
- [ ] Age 13-15
- [x] **Age 16-17**
- [x] **Age 18+**

**Explanation:** The app contains astrology, spiritual guidance, and community connection tools. There is no mature content.

**Q23: Is the app designed for children?**

**Answer:** ❌ **No**

---

### Expected Content Ratings

Based on the above answers, your app should receive:

| Authority | Rating | Reasoning |
|---|---|---|
| **ESRB** | **E (Everyone)** or **E10+** | No violence, no sexual content |
| **PEGI** | **3** or **7** | No inappropriate content |
| **USK** | **0** (Freigegeben) | No content of concern |
| **ACMA** | **G (General)** | Suitable for all ages |
| **ClassInd** | **Livre** | Suitable for all ages |

---

## 3. Quick Checklist Before Submitting

- [ ] Data Safety form completed with this guide
- [ ] AI-generated content declaration completed with this guide
- [ ] Content rating questionnaire completed with this guide
- [ ] Privacy policy URL linked: `https://hekacalendar.com/privacy.html`
- [ ] App category set: **Lifestyle**
- [ ] Target audience: **Not designed for children**
- [ ] Content rating: **E / PEGI 3 / G** (depending on authority)
- [ ] Signed AAB built and uploaded
- [ ] Release notes drafted
- [ ] Screenshots uploaded (phone + tablet)
- [ ] Feature graphic uploaded

---

*Complete all three forms in Play Console, then click "Send for review." Expected review time: 1-3 business days.*
