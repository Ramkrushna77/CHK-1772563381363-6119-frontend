import { useState, useEffect, useRef } from 'react';
import { Bot, Sparkles, Zap, Heart, Shield, MessageSquare, ExternalLink } from 'lucide-react';
import ChatHeader from '../components/ChatHeader';
import ChatMessage from '../components/ChatMessage';
import ChatInput from '../components/ChatInput';
import SuggestedPrompts from '../components/SuggestedPrompts';
import { sendMessage } from '../services/api';

const ChatbotPage = () => {
    const [messages, setMessages] = useState([
        {
            id: 1,
            text: "Hello! I'm your MindCare AI Assistant. I'm here to provide a safe, non-judgmental space for you to talk. How are you feeling today?",
            isAI: true,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
    ]);
    const [inputText, setInputText] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [error, setError] = useState('');
    const messagesEndRef = useRef(null);

    // Crisis keywords for safety feature
    const crisisKeywords = [
        'suicide', 'kill myself', 'end my life', 'hurt myself', 'self harm',
        'slash my wrists', 'overdose', 'die', 'want to die', 'dying'
    ];

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    const detectCrisis = (text) => {
        const lowerText = text.toLowerCase();
        return crisisKeywords.some(keyword => lowerText.includes(keyword));
    };

    const handleSend = async (text = inputText) => {
        if (!text.trim()) return;

        const userMessage = {
            id: Date.now(),
            text: text,
            isAI: false,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        setMessages(prev => [...prev, userMessage]);
        setInputText('');
        setError('');
        setIsTyping(true);

        // Safety Feature Check
        if (detectCrisis(text)) {
            setTimeout(() => {
                const safetyMessage = {
                    id: Date.now() + 1,
                    text: "Your wellbeing is our priority. Please consider reaching out to a professional. You can call or text the 988 Suicide & Crisis Lifeline anytime at 988 (USA) or visit https://988lifeline.org/.",
                    isAI: true,
                    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                };
                setMessages(prev => [...prev, safetyMessage]);
                setIsTyping(false);
            }, 1000);
            return;
        }

        try {
            const response = await sendMessage(text);
            const botMessage = {
                id: Date.now() + 2,
                text: response?.answer || "I'm listening. Could you tell me more about that?",
                isAI: true,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };
            setMessages(prev => [...prev, botMessage]);
        } catch (error) {
            console.error("Error sending message:", error);
            setError('Connection issue. Please check your internet or try again.');

            const fallbackMessage = {
                id: Date.now() + 2,
                text: 'I am having a bit of trouble connecting right now. Please try again in a few moments.',
                isAI: true,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };
            setMessages(prev => [...prev, fallbackMessage]);
        } finally {
            setIsTyping(false);
        }
    };

    const handleVoiceResult = (transcript) => {
        setInputText(transcript);
        handleSend(transcript);
    };

    return (
        <div className="flex h-screen bg-[#F8FAFC] overflow-hidden font-sans selection:bg-blue-100 selection:text-blue-900">
            {/* Desktop Sidebar */}
            <aside className="hidden lg:flex flex-col w-80 bg-white border-r border-slate-200 p-6 overflow-y-auto">
                <div className="flex items-center gap-3 mb-10 px-2">
                    <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-100">
                        <Zap size={24} fill="currentColor" />
                    </div>
                    <span className="text-xl font-bold text-slate-900 tracking-tight">MindPulse</span>
                </div>

                <div className="space-y-8">
                    <div>
                        <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-4 px-2">Quick Tools</h3>
                        <nav className="space-y-1">
                            <button className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-semibold text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all group">
                                <Sparkles size={18} className="text-slate-400 group-hover:text-blue-500" />
                                Daily Meditation
                            </button>
                            <button className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-semibold text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all group">
                                <MessageSquare size={18} className="text-slate-400 group-hover:text-blue-500" />
                                Thought Journal
                            </button>
                        </nav>
                    </div>

                    <div>
                        <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-4 px-2">Emergency</h3>
                        <div className="p-4 bg-red-50 border border-red-100 rounded-2xl">
                            <h4 className="text-xs font-bold text-red-700 mb-1 flex items-center gap-1.5">
                                <Heart size={14} fill="currentColor" />
                                Get Help Now
                            </h4>
                            <p className="text-[10px] text-red-600 leading-normal mb-3">If you are in immediate danger or distress.</p>
                            <button className="w-full py-2 bg-white text-red-600 text-xs font-bold rounded-lg border border-red-200 hover:bg-red-50 transition-colors shadow-sm">
                                View Resources
                            </button>
                        </div>
                    </div>

                    <div className="relative p-6 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl text-white shadow-xl shadow-blue-100 overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl group-hover:scale-110 transition-transform duration-700"></div>
                        <h3 className="text-xs font-bold uppercase tracking-widest mb-3 opacity-80">Daily Quote</h3>
                        <p className="text-sm font-medium leading-relaxed italic">"The journey of a thousand miles begins with a single step."</p>
                    </div>
                </div>

                <div className="mt-auto px-2">
                    <div className="flex items-center gap-2 text-slate-400">
                        <Shield size={14} />
                        <span className="text-[10px] font-semibold uppercase tracking-wider">End-to-End Encrypted</span>
                    </div>
                </div>
            </aside>

            {/* Main Chat Area */}
            <main className="flex-1 flex flex-col min-w-0 relative">
                {/* Background soft gradients */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-100/30 rounded-full blur-[120px]"></div>
                    <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-100/30 rounded-full blur-[120px]"></div>
                </div>

                <div className="relative flex-1 flex flex-col h-full">
                    <ChatHeader />

                    <div className="flex-1 overflow-y-auto px-4 md:px-12 py-8 scroll-smooth scrollbar-thin scrollbar-thumb-slate-200">
                        <div className="max-w-3xl mx-auto w-full">
                            {error && (
                                <div className="mb-6 animate-in fade-in slide-in-from-top-2">
                                    <div className="rounded-2xl border border-red-100 bg-red-50/50 backdrop-blur-sm px-4 py-3 text-sm text-red-600 font-semibold flex items-center gap-2">
                                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                                        {error}
                                    </div>
                                </div>
                            )}

                            {messages.length === 0 ? (
                                <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-6">
                                    <div className="w-24 h-24 bg-white rounded-[2rem] flex items-center justify-center shadow-2xl shadow-blue-100/50 mb-8 animate-bounce transition-all duration-1000 ease-in-out">
                                        <Bot size={48} className="text-blue-600" />
                                    </div>
                                    <h2 className="text-3xl font-bold text-slate-800 mb-3 tracking-tight">How can I help you today?</h2>
                                    <p className="text-slate-500 text-base max-w-sm mb-10 leading-relaxed">Your personal AI companion for mental wellbeing and support.</p>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full max-w-lg">
                                        {["I'm feeling overwhelmed", "Help me with anxiety", "Just want to talk", "Stress management tips"].map((hint, i) => (
                                            <button key={i} onClick={() => handleSend(hint)} className="p-4 bg-white border border-slate-100 rounded-2xl text-left text-sm font-semibold text-slate-600 hover:border-blue-300 hover:text-blue-600 hover:shadow-lg hover:shadow-blue-50/50 transition-all flex items-center justify-between group">
                                                {hint}
                                                <ExternalLink size={14} className="opacity-0 group-hover:opacity-100" />
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    {messages.map((msg) => (
                                        <ChatMessage
                                            key={msg.id}
                                            message={msg.text}
                                            isAI={msg.isAI}
                                            timestamp={msg.timestamp}
                                        />
                                    ))}
                                    {isTyping && (
                                        <div className="flex justify-start mb-8 animate-in fade-in duration-300">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center">
                                                    <Bot size={18} className="text-blue-600" />
                                                </div>
                                                <div className="bg-white/80 backdrop-blur-sm border border-slate-100 px-4 py-3 rounded-2xl rounded-bl-none shadow-sm flex gap-1.5 items-center">
                                                    <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce [animation-duration:800ms]"></span>
                                                    <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce [animation-duration:800ms] [animation-delay:200ms]"></span>
                                                    <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce [animation-duration:800ms] [animation-delay:400ms]"></span>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                    <div ref={messagesEndRef} className="h-4" />
                                </div>
                            )}
                        </div>
                    </div>

                    <footer className="relative bg-transparent p-6 md:p-10 pointer-events-none">
                        <div className="max-w-3xl mx-auto w-full pointer-events-auto">
                            <SuggestedPrompts onPromptClick={(prompt) => handleSend(prompt)} />
                            <ChatInput
                                value={inputText}
                                onChange={setInputText}
                                onSend={() => handleSend()}
                                onVoiceResult={handleVoiceResult}
                            />
                            <p className="text-[10px] text-center text-slate-400 mt-6 font-bold uppercase tracking-widest opacity-60">
                                AI Assistant • Secure & Confidential • MindPulse Healthcare
                            </p>
                        </div>
                    </footer>
                </div>
            </main>
        </div>
    );
};

export default ChatbotPage;
