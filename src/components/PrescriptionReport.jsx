import { useState, useRef, useEffect } from 'react';
import { Download, Loader, AlertCircle, ChevronDown } from 'lucide-react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { sendMessage } from '../services/api';

export default function PrescriptionReport({ answers, emotion, speechEmotion, result, backendReport }) {
    const reportRef = useRef();
    const [chatAnalysis, setChatAnalysis] = useState('');
    const [analysisLoading, setAnalysisLoading] = useState(true);
    const [analysisError, setAnalysisError] = useState('');
    const [analysisExpanded, setAnalysisExpanded] = useState(false);
    const [pdfLoading, setPdfLoading] = useState(false);

    // Generate chatbot analysis on mount
    useEffect(() => {
        const generateAnalysis = async () => {
            try {
                setAnalysisLoading(true);
                setAnalysisError('');

                const reportSummary = `
I'm a mental health patient and I need personalized health recommendations based on my mental health assessment report. Here's my assessment data:

- Risk Level: ${result.riskLevel}
- Stress Level: ${result.score}%
- Detected Face Emotion: ${emotion}
- Detected Speech Emotion: ${speechEmotion}
- Assessment Answers: ${Object.values(answers).join(', ')}

Based on this comprehensive assessment data, please provide:
1. Personalized wellness recommendations specific to my situation
2. Immediate actionable steps I can take today
3. Long-term lifestyle changes to improve mental health
4. Warning signs to watch for
5. When to seek professional help

Please format this as practical, compassionate guidance that a healthcare professional would give.`;

                const response = await sendMessage(reportSummary);
                if (response?.answer) {
                    setChatAnalysis(response.answer);
                }
            } catch (error) {
                setAnalysisError(error.message || 'Failed to generate chatbot analysis.');
            } finally {
                setAnalysisLoading(false);
            }
        };

        generateAnalysis();
    }, [answers, emotion, speechEmotion, result]);

    const downloadPDF = async () => {
        try {
            setPdfLoading(true);
            const element = reportRef.current;

            if (!element) {
                alert('Report not ready. Please wait a moment and try again.');
                setPdfLoading(false);
                return;
            }

            // Temporarily replace oklch colors in the DOM because html2canvas doesn't support them
            const originalStyles = new Map();
            const processElementStyles = (el) => {
                if (!el || !el.style) return;
                const computed = window.getComputedStyle(el);
                const propsToFix = ['backgroundColor', 'color', 'borderColor'];

                let changedProps = {};
                let hasChanges = false;

                propsToFix.forEach(prop => {
                    const val = computed[prop];
                    if (val && val.includes('oklch')) {
                        // Very rough fallback for Tailwind's generated oklch colors 
                        // It maps them to valid CSS that html2canvas won't crash on
                        // We extract this to something safe, e.g., mapping to an empty string to let the cascade handle it 
                        // or mapping everything into a generic flat rgb to prevent the parsing crash 
                        changedProps[prop] = el.style[prop]; // store original
                        hasChanges = true;

                        // For the purpose of html2canvas parsing, we just convert the string to something it handles
                        // Since computing true RGB from OKLCH requires complex math, we use a basic fallback slate/gray
                        el.style[prop] = prop === 'color' ? 'rgb(15, 23, 42)' : prop === 'borderColor' ? 'rgb(226, 232, 240)' : 'rgb(248, 250, 252)';
                    }
                });

                if (hasChanges) {
                    originalStyles.set(el, changedProps);
                }

                for (let i = 0; i < el.children.length; i++) {
                    processElementStyles(el.children[i]);
                }
            };

            processElementStyles(element);

            // Simple robust capture
            const canvas = await html2canvas(element, {
                scale: 2,
                useCORS: true,
                logging: false,
                ignoreElements: (node) => {
                    // Safety check to ignore nodes with unparseable colors explicitly
                    const style = window.getComputedStyle(node);
                    return style.color.includes('oklch') || style.backgroundColor.includes('oklch') || style.borderColor.includes('oklch');
                }
            });

            // Restore original styles
            originalStyles.forEach((props, el) => {
                Object.entries(props).forEach(([prop, val]) => {
                    el.style[prop] = val;
                });
            });

            const imgData = canvas.toDataURL('image/jpeg', 0.95);

            // Create PDF
            const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'mm',
                format: 'a4'
            });

            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

            pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
            pdf.save(`MindCare_Health_Report_${Date.now()}.pdf`);

            setPdfLoading(false);
        } catch (error) {
            console.error('PDF generation error:', error);
            alert('PDF generation failed: ' + (error.message || 'Unknown error'));
            setPdfLoading(false);
        }
    };


    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <div className="w-full space-y-6">
            {/* PDF Download Button */}
            <div className="flex justify-end">
                <button
                    onClick={downloadPDF}
                    disabled={pdfLoading}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 disabled:bg-slate-400 text-white font-semibold rounded-xl shadow-md transition-all active:scale-95 disabled:cursor-not-allowed"
                >
                    {pdfLoading ? (
                        <>
                            <Loader className="w-4 h-4 animate-spin" />
                            Generating PDF...
                        </>
                    ) : (
                        <>
                            <Download className="w-4 h-4" />
                            Download as PDF
                        </>
                    )}
                </button>
            </div>

            {/* Prescription Report Container */}
            <div ref={reportRef} className="bg-white rounded-2xl border-2 border-slate-300 shadow-lg p-12">
                {/* Header - Doctor's Letterhead Style */}
                <div className="border-b-2 border-slate-300 pb-6 mb-8">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-full bg-primary-600 text-white flex items-center justify-center font-bold text-lg">
                                MC
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-slate-900">MindCare Health System</h1>
                                <p className="text-sm text-slate-500">Mental Health & Wellness Assessment</p>
                            </div>
                        </div>
                        <div className="text-right text-sm text-slate-600">
                            <p>Report Date: {formatDate(new Date())}</p>
                            <p>Reference ID: {Math.random().toString(36).substr(2, 9).toUpperCase()}</p>
                        </div>
                    </div>
                </div>

                {/* Patient Information Section */}
                <div className="mb-8 pb-6 border-b border-slate-200">
                    <h2 className="text-lg font-bold text-slate-900 mb-4 uppercase tracking-wide">Assessment Overview</h2>
                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest">Risk Assessment</p>
                            <p className="text-2xl font-bold text-slate-900 mt-1">{result.riskLevel}</p>
                        </div>
                        <div>
                            <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest">Stress Level</p>
                            <p className="text-2xl font-bold text-slate-900 mt-1">{result.score}%</p>
                        </div>
                        <div>
                            <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest">Detected Face Emotion</p>
                            <p className="text-lg font-semibold text-primary-600 mt-1 capitalize">{emotion}</p>
                        </div>
                        <div>
                            <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest">Detected Voice Emotion</p>
                            <p className="text-lg font-semibold text-primary-600 mt-1 capitalize">{speechEmotion}</p>
                        </div>
                    </div>
                </div>

                {/* Assessment Findings */}
                <div className="mb-8 pb-6 border-b border-slate-200">
                    <h2 className="text-lg font-bold text-slate-900 mb-4 uppercase tracking-wide">Clinical Findings</h2>
                    <div className="space-y-3">
                        {Object.entries(answers).map(([idx, answer], i) => (
                            <div key={idx} className="flex items-start gap-4 p-3 bg-slate-50 rounded-lg">
                                <span className="flex-shrink-0 w-6 h-6 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center text-xs font-bold">
                                    Q{i + 1}
                                </span>
                                <p className="text-sm text-slate-700">
                                    <span className="font-semibold">Assessment Response:</span> {answer}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* AI Recommendations from Backend */}
                {backendReport?.recommendations && (
                    <div className="mb-8 pb-6 border-b border-slate-200">
                        <h2 className="text-lg font-bold text-slate-900 mb-4 uppercase tracking-wide">System Recommendations</h2>
                        <ul className="space-y-2">
                            {Array.isArray(backendReport.recommendations) && backendReport.recommendations.map((rec, i) => (
                                <li key={i} className="text-sm text-slate-700 pl-6 relative">
                                    <span className="absolute left-0 text-primary-600 font-bold">✓</span>
                                    {rec}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* Chatbot Personalized Analysis */}
                <div className="mb-8 pb-6 border-b border-slate-200">
                    <button
                        onClick={() => setAnalysisExpanded(!analysisExpanded)}
                        className="w-full text-left flex items-center justify-between p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors mb-4 cursor-pointer"
                    >
                        <h2 className="text-lg font-bold text-slate-900 uppercase tracking-wide">Personalized Wellness Guidance</h2>
                        <ChevronDown
                            className={`w-5 h-5 text-primary-600 transition-transform ${analysisExpanded ? 'rotate-180' : ''}`}
                        />
                    </button>

                    {analysisExpanded && (
                        <div className="mt-0">
                            {analysisLoading ? (
                                <div className="flex items-center justify-center gap-2 text-primary-600 py-8">
                                    <Loader className="w-5 h-5 animate-spin" />
                                    <span className="text-sm">Generating personalized analysis...</span>
                                </div>
                            ) : analysisError ? (
                                <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
                                    <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                                    <p className="text-sm text-red-700">{analysisError}</p>
                                </div>
                            ) : (
                                <div className="bg-blue-50 border-l-4 border-primary-600 p-4 rounded text-sm text-slate-700 leading-relaxed whitespace-pre-line max-h-96 overflow-y-auto">
                                    {chatAnalysis}
                                </div>
                            )}
                        </div>
                    )}

                    {!analysisExpanded && !analysisLoading && !analysisError && chatAnalysis && (
                        <div className="text-sm text-slate-500 italic p-2">Click to view your personalized wellness guidance →</div>
                    )}
                </div>

                {/* Risk Level Alert */}
                <div className={`rounded-lg p-4 mb-8 ${result.riskLevel === 'Severe' ? 'bg-red-50 border border-red-200' :
                    result.riskLevel === 'High' ? 'bg-orange-50 border border-orange-200' :
                        result.riskLevel === 'Moderate' ? 'bg-amber-50 border border-amber-200' :
                            'bg-green-50 border border-green-200'
                    }`}>
                    <p className="text-xs font-bold uppercase tracking-widest text-slate-700 mb-2">Clinical Recommendation</p>
                    <p className={`text-sm font-semibold ${result.riskLevel === 'Severe' ? 'text-red-800' :
                        result.riskLevel === 'High' ? 'text-orange-800' :
                            result.riskLevel === 'Moderate' ? 'text-amber-800' :
                                'text-green-800'
                        }`}>
                        {result.riskLevel === 'Severe'
                            ? 'Urgent: Please contact a mental health professional immediately. Crisis support is available 24/7 at 988.'
                            : result.riskLevel === 'High'
                                ? 'Recommended: Schedule an appointment with a mental health professional soon to discuss your concerns.'
                                : result.riskLevel === 'Moderate'
                                    ? 'Advised: Consider speaking with a counselor or therapist to develop a wellness plan.'
                                    : 'Your current mental health status appears stable. Continue healthy habits and monitor your wellbeing.'}
                    </p>
                </div>

                {/* Important Notes */}
                <div className="bg-slate-100 rounded-lg p-4 mb-8 text-xs text-slate-600 leading-relaxed">
                    <p className="font-semibold mb-2">⚠️ Important Disclaimer</p>
                    <p>
                        This assessment report is generated for informational and educational purposes only. It is not a medical diagnosis or treatment plan.
                        The results should not replace professional medical or mental health consultation. Please consult with a licensed healthcare professional
                        for proper diagnosis and treatment recommendations.
                    </p>
                </div>

                {/* Footer */}
                <div className="border-t border-slate-300 pt-6 text-center text-xs text-slate-500">
                    <p>MindCare © 2026 | Mental Health Assessment System</p>
                    <p className="mt-2">This document is confidential and intended for personal use only.</p>
                </div>
            </div>
        </div>
    );
}
