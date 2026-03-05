// src/core/models/Chat.ts

export interface PostMessageDto {
  projectId: string;
  sessionId?: string;
  message: string;
}

export interface Citation {
  id?: string;
  messageId?: string;
  chunkId?: string;
  documentChunkId?: string;
}

export interface ChatResponse {
  answer: string;
  sessionId: string;
  citations: Citation[];
}

export interface ChatSession {
  id: string;
  projectId: string;
  title: string;
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  sessionId: string;
  role: 'user' | 'bot' | 'assistant';
  content: string;
  createdAt: string;
  citations?: Citation[];
}
