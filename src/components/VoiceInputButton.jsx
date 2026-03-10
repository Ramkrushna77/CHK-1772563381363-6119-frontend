import React, { useState } from 'react';
import { Mic, MicOff } from 'lucide-react';

const VoiceInputButton = ({ onResult }) => {
    const [isListening, setIsListening] = useState(false);

    const startListening = () => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) return;

        const recognition = new SpeechRecognition();
        recognition.lang = 'en-US';

        recognition.onstart = () => setIsListening(true);
        recognition.onresult = (event) => onResult(event.results[0][0].transcript);
        recognition.onerror = () => setIsListening(false);
        recognition.onend = () => setIsListening(false);

        recognition.start();
    };

    return (
        <button
            type="button"
            onClick={startListening}
            className={`flex items-center justify-center w-8 h-8 rounded-lg transition-all 
        ${isListening ? 'bg-red-50 text-red-500' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'}`}
        >
            {isListening ? <MicOff size={16} className="animate-pulse" /> : <Mic size={16} />}
        </button>
    );
};

export default VoiceInputButton;
