import React from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';

const BatchLayout: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const getCurrentStep = () => {
        if (location.pathname.includes('/settings')) return 2;
        if (location.pathname.includes('/progress')) return 3;
        return 1;
    };

    const currentStep = getCurrentStep();

    return (
        <div className="flex flex-col h-full bg-background-light dark:bg-background-dark">
            <header className="flex-none bg-white dark:bg-surface-dark border-b border-gray-200 dark:border-gray-800 px-6 py-3">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-2 text-sm text-slate-500 mb-1">
                            <button onClick={() => navigate('/dashboard')} className="hover:text-primary transition-colors">工作台</button>
                            <span className="material-symbols-outlined text-xs">chevron_right</span>
                            <span className="text-slate-900 dark:text-white font-medium">批量生成</span>
                        </div>
                        <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">批量上传服装</h1>
                    </div>

                    <div className="flex items-center bg-gray-50 dark:bg-gray-800 rounded-lg p-1.5 shadow-sm border border-gray-200 dark:border-gray-700">
                        <div className={`flex items-center px-3 py-1.5 rounded text-sm font-semibold transition-colors ${currentStep === 1 ? 'bg-primary/10 text-primary' : 'text-slate-400 dark:text-slate-500'}`}>
                            <span className={`flex items-center justify-center size-5 rounded-full text-xs mr-2 ${currentStep === 1 ? 'bg-primary text-white' : 'border border-slate-300 dark:border-slate-600'}`}>1</span>
                            批量上传
                        </div>
                        <span className="material-symbols-outlined text-slate-300 dark:text-slate-600 text-lg mx-1">chevron_right</span>
                        <div className={`flex items-center px-3 py-1.5 rounded text-sm font-semibold transition-colors ${currentStep === 2 ? 'bg-primary/10 text-primary' : 'text-slate-400 dark:text-slate-500'}`}>
                            <span className={`flex items-center justify-center size-5 rounded-full text-xs mr-2 ${currentStep === 2 ? 'bg-primary text-white' : 'border border-slate-300 dark:border-slate-600'}`}>2</span>
                            统一配置
                        </div>
                        <span className="material-symbols-outlined text-slate-300 dark:text-slate-600 text-lg mx-1">chevron_right</span>
                        <div className={`flex items-center px-3 py-1.5 rounded text-sm font-semibold transition-colors ${currentStep === 3 ? 'bg-primary/10 text-primary' : 'text-slate-400 dark:text-slate-500'}`}>
                            <span className={`flex items-center justify-center size-5 rounded-full text-xs mr-2 ${currentStep === 3 ? 'bg-primary text-white' : 'border border-slate-300 dark:border-slate-600'}`}>3</span>
                            任务进度
                        </div>
                    </div>
                </div>
            </header>

            <div className="flex-1 overflow-hidden relative">
                <Outlet />
            </div>
        </div>
    );
};

export default BatchLayout;
