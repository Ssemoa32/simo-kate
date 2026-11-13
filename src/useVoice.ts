import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { VoiceApi, VoiceOptions } from './types';

interface SRResult {
  isFinal: boolean;
  [index: number]: { transcript: string };
}
interface SREvent {
  resultIndex: number;
  results: { length: number; [index: number]: SRResult };
}
interface SRInstance {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  onstart: (() => void) | null;
  onresult: ((e: SREvent) => void) | null;
  onerror: ((e: { error: string }) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
  abort: () => void;
}
type SRCtor = new () => SRInstance;

function getCtor(): SRCtor | null {
  if (typeof window === 'undefined') return null;
  const w = window as unknown as { SpeechRecognition?: SRCtor; webkitSpeechRecognition?: SRCtor };
  return w.SpeechRecognition || w.webkitSpeechRecognition || null;
}

export function useVoice(opts: VoiceOptions): VoiceApi {
  const Ctor = useMemo(getCtor, []);
  const supported = Ctor !== null;

  const optsRef = useRef(opts);
  optsRef.current = opts;

  const [listening, setListening] = useState(false);
  const [speaking, setSpeaking] = useState(false);

  const recRef = useRef<SRInstance | null>(null);
  const recognizingRef = useRef(false);
  const keepRef = useRef(false);
  const deniedRef = useRef(false);
  const speakingRef = useRef(false);
  const restartTimer = useRef<number | undefined>(undefined);
  const speakTimer = useRef<number | undefined>(undefined);
  const tokenRef = useRef(0);

  const clearRestart = () => {
    if (restartTimer.current !== undefined) {
      window.clearTimeout(restartTimer.current);
      restartTimer.current = undefined;
    }
  };

  const tryStart = useCallback(() => {
    if (!Ctor || recognizingRef.current || speakingRef.current) return;
    if (!recRef.current) {
      const rec = new Ctor();
      rec.lang = optsRef.current.lang;
      rec.continuous = false;
      rec.interimResults = true;
      rec.onstart = () => {
        recognizingRef.current = true;
        setListening(true);
        optsRef.current.onListeningChange(true);
      };
      rec.onresult = (e) => {
        let interim = '';
        let final = '';
        for (let i = e.resultIndex; i < e.results.length; i++) {
          const r = e.results[i];
          const tr = r[0]?.transcript ?? '';
          if (r.isFinal) final += tr;
          else interim += tr;
        }
        if (final.trim()) optsRef.current.onTranscript(final.trim(), true);
        else if (interim.trim()) optsRef.current.onTranscript(interim.trim(), false);
      };
      rec.onerror = (e) => {
        const code = e.error;
        if (code === 'no-speech' || code === 'aborted') return; // quiet restart via onend
        keepRef.current = false;
        clearRestart();
        if (code === 'not-allowed' || code === 'service-not-allowed') {
          deniedRef.current = true;
          optsRef.current.onError('not-allowed');
        } else {
          optsRef.current.onError(code);
        }
      };
      rec.onend = () => {
        recognizingRef.current = false;
        setListening(false);
        optsRef.current.onListeningChange(false);
        if (keepRef.current && !deniedRef.current && !speakingRef.current) {
          clearRestart();
          restartTimer.current = window.setTimeout(() => {
            restartTimer.current = undefined;
            if (keepRef.current && !deniedRef.current && !speakingRef.current) tryStart();
          }, 450);
        }
      };
      recRef.current = rec;
    }
    try {
      recRef.current.start();
    } catch {
      /* already started or still closing: onend will retry */
    }
  }, [Ctor]);

  const start = useCallback(() => {
    if (!Ctor) return;
    deniedRef.current = false;
    keepRef.current = true;
    clearRestart();
    tryStart();
  }, [Ctor, tryStart]);

  const stop = useCallback(() => {
    keepRef.current = false;
    clearRestart();
    try {
      recRef.current?.abort();
    } catch {
      /* ignore */
    }
  }, []);

  const endSpeaking = () => {
    speakingRef.current = false;
    setSpeaking(false);
    if (speakTimer.current !== undefined) {
      window.clearTimeout(speakTimer.current);
      speakTimer.current = undefined;
    }
  };

  const cancelSpeech = useCallback(() => {
    tokenRef.current += 1;
    try {
      window.speechSynthesis?.cancel();
    } catch {
      /* ignore */
    }
    endSpeaking();
  }, []);

  const speak = useCallback((text: string, onEnd?: () => void) => {
    // cancel whatever was speaking, and never listen while speaking
    tokenRef.current += 1;
    const token = tokenRef.current;
    try {
      window.speechSynthesis?.cancel();
    } catch {
      /* ignore */
    }
    clearRestart();
    try {
      recRef.current?.abort();
    } catch {
      /* ignore */
    }
    if (speakTimer.current !== undefined) window.clearTimeout(speakTimer.current);

    speakingRef.current = true;
    setSpeaking(true);

    let done = false;
    const finish = () => {
      if (done || tokenRef.current !== token) return;
      done = true;
      endSpeaking();
      onEnd?.();
    };

    const synth = typeof window !== 'undefined' ? window.speechSynthesis : undefined;
    if (!synth || typeof SpeechSynthesisUtterance === 'undefined') {
      // no voice available: the caption still shows the text
      speakTimer.current = window.setTimeout(finish, 900 + text.length * 55);
      return;
    }
    try {
      const u = new SpeechSynthesisUtterance(text);
      u.lang = 'ar-SA';
      u.rate = 1;
      u.pitch = 1.4;
      u.volume = 1;
      const voice = synth.getVoices().find((v) => v.lang && v.lang.toLowerCase().startsWith('ar'));
      if (voice) u.voice = voice;
      u.onend = finish;
      u.onerror = finish;
      synth.speak(u);
      // safety net: some browsers never fire onend
      speakTimer.current = window.setTimeout(finish, 4000 + text.length * 250);
    } catch {
      speakTimer.current = window.setTimeout(finish, 900 + text.length * 55);
    }
  }, []);

  useEffect(() => {
    return () => {
      keepRef.current = false;
      clearRestart();
      tokenRef.current += 1;
      try {
        recRef.current?.abort();
      } catch {
        /* ignore */
      }
      try {
        window.speechSynthesis?.cancel();
      } catch {
        /* ignore */
      }
      if (speakTimer.current !== undefined) window.clearTimeout(speakTimer.current);
    };
  }, []);

  return { supported, listening, speaking, start, stop, speak, cancelSpeech };
}
