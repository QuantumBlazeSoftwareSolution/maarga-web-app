# Feature Proposal: Maarga Road Rules (මාර්ග නීති)

## 1. Overview
The "Maarga Road Rules" feature aims to educate drivers and general users about Sri Lankan road rules, traffic signs, and legal procedures. This addition transforms Maarga from a utility app into a comprehensive travel companion and educational platform, adding significant social value.

---

## 2. Key Modules & Features

### A. Digital Road Rules Handbook (මාර්ග නීති අත්පොත)
*   **Description:** A simplified version of the official Highway Code.
*   **Content:** High-priority rules (lane discipline, roundabout rules, overtaking, etc.).
*   **Presentation:** Use of easy-to-read Sinhala/English text accompanied by diagrams.

### B. Interactive Traffic Signs Gallery (සංඥා පුවරු ප්‍රදර්ශනාගාරය)
*   **Categories:**
    *   **Mandatory Signs:** Blue/Red circles (Must follow).
    *   **Warning Signs:** Triangles (Caution).
    *   **Information Signs:** Squares/Rectangles (Directions/Services).
*   **Feature:** Users can tap a sign to see a detailed explanation of its meaning and the penalty for ignoring it.

### C. Fine & Penalty Guide (දඩ මුදල් මාර්ගෝපදේශය)
*   **Description:** A comprehensive list of common traffic offenses and their respective spot fines or court penalties.
*   **Goal:** Helping drivers understand their rights and duties when stopped by the police.
*   **Detail:** Step-by-step guide on how to pay a spot fine (Online/Post Office).

### D. Gamified Learning (Micro-Learning Quiz)
*   **Rule of the Day:** A push notification featuring one important road rule daily.
*   **Knowledge Quiz:** A timed quiz with 5-10 questions.
*   **Rewards:** Earning badges (e.g., "Silver Driver", "Pro Driver") based on score, which adds a sense of achievement.

### E. Emergency & Legal Assistance
*   **SOS Directory:** Direct dial buttons for:
    *   119 (Police Emergency)
    *   1990 (Suwa Seriya Ambulance)
    *   Highway Emergency
    *   Insurance Hotlines
*   **Legal Aid:** Basic FAQ on what to do during a road accident.

---

## 3. UI/UX Design Strategy (Neumorphic Aesthetic)

To maintain consistency with the existing Maarga Dashboard design:

*   **Rule Cards:** Use `nmOuter` style for rules list and `nmPressed` for active/selected rule details.
*   **Visual Elements:** High-quality SVG traffic signs embedded within soft-shadowed containers.
*   **Animations:** Smooth transitions between categories to provide a "premium" feel.
*   **Night Mode:** A dark-themed Neumorphic mode to reduce eye strain for night-time drivers.

---

## 4. Implementation Logic (Future Phase)
1.  **Database:** Integration of a JSON or Local SQLite database containing rules and fine data.
2.  **Navigation:** Adding a new menu item in the mobile app drawer or a dedicated section in the Web Dashboard for management.
3.  **Localization:** Ensuring all content is available in Sinhala, Tamil, and English.

---

## 5. Potential Impact
*   **User Retention:** Users visit the app not just when they need fuel, but also to learn/check rules.
*   **Brand Authority:** Positions Maarga as the "Official" source of road intelligence in Sri Lanka.
*   **Social Safety:** Direct contribution to reducing road accidents by promoting knowledge.




1. Road Rules Handbook (ඩිජිටල් අත්පොත)
ශ්‍රී ලංකාවේ මාර්ග නීති (Highway Code) ඉතාමත් සරලව සහ ආකර්ෂණීය ලෙස ඉදිරිපත් කළ හැකියි.
හුදෙක් අකුරු විතරක් නැතුව, Neumorphic Cards ඇතුළේ රූපසටහන් (Illustrations) භාවිතයෙන් "කළ යුතු" සහ "නොකළ යුතු" දේ පෙන්වන්න පුළුවන්.
2. Traffic Signs Gallery (සංඥා පුවරු)
මාර්ග සංඥා පුවරු (Road Signs) වල තේරුම් පැහැදිලි කරන වෙනම රූපමය කොටසක්. උදාහරණයක් විදිහට, "Warning Signs", "Mandatory Signs" වගේ categories වලට බෙදලා පෙන්වන්න පුළුවන්.
3. Fine & Penalty Guide (දඩ මුදල් පිළිබඳ විස්තර)
මෙය රියදුරන්ට ගොඩක් වටිනවා. යම් කිසි නීතියක් කඩ වුනොත් ඒකට අදාල දඩ මුදල සහ ඒ සම්බන්ධයෙන් ගත යුතු ක්‍රියාමාර්ග (උදා: දඩ පත්‍රිකාවක් ලැබුණොත් ගෙවිය යුතු ආකාරය) ගැන තොරතුරු ඇතුලත් කරන්න පුළුවන්. මෙය රියදුරන් පොලිසිය සමඟ කතා කිරීමේදී ඔවුන්ගේ අයිතීන් පිළිබඳව දැනුවත් වීමට උදව් වෙනවා.
4. Emergency Contacts & Legal Aid
හදිසි අනතුරක් වුනොත් හෝ නීතිමය ප්‍රශ්නයකදී කතා කළ යුතු අංක (Police Emergency, Insurance, Legal consulting) එක තැනක තැබීම.
UI Design Suggestion:
අපි දැන් Maarga App එකේ පාවිච්චි කරන Neumorphic Design එක මේකටත් පාවිච්චි කළොත්, ඒක හරිම Premium සහ Modern විදිහට පෙනේවි.

උදාහරණයක් විදිහට:

එක් එක් නීතියක් හෝ සංඥාවක් NmSubtle box එකක් ඇතුළේ ලස්සනට පෙන්වන්න පුළුවන්.
අන්තර්ක්‍රියාකාරී (Interactive) Elements වලට NmPressed style එක දාන්න පුළුවන්.
Maarga App එකේ වටිනාකම (Brand Value) මේ හරහා තවත් වැඩි වෙනවා. මොකද එය මිනිසුන්ට උදව් කරන (Helpful) වගේම වගකීම් සහගත (Responsible) App එකක් විදිහට ඉදිරියට එන නිසා.

ඔයා මේ ගැන හිතන්නේ කොහොමද? අපි මේක ඉදිරිය පියවරකදී (Future Milestone) implement කරන්න ප්ලෑන් කරමුද?