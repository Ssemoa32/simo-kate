import { useEffect, useRef, useState } from 'react';
import type { CaptionData, EyeColor, Expression, Line, PopoverId } from './types';
import Face from './components/Face';
import SidePanel from './components/SidePanel';
import Popovers from './components/Popovers';
import { useVoice } from './useVoice';
import { useSettings } from './useSettings';
import { BUBBLES, JOKES, WELCOMES, replyFor } from './content';

const NAMES = { simo: 'Simo', kate: 'Kate' } as const;
const DENIED_TEXT = 'لم يُسمح باستخدام الميكروفون. اسمح به من إعدادات المتصفح.';
const DEFAULT_EYES = {
  simo: { color: '#7fdfff', glow: 'rgba(127, 223, 255, 0.8)' },
  kate: { color: '#ff8fcf', glow: 'rgba(255, 143, 207, 0.8)' },
} as const;

const srOnly: React.CSSProperties = {
  position: 'absolute',
  width: 1,
  height: 1,
  overflow: 'hidden',
  clip: 'rect(0 0 0 0)',
  whiteSpace: 'nowrap',
};

function pick<T>(list: T[]): T {
  return list[Math.floor(Math.random() * list.length)];
}

export default function App() {
  const [settings, updateSettings] = useSettings();
  const [expression, setExpression] = useState<Expression>('neutral');
  const [bubbles, setBubbles] = useState<string[]>([]);
  const [caption, setCaption] = useState<CaptionData>({
    who: 'sys',
    text: 'اضغط المايك وابدأ الكلام معي',
  });
  const [open, setOpen] = useState<PopoverId>(null);
  const [micOn, setMicOn] = useState(false);
  const [thinking, setThinking] = useState(false);

  const characterName = NAMES[settings.character];

  const micOnRef = useRef(false);
  micOnRef.current = micOn;
  const sayIdRef = useRef(0);
  const timers = useRef<number[]>([]);
  const greetedRef = useRef(false);
  const voiceRef = useRef<ReturnType<typeof useVoice> | null>(null);

  const clearTimers = () => {
    timers.current.forEach((t) => window.clearTimeout(t));
    timers.current = [];
  };
  const later = (fn: () => void, ms: number) => {
    const id = window.setTimeout(fn, ms);
    timers.current.push(id);
  };

  const showExpression = (e: Expression) => {
    setExpression(e);
    setBubbles(BUBBLES[e] ?? []);
  };

  const say = (line: Line) => {
    clearTimers();
    sayIdRef.current += 1;
    const id = sayIdRef.current;
    setThinking(false);
    showExpression(line.e);
    setCaption({ who: 'bot', text: line.t });
    voiceRef.current?.speak(line.t, () => {
      if (sayIdRef.current !== id) return;
      later(() => {
        if (sayIdRef.current !== id) return;
        showExpression('neutral');
      }, 1500);
      if (micOnRef.current) {
        later(() => {
          if (sayIdRef.current === id && micOnRef.current) voiceRef.current?.start();
        }, 600);
      }
    });
  };

  const handleTranscript = (text: string, final: boolean) => {
    setCaption({ who: 'you', text });
    if (!final) return;
    clearTimers();
    sayIdRef.current += 1;
    setThinking(true);
    setBubbles([]);
    voiceRef.current?.stop();
    const reply = replyFor(text, characterName);
    later(() => say(reply), 500);
  };

  const handleListening = (on: boolean) => {
    if (on) {
      setBubbles([]);
      setExpression((prev) => (prev === 'neutral' ? 'surprised' : prev));
    }
  };

  const handleError = (code: string) => {
    clearTimers();
    sayIdRef.current += 1;
    setThinking(false);
    setMicOn(false);
    micOnRef.current = false;
    updateSettings({ autoListen: false });
    setExpression('sad');
    setBubbles([]);
    if (code === 'not-allowed') {
      setCaption({ who: 'sys', text: DENIED_TEXT, error: true });
    } else if (code === 'network') {
      setCaption({ who: 'sys', text: 'تعذر الاتصال بخدمة التعرف على الصوت. تحقق من الإنترنت.', error: true });
    } else {
      setCaption({ who: 'sys', text: `حدث خطأ في الميكروفون (${code}).`, error: true });
    }
  };

  const onRetryMic = () => {
    setCaption({ who: 'sys', text: 'جارٍ طلب إذن الميكروفون…' });
    const begin = () => {
      greetedRef.current = true;
      setMicOn(true);
      micOnRef.current = true;
      updateSettings({ autoListen: true });
      setExpression('neutral');
      setBubbles([]);
      setCaption({ who: 'you', text: '...أستمع' });
      voiceRef.current?.start();
    };
    const md = typeof navigator !== 'undefined' ? navigator.mediaDevices : undefined;
    if (!md || typeof md.getUserMedia !== 'function') {
      begin();
      return;
    }
    md.getUserMedia({ audio: true })
      .then((stream) => {
        stream.getTracks().forEach((t) => t.stop());
        begin();
      })
      .catch(() => {
        setExpression('sad');
        setBubbles([]);
        setCaption({ who: 'sys', text: DENIED_TEXT, error: true });
      });
  };

  const voice = useVoice({
    lang: 'ar-SA',
    onTranscript: handleTranscript,
    onListeningChange: handleListening,
    onError: handleError,
  });
  voiceRef.current = voice;

  // theme, colours, direction
  useEffect(() => {
    document.documentElement.dir = 'rtl';
    document.documentElement.lang = 'ar';
  }, []);
  useEffect(() => {
    const b = document.body;
    b.classList.toggle('theme-kate', settings.character === 'kate');
    b.classList.toggle('theme-simo', settings.character === 'simo');
  }, [settings.character]);
  useEffect(() => {
    const r = document.documentElement.style;
    r.setProperty('--eye-color', settings.eyeColor);
    r.setProperty('--eye-glow', settings.eyeGlow);
    r.setProperty('--cheek', settings.eyeGlow.replace(/[\d.]+\)\s*$/, '0.35)'));
  }, [settings.eyeColor, settings.eyeGlow]);

  useEffect(() => {
    if (!voice.supported) {
      setCaption({
        who: 'sys',
        text: 'متصفحك لا يدعم التعرف على الصوت. الأزرار الأخرى تعمل بشكل طبيعي.',
      });
    }
    return () => clearTimers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onMic = () => {
    if (!voice.supported) return;
    if (micOn) {
      setMicOn(false);
      updateSettings({ autoListen: false });
      voice.stop();
      setCaption({ who: 'sys', text: 'توقف الاستماع. اضغط المايك للمتابعة.' });
      return;
    }
    setMicOn(true);
    micOnRef.current = true;
    updateSettings({ autoListen: true });
    setOpen(null);
    if (!greetedRef.current) {
      greetedRef.current = true;
      say({ t: `أهلاً! أنا ${characterName}، أنا أستمع لك الآن... تكلم!`, e: 'happy' });
    } else {
      voice.cancelSpeech();
      clearTimers();
      sayIdRef.current += 1;
      setThinking(false);
      setCaption({ who: 'you', text: '...أستمع' });
      voice.start();
    }
  };

  const onGreet = () => {
    setOpen(null);
    greetedRef.current = true;
    say(pick(WELCOMES));
  };
  const onJoke = () => {
    setOpen(null);
    say(pick(JOKES));
  };

  const onStop = () => {
    clearTimers();
    sayIdRef.current += 1;
    voice.cancelSpeech();
    voice.stop();
    setMicOn(false);
    updateSettings({ autoListen: false });
    setThinking(false);
    setOpen(null);
    showExpression('neutral');
    setCaption({ who: 'sys', text: 'حسناً، توقفت. اضغط المايك للبدء من جديد.' });
  };

  const onTheme = () => {
    const next = settings.character === 'simo' ? 'kate' : 'simo';
    updateSettings({
      character: next,
      eyeColor: DEFAULT_EYES[next].color,
      eyeGlow: DEFAULT_EYES[next].glow,
    });
    setOpen(null);
    setCaption({
      who: 'sys',
      text:
        next === 'kate'
          ? 'أنا Kate، البالون الوردي الثلجي. سعيدة بلقائك!'
          : 'أنا Simo، البالون الأسود الثلجي. أهلاً بك!',
    });
  };

  const onOpen = (id: Exclude<PopoverId, null>) => setOpen((cur) => (cur === id ? null : id));

  const onExpression = (e: Expression) => {
    clearTimers();
    sayIdRef.current += 1;
    showExpression(e);
    setOpen(null);
  };

  const onColor = (c: EyeColor) => {
    updateSettings({ eyeColor: c.color, eyeGlow: c.glow });
    setOpen(null);
  };

  const onPhrase = (p: string) => {
    setOpen(null);
    say({ t: p, e: 'happy' });
  };

  const mode = thinking ? 'thinking' : voice.speaking ? 'speaking' : voice.listening ? 'listening' : 'idle';

  return (
    <main className="app screen">
      <h1 style={srOnly}>{characterName} — روبوت صوتي</h1>
      <Face
        expression={expression}
        mode={mode}
        caption={caption}
        bubbles={bubbles}
        characterName={characterName}
        onRetry={onRetryMic}
      />
      <div className="rail-wrap">
      <SidePanel
        listening={voice.listening}
        micOn={micOn}
        micSupported={voice.supported}
        character={settings.character}
        expression={expression}
        onMic={onMic}
        onGreet={onGreet}
        onJoke={onJoke}
        onStop={onStop}
        onOpen={onOpen}
        onTheme={onTheme}
      />
      <Popovers
        open={open}
        expression={expression}
        eyeColor={settings.eyeColor}
        onExpression={onExpression}
        onColor={onColor}
        onPhrase={onPhrase}
        onClose={() => setOpen(null)}
      />
      </div>
    </main>
  );
}
