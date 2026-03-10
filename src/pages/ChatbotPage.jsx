import { useState, useEffect, useRef } from 'react';
import { Bot } from 'lucide-react';
import ChatHeader from '../components/ChatHeader';
import ChatMessage from '../components/ChatMessage';
import ChatInput from '../components/ChatInput';
import SuggestedPrompts from '../components/SuggestedPrompts';
import { sendMessage } from '../services/api';

const ChatbotPage = () => {
    const [messages, setMessages] = useState([
        {
            id: 1,
            text: "Hello! I'm your Mental Health Assistant. I'm here to provide a safe space for you to talk. How are you feeling today?",
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
                    text: "Your wellbeing is important. Please consider reaching out to a mental health professional or trusted person. You can call or text the 988 Suicide & Crisis Lifeline anytime at 988 or visit https://988lifeline.org/.",
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
                text: response?.answer || "I'm here with you. Please share more if you'd like.",
                isAI: true,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };
            setMessages(prev => [...prev, botMessage]);
        } catch (error) {
            console.error("Error sending message:", error);
            setError(error.message || 'Could not reach backend chat service.');

            const fallbackMessage = {
                id: Date.now() + 2,
                text: 'I am unable to connect right now. Please try again shortly.',
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
        // Optionally auto-send voice transcript
        // handleSend(transcript);
    };

    return (
        <div className="flex flex-col h-screen bg-slate-50 overflow-hidden font-sans">
            <ChatHeader />

            <main className="flex-1 overflow-y-auto px-4 md:px-8 py-6 max-w-4xl mx-auto w-full scrollbar-thin scrollbar-thumb-slate-200">
                {error && (
                    <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                        {error}
                    </div>
                )}
                {messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-slate-400 gap-4 opacity-60">
                        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm">
                            <Bot size={32} />
                        </div>
                        <p className="text-sm font-medium">Start a conversation with your assistant</p>
                    </div>
                ) : (
                    <>
                        {messages.map((msg) => (
                            <ChatMessage
                                key={msg.id}
                                message={msg.text}
                                isAI={msg.isAI}
                                timestamp={msg.timestamp}
                            />
                        ))}
                        {isTyping && (
                            <div className="flex justify-start mb-6 animate-pulse">
                                <div className="bg-white border border-slate-100 p-4 rounded-2xl rounded-bl-sm shadow-sm flex gap-1">
                                    <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce"></span>
                                    <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                                    <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </>
                )}
            </main>

            <footer className="bg-white border-t border-slate-100 p-4 sticky bottom-0 z-10">
                <div className="max-w-4xl mx-auto w-full">
                    <SuggestedPrompts onPromptClick={(prompt) => handleSend(prompt)} />
                    <ChatInput
                        value={inputText}
                        onChange={setInputText}
                        onSend={() => handleSend()}
                        onVoiceResult={handleVoiceResult}
                    />
                    <p className="text-[10px] text-center text-slate-400 mt-3 font-medium tracking-tight">
                        Our assistant is here to support you, but it is not a substitute for professional medical advice.
                    </p>
                </div>
            </footer>
        </div>
    );
};

export default ChatbotPage;
