const fs = require('fs');
const path = 'src/data/languages.ts';
let content = fs.readFileSync(path, 'utf8');

// 1. Add fields to WizardStrings interface
content = content.replace(
  /tutorialNoAiWelcome: string;\n\}/,
  'tutorialNoAiWelcome: string;\n  changeLanguage: string;\n  selectedQuote: string;\n}'
);

// 2. Add fields to each language entry
const quotes = {
  en: { changeLanguage: 'Change Language', selectedQuote: 'The sky has waited a long time for a calendar that understands it.' },
  es: { changeLanguage: 'Cambiar Idioma', selectedQuote: 'El cielo ha esperado mucho tiempo un calendario que lo entienda.' },
  fr: { changeLanguage: 'Changer de Langue', selectedQuote: 'Le ciel a attendu longtemps un calendrier qui le comprend.' },
  de: { changeLanguage: 'Sprache Ändern', selectedQuote: 'Der Himmel hat lange auf einen Kalender gewartet, der ihn versteht.' },
  it: { changeLanguage: 'Cambia Lingua', selectedQuote: 'Il cielo ha atteso a lungo un calendario che lo capisca.' },
  pt: { changeLanguage: 'Mudar Idioma', selectedQuote: 'O céu esperou muito tempo por um calendário que o entenda.' },
  zh: { changeLanguage: '更改语言', selectedQuote: '天空等待了很久，等待一个理解它的日历。' },
  ja: { changeLanguage: '言語を変更', selectedQuote: '空は長い間、それを理解するカレンダーを待っていた。' },
  ko: { changeLanguage: '언어 변경', selectedQuote: '하늘은 오랫동안 자신을 이해하는 달력을 기다려왔다.' },
  ar: { changeLanguage: 'تغيير اللغة', selectedQuote: 'السماء انتظرت طويلاً تقويماً يفهمها.' },
  hi: { changeLanguage: 'भाषा बदलें', selectedQuote: 'आसमान बहुत समय से एक ऐसे कैलेंडर का इंतज़ार कर रहा है जो उसे समझे।' },
  ru: { changeLanguage: 'Сменить Язык', selectedQuote: 'Небо долго ждало календаря, который его поймет.' },
  tr: { changeLanguage: 'Dili Değiştir', selectedQuote: 'Gökyüzü, onu anlayan bir takvimi uzun zamandır bekliyordu.' },
  pl: { changeLanguage: 'Zmień Język', selectedQuote: 'Niebo długo czekało na kalendarz, który je zrozumie.' },
  nl: { changeLanguage: 'Taal Wijzigen', selectedQuote: 'De hemel heeft lang gewacht op een kalender die hem begrijpt.' },
  sv: { changeLanguage: 'Byt Språk', selectedQuote: 'Himmeln har väntat länge på en kalender som förstår den.' },
  el: { changeLanguage: 'Αλλαγή Γλώσσας', selectedQuote: 'Ο ουρανός περίμενε πολύ καιρό ένα ημερολόγιο που τον καταλαβαίνει.' },
  he: { changeLanguage: 'שנה שפה', selectedQuote: 'השמיים חיכו זמן רב ללוח שנה שמבין אותם.' },
  th: { changeLanguage: 'เปลี่ยนภาษา', selectedQuote: 'ท้องฟ้ารอคอยปฏิทินที่เข้าใจมันมานานแล้ว' },
  vi: { changeLanguage: 'Thay Đổi Ngôn Ngữ', selectedQuote: 'Bầu trời đã chờ đợi một cuốn lịch hiểu nó từ rất lâu.' },
  id: { changeLanguage: 'Ubah Bahasa', selectedQuote: 'Langit telah lama menunggu kalender yang memahaminya.' },
  uk: { changeLanguage: 'Змінити Мову', selectedQuote: 'Небо довго чекало календаря, який його розуміє.' },
  ro: { changeLanguage: 'Schimbă Limba', selectedQuote: 'Cerul a așteptat mult timp un calendar care să-l înțeleagă.' },
  cs: { changeLanguage: 'Změnit Jazyk', selectedQuote: 'Nebe dlouho čekalo na kalendář, který by mu rozuměl.' },
  hu: { changeLanguage: 'Nyelv Váltása', selectedQuote: 'Az ég régóta vár egy naptárra, amely megérti.' },
  da: { changeLanguage: 'Skift Sprog', selectedQuote: 'Himmelen har ventet længe på en kalender, der forstår den.' },
  fi: { changeLanguage: 'Vaihda Kieltä', selectedQuote: 'Taivas on odottanut kauan kalenteria, joka ymmärtää sen.' },
  no: { changeLanguage: 'Endre Språk', selectedQuote: 'Himmelen har ventet lenge på en kalender som forstår den.' },
  sk: { changeLanguage: 'Zmeniť Jazyk', selectedQuote: 'Nebo dlho čakalo na kalendár, ktorý by mu rozumel.' },
  bg: { changeLanguage: 'Смени Езика', selectedQuote: 'Небето отдавна чака календар, който го разбира.' },
};

for (const [code, vals] of Object.entries(quotes)) {
  const regex = new RegExp(`(  ${code}: \\{[\\s\\S]*?)(\\s+\\},)`);
  content = content.replace(regex, (match, before, after) => {
    if (match.includes('changeLanguage')) return match;
    return before + '\n    changeLanguage: ' + JSON.stringify(vals.changeLanguage) + ',\n    selectedQuote: ' + JSON.stringify(vals.selectedQuote) + ',' + after;
  });
}

fs.writeFileSync(path, content);
console.log('Patched languages.ts with changeLanguage and selectedQuote for all languages');
