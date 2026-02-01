import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useGeneration } from '../../contexts/GenerationContext';
import { message } from 'antd';

// Mock data for models - in production this would fetch from API
const PRESET_MODELS = [
    { id: '1', name: '索菲亚', tag: '标准', type: 'female', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCH8zz2l1cFIRC--gsQ-C9-aljYbPz-tFvNK97WUZAmEKynYqvnOA2A6OcBzNbvnoRMog8myQiPVcUazC9DxjZSa8tPCCfpdR4PHJskv9GHAQN0AmR72IS01tgq8MRwlpJw1EsnIUzA7MVuRU8Gf9aKR5dDs5WomxPvtDYEu3lP4qGI1UDYpEQPkr71-HuAwMkNLZfcbVRsbopn8FyV0cMwoOLTiXAFas7aQz0BsNnm3b5n7Y0MPIj0ZSqfa1PL9izoeactpMjBb0Ii' },
    { id: '2', name: '尤娜', tag: '娇小', type: 'female', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCRNSxKvr7o661voNKMyXdGpjqdtoh07vfpw9qEckKdH9SMNNZgzNEc532WWHIScOhVfhRtaYgBSqwi4fslpfBMK5yce8d5u7J96WQmyy8NDc_BT8iAA9_DdRl8wYFmeTy2hkK-UDSpnzfJPFpTg5SkPTWVT_etFobNrPs3EXFJyknasHFxmBhAB-bUtUJn2wXNcsDZBdEDCwbjm1Ni_yS_0EzvUUyT4NsnyfTYSwVemVNb6-j5wOpf1jHYoMuOSMpykK4eaMl9OZN3' },
    { id: '3', name: '玛雅', tag: '丰满', type: 'female', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCY7CYKe4qD0csMauJnNUfFwBo3q3ukG4h401bAuD3uu5ZjLKZZog5fesnM5Rd4ai_Jnorx8JNO0ihwCww7eB7TjWWX-PSGmIF-gu1nusYeeAgtnOjbbWX17MpHes2-kMm48q_425e9feaLMeUaP-KsbKXbIyJkAO-r1AQPU_TA7uT2-ZRSGI3HOMXY2aLKUdRbpX0JCq7dRrZw-iTYv2tJ1WTVRGbVeJdzeDTQTwF2ycdBetisMbKNuW1J8G9vXbuhJbScJb6943Hk' },
    { id: '4', name: '埃琳娜', tag: '高挑', type: 'female', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBfwgCv4gItYP4Rjt01o7yqAvJSlnjxGrsTTYBmv-xnRTqo7g14HPaVvaJ3qCXy0ULZlAF-XlJX674T49bChiExXFbYs5RyWX0tEmcKwKUJCAcUBllQal92J5is9qwOC6_rORSUHMiGV6eobQNa6qSKmp5H-4i_FO8XkARLU7hleAw9LoI8iC1fmqZPCiXbgsVK11BIrxKwZ7GpKWh8vGIc6ifq13qemnHWvLTWOK18MB5tYehH3r2U5gAR5NjDpAHyn5Qby3WxHD_X' },
    { id: '5', name: 'Alexander', tag: '标准', type: 'male', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDG3dzjrK_4eo0WSPrfrcWT8GoYmfLNXibfA1lRq69TpkJnMqjhr2MHMOn3eqEtvDkIdrqD4EwpqWpUm98603JYUBAu-H3BO_kfU9dXV4oNPQ6-VV-1vquhFgCadBwSzrCRUBHOM88JkkNgCagbNOp3wTah4E_cmKdKWdCnR6IwgX3a5E793OccaegUuilVUo9BYJvV29tDf2iFPm9z-TlOygYy9a-ROwMPjHYC_C9Q5wVEGPPYuQ8lUhkHmmc6w7NTrJJrzh9d8Vz6' },
];

const Step1Upload: React.FC = () => {
    const navigate = useNavigate();
    const {
        uploadedImage, setUploadedImage,
        setUploadedImageFile,
        selectedModelId, setSelectedModelId,
        selectedModelType, setSelectedModelType
    } = useGeneration();

    const [isDragging, setIsDragging] = useState(false);
    const [isUploading, setIsUploading] = useState(false);

    // Filter models
    const filteredModels = PRESET_MODELS.filter(m => m.type === selectedModelType);

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
        const file = e.dataTransfer.files[0];
        if (file) handleFile(file);
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) handleFile(file);
    };

    const handleFile = async (file: File) => {
        if (!file.type.startsWith('image/')) {
            message.error('请上传图片文件');
            return;
        }

        setIsUploading(true);
        // Simulator upload for now, or real upload if endpoints ready.
        // Let's do real upload if possible, or object URL for preview
        const objectUrl = URL.createObjectURL(file);
        setUploadedImage(objectUrl);
        setUploadedImageFile(file);

        // Upload in background to get real URL
        const formData = new FormData();
        formData.append('file', file);
        formData.append('type', 'garment');

        try {
            const response = await axios.post('/materials/upload', formData);
            setUploadedImage(response.data.url); // Update with real URL
            message.success('上传成功');
        } catch (error) {
            console.error(error);
            message.warning('上传同步失败，使用本地预览');
            // Keep objectUrl
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="flex h-full">
            {/* Left: Upload Area */}
            <div className="flex w-1/2 flex-col items-center justify-center overflow-y-auto bg-slate-50 p-8 dark:bg-[#0c161b]">
                <div className="flex w-full max-w-lg flex-col gap-4">
                    <h3 className="flex items-center gap-2 text-lg font-bold text-slate-900 dark:text-white">
                        <span className="material-symbols-outlined text-primary">upload_file</span>
                        上传服装
                    </h3>

                    <div
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        className={`group relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed transition-all duration-300 px-6 py-20
                            ${isDragging
                                ? 'border-primary bg-primary/10'
                                : 'border-slate-300 bg-surface-light dark:border-slate-700 dark:bg-surface-dark hover:border-primary hover:bg-blue-50/30 dark:hover:border-primary/50 dark:hover:bg-slate-800/50'
                            }`}
                    >
                        {uploadedImage ? (
                            <div className="relative w-full flex justify-center">
                                <img src={uploadedImage} alt="Uploaded" className="max-h-[300px] object-contain rounded-lg shadow-lg" />
                                <button
                                    onClick={() => { setUploadedImage(null); setUploadedImageFile(null); }}
                                    className="absolute -top-3 -right-3 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 shadow-md"
                                >
                                    <span className="material-symbols-outlined text-sm">close</span>
                                </button>
                            </div>
                        ) : (
                            <>
                                <div className="mb-4 flex size-16 items-center justify-center rounded-full bg-blue-50 dark:bg-slate-800 group-hover:scale-110 transition-transform duration-300">
                                    <span className="material-symbols-outlined text-3xl text-primary">{isUploading ? 'cloud_sync' : 'cloud_upload'}</span>
                                </div>
                                <p className="mb-1 text-center text-lg font-semibold text-slate-900 dark:text-white">点击或拖拽服装图至此处</p>
                                <p className="mb-6 text-center text-sm text-slate-500 dark:text-slate-400">支持 JPG, PNG (最大 10MB)</p>
                                <label className="cursor-pointer rounded-lg bg-primary px-5 py-2.5 text-sm font-bold text-white transition-transform active:scale-95 shadow-lg shadow-primary/20 hover:bg-primary/90">
                                    浏览文件
                                    <input accept="image/*" className="hidden" type="file" onChange={handleFileSelect} />
                                </label>
                            </>
                        )}
                    </div>

                    <div className="rounded-lg bg-blue-50 p-4 dark:bg-slate-800/50">
                        <div className="flex items-start gap-3">
                            <span className="material-symbols-outlined mt-0.5 text-primary">info</span>
                            <div className="text-sm text-slate-600 dark:text-slate-300">
                                <p className="font-semibold text-slate-900 dark:text-white">提示：</p>
                                为获得最佳效果，请上传平铺的服装图片或带有中性背景的模特图。
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right: Model Selection */}
            <div className="flex w-1/2 flex-col border-l border-gray-200 bg-surface-light dark:border-gray-800 dark:bg-surface-dark">
                <div className="flex shrink-0 items-center justify-between border-b border-gray-200 px-6 py-4 dark:border-gray-800">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">选择模特</h3>
                    <div className="flex rounded-lg bg-slate-100 p-1 dark:bg-slate-800">
                        <button
                            onClick={() => setSelectedModelType('female')}
                            className={`rounded-md px-3 py-1.5 text-xs font-bold transition-all ${selectedModelType === 'female' ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-700 dark:text-white' : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'}`}
                        >
                            女性
                        </button>
                        <button
                            onClick={() => setSelectedModelType('male')}
                            className={`rounded-md px-3 py-1.5 text-xs font-bold transition-all ${selectedModelType === 'male' ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-700 dark:text-white' : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'}`}
                        >
                            男性
                        </button>
                        <button
                            onClick={() => setSelectedModelType('child')}
                            className={`rounded-md px-3 py-1.5 text-xs font-bold transition-all ${selectedModelType === 'child' ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-700 dark:text-white' : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'}`}
                        >
                            儿童
                        </button>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-6">
                    <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
                        {filteredModels.map(model => (
                            <button
                                key={model.id}
                                onClick={() => setSelectedModelId(model.id)}
                                className={`group relative flex flex-col gap-2 rounded-xl p-2 text-left transition-all duration-200
                                    ${selectedModelId === model.id
                                        ? 'border-2 border-primary bg-blue-50/50 ring-2 ring-primary/20 ring-offset-2 dark:bg-slate-800 dark:ring-offset-[#18262e]'
                                        : 'border-2 border-transparent hover:bg-slate-50 dark:hover:bg-slate-800/50'
                                    }`}
                            >
                                {selectedModelId === model.id && (
                                    <div className="absolute right-2 top-2 z-10 flex size-6 items-center justify-center rounded-full bg-primary text-white shadow-sm animate-fade-in">
                                        <span className="material-symbols-outlined text-sm font-bold">check</span>
                                    </div>
                                )}
                                <div className="aspect-[3/4] w-full overflow-hidden rounded-lg bg-slate-200 border border-slate-100 dark:border-slate-700">
                                    <img
                                        alt={model.name}
                                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                                        src={model.image}
                                    />
                                </div>
                                <div className="px-1">
                                    <p className="text-sm font-bold text-slate-900 dark:text-white">{model.name}</p>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">{model.tag}</p>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="flex shrink-0 items-center justify-end px-6 py-4 border-t border-gray-200 dark:border-gray-800 bg-white/50 dark:bg-surface-dark/50 backdrop-blur-sm">
                    <button
                        onClick={() => navigate('/generate/single/step2')}
                        disabled={!uploadedImage || !selectedModelId}
                        className="flex items-center gap-2 rounded-lg bg-primary px-6 py-2 text-sm font-bold text-white shadow-sm transition-all hover:bg-sky-600 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-primary/20 active:scale-95"
                    >
                        下一步
                        <span className="material-symbols-outlined text-sm">arrow_forward</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Step1Upload;
