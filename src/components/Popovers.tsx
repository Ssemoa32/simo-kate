import { useEffect } from 'react';
import type { ReactNode } from 'react';
import type { Expression, PopoversProps } from '../types';
import { COLORS, PHRASES } from '../content';

const EXPRESSIONS: { id: Expression; label: string }[] = [
  { id: 'neutral', label: 'عادي' },
  { id: 'happy', label: 'سعيد' },
  { id: 'sad', label: 'حزين' },
  { id: 'surprised', label: 'متفاجئ' },
  { id: 'love', label: 'حب' },
  { id: 'sleepy', label: 'نعسان' },
  { id: 'wink', label: 'غمزة' },
  { id: 'shy', label: 'خجول' },
  { id: 'angry', label: 'غاضب' },
];

const dot = (cx: number, cy: number, r: number): ReactNode => (
  <circle cx={cx} cy={cy} r={r} fill="rgba(255,255,255,0.7)" />
);

const stroke = (d: string, w = 14): ReactNode => (
  <path d={d} stroke="currentColor" strokeWidth={w} fill="none" strokeLinecap="round" />
);

function eyes(id: Expression): ReactNode {
  switch (id) {
    case 'neutral':
      return (
        <>
          <ellipse cx="55" cy="55" rx="28" ry="34" fill="currentColor" />
          <ellipse cx="145" cy="55" rx="28" ry="34" fill="currentColor" />
          {dot(62, 44, 6)}
          {dot(152, 44, 6)}
        </>
      );
    case 'happy':
      return (
        <>
          {stroke('M30,70 Q55,30 80,70')}
          {stroke('M120,70 Q145,30 170,70')}
        </>
      );
    case 'sad':
      return (
        <>
          {stroke('M30,45 Q55,80 80,45')}
          {stroke('M120,45 Q145,80 170,45')}
        </>
      );
    case 'surprised':
      return (
        <>
          <circle cx="55" cy="55" r="26" fill="currentColor" />
          <circle cx="145" cy="55" r="26" fill="currentColor" />
          {dot(60, 48, 5)}
          {dot(150, 48, 5)}
        </>
      );
    case 'love':
      return (
        <>
          <path d="M55,85 C20,58 28,22 55,36 C82,22 90,58 55,85 Z" fill="var(--accent)" />
          <path d="M145,85 C110,58 118,22 145,36 C172,22 180,58 145,85 Z" fill="var(--accent)" />
        </>
      );
    case 'sleepy':
      return (
        <>
          {stroke('M30,58 Q55,64 80,58', 10)}
          {stroke('M120,58 Q145,64 170,58', 10)}
        </>
      );
    case 'wink':
      return (
        <>
          <ellipse cx="55" cy="55" rx="28" ry="34" fill="currentColor" />
          {dot(62, 44, 6)}
          {stroke('M120,58 Q145,64 170,58', 12)}
        </>
      );
    case 'shy':
      return (
        <>
          <ellipse cx="55" cy="62" rx="26" ry="22" fill="currentColor" />
          <ellipse cx="145" cy="62" rx="26" ry="22" fill="currentColor" />
          {dot(60, 55, 5)}
          {dot(150, 55, 5)}
        </>
      );
    case 'angry':
      return (
        <>
          {stroke('M26,34 L84,56', 10)}
          {stroke('M174,34 L116,56', 10)}
          <ellipse cx="55" cy="72" rx="20" ry="16" fill="currentColor" />
          <ellipse cx="145" cy="72" rx="20" ry="16" fill="currentColor" />
        </>
      );
  }
}

function MiniFace({ id }: { id: Expression }) {
  return (
    <svg width="28" height="20" viewBox="0 0 200 110" aria-hidden="true" focusable="false">
      {eyes(id)}
    </svg>
  );
}

export default function Popovers(props: PopoversProps) {
  const { open, expression, eyeColor, onExpression, onColor, onPhrase, onClose } = props;

  useEffect(() => {
    if (!open) return;
    const onKey = (ev: KeyboardEvent) => {
      if (ev.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return <></>;

  return (
    <>
      <button
        type="button"
        className="backdrop"
        aria-label="إغلاق"
        tabIndex={-1}
        onClick={onClose}
        style={{ background: 'transparent', border: 'none', cursor: 'default' }}
      />

      {open === 'expr' && (
        <div className="popover" role="dialog" aria-label="اختر تعبير">
          <h2 className="label">اختر تعبير</h2>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 44px)',
              gap: 'var(--space-2)',
              justifyContent: 'center',
            }}
          >
            {EXPRESSIONS.map((x) => (
              <button
                key={x.id}
                type="button"
                className="icon-btn"
                aria-label={x.label}
                title={x.label}
                aria-pressed={expression === x.id}
                onClick={() => onExpression(x.id)}
              >
                <MiniFace id={x.id} />
              </button>
            ))}
          </div>
        </div>
      )}

      {open === 'color' && (
        <div className="popover" role="dialog" aria-label="لون العيون">
          <h2 className="label">لون العيون</h2>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 44px)',
              gap: 'var(--space-3)',
              justifyContent: 'center',
            }}
          >
            {COLORS.map((c) => {
              const active = c.color.toLowerCase() === eyeColor.toLowerCase();
              return (
                <button
                  key={c.color}
                  type="button"
                  aria-label={c.label}
                  title={c.label}
                  aria-pressed={active}
                  onClick={() => onColor(c)}
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: '50%',
                    cursor: 'pointer',
                    background: c.color,
                    border: active ? '3px solid var(--ink)' : '2px solid var(--line)',
                    boxShadow: `0 0 14px ${c.glow}`,
                    transform: active ? 'scale(1.1)' : 'none',
                    transition: 'transform var(--dur-fast), border-color var(--dur-fast)',
                  }}
                />
              );
            })}
          </div>
        </div>
      )}

      {open === 'phrase' && (
        <div className="popover" role="dialog" aria-label="جمل جاهزة">
          <h2 className="label">جمل جاهزة</h2>
          {PHRASES.map((p) => (
            <button key={p} type="button" className="list-row" onClick={() => onPhrase(p)}>
              {p}
            </button>
          ))}
        </div>
      )}
    </>
  );
}
