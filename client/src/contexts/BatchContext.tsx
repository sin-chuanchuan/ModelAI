import React, { createContext, useContext, useState } from 'react';

export interface BatchFile {
    id: string;
    file: File;
    previewUrl: string;
    status: 'pending' | 'uploading' | 'processing' | 'completed' | 'failed';
    name: string;
}

interface BatchContextType {
    // Step 1: Batch Upload
    fileList: BatchFile[];
    addFiles: (files: File[]) => void;
    removeFile: (id: string) => void;
    clearFiles: () => void;

    // Step 2: Global Settings
    globalSettings: {
        modelId: string | null;
        sceneId: string | null;
        poseId: string | null;
    };
    updateGlobalSettings: (settings: Partial<{
        modelId: string | null;
        sceneId: string | null;
        poseId: string | null;
    }>) => void;

    // Step 3: Progress
    isGenerating: boolean;
    startGeneration: () => void;
    progress: number;

    reset: () => void;
}

const BatchContext = createContext<BatchContextType | undefined>(undefined);

export const BatchProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [fileList, setFileList] = useState<BatchFile[]>([]);
    const [globalSettings, setGlobalSettings] = useState<{
        modelId: string | null;
        sceneId: string | null;
        poseId: string | null;
    }>({
        modelId: null,
        sceneId: null,
        poseId: null,
    });
    const [isGenerating, setIsGenerating] = useState(false);
    const [progress, setProgress] = useState(0);

    const addFiles = (files: File[]) => {
        const newFiles = files.map(file => ({
            id: Math.random().toString(36).substr(2, 9),
            file,
            previewUrl: URL.createObjectURL(file), // Helper for local preview
            status: 'pending' as const,
            name: file.name
        }));
        setFileList(prev => [...prev, ...newFiles]);
    };

    const removeFile = (id: string) => {
        setFileList(prev => prev.filter(f => f.id !== id));
    };

    const clearFiles = () => {
        setFileList([]);
    };

    const updateGlobalSettings = (settings: Partial<typeof globalSettings>) => {
        setGlobalSettings(prev => ({ ...prev, ...settings }));
    };

    const startGeneration = () => {
        setIsGenerating(true);
        setProgress(0);
        // Mock progress simulation for demo
        const interval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    clearInterval(interval);
                    setIsGenerating(false);
                    return 100;
                }
                return prev + 5;
            });
        }, 800);
    };

    const reset = () => {
        setFileList([]);
        setGlobalSettings({ modelId: null, sceneId: null, poseId: null });
        setIsGenerating(false);
        setProgress(0);
    };

    return (
        <BatchContext.Provider value={{
            fileList,
            addFiles,
            removeFile,
            clearFiles,
            globalSettings,
            updateGlobalSettings,
            isGenerating,
            startGeneration,
            progress,
            reset
        }}>
            {children}
        </BatchContext.Provider>
    );
};

export const useBatch = () => {
    const context = useContext(BatchContext);
    if (context === undefined) {
        throw new Error('useBatch must be used within a BatchProvider');
    }
    return context;
};
