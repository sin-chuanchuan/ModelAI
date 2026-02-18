import React from 'react';
import { AppstoreOutlined, FolderOpenOutlined, EditOutlined, CheckCircleFilled, LoadingOutlined, ExclamationCircleFilled } from '@ant-design/icons';
import { Tooltip } from 'antd';
import { resolveImageUrl } from '../../../api/client';

interface ResultSidebarProps {
    tasks: any[];
    loading?: boolean;
    selectedTaskId?: string;
    onSelect?: (taskId: string) => void;
}

const ResultSidebar: React.FC<ResultSidebarProps> = ({ tasks, loading, selectedTaskId, onSelect }) => {
    return (
        <div className="w-60 flex flex-col bg-white dark:bg-[#1e293b] border-r border-slate-200 dark:border-slate-800">
            {/* Header */}
            <div className="p-4 flex items-center justify-between border-b border-slate-50 dark:border-slate-800/50">
                <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900 dark:text-white">生成列表</span>
                    <span className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded-full font-bold">{tasks.length}</span>
                </div>
                <AppstoreOutlined className="text-slate-400 cursor-pointer hover:text-blue-500 transition-colors" />
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto p-3 space-y-3">
                {tasks.length === 0 && !loading && (
                    <div className="py-20 flex flex-col items-center justify-center opacity-40">
                        <span className="material-icons text-3xl mb-2 text-slate-300">hourglass_empty</span>
                        <p className="text-[10px] font-bold text-slate-400">暂无生成任务</p>
                    </div>
                )}

                {tasks.map((task) => {
                    const status = task.status;
                    const isCompleted = status === 'COMPLETED';
                    const isProcessing = status === 'PROCESSING' || status === 'PENDING';
                    const isFailed = status === 'FAILED';

                    return (
                        <div
                            key={task.id}
                            onClick={() => onSelect?.(task.id)}
                            className={`group relative p-2.5 rounded-xl border-2 cursor-pointer transition-all ${selectedTaskId === task.id ? 'bg-blue-50/50 border-blue-500 shadow-sm' : isProcessing ? 'bg-blue-50/10 border-blue-100' : isCompleted ? 'bg-white dark:bg-slate-800/30 border-slate-100 dark:border-slate-800 hover:border-slate-300' : 'bg-red-50 border-red-200'}`}
                        >
                            <div className="flex gap-3">
                                <div className="w-14 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-slate-100 dark:bg-slate-800">
                                    <img
                                        src={resolveImageUrl(task.result_url || task.garment_url)}
                                        className="w-full h-full object-cover"
                                        alt=""
                                    />
                                </div>
                                <div className="flex flex-col justify-between py-0.5 overflow-hidden">
                                    <div>
                                        <h4 className="text-[11px] font-bold text-slate-800 dark:text-slate-100 truncate">任务 #{task.id.slice(-4).toUpperCase()}</h4>
                                        <div className="flex items-center gap-1">
                                            <p className={`text-[9px] font-medium ${isFailed ? 'text-red-500' : 'text-slate-400'}`}>
                                                {isCompleted ? '生成成功' : isProcessing ? '计算中...' : '生成失败'}
                                            </p>
                                            {isFailed && task.error_message && (
                                                <Tooltip title={task.error_message}>
                                                    <ExclamationCircleFilled className="text-[10px] text-red-500 cursor-help" />
                                                </Tooltip>
                                            )}
                                        </div>
                                    </div>
                                    {isProcessing && (
                                        <span className="text-[10px] text-blue-500 font-bold flex items-center gap-1">
                                            <LoadingOutlined className="text-[10px]" /> 处理中
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Status Icons */}
                            {isCompleted && (
                                <CheckCircleFilled className="absolute top-2 right-2 text-green-500 text-[14px] bg-white rounded-full border-2 border-white" />
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-transparent">
                <div className="flex flex-col gap-3">
                    <div>
                        <div className="flex items-center justify-between mb-1.5">
                            <span className="text-[10px] font-bold text-slate-400">导出路径</span>
                            <EditOutlined className="text-slate-300 text-[10px] cursor-pointer hover:text-blue-500" />
                        </div>
                        <div className="flex items-center gap-2 bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 p-2 rounded-lg cursor-pointer hover:bg-slate-100/50">
                            <FolderOpenOutlined className="text-slate-400" />
                            <span className="text-[10px] text-slate-600 dark:text-slate-300 font-medium truncate">/我的项目/2024春季上新/商用图</span>
                        </div>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                        <span className="text-[10px] font-bold text-slate-400">已选状态</span>
                        <span className="text-[11px] font-bold text-slate-700 dark:text-slate-200">1 张图片 <span className="text-slate-400 font-medium">(共12张)</span></span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResultSidebar;
