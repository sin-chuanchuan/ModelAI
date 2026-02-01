import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const Sidebar: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const menuItems = [
        { icon: 'work', label: '工作台', path: '/dashboard', filled: true },
        { icon: 'folder_open', label: '素材库', path: '/materials' },
        { icon: 'group', label: '团队管理', path: '/team' },
        { icon: 'credit_card', label: '费用中心', path: '/billing' },
    ];

    const isActive = (path: string) => location.pathname === path;

    return (
        <aside className="w-64 bg-white dark:bg-surface-dark border-r border-[#dbe2e6] dark:border-gray-800 flex flex-col flex-shrink-0 h-full transition-colors duration-200 z-20">
            <div className="flex flex-col gap-1 px-4 py-6 flex-1 overflow-y-auto">
                {menuItems.map((item) => {
                    const active = isActive(item.path);
                    return (
                        <button
                            key={item.path}
                            onClick={() => navigate(item.path)}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group ${active
                                    ? 'bg-primary/10 text-primary'
                                    : 'text-[#607c8a] dark:text-gray-400 hover:bg-[#f0f3f5] dark:hover:bg-white/5 hover:text-[#111618] dark:hover:text-white hover:translate-x-1'
                                }`}
                        >
                            <span
                                className="material-symbols-outlined transition-transform group-hover:scale-110"
                                style={item.filled && active ? { fontVariationSettings: "'FILL' 1" } : {}}
                            >
                                {item.icon}
                            </span>
                            <p className="text-sm font-medium leading-normal">{item.label}</p>
                        </button>
                    );
                })}
            </div>
            <div className="p-4 border-t border-[#dbe2e6] dark:border-gray-800">
                <button className="flex w-full cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-lg h-10 px-4 bg-primary hover:bg-primary/90 text-white text-sm font-bold leading-normal tracking-[0.015em] transition-all hover:shadow-lg hover:shadow-primary/20 active:scale-95">
                    <span className="material-symbols-outlined text-[20px]">add</span>
                    <span className="truncate">上传图片</span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
