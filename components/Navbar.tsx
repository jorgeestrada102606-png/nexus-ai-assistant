'use client';

import React from 'react';
import { Menu, Plus, Settings, Volume2, VolumeX, Cpu, Box } from 'lucide-react';

interface NavbarProps {
  onToggleSidebar: () => void;
  onNewChat: () => void;
  onOpenSettings: () => void;
  modelName: string;
  hasCustomKey: boolean;
  voiceEnabled: boolean;
  onToggleVoice: () => void;
  showAvatarSection: boolean;
  onToggleAvatarSection: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onToggleSidebar,
  onNewChat,
  onOpenSettings,
  modelName,
  hasCustomKey,
  voiceEnabled,
  onToggleVoice,
  showAvatarSection,
  onToggleAvatarSection,
}) => {
  return (
    <header className="h-14 border-b border-cyan-950/70 bg-[#090E17]/90 backdrop-blur-md px-4 flex items-center justify-between z-20 select-none">
      {/* Left: Sidebar toggle + NEXUS Brand */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          aria-label="Alternar barra lateral"
          className="p-2 rounded-lg text-slate-400 hover:text-cyan-300 hover:bg-white/5 transition-colors"
          title="Alternar barra lateral"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-950 to-blue-900 border border-cyan-400/50 flex items-center justify-center text-cyan-300 shadow-md shadow-cyan-500/20">
            <Cpu className="w-4 h-4 text-cyan-400 animate-pulse" />
          </div>
          <div className="flex items-center gap-2">
            <span className="font-mono font-bold text-sm lg:text-base tracking-wider text-cyan-400 drop-shadow-[0_0_8px_rgba(0,240,255,0.4)]">
              NEXUS
            </span>
            <span className="hidden sm:inline-block font-mono text-[10px] text-slate-500">//</span>
            <span className="hidden sm:inline-block font-mono text-[10px] text-slate-400 tracking-wider">
              JARVIS PROTOCOL
            </span>
            <span className="hidden md:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-cyan-950/60 text-cyan-300 border border-cyan-500/30">
              {modelName}
            </span>
          </div>
        </div>
      </div>

      {/* Right Controls: Avatar Toggle, Voice Toggle, New Chat, Settings */}
      <div className="flex items-center gap-2">
        {/* Toggle 3D Avatar Viewport */}
        <button
          onClick={onToggleAvatarSection}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-mono transition-all ${
            showAvatarSection
              ? 'bg-cyan-500/15 border-cyan-400 text-cyan-300'
              : 'bg-white/5 border-white/10 text-slate-400 hover:text-slate-200'
          }`}
          title="Mostrar u ocultar Avatar 3D de NEXUS"
        >
          <Box className="w-3.5 h-3.5 text-cyan-400" />
          <span className="hidden md:inline">Avatar 3D</span>
        </button>

        {/* Global Voice Toggle */}
        <button
          onClick={onToggleVoice}
          className={`p-2 rounded-lg border transition-all ${
            voiceEnabled
              ? 'bg-cyan-500/15 border-cyan-500/40 text-cyan-300 hover:bg-cyan-500/25'
              : 'bg-white/5 border-white/10 text-slate-500 hover:text-slate-300'
          }`}
          title={voiceEnabled ? 'Voz activada por defecto' : 'Voz silenciada'}
        >
          {voiceEnabled ? (
            <Volume2 className="w-4 h-4 text-cyan-400" />
          ) : (
            <VolumeX className="w-4 h-4" />
          )}
        </button>

        {/* New Chat Button */}
        <button
          onClick={onNewChat}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400/50 text-cyan-300 font-mono text-xs font-semibold transition-all shadow-sm shadow-cyan-500/20 active:scale-95"
        >
          <Plus className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Nuevo chat</span>
        </button>

        {/* Settings Button */}
        <button
          onClick={onOpenSettings}
          className="relative p-2 rounded-lg text-slate-400 hover:text-cyan-300 hover:bg-white/5 transition-colors border border-transparent hover:border-cyan-950"
          title="Configuración de NEXUS"
          aria-label="Configuración"
        >
          <Settings className="w-4 h-4" />
          {hasCustomKey && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-400 ring-2 ring-[#090E17]" />
          )}
        </button>
      </div>
    </header>
  );
};
