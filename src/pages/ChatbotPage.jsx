import { useState, useEffect, useRef } from 'react';
import ChatHeader from '../components/ChatHeader';
import ChatMessage from '../components/ChatMessage';
import ChatInput from '../components/ChatInput';
import SuggestedPrompts from '../components/SuggestedPrompts';

export default function ChatbotPage() {
    const [messages, setMessages] = useState([
        {
            id: 1,
            text: "Hello! I'm your Mental Health Assistant. How are you feeling today?",
            isAi: true,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    const checkSafety = (text) => {
        const concerningKeywords = [
            'hurt myself', 'end it', 'suicide', 'die', 'kill myself',
            'self harm', 'no reason to live', 'hopeless', 'giving up'
        ];
        return concerningKeywords.some(keyword => text.toLowerCase().includes(keyword));
    };

    const generateAiResponse = (userMessage) => {
        const text = userMessage.toLowerCase();

        if (checkSafety(text)) {
            return "Your wellbeing is extremely important. If you're feeling overwhelmed or having thoughts of self-harm, please consider reaching out to a professional immediately. You're not alone. Would you like me to help you find crisis contact information?";
        }

        if (text.includes('stressed') || text.includes('stress')) {
            return "I'm sorry to hear you're feeling stressed. Take a deep breath. Would you like to try a short breathing exercise or talk about what's on your mind?";
        }
        if (text.includes('anxiety') || text.includes('anxious')) {
            return "Anxiety can be very tough. Remember to ground yourself—try naming 5 things you can see and 4 things you can feel right now.";
        }
        if (text.includes('sleep') || text.includes('insomnia')) {
            return "Difficulty sleeping often stems from an overactive mind. Try keeping your room dark and cool, and avoiding screens for an hour before bed.";
        }
        if (text.includes('relax') || text.includes('calm')) {
            return "Let's focus on relaxation. Close your eyes for a moment and imagine a place where you feel completely safe and serene.";
        }
        if (text.includes('hello') || text.includes('hi')) {
            return "Hello! I'm here to support you. Is there anything specific on your mind today?";
        }

        return "Thank you for sharing that with me. I'm listening. Could you tell me more about how that makes you feel?";
    };

    const handleSendMessage = async (text) => {
        const userMsg = {
            id: Date.now(),
            text,
            isAi: false,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsTyping(true);

        // Simulate AI thinking time
        setTimeout(() => {
            const responseText = generateAiResponse(text);
            const aiMsg = {
                id: Date.now() + 1,
                text: responseText,
                isAi: true,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };
            setMessages(prev => [...prev, aiMsg]);
            setIsTyping(false);
        }, 1500);
    };

    return (
        <div className="flex flex-col h-screen bg-slate-50 overflow-hidden">
            <ChatHeader />

            {/* Chat Messages Area */}
            <main className="flex-1 overflow-y-auto px-4 py-8 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto">
                    {messages.map((msg) => (
                        <ChatMessage
                            key={msg.id}
                            message={msg.text}
                            isAi={msg.isAi}
                            timestamp={msg.timestamp}
                        />
                    ))}

                    {isTyping && (
                        <div className="flex justify-start mb-6">
                            <div className="bg-white border border-slate-100 py-3 px-5 rounded-2xl rounded-tl-none shadow-sm flex items-center space-x-1">
                                <div className="w-1.5 h-1.5 bg-[#204E4A] rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                <div className="w-1.5 h-1.5 bg-[#204E4A] rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                <div className="w-1.5 h-1.5 bg-[#204E4A] rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                            </div>
                        </div>
                    )}

                    <div ref={messagesEndRef} />
                </div>
            </main>

            {/* Bottom Area: Prompts + Input */}
            <footer className="w-full">
                <SuggestedPrompts onPromptClick={handleSendMessage} />
                <ChatInput
                    input={input}
                    setInput={setInput}
                    onSendMessage={handleSendMessage}
                    isListening={isListening}
                    setIsListening={setIsListening}
                />
            </footer>
        </div>
    );
}
