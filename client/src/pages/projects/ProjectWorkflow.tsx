import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Spin, message } from 'antd';
import { useProjects, useReferences } from '../../hooks/useProjectWorkflow';
import apiClient from '../../api/client';

// Sub-components
import WorkflowHeader from './workflow/WorkflowHeader';
import GarmentSidebar from './workflow/GarmentSidebar';
import ReferenceLibrary from './workflow/ReferenceLibrary';

const ProjectWorkflow: React.FC = () => {
    const { projectId } = useParams<{ projectId: string }>();
    const navigate = useNavigate();
    const { project, fetchProject, addGarments, setReferences, generateProject } = useProjects();
    const { history, presets, fetchHistory, fetchPresets, loading: refLoading } = useReferences();

    const [selectedRefs, setSelectedRefs] = useState<string[]>([]);
    const [uploading, setUploading] = useState(false);
    const [refUploading, setRefUploading] = useState(false);
    const [activeTab, setActiveTab] = useState('1');

    useEffect(() => {
        if (projectId) {
            fetchProject(projectId);
        }
    }, [projectId]);

    useEffect(() => {
        if (project) {
            if (project.selected_path === 'history') {
                fetchHistory();
                setActiveTab('2');
            } else {
                fetchPresets();
                setActiveTab('1');
            }

            if (project.reference_photo_ids) {
                setSelectedRefs(project.reference_photo_ids);
            }
        }
    }, [project]);

    const handleGarmentUpload = async (file: File) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('type', 'garment');

        setUploading(true);
        try {
            const res = await apiClient.post('/materials/upload', formData);
            if (projectId && res.data.url) {
                await addGarments(projectId, [res.data.url]);
                message.success('服装上传成功');
                return true;
            }
        } catch (e) {
            message.error('上传失败');
        } finally {
            setUploading(false);
        }
        return false;
    };

    const handleReferenceUpload = async (file: File) => {
        const formData = new FormData();
        formData.append('file', file);

        setRefUploading(true);
        try {
            const res = await apiClient.post('/references/upload', formData);
            if (res.data.url) {
                message.success('参考图上传成功');
                fetchHistory(); // Refresh history list
                return true;
            }
        } catch (e) {
            message.error('参考图上传失败');
        } finally {
            setRefUploading(false);
        }
        return false;
    };

    const handleGenerate = async () => {
        if (!project || selectedRefs.length === 0) {
            message.warning('请确保已上传服装并选择参考图');
            return;
        }

        await setReferences(projectId!, selectedRefs);

        try {
            await generateProject(project.id);
            message.loading('正在为您准备生成任务...', 2);
            setTimeout(() => {
                navigate(`/projects/${project.id}/result`);
            }, 1000);
        } catch (error) {
            message.error('生成请求失败');
        }
    };

    const toggleRef = (id: string) => {
        setSelectedRefs(prev =>
            prev.includes(id) ? prev.filter(rid => rid !== id) : [...prev, id]
        );
    };

    if (!project) return <div className="h-full flex items-center justify-center"><Spin size="large" /></div>;

    const garmentCount = project.garment_urls?.length || 0;
    const refCount = selectedRefs.length;
    const totalImages = garmentCount * refCount;
    const hasGarments = garmentCount > 0;

    return (
        <div className="flex flex-col h-full bg-[#f8fafc] dark:bg-[#0f172a]">
            <WorkflowHeader
                projectName={project.name}
                hasGarments={hasGarments}
                refCount={refCount}
                totalImages={totalImages}
                onGenerate={handleGenerate}
            />

            <div className="flex-1 flex overflow-hidden">
                <GarmentSidebar
                    garmentUrls={project.garment_urls || []}
                    uploading={uploading}
                    onUpload={handleGarmentUpload}
                />

                <ReferenceLibrary
                    hasGarments={hasGarments}
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                    refLoading={refLoading}
                    presets={presets}
                    history={history}
                    selectedRefs={selectedRefs}
                    toggleRef={toggleRef}
                    onUpload={handleReferenceUpload}
                    uploading={refUploading}
                />
            </div>
        </div>
    );
};

export default ProjectWorkflow;
