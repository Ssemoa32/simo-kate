import { Fragment } from 'react';
import type { ReactNode } from 'react';
import { Mic, MicOff, Hand, Laugh, Square, Smile, Palette, Snowflake, Flower2, MessageCircle } from 'lucide-react';
import type { SidePanelProps } from '../types';

interface RailItem {
  id: string;
  label: string;
  icon: ReactNode;
  onClick: () => void;
  className?: string;
  pressed?: boolean;
  disabled?: boolean;
  divideAfter?: boolean;
}

const ICON_SIZE = 20;
const ICON_STROKE = 2;
const iconStyle = { filter: 'drop-shadow(0 0 4px currentColor)' } as const;

export default function SidePanel(props: SidePanelProps) {
  const {
    listening, micOn, micSupported, character,
    onMic, onGreet, onJoke, onStop, onOpen, onTheme,
  } = props;

  const micClass = listening ? 'mic recording' : 'mic';
  const micLabel = !micSupported
    ? 'المايك غير مدعوم في هذا المتصفح'
    : listening
      ? 'إيقاف الاستماع'
      : 'استماع';

  const items: RailItem[] = [
    {
      id: 'mic',
      label: micLabel,
      icon: micSupported
        ? <Mic size={ICON_SIZE} strokeWidth={ICON_STROKE} style={iconStyle} aria-hidden="true" />
        : <MicOff size={ICON_SIZE} strokeWidth={ICON_STROKE} aria-hidden="true" />,
      onClick: onMic,
      className: micClass,
      pressed: micOn,
      disabled: !micSupported,
    },
    {
      id: 'greet',
      label: 'رحّب',
      icon: <Hand size={ICON_SIZE} strokeWidth={ICON_STROKE} style={iconStyle} aria-hidden="true" />,
      onClick: onGreet,
    },
    {
      id: 'joke',
      label: 'نكتة',
      icon: <Laugh size={ICON_SIZE} strokeWidth={ICON_STROKE} style={iconStyle} aria-hidden="true" />,
      onClick: onJoke,
    },
    {
      id: 'stop',
      label: 'إيقاف',
      icon: <Square size={ICON_SIZE} strokeWidth={ICON_STROKE} style={iconStyle} aria-hidden="true" />,
      onClick: onStop,
      divideAfter: true,
    },
    {
      id: 'expr',
      label: 'تعبيرات',
      icon: <Smile size={ICON_SIZE} strokeWidth={ICON_STROKE} style={iconStyle} aria-hidden="true" />,
      onClick: () => onOpen('expr'),
    },
    {
      id: 'color',
      label: 'ألوان',
      icon: <Palette size={ICON_SIZE} strokeWidth={ICON_STROKE} style={iconStyle} aria-hidden="true" />,
      onClick: () => onOpen('color'),
    },
    {
      id: 'theme',
      label: character === 'simo' ? 'ثيم: كاتي الوردية' : 'ثيم: سيمو الأسود',
      icon: character === 'simo'
        ? <Snowflake size={ICON_SIZE} strokeWidth={ICON_STROKE} style={iconStyle} aria-hidden="true" />
        : <Flower2 size={ICON_SIZE} strokeWidth={ICON_STROKE} style={iconStyle} aria-hidden="true" />,
      onClick: onTheme,
      divideAfter: true,
    },
    {
      id: 'phrase',
      label: 'جمل جاهزة',
      icon: <MessageCircle size={ICON_SIZE} strokeWidth={ICON_STROKE} style={iconStyle} aria-hidden="true" />,
      onClick: () => onOpen('phrase'),
    },
  ];

  return (
    <nav className="side-panel" role="toolbar" aria-label="أدوات الشخصية" aria-orientation="vertical">
      {items.map((it) => (
        <Fragment key={it.id}>
          <button
            type="button"
            className={`icon-btn${it.className ? ' ' + it.className : ''}`}
            aria-label={it.label}
            aria-pressed={it.pressed}
            disabled={it.disabled}
            onClick={it.onClick}
          >
            {it.icon}
            <span className="tooltip" aria-hidden="true">{it.label}</span>
          </button>
          {it.divideAfter && (
            <div role="separator" className="rail-sep" />
          )}
        </Fragment>
      ))}
    </nav>
  );
}
