import React, { useState, useEffect, useRef } from 'react';
import { chatService } from '../../services/chatService';
import { Send, Bot, User, FileText, Plus, MessageSquare, Menu, Loader2 } from 'lucide-react';
import type { ChatSession, ChatMessage } from '../../core/models/Chat';

interface ProjectChatProps {
    projectId: string;
}

const ProjectChat: React.FC<ProjectChatProps> = ({ projectId }) => {
    const [sessions, setSessions] = useState<ChatSession[]>([]);
    const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);
    const [messages, setMessages] = useState<ChatMessage[]>([]);

    const [inputText, setInputText] = useState('');
    const [isLoadingSessions, setIsLoadingSessions] = useState(false);
    const [isLoadingMessages, setIsLoadingMessages] = useState(false);
    const [isSending, setIsSending] = useState(false);

    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isSending]);

    // Largar sesiones del proyecto
    const fetchSessions = async () => {
        setIsLoadingSessions(true);
        try {
            const data = await chatService.getChatSessions(projectId);
            setSessions(data);
            if (data.length > 0 && !selectedSessionId) {
                setSelectedSessionId(data[0].id);
            }
        } catch (error) {
            console.error('Error fetching chat sessions:', error);
        } finally {
            setIsLoadingSessions(false);
        }
    };

    useEffect(() => {
        fetchSessions();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [projectId]);

    // Cargar historial de la sesión seleccionada
    useEffect(() => {
        const fetchMessages = async () => {
            if (!selectedSessionId) return;
            setIsLoadingMessages(true);
            try {
                const data = await chatService.getChatMessages(selectedSessionId);
                setMessages(data);
            } catch (error) {
                console.error('Error fetching chat messages:', error);
            } finally {
                setIsLoadingMessages(false);
            }
        };

        if (selectedSessionId) {
            fetchMessages();
        } else {
            setMessages([]);
        }
    }, [selectedSessionId]);

    const handleNewChat = () => {
        setSelectedSessionId(null);
        setMessages([]);
    };

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputText.trim()) return;

        const currentInput = inputText;
        setInputText('');

        // Optimistic UI update for user message
        const optimisticUserMsg: ChatMessage = {
            id: Date.now().toString(),
            sessionId: selectedSessionId || 'temp',
            role: 'user',
            content: currentInput,
            createdAt: new Date().toISOString()
        };
        setMessages(prev => [...prev, optimisticUserMsg]);

        // Setup initial empty bot message that will be populated by the stream
        const streamingBotMessageIndex = messages.length + 1;
        setMessages(prev => [...prev, {
            id: Date.now().toString() + '-bot',
            sessionId: selectedSessionId || 'temp',
            role: 'bot',
            content: '',
            createdAt: new Date().toISOString()
        }]);

        setIsSending(true);

        try {
            let actualSessionId = selectedSessionId;

            await chatService.postChatMessageStream(
                {
                    projectId,
                    sessionId: selectedSessionId || undefined,
                    message: currentInput
                },
                (chunk) => {
                    if (chunk.type === 'session_created') {
                        actualSessionId = chunk.sessionId;
                        setSelectedSessionId(actualSessionId);
                        fetchSessions();
                    } else if (chunk.type === 'token') {
                        // Append token
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
                        // Update with final info
                        setMessages(prev => {
                            const newMessages = [...prev];
                            newMessages[streamingBotMessageIndex] = {
                                ...newMessages[streamingBotMessageIndex],
                                sessionId: chunk.sessionId,
                                content: chunk.finalAnswer,
                                citations: chunk.citations
                            };
                            return newMessages;
                        });
                        setIsSending(false);
                    }
                },
                (error) => {
                    console.error('Streaming error:', error);
                    setMessages(prev => {
                        const newMessages = [...prev];
                        newMessages[streamingBotMessageIndex] = {
                            ...newMessages[streamingBotMessageIndex],
                            content: 'Lo siento, ocurrió un error al intentar comunicarme con Mimir. Por favor, intenta de nuevo.'
                        };
                        return newMessages;
                    });
                    setIsSending(false);
                }
            );
        } catch {
            setIsSending(false);
        }
    };

    return (
        <div className="flex h-[calc(100vh-17rem)] bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            {/* Sidebar (Historial de Sesiones) */}
            <div className={`flex flex-col border-r border-gray-200 bg-gray-50 transition-all duration-300 ${isSidebarOpen ? 'w-64' : 'w-0 hidden md:flex md:w-20'}`}>
                <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-white">
                    <button
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className="text-gray-500 hover:text-indigo-600 transition-colors p-1"
                        title="Alternar panel"
                    >
                        <Menu size={20} />
                    </button>
                    {isSidebarOpen && (
                        <button
                            onClick={handleNewChat}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-md p-1.5 transition-colors"
                            title="Nuevo Chat"
                        >
                            <Plus size={20} />
                        </button>
                    )}
                </div>

                <div className="flex-1 overflow-y-auto p-2">
                    {/* Botón flotante para nuevo chat cuando está minimizado */}
                    {!isSidebarOpen && (
                        <div className="flex justify-center mb-4 mt-2">
                            <button
                                onClick={handleNewChat}
                                className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-full p-3 transition-colors shadow-md"
                                title="Nuevo Chat"
                            >
                                <Plus size={24} />
                            </button>
                        </div>
                    )}

                    {isLoadingSessions ? (
                        <div className="flex justify-center py-8">
                            <Loader2 className="animate-spin text-indigo-400" size={24} />
                        </div>
                    ) : (
                        <div className="space-y-1 mt-2">
                            {sessions.length === 0 && isSidebarOpen && (
                                <p className="text-sm text-gray-500 text-center mt-4 italic">No hay conversaciones previas</p>
                            )}
                            {sessions.map(session => (
                                <button
                                    key={session.id}
                                    onClick={() => setSelectedSessionId(session.id)}
                                    className={`w-full flex items-center p-3 rounded-lg text-left transition-colors ${selectedSessionId === session.id
                                        ? 'bg-indigo-100 text-indigo-900 font-medium'
                                        : 'hover:bg-gray-200 text-gray-700'
                                        }`}
                                    title={session.title}
                                >
                                    <MessageSquare size={18} className={`shrink-0 ${selectedSessionId === session.id ? 'text-indigo-600' : 'text-gray-500'}`} />
                                    {isSidebarOpen && (
                                        <div className="ml-3 overflow-hidden">
                                            <p className="text-sm truncate">{session.title || 'Nueva Conversación'}</p>
                                            <p className="text-xs text-gray-500 truncate mt-0.5">
                                                {new Date(session.createdAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                    )}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Main Chat Area */}
            <div className="flex-1 flex flex-col bg-white overflow-hidden relative">
                {/* Header Chat Area */}
                <div className="h-14 border-b border-gray-100 flex items-center px-6 bg-white shrink-0 shadow-sm z-10">
                    <Bot className="text-indigo-600 mr-2" size={24} />
                    <h3 className="font-semibold text-gray-800">Mimir IA Asistente</h3>
                    {selectedSessionId && (
                        <span className="ml-4 px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-600 text-xs font-medium border border-gray-200">
                            Historial Activo
                        </span>
                    )}
                </div>

                {/* Messages List */}
                <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-white">
                    {isLoadingMessages ? (
                        <div className="flex flex-col items-center justify-center h-full space-y-3">
                            <Loader2 className="animate-spin text-indigo-500" size={32} />
                            <p className="text-gray-500 text-sm">Cargando historial de la conversación...</p>
                        </div>
                    ) : messages.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-gray-400 max-w-lg mx-auto text-center space-y-6">
                            <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-600 mb-2">
                                <Bot size={40} />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-800">¿En qué puedo ayudarte?</h2>
                            <p className="text-base text-gray-500">
                                Soy Mimir, tu asistente técnico. Pregúntame sobre requerimientos, arquitectura, reglas de negocio o cualquier detalle del proyecto actual. Utilizo directamente los documentos que has subido.
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-6 max-w-4xl mx-auto pb-4">
                            {messages.map((msg, idx) => {
                                const isUser = msg.role === 'user';
                                return (
                                    <div key={msg.id || idx} className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
                                        <div className={`flex max-w-[85%] ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
                                            {/* Avatar */}
                                            <div className={`shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${isUser ? 'bg-indigo-100 text-indigo-600 ml-4' : 'bg-green-100 text-green-600 mr-4'
                                                }`}>
                                                {isUser ? <User size={20} /> : <Bot size={20} />}
                                            </div>

                                            {/* Message Bubble */}
                                            <div className="flex flex-col">
                                                <div className={`p-4 rounded-2xl ${isUser
                                                    ? 'bg-indigo-600 text-white rounded-tr-none'
                                                    : 'bg-gray-50 border border-gray-200 text-gray-800 rounded-tl-none prose prose-sm max-w-none'
                                                    }`}>
                                                    {msg.content ? (
                                                        <div className="whitespace-pre-wrap leading-relaxed">{msg.content}</div>
                                                    ) : (
                                                        <div className="flex items-center space-x-2 h-6 px-1 py-0.5">
                                                            <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                                            <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                                            <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Bot Citations */}
                                                {!isUser && msg.citations && msg.citations.length > 0 && (
                                                    <div className="mt-2 flex flex-wrap gap-2">
                                                        {msg.citations.map((cit, citIdx) => (
                                                            <div
                                                                key={citIdx}
                                                                className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-md bg-gray-100 border border-gray-200 text-xs font-medium text-gray-600"
                                                                title={`Chunk ID: ${cit.chunkId || cit.documentChunkId || cit.id}`}
                                                            >
                                                                <FileText size={12} className="text-indigo-500" />
                                                                <span>Ref {citIdx + 1}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}

                            {/* Loading indicator removed as the streaming message bubble acts as the placeholder */}
                            <div ref={messagesEndRef} className="h-4" />
                        </div>
                    )}
                </div>

                {/* Input Area */}
                <div className="p-4 bg-white border-t border-gray-200">
                    <form onSubmit={handleSendMessage} className="max-w-4xl mx-auto relative flex items-end shadow-sm border border-gray-300 rounded-2xl overflow-hidden focus-within:ring-2 focus-within:ring-offset-2 focus-within:border-indigo-500 focus-within:ring-indigo-500 transition-shadow bg-gray-50">
                        <textarea
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    handleSendMessage(e);
                                }
                            }}
                            placeholder="Mensaje a Mimir..."
                            className="w-full max-h-32 min-h-[56px] py-4 pl-4 pr-12 bg-transparent text-gray-900 border-none resize-none focus:ring-0 sm:text-base outline-none custom-scrollbar"
                            disabled={isSending || isLoadingMessages}
                            rows={1}
                        />
                        <div className="absolute right-2 bottom-2">
                            <button
                                type="submit"
                                disabled={isSending || isLoadingMessages || !inputText.trim()}
                                className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center hover:bg-indigo-700 disabled:opacity-50 disabled:bg-gray-400 transition-colors shadow-sm"
                            >
                                <Send size={18} className={(inputText.trim() && !isSending) ? 'translate-x-0.5' : ''} />
                            </button>
                        </div>
                    </form>
                    <div className="text-center mt-2">
                        <p className="text-[11px] text-gray-400">Mimir IA puede cometer errores. Considera verificar información importante revisando los documentos base.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProjectChat;
