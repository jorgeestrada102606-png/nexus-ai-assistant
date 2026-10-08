import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import { ChatRequestBody, ChatResponseBody } from '@/types/chat';

export async function POST(req: Request) {
  try {
    const body: ChatRequestBody = await req.json();
    const { messages, settings } = body;

    // Check for API Key in headers, payload settings, or environment
    const headerKey = req.headers.get('x-gemini-key');
    const apiKey = settings?.customApiKey || headerKey || process.env.GEMINI_API_KEY;

    if (!messages || messages.length === 0) {
      return NextResponse.json(
        { error: 'Por favor ingresa un mensaje para continuar.' },
        { status: 400 }
      );
    }

    if (!apiKey) {
      return NextResponse.json(
        {
          error:
            'No se encontró una API Key de Gemini. Por favor agrégala en la sección de Ajustes (⚙️) o define GEMINI_API_KEY en tu archivo .env.local.',
        },
        { status: 400 }
      );
    }

    // Initialize Google GenAI client
    const ai = new GoogleGenAI({ apiKey });

    // Format chat contents
    const contents = messages.map((m) => ({
      role: m.role === 'user' ? 'user' : 'model',
      parts: [{ text: m.content }],
    }));

    const systemInstruction =
      settings?.systemInstruction ||
      'Eres un asistente de inteligencia artificial amable, útil y perspicaz. Responde de forma clara, natural y concisa en español a menos que el usuario indique lo contrario.';

    // Model fallback chain: try preferred model first, then reliable fallbacks
    const preferredModel = settings?.modelName || 'gemini-3.5-flash';
    const candidateModels = Array.from(
      new Set([preferredModel, 'gemini-3.5-flash', 'gemini-3.8-flash', 'gemini-flash-latest'])
    );

    let lastError: any = null;
    let successfulResponse: any = null;
    let modelActuallyUsed = preferredModel;

    for (const modelToTry of candidateModels) {
      try {
        successfulResponse = await ai.models.generateContent({
          model: modelToTry,
          contents,
          config: {
            systemInstruction,
          },
        });
        modelActuallyUsed = modelToTry;
        break;
      } catch (err: any) {
        lastError = err;
        const msg = err?.message || '';
        // If model is busy (503) or not found (404), try next model
        if (
          msg.includes('503') ||
          msg.includes('404') ||
          msg.includes('429') ||
          msg.includes('UNAVAILABLE')
        ) {
          console.warn(`[Gemini Fallback] El modelo ${modelToTry} falló (${msg.slice(0, 60)}). Probando alternativa...`);
          continue;
        } else {
          throw err;
        }
      }
    }

    if (!successfulResponse) {
      throw lastError || new Error('No se pudo obtener respuesta del modelo de Gemini.');
    }

    const replyText = successfulResponse.text || 'No se recibió texto de respuesta.';

    const responsePayload: ChatResponseBody = {
      text: replyText,
      modelUsed: modelActuallyUsed,
    };

    return NextResponse.json(responsePayload);
  } catch (error: any) {
    console.error('Error en /api/chat:', error);

    let errorDetail = error.message || 'Ocurrió un error al comunicarse con Gemini.';
    try {
      const parsed = JSON.parse(errorDetail);
      if (parsed?.error?.message) {
        errorDetail = parsed.error.message;
      }
    } catch {}

    return NextResponse.json(
      {
        error: errorDetail,
      },
      { status: 500 }
    );
  }
}
