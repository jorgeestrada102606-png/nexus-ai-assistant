'use client';

import React from 'react';
import { Menu, Plus, Settings, Volume2, VolumeX, Sparkles, Box } from 'lucide-react';

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
    <header className="h-14 border-b border-[#00F5A0]/15 bg-[#07130D]/90 backdrop-blur-md px-4 flex items-center justify-between z-20 select-none">
      {/* Left: Sidebar toggle + Brand */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          aria-label="Alternar barra lateral"
          className="p-2 rounded-xl text-slate-400 hover:text-[#00F5A0] hover:bg-[#00F5A0]/10 transition-colors"
          title="Alternar barra lateral"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#082417] to-[#0D3824] border border-[#00F5A0]/50 flex items-center justify-center text-[#00F5A0] shadow-md shadow-[#00F5A0]/20">
            <Sparkles className="w-4 h-4 fill-current animate-pulse" />
          </div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-sm lg:text-base tracking-tight text-white">
              NEXUS
            </span>
            <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#0A2619] text-[#00F5A0] border border-[#00F5A0]/30">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00F5A0] animate-ping" />
              <span>Bio-Núcleo v3.8</span>
            </span>
            <span className="hidden md:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-mono text-emerald-300/80 bg-black/40 border border-emerald-500/20">
              {modelName}
            </span>
          </div>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2">
        {/* Toggle 3D Avatar */}
        <button
          onClick={onToggleAvatarSection}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-xs font-medium transition-all ${
            showAvatarSection
              ? 'bg-[#00F5A0]/15 border-[#00F5A0]/40 text-[#00F5A0]'
              : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
          }`}
          title="Mostrar u ocultar Avatar 3D"
        >
          <Box className="w-3.5 h-3.5 text-[#00F5A0]" />
          <span className="hidden md:inline">Avatar 3D</span>
        </button>

        {/* Global Voice Toggle */}
        <button
          onClick={onToggleVoice}
          className={`p-2 rounded-xl border transition-all ${
            voiceEnabled
              ? 'bg-[#00F5A0]/15 border-[#00F5A0]/40 text-[#00F5A0] hover:bg-[#00F5A0]/25'
              : 'bg-white/5 border-white/10 text-slate-500 hover:text-slate-300'
          }`}
          title={voiceEnabled ? 'Voz activada' : 'Voz silenciada'}
        >
          {voiceEnabled ? (
            <Volume2 className="w-4 h-4 text-[#00F5A0]" />
          ) : (
            <VolumeX className="w-4 h-4" />
          )}
        </button>

        {/* New Chat Button - Glowing Mint Style */}
        <button
          onClick={onNewChat}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#00F5A0] hover:bg-[#05DF72] text-[#05170F] text-xs font-bold transition-all shadow-md shadow-[#00F5A0]/30 active:scale-95"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span className="hidden sm:inline">Nuevo chat</span>
        </button>

        {/* Settings Button */}
        <button
          onClick={onOpenSettings}
          className="relative p-2 rounded-xl text-slate-400 hover:text-[#00F5A0] hover:bg-[#00F5A0]/10 transition-colors"
          title="Configuración"
          aria-label="Configuración"
        >
          <Settings className="w-4 h-4" />
          {hasCustomKey && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#00F5A0] ring-2 ring-[#07130D]" />
          )}
        </button>
      </div>
    </header>
  );
};
