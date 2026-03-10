import { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, X, Bot, User, Minimize2 } from 'lucide-react';
import { auth } from '../firebase';

export default function Chatbot() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { id: 1, text: "Hi there! I'm MindCare AI. How can I help you with your mental wellbeing today?", sender: 'bot', time: new Date() }
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        const handleOpen = () => setIsOpen(true);
        window.addEventListener('open-chatbot', handleOpen);
        return () => window.removeEventListener('open-chatbot', handleOpen);
    }, []);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        if (isOpen) scrollToBottom();
    }, [messages, isOpen]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMsg = { id: Date.now(), text: input, sender: 'user', time: new Date() };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsTyping(true);

        // Simulate AI Response
        setTimeout(() => {
            const botResponse = generateResponse(input);
            setMessages(prev => [...prev, { id: Date.now() + 1, text: botResponse, sender: 'bot', time: new Date() }]);
            setIsTyping(false);
        }, 1500);
    };

    const generateResponse = (text) => {
        const lowerText = text.toLowerCase();
        if (lowerText.includes('hello') || lowerText.includes('hi')) return "Hello! I'm here to listen and support you. How are you feeling right now?";
        if (lowerText.includes('anxious') || lowerText.includes('anxiety')) return "I'm sorry you're feeling anxious. Take a deep breath with me. Breathe in for 4 seconds, hold for 4, and exhale for 4. Would you like to try a quick grounding exercise?";
        if (lowerText.includes('sleep')) return "Quality sleep is vital for mental health. Try to limit screen time hour before bed and keep your room cool and dark. Have you tried a consistent sleep schedule?";
        if (lowerText.includes('sad') || lowerText.includes('depress')) return "I'm sorry to hear you're feeling this way. It's okay to not be okay. Remember that you're not alone, and talking to someone can help. Have you considered looking at our suggested doctors?";
        if (lowerText.includes('thank')) return "You're very welcome! I'm always here if you need to talk.";
        return "That's interesting. Tell me more about how that makes you feel. I'm here to support your mental health journey.";
    };

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-6 right-6 w-14 h-14 bg-primary-600 text-white rounded-full flex items-center justify-center shadow-2xl hover:bg-primary-700 transition-all hover:scale-110 z-50 group"
            >
                <MessageSquare className="w-6 h-6 group-hover:animate-pulse" />
                <span className="absolute -top-2 -right-2 bg-red-500 w-5 h-5 rounded-full text-[10px] flex items-center justify-center font-bold border-2 border-white">1</span>
            </button>
        );
    }

    return (
        <div className="fixed bottom-6 right-6 w-[90vw] sm:w-[380px] h-[500px] bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col z-50 overflow-hidden animate-in slide-in-from-bottom-5 duration-300">
            {/* Header */}
            <div className="bg-primary-600 p-4 text-white flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                        <Bot className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="font-bold text-sm">MindCare Assistant</h3>
                        <div className="flex items-center gap-1.5">
                            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
                            <span className="text-[10px] text-primary-100">AI Support Online</span>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-white/10 rounded-lg transition-colors">
                        <Minimize2 className="w-5 h-5" />
                    </button>
                    <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-white/10 rounded-lg transition-colors text-primary-100">
                        <X className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
                {messages.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[80%] flex gap-2 ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.sender === 'user' ? 'bg-primary-100 text-primary-600' : 'bg-white text-slate-400 shadow-sm border border-slate-100'}`}>
                                {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                            </div>
                            <div className={`p-3 rounded-2xl text-sm ${msg.sender === 'user'
                                ? 'bg-primary-600 text-white rounded-tr-none shadow-md'
                                : 'bg-white text-slate-700 rounded-tl-none border border-slate-200 shadow-sm'
                                }`}>
                                {msg.text}
                                <div className={`text-[10px] mt-1 ${msg.sender === 'user' ? 'text-primary-200' : 'text-slate-400'}`}>
                                    {msg.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
                {isTyping && (
                    <div className="flex justify-start">
                        <div className="bg-white border border-slate-200 p-3 rounded-2xl rounded-tl-none flex gap-1 items-center shadow-sm">
                            <span className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce"></span>
                            <span className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce delay-100"></span>
                            <span className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce delay-200"></span>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form onSubmit={handleSend} className="p-4 bg-white border-t border-slate-100 flex gap-2">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-1 bg-slate-50 border-none rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-primary-500 transition-all"
                />
                <button
                    type="submit"
                    disabled={!input.trim()}
                    className="bg-primary-600 text-white p-2 rounded-xl hover:bg-primary-700 disabled:opacity-50 transition-colors shadow-sm"
                >
                    <Send className="w-5 h-5" />
                </button>
            </form>
        </div>
    );
}
