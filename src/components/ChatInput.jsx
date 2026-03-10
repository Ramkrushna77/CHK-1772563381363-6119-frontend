import { Send } from 'lucide-react';
import VoiceInputButton from './VoiceInputButton';

export default function ChatInput({ input, setInput, onSendMessage, isListening, setIsListening }) {
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!input.trim()) return;
        onSendMessage(input);
    };

    return (
        <div className="bg-white p-4 border-t border-slate-100 pb-8">
            <form onSubmit={handleSubmit} className="max-w-4xl mx-auto flex items-center space-x-3">
                <VoiceInputButton
                    onSpeechResult={(text) => setInput(text)}
                    isListening={isListening}
                    setIsListening={setIsListening}
                />

                <div className="flex-1 relative">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Type your message..."
                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 px-5 pr-12 focus:outline-none focus:ring-2 focus:ring-[#204E4A]/20 focus:border-[#204E4A] transition-all duration-200 text-slate-700 placeholder:text-slate-400"
                    />
                    <button
                        type="submit"
                        disabled={!input.trim()}
                        className={`absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-xl transition-all duration-200 ${input.trim()
                                ? 'bg-[#204E4A] text-white shadow-md'
                                : 'bg-slate-200 text-white cursor-not-allowed'
                            }`}
                    >
                        <Send className="w-4 h-4" />
                    </button>
                </div>
            </form>
            <p className="text-center text-[10px] text-slate-400 mt-4 uppercase tracking-[0.1em] font-medium">
                Mental Health Assistant AI • Always here to listen
            </p>
        </div>
    );
}
