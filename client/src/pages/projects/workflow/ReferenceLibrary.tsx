import React from 'react';
import { Tabs, Badge, Tooltip, Spin } from 'antd';
import { ScanOutlined, InfoCircleOutlined, CheckCircleFilled } from '@ant-design/icons';

interface ReferenceLibraryProps {
    hasGarments: boolean;
    activeTab: string;
    setActiveTab: (key: string) => void;
    refLoading: boolean;
    presets: any[];
    history: any[];
    selectedRefs: string[];
    toggleRef: (id: string) => void;
    onUpload?: (file: File) => Promise<boolean>;
    uploading?: boolean;
}

const ReferenceLibrary: React.FC<ReferenceLibraryProps> = ({
    hasGarments,
    activeTab,
    setActiveTab,
    refLoading,
    presets,
    history,
    selectedRefs,
    toggleRef,
    onUpload,
    uploading
}) => {
    return (
        <div className={`flex-1 flex flex-col transition-all duration-500 ${!hasGarments ? 'opacity-30 blur-[2px] pointer-events-none bg-slate-50' : 'bg-[#fdfdfd] dark:bg-[#0f172a]'}`}>
            {!hasGarments && (
                <div className="absolute inset-0 z-10 flex flex-col items-center justify-center p-12 text-center">
                    <div className="w-16 h-16 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center mb-4">
                        <span className="material-icons text-slate-400 text-4xl">lock</span>
                    </div>
                    <h4 className="text-base font-bold text-slate-600 dark:text-slate-300">请先上传服装</h4>
                    <p className="text-xs text-slate-400 mt-2 max-w-[200px]">完成第一步“上传待合成服装”后，即可解锁并选择参考库中的模特与场景。</p>
                </div>
            )}

            <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <span className="material-symbols-outlined text-purple-500">style</span>
                        第二步：选择参考模特 & 场景
                    </h3>
                    <Tooltip title="AI将参考所选图像的模特神态、动作及光影环境进行合成">
                        <InfoCircleOutlined className="text-slate-400 cursor-help" />
                    </Tooltip>
                </div>

                <Tabs
                    activeKey={activeTab}
                    onChange={setActiveTab}
                    className="v2-tabs"
                    items={[
                        {
                            key: '1',
                            label: (
                                <span className="flex items-center gap-2 px-2 py-1">
                                    <ScanOutlined />
                                    平台精选库
                                </span>
                            ),
                            children: (
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 py-4 min-h-[400px]">
                                    {refLoading ? [...Array(10)].map((_, i) => <div key={i} className="aspect-[3/4] bg-slate-100 dark:bg-slate-800 animate-pulse rounded-xl"></div>) :
                                        presets.length === 0 ? (
                                            <div className="col-span-full py-20 flex flex-col items-center justify-center opacity-40">
                                                <span className="material-icons text-5xl mb-2">image_not_supported</span>
                                                <p className="text-xs font-medium">精选库暂未加载，请稍后再试</p>
                                            </div>
                                        ) : (
                                            presets.map(ref => (
                                                <div
                                                    key={ref.id}
                                                    onClick={() => toggleRef(ref.id)}
                                                    className={`group relative aspect-[3/4] rounded-xl overflow-hidden cursor-pointer border-2 transition-all ${selectedRefs.includes(ref.id) ? 'border-[#0da6f2] ring-4 ring-[#0da6f2]/10' : 'border-slate-100 dark:border-[#2d3748] hover:border-[#0da6f2]/50'}`}
                                                >
                                                    <img src={ref.url} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" alt="参考图" />
                                                    {selectedRefs.includes(ref.id) && (
                                                        <div className="absolute inset-0 bg-[#0da6f2]/10 flex items-center justify-center">
                                                            <div className="bg-[#0da6f2] text-white rounded-full p-1 shadow-lg">
                                                                <CheckCircleFilled className="text-xl" />
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            ))
                                        )}
                                </div>
                            )
                        },
                        {
                            key: '2',
                            label: (
                                <Badge count={history.length} offset={[10, 0]} size="small">
                                    <span className="flex items-center gap-2 px-2 py-1">
                                        <span className="material-symbols-outlined text-sm">history</span>
                                        历史上传
                                    </span>
                                </Badge>
                            ),
                            children: (
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 py-4 min-h-[400px]">
                                    {/* Upload Card */}
                                    <div
                                        onClick={() => document.getElementById('ref-upload-input')?.click()}
                                        className="group relative aspect-[3/4] rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-800 hover:border-[#0da6f2] hover:bg-[#0da6f2]/5 flex flex-col items-center justify-center cursor-pointer transition-all"
                                    >
                                        <input
                                            id="ref-upload-input"
                                            type="file"
                                            className="hidden"
                                            accept="image/*"
                                            onChange={(e) => {
                                                const file = e.target.files?.[0];
                                                if (file && onUpload) onUpload(file);
                                            }}
                                        />
                                        {uploading ? (
                                            <Spin size="small" />
                                        ) : (
                                            <>
                                                <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 group-hover:bg-[#0da6f2]/20 flex items-center justify-center mb-2 transition-colors">
                                                    <span className="material-symbols-outlined text-[#0da6f2]">add</span>
                                                </div>
                                                <span className="text-[10px] font-bold text-slate-400 group-hover:text-[#0da6f2]">点击上传模特原图</span>
                                            </>
                                        )}
                                    </div>

                                    {history.length === 0 ? (
                                        <div className="col-span-full py-20 flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-800/30 rounded-2xl border-2 border-dashed border-slate-100">
                                            <span className="material-symbols-outlined text-slate-300 text-5xl mb-3">cloud_off</span>
                                            <p className="text-sm font-bold text-slate-400">暂无历史参考照片</p>
                                            <p className="text-xs text-slate-400 mt-1">您过去上传并保存的模特原图将显示在此处</p>
                                        </div>
                                    ) : (
                                        history.map(ref => {
                                            const refId = ref.id || (ref as any)._id;
                                            return (
                                                <div
                                                    key={refId}
                                                    onClick={() => toggleRef(refId)}
                                                    className={`group relative aspect-[3/4] rounded-xl overflow-hidden cursor-pointer border-2 transition-all ${selectedRefs.includes(refId) ? 'border-[#0da6f2] ring-4 ring-[#0da6f2]/10' : 'border-slate-100 dark:border-[#2d3748] hover:border-[#0da6f2]/50'}`}
                                                >
                                                    <img src={ref.url} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" alt="历史参考图" />
                                                    {selectedRefs.includes(refId) && (
                                                        <div className="absolute inset-0 bg-[#0da6f2]/10 flex items-center justify-center">
                                                            <div className="bg-[#0da6f2] text-white rounded-full p-1 shadow-lg">
                                                                <CheckCircleFilled className="text-xl" />
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })
                                    )}
                                </div>
                            )
                        }
                    ]}
                />
            </div>
        </div>
    );
};

export default ReferenceLibrary;
