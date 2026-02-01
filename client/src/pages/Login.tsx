import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { message } from 'antd';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import AuthLayout from '../layouts/AuthLayout';

const Login: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append('username', phone);
            formData.append('password', password);

            const response = await axios.post('/auth/login', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            const { access_token } = response.data;
            await login(access_token);
            message.success('登录成功');
            navigate('/dashboard'); // Go to dashboard instead of workspace for better landing
        } catch (error: any) {
            console.error(error);
            const msg = error.response?.data?.detail || '登录失败，请检查账号密码';
            message.error(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthLayout>
            {/* Header */}
            <div>
                <h2 className="text-slate-900 dark:text-white text-3xl font-bold tracking-tight mb-2">欢迎回来</h2>
                <p className="text-slate-500 dark:text-gray-400 text-sm">
                    使用手机号或账号密码登录
                </p>
            </div>

            {/* Form */}
            <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
                {/* Phone Input */}
                <div className="flex flex-col gap-2">
                    <label className="text-slate-900 dark:text-white text-sm font-medium" htmlFor="phone">手机号</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                            <span className="material-symbols-outlined text-slate-400 text-[20px]">smartphone</span>
                        </div>
                        <input
                            id="phone"
                            type="tel"
                            required
                            placeholder="请输入手机号"
                            className="block w-full pl-11 pr-4 py-3.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-slate-900 dark:text-white placeholder-slate-400 focus:border-primary focus:ring-primary focus:ring-1 transition-colors text-base appearance-none outline-none"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                        />
                    </div>
                </div>

                {/* Password Input */}
                <div className="flex flex-col gap-2">
                    <label className="text-slate-900 dark:text-white text-sm font-medium" htmlFor="password">密码</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                            <span className="material-symbols-outlined text-slate-400 text-[20px]">lock</span>
                        </div>
                        <input
                            id="password"
                            type="password"
                            required
                            placeholder="请输入密码"
                            className="block w-full pl-11 pr-4 py-3.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-slate-900 dark:text-white placeholder-slate-400 focus:border-primary focus:ring-primary focus:ring-1 transition-colors text-base appearance-none outline-none"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={loading}
                    className="mt-4 w-full bg-primary hover:bg-sky-600 active:bg-sky-700 text-white font-bold py-3.5 px-6 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed"
                >
                    {loading ? (
                        <span className="material-symbols-outlined animate-spin text-[20px]">progress_activity</span>
                    ) : (
                        <>
                            <span>立即登录</span>
                            <span className="material-symbols-outlined text-[20px] transition-transform group-hover:translate-x-1">arrow_forward</span>
                        </>
                    )}
                </button>

                {/* Register Link */}
                <div className="text-center mt-2">
                    <p className="text-sm text-slate-500 dark:text-gray-400">
                        还没有账号？
                        <Link to="/register" className="text-primary hover:underline font-medium ml-1">立即注册</Link>
                    </p>
                </div>
            </form>
        </AuthLayout>
    );
};

export default Login;
