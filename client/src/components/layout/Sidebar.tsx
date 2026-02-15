import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { SIDEBAR_MENU_ITEMS, BRAND_CONFIG } from '../../config/navigation';

const Sidebar: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [isCollapsed, setIsCollapsed] = useState(false);

    const isActive = (path: string) => location.pathname === path;

    return (
        <aside
            className={`${isCollapsed ? 'w-20' : 'w-64'
                } bg-white dark:bg-[#1a2c35] border-r border-[#e2e8f0] dark:border-[#2d3748] flex flex-col shrink-0 z-50 h-screen sticky top-0 transition-all duration-300 ease-in-out`}
        >
            <div className={`h-16 flex items-center ${isCollapsed ? 'justify-center' : 'justify-start px-6'} border-b border-[#e2e8f0] dark:border-[#2d3748]`}>
                <div className="flex items-center text-[#0da6f2] font-bold text-xl tracking-tight">
                    <span className="material-symbols-outlined text-2xl" style={{ color: BRAND_CONFIG.primaryColor }}>auto_awesome</span>
                    {!isCollapsed && (
                        <div className="flex flex-col ml-2 leading-tight">
                            <span>{BRAND_CONFIG.name}</span>
                            <span className="text-[10px] font-medium text-slate-400">{BRAND_CONFIG.description}</span>
                        </div>
                    )}
                </div>
            </div>

            <nav className="flex-1 py-6 flex flex-col gap-2 px-3 overflow-y-auto overflow-x-hidden">
                {SIDEBAR_MENU_ITEMS.map((item) => {
                    const active = isActive(item.path);
                    return (
                        <button
                            key={item.path}
                            onClick={() => navigate(item.path)}
                            title={isCollapsed ? item.label : ''}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group ${active
                                ? 'bg-[#0da6f2]/10 text-[#0da6f2] font-medium'
                                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-[#0da6f2]'
                                }`}
                        >
                            <span className="material-symbols-outlined text-[24px]">
                                {item.icon}
                            </span>
                            {!isCollapsed && <span className="text-sm truncate">{item.label}</span>}
                        </button>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-[#e2e8f0] dark:border-[#2d3748] flex justify-center md:justify-end">
                <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                >
                    <span className={`material-symbols-outlined transform transition-transform duration-300 ${isCollapsed ? 'rotate-180' : ''}`}>
                        keyboard_double_arrow_left
                    </span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
