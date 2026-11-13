import React, { useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, Award, X } from 'lucide-react';

interface CertificateModalProps {
  studentName: string;
  completionDate?: string;
  onClose: () => void;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({
  studentName,
  completionDate,
  onClose,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const formattedDate =
    completionDate ||
    new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

  const displayName = studentName.trim() || 'Excel Scholar';

  const renderCertificate = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // High resolution: 2400 x 1600 (3:2 ratio)
    const width = 2400;
    const height = 1600;
    canvas.width = width;
    canvas.height = height;

    // 1. Background: Luxury Cream
    ctx.fillStyle = '#FFF8F4';
    ctx.fillRect(0, 0, width, height);

    // Subtle soft radial glow behind seal
    const radial = ctx.createRadialGradient(width / 2, height / 2, 100, width / 2, height / 2, 800);
    radial.addColorStop(0, 'rgba(247, 183, 201, 0.2)');
    radial.addColorStop(1, 'rgba(255, 248, 244, 0)');
    ctx.fillStyle = radial;
    ctx.fillRect(0, 0, width, height);

    // 2. Outer Dual Gold Borders
    ctx.strokeStyle = '#D4AF37';
    ctx.lineWidth = 14;
    ctx.strokeRect(60, 60, width - 120, height - 120);

    ctx.strokeStyle = 'rgba(201, 79, 124, 0.4)';
    ctx.lineWidth = 3;
    ctx.strokeRect(86, 86, width - 172, height - 172);

    ctx.strokeStyle = '#D4AF37';
    ctx.lineWidth = 2;
    ctx.strokeRect(100, 100, width - 200, height - 200);

    // Corner Ornaments
    const drawCorner = (x: number, y: number, angle: number) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(angle);
      ctx.fillStyle = '#D4AF37';
      ctx.beginPath();
      ctx.arc(0, 0, 10, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(10, 0);
      ctx.lineTo(40, 0);
      ctx.lineWidth = 3;
      ctx.strokeStyle = '#D4AF37';
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, 10);
      ctx.lineTo(0, 40);
      ctx.stroke();
      ctx.restore();
    };

    drawCorner(110, 110, 0);
    drawCorner(width - 110, 110, Math.PI / 2);
    drawCorner(width - 110, height - 110, Math.PI);
    drawCorner(110, height - 110, -Math.PI / 2);

    // 3. Institution Header
    ctx.fillStyle = '#C94F7C';
    ctx.font = '600 28px sans-serif';
    ctx.textAlign = 'center';
    ctx.letterSpacing = '10px';
    ctx.fillText('BLOOM ACADEMY OF EXCELLENCE', width / 2, 220);

    // Subtitle
    ctx.fillStyle = '#72426C';
    ctx.font = '300 24px sans-serif';
    ctx.letterSpacing = '6px';
    ctx.fillText('THE 21-DAY ADVANCED SPREADSHEET MASTERY PROGRAM', width / 2, 270);

    // Thin hairline
    ctx.strokeStyle = '#E6C79C';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(width / 2 - 300, 310);
    ctx.lineTo(width / 2 + 300, 310);
    ctx.stroke();

    // 4. Main Title
    ctx.fillStyle = '#4A2545';
    ctx.font = 'italic 700 84px serif';
    ctx.letterSpacing = '2px';
    ctx.fillText('Certificate of Graduation', width / 2, 430);

    // 5. Body Text
    ctx.fillStyle = '#72426C';
    ctx.font = '300 32px sans-serif';
    ctx.letterSpacing = '4px';
    ctx.fillText('THIS RECOGNIZES THAT', width / 2, 540);

    // 6. Student Name
    ctx.fillStyle = '#C94F7C';
    ctx.font = 'italic 700 96px serif';
    ctx.letterSpacing = '1px';
    ctx.fillText(displayName, width / 2, 670);

    // Name Underline
    const textWidth = ctx.measureText(displayName).width;
    ctx.strokeStyle = '#D4AF37';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(width / 2 - textWidth / 2 - 40, 710);
    ctx.lineTo(width / 2 + textWidth / 2 + 40, 710);
    ctx.stroke();

    // 7. Statement of Achievement
    ctx.fillStyle = '#4A2545';
    ctx.font = '400 34px sans-serif';
    ctx.letterSpacing = '1px';
    ctx.fillText(
      'has completed with rigorous daily focus and distinction',
      width / 2,
      820
    );

    ctx.font = '600 38px serif';
    ctx.fillStyle = '#31142E';
    ctx.fillText(
      'The 21-Day Complete Microsoft Excel Curriculum',
      width / 2,
      890
    );

    ctx.font = '300 28px sans-serif';
    ctx.fillStyle = '#72426C';
    ctx.fillText(
      'From Foundations to Formulas, VLOOKUP, XLOOKUP, PivotTables, Power Query & Executive Dashboards',
      width / 2,
      950
    );

    // 8. Gold Rosette Seal (Bottom Center)
    const sealX = width / 2;
    const sealY = 1180;
    const sealRadius = 110;

    ctx.save();
    ctx.translate(sealX, sealY);
    ctx.fillStyle = '#D4AF37';
    for (let i = 0; i < 36; i++) {
      ctx.rotate((Math.PI * 2) / 36);
      ctx.beginPath();
      ctx.arc(0, sealRadius - 10, 16, 0, Math.PI * 2);
      ctx.fill();
    }
    // Seal Face
    ctx.beginPath();
    ctx.arc(0, 0, sealRadius - 12, 0, Math.PI * 2);
    ctx.fillStyle = '#E6C79C';
    ctx.fill();
    ctx.lineWidth = 4;
    ctx.strokeStyle = '#D4AF37';
    ctx.stroke();

    // Inner ring
    ctx.beginPath();
    ctx.arc(0, 0, sealRadius - 26, 0, Math.PI * 2);
    ctx.strokeStyle = '#B08D23';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Seal text
    ctx.fillStyle = '#4A2545';
    ctx.font = 'bold 22px sans-serif';
    ctx.textAlign = 'center';
    ctx.letterSpacing = '3px';
    ctx.fillText('EXCEL', 0, -10);
    ctx.fillText('GRADUATE', 0, 20);
    ctx.restore();

    // 9. Date and Signature Blocks
    // Date (Left)
    ctx.textAlign = 'center';
    ctx.fillStyle = '#4A2545';
    ctx.font = '500 30px serif';
    ctx.fillText(formattedDate, width / 2 - 550, 1260);
    ctx.strokeStyle = '#4A2545';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(width / 2 - 720, 1280);
    ctx.lineTo(width / 2 - 380, 1280);
    ctx.stroke();
    ctx.fillStyle = '#72426C';
    ctx.font = '300 22px sans-serif';
    ctx.letterSpacing = '3px';
    ctx.fillText('DATE OF CONFERRAL', width / 2 - 550, 1320);

    // Signature (Right)
    ctx.textAlign = 'center';
    ctx.fillStyle = '#C94F7C';
    ctx.font = 'italic 700 42px serif';
    ctx.fillText('Bloom Academy', width / 2 + 550, 1250);
    ctx.strokeStyle = '#4A2545';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(width / 2 + 380, 1280);
    ctx.lineTo(width / 2 + 720, 1280);
    ctx.stroke();
    ctx.fillStyle = '#72426C';
    ctx.font = '300 22px sans-serif';
    ctx.letterSpacing = '3px';
    ctx.fillText('EXECUTIVE CERTIFICATION', width / 2 + 550, 1320);
  }, [displayName, formattedDate]);

  useEffect(() => {
    if (document.fonts) {
      document.fonts.ready.then(() => {
        renderCertificate();
      });
    } else {
      renderCertificate();
    }
  }, [renderCertificate]);

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = `Bloom_Excel_Graduation_Certificate_${displayName.replace(/\s+/g, '_')}.png`;
    link.href = canvas.toDataURL('image/png', 1.0);
    link.click();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-plum-deep/85 backdrop-blur-xl overflow-y-auto">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="relative max-w-4xl w-full p-6 md:p-8 rounded-3xl bg-cream-50 dark:bg-plum-night border border-gold shadow-2xl text-center my-auto"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full text-plum-light hover:text-plum hover:bg-cream-200 transition-all dark:text-cream-300"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center justify-center gap-2 mb-2 text-gold">
            <Award className="w-5 h-5" />
            <span className="text-xs font-semibold tracking-editorial uppercase">
              Official Credential
            </span>
          </div>

          <h3 className="font-serif text-2xl md:text-3xl font-bold text-plum dark:text-cream-50 mb-4">
            Master Gardener Certificate
          </h3>

          {/* Canvas Preview */}
          <div className="w-full rounded-2xl overflow-hidden border border-gold/40 shadow-editorial mb-6 bg-cream-200">
            <canvas ref={canvasRef} className="w-full h-auto block" />
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={handleDownload}
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-gold hover:bg-gold-dark text-plum-deep font-semibold text-sm transition-all shadow-gold-glow w-full sm:w-auto"
            >
              <Download className="w-4 h-4" />
              Download High-Resolution PNG
            </button>
            <button
              onClick={onClose}
              className="px-6 py-3.5 rounded-xl bg-cream-300 dark:bg-plum-light/30 text-plum dark:text-cream-100 font-medium text-sm hover:bg-cream-400 transition-all w-full sm:w-auto"
            >
              Close
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
