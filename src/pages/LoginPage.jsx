import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BrainCircuit, Mail, Lock, Mic, Phone } from 'lucide-react';
import { auth, db } from '../firebase';
import { signInWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

export default function LoginPage() {
    const [formData, setFormData] = useState({
        identifier: '',
        password: ''
    });
    const [usePhone, setUsePhone] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // Navigate when auth state changes (triggered by successful login)
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                try {
                    const userDoc = await getDoc(doc(db, 'users', user.uid));
                    if (userDoc.exists() && userDoc.data().profileCompleted) {
                        navigate('/dashboard', { replace: true });
                    } else {
                        navigate('/profile-setup', { replace: true });
                    }
                } catch (err) {
                    console.error("Error checking profile status:", err);
                    navigate('/dashboard', { replace: true });
                }
            }
        });
        return () => unsubscribe();
    }, [navigate]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSpeechToText = (field) => {
        // Check if browser supports SpeechRecognition
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            alert("Your browser does not support the Web Speech API. Please try Chrome.");
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';

        recognition.onstart = () => {
            setIsListening(true);
        };

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            // Remove spaces if it's supposed to be an email (basic cleanup)
            const cleanTranscript = field === 'identifier' && !usePhone ? transcript.replace(/\s+/g, '').toLowerCase() : transcript;

            setFormData(prev => ({ ...prev, [field]: cleanTranscript }));
            setIsListening(false);
        };

        recognition.onerror = (event) => {
            console.error("Speech recognition error", event.error);
            setIsListening(false);
        };

        recognition.onend = () => {
            setIsListening(false);
        };

        recognition.start();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            // Check if phone or email is used. Firebase Auth primarily uses email natively.
            // If they are trying phone auth, we can prompt them that it's currently email-only for MVP
            // or simply try anyway if it's formatted as an email.
            if (usePhone) {
                throw new Error("Phone number login requires reCAPTCHA setup. Please use email for now.");
            }

            await signInWithEmailAndPassword(auth, formData.identifier, formData.password);

            console.log('Login successful!');
            // Navigation is handled by the onAuthStateChanged listener
        } catch (err) {
            console.error('Login error:', err);
            setError(err.message || 'Failed to log in.');
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <Link to="/" className="flex justify-center items-center gap-2 mb-6">
                    <BrainCircuit className="h-10 w-10 text-primary-600" />
                    <span className="font-bold text-2xl text-slate-900">MindCare AI</span>
                </Link>
                <h2 className="mt-6 text-center text-3xl font-extrabold text-slate-900">
                    Sign in to your account
                </h2>
                <p className="mt-2 text-center text-sm text-slate-600">
                    Or{' '}
                    <Link to="/signup" className="font-medium text-primary-600 hover:text-primary-500 transition-colors">
                        create a new account
                    </Link>
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow-xl shadow-slate-200/50 sm:rounded-2xl sm:px-10 border border-slate-100">
                    {error && (
                        <div className="mb-4 bg-red-50 border border-red-200 text-red-600 rounded-lg p-4 text-sm">
                            {error}
                        </div>
                    )}
                    <form className="space-y-6" onSubmit={handleSubmit}>

                        {/* Toggle Email/Phone */}
                        <div className="flex justify-end">
                            <button
                                type="button"
                                onClick={() => setUsePhone(!usePhone)}
                                className="text-xs font-medium text-slate-500 hover:text-primary-600 transition-colors"
                                tabIndex="-1"
                            >
                                Use {usePhone ? 'Email' : 'Phone'} instead
                            </button>
                        </div>

                        <div>
                            <label htmlFor="identifier" className="block text-sm font-medium text-slate-700">
                                {usePhone ? 'Phone Number' : 'Email Address'}
                            </label>
                            <div className="mt-1 relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    {usePhone ? (
                                        <Phone className="h-5 w-5 text-slate-400" />
                                    ) : (
                                        <Mail className="h-5 w-5 text-slate-400" />
                                    )}
                                </div>
                                <input
                                    id="identifier"
                                    name="identifier"
                                    type={usePhone ? 'tel' : 'email'}
                                    required
                                    value={formData.identifier}
                                    onChange={handleChange}
                                    className="focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 pr-10 sm:text-sm border-slate-300 rounded-xl py-3 border bg-slate-50 transition-colors focus:bg-white"
                                    placeholder={usePhone ? "+1 (555) 000-0000" : "you@example.com"}
                                />
                                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                                    <button
                                        type="button"
                                        onClick={() => handleSpeechToText('identifier')}
                                        className={`focus:outline-none transition-colors ${isListening ? 'text-red-500 animate-pulse' : 'text-slate-400 hover:text-primary-600'}`}
                                        title="Use voice input"
                                    >
                                        <Mic className="h-5 w-5" />
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-slate-700">
                                Password
                            </label>
                            <div className="mt-1 relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-slate-400" />
                                </div>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    required
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 sm:text-sm border-slate-300 rounded-xl py-3 border bg-slate-50 transition-colors focus:bg-white"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <input
                                    id="remember-me"
                                    name="remember-me"
                                    type="checkbox"
                                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-slate-300 rounded"
                                />
                                <label htmlFor="remember-me" className="ml-2 block text-sm text-slate-900">
                                    Remember me
                                </label>
                            </div>

                            <div className="text-sm">
                                <a href="#" className="font-medium text-primary-600 hover:text-primary-500">
                                    Forgot your password?
                                </a>
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors disabled:opacity-50"
                            >
                                {loading ? 'Signing in...' : 'Sign in'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
