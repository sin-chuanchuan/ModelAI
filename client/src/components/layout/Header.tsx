import React, { useState } from 'react';

const Header: React.FC = () => {
    const [isProfileOpen, setIsProfileOpen] = useState(false);

    return (
        <header className="h-16 bg-white dark:bg-surface-dark border-b border-[#dbe2e6] dark:border-gray-800 flex items-center justify-between px-6 shrink-0 z-30 sticky top-0 backdrop-blur-sm bg-white/90 dark:bg-surface-dark/90 supports-[backdrop-filter]:bg-white/60">
            <div className="flex gap-3 items-center">
                <div
                    className="bg-center bg-no-repeat bg-cover rounded-full size-9 bg-primary/20 flex items-center justify-center text-primary"
                    style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCm_mLEdO7r6jqtESkxo-ZFwdmwHTVfB61Wu-GThcQ7OS4ORcZ13Hb613LWz1LwpQriMUWOErIXJ09xWFJoyxPLYxzbSDKGoV9le61C2DSTgl2PKm-U9njfKNft2y9tg5LDzjyMEii4wu_XyXtEcZf6Z7AINulmTEqd3mNI-FJOYn0RSN2loMbdX_-hjreH6IVS44QXIomKxjP2zGJ0MKjYAYYbPbBRqQERGp5hx6sw9VbfRL__66giq25LhZeeGllxbR0-7O2dOz9c")' }}
                >
                </div>
                <div className="flex items-center gap-2">
                    <h1 className="text-lg font-bold leading-normal dark:text-white">AI模特平台</h1>
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-primary/10 text-primary border border-primary/20">专业版</span>
                </div>
            </div>

            <div className="flex items-center gap-4">
                <button className="relative p-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 text-[#607c8a] dark:text-gray-400 transition-colors hover:rotate-12 duration-300" title="通知">
                    <span className="material-symbols-outlined text-[24px]">notifications</span>
                    <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white dark:border-surface-dark animate-pulse"></span>
                </button>

                <div className="relative group">
                    <button
                        className="flex items-center gap-3 pl-1 pr-2 py-1 rounded-full hover:bg-gray-50 dark:hover:bg-white/5 transition-all outline-none border border-transparent hover:border-gray-200 dark:hover:border-gray-700"
                        onClick={() => setIsProfileOpen(!isProfileOpen)}
                        onBlur={() => setTimeout(() => setIsProfileOpen(false), 200)}
                    >
                        <div
                            className="size-9 rounded-full bg-gray-200 bg-cover bg-center border border-gray-200 dark:border-gray-700"
                            style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuC05ICNMfNo0u31BQ_SISg5TqyBlNXHeCHie1VgFmCTYpfy8aVWruUm_cNeKpiHUJxYZ74MbHC6i_KCN8v3O_o02VZ1PW-5Jenb7gcvxC38mZ44cAisRBO-4gc1SOjuDzhrb3iHBWnVYjp-jeFve-66KY0_aJrzKLXNubrkht-MC_r1hONv7TTd_DFhr48G28uuRc2Dv3OfmGNXJn-5vEa69jvoLvk0z84GS43IZ5ALxFopwsrOzK3nffgTaRaMuuYm-nmMddg9wnG8')" }}
                        ></div>
                        <div className="flex flex-col items-start hidden sm:flex">
                            <span className="text-sm font-semibold text-[#111618] dark:text-white leading-none">138****8888</span>
                        </div>
                        <span className={`material-symbols-outlined text-gray-400 text-lg transition-transform duration-300 ${isProfileOpen ? 'rotate-180' : ''}`}>expand_more</span>
                    </button>

                    {/* Simplified dropdown handling with group-hover for CSS-only simple interaction, or state for complex */}
                    <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-surface-dark rounded-lg shadow-xl border border-gray-100 dark:border-gray-700 py-1 hidden group-hover:block animate-fade-in z-50 origin-top-right">
                        <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
                            <p className="text-sm text-[#111618] dark:text-white font-medium">我的账户</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">user@example.com</p>
                        </div>
                        <a className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors" href="#">
                            <span className="material-symbols-outlined text-[18px]">person</span>
                            完善信息
                        </a>
                        <a className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors" href="#">
                            <span className="material-symbols-outlined text-[18px]">settings</span>
                            账号设置
                        </a>
                        <div className="border-t border-gray-100 dark:border-gray-700 my-1"></div>
                        <a className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors" href="#">
                            <span className="material-symbols-outlined text-[18px]">logout</span>
                            退出登录
                        </a>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
