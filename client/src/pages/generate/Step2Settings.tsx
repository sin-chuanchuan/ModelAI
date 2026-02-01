import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useGeneration } from '../../contexts/GenerationContext';
import { message } from 'antd';

const SCENES = [
    { id: '1', name: '纯白', type: 'color', color: 'bg-gradient-to-br from-white to-gray-100', image: '' },
    { id: '2', name: '纯灰', type: 'color', color: 'bg-gradient-to-br from-gray-200 to-gray-300', image: '' },
    { id: '3', name: '咖啡店', type: 'image', color: 'bg-orange-100', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA6cEcE84bqn1-_Z_UclJX2T2-AomnfaqPxuNaPTF71pci3rvQl7NoR2syvIWAOYBiHPW7IDeBnN8EM4tJakRyflHx72k1OqUR7DYfWP4vIwsZ721a9cuozCajl5iqho49aU9N1OuVXQCOm9ILgkpyn_xiTmeXuWO7kJKRuOXds5eURve-2d2GMKlRSpD_pi2oZCxZcHl-W-yhbKLpyInMplRMzNN34VeeQ4K4WwUKcRJXLFumEaafKRdYx4F9bioWk1-b-y-VE2bXo' },
    { id: '4', name: '街拍', type: 'image', color: 'bg-blue-100', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCY8VQZwiptwGB6kK0JdID7oiuKqi8dk34uiDzbgrkLrUDMOTtLOddFH1z8EIuOXm6Tj7pbSqOLqU7JJdCqiO0An15RoZ_QQV0AS1G39kfJgoh9ES4dMl5YMoQtthM-QiUQ_keLnzDAUuv5HLH5IAtk6XupLkh0-6biCasnUU2GHqcUWuM8xFkio31hUGLp_rNrP1TOgrCBuPUlATJCQlwkZbhhqTK6JSGBPZWcHHIX_mxbxBOVOItzvmx_M7k6IJdu1LblHs9DcXdc' },
    { id: '5', name: '室内', type: 'image', color: 'bg-indigo-100', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBbiD7m7NkBWiLbm2FznUULg4Ep1LDesev7wvQdIi1XFHsV7nNdBdhOFo5u3ACY6-NmkUK-vhBmathwq-ZX7vNESebzTq4VhcmkJgWVIVUBcbTSYYjnGpHLjZFtoVol5mtiqRTGix6U0QCxayWCT5HJM6FrhHeMc5XNJzWz7FyJR1l4r1jPHRk-Vb-37sT4rB9Z5tfjBU9d24NCinpgHROtrQCUN6l2j2Efu6HpIiNPzg7gGm1v0nElwwbHPSfTBZoOZEmFRWwDQCtC' },
];

const POSES = [
    { id: '1', name: '正面站立', icon: 'accessibility_new', scaleX: 1 },
    { id: '2', name: '侧面站立', icon: 'person', scaleX: -1 },
    { id: '3', name: '坐姿', icon: 'chair', scaleX: 1 },
    { id: '4', name: '行走', icon: 'directions_walk', scaleX: 1 },
    { id: '5', name: '细节展示', icon: 'zoom_in', scaleX: 1 },
];

const Step2Settings: React.FC = () => {
    const navigate = useNavigate();
    const {
        selectedSceneId, setSelectedSceneId,
        selectedPoseId, setSelectedPoseId
    } = useGeneration();

    const handleGenerate = () => {
        message.loading('正在提交生成任务...', 1);
        setTimeout(() => {
            navigate('/generate/single/step3');
        }, 1500);
    };

    return (
        <div className="flex flex-col h-full overflow-hidden">
            {/* Main Scrollable Area */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
                <div className="w-full max-w-[1100px] mx-auto flex flex-col gap-6 mb-12">

                    {/* Info Header */}
                    <div className="w-full flex flex-col md:flex-row justify-between items-start md:items-center border-b border-gray-200 dark:border-gray-800 pb-4">
                        <div className="flex items-center gap-2 text-sm font-medium">
                            <button onClick={() => navigate('/generate/single/step1')} className="text-[#607c8a] dark:text-gray-400 hover:text-primary flex items-center gap-1 transition-colors">
                                <span className="material-symbols-outlined text-lg">check_circle</span>
                                上传
                            </button>
                            <span className="text-gray-300 dark:text-gray-600">/</span>
                            <span className="text-primary bg-primary/10 px-3 py-1 rounded-full flex items-center gap-1">
                                <span className="material-symbols-outlined text-lg">settings</span>
                                选择
                            </span>
                            <span className="text-gray-300 dark:text-gray-600">/</span>
                            <span className="text-[#607c8a] dark:text-gray-500">生成</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                        {/* Left: Input Summary */}
                        <div className="lg:col-span-4 flex flex-col gap-6">
                            <h3 className="text-lg font-bold text-[#111618] dark:text-white flex items-center gap-2">
                                <span className="material-symbols-outlined">inventory_2</span>
                                输入参考
                            </h3>

                            {/* Garment Card */}
                            <div className="bg-white dark:bg-surface-dark rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-800">
                                <div className="w-full aspect-[3/4] rounded-lg bg-gray-100 dark:bg-gray-800 mb-4 flex items-center justify-center text-gray-400">
                                    {/* Simple placeholder or context image */}
                                    <span className="material-symbols-outlined text-4xl">checkroom</span>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <span className="text-xs font-semibold text-primary uppercase tracking-wider">服装</span>
                                    <p className="text-lg font-bold text-[#111618] dark:text-white leading-tight">已上传服装</p>
                                </div>
                            </div>

                            {/* Model Card */}
                            <div className="bg-white dark:bg-surface-dark rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-800 flex items-center gap-4">
                                <div className="size-12 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                                    <span className="material-symbols-outlined">face</span>
                                </div>
                                <div>
                                    <span className="text-xs font-semibold text-primary uppercase tracking-wider block">模特</span>
                                    <p className="text-base font-bold text-[#111618] dark:text-white">已选模特</p>
                                </div>
                                <button onClick={() => navigate('/generate/single/step1')} className="ml-auto text-[#607c8a] hover:text-primary transition-colors">
                                    <span className="material-symbols-outlined">edit</span>
                                </button>
                            </div>
                        </div>

                        {/* Right: Settings Selection */}
                        <div className="lg:col-span-8 flex flex-col gap-8">
                            <div className="flex flex-col gap-1">
                                <h1 className="text-2xl font-bold text-[#111618] dark:text-white tracking-tight">定制您的造型</h1>
                                <p className="text-[#607c8a] dark:text-gray-400 text-base">配置生成环境与姿态，打造完美展示效果。</p>
                            </div>

                            {/* Scene Selection */}
                            <div className="flex flex-col gap-4">
                                <div className="flex items-center justify-between">
                                    <h4 className="text-lg font-semibold text-[#111618] dark:text-white">选择场景</h4>
                                </div>
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                                    {SCENES.map(scene => (
                                        <div
                                            key={scene.id}
                                            onClick={() => setSelectedSceneId(scene.id)}
                                            className={`group cursor-pointer relative rounded-lg overflow-hidden transition-all duration-200
                                                ${selectedSceneId === scene.id
                                                    ? 'ring-2 ring-primary ring-offset-2 dark:ring-offset-[#101c22]'
                                                    : 'border border-gray-200 dark:border-gray-700 hover:border-primary dark:hover:border-primary'
                                                }`}
                                        >
                                            {selectedSceneId === scene.id && (
                                                <div className="absolute top-2 right-2 bg-primary text-white rounded-full p-0.5 z-10 shadow-sm animate-scale-in">
                                                    <span className="material-symbols-outlined text-sm font-bold">check</span>
                                                </div>
                                            )}
                                            <div className={`aspect-square flex items-center justify-center relative overflow-hidden ${scene.color} dark:bg-opacity-30`}>
                                                {scene.type === 'image' && (
                                                    <img src={scene.image} alt={scene.name} className="absolute inset-0 w-full h-full object-cover opacity-80 transition-transform duration-500 group-hover:scale-110" />
                                                )}
                                                {scene.type === 'color' && (
                                                    <div className={`w-full h-full ${scene.color}`}></div>
                                                )}
                                            </div>
                                            <div className="p-2 bg-white dark:bg-surface-dark text-center">
                                                <span className={`text-sm ${selectedSceneId === scene.id ? 'font-bold text-primary' : 'font-medium'}`}>{scene.name}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Pose Selection */}
                            <div className="flex flex-col gap-4 mt-2">
                                <div className="flex items-center justify-between">
                                    <h4 className="text-lg font-semibold text-[#111618] dark:text-white">选择姿势</h4>
                                </div>
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                                    {POSES.map(pose => (
                                        <div
                                            key={pose.id}
                                            onClick={() => setSelectedPoseId(pose.id)}
                                            className={`group cursor-pointer relative rounded-lg overflow-hidden transition-all duration-200
                                                ${selectedPoseId === pose.id
                                                    ? 'ring-2 ring-primary ring-offset-2 dark:ring-offset-[#101c22]'
                                                    : 'border border-gray-200 dark:border-gray-700 hover:border-primary dark:hover:border-primary'
                                                }`}
                                        >
                                            {selectedPoseId === pose.id && (
                                                <div className="absolute top-2 right-2 bg-primary text-white rounded-full p-0.5 z-10 shadow-sm animate-scale-in">
                                                    <span className="material-symbols-outlined text-sm font-bold">check</span>
                                                </div>
                                            )}
                                            <div className={`aspect-[3/4] flex flex-col items-center justify-center p-4 ${selectedPoseId === pose.id ? 'bg-blue-50 dark:bg-blue-900/20' : 'bg-gray-50 dark:bg-gray-800'}`}>
                                                <div className={`w-2/3 h-2/3 border-2 border-dashed rounded-lg flex items-center justify-center transition-colors 
                                                    ${selectedPoseId === pose.id ? 'border-primary/30 bg-primary/5' : 'border-gray-300 dark:border-gray-600'}`}>
                                                    <span
                                                        className={`material-symbols-outlined text-4xl ${selectedPoseId === pose.id ? 'text-primary' : 'text-gray-400'}`}
                                                        style={{ transform: `scaleX(${pose.scaleX})` }}
                                                    >
                                                        {pose.icon}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="p-2 bg-white dark:bg-surface-dark text-center">
                                                <span className={`text-sm ${selectedPoseId === pose.id ? 'font-bold text-primary' : 'font-medium'}`}>{pose.name}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>

            {/* Sticky Footer */}
            <div className="mt-auto px-6 py-4 border-t border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-surface-dark/80 backdrop-blur-md flex items-center justify-between shrink-0 z-10">
                <button
                    onClick={() => navigate('/generate/single/step1')}
                    className="px-6 py-3 rounded-lg text-[#607c8a] dark:text-gray-400 font-medium hover:text-[#111618] dark:hover:text-white transition-colors flex items-center gap-2 group"
                >
                    <span className="material-symbols-outlined group-hover:-translate-x-1 transition-transform">arrow_back</span>
                    返回
                </button>
                <div className="flex items-center gap-4">
                    <span className="text-sm text-[#607c8a] dark:text-gray-400 hidden sm:inline-block">预计耗时: ~15秒</span>
                    <button
                        onClick={handleGenerate}
                        disabled={!selectedSceneId || !selectedPoseId}
                        className="bg-primary hover:bg-sky-500 disabled:opacity-50 disabled:cursor-not-allowed text-white px-8 py-3 rounded-lg font-bold shadow-lg shadow-primary/30 transition-all flex items-center gap-2 transform active:scale-95 hover:shadow-primary/40"
                    >
                        <span className="material-symbols-outlined">auto_awesome</span>
                        立即生成
                        <span className="bg-white/20 px-2 py-0.5 rounded text-xs ml-1">1 积分</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Step2Settings;
