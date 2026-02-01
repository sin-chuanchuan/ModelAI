import React, { createContext, useContext, useState } from 'react';

interface GenerationContextType {
    // Step 1: Upload & Model
    uploadedImage: string | null;
    setUploadedImage: (url: string | null) => void;
    uploadedImageFile: File | null;
    setUploadedImageFile: (file: File | null) => void;

    selectedModelId: string | null;
    setSelectedModelId: (id: string | null) => void;
    selectedModelType: 'female' | 'male' | 'child';
    setSelectedModelType: (type: 'female' | 'male' | 'child') => void;

    // Step 2: Settings
    selectedSceneId: string | null;
    setSelectedSceneId: (id: string | null) => void;
    selectedPoseId: string | null;
    setSelectedPoseId: (id: string | null) => void;

    // Step 3: Result
    resultImage: string | null;
    setResultImage: (url: string | null) => void;

    // Actions
    reset: () => void;
}

const GenerationContext = createContext<GenerationContextType | undefined>(undefined);

export const GenerationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [uploadedImage, setUploadedImage] = useState<string | null>(null);
    const [uploadedImageFile, setUploadedImageFile] = useState<File | null>(null);
    const [selectedModelId, setSelectedModelId] = useState<string | null>(null);
    const [selectedModelType, setSelectedModelType] = useState<'female' | 'male' | 'child'>('female');

    const [selectedSceneId, setSelectedSceneId] = useState<string | null>(null);
    const [selectedPoseId, setSelectedPoseId] = useState<string | null>(null);

    const [resultImage, setResultImage] = useState<string | null>(null);

    const reset = () => {
        setUploadedImage(null);
        setUploadedImageFile(null);
        setSelectedModelId(null);
        // keep model type preference? maybe reset
        setSelectedSceneId(null);
        setSelectedPoseId(null);
        setResultImage(null);
    };

    return (
        <GenerationContext.Provider value={{
            uploadedImage, setUploadedImage,
            uploadedImageFile, setUploadedImageFile,
            selectedModelId, setSelectedModelId,
            selectedModelType, setSelectedModelType,
            selectedSceneId, setSelectedSceneId,
            selectedPoseId, setSelectedPoseId,
            resultImage, setResultImage,
            reset
        }}>
            {children}
        </GenerationContext.Provider>
    );
};

export const useGeneration = () => {
    const context = useContext(GenerationContext);
    if (context === undefined) {
        throw new Error('useGeneration must be used within a GenerationProvider');
    }
    return context;
};
