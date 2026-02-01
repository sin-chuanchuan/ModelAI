import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { message } from 'antd';
import axios from 'axios';
import AuthLayout from '../layouts/AuthLayout';

const Register: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [contactName, setContactName] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await axios.post('/auth/register', {
                phone,
                password,
                contact_name: contactName
            });

            message.success('注册成功，请登录');
            navigate('/login');
        } catch (error: any) {
            console.error(error);
            const msg = error.response?.data?.detail || '注册失败，请稍后重试';
            message.error(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthLayout>
            {/* Header */}
            <div>
                <h2 className="text-slate-900 dark:text-white text-3xl font-bold tracking-tight mb-2">验证码注册</h2>
                <p className="text-slate-500 dark:text-gray-400 text-sm">
                    创建您的账号，开启AI创作之旅
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
                    <label className="text-slate-900 dark:text-white text-sm font-medium" htmlFor="password">设置密码</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                            <span className="material-symbols-outlined text-slate-400 text-[20px]">lock</span>
                        </div>
                        <input
                            id="password"
                            type="password"
                            required
                            minLength={6}
                            placeholder="至少6位密码"
                            className="block w-full pl-11 pr-4 py-3.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-slate-900 dark:text-white placeholder-slate-400 focus:border-primary focus:ring-primary focus:ring-1 transition-colors text-base appearance-none outline-none"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                </div>

                {/* Contact Name Input */}
                <div className="flex flex-col gap-2">
                    <label className="text-slate-900 dark:text-white text-sm font-medium" htmlFor="contactName">联系人 (选填)</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                            <span className="material-symbols-outlined text-slate-400 text-[20px]">person</span>
                        </div>
                        <input
                            id="contactName"
                            type="text"
                            placeholder="您的称呼"
                            className="block w-full pl-11 pr-4 py-3.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-slate-900 dark:text-white placeholder-slate-400 focus:border-primary focus:ring-primary focus:ring-1 transition-colors text-base appearance-none outline-none"
                            value={contactName}
                            onChange={(e) => setContactName(e.target.value)}
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
                            <span>立即注册</span>
                            <span className="material-symbols-outlined text-[20px] transition-transform group-hover:translate-x-1">arrow_forward</span>
                        </>
                    )}
                </button>

                {/* Terms */}
                <div className="flex items-start gap-3 mt-2">
                    <div className="flex items-center h-5">
                        <input
                            id="terms"
                            type="checkbox"
                            className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary dark:border-gray-600 dark:bg-gray-700"
                            required
                        />
                    </div>
                    <label htmlFor="terms" className="text-xs text-slate-500 dark:text-gray-400 leading-5">
                        我已阅读并同意
                        <a href="#" className="text-primary hover:underline font-medium mx-1">《用户协议》</a>
                        和
                        <a href="#" className="text-primary hover:underline font-medium mx-1">《隐私政策》</a>
                        。未注册手机号验证后将自动创建账号。
                    </label>
                </div>

                {/* Login Link */}
                <div className="relative mt-4">
                    <div aria-hidden="true" className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-200 dark:border-gray-700"></div>
                    </div>
                    <div className="relative flex justify-center">
                        <span className="bg-white dark:bg-background-dark px-3 text-xs text-gray-400">已有账号？</span>
                    </div>
                </div>

                <div className="text-center">
                    <Link to="/login" className="text-primary hover:underline font-bold text-sm">可以直接登录</Link>
                </div>
            </form>
        </AuthLayout>
    );
};

export default Register;
