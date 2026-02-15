import React from 'react';
import { useLocation, Link } from 'react-router-dom';

const Header: React.FC = () => {
    const location = useLocation();

    // Mock breadcrumbs for now, in a real app these would be dynamic
    const breadcrumbs = [
        { label: '夏季新品系列 2024', path: '#' },
        { label: '任务配置', path: location.pathname }
    ];

    return (
        <header className="bg-white dark:bg-[#1a2c35] border-b border-[#e2e8f0] dark:border-[#2d3748] h-16 px-6 flex items-center justify-between shrink-0 sticky top-0 z-30">
            <div className="flex items-center gap-4">
                <nav className="flex items-center text-sm font-medium">
                    {breadcrumbs.map((crumb, index) => (
                        <React.Fragment key={crumb.path}>
                            {index > 0 && (
                                <span className="material-symbols-outlined text-slate-400 text-sm mx-2">chevron_right</span>
                            )}
                            <Link
                                to={crumb.path}
                                className={
                                    index === breadcrumbs.length - 1
                                        ? "text-slate-900 dark:text-white font-semibold"
                                        : "text-slate-500 hover:text-[#0da6f2] dark:text-slate-400 dark:hover:text-[#0da6f2] transition-colors"
                                }
                            >
                                {crumb.label}
                            </Link>
                        </React.Fragment>
                    ))}
                </nav>
            </div>

            <div className="flex items-center gap-4">
                <span className="text-xs text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-full">
                    自动保存于 10:42
                </span>

                <div className="w-9 h-9 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400 cursor-pointer transition-colors relative">
                    <span className="material-symbols-outlined text-xl">notifications</span>
                    <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border border-white dark:border-slate-800"></span>
                </div>

                <div className="w-9 h-9 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden cursor-pointer ring-2 ring-transparent hover:ring-[#0da6f2]/50 transition-all">
                    <img
                        alt="用户头像"
                        className="w-full h-full object-cover"
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuAEPOFKeiAYb3gXI0rExi0oSrG1_YkCLQHe82_lZ8zq9Hx8SagMqzHZYf6I4pUUaRvGpDe6BoMCgLnLWpfGuig-9EXoCD_Jo_B5k9O-x8uUM25b_zAzHi1YdQzN9omky1qOtDsd7ijsARx762_5glG3GyRloExJGHSclqdf7JEMiLuGtwL9-7QVAM-akjJojfAzg-0jxMj27eP_CV_eo-enyf8MU3Qo-AiXmuG2dejrolNtgW_fRmJvFdwCJtnCR8svvjS6-7OU5zms"
                    />
                </div>
            </div>
        </header>
    );
};

export default Header;
