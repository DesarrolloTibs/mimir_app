import React, { useState, useEffect, useRef } from 'react';
import { chatService } from '../../services/chatService';
import { X, Send, Bot, User, FileText } from 'lucide-react';
import type { Citation } from '../../core/models/Chat';

interface Message {
    role: 'user' | 'bot';
    content: string;
    citations?: Citation[];
}

interface ChatWidgetProps {
    projectId: string;
    isOpen: boolean;
    onClose: () => void;
}

const ChatWidget: React.FC<ChatWidgetProps> = ({ projectId, isOpen, onClose }) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputText, setInputText] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [sessionId, setSessionId] = useState<string | undefined>(undefined);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputText.trim()) return;

        const userMessage: Message = { role: 'user', content: inputText };
        setMessages(prev => [...prev, userMessage]);

        // Setup initial empty bot message that will be populated by the stream
        const streamingBotMessageIndex = messages.length + 1;
        setMessages(prev => [...prev, { role: 'bot', content: '' }]);

        setInputText('');
        setIsLoading(true);

        try {
            await chatService.postChatMessageStream(
                {
                    projectId,
                    sessionId,
                    message: userMessage.content
                },
                (chunk) => {
                    if (chunk.type === 'session_created') {
                        setSessionId(chunk.sessionId);
                    } else if (chunk.type === 'token') {
                        // Append token to the streaming message
                        setMessages(prev => {
                            const newMessages = [...prev];
                            newMessages[streamingBotMessageIndex] = {
                                ...newMessages[streamingBotMessageIndex],
                                content: newMessages[streamingBotMessageIndex].content + chunk.text
                            };
                            return newMessages;
                        });
                        scrollToBottom();
                    } else if (chunk.type === 'done') {
                        // Update with final citations if any
                        setMessages(prev => {
                            const newMessages = [...prev];
                            newMessages[streamingBotMessageIndex] = {
                                ...newMessages[streamingBotMessageIndex],
                                content: chunk.finalAnswer,
                                citations: chunk.citations
                            };
                            return newMessages;
                        });
                        setIsLoading(false);
                    }
                },
                (error) => {
                    console.error('Streaming error:', error);
                    setMessages(prev => {
                        const newMessages = [...prev];
                        newMessages[streamingBotMessageIndex] = {
                            role: 'bot',
                            content: 'Error al conectar con Mimir. Por favor, intenta de nuevo.'
                        };
                        return newMessages;
                    });
                    setIsLoading(false);
                }
            );
        } catch {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed bottom-4 right-4 w-96 h-[32rem] bg-white rounded-lg shadow-2xl flex flex-col z-50 border border-gray-200 overflow-hidden">
            {/* Header */}
            <div className="bg-indigo-600 text-white p-4 flex justify-between items-center">
                <div className="flex items-center space-x-2">
                    <Bot size={24} />
                    <h3 className="font-semibold text-lg">Mimir Chat</h3>
                </div>
                <button onClick={onClose} className="text-indigo-100 hover:text-white transition-colors">
                    <X size={20} />
                </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 p-4 overflow-y-auto bg-gray-50 flex flex-col space-y-4">
                {messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-gray-400 space-y-4">
                        <Bot size={48} className="opacity-50" />
                        <p className="text-sm text-center px-4">Hola. Soy Mimir. ¿Tienes preguntas sobre este proyecto?</p>
                    </div>
                ) : (
                    messages.map((msg, idx) => (
                        <div key={idx} className={`flex flex-col max-w-[85%] ${msg.role === 'user' ? 'self-end' : 'self-start'}`}>
                            <div
                                className={`flex items-start space-x-2 ${msg.role === 'user' ? 'flex-row-reverse space-x-reverse' : 'flex-row'
                                    }`}
                            >
                                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${msg.role === 'user' ? 'bg-indigo-100 text-indigo-600' : 'bg-green-100 text-green-600'
                                    }`}>
                                    {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                                </div>
                                <div
                                    className={`p-3 rounded-2xl ${msg.role === 'user'
                                        ? 'bg-indigo-600 text-white rounded-tr-none'
                                        : 'bg-white text-gray-800 border border-gray-200 rounded-tl-none shadow-sm'
                                        }`}
                                >
                                    {msg.content ? (
                                        <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                                    ) : (
                                        <div className="flex items-center space-x-1 h-5 px-1 py-1">
                                            <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                            <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                            <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Citations block for bot messages */}
                            {msg.role === 'bot' && msg.citations && msg.citations.length > 0 && (
                                <div className="ml-10 mt-1 flex flex-wrap gap-1">
                                    {msg.citations.map((citation, citIdx) => (
                                        <span
                                            key={citIdx}
                                            className="inline-flex items-center space-x-1 px-1.5 py-0.5 rounded text-[10px] bg-gray-200 text-gray-600"
                                            title={`Chunk ID: ${citation.chunkId}`}
                                        >
                                            <FileText size={10} />
                                            <span className="truncate max-w[60px]">Ref {citIdx + 1}</span>
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))
                )}

                {/* Loading indicator removed as the streaming message bubble acts as the placeholder */}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white border-t border-gray-200">
                <form onSubmit={handleSendMessage} className="flex space-x-2">
                    <input
                        type="text"
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        placeholder="Pregunta algo sobre el proyecto..."
                        className="flex-1 px-4 py-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-full focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                        disabled={isLoading}
                    />
                    <button
                        type="submit"
                        disabled={isLoading || !inputText.trim()}
                        className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center hover:bg-indigo-700 disabled:opacity-50 transition-colors flex-shrink-0"
                    >
                        <Send size={16} className={inputText.trim() && !isLoading ? 'translate-x-0.5' : ''} />
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ChatWidget;
