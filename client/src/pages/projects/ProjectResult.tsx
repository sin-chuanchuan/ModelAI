import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Spin, Badge, Avatar } from 'antd';
import { BellOutlined } from '@ant-design/icons';
import { useProjects } from '../../hooks/useProjectWorkflow';

// Sub-components
import ResultSidebar from './result/ResultSidebar';
import ComparisonCanvas from './result/ComparisonCanvas';
import FineTunePanel from './result/FineTunePanel';
import ResultFooter from './result/ResultFooter';

const ProjectResult: React.FC = () => {
    const { projectId } = useParams<{ projectId: string }>();
    const { project, fetchProject, tasks, fetchTasks } = useProjects();
    const [loading, setLoading] = useState(true);
    const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);

    useEffect(() => {
        if (projectId) {
            const loadData = async () => {
                await fetchProject(projectId);
                const fetchedTasks = await fetchTasks(projectId);
                if (fetchedTasks && fetchedTasks.length > 0 && !selectedTaskId) {
                    setSelectedTaskId(fetchedTasks[0].id);
                }
                setLoading(false);
            };
            loadData();

            // Simple polling for task status
            const interval = setInterval(() => fetchTasks(projectId), 5000);
            return () => clearInterval(interval);
        }
    }, [projectId, fetchProject, fetchTasks]);

    const selectedTask = tasks.find(t => t.id === selectedTaskId) || tasks[0];

    if (loading || !project) {
        return (
            <div className="h-full flex flex-col items-center justify-center bg-[#f8fafc] dark:bg-[#0f172a]">
                <Spin size="large" tip="正在加载工作台..." />
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full bg-white dark:bg-[#0f172a] overflow-hidden">
            {/* Global Navbar (Topmost) */}
            <div className="h-14 px-6 flex items-center justify-between border-b border-slate-100 dark:border-slate-800 shrink-0 z-50">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center">
                        <span className="material-icons text-white text-lg">auto_fix_high</span>
                    </div>
                    <span className="text-sm font-black tracking-tight text-slate-900 dark:text-white uppercase italic">ModelAI</span>
                </div>

                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2 bg-green-50 dark:bg-green-900/20 px-3 py-1.5 rounded-full border border-green-100 dark:border-green-800/30">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                        <span className="text-[10px] font-bold text-green-600 dark:text-green-400">云端算力：空闲</span>
                    </div>

                    <div className="flex items-center gap-4">
                        <Badge dot color="#ef4444">
                            <BellOutlined className="text-slate-400 text-lg cursor-pointer hover:text-slate-600" />
                        </Badge>
                        <div className="w-8 h-8 rounded-full border border-slate-200 dark:border-slate-700 p-0.5">
                            <Avatar
                                size="small"
                                className="bg-[#0da6f2] font-bold text-[10px]"
                            >
                                JS
                            </Avatar>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex overflow-hidden">
                {/* 1. Left Section: Generation List */}
                <ResultSidebar
                    tasks={tasks}
                    loading={loading}
                    selectedTaskId={selectedTaskId || undefined}
                    onSelect={setSelectedTaskId}
                />

                {/* 2. Middle Section: Image Comparison Canvas */}
                {selectedTask ? (
                    <ComparisonCanvas
                        imageUrl={selectedTask.result_url || selectedTask.garment_url}
                        beforeUrl={selectedTask.reference_image_url || selectedTask.garment_url}
                        filename={`任务 #${selectedTask.id.slice(-4).toUpperCase()}`}
                        path={[project.name, '生图结果']}
                    />
                ) : (
                    <div className="flex-1 flex items-center justify-center bg-slate-50">
                        <Spin tip="等待任务加载..." />
                    </div>
                )}

                {/* 3. Right Section: Fine-tuning Panel */}
                <FineTunePanel />
            </div>

            {/* Bottom Actions Bar */}
            <ResultFooter />
        </div>
    );
};

export default ProjectResult;
