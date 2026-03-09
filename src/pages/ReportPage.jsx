import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity, Brain, ShieldAlert, HeartPulse, ChevronRight, Download } from 'lucide-react';

export default function ReportPage() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

    // Mock Assessment Results
    const reportData = {
        stressLevel: 75, // percentage
        riskLevel: 'Moderate',
        predominantEmotions: ['Stressed', 'Anxious'],
        summary: "Based on the assessment and facial analysis, there are indications of moderate stress and anxiety. Your sleep patterns seem disrupted, contributing to an overall sense of fatigue. It is recommended to seek professional guidance for coping strategies.",
        keyFindings: [
            "Elevated stress detected during questionnaire.",
            "Self-reported poor sleep quality.",
            "Facial analysis showed frequent anxiety markers."
        ]
    };

    useEffect(() => {
        // Simulate AI processing time
        const timer = setTimeout(() => {
            setLoading(false);
        }, 3500);
        return () => clearTimeout(timer);
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-[#EAF6F6] flex flex-col items-center justify-center p-4">
                <div className="relative">
                    <div className="absolute inset-0 rounded-full border-t-4 border-[#204E4A] animate-spin h-24 w-24"></div>
                    <Brain className="h-24 w-24 text-[#204E4A] p-6 animate-pulse" />
                </div>
                <h2 className="mt-8 text-2xl font-bold text-[#204E4A] animate-pulse">
                    Generating AI Assessment Report...
                </h2>
                <p className="mt-2 text-slate-600 text-center max-w-md">
                    Analyzing your responses and facial expressions to provide a comprehensive mental wellness overview.
                </p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto space-y-8">

                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 flex items-center">
                            <Brain className="w-8 h-8 text-[#204E4A] mr-3" />
                            Mental Health Assessment Report
                        </h1>
                        <p className="mt-2 text-slate-500">Generated on {new Date().toLocaleDateString()}</p>
                    </div>
                    <button className="mt-4 md:mt-0 flex items-center justify-center px-4 py-2 border border-[#204E4A] text-[#204E4A] rounded-lg hover:bg-[#EAF6F6] transition-colors">
                        <Download className="w-4 h-4 mr-2" /> Download PDF
                    </button>
                </div>

                {/* Indicators Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                    {/* Stress Level */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center justify-center text-center">
                        <div className="p-3 bg-red-50 rounded-full mb-4">
                            <Activity className="w-8 h-8 text-red-500" />
                        </div>
                        <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-1">Stress Level</h3>
                        <div className="flex items-baseline">
                            <span className="text-4xl font-extrabold text-slate-900">{reportData.stressLevel}</span>
                            <span className="text-xl text-slate-500 ml-1">%</span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-1.5 mt-4">
                            <div className="bg-red-500 h-1.5 rounded-full" style={{ width: `${reportData.stressLevel}%` }}></div>
                        </div>
                    </div>

                    {/* Risk Level */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center justify-center text-center">
                        <div className="p-3 bg-orange-50 rounded-full mb-4">
                            <ShieldAlert className="w-8 h-8 text-orange-500" />
                        </div>
                        <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-1">Risk Level</h3>
                        <span className="text-2xl font-bold text-orange-600">{reportData.riskLevel}</span>
                    </div>

                    {/* Emotions */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center justify-center text-center">
                        <div className="p-3 bg-blue-50 rounded-full mb-4">
                            <HeartPulse className="w-8 h-8 text-blue-500" />
                        </div>
                        <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-1">Detected States</h3>
                        <div className="flex flex-wrap justify-center gap-2 mt-2">
                            {reportData.predominantEmotions.map((emotion, idx) => (
                                <span key={idx} className="px-3 py-1 bg-[#EAF6F6] text-[#204E4A] rounded-full text-sm font-medium">
                                    {emotion}
                                </span>
                            ))}
                        </div>
                    </div>

                </div>

                {/* Summary & Findings */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                    <div className="p-6 md:p-8">
                        <h2 className="text-xl font-bold text-slate-900 mb-4 border-b pb-2">AI Summary</h2>
                        <p className="text-slate-600 leading-relaxed mb-8">
                            {reportData.summary}
                        </p>

                        <h2 className="text-xl font-bold text-slate-900 mb-4 border-b pb-2">Key Findings</h2>
                        <ul className="space-y-3">
                            {reportData.keyFindings.map((finding, idx) => (
                                <li key={idx} className="flex items-start">
                                    <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full bg-[#EAF6F6] text-[#204E4A] text-sm font-bold mr-3 mt-0.5">
                                        {idx + 1}
                                    </span>
                                    <span className="text-slate-600">{finding}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Action Footer */}
                    <div className="bg-slate-50 p-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between">
                        <p className="text-sm text-slate-500 mb-4 sm:mb-0 max-w-lg">
                            Disclaimer: This report is generated by AI and does not constitute a clinical medical diagnosis.
                        </p>
                        <button
                            onClick={() => navigate('/suggestions')}
                            className="w-full sm:w-auto flex items-center justify-center px-6 py-3 bg-[#204E4A] text-white rounded-lg hover:bg-[#153431] transition-colors font-medium shadow-sm hover:shadow-md"
                        >
                            View Doctor Suggestions <ChevronRight className="w-5 h-5 ml-2" />
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
}
