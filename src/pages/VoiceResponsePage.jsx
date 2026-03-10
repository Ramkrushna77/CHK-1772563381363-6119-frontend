import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { RotateCcw, Send, ArrowLeft } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import VoiceQuestion from '../components/VoiceQuestion';
import VoiceMicButton from '../components/VoiceMicButton';
import VoiceSignalIndicator from '../components/VoiceSignalIndicator';
import TranscriptDisplay from '../components/TranscriptDisplay';

export default function VoiceResponsePage() {
    const navigate = useNavigate();
    const [isRecording, setIsRecording] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [error, setError] = useState('');
    const [isSupported, setIsSupported] = useState(true);
    
    const recognitionRef = useRef(null);
    const silenceTimerRef = useRef(null);

    const question = "Please describe how you are feeling today.";

    useEffect(() => {
        // Check if browser supports Speech Recognition
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        
        if (!SpeechRecognition) {
            setIsSupported(false);
            setError('Speech recognition is not supported in your browser. Please use Chrome, Edge, or Safari.');
            return;
        }

        // Initialize Speech Recognition
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onstart = () => {
            setIsRecording(true);
            setError('');
        };

        recognition.onresult = (event) => {
            let finalTranscript = '';
            let interimTranscript = '';

            for (let i = event.resultIndex; i < event.results.length; i++) {
                const transcriptPiece = event.results[i][0].transcript;
                if (event.results[i].isFinal) {
                    finalTranscript += transcriptPiece + ' ';
                } else {
                    interimTranscript += transcriptPiece;
                }
            }

            if (finalTranscript) {
                setTranscript(prev => prev + finalTranscript);
                
                // Reset silence timer
                if (silenceTimerRef.current) {
                    clearTimeout(silenceTimerRef.current);
                }
                
                // Auto-stop after 3 seconds of silence
                silenceTimerRef.current = setTimeout(() => {
                    stopRecording();
                }, 3000);
            } else if (interimTranscript) {
                setTranscript(prev => prev + interimTranscript);
            }
        };

        recognition.onerror = (event) => {
            console.error('Speech recognition error:', event.error);
            
            if (event.error === 'no-speech') {
                setError('No speech detected. Please try again.');
            } else if (event.error === 'not-allowed') {
                setError('Microphone access denied. Please allow microphone permissions.');
            } else {
                setError(`Error: ${event.error}. Please try again.`);
            }
            
            setIsRecording(false);
        };

        recognition.onend = () => {
            setIsRecording(false);
            if (silenceTimerRef.current) {
                clearTimeout(silenceTimerRef.current);
            }
        };

        recognitionRef.current = recognition;

        return () => {
            if (recognitionRef.current) {
                recognitionRef.current.stop();
            }
            if (silenceTimerRef.current) {
                clearTimeout(silenceTimerRef.current);
            }
        };
    }, []);

    const startRecording = () => {
        if (!isSupported) {
            return;
        }

        try {
            if (recognitionRef.current && !isRecording) {
                recognitionRef.current.start();
            }
        } catch (error) {
            console.error('Error starting recording:', error);
            setError('Failed to start recording. Please try again.');
        }
    };

    const stopRecording = () => {
        try {
            if (recognitionRef.current && isRecording) {
                recognitionRef.current.stop();
            }
        } catch (error) {
            console.error('Error stopping recording:', error);
        }
    };

    const toggleRecording = () => {
        if (isRecording) {
            stopRecording();
        } else {
            startRecording();
        }
    };

    const handleRecordAgain = () => {
        stopRecording();
        setTranscript('');
        setError('');
    };

    const handleSubmit = () => {
        if (!transcript.trim()) {
            setError('Please record your response before submitting.');
            return;
        }

        stopRecording();
        
        // Store the transcript in localStorage or state management
        localStorage.setItem('voiceResponse', transcript);
        
        // Navigate to next page (you can customize this)
        alert('Response submitted successfully!\n\nYour response: ' + transcript);
        // navigate('/assessment'); // Uncomment to navigate to assessment page
    };

    const handleBack = () => {
        stopRecording();
        navigate(-1);
    };

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-white to-primary-50">
            <Navbar />
            
            <main className="flex-grow container mx-auto px-4 py-12">
                <div className="max-w-4xl mx-auto">
                    {/* Back Button */}
                    <button
                        onClick={handleBack}
                        className="mb-6 inline-flex items-center gap-2 text-slate-600 hover:text-primary-600 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        <span className="font-medium">Back</span>
                    </button>

                    {/* Question */}
                    <div className="mb-8">
                        <VoiceQuestion question={question} />
                    </div>

                    {/* Voice Recording Section */}
                    <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8 mb-6">
                        <div className="flex flex-col items-center space-y-6">
                            {/* Voice Signal Indicator */}
                            <VoiceSignalIndicator isRecording={isRecording} />

                            {/* Microphone Button */}
                            <div className="flex flex-col items-center gap-3">
                                <VoiceMicButton
                                    isRecording={isRecording}
                                    onClick={toggleRecording}
                                    disabled={!isSupported}
                                />
                                <p className="text-sm text-slate-600 font-medium">
                                    {isRecording ? 'Click to stop recording' : 'Click to start recording'}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Transcript Display */}
                    <div className="mb-6">
                        <TranscriptDisplay
                            transcript={transcript}
                            isRecording={isRecording}
                            error={error}
                        />
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-4 justify-center">
                        <button
                            onClick={handleRecordAgain}
                            disabled={!transcript && !error}
                            className="inline-flex items-center gap-2 px-6 py-3 bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <RotateCcw className="w-5 h-5" />
                            Record Again
                        </button>

                        <button
                            onClick={handleSubmit}
                            disabled={!transcript.trim() || isRecording}
                            className="inline-flex items-center gap-2 px-8 py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-xl shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Send className="w-5 h-5" />
                            Submit Response
                        </button>
                    </div>

                    {/* Browser Compatibility Note */}
                    {!isSupported && (
                        <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                            <p className="text-sm text-amber-800 text-center">
                                💡 For best experience, please use Google Chrome, Microsoft Edge, or Safari browser.
                            </p>
                        </div>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
}
