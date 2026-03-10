import { Mic, MicOff } from 'lucide-react';

export default function VoiceMicButton({ isRecording, onClick, disabled }) {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`relative w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed ${
                isRecording
                    ? 'bg-red-600 hover:bg-red-700 shadow-lg shadow-red-300 animate-pulse'
                    : 'bg-primary-600 hover:bg-primary-700 shadow-lg shadow-primary-300'
            }`}
            aria-label={isRecording ? 'Stop recording' : 'Start recording'}
        >
            {isRecording ? (
                <>
                    <MicOff className="w-8 h-8 text-white" />
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full animate-ping"></span>
                </>
            ) : (
                <Mic className="w-8 h-8 text-white" />
            )}
        </button>
    );
}
