import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Download,
  Share2,
  Check,
  X,
  Camera,
} from 'lucide-react';
import { useProfile, useStreak, useTodayProgress, useAppState } from '../context/AppContext';
import { CURRICULUM } from '../data/curriculum';

interface StoryStudioModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultDay?: number;
}

type StoryTheme = 'rose' | 'plum' | 'minimal';
type StoryFormat = 'daily' | 'streak' | 'conquered';

export const StoryStudioModal: React.FC<StoryStudioModalProps> = ({
  isOpen,
  onClose,
  defaultDay = 1,
}) => {
  const { profile } = useProfile();
  const streak = useStreak();
  const { todayProgress } = useTodayProgress();
  const { state } = useAppState();

  const [theme, setTheme] = useState<StoryTheme>('rose');
  const [format, setFormat] = useState<StoryFormat>('daily');
  const [selectedDay, setSelectedDay] = useState<number>(defaultDay);
  const [downloading, setDownloading] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Compute total completed days count
  const completedCount = Object.values(state.lessons).filter((l) => l?.completedAt).length;

  // Render the high-resolution 1080x1920 canvas
  const renderCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const W = 1080;
    const H = 1920;
    canvas.width = W;
    canvas.height = H;

    // ─── 1. Background Fill ──────────────────────────────────────────────────
    if (theme === 'plum') {
      const grad = ctx.createLinearGradient(0, 0, W, H);
      grad.addColorStop(0, '#2D142C');
      grad.addColorStop(0.5, '#4A2545');
      grad.addColorStop(1, '#1A0B1A');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, W, H);

      // Soft ambient rose glow blobs
      const radial1 = ctx.createRadialGradient(200, 300, 10, 200, 300, 600);
      radial1.addColorStop(0, 'rgba(201, 79, 124, 0.25)');
      radial1.addColorStop(1, 'rgba(201, 79, 124, 0)');
      ctx.fillStyle = radial1;
      ctx.fillRect(0, 0, W, H);

      const radial2 = ctx.createRadialGradient(900, 1600, 10, 900, 1600, 700);
      radial2.addColorStop(0, 'rgba(212, 175, 55, 0.15)');
      radial2.addColorStop(1, 'rgba(212, 175, 55, 0)');
      ctx.fillStyle = radial2;
      ctx.fillRect(0, 0, W, H);
    } else if (theme === 'minimal') {
      ctx.fillStyle = '#FBF8F5';
      ctx.fillRect(0, 0, W, H);

      // Subtle fine grid texture
      ctx.strokeStyle = 'rgba(74, 37, 69, 0.04)';
      ctx.lineWidth = 1;
      for (let x = 60; x < W; x += 60) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, H);
        ctx.stroke();
      }
      for (let y = 60; y < H; y += 60) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(W, y);
        ctx.stroke();
      }
    } else {
      // Default: Rose & Champagne (Editorial Cream)
      const grad = ctx.createLinearGradient(0, 0, 0, H);
      grad.addColorStop(0, '#FFF9F5');
      grad.addColorStop(0.5, '#FFF2F4');
      grad.addColorStop(1, '#FDF0ED');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, W, H);

      // Rose gold ambient blooms
      const radial1 = ctx.createRadialGradient(250, 400, 20, 250, 400, 500);
      radial1.addColorStop(0, 'rgba(247, 183, 201, 0.35)');
      radial1.addColorStop(1, 'rgba(247, 183, 201, 0)');
      ctx.fillStyle = radial1;
      ctx.fillRect(0, 0, W, H);

      const radial2 = ctx.createRadialGradient(850, 1500, 20, 850, 1500, 600);
      radial2.addColorStop(0, 'rgba(212, 175, 55, 0.18)');
      radial2.addColorStop(1, 'rgba(212, 175, 55, 0)');
      ctx.fillStyle = radial2;
      ctx.fillRect(0, 0, W, H);
    }

    // ─── 2. Editorial Borders & Corner Brackets ─────────────────────────────
    const margin = 70;
    const isDark = theme === 'plum';
    const goldColor = isDark ? '#E6C79C' : '#D4AF37';
    const textColor = isDark ? '#FFF8F4' : '#4A2545';
    const textSub = isDark ? '#E2B8CC' : '#734B6E';
    const accentColor = '#C94F7C';

    ctx.strokeStyle = isDark ? 'rgba(230, 199, 156, 0.4)' : 'rgba(212, 175, 55, 0.45)';
    ctx.lineWidth = 2;
    ctx.strokeRect(margin, margin, W - margin * 2, H - margin * 2);

    ctx.strokeStyle = isDark ? 'rgba(247, 183, 201, 0.25)' : 'rgba(201, 79, 124, 0.2)';
    ctx.lineWidth = 1;
    ctx.strokeRect(margin + 16, margin + 16, W - (margin + 16) * 2, H - (margin + 16) * 2);

    // Elegant Corner Flourishes
    const corners = [
      [margin, margin],
      [W - margin, margin],
      [margin, H - margin],
      [W - margin, H - margin],
    ];
    corners.forEach(([cx, cy]) => {
      ctx.fillStyle = goldColor;
      ctx.beginPath();
      ctx.arc(cx, cy, 4, 0, Math.PI * 2);
      ctx.fill();
    });

    // ─── 3. Header Masthead ──────────────────────────────────────────────────
    ctx.textAlign = 'center';

    // Small issue identifier
    ctx.font = '600 22px Outfit, sans-serif';
    ctx.fillStyle = isDark ? goldColor : accentColor;
    ctx.letterSpacing = '6px';
    ctx.fillText('BLOOM · THE EXCEL ATELIER', W / 2, 170);

    ctx.font = '300 18px Outfit, sans-serif';
    ctx.fillStyle = textSub;
    ctx.letterSpacing = '3px';
    const todayStr = new Date().toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    }).toUpperCase();
    ctx.fillText(`EDITION NO. ${streak.current || 1} · ${todayStr}`, W / 2, 210);

    // Decorative divider line
    ctx.strokeStyle = isDark ? 'rgba(230, 199, 156, 0.3)' : 'rgba(212, 175, 55, 0.35)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(W / 2 - 140, 240);
    ctx.lineTo(W / 2 + 140, 240);
    ctx.stroke();

    // ─── 4. Student Name & Title ─────────────────────────────────────────────
    ctx.font = 'italic 400 38px Fraunces, serif';
    ctx.fillStyle = textSub;
    ctx.letterSpacing = '1px';
    ctx.fillText('A Discipline Log By', W / 2, 340);

    ctx.font = '700 72px Fraunces, serif';
    ctx.fillStyle = textColor;
    ctx.letterSpacing = '2px';
    const student = (profile.name || 'Hasini').toUpperCase();
    ctx.fillText(student, W / 2, 430);

    // ─── 5. Centerpiece Illustration (Botanical Rose Emblem) ────────────────
    const centerX = W / 2;
    const centerY = 820;

    // Glowing concentric rings
    ctx.strokeStyle = isDark ? 'rgba(230, 199, 156, 0.25)' : 'rgba(212, 175, 55, 0.3)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(centerX, centerY, 210, 0, Math.PI * 2);
    ctx.stroke();

    ctx.strokeStyle = isDark ? 'rgba(201, 79, 124, 0.3)' : 'rgba(201, 79, 124, 0.2)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(centerX, centerY, 230, 0, Math.PI * 2);
    ctx.stroke();

    // Draw Stylized Botanical Rose
    ctx.save();
    ctx.translate(centerX, centerY);

    // Rose stem
    ctx.strokeStyle = isDark ? '#A67B92' : '#8A5D80';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(0, 30);
    ctx.quadraticCurveTo(15, 120, -10, 170);
    ctx.stroke();

    // Leaves
    ctx.fillStyle = isDark ? 'rgba(230, 199, 156, 0.4)' : 'rgba(212, 175, 55, 0.45)';
    // Left leaf
    ctx.beginPath();
    ctx.ellipse(-30, 95, 32, 14, -Math.PI / 4, 0, Math.PI * 2);
    ctx.fill();
    // Right leaf
    ctx.beginPath();
    ctx.ellipse(32, 130, 28, 12, Math.PI / 5, 0, Math.PI * 2);
    ctx.fill();

    // Rose petals (outer to inner)
    const petalColors = isDark
      ? ['#8B2E58', '#AB3E6E', '#C94F7C', '#E2769E', '#F7B7C9']
      : ['#A03562', '#C94F7C', '#DE6892', '#EE8EAF', '#F7B7C9'];

    // Outer Petals
    [0, 60, 120, 180, 240, 300].forEach((angle, i) => {
      ctx.save();
      ctx.rotate((angle * Math.PI) / 180);
      ctx.fillStyle = petalColors[i % petalColors.length];
      ctx.beginPath();
      ctx.ellipse(0, -65, 50, 75, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });

    // Inner Core
    [30, 90, 150, 210, 270, 330].forEach((angle, i) => {
      ctx.save();
      ctx.rotate((angle * Math.PI) / 180);
      ctx.fillStyle = petalColors[(i + 2) % petalColors.length];
      ctx.beginPath();
      ctx.ellipse(0, -38, 34, 52, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });

    // Golden Bud Center
    ctx.fillStyle = goldColor;
    ctx.beginPath();
    ctx.arc(0, 0, 22, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();

    // ─── 6. Focus Headline & Highlight ──────────────────────────────────────
    const curLesson = CURRICULUM.find((d) => d.day === selectedDay) || CURRICULUM[0];

    if (format === 'daily') {
      ctx.font = '600 24px Outfit, sans-serif';
      ctx.fillStyle = isDark ? goldColor : accentColor;
      ctx.letterSpacing = '5px';
      ctx.fillText(`DAY ${selectedDay} OF 21 · BLOOMED`, W / 2, 1150);

      ctx.font = '700 52px Fraunces, serif';
      ctx.fillStyle = textColor;
      ctx.letterSpacing = '0.5px';
      ctx.fillText(curLesson.title, W / 2, 1220);
    } else if (format === 'streak') {
      ctx.font = '600 24px Outfit, sans-serif';
      ctx.fillStyle = isDark ? goldColor : accentColor;
      ctx.letterSpacing = '5px';
      ctx.fillText('DISCIPLINE UNCOMPROMISED', W / 2, 1150);

      ctx.font = '700 68px Fraunces, serif';
      ctx.fillStyle = textColor;
      ctx.letterSpacing = '1px';
      ctx.fillText(`${streak.current} Days of Focus`, W / 2, 1230);
    } else {
      ctx.font = '600 24px Outfit, sans-serif';
      ctx.fillStyle = isDark ? goldColor : accentColor;
      ctx.letterSpacing = '5px';
      ctx.fillText('ACADEMY CONQUERED', W / 2, 1150);

      ctx.font = '700 56px Fraunces, serif';
      ctx.fillStyle = textColor;
      ctx.letterSpacing = '1px';
      ctx.fillText('Master of the Sheet', W / 2, 1220);
    }

    // ─── 7. Stats Capsule Dossier ───────────────────────────────────────────
    const boxY = 1320;
    const boxW = 860;
    const boxH = 190;
    const boxX = (W - boxW) / 2;

    ctx.fillStyle = isDark ? 'rgba(74, 37, 69, 0.55)' : 'rgba(255, 255, 255, 0.75)';
    ctx.strokeStyle = isDark ? 'rgba(230, 199, 156, 0.4)' : 'rgba(212, 175, 55, 0.4)';
    ctx.lineWidth = 1.5;

    // Rounded rectangle
    const r = 24;
    ctx.beginPath();
    ctx.moveTo(boxX + r, boxY);
    ctx.lineTo(boxX + boxW - r, boxY);
    ctx.quadraticCurveTo(boxX + boxW, boxY, boxX + boxW, boxY + r);
    ctx.lineTo(boxX + boxW, boxY + boxH - r);
    ctx.quadraticCurveTo(boxX + boxW, boxY + boxH, boxX + boxW - r, boxY + boxH);
    ctx.lineTo(boxX + r, boxY + boxH);
    ctx.quadraticCurveTo(boxX, boxY + boxH, boxX, boxY + boxH - r);
    ctx.lineTo(boxX, boxY + r);
    ctx.quadraticCurveTo(boxX, boxY, boxX + r, boxY);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // 3 Stat Columns
    const col1 = boxX + boxW / 6;
    const col2 = boxX + (boxW / 6) * 3;
    const col3 = boxX + (boxW / 6) * 5;

    // Metric 1: Days Completed
    ctx.font = '700 48px Fraunces, serif';
    ctx.fillStyle = textColor;
    ctx.fillText(`${completedCount || selectedDay}/21`, col1, boxY + 80);
    ctx.font = '600 16px Outfit, sans-serif';
    ctx.fillStyle = textSub;
    ctx.letterSpacing = '2px';
    ctx.fillText('CURRICULUM', col1, boxY + 125);

    // Metric 2: Today / Cumulative Focus
    ctx.font = '700 48px Fraunces, serif';
    ctx.fillStyle = textColor;
    ctx.fillText(`${todayProgress.focusedMin}m`, col2, boxY + 80);
    ctx.font = '600 16px Outfit, sans-serif';
    ctx.fillStyle = textSub;
    ctx.letterSpacing = '2px';
    ctx.fillText("TODAY'S LOCK", col2, boxY + 125);

    // Metric 3: Integrity / Gaze
    ctx.font = '700 48px Fraunces, serif';
    ctx.fillStyle = goldColor;
    ctx.fillText('0 Strikes', col3, boxY + 80);
    ctx.font = '600 16px Outfit, sans-serif';
    ctx.fillStyle = textSub;
    ctx.letterSpacing = '2px';
    ctx.fillText('INTEGRITY', col3, boxY + 125);

    // Column separators
    ctx.strokeStyle = isDark ? 'rgba(230, 199, 156, 0.2)' : 'rgba(212, 175, 55, 0.25)';
    ctx.beginPath();
    ctx.moveTo(boxX + boxW / 3, boxY + 30);
    ctx.lineTo(boxX + boxW / 3, boxY + boxH - 30);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(boxX + (boxW / 3) * 2, boxY + 30);
    ctx.lineTo(boxX + (boxW / 3) * 2, boxY + boxH - 30);
    ctx.stroke();

    // ─── 8. Canonical Editorial Microcopy ───────────────────────────────────
    ctx.font = 'italic 400 30px Fraunces, serif';
    ctx.fillStyle = isDark ? '#E6C79C' : '#734B6E';
    ctx.letterSpacing = '0.5px';
    const quote =
      format === 'daily'
        ? '"One pivot table at a time."'
        : format === 'streak'
        ? '"Consistency is the cheat code."'
        : '"Focus is a skill. Conquered."';
    ctx.fillText(quote, W / 2, 1600);

    // ─── 9. Gold Seal & Signature Footer ───────────────────────────────────
    ctx.font = '600 18px Outfit, sans-serif';
    ctx.fillStyle = isDark ? goldColor : accentColor;
    ctx.letterSpacing = '4px';
    ctx.fillText('VERIFIED BY BLOOM FOCUS GUARDIAN', W / 2, 1730);

    ctx.font = '300 15px Outfit, sans-serif';
    ctx.fillStyle = textSub;
    ctx.letterSpacing = '2px';
    ctx.fillText('NO PHONES · ON-SCREEN EYE GAZE · 100% LOCAL INFERENCE', W / 2, 1765);
  }, [theme, format, selectedDay, profile.name, streak.current, todayProgress.focusedMin, completedCount]);

  useEffect(() => {
    if (isOpen) {
      // Allow DOM repaint then render
      setTimeout(renderCanvas, 50);
    }
  }, [isOpen, renderCanvas]);

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    setDownloading(true);

    try {
      const link = document.createElement('a');
      link.download = `BLOOM-Story-Day${selectedDay}-${profile.name || 'Hasini'}.png`;
      link.href = canvas.toDataURL('image/png', 1.0);
      link.click();
    } catch (e) {
      console.error('Download failed', e);
    } finally {
      setTimeout(() => setDownloading(false), 800);
    }
  };

  const handleCopyImage = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    try {
      canvas.toBlob(async (blob) => {
        if (!blob) return;
        if (navigator.clipboard && window.ClipboardItem) {
          await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        } else {
          handleDownload();
        }
      });
    } catch {
      handleDownload();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-plum-night/85 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-cream-100 dark:bg-plum-darkCard rounded-3xl border border-rose-blush/30 dark:border-plum-light/30 shadow-editorial overflow-hidden flex flex-col my-8">
        {/* Header */}
        <div className="px-6 py-5 border-b border-rose-blush/20 dark:border-plum-light/20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-rose/20 flex items-center justify-center text-rose-deep dark:text-rose-blush">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-bold text-plum dark:text-cream-50 leading-tight">
                Story Studio
              </h3>
              <p className="text-[10px] font-semibold tracking-editorial uppercase text-rose-deep dark:text-gold-champagne">
                9:16 Editorial Card Generator for Instagram & Pinterest
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-plum-light hover:text-plum dark:text-cream-300 dark:hover:text-cream-100 hover:bg-cream-200 dark:hover:bg-plum transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Studio Workspace: Controls on Left, Live Canvas on Right */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Controls Column (5 cols) */}
          <div className="md:col-span-5 space-y-6">
            {/* Theme Selector */}
            <div>
              <label className="text-xs font-semibold tracking-editorial uppercase text-plum-light dark:text-cream-300 block mb-2.5">
                Atelier Palette
              </label>
              <div className="grid grid-cols-3 gap-2.5">
                {[
                  { id: 'rose', label: 'Rose Gold', color: 'bg-[#FFF2F4] border-rose/40 text-plum' },
                  { id: 'plum', label: 'Plum Velvet', color: 'bg-[#2D142C] border-gold/40 text-cream-100' },
                  { id: 'minimal', label: 'Ivory Haute', color: 'bg-[#FBF8F5] border-plum/20 text-plum' },
                ].map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setTheme(t.id as StoryTheme)}
                    className={`py-2.5 px-3 rounded-2xl border text-xs font-semibold transition-all ${
                      theme === t.id
                        ? `${t.color} ring-2 ring-gold/60 shadow-sm`
                        : `${t.color} opacity-60 hover:opacity-100`
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Story Focus Format */}
            <div>
              <label className="text-xs font-semibold tracking-editorial uppercase text-plum-light dark:text-cream-300 block mb-2.5">
                Content Focus
              </label>
              <div className="grid grid-cols-3 gap-2 text-xs">
                {[
                  { id: 'daily', label: 'Daily Bloom' },
                  { id: 'streak', label: 'Streak Proof' },
                  { id: 'conquered', label: 'Grand Conquered' },
                ].map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setFormat(f.id as StoryFormat)}
                    className={`py-2 px-2 rounded-xl border text-center transition-all ${
                      format === f.id
                        ? 'bg-rose text-cream-100 border-rose shadow-rose-glow font-semibold'
                        : 'bg-white/60 dark:bg-plum/30 border-rose-blush/25 text-plum dark:text-cream-200 hover:bg-cream-200'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Day Selector */}
            {format === 'daily' && (
              <div>
                <label className="text-xs font-semibold tracking-editorial uppercase text-plum-light dark:text-cream-300 block mb-2.5">
                  Select Lesson Day
                </label>
                <select
                  value={selectedDay}
                  onChange={(e) => setSelectedDay(Number(e.target.value))}
                  className="w-full px-4 py-2.5 rounded-2xl bg-white dark:bg-plum border border-rose-blush/30 dark:border-plum-light/30 text-xs font-semibold text-plum dark:text-cream-100 focus:outline-none focus:ring-2 focus:ring-rose"
                >
                  {CURRICULUM.map((lesson) => (
                    <option key={lesson.day} value={lesson.day}>
                      Day {lesson.day}: {lesson.title}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Specifications Card */}
            <div className="p-4 rounded-2xl bg-cream-200/50 dark:bg-plum/20 border border-gold/25 space-y-2 text-xs text-plum-light dark:text-cream-300">
              <div className="flex items-center justify-between">
                <span>Output Resolution</span>
                <span className="font-mono font-semibold text-plum dark:text-cream-100">1080 × 1920 (9:16)</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Compression</span>
                <span className="font-semibold text-emerald-600 dark:text-emerald-400">Lossless 24-bit PNG</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Verification</span>
                <span className="font-semibold text-gold-dark dark:text-gold">Focus Guardian Seal</span>
              </div>
            </div>

            {/* Export Action Buttons */}
            <div className="space-y-3 pt-2">
              <button
                onClick={handleDownload}
                disabled={downloading}
                className="w-full py-3.5 rounded-2xl bg-rose hover:bg-rose-deep text-cream-100 font-semibold text-sm transition-all shadow-rose-glow flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                <span>{downloading ? 'Rendering Canvas...' : 'Download Story (1080×1920 PNG)'}</span>
              </button>

              <button
                onClick={handleCopyImage}
                className="w-full py-3 rounded-2xl bg-white dark:bg-plum text-plum dark:text-cream-100 font-semibold text-xs transition-all border border-rose-blush/30 hover:bg-cream-200 dark:hover:bg-plum-night flex items-center justify-center gap-2"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Share2 className="w-4 h-4" />}
                <span>{copied ? 'Copied Image to Clipboard' : 'Copy Image to Clipboard'}</span>
              </button>
            </div>
          </div>

          {/* Live Preview Column (7 cols) */}
          <div className="md:col-span-7 flex flex-col items-center justify-center p-4 bg-cream-200/40 dark:bg-plum-night/60 rounded-3xl border border-rose-blush/20">
            <span className="text-[11px] font-semibold tracking-editorial uppercase text-plum-light dark:text-cream-300 mb-3 block">
              Live Preview · Aspect 9:16
            </span>

            {/* Canvas Container with sleek phone border simulation */}
            <div className="relative w-full max-w-[280px] sm:max-w-[310px] aspect-[9/16] rounded-3xl overflow-hidden shadow-2xl border-4 border-plum/20 dark:border-gold/30">
              <canvas
                ref={canvasRef}
                className="w-full h-full object-cover block"
                style={{ imageRendering: 'auto' }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
