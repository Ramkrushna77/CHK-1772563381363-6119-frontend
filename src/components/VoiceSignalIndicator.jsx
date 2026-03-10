import { useEffect, useState } from 'react';

export default function VoiceSignalIndicator({ isRecording }) {
    const [bars, setBars] = useState([40, 60, 30, 70, 50, 65, 35]);

    useEffect(() => {
        if (!isRecording) {
            setBars([40, 60, 30, 70, 50, 65, 35]);
            return;
        }

        const interval = setInterval(() => {
            setBars(prev => prev.map(() => Math.random() * 80 + 20));
        }, 150);

        return () => clearInterval(interval);
    }, [isRecording]);

    return (
        <div className="flex items-center justify-center gap-1.5 h-20">
            {bars.map((height, index) => (
                <div
                    key={index}
                    className={`w-2 rounded-full transition-all duration-150 ${
                        isRecording 
                            ? 'bg-gradient-to-t from-primary-600 to-primary-400' 
                            : 'bg-slate-300'
                    }`}
                    style={{
                        height: isRecording ? `${height}%` : '20%',
                        opacity: isRecording ? 1 : 0.5
                    }}
                />
            ))}
        </div>
    );
}
