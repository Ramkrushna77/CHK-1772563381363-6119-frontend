import { Link } from 'react-router-dom';
import { BrainCircuit, ShieldCheck, HeartPulse, Activity, Bot, ChevronRight, CheckCircle2, UserCheck, Sparkles } from 'lucide-react';

export default function LandingPage() {
    return (
        <div className="min-h-screen bg-slate-50 relative selection:bg-primary-100 italic-text-none overflow-x-hidden">
            {/* Ambient Premium Glows */}
            <div className="fixed top-[-10%] right-[-10%] w-[800px] h-[800px] bg-primary-100/10 rounded-full blur-[150px] pointer-events-none"></div>
            <div className="fixed bottom-[-10%] left-[-10%] w-[800px] h-[800px] bg-emerald-100/10 rounded-full blur-[150px] pointer-events-none"></div>

            {/* Navigation */}
            <nav className="fixed top-0 w-full z-50 bg-white/70 backdrop-blur-xl border-b border-slate-100 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-20 items-center">
                        <div className="flex items-center gap-3 group">
                            <div className="w-12 h-12 rounded-2xl bg-primary-600 flex items-center justify-center shadow-lg shadow-primary-200 group-hover:rotate-6 transition-transform">
                                <BrainCircuit className="h-7 w-7 text-white" />
                            </div>
                            <span className="text-2xl font-black text-slate-900 tracking-tighter italic uppercase">MindCare <span className="text-primary-600">AI</span></span>
                        </div>
                        <div className="hidden md:flex items-center gap-10">
                            {['Features', 'About', 'Contact'].map((item) => (
                                <a key={item} href={`#${item.toLowerCase()}`} className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 hover:text-primary-600 transition-colors">
                                    {item}
                                </a>
                            ))}
                            <Link to="/login" className="bg-slate-900 text-white px-8 py-3 rounded-full font-black uppercase text-[10px] tracking-widest hover:bg-black transition-all shadow-xl active:scale-95 italic">
                                Initialize Account
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="pt-32">
                {/* Hero Section */}
                <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
                    <div className="grid lg:grid-cols-2 gap-20 items-center">
                        <div className="space-y-10">
                            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white border border-slate-100 shadow-sm text-primary-600 text-[10px] font-black uppercase tracking-[0.2em]">
                                <Sparkles className="h-4 w-4" />
                                <span>Neural Assessment v4.2 Trace</span>
                            </div>
                            <h1 className="text-6xl lg:text-8xl font-black text-slate-900 leading-[0.9] tracking-tighter italic uppercase">
                                Advanced <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-indigo-600">Mental Core</span> Analysis
                            </h1>
                            <p className="text-xl text-slate-500 font-medium leading-relaxed italic max-w-lg">
                                Synchronizing AI-driven emotional telemetry with high-fidelity psychiatric mapping for precise clinical results.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-6 pt-5">
                                <Link to="/signup" className="group bg-primary-600 text-white px-10 py-5 rounded-[2rem] font-black uppercase text-[12px] tracking-[0.2em] hover:bg-primary-700 transition-all shadow-2xl shadow-primary-200 flex items-center justify-center gap-3 active:scale-95">
                                    Initialize Scan <ChevronRight className="group-hover:translate-x-1 transition-transform" size={20} />
                                </Link>
                                <a href="#features" className="bg-white border-2 border-slate-100 text-slate-900 px-10 py-5 rounded-[2rem] font-black uppercase text-[12px] tracking-[0.2em] hover:border-primary-600 hover:text-primary-600 transition-all shadow-sm flex items-center justify-center gap-3 active:scale-95 italic text-center">
                                    View Protocols
                                </a>
                            </div>
                        </div>

                        <div className="relative group">
                            <div className="absolute -inset-4 bg-gradient-to-r from-primary-600 to-indigo-600 rounded-[4rem] opacity-20 blur-3xl group-hover:opacity-30 transition-opacity"></div>
                            <div className="relative rounded-[3.5rem] overflow-hidden shadow-2xl h-[600px] w-full bg-white border-8 border-white">
                                <img
                                    src="https://images.pexels.com/photos/5215024/pexels-photo-5215024.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                                    alt="Clinical Interface"
                                    className="w-full h-full object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-1000"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent"></div>

                                {/* Floating Premium Card */}
                                <div className="absolute bottom-10 left-10 right-10">
                                    <div className="glass-panel rounded-[2.5rem] p-8 flex items-center gap-8 shadow-2xl bg-white/80 border-none premium-glow">
                                        <div className="w-16 h-16 bg-emerald-100 flex items-center justify-center rounded-[1.5rem] shrink-0">
                                            <CheckCircle2 className="h-8 w-8 text-emerald-600" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 mb-1">Clinic Status</p>
                                            <p className="text-2xl font-black text-slate-900 italic tracking-tighter">HIPAA Verified</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Metrics Section */}
                <section id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 bg-white rounded-[4rem] shadow-sm border border-slate-100 my-20">
                    <div className="grid md:grid-cols-3 gap-16">
                        {[
                            { icon: Activity, title: 'Neural Sync', desc: 'Real-time telemetry analysis via proprietary clinical biometrics.' },
                            { icon: Bot, title: 'AI Assistant', desc: 'Clinical-grade LLMs trained on 50k+ psychiatric journals.' },
                            { icon: ShieldCheck, title: 'Biometric Security', desc: 'End-to-end encrypted session data with local destruction post-scan.' }
                        ].map((feature, i) => (
                            <div key={i} className="space-y-6 group">
                                <div className="w-16 h-16 rounded-[1.5rem] bg-primary-50 text-primary-600 flex items-center justify-center group-hover:bg-primary-600 group-hover:text-white transition-all duration-500 shadow-sm">
                                    <feature.icon size={32} />
                                </div>
                                <h3 className="text-2xl font-black text-slate-900 italic uppercase tracking-tighter">{feature.title}</h3>
                                <p className="text-slate-500 leading-relaxed font-medium">{feature.desc}</p>
                            </div>
                        ))}
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="py-20 border-t border-slate-100">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <div className="flex justify-center items-center gap-3 mb-10 opacity-40">
                        <BrainCircuit size={24} />
                        <span className="text-sm font-black uppercase tracking-[0.4em]">MindCare Core AI v4.2.0</span>
                    </div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-300">
                        &copy; 2026 Neural Dynamics Group. Built for Healthcare Innovation.
                    </p>
                </div>
            </footer>
        </div>
    );
}
