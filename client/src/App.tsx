import React, { useState, useEffect, useRef } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Layout, Upload, Button, Card, Row, Col, Tabs, message, Input, Form, Select, Switch } from 'antd';
import type { UploadProps } from 'antd';
import { UploadOutlined, EnterOutlined } from '@ant-design/icons';
import axios from 'axios';
import './App.css';

const { Header, Sider } = Layout;
const { TabPane } = Tabs;

// Mock data for materials
const mockMaterials = {
  environments: [
    { id: 1, name: 'Studio', url: 'https://via.placeholder.com/200x150/cccccc/666666?text=Studio' },
    { id: 2, name: 'Outdoor', url: 'https://via.placeholder.com/200x150/99ccff/333333?text=Outdoor' },
    { id: 3, name: 'Office', url: 'https://via.placeholder.com/200x150/ccffcc/333333?text=Office' },
  ],
  models: [
    { id: 1, name: 'Model 1', url: 'https://via.placeholder.com/100x200/ffcccc/333333?text=Model+1' },
    { id: 2, name: 'Model 2', url: 'https://via.placeholder.com/100x200/ccccff/333333?text=Model+2' },
    { id: 3, name: 'Model 3', url: 'https://via.placeholder.com/100x200/ccffcc/333333?text=Model+3' },
  ],
  clothing: [
    { id: 1, name: 'Dress', url: 'https://via.placeholder.com/150x150/ff9999/333333?text=Dress' },
    { id: 2, name: 'Shirt', url: 'https://via.placeholder.com/150x150/9999ff/333333?text=Shirt' },
    { id: 3, name: 'Pants', url: 'https://via.placeholder.com/150x100/99ff99/333333?text=Pants' },
  ],
  accessories: [
    { id: 1, name: 'Hat', url: 'https://via.placeholder.com/80x80/ffcc99/333333?text=Hat' },
    { id: 2, name: 'Glasses', url: 'https://via.placeholder.com/80x40/cc99ff/333333?text=Glasses' },
    { id: 3, name: 'Bag', url: 'https://via.placeholder.com/100x80/99ccff/333333?text=Bag' },
  ],
};

// Material card component for drag and drop
const MaterialCard: React.FC<{ material: any; type: string }> = ({ material, type }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'MATERIAL',
    item: { ...material, category: type },
    collect: (monitor: any) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  drag(ref);

  return (
    <div
      ref={ref}
      style={{ opacity: isDragging ? 0.5 : 1, cursor: 'move' }}
      className="material-card"
    >
      <Card hoverable cover={<img alt={material.name} src={material.url} />}>
        <Card.Meta title={material.name} />
      </Card>
    </div>
  );
};

// Canvas component for dropping materials
const EditorCanvas: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [droppedMaterials, setDroppedMaterials] = useState<any[]>([]);

  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'MATERIAL',
    drop: (item: any) => {
      setDroppedMaterials((prev) => [...prev, { ...item, id: Date.now() }]);
      message.success(`Added ${item.name} to canvas`);
    },
    collect: (monitor: any) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  drop(ref);

  return (
    <div
      ref={ref}
      className={`editor-canvas ${isOver ? 'canvas-over' : ''}`}
      style={{ width: '100%', height: '500px', border: '2px dashed #d9d9d9', position: 'relative', overflow: 'auto' }}
    >
      <div style={{ textAlign: 'center', padding: '20px', color: '#999' }}>
        Drag and drop materials here to create your composition
      </div>
      {droppedMaterials.map((material) => (
        <div
          key={material.id}
          style={{
            position: 'absolute',
            top: '100px',
            left: `${100 + material.id % 200}px`,
            width: '150px',
            cursor: 'move',
          }}
        >
          <img alt={material.name} src={material.url} style={{ width: '100%' }} />
          <div style={{ background: 'rgba(0,0,0,0.5)', color: 'white', padding: '5px', textAlign: 'center' }}>
            {material.name}
          </div>
        </div>
      ))}
    </div>
  );
};

// Doubao API Test Component
const DoubaoApiTest: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const handleSubmit = async (values: any) => {
    setLoading(true);
    setResult(null);
    setError(null);
    
    try {
      // Prepare image URLs if provided
      const imageUrls: { [key: string]: string } = {};
      if (values.image1) {
        imageUrls['image1'] = values.image1;
      }
      if (values.image2) {
        imageUrls['image2'] = values.image2;
      }
      
      // Call the direct Doubao API endpoint
      const response = await axios.post('http://localhost:8000/generate/image/doubao', {
        prompt: values.prompt,
        image_urls: Object.keys(imageUrls).length > 0 ? imageUrls : undefined,
        size: values.size,
        watermark: values.watermark
      });
      
      setResult(response.data.image_url);
      message.success('Image generated successfully!');
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to generate image. Please try again.');
      message.error('Failed to generate image');
      console.error('Error generating image:', err);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="doubao-test-container" style={{ padding: '20px', background: '#fff', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
      <h2 className="section-title" style={{ marginBottom: '24px' }}>豆包API测试</h2>
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{
          prompt: '将图1的服装换为图2的服装',
          image1: 'https://ark-project.tos-cn-beijing.volces.com/doc_image/seedream4_imagesToimage_1.png',
          image2: 'https://ark-project.tos-cn-beijing.volces.com/doc_image/seedream4_imagesToimage_2.png',
          size: '2K',
          watermark: true
        }}
      >
        <Form.Item
          label="提示词"
          name="prompt"
          rules={[{ required: true, message: '请输入提示词' }]}
        >
          <Input.TextArea rows={4} placeholder="请输入图片生成提示词" />
        </Form.Item>
        
        <Form.Item
          label="参考图片1 URL"
          name="image1"
        >
          <Input placeholder="请输入第一张参考图片的URL" />
        </Form.Item>
        
        <Form.Item
          label="参考图片2 URL"
          name="image2"
        >
          <Input placeholder="请输入第二张参考图片的URL" />
        </Form.Item>
        
        <Form.Item
          label="图片尺寸"
          name="size"
        >
          <Select>
            <Select.Option value="2K">2K</Select.Option>
            <Select.Option value="1024x1024">1024x1024</Select.Option>
            <Select.Option value="1024x1792">1024x1792</Select.Option>
            <Select.Option value="1792x1024">1792x1024</Select.Option>
          </Select>
        </Form.Item>
        
        <Form.Item
          label="添加水印"
          name="watermark"
          valuePropName="checked"
        >
          <Switch />
        </Form.Item>
        
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} size="large" style={{ marginRight: '10px' }}>
            生成图片
          </Button>
          <Button htmlType="reset">重置</Button>
        </Form.Item>
      </Form>
      
      {error && (
        <div style={{ marginBottom: '20px', padding: '12px', background: '#fff1f0', border: '1px solid #ffccc7', borderRadius: '4px', color: '#f5222d' }}>
          <strong>错误:</strong> {error}
        </div>
      )}
      
      {result && (
        <div className="result-section" style={{ marginTop: '24px' }}>
          <h3 style={{ marginBottom: '16px' }}>生成结果</h3>
          <div className="result-image" style={{ textAlign: 'center' }}>
            <img src={result} alt="Generated" style={{ maxWidth: '100%', maxHeight: '500px', borderRadius: '8px' }} />
          </div>
          <div style={{ marginTop: '12px', textAlign: 'center' }}>
            <a href={result} target="_blank" rel="noopener noreferrer">
              <Button type="link">查看原图</Button>
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

function App() {
  const [activeTab, setActiveTab] = useState('editor');
  const [materialsTab, setMaterialsTab] = useState('environments');
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [taskId, setTaskId] = useState<string | null>(null);
  const [taskStatus, setTaskStatus] = useState<string>('');
  const [taskProgress, setTaskProgress] = useState<number>(0);
  
  // Poll task status every 2 seconds
  useEffect(() => {
    let intervalId: number;
    
    const pollTaskStatus = async () => {
      if (!taskId) return;
      
      try {
        const response = await axios.get(`http://localhost:8000/generate/task/${taskId}`);
        const { status, progress, result, error } = response.data;
        
        setTaskStatus(status);
        setTaskProgress(progress);
        
        if (status === 'COMPLETED' && result) {
          setGeneratedImage(result.image_url);
          message.success('Image generated successfully!');
          setTaskId(null); // Clear task ID when completed
        } else if (status === 'FAILED') {
          message.error(`Failed to generate image: ${error}`);
          setTaskId(null); // Clear task ID when failed
        }
      } catch (error) {
        console.error('Error polling task status:', error);
        message.error('Failed to check task status. Please try again.');
      }
    };
    
    if (taskId) {
      intervalId = setInterval(pollTaskStatus, 2000);
    }
    
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [taskId]);
  
  const handleGenerate = async () => {
    setLoading(true);
    setGeneratedImage(null);
    setTaskId(null);
    
    try {
      // Call the backend API to generate the image
      const response = await axios.post('http://localhost:8000/generate/image', {
        prompt: 'A professional e-commerce photo of a model wearing clothing, against a studio background',
        service: 'openai',
        size: '1024x1024',
        quality: 'standard'
      });
      
      const { task_id, status, message } = response.data;
      setTaskId(task_id);
      setTaskStatus(status);
      message.success(message);
    } catch (error) {
      console.error('Error generating image:', error);
      message.error('Failed to generate image. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const uploadProps: UploadProps = {
    beforeUpload: (file) => {
      // Handle file upload logic here
      console.log('Uploading file:', file);
      return false; // Prevent auto upload
    },
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <Layout className="app-layout">
        <Header className="app-header">
          <h1 className="app-title">电商模特图片生成工具</h1>
        </Header>
        <Layout>
          {/* Main Tabs */}
          <Layout.Content className="app-content">
            <Tabs activeKey={activeTab} onChange={setActiveTab} style={{ marginBottom: '24px' }}>
              {/* Editor Tab */}
              <TabPane tab="图片编辑" key="editor">
                <Layout>
                  <Sider width={300} className="app-sider" style={{ background: '#fff' }}>
                    <div className="upload-section">
                      <Upload.Dragger {...uploadProps}>
                        <p className="ant-upload-drag-icon">
                          <UploadOutlined />
                        </p>
                        <p className="ant-upload-text">点击或拖拽上传素材</p>
                        <p className="ant-upload-hint">
                          支持 JPG、PNG 等格式，单文件不超过 10MB
                        </p>
                      </Upload.Dragger>
                    </div>
                    <div className="materials-section">
                      <Tabs activeKey={materialsTab} onChange={setMaterialsTab}>
                        <TabPane tab="环境" key="environments">
                          <Row gutter={[16, 16]}>
                            {mockMaterials.environments.map((material) => (
                              <Col span={12} key={material.id}>
                                <MaterialCard material={material} type="environments" />
                              </Col>
                            ))}
                          </Row>
                        </TabPane>
                        <TabPane tab="模特" key="models">
                          <Row gutter={[16, 16]}>
                            {mockMaterials.models.map((material) => (
                              <Col span={12} key={material.id}>
                                <MaterialCard material={material} type="models" />
                              </Col>
                            ))}
                          </Row>
                        </TabPane>
                        <TabPane tab="服装" key="clothing">
                          <Row gutter={[16, 16]}>
                            {mockMaterials.clothing.map((material) => (
                              <Col span={12} key={material.id}>
                                <MaterialCard material={material} type="clothing" />
                              </Col>
                            ))}
                          </Row>
                        </TabPane>
                        <TabPane tab="配饰" key="accessories">
                          <Row gutter={[16, 16]}>
                            {mockMaterials.accessories.map((material) => (
                              <Col span={12} key={material.id}>
                                <MaterialCard material={material} type="accessories" />
                              </Col>
                            ))}
                          </Row>
                        </TabPane>
                      </Tabs>
                    </div>
                  </Sider>
                  <Layout.Content style={{ padding: '20px' }}>
                    <div className="editor-section">
                      <h2 className="section-title">图片编辑</h2>
                      <EditorCanvas />
                    </div>
                    <div className="generate-section">
                      <Button 
                type="primary" 
                size="large" 
                icon={<EnterOutlined />} 
                onClick={handleGenerate}
                loading={loading}
                disabled={!!taskId}
              >
                生成图片
              </Button>
                    </div>
                    
                    {/* Task Status Section */}
                    {taskId && (
                      <div className="task-status-section" style={{ marginBottom: '24px', padding: '20px', background: '#fff', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                        <h2 className="section-title">生成状态</h2>
                        <div style={{ marginBottom: '10px' }}>
                          <strong>任务ID:</strong> {taskId}
                        </div>
                        <div style={{ marginBottom: '10px' }}>
                          <strong>状态:</strong> {taskStatus}
                        </div>
                        <div style={{ marginBottom: '10px' }}>
                          <strong>进度:</strong> {taskProgress}%
                        </div>
                        <div style={{ width: '100%', background: '#f0f0f0', borderRadius: '4px', height: '10px' }}>
                          <div 
                            style={{
                              width: `${taskProgress}%`, 
                              background: '#1890ff', 
                              borderRadius: '4px', 
                              height: '100%',
                              transition: 'width 0.3s ease'
                            }}
                          />
                        </div>
                      </div>
                    )}
                    
                    {/* Generated Image Section */}
                    {generatedImage && (
                      <div className="result-section">
                        <h2 className="section-title">生成结果</h2>
                        <div className="result-area">
                          <img alt="Generated" src={generatedImage} style={{ maxWidth: '100%', borderRadius: '8px' }} />
                        </div>
                      </div>
                    )}
                  </Layout.Content>
                </Layout>
              </TabPane>
              
              {/* Doubao API Test Tab */}
              <TabPane tab="豆包API测试" key="doubao-test">
                <DoubaoApiTest />
              </TabPane>
            </Tabs>
          </Layout.Content>
        </Layout>
      </Layout>
    </DndProvider>
  );
}

export default App