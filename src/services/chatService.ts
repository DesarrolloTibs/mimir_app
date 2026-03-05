import axiosInstance from '../core/axios/axiosInstance';
import type { PostMessageDto, ChatResponse, ChatSession, ChatMessage } from '../core/models/Chat';
import { CHAT } from '../global/endpoints';

export const chatService = {
    postChatMessage: async (data: PostMessageDto): Promise<ChatResponse> => {
        const response = await axiosInstance.post<ChatResponse>(CHAT.MESSAGE, data);
        return response.data;
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
