import { useCallback, useState } from 'react';
import type { Character, Settings } from './types';

const KEY = 'app:settings';

const DEFAULTS: Settings = {
  character: 'simo',
  eyeColor: '#7fdfff',
  eyeGlow: 'rgba(127, 223, 255, 0.8)',
  autoListen: true,
};

function isCharacter(v: unknown): v is Character {
  return v === 'simo' || v === 'kate';
}

function load(): Settings {
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return DEFAULTS;
    const data: unknown = JSON.parse(raw);
    if (!data || typeof data !== 'object') return DEFAULTS;
    const d = data as Record<string, unknown>;
    return {
      character: isCharacter(d.character) ? d.character : DEFAULTS.character,
      eyeColor:
        typeof d.eyeColor === 'string' && /^#[0-9a-fA-F]{3,8}$/.test(d.eyeColor)
          ? d.eyeColor
          : DEFAULTS.eyeColor,
      eyeGlow:
        typeof d.eyeGlow === 'string' && d.eyeGlow.length < 60 ? d.eyeGlow : DEFAULTS.eyeGlow,
      autoListen: typeof d.autoListen === 'boolean' ? d.autoListen : DEFAULTS.autoListen,
    };
  } catch {
    return DEFAULTS;
  }
}

export function useSettings(): [Settings, (patch: Partial<Settings>) => void] {
  const [settings, setSettings] = useState<Settings>(load);

  const update = useCallback((patch: Partial<Settings>) => {
    setSettings((prev) => {
      const next = { ...prev, ...patch };
      try {
        window.localStorage.setItem(KEY, JSON.stringify(next));
      } catch {
        /* storage unavailable: keep in memory */
      }
      return next;
    });
  }, []);

  return [settings, update];
}
