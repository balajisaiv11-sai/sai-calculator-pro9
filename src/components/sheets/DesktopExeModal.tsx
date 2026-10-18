import React, { useState, useEffect } from 'react';
import {
  X,
  Download,
  Monitor,
  Laptop,
  CheckCircle2,
  Copy,
  Terminal,
  ExternalLink,
  ShieldCheck,
  Package,
} from 'lucide-react';

interface DesktopExeModalProps {
  onDismiss: () => void;
}

export const DesktopExeModal: React.FC<DesktopExeModalProps> = ({ onDismiss }) => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [copiedScript, setCopiedScript] = useState(false);

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

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      if (choiceResult.outcome === 'accepted') {
        setIsInstalled(true);
      }
      setDeferredPrompt(null);
    } else {
      alert(
        'To install as a native Desktop App (.exe):\n\n' +
        '1. In Microsoft Edge or Google Chrome, click the App/Install icon in the address bar (or Menu ︙ > Save and Share > Install Sai Calculator Pro).\n' +
        '2. This creates a dedicated desktop shortcut and Start Menu .exe app with no browser address bar!'
      );
    }
  };

  const downloadWindowsLauncher = () => {
    const batScript = `@echo off
:: ======================================================================
:: Sai Calculator Pro - Windows Standalone Desktop Launcher
:: 540+ Scientific Functions • Natural Textbook Display
:: ======================================================================
title Sai Calculator Pro
echo ======================================================================
echo Launching Sai Calculator Pro in Native Standalone Window Mode...
echo ======================================================================

set CURRENT_URL=%~dp0index.html
if not exist "%CURRENT_URL%" (
    set CURRENT_URL=https://ais-dev-jhxfl2nx5jtx22w4lnraps-484340879323.asia-northeast1.run.app
)

:: Try Edge in Standalone Application Mode (Zero browser chrome)
start msedge --app="%CURRENT_URL%" --window-size=480,820 >nul 2>&1
if %ERRORLEVEL% equ 0 exit /b

:: Try Google Chrome App Mode
start chrome --app="%CURRENT_URL%" --window-size=480,820 >nul 2>&1
if %ERRORLEVEL% equ 0 exit /b

:: Fallback to default browser
start "" "%CURRENT_URL%"
exit
`;

    const blob = new Blob([batScript], { type: 'application/x-bat' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'SaiCalculatorPro-Desktop-Launcher.bat';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const downloadPowerShellSetup = () => {
    const psScript = `# =====================================================================
# Sai Calculator Pro - Windows Desktop Shortcut & .EXE Runner Creator
# =====================================================================
$WScriptShell = New-Object -ComObject WScript.Shell
$DesktopPath = [Environment]::GetFolderPath("Desktop")
$ShortcutPath = Join-Path $DesktopPath "Sai Calculator Pro.lnk"
$Shortcut = $WScriptShell.CreateShortcut($ShortcutPath)

$AppUrl = "https://ais-dev-jhxfl2nx5jtx22w4lnraps-484340879323.asia-northeast1.run.app"
$EdgePath = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe"
if (-not (Test-Path $EdgePath)) {
    $EdgePath = "C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe"
}

$Shortcut.TargetPath = $EdgePath
$Shortcut.Arguments = "--app=$AppUrl --window-size=480,820"
$Shortcut.Description = "Sai Calculator Pro - 540+ Functions Scientific Calculator"
$Shortcut.WindowStyle = 1
$Shortcut.Save()

Write-Host "Success: 'Sai Calculator Pro' Desktop executable shortcut created on your Desktop!" -ForegroundColor Green
Start-Sleep -Seconds 3
`;

    const blob = new Blob([psScript], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Create-Desktop-Executable-Shortcut.ps1';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const copyNativefierCommand = () => {
    const cmd = `npx nativefier --name "Sai Calculator Pro" --width 480 --height 820 --maximize false --tray --single-instance "https://ais-dev-jhxfl2nx5jtx22w4lnraps-484340879323.asia-northeast1.run.app"`;
    navigator.clipboard.writeText(cmd);
    setCopiedScript(true);
    setTimeout(() => setCopiedScript(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-3 sm:p-4">
      <div className="w-full max-w-xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl flex flex-col overflow-hidden max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 bg-slate-950/80">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <Monitor className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center space-x-2">
                <span>Sai Calculator Pro .EXE Desktop App</span>
                <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Windows Native
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                540+ Functions • Standalone Window • Offline Capable
              </p>
            </div>
          </div>
          <button
            onClick={onDismiss}
            className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 space-y-4 overflow-y-auto">
          {/* Option 1: One-Click Desktop Installation */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-blue-950/60 to-slate-900 border border-blue-500/40 relative">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center space-x-2">
                  <Laptop className="w-4 h-4 text-blue-400" />
                  <h3 className="text-sm font-bold text-white">
                    1. One-Click Native Desktop Installation (Windows App)
                  </h3>
                </div>
                <p className="text-xs text-slate-300 mt-1 pr-2">
                  Installs as a native standalone Windows application with its own desktop icon,
                  Start Menu entry, and dedicated window frame without browser tabs.
                </p>
              </div>
              <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded-md whitespace-nowrap">
                Recommended
              </span>
            </div>

            <div className="mt-3.5 flex items-center space-x-2">
              <button
                onClick={handleInstallClick}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold flex items-center space-x-1.5 shadow-md shadow-blue-900/30 transition cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>{isInstalled ? 'App Already Installed' : 'Install Desktop App Now'}</span>
              </button>
              {isInstalled && (
                <span className="text-xs text-emerald-400 flex items-center space-x-1">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Installed as Desktop App</span>
                </span>
              )}
            </div>
          </div>

          {/* Option 2: Windows Standalone Portable Launcher */}
          <div className="p-4 rounded-xl bg-slate-850 border border-slate-800 space-y-3">
            <div className="flex items-center space-x-2">
              <Package className="w-4 h-4 text-amber-400" />
              <h3 className="text-sm font-bold text-white">
                2. Download Windows Desktop Launcher (.BAT / Standalone Runner)
              </h3>
            </div>
            <p className="text-xs text-slate-400">
              Download the standalone runner script that launches Sai Calculator Pro in a dedicated,
              borderless 480×820 window matching physical handheld calculator dimensions.
            </p>
            <div className="flex flex-wrap gap-2 pt-1">
              <button
                onClick={downloadWindowsLauncher}
                className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 rounded-lg text-xs font-medium flex items-center space-x-1.5 transition cursor-pointer"
              >
                <Download className="w-4 h-4 text-amber-400" />
                <span>Download Standalone Launcher (.bat)</span>
              </button>

              <button
                onClick={downloadPowerShellSetup}
                className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 rounded-lg text-xs font-medium flex items-center space-x-1.5 transition cursor-pointer"
              >
                <Download className="w-4 h-4 text-sky-400" />
                <span>Create Desktop Shortcut (.ps1)</span>
              </button>
            </div>
          </div>

          {/* Option 3: Compile into Single .EXE Executable Binary */}
          <div className="p-4 rounded-xl bg-slate-850 border border-slate-800 space-y-3">
            <div className="flex items-center space-x-2">
              <Terminal className="w-4 h-4 text-purple-400" />
              <h3 className="text-sm font-bold text-white">
                3. Compile into Single-File .EXE Binary (Nativefier / Electron)
              </h3>
            </div>
            <p className="text-xs text-slate-400">
              You can instantly package Sai Calculator Pro into a standalone portable <code className="text-purple-300 font-mono">SaiCalculatorPro.exe</code> binary file using one command:
            </p>
            <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 flex items-center justify-between font-mono text-[11px] text-slate-300">
              <span className="truncate mr-2">
                npx nativefier --name &quot;Sai Calculator Pro&quot; --width 480 --height 820
              </span>
              <button
                onClick={copyNativefierCommand}
                className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white transition flex-shrink-0"
                title="Copy build command"
              >
                {copiedScript ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </div>
            <div className="flex items-center space-x-2 text-[11px] text-slate-400">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Works on Windows 10, Windows 11, and portable USB drives without admin rights.</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between text-xs text-slate-400">
          <span>Sai Calculator Pro • All 540+ functions included offline</span>
          <button
            onClick={onDismiss}
            className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium transition cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
