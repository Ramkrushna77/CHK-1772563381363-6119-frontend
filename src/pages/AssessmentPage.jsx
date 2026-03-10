import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mic, ChevronRight, ChevronLeft, Camera, Activity, MicOff, AlertCircle } from 'lucide-react';
import * as faceapi from 'face-api.js';
import { auth, db } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';
import { detectEmotion, analyzeSpeech } from '../services/api';

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
    const mediaRecorderRef = useRef(null);
    const audioChunksRef = useRef([]);

    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState({});
    const [detectedEmotion, setDetectedEmotion] = useState('Initializing...');
    const [cameraError, setCameraError] = useState(null);
    const [modelsLoaded, setModelsLoaded] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [emotionLoading, setEmotionLoading] = useState(false);
    const [emotionError, setEmotionError] = useState('');
    const [speechEmotion, setSpeechEmotion] = useState('Not analyzed');
    const [speechConfidence, setSpeechConfidence] = useState(null);
    const [speechLoading, setSpeechLoading] = useState(false);
    const [speechError, setSpeechError] = useState('');
    const [isRecordingAudio, setIsRecordingAudio] = useState(false);

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

    const captureEmotionForBackend = async () => {
        if (!videoRef.current || videoRef.current.readyState !== 4) {
            setEmotionError('Camera is not ready yet. Please wait a moment and try again.');
            return;
        }

        try {
            setEmotionLoading(true);
            setEmotionError('');

            const tempCanvas = document.createElement('canvas');
            tempCanvas.width = videoRef.current.videoWidth || 640;
            tempCanvas.height = videoRef.current.videoHeight || 480;

            const ctx = tempCanvas.getContext('2d');
            ctx.drawImage(videoRef.current, 0, 0, tempCanvas.width, tempCanvas.height);

            const imageBlob = await new Promise((resolve) => {
                tempCanvas.toBlob(resolve, 'image/jpeg', 0.92);
            });

            if (!imageBlob) {
                throw new Error('Could not capture image from camera.');
            }

            const result = await detectEmotion(imageBlob);
            if (result?.emotion) {
                setDetectedEmotion(result.emotion);
            }
        } catch (error) {
            setEmotionError(error.message || 'Failed to analyze facial emotion.');
        } finally {
            setEmotionLoading(false);
        }
    };

    const startAudioRecording = async () => {
        try {
            setSpeechError('');
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const recorder = new MediaRecorder(stream);
            audioChunksRef.current = [];

            recorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    audioChunksRef.current.push(event.data);
                }
            };

            recorder.onstop = async () => {
                const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
                stream.getTracks().forEach(track => track.stop());

                try {
                    setSpeechLoading(true);
                    const result = await analyzeSpeech(audioBlob);
                    setSpeechEmotion(result?.emotion || 'Unknown');
                    setSpeechConfidence(result?.confidence ?? null);
                } catch (error) {
                    setSpeechError(error.message || 'Failed to analyze speech emotion.');
                } finally {
                    setSpeechLoading(false);
                }
            };

            mediaRecorderRef.current = recorder;
            recorder.start();
            setIsRecordingAudio(true);
        } catch {
            setSpeechError('Microphone access denied or unavailable.');
        }
    };

    const stopAudioRecording = () => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
            mediaRecorderRef.current.stop();
        }
        setIsRecordingAudio(false);
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
                speechEmotion,
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
            navigate('/report', {
                state: {
                    answers,
                    emotion: detectedEmotion,
                    speechEmotion,
                }
            });
        }
    };

    const handlePrevious = () => {
        if (currentQuestion > 0) setCurrentQuestion(c => c - 1);
    };

    const emotionColorClass = EMOTION_COLORS[detectedEmotion.toLowerCase()] || 'text-slate-400';

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
            {/* Left: Questionnaire */}
            <div className="md:w-3/5 p-6 md:p-12 flex flex-col justify-center">
                <div className="max-w-2xl mx-auto w-full bg-white rounded-3xl shadow-xl shadow-slate-200/50 p-8 border border-slate-100">
                    {/* Progress */}
                    <div className="mb-8">
                        <div className="flex justify-between items-end mb-4">
                            <div>
                                <h2 className="text-2xl font-bold text-slate-900">Mental Health Assessment</h2>
                                <p className="text-slate-500 mt-1 text-sm">Answer honestly for the most accurate insights.</p>
                            </div>
                            <span className="text-sm font-semibold text-primary-600 bg-primary-50 px-3 py-1 rounded-full">
                                {currentQuestion + 1} / {QUESTIONS.length}
                            </span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-2.5">
                            <div
                                className="bg-primary-600 h-2.5 rounded-full transition-all duration-500 ease-out"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                    </div>

                    {/* Question */}
                    <div className="mb-8 min-h-[260px]">
                        <h3 className="text-xl font-medium text-slate-800 mb-6 flex justify-between items-start gap-4">
                            {QUESTIONS[currentQuestion].text}
                            <button
                                onClick={handleVoiceInput}
                                title="Speak your answer"
                                className={`p-2 rounded-full shrink-0 transition-colors ${isListening ? 'bg-red-100 text-red-600 animate-pulse' : 'text-slate-400 hover:text-primary-600 bg-slate-50 hover:bg-primary-50'}`}
                            >
                                {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                            </button>
                        </h3>

                        <div className="space-y-3">
                            {QUESTIONS[currentQuestion].options.map((option, idx) => {
                                const selected = answers[QUESTIONS[currentQuestion].id] === option;
                                return (
                                    <button
                                        key={idx}
                                        onClick={() => handleOptionSelect(option)}
                                        className={`w-full text-left px-5 py-4 rounded-xl border-2 transition-all duration-200 ${selected
                                            ? 'border-primary-600 bg-primary-50 text-primary-700 font-semibold shadow-sm'
                                            : 'border-slate-200 bg-white text-slate-700 hover:border-primary-300 hover:bg-slate-50'
                                            }`}
                                    >
                                        {option}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Navigation */}
                    <div className="flex items-center justify-between pt-6 border-t border-slate-100">
                        <button
                            onClick={handlePrevious}
                            disabled={currentQuestion === 0}
                            className="flex items-center px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                        >
                            <ChevronLeft className="w-4 h-4 mr-1" /> Previous
                        </button>
                        <button
                            onClick={handleNext}
                            disabled={!answers[QUESTIONS[currentQuestion].id] || submitting}
                            className="flex items-center px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-xl shadow-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {submitting ? 'Submitting...' : currentQuestion === QUESTIONS.length - 1 ? 'Submit Assessment' : 'Next Question'}
                            {!submitting && currentQuestion < QUESTIONS.length - 1 && <ChevronRight className="w-4 h-4 ml-1" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Right: Camera */}
            <div className="md:w-2/5 bg-slate-900 border-l border-slate-800 flex flex-col text-white p-6 md:p-10 justify-center items-center relative overflow-hidden">
                <div className="w-full max-w-sm space-y-5 z-10">
                    <div className="text-center">
                        <Activity className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
                        <h3 className="text-lg font-bold">Live Emotion Analysis</h3>
                        <p className="text-slate-400 text-xs mt-1">Facial expressions are analyzed in real-time during your assessment.</p>
                    </div>

                    {/* Camera preview */}
                    <div className="aspect-[4/3] bg-slate-800 rounded-2xl border border-slate-700 relative overflow-hidden shadow-2xl flex items-center justify-center">
                        <video
                            ref={videoRef}
                            autoPlay
                            muted
                            playsInline
                            className="w-full h-full object-cover rounded-2xl"
                        />
                        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
                        {cameraError && (
                            <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-800/90 p-4 text-center">
                                <Camera className="w-10 h-10 opacity-40 mb-2" />
                                <p className="text-xs text-slate-400">{cameraError}</p>
                            </div>
                        )}
                    </div>

                    {/* Emotion badge */}
                    <div className="bg-slate-800/80 backdrop-blur rounded-xl p-4 border border-slate-700 flex justify-between items-center text-sm">
                        <span className="text-slate-400">Detected emotion</span>
                        <span className={`font-bold tracking-wide uppercase ${emotionColorClass}`}>
                            {detectedEmotion}
                        </span>
                    </div>

                    <button
                        onClick={captureEmotionForBackend}
                        disabled={emotionLoading || !!cameraError}
                        className="w-full rounded-xl bg-primary-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {emotionLoading ? 'Analyzing face...' : 'Capture And Analyze Face'}
                    </button>
                    {emotionError && <p className="text-xs text-red-400">{emotionError}</p>}

                    <div className="rounded-xl border border-slate-700 bg-slate-800/80 p-4 text-sm">
                        <div className="mb-2 flex items-center justify-between">
                            <span className="text-slate-400">Speech emotion</span>
                            <span className="font-bold uppercase text-emerald-300">{speechEmotion}</span>
                        </div>
                        {speechConfidence !== null && (
                            <p className="text-xs text-slate-400">Confidence: {(speechConfidence * 100).toFixed(1)}%</p>
                        )}
                        <div className="mt-3 flex gap-2">
                            {!isRecordingAudio ? (
                                <button
                                    onClick={startAudioRecording}
                                    disabled={speechLoading}
                                    className="flex-1 rounded-lg bg-emerald-600 px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-emerald-700 disabled:opacity-60"
                                >
                                    {speechLoading ? 'Processing...' : 'Start Voice Recording'}
                                </button>
                            ) : (
                                <button
                                    onClick={stopAudioRecording}
                                    className="flex-1 rounded-lg bg-red-600 px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-red-700"
                                >
                                    Stop And Analyze
                                </button>
                            )}
                        </div>
                        {speechError && <p className="mt-2 text-xs text-red-400">{speechError}</p>}
                    </div>

                    {/* Disclaimer */}
                    <div className="flex items-start gap-2 text-xs text-slate-500">
                        <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                        <p>Assessment media is analyzed for emotional cues and is not a medical diagnosis.</p>
                    </div>
                </div>

                {/* Decorative blobs */}
                <div className="absolute top-0 right-0 w-72 h-72 bg-primary-600/10 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2 pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-72 h-72 bg-emerald-600/10 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2 pointer-events-none" />
            </div>
        </div>
    );
}
