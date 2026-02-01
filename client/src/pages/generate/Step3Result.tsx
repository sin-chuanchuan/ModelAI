import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGeneration } from '../../contexts/GenerationContext';

const EXPORT_OPTIONS = [
    { id: 'original', label: '原图', size: '2048px', desc: '原始高分辨率，适合二次编辑', checked: true },
    { id: 'taobao', label: '淘宝主图', size: '800x800', desc: '正方形裁剪，电商标准尺寸', checked: false },
    { id: 'detail', label: '详情页', size: '750x不限', desc: '竖向长图，适合移动端详情', checked: false },
];

const Step3Result: React.FC = () => {
    const navigate = useNavigate();
    const {
        resultImage, setResultImage
    } = useGeneration();

    // Mock result generation if not present (since we don't have real generation backend connected fully in this wizard demo)
    // In real app, Step 2 would trigger generation and we'd wait, or pass a Job ID here.
    // For MVP demo, we'll set a mock result if none exists.
    useEffect(() => {
        if (!resultImage) {
            // Set a mock result for demo purposes
            setResultImage('https://lh3.googleusercontent.com/aida-public/AB6AXuCA5dxB6DNN92JjQByy43eIZvnfZ3lZoXsh9T8PDjneeppgY7nUvNclXl8AGXcGSWRUmXBx_BxGgDaDhCGnTTgE3xHlan0EKwatDI4p-IX1yWxbPIXJ4I_7i7X6P2kCVcYFrlqKRgn1JE7BA01DiffWU7CRCvKGrWoEGkZRyGJxC5pDMFouto5REK2sNVCkjQxxeWo8aYbVQh3_Rb1Y3wnRBHyte-16qVcnaUSnkpoDQ8gJAwP4cHBSvLK3pEZreqdB9wu2Su_u8tqn');
        }
    }, [resultImage, setResultImage]);

    const [selectedExport, setSelectedExport] = useState('original');

    return (
        <div className="flex flex-col h-full overflow-hidden">
            {/* Header Actions */}
            <div className="flex shrink-0 items-center justify-between border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-surface-dark px-6 py-4">
                <button
                    onClick={() => navigate('/generate/single/step2')}
                    className="flex w-fit cursor-pointer items-center justify-center rounded-lg h-10 pr-4 bg-transparent text-[#607c8a] dark:text-slate-400 hover:text-primary dark:hover:text-primary transition-colors gap-2 text-sm font-bold leading-normal tracking-[0.015em] group"
                >
                    <span className="material-symbols-outlined text-xl group-hover:-translate-x-1 transition-transform">arrow_back</span>
                    <span>返回编辑</span>
                </button>

                <div className="flex flex-wrap gap-2 items-center text-sm">
                    <span className="text-[#607c8a] dark:text-slate-500 font-medium">上传素材</span>
                    <span className="material-symbols-outlined text-[#607c8a] dark:text-slate-600 text-sm">chevron_right</span>
                    <span className="text-[#607c8a] dark:text-slate-500 font-medium">选择模特</span>
                    <span className="material-symbols-outlined text-[#607c8a] dark:text-slate-600 text-sm">chevron_right</span>
                    <span className="text-primary font-bold bg-primary/10 px-2 py-0.5 rounded">生成结果</span>
                </div>
            </div>

            <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-background-light dark:bg-background-dark">
                <div className="max-w-[1440px] mx-auto h-full flex flex-col">
                    <div className="grid lg:grid-cols-12 gap-6 lg:gap-8 h-full min-h-[600px]">

                        {/* Left: Image Preview */}
                        <div className="lg:col-span-8 flex flex-col">
                            <div className="relative flex-1 bg-white dark:bg-[#15232b] rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden flex items-center justify-center group p-4 lg:p-10">
                                <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]" style={{ backgroundImage: 'radial-gradient(#607c8a 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>

                                <div className="relative shadow-2xl rounded-lg overflow-hidden transition-all duration-500 ease-out group-hover:scale-[1.01]">
                                    {resultImage ? (
                                        <img alt="Generated Result" className="max-h-[60vh] lg:max-h-[70vh] w-auto object-contain block bg-white animate-fade-in" src={resultImage} />
                                    ) : (
                                        <div className="flex items-center justify-center h-64 text-gray-400">Loading...</div>
                                    )}

                                    <div className="absolute bottom-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        <button className="bg-white/90 dark:bg-black/80 backdrop-blur text-[#111618] dark:text-white p-2 rounded-lg shadow-lg hover:bg-white hover:text-primary transition-colors">
                                            <span className="material-symbols-outlined text-xl">zoom_in</span>
                                        </button>
                                        <button className="bg-white/90 dark:bg-black/80 backdrop-blur text-[#111618] dark:text-white p-2 rounded-lg shadow-lg hover:bg-white hover:text-primary transition-colors">
                                            <span className="material-symbols-outlined text-xl">fullscreen</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center justify-between px-2 py-3 text-xs text-[#607c8a] dark:text-slate-400">
                                <span>Generated_Model_042.png</span>
                                <span>2048 x 2048 px</span>
                            </div>
                        </div>

                        {/* Right: Export Options */}
                        <div className="lg:col-span-4 flex flex-col h-full">
                            <div className="bg-white dark:bg-surface-dark rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-6 flex flex-col gap-6 lg:sticky lg:top-4">
                                <div>
                                    <div className="flex items-center gap-2 text-green-600 dark:text-green-400 mb-2">
                                        <span className="material-symbols-outlined text-xl">check_circle</span>
                                        <span className="text-xs font-bold uppercase tracking-wider">生成成功</span>
                                    </div>
                                    <h1 className="text-[#111618] dark:text-white text-2xl font-bold leading-tight mb-2">生成完成</h1>
                                    <p className="text-[#607c8a] dark:text-slate-400 text-sm leading-relaxed">
                                        请在下方预览模特图。选择适合您发布平台的裁剪尺寸后下载。
                                    </p>
                                </div>

                                <hr className="border-gray-100 dark:border-gray-700" />

                                <div className="flex flex-col gap-3">
                                    <label className="text-xs font-bold text-[#607c8a] dark:text-slate-400 uppercase tracking-widest">导出选项</label>

                                    {EXPORT_OPTIONS.map(opt => (
                                        <div
                                            key={opt.id}
                                            onClick={() => setSelectedExport(opt.id)}
                                            className={`relative flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-all
                                                ${selectedExport === opt.id
                                                    ? 'border-2 border-primary bg-primary/5'
                                                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                                                }`}
                                        >
                                            <div className={`mt-0.5 ${selectedExport === opt.id ? 'text-primary' : 'text-[#607c8a] dark:text-slate-500'}`}>
                                                <span className="material-symbols-outlined text-xl">
                                                    {selectedExport === opt.id ? 'radio_button_checked' : 'radio_button_unchecked'}
                                                </span>
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex justify-between items-center mb-0.5">
                                                    <span className="text-sm font-bold text-[#111618] dark:text-white">{opt.label}</span>
                                                    <span className="text-[10px] font-mono bg-white dark:bg-black/20 px-1.5 py-0.5 rounded text-slate-500">{opt.size}</span>
                                                </div>
                                                <p className="text-xs text-[#607c8a] dark:text-slate-400">{opt.desc}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-auto pt-4 flex flex-col gap-3">
                                    <button className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary h-12 px-6 text-white text-base font-bold shadow-lg shadow-primary/20 hover:bg-primary/90 active:scale-[0.98] transition-all">
                                        <span className="material-symbols-outlined">download</span>
                                        下载原图
                                    </button>
                                    <div className="grid grid-cols-2 gap-3">
                                        <button className="flex w-full items-center justify-center gap-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-surface-dark h-10 px-4 text-[#111618] dark:text-slate-200 text-sm font-semibold hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors">
                                            <span className="material-symbols-outlined text-lg">bookmark</span>
                                            保存历史
                                        </button>
                                        <button
                                            onClick={() => navigate('/generate/single/step1')}
                                            className="flex w-full items-center justify-center gap-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-surface-dark h-10 px-4 text-[#111618] dark:text-slate-200 text-sm font-semibold hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors"
                                        >
                                            <span className="material-symbols-outlined text-lg">restart_alt</span>
                                            重新生成
                                        </button>
                                    </div>
                                </div>

                                <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg flex items-start gap-3">
                                    <span className="material-symbols-outlined text-primary text-lg mt-0.5">lightbulb</span>
                                    <p className="text-xs text-blue-900 dark:text-blue-200 leading-snug">
                                        <strong>提示:</strong> 您可以保留当前的模特姿势，仅更换衣服重新生成。
                                    </p>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </main>
        </div>
    );
};

export default Step3Result;
