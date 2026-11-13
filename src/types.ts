import type { ReactNode } from 'react';
export type Expression = 'neutral'|'happy'|'sad'|'surprised'|'love'|'sleepy'|'wink'|'shy'|'angry';
export type Mode = 'idle'|'listening'|'speaking'|'thinking';
export type Character = 'simo'|'kate';
export interface Settings { character: Character; eyeColor: string; eyeGlow: string; autoListen: boolean; }
export interface Line { t: string; e: Expression; }
export interface EyeColor { color: string; glow: string; label: string; }
export interface CaptionData { who: 'bot'|'you'|'sys'; text: string; error?: boolean; }
export interface FaceProps { expression: Expression; mode: Mode; caption: CaptionData; bubbles: string[]; characterName: string; onRetry?: () => void; children?: ReactNode; }
export type PopoverId = 'expr'|'color'|'phrase'|'settings'|null;
export interface SidePanelProps { listening: boolean; micOn: boolean; micSupported: boolean; character: Character; expression: Expression; onMic: () => void; onGreet: () => void; onJoke: () => void; onStop: () => void; onOpen: (id: Exclude<PopoverId,null>) => void; onTheme: () => void; }
export interface PopoversProps { open: PopoverId; expression: Expression; eyeColor: string; onExpression: (e: Expression) => void; onColor: (c: EyeColor) => void; onPhrase: (p: string) => void; onClose: () => void; character: Character; onTheme: () => void; onPick: (id: 'expr'|'color'|'phrase') => void; }
export interface VoiceOptions { lang: string; onTranscript: (text: string, final: boolean) => void; onListeningChange: (on: boolean) => void; onError: (code: string) => void; }
export interface VoiceApi { supported: boolean; listening: boolean; speaking: boolean; start: () => void; stop: () => void; speak: (text: string, onEnd?: () => void) => void; cancelSpeech: () => void; }
