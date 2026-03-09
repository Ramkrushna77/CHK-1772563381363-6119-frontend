import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import * as faceapi from 'face-api.js';
import { Mic, MicOff, ChevronRight, ChevronLeft, Activity } from 'lucide-react';

const questions = [
    { id: 1, text: "How often do you feel anxious?", options: ["Never", "Sometimes", "Often", "Always"] },
    { id: 2, text: "How is your sleep quality?", options: ["Excellent", "Good", "Poor", "Terrible"] },
    { id: 3, text: "Do you feel low or depressed frequently?", options: ["Never", "Rarely", "Sometimes", "Always"] },
    { id: 4, text: "How would you rate your current stress level?", options: ["Low", "Moderate", "High", "Severe"] },
    { id: 5, text: "How often do you find it difficult to concentrate?", options: ["Rarely", "Sometimes", "Often", "Always"] }
];

export default function AssessmentPage() {
    const navigate = useNavigate();
    // Questionnaire State
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState({});
    const [isListening, setIsListening] = useState(false);

    // Camera & Face API State
    const videoRef = useRef(null);
    const [modelsLoaded, setModelsLoaded] = useState(false);
    const [emotion, setEmotion] = useState("Neutral");
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Load Models
    useEffect(() => {
        const loadModels = async () => {
            try {
                await Promise.all([
                    faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
                    faceapi.nets.faceExpressionNet.loadFromUri('/models')
                ]);
                setModelsLoaded(true);
            } catch (err) {
                console.error("Error loading models:", err);
            }
        };
        loadModels();
    }, []);

    // Setup Camera
    useEffect(() => {
        if (modelsLoaded) {
            startVideo();
        }
    }, [modelsLoaded]);

    const startVideo = () => {
        navigator.mediaDevices.getUserMedia({ video: true })
            .then((stream) => {
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                }
            })
            .catch((err) => {
                console.error("error accessing webcam:", err);
            });
    };

    const handleVideoPlay = () => {
        setInterval(async () => {
            if (videoRef.current) {
                const detections = await faceapi.detectSingleFace(
                    videoRef.current,
                    new faceapi.TinyFaceDetectorOptions()
                ).withFaceExpressions();

                if (detections) {
                    const expressions = detections.expressions;
                    // Find the dominant emotion
                    const dominantEmotion = Object.keys(expressions).reduce((a, b) => expressions[a] > expressions[b] ? a : b);
                    setEmotion(dominantEmotion.charAt(0).toUpperCase() + dominantEmotion.slice(1));
                }
            }
        }, 1000); // Check every second
    };

    const handleSpeechInput = () => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            alert("Your browser doesn't support speech to text.");
            return;
        }
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;

        recognition.onstart = () => setIsListening(true);

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript.toLowerCase();

            // Match transcript to options
            const currentOptions = questions[currentQuestion].options;
            const matchedOption = currentOptions.find(opt =>
                transcript.includes(opt.toLowerCase())
            );

            if (matchedOption) {
                handleAnswer(matchedOption);
            } else {
                alert(`Could not match "${transcript}" to an option. Please try again or click an option.`);
            }
            setIsListening(false);
        };

        recognition.onerror = () => setIsListening(false);
        recognition.onend = () => setIsListening(false);

        recognition.start();
    };

    const handleAnswer = (option) => {
        setAnswers(prev => ({
            ...prev,
            [questions[currentQuestion].id]: option
        }));
    };

    const handleNext = () => {
        if (currentQuestion < questions.length - 1) {
            setCurrentQuestion(prev => prev + 1);
        } else {
            submitAssessment();
        }
    };

    const submitAssessment = () => {
        setIsSubmitting(true);
        // Simulate delay for AI Report Generation
        setTimeout(() => {
            // In a real app, you would send 'answers' and recorded 'emotions' to the backend
            navigate('/report');
        }, 2000);
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
            {/* LEFT SIDE: Questionnaire */}
            <div className="w-full md:w-1/2 p-8 flex flex-col justify-center bg-white shadow-xl z-10">
                <div className="max-w-md w-full mx-auto">
                    {/* Progress Bar */}
                    <div className="mb-8">
                        <div className="flex justify-between text-sm text-slate-500 mb-2">
                            <span>Question {currentQuestion + 1} of {questions.length}</span>
                            <span>{Math.round(((currentQuestion) / questions.length) * 100)}%</span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-2.5">
                            <div
                                className="bg-[#204E4A] h-2.5 rounded-full transition-all duration-500"
                                style={{ width: `${((currentQuestion) / questions.length) * 100}%` }}
                            ></div>
                        </div>
                    </div>

                    <h2 className="text-2xl font-bold text-slate-800 mb-6">
                        {questions[currentQuestion].text}
                    </h2>

                    <div className="space-y-3 mb-8">
                        {questions[currentQuestion].options.map((option, idx) => (
                            <button
                                key={idx}
                                onClick={() => handleAnswer(option)}
                                className={`w-full text-left px-6 py-4 rounded-xl border-2 transition-all ${answers[questions[currentQuestion].id] === option
                                        ? 'border-[#204E4A] bg-[#EAF6F6] text-[#204E4A] font-semibold'
                                        : 'border-slate-200 hover:border-[#BED6D3] text-slate-700'
                                    }`}
                            >
                                {option}
                            </button>
                        ))}
                    </div>

                    <div className="flex items-center justify-between">
                        <button
                            onClick={() => setCurrentQuestion(prev => Math.max(0, prev - 1))}
                            disabled={currentQuestion === 0}
                            className="flex items-center px-4 py-2 text-slate-500 hover:text-[#204E4A] disabled:opacity-30 transition-colors"
                        >
                            <ChevronLeft className="w-5 h-5 mr-1" /> Back
                        </button>

                        <button
                            onClick={handleSpeechInput}
                            title="Answer with voice"
                            className={`p-3 rounded-full ${isListening ? 'bg-red-100 text-red-600 animate-pulse' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'} transition-colors`}
                        >
                            {isListening ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
                        </button>

                        <button
                            onClick={handleNext}
                            disabled={!answers[questions[currentQuestion].id] || isSubmitting}
                            className="flex items-center px-6 py-2 bg-[#204E4A] text-white rounded-lg hover:bg-[#153431] disabled:opacity-50 transition-colors"
                        >
                            {isSubmitting ? 'Submitting...' : (currentQuestion === questions.length - 1 ? 'Finish' : 'Next')}
                            {!isSubmitting && currentQuestion < questions.length - 1 && <ChevronRight className="w-5 h-5 ml-1" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* RIGHT SIDE: Camera Analysis */}
            <div className="w-full md:w-1/2 bg-[#EAF6F6] p-8 flex flex-col items-center justify-center border-l border-[#BED6D3]">
                <div className="max-w-md w-full text-center">
                    <div className="mb-6 flex items-center justify-center space-x-2">
                        <Activity className="text-[#204E4A] w-6 h-6" />
                        <h3 className="text-xl font-semibold text-[#204E4A]">Live Emotion Analysis</h3>
                    </div>

                    <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-slate-800 aspect-video mb-6">
                        {!modelsLoaded ? (
                            <div className="absolute inset-0 flex items-center justify-center text-white/70">
                                <Spinner />
                                <span className="ml-2">Loading AI Models...</span>
                            </div>
                        ) : (
                            <video
                                ref={videoRef}
                                autoPlay
                                muted
                                onPlay={handleVideoPlay}
                                className="w-full h-full object-cover transform -scale-x-100" // Mirror effect
                            />
                        )}

                        {/* Emotion Overlay */}
                        {modelsLoaded && (
                            <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-4 py-2 rounded-full text-white/90 font-medium tracking-wide flex items-center">
                                <span className={`w-2 h-2 rounded-full mr-2 ${getEmotionColor(emotion)}`}></span>
                                {emotion}
                            </div>
                        )}
                    </div>

                    <p className="text-slate-600 text-sm max-w-sm mx-auto">
                        Your camera is used locally for real-time facial analysis to better assess your current state. No video is recorded or sent to servers.
                    </p>
                </div>
            </div>
        </div>
    );
}

// Helper components
function Spinner() {
    return (
        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
    );
}

function getEmotionColor(emotion) {
    switch (emotion.toLowerCase()) {
        case 'happy': return 'bg-green-400';
        case 'sad': return 'bg-blue-400';
        case 'angry': return 'bg-red-500';
        case 'fearful': return 'bg-purple-500';
        case 'disgusted': return 'bg-yellow-600';
        case 'surprised': return 'bg-yellow-400';
        default: return 'bg-slate-400'; // Neutral
    }
}
