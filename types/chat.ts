export type Role = 'user' | 'model';

export interface Message {
  id: string;
  role: Role;
  content: string;
  timestamp: string; // ISO string
}

export interface ChatSession {
  id: string;
  title: string;
  updatedAt: string;
  messages: Message[];
}

export interface ChatSettings {
  modelName: string;
  systemInstruction: string;
  customApiKey?: string;
}

export interface ChatRequestBody {
  messages: Array<{
    role: 'user' | 'model';
    content: string;
  }>;
  settings?: ChatSettings;
  userPrompt?: string;
}

export interface ChatResponseBody {
  text: string;
  modelUsed?: string;
  error?: string;
}
