import { useState, useRef, useEffect } from 'react';
import { X, Minimize2, Maximize2 } from 'lucide-react';
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

        // Crisis detection
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
            setError(apiError.message);
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
                className="fixed bottom-6 right-6 w-14 h-14 bg-primary-600 text-white rounded-full flex items-center justify-center shadow-xl hover:scale-110 transition-all z-50 animate-bounce"
            >
                <Maximize2 size={24} />
            </button>
        );
    }

    return (
        <div className="fixed bottom-6 right-6 w-[90vw] sm:w-[380px] h-[550px] bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col z-50 overflow-hidden animate-in slide-in-from-bottom-5 duration-300">
            <div className="relative">
                <ChatHeader />
                <div className="absolute right-4 top-4 flex gap-2">
                    <button onClick={() => setIsMinimized(true)} className="p-1 hover:bg-slate-100 rounded transition-colors text-slate-400">
                        <Minimize2 size={16} />
                    </button>
                    <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-red-50 hover:text-red-500 rounded transition-colors text-slate-400">
                        <X size={16} />
                    </button>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 bg-slate-50/50">
                {error && (
                    <div className="mb-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
                        {error}
                    </div>
                )}
                {messages.map(msg => (
                    <ChatMessage key={msg.id} message={msg.text} isAI={msg.isAI} timestamp={msg.timestamp} />
                ))}
                {isTyping && (
                    <div className="flex justify-start mb-4">
                        <div className="bg-white border border-slate-100 p-3 rounded-2xl rounded-bl-sm shadow-sm flex gap-1">
                            <span className="w-1.5 h-1.5 bg-primary-400 rounded-full animate-bounce"></span>
                            <span className="w-1.5 h-1.5 bg-primary-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                            <span className="w-1.5 h-1.5 bg-primary-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            <div className="p-3 bg-white border-t border-slate-100">
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
