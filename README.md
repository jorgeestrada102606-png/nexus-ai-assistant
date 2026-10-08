# ⚡ NEXUS // AI Assistant (JARVIS Protocol)

Un asistente de inteligencia artificial avanzado y distinguido impulsado por **Google Gemini**, con síntesis de voz en tiempo real, un núcleo holográfico 3D interactivo en **Three.js** y personalidad inspirada en **J.A.R.V.I.S.**

---

## ✨ Características Principales

- **🎙️ Personalidad J.A.R.V.I.S.:** Tono leal, cortés, sereno y altamente competente (*"A su entera disposición, señor"*), con respuestas directas y de máximo calibre técnico.
- **🌐 Núcleo Holográfico 3D (Three.js):**
  - Esfera holográfica con anillos orbitales y nube de partículas.
  - **Sincronización de voz:** El avatar permanece en reposo y se anima dinámicamente *cuando y solo cuando* NEXUS habla.
- **🔊 Síntesis de Voz de Salida (TTS):**
  - Motor integrado con Web Speech API en español natural.
  - Limpieza automática de Markdown y código para una lectura fluida.
  - Controles de reproducción/pausa global y por mensaje.
- **💬 Consola Ergonómica y Limpia:**
  - Historial de conversaciones persistente en `localStorage`.
  - Tarjetas de directivas rápidas y resaltado de código.
  - Entrada de texto autoajustable con atajos de teclado (`Enter` para enviar).
- **⚙️ Panel de Configuración:**
  - Selector de modelos (`gemini-3.5-flash`, `gemini-3.8-flash`).
  - Personalización de la instrucción del sistema (System Prompt).
  - Soporte de clave de API en `.env.local` o manual.

---

## 🚀 Puesta en Marcha

### 1. Clonar el repositorio
```bash
git clone https://github.com/jorgeestrada102606-png/nexus-ai-assistant.git
cd nexus-ai-assistant
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Configurar variables de entorno
Crea un archivo `.env.local` en la raíz del proyecto:
```env
GEMINI_API_KEY=tu_api_key_de_google_ai_studio
```

### 4. Iniciar el servidor de desarrollo
```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador para interactuar con NEXUS.

---

## 🛠️ Tecnologías

- **Framework:** Next.js 16 (App Router)
- **Lenguaje:** TypeScript & React 19
- **3D Graphics:** Three.js
- **Modelos IA:** Google GenAI SDK (`@google/genai`)
- **Estilos:** Tailwind CSS v4 & Lucide Icons
- **Audio:** Web Speech API (Client-side TTS)

---

*Desarrollado para NEXUS Protocol.*
