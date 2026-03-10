import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import { signInWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';
import { BrainCircuit, Mail, Lock, Camera, Phone, ChevronRight, Sparkles } from 'lucide-react';

export default function LoginPage() {
    const navigate = useNavigate();
    const [identifier, setIdentifier] = useState('');
    const [password, setPassword] = useState('');
    const [usePhone, setUsePhone] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) navigate('/dashboard');
        });
        return () => unsubscribe();
    }, [navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const email = usePhone ? `${identifier}@mental-health.com` : identifier;
            await signInWithEmailAndPassword(auth, email, password);
            navigate('/dashboard');
        } catch (err) {
            setError('Invalid credentials. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 relative selection:bg-primary-100 italic-text-none overflow-hidden flex items-center justify-center p-4">
            {/* Ambient Premium Glows */}
            <div className="fixed top-[-10%] right-[-10%] w-[600px] h-[600px] bg-primary-100/20 rounded-full blur-[120px] pointer-events-none"></div>
            <div className="fixed bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-emerald-100/20 rounded-full blur-[120px] pointer-events-none"></div>

            <div className="max-w-md w-full relative z-10 animate-in fade-in slide-in-from-bottom-5 duration-700">
                <div className="glass-panel rounded-[3rem] p-10 md:p-12 shadow-2xl relative overflow-hidden group border-none bg-white/70 premium-glow">
                    {/* Header */}
                    <div className="text-center mb-10">
                        <div className="inline-flex items-center justify-center w-20 h-20 rounded-[2rem] bg-white border border-slate-100 shadow-xl mb-6 group-hover:rotate-6 transition-transform">
                            <BrainCircuit className="w-10 h-10 text-primary-600" />
                        </div>
                        <h1 className="text-4xl font-black text-slate-900 tracking-tighter italic mb-2 uppercase">Neural Access</h1>
                        <p className="text-slate-500 font-medium text-sm">Secure biometric entrance to your clinical dashboard.</p>
                    </div>

                    {error && (
                        <div className="mb-6 bg-red-50 border border-red-100 text-red-600 rounded-2xl p-4 text-xs font-bold text-center italic">
                            {error}
                        </div>
                    )}

                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div>
                            <div className="flex justify-between items-end mb-2 px-1">
                                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
                                    {usePhone ? 'Telemetry Hub' : 'Vector ID'}
                                </label>
                                <button
                                    type="button"
                                    onClick={() => setUsePhone(!usePhone)}
                                    className="text-[10px] font-black text-primary-500 hover:text-primary-600 transition-colors uppercase tracking-widest"
                                >
                                    Use {usePhone ? 'Email' : 'Phone'}
                                </button>
                            </div>
                            <div className="relative group/input">
                                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none transition-transform group-focus-within/input:scale-110">
                                    {usePhone ? (
                                        <Phone className="h-5 w-5 text-slate-300" />
                                    ) : (
                                        <Mail className="h-5 w-5 text-slate-300" />
                                    )}
                                </div>
                                <input
                                    type={usePhone ? 'tel' : 'email'}
                                    value={identifier}
                                    onChange={(e) => setIdentifier(e.target.value)}
                                    className="block w-full pl-12 pr-5 py-5 bg-white border-2 border-slate-50 rounded-[1.5rem] text-slate-900 font-bold placeholder-slate-300 focus:outline-none focus:border-primary-600 focus:ring-4 focus:ring-primary-100 transition-all shadow-sm italic"
                                    placeholder={usePhone ? '+1 (555) 000-0000' : 'name@example.com'}
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <div className="flex justify-between items-end mb-2 px-1">
                                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
                                    Key Phrase
                                </label>
                            </div>
                            <div className="relative group/input">
                                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none transition-transform group-focus-within/input:scale-110">
                                    <Lock className="h-5 w-5 text-slate-300" />
                                </div>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="block w-full pl-12 pr-5 py-5 bg-white border-2 border-slate-50 rounded-[1.5rem] text-slate-900 font-bold placeholder-slate-300 focus:outline-none focus:border-primary-600 focus:ring-4 focus:ring-primary-100 transition-all shadow-sm italic"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-primary-600 text-white py-5 rounded-[2rem] font-black uppercase tracking-widest text-[12px] hover:bg-primary-700 transition-all shadow-xl shadow-primary-200 active:scale-95 flex items-center justify-center gap-3 disabled:opacity-50"
                        >
                            {loading ? (
                                <Sparkles className="animate-spin h-5 w-5" />
                            ) : (
                                <>Verify & Sync <ChevronRight size={18} /></>
                            )}
                        </button>
                    </form>

                    <div className="mt-8 pt-8 border-t border-slate-50 text-center">
                        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                            New Subject?{' '}
                            <Link to="/signup" className="text-primary-600 hover:text-primary-700 underline underline-offset-4">
                                Initialize Account
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
