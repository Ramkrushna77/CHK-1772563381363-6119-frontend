import { BrainCircuit } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="bg-slate-50 pt-16 pb-8 border-t border-slate-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                    <div className="col-span-1 md:col-span-2">
                        <div className="flex items-center gap-2 mb-4">
                            <BrainCircuit className="h-6 w-6 text-primary-600" />
                            <span className="font-bold text-lg text-slate-900">MindCare AI</span>
                        </div>
                        <p className="text-sm text-slate-600 mb-6 max-w-sm">
                            The next generation of mental health assessment, making professional-grade insights accessible to everyone, everywhere.
                        </p>
                    </div>

                    <div>
                        <h3 className="font-semibold text-sm text-slate-900 mb-4 tracking-wider uppercase">Platform</h3>
                        <ul className="space-y-3">
                            <li><a href="#" className="text-sm text-slate-600 hover:text-primary-600">How it works</a></li>
                            <li><a href="#" className="text-sm text-slate-600 hover:text-primary-600">Self-Assessment</a></li>
                            <li><a href="#" className="text-sm text-slate-600 hover:text-primary-600">Enterprise</a></li>
                            <li><a href="#" className="text-sm text-slate-600 hover:text-primary-600">Pricing</a></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-semibold text-sm text-slate-900 mb-4 tracking-wider uppercase">Company</h3>
                        <ul className="space-y-3">
                            <li><a href="#" className="text-sm text-slate-600 hover:text-primary-600">Help Center</a></li>
                            <li><a href="#" className="text-sm text-slate-600 hover:text-primary-600">Clinical Studies</a></li>
                            <li><a href="#" className="text-sm text-slate-600 hover:text-primary-600">Contact Us</a></li>
                            <li><a href="#" className="text-sm text-slate-600 hover:text-primary-600">Emergency Info</a></li>
                        </ul>
                    </div>
                </div>

                <div className="p-4 bg-red-50 border border-red-100 rounded-lg mb-8 text-center max-w-3xl mx-auto">
                    <p className="text-xs text-red-800 font-medium">
                        <strong className="text-red-700">Medical Disclaimer:</strong> This tool is intended for screening purposes only and does not provide a formal medical diagnosis. It is not a replacement for professional clinical care. If you are experiencing a mental health crisis, please contact your local emergency services or a crisis hotline immediately.
                    </p>
                </div>

                <div className="pt-8 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-xs text-slate-500">&copy; 2026 MindCare AI. All rights reserved.</p>
                    <div className="flex gap-6">
                        <a href="#" className="text-xs text-slate-500 hover:text-slate-900">Privacy Policy</a>
                        <a href="#" className="text-xs text-slate-500 hover:text-slate-900">Terms of Service</a>
                        <a href="#" className="text-xs text-slate-500 hover:text-slate-900">Cookie Settings</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
