import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import ChatHeader from '../components/ChatHeader';
import ChatMessage from '../components/ChatMessage';
import ChatInput from '../components/ChatInput';
import SuggestedPrompts from '../components/SuggestedPrompts';
import { Bot, Sparkles, ShieldCheck, Heart } from 'lucide-react';

const ChatbotPage = () => {
    const [messages, setMessages] = useState([
        {
            id: 1,
            text: "Hello! I'm your MindCare Assistant. I'm here to provide a safe space for you to talk. How are you feeling today?",
            isAI: true,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
    ]);
    const [inputText, setInputText] = useState('');
    const [isTyping, setIsTyping] = useState(false);
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
        setIsTyping(true);

        // Safety Feature Check
        if (detectCrisis(text)) {
            setTimeout(() => {
                const safetyMessage = {
                    id: Date.now() + 1,
                    text: "Your wellbeing is important. Please consider reaching out to a mental health professional or trusted person. You can call or text the 988 Suicide & Crisis Lifeline anytime at 988 or visit https://988lifeline.org/.",
                    isAI: true,
                    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                };
                setMessages(prev => [...prev, safetyMessage]);
                setIsTyping(false);
            }, 1000);
            return;
        }

        // Simulate AI Response with Axios (mocking)
        try {
            setTimeout(() => {
                const aiResponse = generateSimpleResponse(text);
                const botMessage = {
                    id: Date.now() + 2,
                    text: aiResponse,
                    isAI: true,
                    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                };
                setMessages(prev => [...prev, botMessage]);
                setIsTyping(false);
            }, 1500);
        } catch (error) {
            console.error("Error sending message:", error);
            setIsTyping(false);
        }
    };

    const generateSimpleResponse = (text) => {
        const lowerText = text.toLowerCase();
        if (lowerText.includes('stress') || lowerText.includes('pressure')) {
            return "It sounds like you're carrying a lot right now. Remember to take small breaks and breathe. Would you like to try a 1-minute breathing exercise?";
        }
        if (lowerText.includes('anxiety') || lowerText.includes('anxious') || lowerText.includes('panic')) {
            return "I hear that you're feeling anxious. Try the 5-4-3-2-1 grounding technique: Name 5 things you can see, 4 things you can touch, 3 things you can hear, 2 things you can smell, and 1 thing you can taste.";
        }
        if (lowerText.includes('sleep') || lowerText.includes('insomnia') || lowerText.includes('tired')) {
            return "Sleep struggles can really impact your mood. Try keeping your room cool and dark, and avoid screens for 30 minutes before bed. Have you tried listening to calming white noise?";
        }
        if (lowerText.includes('sad') || lowerText.includes('depressed') || lowerText.includes('lonely')) {
            return "I'm sorry you're feeling this way. It's okay to sit with these feelings, but please know you're not alone. Talking about it is a brave first step.";
        }
        if (lowerText.includes('relax') || lowerText.includes('calm')) {
            return "Relaxation is a skill we can practice. Close your eyes for a moment, drop your shoulders, and relax your jaw. How does that feel?";
        }
        return "Thank you for sharing that with me. I'm here to listen. Can you tell me more about how that's been affecting you lately?";
    };

    const handleVoiceResult = (transcript) => {
        setInputText(transcript);
        handleSend(transcript);
    };

    return (
        <div className="flex flex-col h-screen bg-slate-50 overflow-hidden font-sans relative selection:bg-primary-100 italic-text-none">
            {/* Ambient Premium Glows */}
            <div className="fixed top-[-10%] right-[-10%] w-[600px] h-[600px] bg-primary-200/20 rounded-full blur-[120px] pointer-events-none animate-pulse"></div>
            <div className="fixed bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-emerald-200/20 rounded-full blur-[120px] pointer-events-none animate-pulse" style={{ animationDelay: '1s' }}></div>

            <div className="relative z-10 flex flex-col h-full max-w-5xl mx-auto w-full px-4 py-4 md:py-8">
                {/* Header Container - Glass effect */}
                <div className="glass-panel rounded-[2.5rem] mb-6 overflow-hidden premium-glow">
                    <ChatHeader />
                </div>

                {/* Messages Area */}
                <main className="flex-1 overflow-y-auto px-4 md:px-6 py-4 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
                    {messages.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-slate-400 gap-6 opacity-80 animate-in fade-in zoom-in duration-700">
                            <div className="w-24 h-24 bg-white rounded-[2rem] flex items-center justify-center shadow-xl border border-white/50">
                                <Bot size={48} className="text-primary-600" />
                            </div>
                            <div className="text-center">
                                <h3 className="text-xl font-bold text-slate-800">Your Calm Space</h3>
                                <p className="text-sm font-medium mt-1">Start a conversation with your MindCare assistant</p>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {/* Feature Indicators */}
                            <div className="flex items-center justify-center gap-4 mb-8">
                                <span className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-white/50 px-3 py-1.5 rounded-full border border-white/50">
                                    <ShieldCheck size={12} className="text-emerald-500" /> End-to-End Private
                                </span>
                                <span className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-white/50 px-3 py-1.5 rounded-full border border-white/50">
                                    <Heart size={12} className="text-rose-500" /> Empathetic AI
                                </span>
                            </div>

                            {messages.map((msg) => (
                                <ChatMessage
                                    key={msg.id}
                                    message={msg.text}
                                    isAI={msg.isAI}
                                    timestamp={msg.timestamp}
                                />
                            ))}
                            {isTyping && (
                                <div className="flex justify-start mb-10 animate-in fade-in slide-in-from-left-2 duration-300">
                                    <div className="bg-white/80 backdrop-blur-sm border border-slate-100 p-5 rounded-[2rem] rounded-bl-none shadow-sm flex gap-1.5 items-center">
                                        <span className="w-2 h-2 bg-primary-400 rounded-full animate-bounce [animation-duration:800ms]"></span>
                                        <span className="w-2 h-2 bg-primary-400 rounded-full animate-bounce [animation-duration:800ms] [animation-delay:150ms]"></span>
                                        <span className="w-2 h-2 bg-primary-400 rounded-full animate-bounce [animation-duration:800ms] [animation-delay:300ms]"></span>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>
                    )}
                </main>

                {/* Footer Container - Glass effect */}
                <footer className="mt-4 px-4 pb-4 md:px-0 md:pb-0">
                    <div className="backdrop-blur-2xl bg-white/80 border border-white/40 p-6 rounded-[2.5rem] shadow-2xl shadow-slate-300/40 relative overflow-hidden group">
                        {/* Interactive Suggestion Label */}
                        <div className="flex items-center gap-2 mb-4 px-1">
                            <div className="w-6 h-6 rounded-lg bg-primary-100 flex items-center justify-center">
                                <Sparkles size={14} className="text-primary-600 animate-pulse" />
                            </div>
                            <span className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] transition-colors group-hover:text-primary-600">
                                Personalized Suggestions
                            </span>
                        </div>

                        <div className="max-w-4xl mx-auto w-full">
                            <SuggestedPrompts onPromptClick={(prompt) => handleSend(prompt)} />
                            <div className="mt-5">
                                <ChatInput
                                    value={inputText}
                                    onChange={setInputText}
                                    onSend={() => handleSend()}
                                    onVoiceResult={handleVoiceResult}
                                />
                            </div>
                            <p className="text-[10px] text-center text-slate-400 mt-4 font-bold uppercase tracking-wider opacity-60">
                                Safe & Secure AI Support • Always here to listen
                            </p>
                        </div>
                    </div>
                </footer>
            </div>
        </div>
    );
};

export default ChatbotPage;
