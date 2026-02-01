import React, { useState, useEffect } from 'react';
import { Row, Col, Tabs, Upload, message, Button, Card, Spin } from 'antd';
import { UploadOutlined, EnterOutlined } from '@ant-design/icons';
import type { UploadProps } from 'antd';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import axios from 'axios';

// Interfaces
interface Material {
    id: string; // MongoDB _id
    name: string;
    url: string;
    type: string;
}

const Workspace: React.FC = () => {
    const [activeTab, setActiveTab] = useState('models');
    const [materials, setMaterials] = useState<Material[]>([]);
    const [loadingMaterials, setLoadingMaterials] = useState(false);

    const [selectedModel, setSelectedModel] = useState<Material | null>(null);
    const [selectedScene, setSelectedScene] = useState<Material | null>(null);
    const [uploadedGarment, setUploadedGarment] = useState<string | null>(null);

    const [generating, setGenerating] = useState(false);
    const [taskId, setTaskId] = useState<string | null>(null);
    const [taskStatus, setTaskStatus] = useState<string>('');
    const [resultImage, setResultImage] = useState<string | null>(null);

    // Fetch materials
    useEffect(() => {
        const fetchMaterials = async () => {
            setLoadingMaterials(true);
            try {
                // Fetch presets or my uploaded materials
                // For MVP simplified: fetch 'presets' for models/scenes, 'mine' for garments?
                // Let's fetch presets for now
                // let typeFilter = activeTab; // 'models', 'scenes'
                // if (activeTab === 'garments') typeFilter = 'garment'; // fix mapping if needed

                // Mapping tab to type
                const typeMap: Record<string, string> = {
                    'models': 'model',
                    'environments': 'scene', // UI tab might be environments
                    'clothing': 'garment'
                };

                const type = typeMap[activeTab] || 'model';

                const response = await axios.get(`/materials/presets?category=${type}`);
                setMaterials(response.data);
            } catch (error) {
                console.error('Failed to fetch materials:', error);
                // message.error('Failed to load materials');
            } finally {
                setLoadingMaterials(false);
            }
        };

        fetchMaterials();
    }, [activeTab]);

    // Upload Garment
    const handleUploadGarment: UploadProps['customRequest'] = async (options) => {
        const { file, onSuccess, onError } = options;

        const formData = new FormData();
        formData.append('file', file);
        formData.append('type', 'garment');

        try {
            const response = await axios.post('/materials/upload', formData);
            setUploadedGarment(response.data.url);
            message.success('上传成功');
            onSuccess?.(response.data);
        } catch (err) {
            onError?.(err as any);
            message.error('上传失败');
        }
    };

    // Generate
    const handleGenerate = async () => {
        if (!selectedModel || !selectedScene || !uploadedGarment) {
            message.warning('请确保选择了模特、场景并上传了服装');
            return;
        }

        setGenerating(true);
        setResultImage(null);
        try {
            const response = await axios.post('/generate/', {
                garment_url: uploadedGarment,
                model_id: selectedModel.id, // Using DB ID
                scene_id: selectedScene.id, // Using DB ID
                prompt: `Generating ${selectedModel.name} in ${selectedScene.name}` // Simplified
            });

            setTaskId(response.data._id || response.data.id);
            setTaskStatus(response.data.status);
            message.success('任务已提交');
        } catch (error) {
            console.error(error);
            message.error('提交生成任务失败');
            setGenerating(false);
        }
    };

    // Poll Task Status
    useEffect(() => {
        if (!taskId) return;

        const poll = async () => {
            try {
                const response = await axios.get(`/generate/${taskId}`);
                const { status, result_url, error_message } = response.data;
                setTaskStatus(status);

                if (status === 'COMPLETED') {
                    setResultImage(result_url);
                    setGenerating(false);
                    setTaskId(null);
                    message.success('生成完成！');
                } else if (status === 'FAILED') {
                    setGenerating(false);
                    setTaskId(null);
                    message.error(`生成失败: ${error_message}`);
                }
            } catch (e) {
                console.error(e);
            }
        };

        const timer = setInterval(poll, 2000);
        return () => clearInterval(timer);
    }, [taskId]);

    return (
        <DndProvider backend={HTML5Backend}>
            <Row gutter={24}>
                {/* Left Panel: Materials */}
                <Col span={8}>
                    <Card title="素材库" bordered={false} style={{ height: 'calc(100vh - 120px)', overflowY: 'auto' }}>
                        <Tabs activeKey={activeTab} onChange={setActiveTab}>
                            <Tabs.TabPane tab="模特" key="models" />
                            <Tabs.TabPane tab="场景" key="environments" />
                        </Tabs>

                        {loadingMaterials ? (
                            <div style={{ textAlign: 'center', padding: 20 }}><Spin /></div>
                        ) : (
                            <Row gutter={[16, 16]}>
                                {materials.map(m => (
                                    <Col span={12} key={m.id}>
                                        <Card
                                            hoverable
                                            cover={<img alt={m.name} src={m.url} style={{ height: 120, objectFit: 'cover' }} />}
                                            onClick={() => {
                                                if (activeTab === 'models') setSelectedModel(m);
                                                if (activeTab === 'environments') setSelectedScene(m);
                                            }}
                                            style={{
                                                borderColor: (selectedModel?.id === m.id || selectedScene?.id === m.id) ? '#1890ff' : '#f0f0f0',
                                                borderWidth: (selectedModel?.id === m.id || selectedScene?.id === m.id) ? 2 : 1
                                            }}
                                        >
                                            <Card.Meta title={m.name} />
                                        </Card>
                                    </Col>
                                ))}
                            </Row>
                        )}
                    </Card>
                </Col>

                {/* Right Panel: Workspace */}
                <Col span={16}>
                    <Card title="工作台" bordered={false} style={{ height: 'calc(100vh - 120px)', overflowY: 'auto' }}>
                        <div style={{ marginBottom: 24, padding: 24, border: '2px dashed #d9d9d9', borderRadius: 8, textAlign: 'center' }}>
                            <h3>1. 上传服装图</h3>
                            <Upload customRequest={handleUploadGarment} showUploadList={false}>
                                {uploadedGarment ? (
                                    <img src={uploadedGarment} alt="Garment" style={{ maxHeight: 200, maxWidth: '100%' }} />
                                ) : (
                                    <Button icon={<UploadOutlined />}>点击上传服装图片</Button>
                                )}
                            </Upload>
                        </div>

                        <div style={{ marginBottom: 24 }}>
                            <h3>2. 当前配置</h3>
                            <p><strong>模特:</strong> {selectedModel?.name || '未选择'}</p>
                            <p><strong>场景:</strong> {selectedScene?.name || '未选择'}</p>
                        </div>

                        <Button
                            type="primary"
                            size="large"
                            icon={<EnterOutlined />}
                            onClick={handleGenerate}
                            loading={generating}
                            disabled={!selectedModel || !selectedScene || !uploadedGarment}
                            block
                        >
                            {generating ? `生成中 (${taskStatus})` : '开始生成'}
                        </Button>

                        {resultImage && (
                            <div style={{ marginTop: 24, textAlign: 'center' }}>
                                <h3>生成结果</h3>
                                <img src={resultImage} alt="Result" style={{ maxWidth: '100%', borderRadius: 8, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                            </div>
                        )}
                    </Card>
                </Col>
            </Row>
        </DndProvider>
    );
};

export default Workspace;
