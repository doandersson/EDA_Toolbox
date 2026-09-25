import React, { useState } from 'react';
import { Download, Check, Laptop } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { DesktopInstallModal } from './DesktopInstallModal';

interface Props {
  compact?: boolean;
  label?: string;
}

export const PWAInstallButton: React.FC<Props> = ({
  compact = false,
  label = 'Installera app',
}) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showModal, setShowModal] = useState(false);

  // If already running in standalone PWA window, display badge or compact indicator
  if (isInstalled) {
    if (compact) {
      return (
        <span
          className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-[11px] font-semibold"
          title="Applikationen körs lokalt i fristående fönster"
        >
          <Check className="w-3 h-3 text-emerald-400" />
          <span>Installerad</span>
        </span>
      );
    }
    return (
      <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-bold">
        <Check className="w-3.5 h-3.5 text-emerald-400" />
        <span>Installerad på datorn</span>
      </div>
    );
  }

  const handleClick = async () => {
    if (isInstallable) {
      try {
        const success = await install();
        if (!success) {
          setShowModal(true);
        }
      } catch {
        setShowModal(true);
      }
    } else {
      setShowModal(true);
    }
  };

  return (
    <>
      <button
        onClick={handleClick}
        className={`inline-flex items-center gap-2 rounded-xl bg-amber-500 hover:bg-amber-400 active:scale-95 text-slate-950 font-bold transition shadow-md shadow-amber-500/20 whitespace-nowrap cursor-pointer ${
          compact ? 'px-3 py-1.5 text-xs' : 'px-4 py-2 text-xs sm:text-sm'
        }`}
        title="Installera EDA Toolbox som ett fristående program på din dator"
      >
        <Download className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
        <span>{label}</span>
      </button>

      {/* Complete Desktop & Device Installation Modal */}
      <DesktopInstallModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onNativeInstall={isInstallable ? install : undefined}
        isInstallable={isInstallable}
      />
    </>
  );
};
