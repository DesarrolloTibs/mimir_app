import axiosInstance from '../core/axios/axiosInstance';
import type { PostMessageDto, ChatResponse, ChatSession, ChatMessage } from '../core/models/Chat';
import { CHAT } from '../global/endpoints';

export const chatService = {
    postChatMessage: async (data: PostMessageDto): Promise<ChatResponse> => {
        const response = await axiosInstance.post<ChatResponse>(CHAT.MESSAGE, data);
        return response.data;
    },
    postChatMessageStream: async (
        data: PostMessageDto,
        onMessage: (chunk: any) => void,
        onError: (error: any) => void
    ): Promise<void> => {
        try {
            const token = localStorage.getItem('jwt_token');

            const response = await fetch(CHAT.MESSAGE_STREAM, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(data)
            });

            if (!response.body) throw new Error('ReadableStream not supported');

            const reader = response.body.getReader();
            const decoder = new TextDecoder('utf-8');
            let buffer = '';

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                buffer += decoder.decode(value, { stream: true });
                const lines = buffer.split('\n');

                buffer = lines.pop() || '';

                for (const line of lines) {
                    if (line.startsWith('data: ')) {
                        try {
                            const data = JSON.parse(line.slice(6));
                            onMessage(data);
                        } catch (e) {
                            console.error('Error parsing SSE json:', e, line);
                        }
                    }
                }
            }
        } catch (error) {
            onError(error);
        }
    },
    getChatSessions: async (projectId: string): Promise<ChatSession[]> => {
        const response = await axiosInstance.get<ChatSession[]>(CHAT.SESSIONS_BY_PROJECT(projectId));
        return response.data;
    },
    getChatMessages: async (sessionId: string): Promise<ChatMessage[]> => {
        const response = await axiosInstance.get<ChatMessage[]>(CHAT.MESSAGES_BY_SESSION(sessionId));
        return response.data;
    }
};
