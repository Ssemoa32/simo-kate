import { Fragment } from 'react';
import type { ReactNode } from 'react';
import { Mic, MicOff, Hand, Laugh, Square, Settings } from 'lucide-react';
import type { SidePanelProps } from '../types';

interface RailItem {
  id: string;
  label: string;
  text: string;
  icon: ReactNode;
  onClick: () => void;
  className?: string;
  pressed?: boolean;
  disabled?: boolean;
  divideAfter?: boolean;
}

const ICON_SIZE = 20;
const ICON_STROKE = 2;

export default function SidePanel(props: SidePanelProps) {
  const { listening, micOn, micSupported, onMic, onGreet, onJoke, onStop, onOpen } = props;

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
      text: 'مايك',
      icon: micSupported
        ? <Mic size={ICON_SIZE} strokeWidth={ICON_STROKE} aria-hidden="true" />
        : <MicOff size={ICON_SIZE} strokeWidth={ICON_STROKE} aria-hidden="true" />,
      onClick: onMic,
      className: micClass,
      pressed: micOn,
      disabled: !micSupported,
    },
    {
      id: 'greet',
      label: 'رحّب',
      text: 'رحّب',
      icon: <Hand size={ICON_SIZE} strokeWidth={ICON_STROKE} aria-hidden="true" />,
      onClick: onGreet,
    },
    {
      id: 'joke',
      label: 'نكتة',
      text: 'نكتة',
      icon: <Laugh size={ICON_SIZE} strokeWidth={ICON_STROKE} aria-hidden="true" />,
      onClick: onJoke,
    },
    {
      id: 'stop',
      label: 'إيقاف',
      text: 'إيقاف',
      icon: <Square size={ICON_SIZE} strokeWidth={ICON_STROKE} aria-hidden="true" />,
      onClick: onStop,
      divideAfter: true,
    },
    {
      id: 'settings',
      label: 'الإعدادات',
      text: 'الإعدادات',
      icon: <Settings size={ICON_SIZE} strokeWidth={ICON_STROKE} aria-hidden="true" />,
      onClick: () => onOpen('settings'),
      className: 'settings-btn',
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
            <span className="btn-label">{it.text}</span>
          </button>
          {it.divideAfter && <div role="separator" className="rail-sep" />}
        </Fragment>
      ))}
    </nav>
  );
}
