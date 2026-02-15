import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Input, Modal, Radio, message, Select, Progress, Empty } from 'antd';
import { PlusOutlined, SearchOutlined, MoreOutlined, DownloadOutlined, EditOutlined, ReloadOutlined, ArrowRightOutlined } from '@ant-design/icons';
import apiClient from '../../api/client';

interface Project {
    id: string;
    _id?: string;
    name: string;
    status: string;
    created_at: string;
    selected_path: string;
    garment_urls: string[];
    generated_count?: number; // Mocked for UI if not in API
    progress?: number; // Mocked for UI if not in API
}

const ProjectList: React.FC = () => {
    const navigate = useNavigate();
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    // Create Form State
    const [newProjectName, setNewProjectName] = useState('');
    const [selectedPath, setSelectedPath] = useState<'history' | 'platform'>('history');

    const fetchProjects = async () => {
        setLoading(true);
        try {
            const res = await apiClient.get('/projects');
            // Support both direct array and wrapped items structure
            const data = Array.isArray(res.data) ? res.data : (res.data.items || []);
            // Enhance with mock data for V2.0 UI demo if missing
            const enhanced = data.map((p: any) => ({
                ...p,
                id: p.id || p._id,
                generated_count: p.status === 'COMPLETED' ? (p.garment_urls?.length || 0) * 4 : 0,
                progress: p.status === 'GENERATING' ? 45 : p.status === 'COMPLETED' ? 100 : 0
            }));
            setProjects(enhanced);
        } catch (error) {
            console.error(error);
            message.error('获取项目列表失败');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProjects();
    }, []);

    const handleCreate = async () => {
        if (!newProjectName) {
            message.warning('请输入项目名称');
            return;
        }
        try {
            const res = await apiClient.post('/projects/', {
                name: newProjectName,
                selected_path: selectedPath
            });
            message.success('项目创建成功');
            setIsModalOpen(false);
            setNewProjectName('');
            fetchProjects();
            navigate(`/projects/${res.data.id || res.data._id}/workflow`);
        } catch (error) {
            message.error('创建失败');
        }
    };

    const getStatusInfo = (status: string) => {
        switch (status) {
            case 'COMPLETED':
                return { label: '已完成', color: 'success', className: 'bg-green-100 text-green-600' };
            case 'GENERATING':
                return { label: '生成中...', color: 'processing', className: 'bg-blue-100 text-blue-600' };
            case 'FAILED':
                return { label: '生成失败', color: 'error', className: 'bg-red-100 text-red-600' };
            default:
                return { label: '草稿', color: 'default', className: 'bg-slate-100 text-slate-500' };
        }
    };

    const filteredProjects = projects.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (statusFilter === 'all' || p.status.toLowerCase() === statusFilter.toLowerCase())
    );

    return (
        <div className="p-6 md:p-8 min-h-full">
            <div className="flex flex-col gap-6 max-w-[1400px] mx-auto">
                {/* Heading Area */}
                <div className="flex justify-between items-end">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">上新任务列表</h1>
                        <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm">管理您的季节性新品发布及AI商拍生成任务。</p>
                    </div>
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        size="large"
                        onClick={() => setIsModalOpen(true)}
                        className="bg-[#0da6f2] hover:bg-[#0b95da] border-none shadow-lg shadow-[#0da6f2]/20 h-11 px-6 font-semibold"
                    >
                        新建上新项目
                    </Button>
                </div>

                {/* Toolbar Area */}
                <div className="flex justify-between items-center gap-4 bg-white dark:bg-[#1a2c35] p-2 rounded-xl border border-[#e2e8f0] dark:border-[#2d3748] shadow-sm">
                    <div className="flex items-center gap-2 flex-1 max-w-md ml-2">
                        <SearchOutlined className="text-slate-400" />
                        <Input
                            placeholder="搜索项目..."
                            variant="borderless"
                            className="text-sm dark:text-white"
                            value={searchTerm}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center gap-3">
                        <Select
                            defaultValue="all"
                            style={{ width: 120 }}
                            variant="borderless"
                            className="text-sm font-medium"
                            onChange={setStatusFilter}
                            options={[
                                { value: 'all', label: '全部状态' },
                                { value: 'COMPLETED', label: '已完成' },
                                { value: 'GENERATING', label: '生成中' },
                                { value: 'DRAFT', label: '草稿' },
                            ]}
                        />
                    </div>
                </div>

                {/* Project Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                    {/* Add New Project Card Placeholder */}
                    <div
                        onClick={() => setIsModalOpen(true)}
                        className="group bg-white dark:bg-[#1a2c35] border-2 border-dashed border-slate-200 dark:border-[#2d3748] rounded-2xl flex flex-col items-center justify-center p-8 text-center cursor-pointer hover:border-[#0da6f2] hover:bg-[#0da6f2]/5 transition-all duration-300 min-h-[400px]"
                    >
                        <div className="w-14 h-14 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center mb-4 group-hover:bg-[#0da6f2]/10 transition-colors">
                            <PlusOutlined className="text-2xl text-slate-400 group-hover:text-[#0da6f2]" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-700 dark:text-slate-200">新建项目</h3>
                        <p className="text-xs text-slate-400 mt-2 max-w-[180px]">创建新的季节性广告系列或批量上传服装。</p>
                    </div>

                    {filteredProjects.map(project => {
                        const status = getStatusInfo(project.status);
                        const isGenerating = project.status === 'GENERATING';

                        return (
                            <div
                                key={project.id}
                                className="group bg-white dark:bg-[#1a2c35] rounded-2xl border border-[#e2e8f0] dark:border-[#2d3748] shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col"
                            >
                                {/* Card Header / Image */}
                                <div className="relative aspect-[4/3] bg-slate-100 dark:bg-slate-800 overflow-hidden">
                                    <img
                                        src={project.garment_urls?.[0] || 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&q=80&w=400'}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                        alt={project.name}
                                    />
                                    <div className="absolute top-3 left-3 bg-white/90 dark:bg-black/60 backdrop-blur-md px-2 py-1 rounded text-[10px] font-bold tracking-wider">
                                        SS24
                                    </div>
                                    <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Button
                                            icon={<MoreOutlined />}
                                            size="small"
                                            className="bg-white/80 dark:bg-black/60 border-none backdrop-blur-md"
                                        />
                                    </div>
                                </div>

                                {/* Card Body */}
                                <div className="p-4 flex-1 flex flex-col">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="font-bold text-slate-900 dark:text-white truncate flex-1 pr-2" title={project.name}>
                                            {project.name}
                                        </h3>
                                    </div>
                                    <p className="text-[11px] text-slate-400 mb-4">创建于 {new Date(project.created_at).toLocaleDateString()}</p>

                                    <div className="grid grid-cols-2 gap-4 mb-4">
                                        <div className="flex flex-col">
                                            <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                                                <span className="material-symbols-outlined text-sm">checkroom</span>
                                                <span className="text-xs">关联 {project.garment_urls?.length || 0} 款</span>
                                            </div>
                                        </div>
                                        <div className="flex flex-col">
                                            <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                                                <span className="material-symbols-outlined text-sm">photo_library</span>
                                                <span className="text-xs">生成 {project.generated_count || 0} 张</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Progress / Status Area */}
                                    <div className="mt-auto">
                                        {isGenerating ? (
                                            <div className="mb-3">
                                                <div className="flex justify-between text-[10px] font-medium mb-1.5">
                                                    <span className="text-[#0da6f2]">生成中...</span>
                                                    <span className="text-slate-400">{project.progress}%</span>
                                                </div>
                                                <Progress percent={project.progress} showInfo={false} size="small" strokeColor="#0da6f2" trailColor="#f1f5f9" />
                                            </div>
                                        ) : (
                                            <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-bold mb-4 ${status.className}`}>
                                                {status.label}
                                            </span>
                                        )}

                                        <div className="pt-4 border-t border-slate-50 dark:border-[#2d3748] flex items-center justify-between">
                                            <button
                                                onClick={() => navigate(`/projects/${project.id}/workflow`)}
                                                className="text-xs font-bold text-slate-500 hover:text-[#0da6f2] flex items-center gap-1 transition-colors"
                                            >
                                                查看详情
                                                <ArrowRightOutlined className="text-[10px]" />
                                            </button>

                                            <div className="flex gap-1">
                                                {project.status === 'COMPLETED' ? (
                                                    <button className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors" title="下载素材">
                                                        <DownloadOutlined />
                                                    </button>
                                                ) : project.status === 'FAILED' ? (
                                                    <button className="p-1.5 text-slate-400 hover:text-[#0da6f2] transition-colors" title="重试生成">
                                                        <ReloadOutlined />
                                                    </button>
                                                ) : (
                                                    <button className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors" title="继续编辑">
                                                        <EditOutlined />
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {filteredProjects.length === 0 && !loading && (
                    <Empty description="未找到符合条件的项目" className="py-20" />
                )}
            </div>

            {/* Pagination Placeholder */}
            <div className="flex justify-center mt-12 mb-6">
                <nav className="flex items-center gap-1">
                    <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 dark:border-[#2d3748] text-slate-400 hover:bg-slate-50">&lt;</button>
                    <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#0da6f2] text-white font-bold">1</button>
                    <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 dark:border-[#2d3748] text-slate-600 hover:bg-slate-50">2</button>
                    <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 dark:border-[#2d3748] text-slate-600 hover:bg-slate-50">3</button>
                    <span className="px-2 text-slate-400 italic">...</span>
                    <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 dark:border-[#2d3748] text-slate-400 hover:bg-slate-50">&gt;</button>
                </nav>
            </div>

            <Modal
                title="新建季节性上新项目"
                open={isModalOpen}
                onOk={handleCreate}
                onCancel={() => setIsModalOpen(false)}
                okText="创建"
                cancelText="取消"
                centered
                className="v2-modal"
            >
                <div className="flex flex-col gap-6 py-4">
                    <div>
                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">项目名称</label>
                        <Input
                            placeholder="例如：2024夏季新品系列"
                            size="large"
                            value={newProjectName}
                            onChange={e => setNewProjectName(e.target.value)}
                            className="rounded-lg"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">生成路径</label>
                        <Radio.Group
                            className="w-full flex flex-col gap-3"
                            value={selectedPath}
                            onChange={e => setSelectedPath(e.target.value)}
                        >
                            <div className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${selectedPath === 'history' ? 'border-[#0da6f2] bg-[#0da6f2]/5' : 'border-slate-100 dark:border-[#2d3748] hover:border-[#0da6f2]/50'}`}>
                                <Radio value="history" className="font-bold flex items-center">
                                    <span className="text-sm ml-2 dark:text-white">复用历史模特图</span>
                                </Radio>
                                <p className="text-[11px] text-slate-500 ml-8 mt-1">上传您过去拍摄的高质量模特图，AI自动为模特“换”上新衣服。</p>
                            </div>

                            <div className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${selectedPath === 'platform' ? 'border-[#0da6f2] bg-[#0da6f2]/5' : 'border-slate-100 dark:border-[#2d3748] hover:border-[#0da6f2]/50'}`}>
                                <Radio value="platform" className="font-bold flex items-center">
                                    <span className="text-sm ml-2 dark:text-white">使用平台精选参考图</span>
                                </Radio>
                                <p className="text-[11px] text-slate-500 ml-8 mt-1">直接使用平台提供的高质量模特与场景组合，快速生成专业级电商图。</p>
                            </div>
                        </Radio.Group>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default ProjectList;
