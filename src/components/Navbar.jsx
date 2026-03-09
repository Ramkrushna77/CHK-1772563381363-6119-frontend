import { Link } from 'react-router-dom';
import { BrainCircuit } from 'lucide-react';

export default function Navbar() {
    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex items-center gap-2">
                        <BrainCircuit className="h-8 w-8 text-primary-600" />
                        <span className="font-bold text-xl text-slate-900">MindCare AI</span>
                    </div>

                    <div className="hidden md:flex items-center gap-8">
                        <a href="#assessments" className="text-sm font-medium text-slate-700 hover:text-primary-600 transition-colors">Assessments</a>
                        <a href="#features" className="text-sm font-medium text-slate-700 hover:text-primary-600 transition-colors">Features</a>
                        <a href="#resources" className="text-sm font-medium text-slate-700 hover:text-primary-600 transition-colors">Resources</a>
                        <a href="#about" className="text-sm font-medium text-slate-700 hover:text-primary-600 transition-colors">About</a>
                    </div>

                    <div className="flex items-center gap-4">
                        <Link to="/login" className="text-sm font-medium text-slate-700 hover:text-primary-600 transition-colors">Sign in</Link>
                        <Link to="/login" className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                            Get Started
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
}
