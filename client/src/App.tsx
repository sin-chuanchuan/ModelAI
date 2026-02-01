import React from 'react';
import { ConfigProvider } from 'antd';
import { AuthProvider } from './contexts/AuthContext';
import AppRouter from './router';
import './App.css';

const App: React.FC = () => {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#1890ff',
        },
      }}
    >
      <AuthProvider>
        <AppRouter />
      </AuthProvider>
    </ConfigProvider>
  );
};

export default App;