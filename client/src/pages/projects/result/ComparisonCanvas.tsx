import React, { useState } from 'react';
import { Breadcrumb, Button, Slider } from 'antd';
import {
    FullscreenOutlined,
    UndoOutlined,
    RedoOutlined,
    SwapOutlined
} from '@ant-design/icons';

interface ComparisonCanvasProps {
    imageUrl: string;
    beforeUrl: string;
    filename: string;
    path: string[];
}

const ComparisonCanvas: React.FC<ComparisonCanvasProps> = ({ imageUrl, beforeUrl, filename, path }) => {
    const [sliderValue, setSliderValue] = useState(50);
    const [viewMode, setViewMode] = useState('对比预览');

    return (
        <div className="flex-1 flex flex-col min-w-0 bg-[#f1f5f9] dark:bg-[#0f172a] overflow-hidden">
            {/* Header Ribbon */}
            <div className="h-12 flex items-center justify-between px-6 bg-white dark:bg-[#1e293b] border-b border-slate-100 dark:border-slate-800">
                <Breadcrumb
                    className="text-[11px]"
                    items={[
                        { title: <span className="text-slate-400 font-bold flex items-center gap-1"><span className="material-icons text-[14px]">folder</span> 项目列表</span> },
                        ...path.map(p => ({ title: <span className="text-slate-400 font-bold">{p}</span> })),
                        { title: <span className="text-slate-800 dark:text-slate-100 font-black">{filename}</span> }
                    ]}
                />

                <div className="flex items-center gap-6">
                    <div className="bg-slate-50 dark:bg-slate-800/50 p-0.5 rounded-lg border border-slate-100 dark:border-slate-700/50">
                        {['对比预览', '最终效果'].map(mode => (
                            <button
                                key={mode}
                                onClick={() => setViewMode(mode)}
                                className={`px-4 py-1.5 rounded-md text-[11px] font-bold transition-all ${viewMode === mode ? 'bg-white dark:bg-slate-700 text-blue-500 shadow-sm shadow-blue-500/10' : 'text-slate-400 hover:text-slate-600'}`}
                            >
                                {mode}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className="h-4 w-[1px] bg-slate-200 dark:bg-slate-700" />
                    <FullscreenOutlined className="text-slate-400 cursor-pointer hover:text-blue-500" />
                </div>
            </div>

            {/* Canvas Area */}
            <div className="flex-1 p-8 flex flex-col items-center justify-center relative overflow-hidden">
                <div className="relative w-full max-w-[500px] aspect-[3/4] rounded-3xl overflow-hidden shadow-[0_40px_100px_-20px_rgba(0,0,0,0.3)] bg-white dark:bg-slate-800 group">
                    {/* Top Controls Overlay */}
                    <div className="absolute top-4 left-6 z-20 flex flex-col gap-1">
                        <span className="text-[10px] text-white/80 font-bold tracking-tight bg-black/20 backdrop-blur-sm px-1.5 py-0.5 rounded">{filename}</span>
                    </div>

                    <div className="absolute top-4 right-6 z-20 flex items-center gap-3">
                        <Button icon={<UndoOutlined className="text-[12px]" />} className="w-8 h-8 rounded-full border-none bg-white/40 backdrop-blur-xl shadow-lg flex items-center justify-center p-0" />
                        <Button icon={<RedoOutlined className="text-[12px]" />} className="w-8 h-8 rounded-full border-none bg-white/40 backdrop-blur-xl shadow-lg flex items-center justify-center p-0" />
                    </div>

                    {/* Image Area */}
                    <div className="relative w-full h-full cursor-col-resize select-none">
                        {/* After Image */}
                        <img
                            src={imageUrl}
                            className="absolute inset-0 w-full h-full object-cover"
                            style={{ clipPath: `inset(0 ${100 - sliderValue}% 0 0)` }}
                            alt="effect"
                        />
                        {/* Before Image */}
                        <img
                            src={beforeUrl}
                            className="absolute inset-0 w-full h-full object-cover"
                            style={{ clipPath: `inset(0 0 0 ${sliderValue}%)` }}
                            alt="original"
                        />

                        {/* Split Handle */}
                        <div
                            className="absolute top-0 bottom-0 w-0.5 bg-white/80 backdrop-blur-sm z-10 pointer-events-none"
                            style={{ left: `${sliderValue}%` }}
                        >
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-white shadow-xl flex items-center justify-center ring-4 ring-black/5">
                                <SwapOutlined className="text-[#0da6f2] text-[14px]" />
                            </div>
                        </div>
                    </div>

                    {/* Labels */}
                    <div className="absolute bottom-6 left-6 z-20 bg-[#1e293b]/80 backdrop-blur-md text-white text-[9px] font-black px-2.5 py-1.5 rounded-sm tracking-[0.2em] pointer-events-none uppercase border border-white/10">ORIGINAL</div>
                    <div className="absolute bottom-6 right-6 z-20 bg-[#0da6f2] text-white text-[9px] font-black px-2.5 py-1.5 rounded-sm tracking-[0.2em] pointer-events-none uppercase shadow-lg shadow-[#0da6f2]/20">MODELAI EFFECT</div>
                </div>

                {/* Slider Controller */}
                <div className="mt-10 w-full max-w-[360px]">
                    <div className="flex justify-between items-center mb-2 px-1">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">对比调节</span>
                        <span className="text-[10px] font-black text-[#0da6f2] uppercase tracking-widest bg-[#0da6f2]/10 px-2 py-0.5 rounded-full">{sliderValue}%</span>
                    </div>
                    <Slider
                        value={sliderValue}
                        onChange={setSliderValue}
                        tooltip={{ open: false }}
                        className="v2-blue-slider"
                    />
                </div>
            </div>
        </div>
    );
};

export default ComparisonCanvas;
