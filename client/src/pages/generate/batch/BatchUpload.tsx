import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBatch } from '../../../contexts/BatchContext';
import { message } from 'antd';

const BatchUpload: React.FC = () => {
    const navigate = useNavigate();
    const { fileList, addFiles, removeFile, clearFiles } = useBatch();
    const [isDragging, setIsDragging] = useState(false);

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const files = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/'));
        if (files.length > 0) {
            if (fileList.length + files.length > 10) {
                message.warning('最多支持10张图片，已过滤部分文件');
                addFiles(files.slice(0, 10 - fileList.length));
            } else {
                addFiles(files);
                message.success(`已添加 ${files.length} 张图片`);
            }
        }
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const files = Array.from(e.target.files).filter(f => f.type.startsWith('image/'));
            if (fileList.length + files.length > 10) {
                message.warning('最多支持10张图片，已过滤部分文件');
                addFiles(files.slice(0, 10 - fileList.length));
            } else {
                addFiles(files);
            }
        }
    };

    return (
        <div className="flex flex-col h-full bg-background-light dark:bg-background-dark">
            <div className="flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth">
                <div className="max-w-5xl mx-auto flex flex-col gap-6">
                    {/* Header Info */}
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-gray-200 dark:border-gray-800">
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">批量上传服装</h1>
                            <p className="text-sm text-slate-500 dark:text-gray-400 mt-1">上传这一批次需要生成的服装图片。</p>
                        </div>
                    </div>

                    {/* Upload Area */}
                    <div
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        className={`group relative flex flex-col items-center justify-center w-full h-64 rounded-xl border-2 border-dashed transition-all cursor-pointer
                            ${isDragging
                                ? 'border-primary bg-primary/5'
                                : 'border-gray-300 dark:border-gray-700 bg-white dark:bg-slate-800/50 hover:border-primary hover:bg-primary/5'
                            }`}
                    >
                        <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center px-4">
                            <div className="size-14 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center mb-4 group-hover:bg-white dark:group-hover:bg-slate-600 group-hover:scale-110 transition-all shadow-sm">
                                <span className="material-symbols-outlined text-3xl text-primary">cloud_upload</span>
                            </div>
                            <p className="mb-2 text-lg font-semibold text-slate-700 dark:text-slate-200">
                                点击或拖拽上传
                            </p>
                            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm">
                                支持批量上传，最多10张，支持 JPG/PNG 格式
                            </p>
                        </div>
                        <input
                            accept="image/png, image/jpeg"
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            multiple
                            type="file"
                            onChange={handleFileSelect}
                        />
                    </div>

                    {/* File List */}
                    <div className="flex flex-col gap-4 pb-20">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold flex items-center gap-2 text-slate-900 dark:text-white">
                                已上传图片
                                <span className="bg-gray-100 dark:bg-gray-800 text-slate-600 dark:text-slate-300 text-xs px-2 py-0.5 rounded-full">
                                    {fileList.length}/10
                                </span>
                            </h3>
                            {fileList.length > 0 && (
                                <button
                                    onClick={clearFiles}
                                    className="text-sm text-red-500 hover:text-red-600 font-medium flex items-center gap-1 transition-colors"
                                >
                                    <span className="material-symbols-outlined text-base">delete_sweep</span>
                                    清空所有
                                </button>
                            )}
                        </div>

                        {fileList.length === 0 ? (
                            <div className="text-center py-12 text-gray-400 border border-dashed border-gray-200 dark:border-gray-800 rounded-lg">
                                暂无上传文件
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                                {fileList.map((file) => (
                                    <div key={file.id} className="group relative bg-white dark:bg-slate-800 rounded-lg p-2 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
                                        <div className="relative w-full aspect-[3/4] rounded overflow-hidden mb-3 bg-gray-100 dark:bg-gray-900">
                                            <img src={file.previewUrl} alt={file.name} className="absolute inset-0 w-full h-full object-cover" />
                                            <button
                                                onClick={() => removeFile(file.id)}
                                                className="absolute top-2 right-2 bg-white/90 dark:bg-black/60 hover:bg-red-50 dark:hover:bg-red-900/50 text-slate-600 dark:text-slate-200 hover:text-red-600 p-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm"
                                            >
                                                <span className="material-symbols-outlined text-lg">delete</span>
                                            </button>
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-xs text-slate-500 dark:text-slate-400 font-medium">文件名称</label>
                                            <div className="flex items-center gap-2 bg-gray-50 dark:bg-slate-900 rounded border border-gray-200 dark:border-gray-700 px-2 py-1.5">
                                                <span className="w-full text-xs sm:text-sm truncate text-slate-700 dark:text-white">{file.name}</span>
                                                <span className="material-symbols-outlined text-primary text-sm" title="Ready">check_circle</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="bg-white/95 dark:bg-surface-dark/95 backdrop-blur px-6 py-4 flex items-center justify-between shrink-0 border-t border-gray-200 dark:border-gray-800 z-10 sticky bottom-0">
                <div className="text-sm text-slate-500 dark:text-slate-400 hidden sm:flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-base">lightbulb</span>
                    <span>提示：请确保图片光线充足，背景干净，以获得最佳识别效果。</span>
                </div>
                <div className="flex gap-3 w-full sm:w-auto ml-auto">
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="flex-1 sm:flex-none px-6 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 text-slate-700 dark:text-slate-200 font-medium text-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    >
                        取消
                    </button>
                    <button
                        onClick={() => navigate('/generate/batch/settings')}
                        disabled={fileList.length === 0}
                        className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg bg-primary text-white font-medium text-sm hover:bg-sky-600 transition-all shadow-md shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        下一步：统一配置
                        <span className="material-symbols-outlined text-lg">arrow_forward</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BatchUpload;
