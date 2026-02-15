import { useState, useCallback } from 'react';
import { message } from 'antd';
import apiClient from '../api/client';

export interface Project {
    id: string;
    name: string;
    selected_path: 'history' | 'platform';
    garment_urls: string[];
    reference_photo_ids: string[];
    generated_task_ids: string[];
    status: 'DRAFT' | 'PROCESSING' | 'COMPLETED' | 'ARCHIVED';
    created_at: string;
    updated_at: string;
}

export interface ReferencePhoto {
    id: string;
    url: string;
    type: 'user_history' | 'platform_preset';
    tags: string[];
}

export const useProjects = () => {
    const [loading, setLoading] = useState(false);
    const [project, setProject] = useState<Project | null>(null);
    const [tasks, setTasks] = useState<any[]>([]);

    const createProject = useCallback(async (name: string, path: string) => {
        setLoading(true);
        try {
            const res = await apiClient.post('/projects/', { name, selected_path: path });
            return res.data;
        } catch (error) {
            throw error;
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchProject = useCallback(async (id: string) => {
        setLoading(true);
        try {
            const res = await apiClient.get(`/projects/${id}`);
            setProject(res.data);
            return res.data;
        } catch (error) {
            // Error handled by intercepter but can add local if needed
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchTasks = useCallback(async (id: string) => {
        try {
            const res = await apiClient.get(`/projects/${id}/tasks`);
            setTasks(res.data);
            return res.data;
        } catch (error) {
            console.error(error);
        }
    }, []);

    const addGarments = useCallback(async (id: string, urls: string[]) => {
        try {
            const res = await apiClient.post(`/projects/${id}/garments`, { garment_urls: urls });
            setProject(res.data);
            return res.data;
        } catch (error) {
            throw error;
        }
    }, []);

    const setReferences = useCallback(async (id: string, refIds: string[]) => {
        try {
            const res = await apiClient.post(`/projects/${id}/references`, { reference_ids: refIds });
            setProject(res.data);
            return res.data;
        } catch (error) {
            throw error;
        }
    }, []);

    const generateProject = useCallback(async (id: string) => {
        try {
            await apiClient.post(`/projects/${id}/generate`);
            message.success('生成任务已提交');
            fetchProject(id);
        } catch (error) {
            // Fail handled globally
        }
    }, [fetchProject]);

    return {
        loading,
        project,
        tasks,
        createProject,
        fetchProject,
        fetchTasks,
        addGarments,
        setReferences,
        generateProject
    };
};

export const useReferences = () => {
    const [loading, setLoading] = useState(false);
    const [presets, setPresets] = useState<ReferencePhoto[]>([]);
    const [history, setHistory] = useState<ReferencePhoto[]>([]);

    const fetchPresets = useCallback(async (tags?: string[]) => {
        setLoading(true);
        try {
            const query = tags ? `?tags=${tags.join(',')}` : '';
            const res = await apiClient.get(`/references/presets${query}`);
            setPresets(res.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchHistory = useCallback(async () => {
        setLoading(true);
        try {
            const res = await apiClient.get('/references/mine');
            setHistory(res.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        loading,
        presets,
        history,
        fetchPresets,
        fetchHistory
    };
};
