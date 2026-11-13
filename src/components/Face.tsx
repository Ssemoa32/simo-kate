import type { ReactElement } from 'react';
import { AlertCircle } from 'lucide-react';
import type { Expression, FaceProps } from '../types';

const EXPRESSION_LABELS: Record<Expression, string> = {
  neutral: 'محايد',
  happy: 'سعيد',
  sad: 'حزين',
  surprised: 'متفاجئ',
  love: 'يحب',
  sleepy: 'نعسان',
  wink: 'يغمز',
  shy: 'خجول',
  angry: 'غاضب',
};

const HIGHLIGHT = 'rgba(255,255,255,0.85)';
const EYE = 'var(--eye-color)';

function Stroke({ d, width }: { d: string; width: number }) {
  return <path d={d} stroke={EYE} strokeWidth={width} fill="none" strokeLinecap="round" />;
}

function eyesFor(expression: Expression): { left: ReactElement; right: ReactElement } {
  switch (expression) {
    case 'happy':
      return {
        left: <Stroke d="M30,60 Q55,25 80,60" width={14} />,
        right: <Stroke d="M120,60 Q145,25 170,60" width={14} />,
      };
    case 'sad':
      return {
        left: <Stroke d="M30,45 Q55,75 80,45" width={14} />,
        right: <Stroke d="M120,45 Q145,75 170,45" width={14} />,
      };
    case 'surprised':
      return {
        left: (
          <>
            <circle cx="55" cy="55" r="22" fill={EYE} />
            <circle cx="60" cy="48" r="5" fill={HIGHLIGHT} />
          </>
        ),
        right: (
          <>
            <circle cx="145" cy="55" r="22" fill={EYE} />
            <circle cx="150" cy="48" r="5" fill={HIGHLIGHT} />
          </>
        ),
      };
    case 'love':
      return {
        left: <path d="M55,70 C30,50 35,25 55,35 C75,25 80,50 55,70 Z" fill="#ff4d6d" />,
        right: <path d="M145,70 C120,50 125,25 145,35 C165,25 170,50 145,70 Z" fill="#ff4d6d" />,
      };
    case 'sleepy':
      return {
        left: <Stroke d="M30,55 Q55,55 80,55" width={10} />,
        right: <Stroke d="M120,55 Q145,55 170,55" width={10} />,
      };
    case 'wink':
      return {
        left: (
          <>
            <ellipse cx="55" cy="55" rx="28" ry="34" fill={EYE} />
            <circle cx="62" cy="44" r="6" fill={HIGHLIGHT} />
          </>
        ),
        right: <Stroke d="M120,55 Q145,55 170,55" width={12} />,
      };
    case 'shy':
      return {
        left: (
          <>
            <ellipse cx="55" cy="58" rx="24" ry="20" fill={EYE} />
            <circle cx="60" cy="52" r="5" fill="rgba(255,255,255,0.8)" />
          </>
        ),
        right: (
          <>
            <ellipse cx="145" cy="58" rx="24" ry="20" fill={EYE} />
            <circle cx="150" cy="52" r="5" fill="rgba(255,255,255,0.8)" />
          </>
        ),
      };
    case 'angry':
      return {
        left: (
          <>
            <path d="M28,40 L82,55" stroke={EYE} strokeWidth={10} strokeLinecap="round" />
            <ellipse cx="55" cy="62" rx="18" ry="14" fill={EYE} />
          </>
        ),
        right: (
          <>
            <path d="M172,40 L118,55" stroke={EYE} strokeWidth={10} strokeLinecap="round" />
            <ellipse cx="145" cy="62" rx="18" ry="14" fill={EYE} />
          </>
        ),
      };
    case 'neutral':
    default:
      return {
        left: (
          <>
            <ellipse cx="55" cy="55" rx="28" ry="34" fill={EYE} />
            <circle cx="62" cy="44" r="6" fill={HIGHLIGHT} />
          </>
        ),
        right: (
          <>
            <ellipse cx="145" cy="55" rx="28" ry="34" fill={EYE} />
            <circle cx="152" cy="44" r="6" fill={HIGHLIGHT} />
          </>
        ),
      };
  }
}

const FACE_CSS = `
.face-head-shine{position:absolute;top:14%;left:50%;transform:translateX(-50%);width:42%;height:9%;background:linear-gradient(90deg,transparent,rgba(255,255,255,.28),transparent);border-radius:50%;filter:blur(3px);pointer-events:none}
.face-screen{width:76%;height:64%;background:#03040a;border-radius:30%;position:relative;overflow:hidden;direction:ltr;container-type:size;box-shadow:inset 0 0 22px rgba(0,0,0,.95),0 0 2px rgba(255,255,255,.08),0 0 0 1px rgba(33,230,255,.12)}
.face-shine{position:absolute;top:0;left:0;right:0;height:38%;background:linear-gradient(180deg,rgba(255,255,255,.09),transparent);border-radius:30% 30% 50% 50%;pointer-events:none}
.face-svg{position:absolute;top:24%;left:50%;transform:translateX(-50%);width:82%;height:52%;overflow:visible}
.face-eyes{filter:drop-shadow(0 0 6px var(--eye-glow))}
.face-eye{transform-box:fill-box;transform-origin:center;animation:faceBlink 5s infinite}
.face-eye.r{animation-delay:.04s}
.face-thinking .face-eyes{animation:faceGlance 1.8s infinite ease-in-out}
.face-mouth{position:absolute;bottom:17%;left:50%;transform:translateX(-50%);width:13%;height:4px;height:2.1cqh;background:var(--eye-color);border-radius:4px;box-shadow:0 0 10px var(--eye-glow);transition:all .12s ease}
.face-speaking .face-mouth{animation:faceTalk .16s infinite alternate ease-in-out}
.expr-happy .face-mouth,.expr-love .face-mouth{width:22%;height:9px;height:4.7cqh;border-radius:0 0 50% 50%;animation:none}
.expr-wink .face-mouth,.expr-shy .face-mouth{width:16%;height:7px;height:3.6cqh;border-radius:0 0 50% 50%;animation:none}
.expr-sad .face-mouth{width:18%;height:8px;height:4.2cqh;border-radius:50% 50% 0 0;animation:none}
.expr-surprised .face-mouth{width:9%;height:12px;height:6.3cqh;border-radius:50%;animation:none}
.expr-sleepy .face-mouth{width:14%;height:3px;height:1.6cqh;opacity:.6;animation:none}
.expr-angry .face-mouth{width:15%;height:4px;height:2.1cqh;animation:none}
.face-cheek{position:absolute;bottom:29%;width:14%;height:7%;background:var(--cheek);border-radius:50%;filter:blur(3px);opacity:0;transition:opacity .4s}
.face-cheek.l{left:13%}.face-cheek.r{right:13%}
.expr-happy .face-cheek,.expr-love .face-cheek,.expr-shy .face-cheek,.expr-wink .face-cheek{opacity:.9}
.expr-love .face-cheek{background:rgba(255,77,109,.45)}
.face-mood{display:block;font-family:var(--font-label);font-size:var(--text-xs);letter-spacing:.12em;text-transform:uppercase;color:var(--eye-color);animation:faceMood .2s ease-out both}
.caption-row{display:flex;align-items:center;justify-content:center;flex-wrap:wrap;gap:var(--space-2)}
.face-caption-line{margin:0}
.face-caption-who{font-weight:700}
.face-caption-who.bot{color:var(--eye-color)}
.face-caption-who.you{color:var(--warning)}
.face-caption-text{overflow-wrap:anywhere}
.caption-retry{color:var(--accent-2);padding:0 var(--space-3)}
@keyframes faceBlink{0%,94%,100%{transform:scaleY(1)}97%{transform:scaleY(.08)}}
@keyframes faceGlance{0%,100%{transform:translateX(-6px)}50%{transform:translateX(6px)}}
@keyframes faceTalk{0%{height:2.1cqh;width:13%;border-radius:4px}100%{height:6.8cqh;width:10%;border-radius:50%}}
@keyframes faceMood{from{opacity:0;transform:translateY(4px)}to{opacity:1;transform:none}}
@media(prefers-reduced-motion:reduce){.face-eye,.face-eyes,.face-mouth,.face-mood{animation:none!important}}
`;

export default function Face(props: FaceProps): ReactElement {
  const { expression, mode, caption, bubbles, characterName, onRetry } = props;
  const eyes = eyesFor(expression);

  const stageClass = [
    'stage',
    expression !== 'neutral' ? `expr-${expression}` : '',
    mode === 'speaking' ? 'face-speaking' : '',
    mode === 'thinking' ? 'face-thinking' : '',
  ]
    .filter(Boolean)
    .join(' ');

  const ringClass = mode === 'idle' ? 'ring' : `ring ${mode}`;

  const who =
    caption.who === 'bot' ? `${characterName}:` : caption.who === 'you' ? 'أنت:' : '';

  const mood = bubbles[0];
  const isError = Boolean(caption.error);

  return (
    <div className={stageClass}>
      <style>{FACE_CSS}</style>
      <div className="face-frame">
        <div className={ringClass} aria-hidden="true" />
        <div
          className="head"
          role="img"
          aria-label={`${characterName} — ${EXPRESSION_LABELS[expression]}`}
        >
          <div className="face-head-shine" aria-hidden="true" />
          <div className="face-screen">
            <div className="face-shine" aria-hidden="true" />
            <svg className="face-svg" viewBox="0 0 200 110" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
              <g className="face-eyes">
                <g className="face-eye l" key={`l-${expression}`}>{eyes.left}</g>
                <g className="face-eye r" key={`r-${expression}`}>{eyes.right}</g>
              </g>
            </svg>
            <div className="face-cheek l" aria-hidden="true" />
            <div className="face-cheek r" aria-hidden="true" />
            <div className="face-mouth" aria-hidden="true" />
          </div>
        </div>
      </div>

      <div
        className={isError ? 'caption is-error' : 'caption'}
        role={isError ? 'alert' : 'status'}
        aria-live={isError ? 'assertive' : 'polite'}
      >
        {mood && (
          <span className="face-mood" key={`${expression}-${mood}`}>
            {mood}
          </span>
        )}
        <div className="caption-row">
          {isError && (
            <AlertCircle size={20} strokeWidth={2} style={{ color: 'var(--danger)', flexShrink: 0 }} aria-hidden="true" />
          )}
          <p className="face-caption-line">
            {who && <span className={`face-caption-who ${caption.who}`}>{who} </span>}
            <span className="face-caption-text">{caption.text}</span>
          </p>
          {isError && onRetry && (
            <button type="button" className="btn btn-tertiary caption-retry" onClick={onRetry}>
              إعادة المحاولة
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
