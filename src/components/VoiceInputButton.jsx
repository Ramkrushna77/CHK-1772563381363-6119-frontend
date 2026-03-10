import { Mic } from 'lucide-react';

export default function VoiceInputButton({ onSpeechResult, isListening, setIsListening }) {
    const handleVoiceInput = () => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            alert("Your browser doesn't support speech to text.");
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';

        recognition.onstart = () => setIsListening(true);

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            onSpeechResult(transcript);
            setIsListening(false);
        };

        recognition.onerror = (event) => {
            console.error("Speech recognition error:", event.error);
            setIsListening(false);
        };

        recognition.onend = () => setIsListening(false);

        recognition.start();
    };

    return (
        <button
            type="button"
            onClick={handleVoiceInput}
            className={`p-3 rounded-xl transition-all duration-200 ${isListening
                    ? 'bg-red-500 text-white animate-pulse scale-110 shadow-lg'
                    : 'bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-[#204E4A]'
                }`}
            title={isListening ? "Listening..." : "Speak message"}
        >
            <Mic className={`w-5 h-5 ${isListening ? 'animate-bounce' : ''}`} />
        </button>
    );
}
