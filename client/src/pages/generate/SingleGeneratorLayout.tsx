import React from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';

// Map internal route steps to design breadcrumbs
// Route: step1 -> Design: 1 & 2 (Upload + Model)
// Route: step2 -> Design: 3 (Scene + Pose)
// Route: step3 -> Design: Finish

const SingleGeneratorLayout: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();

    // Determine current active step based on path
    const getCurrentStep = () => {
        if (location.pathname.includes('/step2')) return 3; // Scene & Pose
        if (location.pathname.includes('/step3')) return 4; // Result
        return 1; // Upload & Model
    };

    const currentStep = getCurrentStep();

    return (
        <div className="flex flex-col h-full bg-background-light dark:bg-background-dark">
            {/* Wizard Header */}
            <div className="flex shrink-0 items-center justify-between border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-surface-dark px-8 py-4">
                <div className="flex flex-col gap-1">
                    <h2 className="text-2xl font-bold leading-tight text-[#111618] dark:text-white">单件生成 - 上传与模特选择</h2>
                    <div className="flex items-center gap-2 text-sm">
                        {/* Step 1: Upload */}
                        <div className={`flex items-center gap-1.5 font-semibold ${currentStep >= 1 ? 'text-primary' : 'text-slate-500'}`}>
                            <span className={`flex size-5 items-center justify-center rounded-full text-[10px] ${currentStep >= 1 ? 'bg-primary text-white' : 'border border-slate-300 text-slate-500'}`}>1</span>
                            上传服装
                        </div>
                        <span className="text-slate-300">/</span>

                        {/* Step 2: Model (Merged with Upload in UI flow, but visually distinct in breadcrumb) */}
                        <div className={`flex items-center gap-1.5 font-medium ${currentStep >= 1 ? 'text-primary' : 'text-slate-500 dark:text-slate-400'}`}>
                            <span className={`flex size-5 items-center justify-center rounded-full text-[10px] ${currentStep >= 1 ? 'bg-primary text-white' : 'border border-slate-300 text-slate-500 dark:border-slate-600'}`}>2</span>
                            选择模特
                        </div>
                        <span className="text-slate-300">/</span>

                        {/* Step 3: Scene & Pose */}
                        <div className={`flex items-center gap-1.5 font-medium ${currentStep >= 3 ? 'text-primary' : 'text-slate-500 dark:text-slate-400'}`}>
                            <span className={`flex size-5 items-center justify-center rounded-full text-[10px] ${currentStep >= 3 ? 'bg-primary text-white' : 'border border-slate-300 text-slate-500 dark:border-slate-600'}`}>3</span>
                            选择场景与姿势
                        </div>
                    </div>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="rounded-lg px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                    >
                        取消
                    </button>
                    {/* Next button is usually inside the step content to validate form, but we can have it here if global */}
                    {/* We'll let specific pages render the primary action button to handle validation */}
                </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-hidden relative">
                <Outlet />
            </div>
        </div>
    );
};

export default SingleGeneratorLayout;
