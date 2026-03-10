import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BrainCircuit, Mail, Lock, User, Phone, ChevronRight, Sparkles } from 'lucide-react';
import { auth, db } from '../firebase';
import { createUserWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

export default function SignupPage() {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        password: ''
    });
    const navigate = useNavigate();
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            const userCredential = await createUserWithEmailAndPassword(
                auth,
                formData.email,
                formData.password
            );

            await setDoc(doc(db, 'users', userCredential.user.uid), {
                fullName: formData.fullName,
                email: formData.email,
                phone: formData.phone,
                createdAt: new Date().toISOString()
            });

            navigate('/profile-setup', { replace: true });
        } catch (err) {
            setError(err.message || 'Failed to create account.');
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 relative selection:bg-primary-100 italic-text-none overflow-hidden flex items-center justify-center p-4 py-20">
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
                        <h1 className="text-4xl font-black text-slate-900 tracking-tighter italic mb-2 uppercase">Neural Setup</h1>
                        <p className="text-slate-500 font-medium text-sm">Initialize your clinical profile and begin synchronization.</p>
                    </div>

                    {error && (
                        <div className="mb-6 bg-red-50 border border-red-100 text-red-600 rounded-2xl p-4 text-xs font-bold text-center italic">
                            {error}
                        </div>
                    )}

                    <form className="space-y-5" onSubmit={handleSubmit}>
                        {/* Full Name */}
                        <div>
                            <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-2 block px-1">
                                Subject Designation
                            </label>
                            <div className="relative group/input">
                                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none transition-transform group-focus-within/input:scale-110">
                                    <User className="h-5 w-5 text-slate-300" />
                                </div>
                                <input
                                    name="fullName"
                                    type="text"
                                    required
                                    value={formData.fullName}
                                    onChange={handleChange}
                                    className="block w-full pl-12 pr-5 py-4 bg-white border-2 border-slate-50 rounded-[1.5rem] text-slate-900 font-bold placeholder-slate-300 focus:outline-none focus:border-primary-600 focus:ring-4 focus:ring-primary-100 transition-all shadow-sm italic"
                                    placeholder="Full Name"
                                />
                            </div>
                        </div>

                        {/* Email */}
                        <div>
                            <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-2 block px-1">
                                Vector ID
                            </label>
                            <div className="relative group/input">
                                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none transition-transform group-focus-within/input:scale-110">
                                    <Mail className="h-5 w-5 text-slate-300" />
                                </div>
                                <input
                                    name="email"
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="block w-full pl-12 pr-5 py-4 bg-white border-2 border-slate-50 rounded-[1.5rem] text-slate-900 font-bold placeholder-slate-300 focus:outline-none focus:border-primary-600 focus:ring-4 focus:ring-primary-100 transition-all shadow-sm italic"
                                    placeholder="Email Address"
                                />
                            </div>
                        </div>

                        {/* Phone */}
                        <div>
                            <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-2 block px-1">
                                Telemetry Link
                            </label>
                            <div className="relative group/input">
                                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none transition-transform group-focus-within/input:scale-110">
                                    <Phone className="h-5 w-5 text-slate-300" />
                                </div>
                                <input
                                    name="phone"
                                    type="tel"
                                    required
                                    value={formData.phone}
                                    onChange={handleChange}
                                    className="block w-full pl-12 pr-5 py-4 bg-white border-2 border-slate-50 rounded-[1.5rem] text-slate-900 font-bold placeholder-slate-300 focus:outline-none focus:border-primary-600 focus:ring-4 focus:ring-primary-100 transition-all shadow-sm italic"
                                    placeholder="+1 (555) 000-0000"
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-2 block px-1">
                                Master Key
                            </label>
                            <div className="relative group/input">
                                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none transition-transform group-focus-within/input:scale-110">
                                    <Lock className="h-5 w-5 text-slate-300" />
                                </div>
                                <input
                                    name="password"
                                    type="password"
                                    required
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="block w-full pl-12 pr-5 py-4 bg-white border-2 border-slate-50 rounded-[1.5rem] text-slate-900 font-bold placeholder-slate-300 focus:outline-none focus:border-primary-600 focus:ring-4 focus:ring-primary-100 transition-all shadow-sm italic"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-primary-600 text-white py-5 rounded-[2rem] font-black uppercase tracking-widest text-[12px] hover:bg-primary-700 transition-all shadow-xl shadow-primary-200 active:scale-95 flex items-center justify-center gap-3 disabled:opacity-50 mt-4"
                        >
                            {loading ? (
                                <Sparkles className="animate-spin h-5 w-5" />
                            ) : (
                                <>Initialize System <ChevronRight size={18} /></>
                            )}
                        </button>
                    </form>

                    <div className="mt-8 pt-8 border-t border-slate-50 text-center">
                        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                            Existing subject?{' '}
                            <Link to="/login" className="text-primary-600 hover:text-primary-700 underline underline-offset-4">
                                Re-sync Session
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
