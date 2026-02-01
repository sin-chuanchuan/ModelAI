import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import { Spin } from 'antd';
import MainLayout from './components/layout/MainLayout';

// Lazy load pages
const Login = React.lazy(() => import('./pages/Login'));
const Register = React.lazy(() => import('./pages/Register'));
const Workspace = React.lazy(() => import('./pages/Workspace'));
const Dashboard = React.lazy(() => import('./pages/Dashboard'));

// Generation Wizard Components
const SingleGeneratorLayout = React.lazy(() => import('./pages/generate/SingleGeneratorLayout'));
const Step1Upload = React.lazy(() => import('./pages/generate/Step1Upload'));
const Step2Settings = React.lazy(() => import('./pages/generate/Step2Settings'));
const Step3Result = React.lazy(() => import('./pages/generate/Step3Result'));

// Batch Wizard Components
const BatchLayout = React.lazy(() => import('./pages/generate/batch/BatchLayout'));
const BatchUpload = React.lazy(() => import('./pages/generate/batch/BatchUpload'));
const BatchSettings = React.lazy(() => import('./pages/generate/batch/BatchSettings'));
const BatchProgress = React.lazy(() => import('./pages/generate/batch/BatchProgress'));

const Materials = React.lazy(() => import('./pages/Materials'));
const Team = React.lazy(() => import('./pages/Team'));
const Billing = React.lazy(() => import('./pages/Billing'));
const BillingHistory = React.lazy(() => import('./pages/BillingHistory'));


const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
        return <div className="flex justify-center items-center h-screen"><Spin size="large" /></div>;
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return <>{children}</>;
};

import { GenerationProvider } from './contexts/GenerationContext';

import { BatchProvider } from './contexts/BatchContext';

const AppRouter: React.FC = () => {
    return (
        <BrowserRouter>
            <GenerationProvider>
                <BatchProvider>
                    <React.Suspense fallback={<div className="p-12 text-center"><Spin /></div>}>
                        <Routes>
                            <Route path="/login" element={<Login />} />
                            <Route path="/register" element={<Register />} />

                            {/* Main Layout Routes */}
                            <Route path="/" element={
                                <ProtectedRoute>
                                    <MainLayout />
                                </ProtectedRoute>
                            }>
                                <Route index element={<Navigate to="/dashboard" replace />} />
                                <Route path="dashboard" element={<Dashboard />} />
                                <Route path="workspace" element={<Workspace />} />

                                {/* Generation Wizard Routes */}
                                <Route path="generate" element={<div className="h-full"><Outlet /></div>}>
                                    <Route path="single" element={<SingleGeneratorLayout />}>
                                        <Route index element={<Navigate to="step1" replace />} />
                                        <Route path="step1" element={<Step1Upload />} />
                                        <Route path="step2" element={<Step2Settings />} />
                                        <Route path="step3" element={<Step3Result />} />
                                        <Route path="step3" element={<Step3Result />} />
                                    </Route>

                                    {/* Batch Generation Routes */}
                                    <Route path="batch" element={<BatchLayout />}>
                                        <Route index element={<Navigate to="upload" replace />} />
                                        <Route path="upload" element={<BatchUpload />} />
                                        <Route path="settings" element={<BatchSettings />} />
                                        <Route path="progress" element={<BatchProgress />} />
                                    </Route>
                                </Route>

                                {/* Placeholders for other sidebar links */}
                                <Route path="materials" element={<Materials />} />
                                <Route path="team" element={<Team />} />
                                <Route path="billing" element={<Billing />} />
                                <Route path="billing/history" element={<BillingHistory />} />
                            </Route>

                            {/* Catch all */}
                            <Route path="*" element={<Navigate to="/" replace />} />
                        </Routes>
                    </React.Suspense>
                </BatchProvider>
            </GenerationProvider>
        </BrowserRouter>
    );
};

export default AppRouter;
