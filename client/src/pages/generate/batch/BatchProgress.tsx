import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useBatch } from '../../../contexts/BatchContext';

const BatchProgress: React.FC = () => {
    const navigate = useNavigate();
    const { fileList, progress, isGenerating } = useBatch();

    // Calculate stats
    const completedCount = Math.floor((progress / 100) * fileList.length);
    const pendingCount = fileList.length - completedCount;
    // Simple logic to set status based on overall progress
    // In real app, each file would have individual progress

    // Simulate File Status
    const getFileStatus = (index: number) => {
        const fileProgressStep = 100 / fileList.length;
        const currentFileIndex = Math.floor(progress / fileProgressStep);

        if (index < currentFileIndex) return 'completed';
        if (index === currentFileIndex && isGenerating) return 'processing';
        return 'pending';
    };

    return (
        <div className="flex flex-col h-full bg-background-light dark:bg-background-dark overflow-hidden">
            <div className="flex-1 overflow-y-auto p-6 md:p-8">
                <div className="max-w-[1200px] mx-auto flex flex-col gap-6">
                    {/* Header */}
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div className="flex flex-col gap-2">
                            <div className="flex items-center gap-3">
                                <h1 className="text-3xl font-black leading-tight tracking-[-0.033em] text-slate-900 dark:text-white">批次 #20231025</h1>
                                <span className={`px-2 py-1 text-xs font-bold rounded uppercase tracking-wider ${isGenerating ? 'bg-primary/10 text-primary' : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'}`}>
                                    {isGenerating ? '生成中' : '已完成'}
                                </span>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
                                <span className="flex items-center gap-1">
                                    <span className="material-symbols-outlined text-lg">schedule</span>
                                    预计剩余: {isGenerating ? '2分15秒' : '0秒'}
                                </span>
                                <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                                <span>开始时间: 10:42</span>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={() => navigate('/dashboard')}
                                className="flex items-center justify-center gap-2 h-10 px-4 bg-white dark:bg-surface-dark border border-gray-200 dark:border-gray-700 text-slate-900 dark:text-white text-sm font-bold rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors shadow-sm"
                            >
                                <span className="material-symbols-outlined text-[20px]">arrow_back</span>
                                <span>返回工作台</span>
                            </button>
                            <button className="flex items-center justify-center gap-2 h-10 px-4 bg-primary text-white text-sm font-bold rounded-lg hover:bg-sky-600 transition-colors shadow-sm shadow-primary/20">
                                <span className="material-symbols-outlined text-[20px]">download</span>
                                <span>全部下载 (ZIP)</span>
                            </button>
                        </div>
                    </div>

                    {/* Progress Card */}
                    <div className="bg-white dark:bg-surface-dark rounded-xl p-5 shadow-sm border border-gray-200 dark:border-gray-700">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-bold text-slate-900 dark:text-white">总进度</span>
                            <span className="text-sm font-bold text-primary">{progress}%</span>
                        </div>
                        <div className="w-full h-3 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-primary rounded-full transition-all duration-500 ease-out relative overflow-hidden"
                                style={{ width: `${progress}%` }}
                            >
                                {isGenerating && (
                                    <div className="absolute inset-0 bg-white/20 w-full h-full animate-[shimmer_2s_infinite] skew-x-12 translate-x-[-100%]"></div>
                                )}
                            </div>
                        </div>
                        <div className="flex justify-between mt-3 text-xs text-slate-500 dark:text-slate-400">
                            <div className="flex gap-4">
                                <span className="flex items-center gap-1"><span className="size-2 rounded-full bg-green-500"></span> {completedCount} 已完成</span>
                                {isGenerating && <span className="flex items-center gap-1"><span className="size-2 rounded-full bg-primary animate-pulse"></span> 1 生成中</span>}
                                <span className="flex items-center gap-1"><span className="size-2 rounded-full bg-gray-300 dark:bg-gray-600"></span> {pendingCount > 0 && isGenerating ? pendingCount - 1 : pendingCount} 排队中</span>
                            </div>
                            <span>{completedCount}/{fileList.length} 项</span>
                        </div>
                    </div>

                    {/* Task List */}
                    <div className="bg-white dark:bg-surface-dark rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col overflow-hidden">
                        <div className="grid grid-cols-12 gap-4 px-6 py-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-slate-800/50 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                            <div className="col-span-4 md:col-span-5">文件与详情</div>
                            <div className="col-span-4 md:col-span-5">状态</div>
                            <div className="col-span-4 md:col-span-2 text-right">操作</div>
                        </div>

                        {fileList.map((file, index) => {
                            const status = getFileStatus(index);
                            return (
                                <div key={file.id} className={`group grid grid-cols-12 gap-4 px-6 py-4 items-center border-b border-gray-200 dark:border-gray-700 last:border-0 hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors ${status === 'processing' ? 'bg-primary/5' : ''}`}>
                                    <div className="col-span-4 md:col-span-5 flex gap-4 items-center">
                                        <div className="relative size-16 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 shrink-0 bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                                            {status === 'completed' ? (
                                                <img src={file.previewUrl} alt={file.name} className="w-full h-full object-cover" /> // In real app this would be the result image
                                            ) : (
                                                <span className={`material-symbols-outlined ${status === 'processing' ? 'text-primary animate-spin' : 'text-gray-300 dark:text-gray-600'}`}>
                                                    {status === 'processing' ? 'progress_activity' : 'image'}
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex flex-col overflow-hidden">
                                            <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{file.name}</p>
                                            <p className="text-xs text-slate-500 dark:text-slate-400 truncate">Settings: Default</p>
                                        </div>
                                    </div>
                                    <div className="col-span-4 md:col-span-5 flex items-center">
                                        {status === 'completed' && (
                                            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border border-green-100 dark:border-green-900/30">
                                                <span className="material-symbols-outlined text-[18px] filled">check_circle</span>
                                                <span className="text-xs font-bold">已完成</span>
                                            </div>
                                        )}
                                        {status === 'processing' && (
                                            <div className="flex flex-col justify-center gap-2 w-full pr-10">
                                                <div className="flex justify-between items-end w-full">
                                                    <span className="text-xs font-bold text-primary flex items-center gap-1">生成中...</span>
                                                </div>
                                                <div className="w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                                    <div className="h-full bg-primary w-[60%] rounded-full animate-pulse"></div>
                                                </div>
                                            </div>
                                        )}
                                        {status === 'pending' && (
                                            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700">
                                                <span className="material-symbols-outlined text-[18px]">hourglass_empty</span>
                                                <span className="text-xs font-bold">排队中</span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="col-span-4 md:col-span-2 flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button className="size-9 flex items-center justify-center rounded-lg text-slate-500 hover:text-primary hover:bg-white dark:hover:bg-slate-700 transition-colors">
                                            <span className="material-symbols-outlined text-[20px]">visibility</span>
                                        </button>
                                        <button className="size-9 flex items-center justify-center rounded-lg text-slate-500 hover:text-primary hover:bg-white dark:hover:bg-slate-700 transition-colors">
                                            <span className="material-symbols-outlined text-[20px]">download</span>
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
            <style>{`
                @keyframes shimmer {
                    100% { transform: translateX(100%); }
                }
            `}</style>
        </div>
    );
};

export default BatchProgress;
