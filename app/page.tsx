'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import { Sidebar } from '@/components/Sidebar';
import { ChatMessage } from '@/components/ChatMessage';
import { ChatInput } from '@/components/ChatInput';
import { EmptyState } from '@/components/EmptyState';
import { SettingsModal } from '@/components/SettingsModal';
import { NexusAvatar3D } from '@/components/NexusAvatar3D';
import { DEFAULT_SETTINGS, INITIAL_SESSIONS } from '@/lib/presets';
import { ChatSession, ChatSettings, Message } from '@/types/chat';
import { nexusSpeech } from '@/lib/speech';
import { Loader2, Trash2 } from 'lucide-react';

export default function ChatPage() {
  const [sessions, setSessions] = useState<ChatSession[]>(INITIAL_SESSIONS);
  const [activeSessionId, setActiveSessionId] = useState<string>('session-nexus-core');
  const [settings, setSettings] = useState<ChatSettings>(DEFAULT_SETTINGS);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState<boolean>(false);
  const [isCollapsedDesktop, setIsCollapsedDesktop] = useState<boolean>(false);

  // Voice synthesis & 3D Avatar state
  const [voiceEnabled, setVoiceEnabled] = useState<boolean>(true);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [showAvatarSection, setShowAvatarSection] = useState<boolean>(true);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load saved sessions, settings, and voice preference
  useEffect(() => {
    try {
      const savedSessions = localStorage.getItem('nexus_chat_sessions');
      if (savedSessions) {
        const parsed = JSON.parse(savedSessions);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setSessions(parsed);
          setActiveSessionId(parsed[0].id);
        }
      }

      const savedSettings = localStorage.getItem('nexus_chat_settings');
      if (savedSettings) {
        setSettings((prev) => ({ ...prev, ...JSON.parse(savedSettings) }));
      }

      const savedVoice = localStorage.getItem('nexus_voice_enabled');
      if (savedVoice !== null) {
        setVoiceEnabled(savedVoice === 'true');
      }
    } catch (e) {
      console.warn('Error al cargar datos de almacenamiento local:', e);
    }
  }, []);

  // Save changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('nexus_chat_sessions', JSON.stringify(sessions));
    } catch {}
  }, [sessions]);

  useEffect(() => {
    try {
      localStorage.setItem('nexus_chat_settings', JSON.stringify(settings));
    } catch {}
  }, [settings]);

  useEffect(() => {
    try {
      localStorage.setItem('nexus_voice_enabled', String(voiceEnabled));
    } catch {}
  }, [voiceEnabled]);

  // Active session
  const currentSession = sessions.find((s) => s.id === activeSessionId) || sessions[0] || {
    id: 'default',
    title: 'Nueva directiva',
    updatedAt: new Date().toISOString(),
    messages: [],
  };

  // Auto-scroll on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentSession?.messages, isLoading]);

  // Clean stop on unmount
  useEffect(() => {
    return () => {
      nexusSpeech.stop();
    };
  }, []);

  // Voice management functions
  const handleToggleVoice = () => {
    if (voiceEnabled && isSpeaking) {
      nexusSpeech.stop();
      setIsSpeaking(false);
    }
    setVoiceEnabled(!voiceEnabled);
  };

  const handleSpeakText = (text: string) => {
    nexusSpeech.speak(text, {
      onStart: () => setIsSpeaking(true),
      onEnd: () => setIsSpeaking(false),
      onError: () => setIsSpeaking(false),
    });
  };

  const handleStopVoice = () => {
    nexusSpeech.stop();
    setIsSpeaking(false);
  };

  const handleTestVoice = () => {
    handleSpeakText('Sistemas del núcleo NEXUS verificados. A su entera disposición, señor.');
  };

  // Create new session
  const handleNewSession = () => {
    handleStopVoice();
    const newId = `nexus-${Date.now()}`;
    const newSession: ChatSession = {
      id: newId,
      title: 'Nueva directiva',
      updatedAt: new Date().toISOString(),
      messages: [],
    };

    setSessions((prev) => [newSession, ...prev]);
    setActiveSessionId(newId);
    setIsMobileSidebarOpen(false);
  };

  // Select session
  const handleSelectSession = (id: string) => {
    handleStopVoice();
    setActiveSessionId(id);
    setIsMobileSidebarOpen(false);
  };

  // Delete session
  const handleDeleteSession = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    handleStopVoice();
    if (sessions.length <= 1) return;
    const remaining = sessions.filter((s) => s.id !== id);
    setSessions(remaining);
    if (activeSessionId === id) {
      setActiveSessionId(remaining[0].id);
    }
  };

  // Clear all sessions
  const handleClearAll = () => {
    if (window.confirm('¿Desea restablecer todos los registros de NEXUS?')) {
      handleStopVoice();
      const freshId = `nexus-${Date.now()}`;
      const freshSession: ChatSession = {
        id: freshId,
        title: 'Nueva directiva',
        updatedAt: new Date().toISOString(),
        messages: [],
      };
      setSessions([freshSession]);
      setActiveSessionId(freshId);
    }
  };

  // Clear current chat
  const handleClearCurrentChat = () => {
    if (window.confirm('¿Reiniciar esta conversación con NEXUS?')) {
      handleStopVoice();
      setSessions((prev) =>
        prev.map((s) => (s.id === activeSessionId ? { ...s, messages: [] } : s))
      );
    }
  };

  // Send message
  const handleSendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;

    handleStopVoice();

    const userMsg: Message = {
      id: `usr-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toISOString(),
    };

    const isFirstUserMessage =
      currentSession.messages.filter((m) => m.role === 'user').length === 0;
    const newTitle = isFirstUserMessage
      ? text.slice(0, 32).trim() + (text.length > 32 ? '...' : '')
      : currentSession.title;

    const updatedMessages = [...currentSession.messages, userMsg];

    // Optimistic UI update
    setSessions((prev) =>
      prev.map((s) =>
        s.id === activeSessionId
          ? {
              ...s,
              title: newTitle,
              updatedAt: new Date().toISOString(),
              messages: updatedMessages,
            }
          : s
      )
    );

    setIsLoading(true);

    try {
      const historyPayload = updatedMessages.map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(settings.customApiKey ? { 'x-gemini-key': settings.customApiKey } : {}),
        },
        body: JSON.stringify({
          messages: historyPayload,
          settings,
          userPrompt: text,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Falla en la respuesta del núcleo NEXUS.');
      }

      const botMsg: Message = {
        id: `bot-${Date.now()}`,
        role: 'model',
        content: data.text,
        timestamp: new Date().toISOString(),
      };

      setSessions((prev) =>
        prev.map((s) =>
          s.id === activeSessionId
            ? { ...s, messages: [...s.messages, botMsg] }
            : s
        )
      );

      // Auto-vocalize response with voice if voice is enabled!
      if (voiceEnabled && data.text) {
        handleSpeakText(data.text);
      }
    } catch (err: any) {
      const errorMsg: Message = {
        id: `err-${Date.now()}`,
        role: 'model',
        content: `⚠️ **Aviso de Diagnóstico:** ${err.message}\n\n*Puede verificar su clave en **Configuración (⚙️)** si es necesario.*`,
        timestamp: new Date().toISOString(),
      };

      setSessions((prev) =>
        prev.map((s) =>
          s.id === activeSessionId
            ? { ...s, messages: [...s.messages, errorMsg] }
            : s
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#070B12] text-slate-100 font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* 1. Left Sidebar */}
      <Sidebar
        sessions={sessions}
        activeSessionId={activeSessionId}
        onSelectSession={handleSelectSession}
        onNewSession={handleNewSession}
        onDeleteSession={handleDeleteSession}
        onClearAll={handleClearAll}
        onOpenSettings={() => setIsSettingsOpen(true)}
        isOpenMobile={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
        isCollapsedDesktop={isCollapsedDesktop}
      />

      {/* 2. Main Workspace */}
      <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#070B12]">
        {/* Top Navbar */}
        <Navbar
          onToggleSidebar={() => {
            setIsMobileSidebarOpen(!isMobileSidebarOpen);
            setIsCollapsedDesktop(!isCollapsedDesktop);
          }}
          onNewChat={handleNewSession}
          onOpenSettings={() => setIsSettingsOpen(true)}
          modelName={settings.modelName}
          hasCustomKey={Boolean(settings.customApiKey)}
          voiceEnabled={voiceEnabled}
          onToggleVoice={handleToggleVoice}
          showAvatarSection={showAvatarSection}
          onToggleAvatarSection={() => setShowAvatarSection(!showAvatarSection)}
        />

        {/* Chat Area & 3D Avatar Viewport */}
        <main className="flex-1 overflow-y-auto flex flex-col">
          {/* Dedicated 3D Holographic Avatar Section */}
          {showAvatarSection && (
            <div className="w-full max-w-3xl mx-auto px-4 pt-3 pb-1">
              <NexusAvatar3D
                isSpeaking={isSpeaking}
                voiceEnabled={voiceEnabled}
                onToggleVoice={handleToggleVoice}
                onStopVoice={handleStopVoice}
                onTestVoice={handleTestVoice}
              />
            </div>
          )}

          {currentSession.messages.length === 0 ? (
            <EmptyState onSelectPrompt={handleSendMessage} />
          ) : (
            <div className="flex-1 w-full max-w-3xl mx-auto px-4 py-4">
              {/* Optional clean clear button on top */}
              {currentSession.messages.length > 2 && (
                <div className="flex justify-end pb-2">
                  <button
                    onClick={handleClearCurrentChat}
                    className="flex items-center gap-1 font-mono text-[11px] text-slate-500 hover:text-rose-400 transition-colors"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>Reiniciar directiva actual</span>
                  </button>
                </div>
              )}

              {/* Messages Stream */}
              {currentSession.messages.map((msg) => (
                <ChatMessage
                  key={msg.id}
                  message={msg}
                  isCurrentlySpeaking={isSpeaking && msg.role === 'model'}
                  onSpeakMessage={handleSpeakText}
                  onStopSpeaking={handleStopVoice}
                />
              ))}

              {/* In-flight Loading Indicator */}
              {isLoading && (
                <div className="flex items-center gap-3 my-4 pl-1 animate-in fade-in duration-200 font-mono">
                  <div className="w-8 h-8 rounded-xl bg-cyan-950/60 border border-cyan-400/40 flex items-center justify-center text-cyan-400 shadow-md shadow-cyan-500/20">
                    <Loader2 className="w-4 h-4 animate-spin text-cyan-400" />
                  </div>
                  <div className="text-xs text-cyan-300 font-medium flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                    <span>NEXUS sintetizando respuesta...</span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          )}
        </main>

        {/* Input Area */}
        <ChatInput
          onSendMessage={handleSendMessage}
          isLoading={isLoading}
          voiceEnabled={voiceEnabled}
          onToggleVoice={handleToggleVoice}
        />
      </div>

      {/* 3. Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onSave={(newSettings) => setSettings(newSettings)}
      />
    </div>
  );
}
