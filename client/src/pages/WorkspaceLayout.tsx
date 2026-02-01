import React from 'react';
import { Layout, Menu, Button, Dropdown, Avatar, Typography } from 'antd';
import { UserOutlined, FileImageOutlined, LogoutOutlined } from '@ant-design/icons';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Outlet, Link, useLocation } from 'react-router-dom';

const { Header, Sider, Content } = Layout;
const { Text } = Typography;

const WorkspaceLayout: React.FC = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const menuItems = [
        {
            key: '/workspace',
            icon: <FileImageOutlined />,
            label: <Link to="/workspace">生成图片</Link>,
        },
        // Future items: History, Billings, etc.
    ];

    const userMenu = {
        items: [
            {
                key: 'profile',
                label: (
                    <div style={{ padding: '4px 0' }}>
                        <div>{user?.phone}</div>
                        <Text type="secondary" style={{ fontSize: 12 }}>余额: {user?.balance || 0} 点</Text>
                    </div>
                ),
            },
            {
                type: 'divider',
            },
            {
                key: 'logout',
                icon: <LogoutOutlined />,
                label: '退出登录',
                onClick: handleLogout,
            },
        ],
    };

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Sider theme="light" width={240} style={{ borderRight: '1px solid #f0f0f0' }}>
                <div style={{
                    height: 64,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderBottom: '1px solid #f0f0f0'
                }}>
                    <Typography.Title level={4} style={{ margin: 0, color: '#1890ff' }}>Model AI</Typography.Title>
                </div>
                <Menu
                    mode="inline"
                    selectedKeys={[location.pathname]}
                    items={menuItems}
                    style={{ borderRight: 0 }}
                />
            </Sider>
            <Layout>
                <Header style={{ background: '#fff', padding: '0 24px', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', borderBottom: '1px solid #f0f0f0' }}>
                    <Dropdown menu={userMenu as any}>
                        <Button type="text" style={{ height: 'auto', padding: '4px 8px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <Avatar icon={<UserOutlined />} style={{ backgroundColor: '#1890ff' }} />
                                <span>{user?.contact_name || user?.phone || '用户'}</span>
                            </div>
                        </Button>
                    </Dropdown>
                </Header>
                <Content style={{ margin: '24px 24px', padding: 24, background: '#fff', minHeight: 280 }}>
                    <Outlet />
                </Content>
            </Layout>
        </Layout>
    );
};

export default WorkspaceLayout;
