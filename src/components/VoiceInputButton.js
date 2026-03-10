import React, { useState, useEffect } from 'react';
import { Mic, MicOff } from 'lucide-react';

const VoiceInputButton = ({ onResult, isListening: externalIsListening }) => {
    const [isListening, setIsListening] = useState(false);

    useEffect(() => {
        setIsListening(externalIsListening);
    }, [externalIsListening]);

    const startListening = () => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            alert("Speech recognition is not supported in this browser.");
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.lang = 'en-US';
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;

        recognition.onstart = () => {
            setIsListening(true);
        };

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            onResult(transcript);
        };

        recognition.onerror = (event) => {
            console.error('Speech recognition error:', event.error);
            setIsListening(false);
        };

        recognition.onend = () => {
            setIsListening(false);
        };

        recognition.start();
    };

    return (
        <button
            type="button"
            onClick={startListening}
            className={`flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-300
        ${isListening
                    ? 'bg-red-50 text-red-500 shadow-inner'
                    : 'bg-slate-50 text-slate-500 hover:bg-slate-100'}`}
            title={isListening ? "Listening..." : "Voice input"}
        >
            {isListening ? (
                <MicOff size={18} className="animate-pulse" />
            ) : (
                <Mic size={18} />
            )}
        </button>
    );
};

export default VoiceInputButton;
