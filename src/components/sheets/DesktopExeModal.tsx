import React, { useState, useEffect } from 'react';
import {
  X,
  Download,
  Laptop,
  CheckCircle2,
  Cpu,
  WifiOff,
  Sparkles,
  ShieldCheck,
  FolderDown,
  MonitorDown,
  FileCheck,
  Zap,
} from 'lucide-react';

interface DesktopExeModalProps {
  onDismiss: () => void;
}

export const DesktopExeModal: React.FC<DesktopExeModalProps> = ({ onDismiss }) => {
  const [downloadingSetup, setDownloadingSetup] = useState(false);
  const [downloadingPortable, setDownloadingPortable] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [activeTab, setActiveTab] = useState<'installer' | 'portable' | 'pwa'>('installer');

  useEffect(() => {
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
    };
  }, []);

  const triggerDirectExeDownload = (fileUrl: string, fileName: string, type: 'setup' | 'portable') => {
    if (type === 'setup') setDownloadingSetup(true);
    else setDownloadingPortable(true);

    const anchor = document.createElement('a');
    anchor.href = fileUrl;
    anchor.download = fileName;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);

    setTimeout(() => {
      setDownloadingSetup(false);
      setDownloadingPortable(false);
    }, 2000);
  };

  const handlePwaInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      if (choiceResult.outcome === 'accepted') {
        setIsInstalled(true);
      }
      setDeferredPrompt(null);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto"
      onClick={onDismiss}
    >
      <div
        className="relative w-full max-w-xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 bg-slate-950/80 border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <MonitorDown className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white flex items-center space-x-2">
                <span>Download Windows .EXE Application</span>
                <span className="px-2 py-0.5 text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-full font-mono">
                  100% Offline
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Direct installation for laptops • Works without internet connection
              </p>
            </div>
          </div>
          <button
            onClick={onDismiss}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-slate-800 bg-slate-950/40 px-5 pt-3 space-x-2">
          <button
            onClick={() => setActiveTab('installer')}
            className={`pb-2.5 px-3 text-xs font-semibold border-b-2 transition flex items-center space-x-1.5 ${
              activeTab === 'installer'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Download className="w-3.5 h-3.5" />
            <span>.EXE Installer (Recommended)</span>
          </button>
          <button
            onClick={() => setActiveTab('portable')}
            className={`pb-2.5 px-3 text-xs font-semibold border-b-2 transition flex items-center space-x-1.5 ${
              activeTab === 'portable'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Portable .EXE (No Install)</span>
          </button>
          <button
            onClick={() => setActiveTab('pwa')}
            className={`pb-2.5 px-3 text-xs font-semibold border-b-2 transition flex items-center space-x-1.5 ${
              activeTab === 'pwa'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Laptop className="w-3.5 h-3.5" />
            <span>Browser / Chromebook</span>
          </button>
        </div>

        {/* Body Content */}
        <div className="p-5 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* TAB 1: INSTALLER .EXE */}
          {activeTab === 'installer' && (
            <div className="space-y-4">
              {/* Highlight Card with Direct Download Button */}
              <div className="p-4 rounded-xl bg-gradient-to-br from-blue-950/40 via-slate-900 to-indigo-950/40 border border-blue-500/30 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400 font-mono">
                      Native Windows Executable Setup
                    </span>
                    <h3 className="text-base font-bold text-white mt-0.5">
                      SaiCalculatorPro_Setup.exe
                    </h3>
                    <p className="text-xs text-slate-300 mt-1">
                      Direct Windows installer package. Installs the application to your laptop, creates Desktop & Start Menu shortcuts, and launches the calculator offline without requiring an internet connection.
                    </p>
                  </div>
                  <span className="px-2 py-1 text-xs bg-blue-500/20 text-blue-300 border border-blue-500/30 rounded font-mono font-bold shrink-0">
                    2.3 MB
                  </span>
                </div>

                <div className="pt-2">
                  <button
                    onClick={() =>
                      triggerDirectExeDownload(
                        '/downloads/SaiCalculatorPro_Setup.exe',
                        'SaiCalculatorPro_Setup.exe',
                        'setup'
                      )
                    }
                    disabled={downloadingSetup}
                    className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-bold text-sm shadow-lg shadow-blue-600/30 flex items-center justify-center space-x-2 transition cursor-pointer disabled:opacity-50"
                  >
                    <Download className={`w-4 h-4 ${downloadingSetup ? 'animate-bounce' : ''}`} />
                    <span>
                      {downloadingSetup
                        ? 'Starting Download...'
                        : 'Download Direct .EXE Installer (Windows 64-bit)'}
                    </span>
                  </button>
                </div>
              </div>

              {/* Guarantees */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800 text-center">
                  <WifiOff className="w-4 h-4 text-emerald-400 mx-auto mb-1" />
                  <p className="text-[11px] font-bold text-slate-200">Zero Internet</p>
                  <p className="text-[10px] text-slate-400">Works in airplane mode</p>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800 text-center">
                  <Cpu className="w-4 h-4 text-blue-400 mx-auto mb-1" />
                  <p className="text-[11px] font-bold text-slate-200">712 Functions</p>
                  <p className="text-[10px] text-slate-400">All 29 math modes offline</p>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800 text-center">
                  <ShieldCheck className="w-4 h-4 text-purple-400 mx-auto mb-1" />
                  <p className="text-[11px] font-bold text-slate-200">Native Windows</p>
                  <p className="text-[10px] text-slate-400">Windows 10, 11 & older</p>
                </div>
              </div>

              {/* How to Install on Laptop */}
              <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2.5">
                <h4 className="text-xs font-bold text-slate-200 flex items-center space-x-1.5">
                  <FileCheck className="w-4 h-4 text-blue-400" />
                  <span>How to Install on Your Laptop (3 Easy Steps):</span>
                </h4>
                <ol className="text-xs text-slate-300 space-y-2 pl-4 list-decimal marker:text-blue-400">
                  <li>
                    Click the blue{' '}
                    <strong className="text-white">"Download Direct .EXE Installer"</strong> button
                    above. Your browser will download{' '}
                    <code className="text-blue-300 bg-slate-800 px-1 py-0.5 rounded font-mono text-[11px]">
                      SaiCalculatorPro_Setup.exe
                    </code>.
                  </li>
                  <li>
                    Go to your <strong className="text-white">Downloads</strong> folder and
                    double-click{' '}
                    <code className="text-blue-300 bg-slate-800 px-1 py-0.5 rounded font-mono text-[11px]">
                      SaiCalculatorPro_Setup.exe
                    </code>.
                  </li>
                  <li>
                    A completion message will pop up:{' '}
                    <span className="text-emerald-400 font-medium">
                      "Sai Calculator Pro installed successfully!"
                    </span>{' '}
                    Click <strong className="text-white">OK</strong>.
                  </li>
                </ol>
                <div className="mt-2 p-2 bg-emerald-950/30 border border-emerald-500/20 rounded-lg text-[11px] text-emerald-300 flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                  <span>
                    A <strong>Sai Calculator Pro</strong> shortcut is placed right on your Desktop and
                    Start Menu. You can now use all functions offline anytime!
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PORTABLE .EXE */}
          {activeTab === 'portable' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-gradient-to-br from-indigo-950/40 via-slate-900 to-purple-950/40 border border-purple-500/30 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400 font-mono">
                      Standalone Portable Executable
                    </span>
                    <h3 className="text-base font-bold text-white mt-0.5">
                      SaiCalculatorPro_Portable.exe
                    </h3>
                    <p className="text-xs text-slate-300 mt-1">
                      No installation required. Double-click to launch immediately anywhere — ideal for USB pen drives, school laptops, or computers without admin rights.
                    </p>
                  </div>
                  <span className="px-2 py-1 text-xs bg-purple-500/20 text-purple-300 border border-purple-500/30 rounded font-mono font-bold shrink-0">
                    1.7 MB
                  </span>
                </div>

                <div className="pt-2">
                  <button
                    onClick={() =>
                      triggerDirectExeDownload(
                        '/downloads/SaiCalculatorPro_Portable.exe',
                        'SaiCalculatorPro_Portable.exe',
                        'portable'
                      )
                    }
                    disabled={downloadingPortable}
                    className="w-full py-3 px-4 rounded-xl bg-purple-600 hover:bg-purple-500 active:bg-purple-700 text-white font-bold text-sm shadow-lg shadow-purple-600/30 flex items-center justify-center space-x-2 transition cursor-pointer disabled:opacity-50"
                  >
                    <Download className={`w-4 h-4 ${downloadingPortable ? 'animate-bounce' : ''}`} />
                    <span>
                      {downloadingPortable
                        ? 'Starting Download...'
                        : 'Download Portable .EXE Application (1.7 MB)'}
                    </span>
                  </button>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
                <h4 className="text-xs font-bold text-slate-200 flex items-center space-x-1.5">
                  <Sparkles className="w-4 h-4 text-purple-400" />
                  <span>Portable Highlights:</span>
                </h4>
                <ul className="text-xs text-slate-300 space-y-1.5 list-disc pl-4 marker:text-purple-400">
                  <li>Single standalone executable file (<code className="text-purple-300">.exe</code>).</li>
                  <li>Can be copied to any USB drive and run on any Windows laptop.</li>
                  <li>Leaves no registry clutter, runs 100% self-contained offline.</li>
                </ul>
              </div>
            </div>
          )}

          {/* TAB 3: BROWSER / PWA */}
          {activeTab === 'pwa' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
                    <Laptop className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">Browser Progressive Web App (PWA)</h3>
                    <p className="text-xs text-slate-400">Install directly inside Edge, Chrome, or Chromebook</p>
                  </div>
                </div>

                <p className="text-xs text-slate-300">
                  If you are using a Chromebook, Mac, or prefer not downloading an .exe file, you can install the calculator as a progressive web application directly from your browser.
                </p>

                {deferredPrompt ? (
                  <button
                    onClick={handlePwaInstall}
                    className="w-full py-2.5 px-4 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center justify-center space-x-2 border border-slate-700 transition"
                  >
                    <Download className="w-4 h-4 text-blue-400" />
                    <span>Install in Browser Now</span>
                  </button>
                ) : (
                  <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300 space-y-1">
                    <p className="font-semibold text-slate-200">How to install in Edge / Chrome:</p>
                    <p>1. In your browser's address bar, look for the <strong>Install</strong> icon (computer with down arrow).</p>
                    <p>2. Or open the browser menu (<strong>...</strong>) &rarr; <strong>Apps</strong> &rarr; <strong>Install Sai Calculator Pro</strong>.</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 bg-slate-950/80 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Direct .EXE Files Ready for Windows 10 & 11</span>
          </div>
          <button
            onClick={onDismiss}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
