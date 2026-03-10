import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mic, ChevronRight, ChevronLeft, Camera, Activity, MicOff, AlertCircle } from 'lucide-react';
import * as faceapi from 'face-api.js';
import { auth, db } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';

const QUESTIONS = [
    { id: 'q1', text: 'How often do you feel anxious or overwhelmed?', options: ['Never', 'Rarely', 'Sometimes', 'Often', 'Constantly'] },
    { id: 'q2', text: 'How is your sleep quality recently?', options: ['Very Good', 'Good', 'Fair', 'Poor', 'Very Poor'] },
    { id: 'q3', text: 'Do you feel low or depressed frequently?', options: ['Not at all', 'Several days', 'More than half the days', 'Nearly every day'] },
    { id: 'q4', text: 'How would you rate your ability to concentrate?', options: ['Excellent', 'Good', 'Fair', 'Poor', 'Very Poor'] },
    { id: 'q5', text: 'Do you experience sudden mood swings?', options: ['Never', 'Rarely', 'Sometimes', 'Often', 'Very Often'] },
    { id: 'q6', text: 'How is your appetite lately?', options: ['Normal', 'Slightly changed', 'Moderately changed', 'Significantly changed'] },
    { id: 'q7', text: 'Do you feel socially withdrawn or isolated?', options: ['Never', 'Rarely', 'Sometimes', 'Often', 'Always'] },
];

const EMOTION_COLORS = {
    happy: 'text-emerald-400',
    neutral: 'text-blue-400',
    sad: 'text-indigo-400',
    angry: 'text-red-400',
    fearful: 'text-amber-400',
    disgusted: 'text-yellow-400',
    surprised: 'text-purple-400',
};

export default function AssessmentPage() {
    const navigate = useNavigate();
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const streamRef = useRef(null);
    const intervalRef = useRef(null);

    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState({});
    const [detectedEmotion, setDetectedEmotion] = useState('Initializing...');
    const [cameraError, setCameraError] = useState(null);
    const [modelsLoaded, setModelsLoaded] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const progress = ((currentQuestion + 1) / QUESTIONS.length) * 100;

    // Load face-api.js models
    useEffect(() => {
        const loadModels = async () => {
            const MODEL_URL = '/models';
            try {
                await Promise.all([
                    faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
                    faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
                ]);
                setModelsLoaded(true);
            } catch (error) {
                console.warn('face-api models not found. Webcam emotion detection disabled.', error);
                setModelsLoaded(false);
                setDetectedEmotion('Models unavailable');
            }
        };
        loadModels();
    }, []);

    // Start webcam
    useEffect(() => {
        const startCamera = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: true });
                streamRef.current = stream;
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                }
            } catch (err) {
                console.warn('Camera access denied:', err);
                setCameraError('Camera access denied or unavailable. The questionnaire is still functional.');
                setDetectedEmotion('Camera unavailable');
            }
        };
        startCamera();

        return () => {
            if (streamRef.current) {
                streamRef.current.getTracks().forEach(t => t.stop());
            }
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, []);

    // Run face detection loop when models are loaded
    useEffect(() => {
        if (!modelsLoaded) return;

        intervalRef.current = setInterval(async () => {
            if (!videoRef.current || videoRef.current.readyState !== 4) return;
            try {
                const detections = await faceapi
                    .detectSingleFace(videoRef.current, new faceapi.TinyFaceDetectorOptions())
                    .withFaceExpressions();

                if (detections) {
                    const expressions = detections.expressions;
                    const dominant = Object.entries(expressions).sort((a, b) => b[1] - a[1])[0];
                    setDetectedEmotion(dominant[0].charAt(0).toUpperCase() + dominant[0].slice(1));
                } else {
                    setDetectedEmotion('No face detected');
                }
            } catch (err) { // eslint-disable-line no-unused-vars
                // Silently ignore detection errors
            }
        }, 1500);

        return () => clearInterval(intervalRef.current);
    }, [modelsLoaded]);

    // Voice Input using Web Speech API
    const handleVoiceInput = () => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            alert('Voice input is not supported in your browser. Try Chrome.');
            return;
        }
        const recognition = new SpeechRecognition();
        recognition.lang = 'en-US';
        recognition.onstart = () => setIsListening(true);
        recognition.onend = () => setIsListening(false);
        recognition.onerror = () => setIsListening(false);
        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript.trim().toLowerCase();
            const current = QUESTIONS[currentQuestion];
            const matched = current.options.find(opt => transcript.includes(opt.toLowerCase()));
            if (matched) {
                setAnswers(prev => ({ ...prev, [current.id]: matched }));
            }
        };
        recognition.start();
    };

    const handleOptionSelect = (option) => {
        setAnswers(prev => ({ ...prev, [QUESTIONS[currentQuestion].id]: option }));
    };

    const handleNext = async () => {
        if (currentQuestion < QUESTIONS.length - 1) {
            setCurrentQuestion(c => c + 1);
        } else {
            // Submit assessment
            setSubmitting(true);
            const user = auth.currentUser;
            const assessmentData = {
                answers,
                dominantEmotion: detectedEmotion,
                completedAt: new Date().toISOString(),
                userId: user?.uid || 'anonymous',
            };
            try {
                if (user) {
                    await addDoc(collection(db, 'assessments'), assessmentData);
                }
            } catch (e) {
                console.error('Failed to save assessment:', e);
            }
            // Pass data via navigation state
            navigate('/report', { state: { answers, emotion: detectedEmotion } });
        }
    };

    const handlePrevious = () => {
        if (currentQuestion > 0) setCurrentQuestion(c => c - 1);
    };

    const emotionColorClass = EMOTION_COLORS[detectedEmotion.toLowerCase()] || 'text-slate-400';

    return (
        <div className="min-h-screen bg-slate-50 relative selection:bg-primary-100 italic-text-none overflow-hidden">
            {/* Ambient Premium Glows */}
            <div className="fixed top-[-10%] right-[-10%] w-[600px] h-[600px] bg-primary-100/20 rounded-full blur-[120px] pointer-events-none"></div>
            <div className="fixed bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-emerald-100/20 rounded-full blur-[120px] pointer-events-none"></div>

            <div className="relative z-10 flex flex-col md:flex-row min-h-screen">
                {/* Left: Questionnaire */}
                <div className="md:w-3/5 p-6 md:p-16 flex flex-col justify-center relative z-10">
                    <div className="max-w-2xl mx-auto w-full glass-panel rounded-[3.5rem] p-12 md:p-16 shadow-2xl shadow-slate-200/40 relative overflow-hidden group border-none bg-white/70">
                        <div className="absolute top-0 right-0 p-12 opacity-[0.03] pointer-events-none group-hover:scale-110 transition-transform duration-1000">
                            <BrainCircuit size={160} />
                        </div>

                        {/* Progress */}
                        <div className="mb-12 relative z-10">
                            <div className="flex justify-between items-end mb-6">
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Probe Vector</p>
                                    <h1 className="text-3xl font-black text-slate-900 tracking-tighter italic">Clinical Intake</h1>
                                </div>
                                <span className="text-xl font-black text-primary-600 italic">
                                    {currentQuestion + 1} <span className="text-slate-300">/ {QUESTIONS.length}</span>
                                </span>
                            </div>
                            <div className="w-full bg-slate-200/50 rounded-full h-2 p-[2px] border border-slate-200/50">
                                <div
                                    className="bg-gradient-to-r from-primary-600 to-indigo-600 h-full rounded-full transition-all duration-700 ease-out shadow-[0_0_10px_rgba(37,99,235,0.3)]"
                                    style={{ width: `${progress}%` }}
                                />
                            </div>
                        </div>

                        {/* Question */}
                        <div className="mb-12 min-h-[220px] relative z-10">
                            <div className="flex justify-between items-start mb-6">
                                <span className="inline-block px-4 py-1.5 rounded-xl bg-primary-50 text-primary-600 font-black text-[10px] uppercase tracking-widest border border-primary-100/50">Probe-0{currentQuestion + 1}</span>
                                <button
                                    onClick={handleVoiceInput}
                                    title="Speak your answer"
                                    className={`p-3 rounded-2xl transition-all shadow-sm ${isListening ? 'bg-red-500 text-white animate-pulse shadow-red-200' : 'text-slate-400 hover:text-primary-600 bg-white hover:bg-primary-50 border border-slate-100'}`}
                                >
                                    {isListening ? <MicOff size={20} /> : <Mic size={20} />}
                                </button>
                            </div>
                            <h3 className="text-2xl md:text-[32px] font-black text-slate-900 leading-[1.1] italic tracking-tighter mb-8">
                                {QUESTIONS[currentQuestion].text}
                            </h3>

                            <div className="grid grid-cols-1 gap-3">
                                {QUESTIONS[currentQuestion].options.map((option) => (
                                    <button
                                        key={option}
                                        onClick={() => handleOptionSelect(option)}
                                        className={`group/opt relative text-left p-6 rounded-[2rem] border-2 transition-all flex items-center justify-between overflow-hidden ${answers[QUESTIONS[currentQuestion].id] === option
                                            ? 'border-primary-600 bg-primary-50/50 ring-8 ring-primary-100 shadow-xl'
                                            : 'border-slate-50 bg-slate-50/50 hover:bg-white hover:border-primary-200 hover:shadow-lg'
                                            }`}
                                    >
                                        <span className={`text-lg font-black transition-colors ${answers[QUESTIONS[currentQuestion].id] === option ? 'text-primary-600' : 'text-slate-600'
                                            }`}>
                                            {option}
                                        </span>
                                        <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${answers[QUESTIONS[currentQuestion].id] === option
                                            ? 'bg-primary-600 border-primary-600 text-white scale-110'
                                            : 'border-slate-200 text-transparent group-hover/opt:border-primary-300'
                                            }`}>
                                            <ChevronRight size={16} />
                                        </div>
                                        {answers[QUESTIONS[currentQuestion].id] === option && (
                                            <div className="absolute top-0 right-0 w-32 h-32 bg-primary-100 rounded-full -translate-y-1/2 translate-x-1/2 opacity-20"></div>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Navigation */}
                        <div className="flex gap-4 pt-8 border-t border-slate-100 relative z-10">
                            <button
                                onClick={handlePrevious}
                                disabled={currentQuestion === 0}
                                className="flex-1 px-8 py-5 rounded-[2rem] border-2 border-slate-100 text-slate-400 font-black uppercase text-[11px] tracking-widest hover:border-slate-200 hover:text-slate-600 disabled:opacity-30 disabled:hover:border-slate-100 transition-all active:scale-95"
                            >
                                Previous Probe
                            </button>
                            <button
                                onClick={handleNext}
                                disabled={!answers[QUESTIONS[currentQuestion].id] || submitting}
                                className="flex-[2] bg-primary-600 text-white px-8 py-5 rounded-[2rem] font-black uppercase text-[11px] tracking-widest hover:bg-primary-700 transition-all shadow-xl shadow-primary-200 active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3"
                            >
                                {submitting ? 'Encapsulating...' : currentQuestion === QUESTIONS.length - 1 ? 'Finalize Analysis' : 'Next Probe'}
                                <ChevronRight size={18} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Right: Camera Panel */}
                <div className="md:w-2/5 md:min-h-screen flex flex-col justify-center p-6 md:p-16 relative">
                    <div className="glass-panel rounded-[3.5rem] p-10 shadow-2xl relative overflow-hidden group border-none bg-white/70 premium-glow">
                        <div className="absolute top-0 left-0 p-10 opacity-[0.03] pointer-events-none group-hover:scale-110 transition-transform duration-1000">
                            <Activity size={120} />
                        </div>

                        <div className="relative z-10 space-y-8">
                            <div className="text-center">
                                <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-primary-50 text-primary-600 text-[10px] font-black uppercase tracking-[0.2em] mb-6">
                                    <Activity className="h-4 w-4" />
                                    <span>Neural Sync Active</span>
                                </div>
                                <h3 className="text-2xl font-black text-slate-900 tracking-tighter italic">Live Calibration</h3>
                                <p className="text-slate-500 text-xs mt-2 font-medium">Emotional telemetry is being processed locally via your camera feed.</p>
                            </div>

                            {/* Camera Preview */}
                            <div className="aspect-square bg-slate-100 rounded-[2.5rem] relative overflow-hidden shadow-inner border-4 border-white/50 group/cam">
                                <video
                                    ref={videoRef}
                                    autoPlay
                                    muted
                                    playsInline
                                    className="w-full h-full object-cover grayscale opacity-80 group-hover/cam:grayscale-0 group-hover/cam:opacity-100 transition-all duration-700"
                                />
                                <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
                                <div className="absolute inset-0 border-[20px] border-white/20 pointer-events-none rounded-[2.5rem]"></div>
                                {cameraError && (
                                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-50 p-6 text-center">
                                        <Camera className="w-12 h-12 text-slate-300 mb-3" />
                                        <p className="text-xs text-slate-400 font-medium">{cameraError}</p>
                                    </div>
                                )}
                            </div>

                            {/* Emotion Status */}
                            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex items-center justify-between">
                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Telemetry</span>
                                <div className="flex items-center gap-3">
                                    <div className={`w-2 h-2 rounded-full animate-pulse ${emotionColorClass.replace('text-', 'bg-')}`} />
                                    <span className={`text-sm font-black italic tracking-tighter ${emotionColorClass}`}>
                                        {detectedEmotion}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Disclaimer & Decorative Elements */}
            <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-20 flex items-start gap-3 bg-white/80 backdrop-blur px-6 py-3 rounded-2xl border border-slate-100 shadow-xl opacity-60 hover:opacity-100 transition-opacity">
                <AlertCircle className="w-4 h-4 text-slate-400 mt-0.5" />
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-relaxed">Telemetry processing is restricted to local hardware. Analysis does not constitute surgical or pharmacological advice.</p>
            </div>
        </div>
    );
}
