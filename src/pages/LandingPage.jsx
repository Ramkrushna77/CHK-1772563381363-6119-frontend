import { Link } from 'react-router-dom';
import { ArrowRight, Activity, MessageSquare, FileText, CheckCircle2 } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function LandingPage() {
    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            <Navbar />

            <main className="flex-grow pt-24 pb-16">
                {/* Hero Section */}
                <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div className="space-y-8">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-sm font-medium">
                                <Activity className="h-4 w-4" />
                                <span>AI-Powered Clinical Diagnostics</span>
                            </div>

                            <h1 className="text-5xl lg:text-6xl font-extrabold text-slate-900 leading-tight">
                                AI-Powered <br />
                                <span className="text-primary-600">Mental Health</span> <br />
                                Support
                            </h1>

                            <p className="text-lg text-slate-600 max-w-lg leading-relaxed">
                                Empowering early detection and mental well-being through advanced AI assessment tools. Start your journey to clarity with clinical-grade insights.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4">
                                <Link to="/login" className="inline-flex justify-center items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-8 py-4 rounded-xl text-lg font-semibold transition-all shadow-lg shadow-primary-500/30 hover:shadow-primary-500/50">
                                    Start Assessment <ArrowRight className="h-5 w-5" />
                                </Link>
                                <a href="#features" className="inline-flex justify-center items-center gap-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 px-8 py-4 rounded-xl text-lg font-semibold transition-all shadow-sm">
                                    View Sample Report
                                </a>
                            </div>

                            <div className="pt-4 flex items-center gap-4 text-sm text-slate-500 font-medium">
                                <div className="flex -space-x-2">
                                    <div className="w-8 h-8 rounded-full border-2 border-white bg-slate-200"></div>
                                    <div className="w-8 h-8 rounded-full border-2 border-white bg-slate-300"></div>
                                    <div className="w-8 h-8 rounded-full border-2 border-white bg-slate-400"></div>
                                </div>
                                <p>Joined by <strong className="text-slate-900">10,000+</strong> users this month</p>
                            </div>
                        </div>

                        <div className="relative relative-container rounded-3xl overflow-hidden shadow-2xl h-[600px] w-full bg-slate-200">
                            {/* Placeholder for the doctor working on tablet image */}
                            <img src="https://images.unsplash.com/photo-1576091160550-2173ff9e5fe3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" alt="Doctor using tablet" className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent"></div>

                            {/* Floating Card */}
                            <div className="absolute bottom-6 left-6 right-6">
                                <div className="glass-panel rounded-2xl p-6 flex items-start gap-4">
                                    <div className="bg-green-100 p-2 rounded-lg">
                                        <CheckCircle2 className="h-6 w-6 text-green-600" />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-slate-900">HIPAA Compliant</h4>
                                        <p className="text-sm text-slate-600 mt-1">Your data is encrypted and secure.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <h2 className="text-primary-600 font-semibold tracking-wide uppercase text-sm mb-3">Core Features</h2>
                        <h3 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">Cutting-Edge Diagnostic Support</h3>
                        <p className="text-lg text-slate-600">
                            We utilize multi-modal AI analysis to provide a holistic view of your mental well-being, combining behavioral patterns with physiological markers.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <FeatureCard
                            icon={<User className="h-6 w-6 text-blue-600" />}
                            iconBg="bg-blue-100"
                            title="Face Emotion Analysis"
                            description="Advanced computer vision technology identifies subtle micro-expressions and emotional cues during your check-in sessions."
                            linkText="Learn more"
                            linkUrl="#vision"
                        />
                        <FeatureCard
                            icon={<MessageSquare className="h-6 w-6 text-green-600" />}
                            iconBg="bg-green-100"
                            title="Voice Input Support"
                            description="Natural Language Processing (NLP) analyzes vocal tone, pitch, and sentiment to detect markers of stress, anxiety, or fatigue."
                            linkText="Learn more"
                            linkUrl="#voice"
                        />
                        <FeatureCard
                            icon={<FileText className="h-6 w-6 text-purple-600" />}
                            iconBg="bg-purple-100"
                            title="Personalized Reports"
                            description="Receive comprehensive, easy-to-understand insights and actionable recommendations tailored to your unique psychological profile."
                            linkText="Learn more"
                            linkUrl="#reports"
                        />
                    </div>
                </section>

                {/* CTA Section */}
                <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                    <div className="bg-primary-600 rounded-3xl p-8 md:p-16 text-center text-white shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 rounded-full bg-primary-500 blur-3xl opacity-50"></div>
                        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 rounded-full bg-primary-700 blur-3xl opacity-50"></div>

                        <div className="relative z-10">
                            <h2 className="text-3xl md:text-5xl font-bold mb-6">Ready to take the first step?</h2>
                            <p className="text-primary-100 text-lg md:text-xl mb-10 max-w-2xl mx-auto">
                                Join thousands of individuals who are using AI to better understand their mental health. Our secure assessment takes only 10 minutes.
                            </p>
                            <Link to="/login" className="inline-block bg-white text-primary-600 font-bold text-lg px-10 py-4 rounded-xl hover:bg-slate-50 transition-colors shadow-lg">
                                Begin Free Assessment
                            </Link>
                            <p className="mt-6 text-sm text-primary-200">No credit card required. Private & Anonymous.</p>
                        </div>
                    </div>
                </section>

            </main>

            <Footer />
        </div>
    );
}

function FeatureCard({ icon, iconBg, title, description, linkText, linkUrl }) {
    return (
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 ${iconBg}`}>
                {icon}
            </div>
            <h4 className="text-xl font-bold text-slate-900 mb-4">{title}</h4>
            <p className="text-slate-600 leading-relaxed mb-6">
                {description}
            </p>
            <a href={linkUrl} className="inline-flex items-center gap-1 font-semibold text-primary-600 hover:text-primary-700 transition-colors">
                {linkText} <ArrowRight className="h-4 w-4" />
            </a>
        </div>
    );
}

import { User } from 'lucide-react'; // Added missing import at button
