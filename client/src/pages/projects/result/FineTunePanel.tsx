import React from 'react';
import { Button, Segmented, Tag } from 'antd';
import {
    PlusOutlined,
    UserOutlined,
    PictureOutlined,
    ThunderboltFilled
} from '@ant-design/icons';

import { useParams } from 'react-router-dom';
import { useProjects } from '../../../hooks/useProjectWorkflow';

const FineTunePanel: React.FC = () => {
    const { projectId } = useParams<{ projectId: string }>();
    const { generateProject, loading } = useProjects();

    const handleApply = async () => {
        if (!projectId) return;
        await generateProject(projectId);
    };

    return (
        <div className="w-80 flex flex-col bg-white dark:bg-[#1e293b] border-l border-slate-200 dark:border-slate-800">
            <div className="p-5 overflow-y-auto flex-1">
                <h2 className="text-base font-bold text-slate-900 dark:text-white mb-6">微调配置</h2>

                {/* 更换模特 Section */}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                            <div className="bg-blue-50 dark:bg-blue-900/30 p-1.5 rounded-md">
                                <UserOutlined className="text-blue-500 text-sm" />
                            </div>
                            <span className="text-sm font-bold text-slate-800 dark:text-slate-200">更换模特</span>
                        </div>
                        <Tag className="mr-0 border-none bg-slate-100 dark:bg-slate-800 text-[10px] text-slate-400 px-2 py-0.5 rounded">Auto-Pose</Tag>
                    </div>

                    <div className="mb-4">
                        <Segmented
                            block
                            options={['真实模特', '虚拟数字人']}
                            className="v2-segmented bg-slate-50 dark:bg-slate-800/50 p-1"
                        />
                    </div>

                    <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="relative group flex-shrink-0">
                                <div className={`w-14 h-14 rounded-full overflow-hidden border-2 transition-all ${i === 1 ? 'border-blue-500 ring-2 ring-blue-500/20' : 'border-transparent hover:border-slate-200'}`}>
                                    <img
                                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=model${i}`}
                                        className="w-full h-full object-cover"
                                        alt=""
                                    />
                                </div>
                                {i === 1 && (
                                    <div className="absolute -bottom-0.5 -right-0.5 w-5 h-5 bg-blue-500 rounded-full border-2 border-white flex items-center justify-center">
                                        <span className="material-icons text-white text-[12px]">check</span>
                                    </div>
                                )}
                            </div>
                        ))}
                        <Button
                            icon={<PlusOutlined />}
                            className="w-14 h-14 flex-shrink-0 rounded-full border-dashed border-slate-200 dark:border-slate-700 bg-transparent text-slate-300"
                        />
                    </div>
                </div>

                {/* 更换背景 Section */}
                <div className="mb-6">
                    <div className="flex items-center gap-2 mb-4">
                        <div className="bg-blue-50 dark:bg-blue-900/30 p-1.5 rounded-md">
                            <PictureOutlined className="text-blue-500 text-sm" />
                        </div>
                        <span className="text-sm font-bold text-slate-800 dark:text-slate-200">更换背景</span>
                    </div>

                    {/* 纯色背景 */}
                    <div className="mb-6">
                        <p className="text-[11px] font-bold text-slate-400 mb-3 ml-1">纯色背景</p>
                        <div className="flex items-center gap-3">
                            {['#FFFFFF', '#F1F5F9', '#DBEAFE', '#1E293B'].map((color, idx) => (
                                <div
                                    key={idx}
                                    className={`w-7 h-7 rounded-full border-2 cursor-pointer transition-all ${idx === 0 ? 'border-blue-500' : 'border-transparent hover:scale-110'}`}
                                    style={{ backgroundColor: color }}
                                />
                            ))}
                            <div className="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 cursor-pointer">
                                <PlusOutlined className="text-[12px]" />
                            </div>
                        </div>
                    </div>

                    {/* 实景背景 */}
                    <div>
                        <p className="text-[11px] font-bold text-slate-400 mb-3 ml-1">实景背景</p>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="group relative rounded-lg overflow-hidden border-2 border-blue-500 cursor-pointer aspect-[4/3]">
                                <img src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=200" className="w-full h-full object-cover" alt="" />
                                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-all" />
                                <div className="absolute bottom-0 left-0 right-0 p-1.5 bg-gradient-to-t from-black/60 to-transparent">
                                    <span className="text-[9px] text-white font-bold tracking-wider">商业街景</span>
                                </div>
                                <div className="absolute top-1 right-1 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center scale-90">
                                    <span className="material-icons text-white text-[10px]">check</span>
                                </div>
                            </div>
                            <div className="group relative rounded-lg overflow-hidden border-2 border-transparent hover:border-slate-200 cursor-pointer aspect-[4/3]">
                                <img src="https://images.unsplash.com/photo-1512436939413-b3a55e1373b3?auto=format&fit=crop&q=80&w=200" className="w-full h-full object-cover" alt="" />
                                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-all" />
                                <div className="absolute bottom-0 left-0 right-0 p-1.5 bg-gradient-to-t from-black/60 to-transparent">
                                    <span className="text-[9px] text-white font-bold tracking-wider">极简家居</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Sticky Action Footer */}
            <div className="p-5 pt-0 bg-white dark:bg-[#1e293b]">
                <Button
                    type="primary"
                    block
                    loading={loading}
                    onClick={handleApply}
                    className="h-12 rounded-xl bg-[#0f172a] hover:bg-slate-800 border-none font-bold flex items-center justify-center gap-2 mb-3 shadow-lg"
                >
                    <ThunderboltFilled className="text-white" />
                    应用更改并生成
                </Button>
                <div className="text-center text-[10px] text-slate-400 font-medium">
                    预计消耗 <span className="text-slate-500 font-bold">2</span> 算网点
                </div>
            </div>
        </div>
    );
};

export default FineTunePanel;
