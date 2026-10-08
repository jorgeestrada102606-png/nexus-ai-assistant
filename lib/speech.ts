// Client-side text-to-speech engine for NEXUS using Web Speech API

// Strip markdown characters and code snippets so speech sounds natural
export function cleanTextForSpeech(markdown: string): string {
  if (!markdown) return '';

  return markdown
    // Remove code blocks
    .replace(/```[\s\S]*?```/g, ' Código omitido. ')
    // Remove inline code
    .replace(/`([^`]+)`/g, '$1')
    // Remove headers
    .replace(/#{1,6}\s+/g, '')
    // Remove markdown links [text](url) -> text
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    // Remove bold and italics
    .replace(/(\*\*|__)(.*?)\1/g, '$2')
    .replace(/(\*|_)(.*?)\1/g, '$2')
    // Remove blockquotes
    .replace(/^\s*>\s+/gm, '')
    // Remove lists bullets
    .replace(/^\s*[-*+]\s+/gm, '')
    .replace(/^\s*\d+\.\s+/gm, '')
    // Remove table lines
    .replace(/\|.*\|/g, '')
    // Remove extra whitespace
    .replace(/\s+/g, ' ')
    .trim();
}

class NexusSpeechEngine {
  private synth: SpeechSynthesis | null = null;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private preferredVoice: SpeechSynthesisVoice | null = null;
  private isBrowserSupported: boolean = false;

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synth = window.speechSynthesis;
      this.isBrowserSupported = true;
      this.initVoices();
    }
  }

  private initVoices() {
    if (!this.synth) return;

    const loadVoices = () => {
      const voices = this.synth?.getVoices() || [];
      // Prefer Spanish voices (es-ES, es-MX, es-US, or any 'es')
      const spanishVoices = voices.filter((v) => v.lang.startsWith('es'));

      // Look for natural/popular Spanish voices (like Google, Jorge, Sabina, Alonso, etc.)
      const naturalVoice =
        spanishVoices.find((v) => v.name.includes('Google') || v.name.includes('Natural')) ||
        spanishVoices.find((v) => v.name.includes('Jorge') || v.name.includes('Alonso')) ||
        spanishVoices[0] ||
        voices[0];

      if (naturalVoice) {
        this.preferredVoice = naturalVoice;
      }
    };

    loadVoices();
    if (this.synth.onvoiceschanged !== undefined) {
      this.synth.onvoiceschanged = loadVoices;
    }
  }

  public isSupported(): boolean {
    return this.isBrowserSupported;
  }

  public stop() {
    if (this.synth) {
      this.synth.cancel();
      this.currentUtterance = null;
    }
  }

  public speak(
    rawText: string,
    options?: {
      onStart?: () => void;
      onEnd?: () => void;
      onError?: () => void;
      rate?: number;
      pitch?: number;
    }
  ) {
    if (!this.synth || !this.isBrowserSupported) return;

    // Cancel any active utterance
    this.stop();

    const clean = cleanTextForSpeech(rawText);
    if (!clean) return;

    const utterance = new SpeechSynthesisUtterance(clean);
    this.currentUtterance = utterance;

    if (this.preferredVoice) {
      utterance.voice = this.preferredVoice;
    }
    utterance.lang = this.preferredVoice?.lang || 'es-ES';
    utterance.rate = options?.rate ?? 1.05; // Slightly articulate, refined pacing
    utterance.pitch = options?.pitch ?? 0.95; // Slightly deeper, sophisticated tone

    utterance.onstart = () => {
      options?.onStart?.();
    };

    utterance.onend = () => {
      this.currentUtterance = null;
      options?.onEnd?.();
    };

    utterance.onerror = () => {
      this.currentUtterance = null;
      options?.onEnd?.();
      options?.onError?.();
    };

    this.synth.speak(utterance);
  }

  public isSpeaking(): boolean {
    return this.synth ? this.synth.speaking : false;
  }
}

export const nexusSpeech = new NexusSpeechEngine();
