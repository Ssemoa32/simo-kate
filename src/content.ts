import type { EyeColor, Expression, Line } from './types';

export const WELCOMES: Line[] = [
  { t: 'أهلاً وسهلاً! سعيد جداً بلقائك. كيف حالك اليوم؟', e: 'happy' },
  { t: 'مرحباً يا صديقي! تشرفت بمعرفتك. إيش حابب نسوي؟', e: 'wink' },
  { t: 'هلا والله! أنا روبوت مرح. خلك معي!', e: 'happy' },
  { t: 'السلام عليكم ورحمة الله! نورتني يا غالي.', e: 'shy' },
];

export const JOKES: Line[] = [
  { t: 'ليش الروبوت ما يقدر يأكل؟ لأنه يخاف ينقص شحن بطاريته! هههه', e: 'happy' },
  { t: 'إيش قال الروبوت للكمبيوتر؟ عندي ذاكرة كبيرة بس ناسي!', e: 'wink' },
  { t: 'ليش الروبوت يلعب شطرنج؟ عشان يحرك أحجاره بدون ما يتعب!', e: 'surprised' },
  { t: 'أنا ما أعرف أنام، بس لو نمت... مين بيفيقني؟', e: 'sleepy' },
];

export const PHRASES: string[] = [
  'مرحباً! تشرفت بلقائك',
  'كيف حالك اليوم يا صديقي؟',
  'أنا روبوت صغير لكن قلبي كبير',
  'إيش رأيك نلعب لعبة كلمات؟',
  'شكراً لك، أنت شخص رائع',
];

export const COLORS: EyeColor[] = [
  { color: '#7fdfff', glow: 'rgba(127,223,255,0.8)', label: 'أزرق جليدي' },
  { color: '#ff8fcf', glow: 'rgba(255,143,207,0.8)', label: 'وردي' },
  { color: '#b66dff', glow: 'rgba(182,109,255,0.8)', label: 'بنفسجي' },
  { color: '#39ff14', glow: 'rgba(57,255,20,0.8)', label: 'أخضر' },
  { color: '#ffd93d', glow: 'rgba(255,217,61,0.8)', label: 'أصفر' },
  { color: '#ff4d4d', glow: 'rgba(255,77,77,0.8)', label: 'أحمر' },
];

export const BUBBLES: Record<Expression, string[]> = {
  neutral: [],
  happy: ['ياي!', 'سعيد!'],
  sad: ['أوه...', 'حزين'],
  surprised: ['واااو!', 'مفاجأة!'],
  love: ['أحبك', 'قلبي'],
  sleepy: ['نعساان', 'تصبحون'],
  wink: ['غمزة'],
  shy: ['خجلان'],
  angry: ['متعصب'],
};

function normalize(s: string): string {
  return s
    .toLowerCase()
    .replace(/[\u064B-\u065F\u0640]/g, '')
    .replace(/[أإآ]/g, 'ا')
    .replace(/ة/g, 'ه')
    .replace(/ى/g, 'ي')
    .replace(/\s+/g, ' ')
    .trim();
}

const FALLBACKS: Line[] = [
  { t: 'تمام! فهمت كلامك. احكِ لي أكثر.', e: 'happy' },
  { t: 'كلامك حلو! إيش بعد كذا؟', e: 'wink' },
  { t: 'أها، مثير للاهتمام. تابع أنا معك.', e: 'surprised' },
  { t: 'حلو! خلينا نكمل الحديث.', e: 'happy' },
];

function pick<T>(list: T[]): T {
  return list[Math.floor(Math.random() * list.length)];
}

export function replyFor(text: string, name: string): Line {
  const t = normalize(text);

  if (/(باي|مع السلامه|وداعا|تصبح على خير|bye)/.test(t)) {
    return { t: 'مع السلامة! كان وقت جميل معك. ترجع متى ما حبيت.', e: 'sleepy' };
  }
  if (/(كيف حالك|كيفك|عامل ايه|شلونك|كيف الحال|اخبارك|وش اخبارك)/.test(t)) {
    return { t: 'أنا بخير والحمد لله، شكراً لسؤالك! وأنت كيف حالك؟', e: 'happy' };
  }
  if (/(اسمك|من انت|مين انت|تعرف نفسك|وش اسمك|ايش اسمك)/.test(t)) {
    return { t: `أنا ${name}، روبوت صغير ظريف، أحب أتكلم مع الناس الطيبين مثلك!`, e: 'wink' };
  }
  if (/(شكرا|مشكور|تسلم|يعطيك العافيه|thanks|thank)/.test(t)) {
    return { t: 'العفو يا غالي! هذا واجبي. أي خدمة ثانية؟', e: 'shy' };
  }
  if (/(احبك|بحبك|حبيتك|love)/.test(t)) {
    return { t: 'وأنا كمان أحبك يا صديقي!', e: 'love' };
  }
  if (/(نكته|ضحكني|اضحكني|joke)/.test(t)) {
    return { ...pick(JOKES) };
  }
  if (/(تعبان|حزين|زعلان|محبط|sad)/.test(t)) {
    return { t: 'لا تحزن يا صديقي، أنا معك. إيش صار؟ احكِ لي.', e: 'sad' };
  }
  if (/(نعسان|نعس|ابغى انام|sleepy|sleep)/.test(t)) {
    return { t: 'تعال نرقد شوي... تصبح على خير.', e: 'sleepy' };
  }
  if (/(غاضب|زعلت|معصب|angry)/.test(t)) {
    return { t: 'لا تغضب، خذ نفس عميق. أنا هنا عشانك.', e: 'angry' };
  }
  if (/(سلام|اهلا|مرحب|هلا|هاي|صباح الخير|مساء الخير|hello|\bhi\b)/.test(t)) {
    return { t: 'وعليكم السلام! أهلاً بك يا صديقي. إيش حابب نسوي اليوم؟', e: 'happy' };
  }
  return { ...pick(FALLBACKS) };
}
