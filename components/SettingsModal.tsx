'use client';

import React, { useState } from 'react';
import { X, Key, Cpu, MessageSquareText, RotateCcw, Check, Eye, EyeOff, Volume2 } from 'lucide-react';
import { ChatSettings } from '@/types/chat';
import { DEFAULT_SETTINGS } from '@/lib/presets';
import { nexusSpeech } from '@/lib/speech';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: ChatSettings;
  onSave: (newSettings: ChatSettings) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onSave,
}) => {
  const [localSettings, setLocalSettings] = useState<ChatSettings>(settings);
  const [showKey, setShowKey] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    onSave(localSettings);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 600);
  };

  const handleReset = () => {
    setLocalSettings((prev) => ({
      ...prev,
      modelName: DEFAULT_SETTINGS.modelName,
      systemInstruction: DEFAULT_SETTINGS.systemInstruction,
    }));
  };

  const handleTestVoice = () => {
    nexusSpeech.speak('Sistemas de voz de NEXUS verificados y calibrados. A su disposición, señor.');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-[#0d1422] border border-cyan-500/30 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-cyan-950/80 bg-[#090f1a] flex items-center justify-between font-mono">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <h2 className="font-bold text-sm text-cyan-300 tracking-wider">
              CONFIGURACIÓN DEL NÚCLEO // NEXUS
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 flex flex-col gap-5 text-xs text-slate-300 font-mono">
          {/* API Key */}
          <div className="flex flex-col gap-1.5">
            <label className="flex items-center gap-1.5 font-medium text-slate-200">
              <Key className="w-4 h-4 text-cyan-400" />
              <span>Clave de API de Gemini (Opcional)</span>
            </label>
            <div className="relative flex items-center">
              <input
                type={showKey ? 'text' : 'password'}
                value={localSettings.customApiKey || ''}
                onChange={(e) =>
                  setLocalSettings((prev) => ({ ...prev, customApiKey: e.target.value }))
                }
                placeholder="Detectará automáticamente GEMINI_API_KEY de .env.local"
                className="w-full bg-[#080d16] border border-cyan-950 focus:border-cyan-400/60 rounded-xl px-3.5 py-2.5 pr-10 text-xs text-white placeholder-slate-500 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="absolute right-3 text-slate-400 hover:text-cyan-300"
              >
                {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <p className="text-[11px] text-slate-500 font-sans">
              Si ya configuraste <code className="text-cyan-300">GEMINI_API_KEY</code> en tu archivo <code className="text-cyan-300">.env.local</code>, NEXUS la usará directamente.
            </p>
          </div>

          {/* Model Selector */}
          <div className="flex flex-col gap-1.5">
            <label className="flex items-center gap-1.5 font-medium text-slate-200">
              <Cpu className="w-4 h-4 text-blue-400" />
              <span>Modelo de Inferencia</span>
            </label>
            <select
              value={localSettings.modelName}
              onChange={(e) =>
                setLocalSettings((prev) => ({ ...prev, modelName: e.target.value }))
              }
              className="bg-[#080d16] border border-cyan-950 focus:border-cyan-400/60 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none"
            >
              <option value="gemini-3.5-flash">Gemini 3.5 Flash (Recomendado, ultrarrápido y estable)</option>
              <option value="gemini-3.8-flash">Gemini 3.8 Flash (Modelo avanzado)</option>
              <option value="gemini-flash-latest">Gemini Flash Latest</option>
            </select>
          </div>

          {/* Voice Test */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-[#080d16] border border-cyan-950">
            <div className="flex items-center gap-2">
              <Volume2 className="w-4 h-4 text-cyan-400" />
              <div>
                <span className="font-semibold text-slate-200">Síntesis de Voz de Salida</span>
                <p className="text-[11px] text-slate-400 font-sans">
                  El motor Web Speech hablará con el acento español configurado.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleTestVoice}
              className="px-2.5 py-1.5 rounded-lg bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/20 text-[11px] font-semibold transition-all active:scale-95"
            >
              Probar Audio
            </button>
          </div>

          {/* System Prompt (Personality) */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-1.5 font-medium text-slate-200">
                <MessageSquareText className="w-4 h-4 text-cyan-400" />
                <span>Personalidad de NEXUS (JARVIS System Prompt)</span>
              </label>
              <button
                type="button"
                onClick={handleReset}
                className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-cyan-300 transition-colors"
                title="Restablecer personalidad por defecto"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Por defecto</span>
              </button>
            </div>
            <textarea
              rows={4}
              value={localSettings.systemInstruction}
              onChange={(e) =>
                setLocalSettings((prev) => ({ ...prev, systemInstruction: e.target.value }))
              }
              className="w-full bg-[#080d16] border border-cyan-950 focus:border-cyan-400/60 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none resize-none leading-relaxed font-sans"
            />
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-cyan-950/80 bg-[#090f1a] flex items-center justify-end gap-3 font-mono">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400/50 text-cyan-300 transition-all shadow-sm shadow-cyan-500/20 active:scale-95"
          >
            {savedSuccess ? (
              <>
                <Check className="w-4 h-4 text-cyan-300" />
                <span>Configurado</span>
              </>
            ) : (
              <span>Guardar configuración</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
