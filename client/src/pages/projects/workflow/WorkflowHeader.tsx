import React from 'react';
import { Button } from 'antd';
import { RocketOutlined, CheckCircleFilled } from '@ant-design/icons';

interface WorkflowHeaderProps {
    projectName: string;
    hasGarments: boolean;
    refCount: number;
    totalImages: number;
    onGenerate: () => void;
}

const WorkflowHeader: React.FC<WorkflowHeaderProps> = ({
    projectName,
    hasGarments,
    refCount,
    totalImages,
    onGenerate
}) => {
    return (
        <div className="bg-white dark:bg-[#1e293b] border-b border-slate-200 dark:border-slate-800 px-6 py-3 flex items-center justify-between sticky top-0 z-20">
            <div className="flex items-center gap-6">
                <div className="flex flex-col">
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">当前项目</span>
                    <span className="text-sm font-bold text-slate-900 dark:text-white uppercase">{projectName}</span>
                </div>
                <div className="h-8 w-px bg-slate-200 dark:bg-slate-700"></div>

                {/* Step Indicators */}
                <div className="flex items-center gap-4">
                    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all ${hasGarments ? 'bg-green-50 border-green-100 text-green-600' : 'bg-[#0da6f2]/5 border-[#0da6f2]/20 text-[#0da6f2]'}`}>
                        <span className="w-5 h-5 flex items-center justify-center rounded-full bg-current text-white text-[10px] font-bold">1</span>
                        <span className="text-xs font-bold">上传服装</span>
                        {hasGarments && <CheckCircleFilled className="text-xs" />}
                    </div>
                    <div className="w-4 h-px bg-slate-200 dark:bg-slate-700"></div>
                    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all ${!hasGarments ? 'opacity-40 grayscale border-slate-200' : refCount > 0 ? 'bg-green-50 border-green-100 text-green-600' : 'bg-purple-50 border-purple-100 text-purple-600 animate-pulse ring-2 ring-purple-500/20'}`}>
                        <span className="w-5 h-5 flex items-center justify-center rounded-full bg-current text-white text-[10px] font-bold">2</span>
                        <span className="text-xs font-bold">选择场景/姿势</span>
                        {refCount > 0 && <CheckCircleFilled className="text-xs" />}
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 mr-4 bg-orange-50 dark:bg-orange-950/20 px-3 py-1.5 rounded-lg border border-orange-100 dark:border-orange-900/30">
                    <span className="material-symbols-outlined text-orange-500 text-sm">monetization_on</span>
                    <span className="text-xs font-bold text-orange-700 dark:text-orange-400">消耗 {totalImages * 5} 积分</span>
                </div>
                <Button
                    type="primary"
                    size="large"
                    icon={<RocketOutlined />}
                    disabled={totalImages === 0}
                    onClick={onGenerate}
                    className={`border-none shadow-lg font-bold h-11 transition-all ${totalImages > 0 ? 'bg-[#0da6f2] shadow-[#0da6f2]/20 hover:scale-105 active:scale-95' : 'bg-slate-200 text-slate-400'}`}
                >
                    开始批量合成
                </Button>
            </div>
        </div>
    );
};

export default WorkflowHeader;
