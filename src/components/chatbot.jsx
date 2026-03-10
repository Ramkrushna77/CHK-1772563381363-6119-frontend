import { useState, useRef, useEffect } from 'react';
import { X, Minimize2, Maximize2, MessageCircle } from 'lucide-react';
import ChatHeader from './ChatHeader';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import SuggestedPrompts from './SuggestedPrompts';
import { sendMessage } from '../services/api';

export default function Chatbot() {
    const [isOpen, setIsOpen] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);
    const [messages, setMessages] = useState([
        { id: 1, text: "Hi! I'm your MindCare Assistant. I'm here to listen and support you. How are you feeling today?", isAI: true, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
    ]);
    const [inputText, setInputText] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [error, setError] = useState('');
    const messagesEndRef = useRef(null);

    const crisisKeywords = ['suicide', 'kill myself', 'hurt myself', 'self harm', 'die', 'want to die'];

    useEffect(() => {
        const handleOpen = () => {
            setIsOpen(true);
            setIsMinimized(false);
        };
        window.addEventListener('open-chatbot', handleOpen);
        return () => window.removeEventListener('open-chatbot', handleOpen);
    }, []);

    useEffect(() => {
        if (isOpen && !isMinimized) {
            messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages, isOpen, isTyping, isMinimized]);

    const handleSend = async (text = inputText) => {
        if (!text.trim()) return;

        const userMsg = {
            id: Date.now(),
            text: text,
            isAI: false,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        setMessages(prev => [...prev, userMsg]);
        setInputText('');
        setError('');
        setIsTyping(true);

        if (crisisKeywords.some(kw => text.toLowerCase().includes(kw))) {
            setTimeout(() => {
                const safetyMsg = {
                    id: Date.now() + 1,
                    text: "Your wellbeing is important. Please reach out to a professional. Call/Text 988 for the Suicide & Crisis Lifeline.",
                    isAI: true,
                    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                };
                setMessages(prev => [...prev, safetyMsg]);
                setIsTyping(false);
            }, 1000);
            return;
        }

        try {
            const response = await sendMessage(text);
            const botMsg = {
                id: Date.now() + 1,
                text: response?.answer || 'I am here with you. Please tell me more.',
                isAI: true,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };
            setMessages(prev => [...prev, botMsg]);
        } catch (apiError) {
            setError('Connection issue. Please try again.');
            const fallback = {
                id: Date.now() + 1,
                text: 'I am having trouble reaching the backend right now. Please try again in a moment.',
                isAI: true,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };
            setMessages(prev => [...prev, fallback]);
        } finally {
            setIsTyping(false);
        }
    };

    if (!isOpen) return null;

    if (isMinimized) {
        return (
            <button
                onClick={() => setIsMinimized(false)}
                className="fixed bottom-8 right-8 w-16 h-16 bg-gradient-to-tr from-blue-600 to-indigo-700 text-white rounded-2xl flex items-center justify-center shadow-2xl shadow-blue-200 hover:scale-110 transition-all z-50 animate-bounce group"
            >
                <div className="relative">
                    <MessageCircle size={32} fill="currentColor" className="opacity-20 absolute inset-0 scale-150" />
                    <Maximize2 size={24} className="relative z-10" />
                </div>
            </button>
        );
    }

    return (
        <div className="fixed bottom-8 right-8 w-[90vw] sm:w-[420px] h-[650px] max-h-[85vh] bg-white/95 backdrop-blur-xl rounded-[32px] shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-white/20 flex flex-col z-50 overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-10 duration-500 ease-out-expo">
            <div className="relative group">
                <ChatHeader />
                <div className="absolute right-6 top-6 flex gap-3 z-30">
                    <button onClick={() => setIsMinimized(true)} className="w-8 h-8 flex items-center justify-center bg-slate-50/50 hover:bg-slate-100 rounded-xl transition-all text-slate-400 hover:text-blue-500">
                        <Minimize2 size={16} />
                    </button>
                    <button onClick={() => setIsOpen(false)} className="w-8 h-8 flex items-center justify-center bg-red-50/50 hover:bg-red-100 rounded-xl transition-all text-slate-400 hover:text-red-500">
                        <X size={16} />
                    </button>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 bg-gradient-to-b from-transparent to-slate-50/30 scroll-smooth scrollbar-thin scrollbar-thumb-slate-200">
                {error && (
                    <div className="mb-4 rounded-xl border border-red-100 bg-red-50/80 backdrop-blur-sm px-4 py-2 text-xs text-red-600 font-bold flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></div>
                        {error}
                    </div>
                )}
                <div className="space-y-1">
                    {messages.map(msg => (
                        <ChatMessage key={msg.id} message={msg.text} isAI={msg.isAI} timestamp={msg.timestamp} />
                    ))}
                    {isTyping && (
                        <div className="flex justify-start mb-6 animate-in fade-in duration-300">
                            <div className="bg-white/80 backdrop-blur-sm border border-slate-100 px-4 py-3 rounded-2xl rounded-bl-none shadow-sm flex gap-1.5 items-center">
                                <span className="w-1.2 h-1.2 bg-blue-400 rounded-full animate-bounce [animation-duration:800ms]"></span>
                                <span className="w-1.2 h-1.2 bg-blue-400 rounded-full animate-bounce [animation-duration:800ms] [animation-delay:200ms]"></span>
                                <span className="w-1.2 h-1.2 bg-blue-400 rounded-full animate-bounce [animation-duration:800ms] [animation-delay:400ms]"></span>
                            </div>
                        </div>
                    )}
                </div>
                <div ref={messagesEndRef} className="h-2" />
            </div>

            <div className="p-6 pt-2 bg-transparent backdrop-blur-md">
                <SuggestedPrompts onPromptClick={handleSend} />
                <ChatInput
                    value={inputText}
                    onChange={setInputText}
                    onSend={() => handleSend()}
                    onVoiceResult={(val) => { setInputText(val); handleSend(val); }}
                />
            </div>
        </div>
    );
}
