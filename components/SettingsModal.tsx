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
    nexusSpeech.speak('¡Qué onda bro! Ya quedó configurada la voz. Todo al tiro.');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-[#081811] border border-[#00F5A0]/30 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-[#00F5A0]/15 bg-[#05110B] flex items-center justify-between font-mono">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#00F5A0] animate-pulse" />
            <h2 className="font-bold text-sm text-[#00F5A0] tracking-wider">
              CONFIGURACIÓN DE NEXUS
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
              <Key className="w-4 h-4 text-[#00F5A0]" />
              <span>Clave de API de Gemini (Opcional)</span>
            </label>
            <div className="relative flex items-center">
              <input
                type={showKey ? 'text' : 'password'}
                value={localSettings.customApiKey || ''}
                onChange={(e) =>
                  setLocalSettings((prev) => ({ ...prev, customApiKey: e.target.value }))
                }
                placeholder="Detecta en automático GEMINI_API_KEY de .env.local"
                className="w-full bg-[#05110B] border border-[#00F5A0]/20 focus:border-[#00F5A0]/60 rounded-xl px-3.5 py-2.5 pr-10 text-xs text-white placeholder-emerald-400/30 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="absolute right-3 text-slate-400 hover:text-[#00F5A0]"
              >
                {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <p className="text-[11px] text-emerald-400/60 font-sans">
              Si ya tienes tu clave en <code className="text-[#00F5A0]">.env.local</code>, Nexus la usa directo sin bronca.
            </p>
          </div>

          {/* Model Selector */}
          <div className="flex flex-col gap-1.5">
            <label className="flex items-center gap-1.5 font-medium text-slate-200">
              <Cpu className="w-4 h-4 text-[#34D399]" />
              <span>Modelo de Gemini</span>
            </label>
            <select
              value={localSettings.modelName}
              onChange={(e) =>
                setLocalSettings((prev) => ({ ...prev, modelName: e.target.value }))
              }
              className="bg-[#05110B] border border-[#00F5A0]/20 focus:border-[#00F5A0]/60 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none"
            >
              <option value="gemini-3.5-flash">Gemini 3.5 Flash (Recomendado, vuela y jala al 100)</option>
              <option value="gemini-3.8-flash">Gemini 3.8 Flash (Última versión)</option>
              <option value="gemini-flash-latest">Gemini Flash Latest</option>
            </select>
          </div>

          {/* Voice Test */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-[#05110B] border border-[#00F5A0]/15">
            <div className="flex items-center gap-2">
              <Volume2 className="w-4 h-4 text-[#00F5A0]" />
              <div>
                <span className="font-semibold text-slate-200">Prueba de voz en español</span>
                <p className="text-[11px] text-emerald-400/60 font-sans">
                  Prueba rápida para checar cómo te va a responder hablando.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleTestVoice}
              className="px-3 py-1.5 rounded-lg bg-[#00F5A0]/15 border border-[#00F5A0]/40 text-[#00F5A0] hover:bg-[#00F5A0]/25 text-[11px] font-semibold transition-all active:scale-95"
            >
              Calibrar Audio
            </button>
          </div>

          {/* System Prompt (Personality) */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-1.5 font-medium text-slate-200">
                <MessageSquareText className="w-4 h-4 text-[#00F5A0]" />
                <span>Personalidad de NEXUS</span>
              </label>
              <button
                type="button"
                onClick={handleReset}
                className="flex items-center gap-1 text-[11px] text-emerald-400 hover:text-[#00F5A0] transition-colors"
                title="Restablecer a tono casual"
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
              className="w-full bg-[#05110B] border border-[#00F5A0]/20 focus:border-[#00F5A0]/60 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none resize-none leading-relaxed font-sans"
            />
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-[#00F5A0]/15 bg-[#05110B] flex items-center justify-end gap-3 font-mono">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-[#00F5A0] hover:bg-[#05DF72] text-[#04160E] transition-all shadow-md shadow-[#00F5A0]/30 active:scale-95"
          >
            {savedSuccess ? (
              <>
                <Check className="w-4 h-4 text-[#04160E]" />
                <span>¡Guardado!</span>
              </>
            ) : (
              <span>Guardar cambios</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
