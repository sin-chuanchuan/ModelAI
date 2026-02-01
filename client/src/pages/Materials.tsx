import React, { useState } from 'react';

const CATEGORIES = [
    { id: 'all', name: '全部素材', icon: 'grid_view', count: 124 },
    { id: 'female', name: '女装', icon: 'woman', count: 86 },
    { id: 'male', name: '男装', icon: 'man', count: 32 },
    { id: 'child', name: '童装', icon: 'child_care', count: 6 },
    { id: 'uncategorized', name: '未分类', icon: 'folder_off', count: 0 },
];

const MOCK_IMAGES = [
    { id: 1, title: 'Floral Summer Dress', date: '2023-10-24', url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBg2HaVyxueclKSnks9Hnl3stUsa1yRsmxzYiW81T2fQzEp68tyRPl19a3_vLILU9TyvyQM_NDGOrCG5VOWBnrUscVtA59fEKYBayIYHibhBlqImwhKEiXDXSen7CcRdv625u4VkJbQsbGZldwylilWr3rR086W_Yso99zHZf411tdGKXvIJEtFXsQ4V0Cvvuc4-5LmYmvfQQb6ihcRObxRoFPezIJCXF3O38f0DBKqi2ivD9X2numy-MZrpMsqSRwSmuw_4-7asv2Q', status: 'processed' },
    { id: 2, title: 'Blue Denim Jacket', date: '2023-10-22', url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAX1cYMjRpz9ue1Twhdm9kIgDXUKCWZmDzBJtRtWMSQcB-QJBspva9cEAKnUCbQ9Etw5JNoT03RQVg1fcVR9h5sPFwCa6xp17skfEjnZ_d2iqgLxvcQiG-WDv04TUZcVEoCE3ayoezJllpcr3CyaKUrLQ-HEbvG1BN4Zmc4Z6UoK8toJ5USKXyEp1Ge0tLdUrRZV_sdYssf4jYKmVixeA1weRC6yVj8ZAcPSn-SfRzNcwtalnvP663UPCpBnApQxSSCnMuOD5Dm_T72', status: 'new' },
    { id: 3, title: 'Linen White Shirt', date: '2023-10-20', url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDuHGkyntYNjNNVMhG0TXdJrRNReNtnnSedMWlgFiYDyE8-f6gTw2o0JX5ttYQu7bKv4VByQKcV7lKhtqnGQnxf7wuQ2tknAJrbHTn2dKmejDDDaskluTsqbBUh1kz8ktBaC-4hFMTKH4h0BtDNxMzg1FXAVVMNTiK4WU0EGzDMdccHBXqTM97EaZJrYAdsiTophvZXLA3mmiwvOS2_y4uUfkzdP2RWjIvlHPmY8vtIlCE_b92fnjfTIaMtWkLgZKBwiti1QB4MJ0ud', status: 'normal' },
    { id: 4, title: 'Classic Trench Coat', date: '2023-10-18', url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAQqaIf2QPD3Xa7HACRMhZTcRR6uQenmkkaEF5T7X-3dsv32Hw8Y5lMfNd6RE1C_Ta72N9AFfyVqDGSHAbQigo5s7Q_Ox77WByV80N6WcSSSUXsykgFPURCOxyRpLjUafrXx-ZditI0eziucEo8YmebpKQ_2PkwU55C1X7TrpMP-uuWG6Llnlqc-eK2wvRpJoWaSZnA3Yc__yiHmtLY7zdloin6_qDzS8tGmnQ2K9hVomA0MQwIJ_vZ3_LX5rCtxOvVkuKKzU6IbAUP', status: 'normal' },
    { id: 5, title: 'Oversized Red Hoodie', date: '2023-10-15', url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAYhXevcdKyvZ-M-JUMRAZVTCzbGiWWHh_wFYxUHcASC0iof6p6md8BNqU6atpA4RnyOeFJK405RGJ_uNA-IPVY0HblUbStEuZXg7MeIJh-qJR_JuLWZL2Cn2EYCtauBSmdbDlokTAVfIjCUDqVUHeruzVKp_6HuFuTxtfQbOptOOeL0HHwJjzyiAsY8iDMWTiA7mzIl1sfOzGIjBniZ8Y1mECjgpOU1dld94DXXUu-D9vjDxSaIuC-HkW4oZ5jIOC_wU_733-zg-w0', status: 'normal' },
];

const Materials: React.FC = () => {
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [detailsOpen, setDetailsOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState<any>(null);

    const handleItemClick = (item: any) => {
        setSelectedItem(item);
        setDetailsOpen(true);
    };

    return (
        <div className="flex h-full bg-background-light dark:bg-background-dark overflow-hidden">
            {/* Internal Sidebar */}
            <nav className="w-56 flex-none bg-white dark:bg-surface-dark border-r border-gray-200 dark:border-gray-800 flex flex-col pt-6 pb-4 px-3 gap-6 hidden md:flex">
                <div className="flex flex-col gap-1">
                    <h3 className="px-3 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">素材分类</h3>
                    {CATEGORIES.map(cat => (
                        <button
                            key={cat.id}
                            onClick={() => setSelectedCategory(cat.id)}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-colors w-full text-left
                                ${selectedCategory === cat.id
                                    ? 'bg-primary/10 text-primary'
                                    : 'text-slate-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
                        >
                            <span className="material-symbols-outlined text-[20px]">{cat.icon}</span>
                            <span className="text-sm">{cat.name}</span>
                            {cat.count > 0 && selectedCategory === cat.id && (
                                <span className="ml-auto text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full">{cat.count}</span>
                            )}
                        </button>
                    ))}
                </div>
            </nav>

            {/* Main Content */}
            <main className="flex-1 flex flex-col min-w-0 relative">
                {/* Search Header */}
                <div className="flex flex-col sm:flex-row gap-4 justify-between items-center px-6 py-5 border-b border-gray-200/50 dark:border-gray-800/50 bg-white/95 dark:bg-surface-dark/95 backdrop-blur-sm z-10 sticky top-0">
                    <div className="relative w-full max-w-md">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                            <span className="material-symbols-outlined">search</span>
                        </div>
                        <input
                            type="text"
                            className="block w-full pl-10 pr-3 py-2.5 border-none rounded-lg bg-gray-50 dark:bg-gray-800 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/50 shadow-sm transition-all"
                            placeholder="搜索服装名称或标签..."
                        />
                    </div>
                    <button className="flex items-center justify-center gap-2 bg-primary hover:bg-sky-600 text-white px-5 py-2.5 rounded-lg shadow-sm shadow-primary/30 transition-all active:scale-95 whitespace-nowrap text-sm font-bold w-full sm:w-auto">
                        <span className="material-symbols-outlined text-[20px]">cloud_upload</span>
                        上传新服装
                    </button>
                </div>

                {/* Toolbar */}
                <div className="bg-white dark:bg-surface-dark border-b border-gray-200 dark:border-gray-800 px-6 py-2 flex items-center gap-4 shadow-sm">
                    <div className="flex items-center gap-2 mr-4">
                        <input type="checkbox" className="rounded border-gray-300 text-primary focus:ring-primary" />
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">全选</span>
                    </div>
                    <div className="h-6 w-px bg-gray-200 dark:bg-gray-700 mx-2"></div>
                    <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 text-slate-600 dark:text-slate-300 text-sm font-medium transition-colors">
                        <span className="material-symbols-outlined text-[18px]">filter_list</span>
                        <span>筛选</span>
                    </button>
                </div>

                {/* Grid Content */}
                <div className="flex-1 overflow-y-auto p-6 scroll-smooth">
                    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
                        {/* New Item Placeholder */}
                        <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-700 bg-transparent text-slate-400 hover:text-primary hover:border-primary hover:bg-primary/5 transition-all cursor-pointer aspect-[3/4] group">
                            <div className="bg-gray-100 dark:bg-gray-800 rounded-full p-4 group-hover:scale-110 transition-transform">
                                <span className="material-symbols-outlined text-3xl">add_a_photo</span>
                            </div>
                            <span className="mt-3 text-sm font-medium">上传新素材</span>
                        </div>

                        {MOCK_IMAGES.map(item => (
                            <div
                                key={item.id}
                                onClick={() => handleItemClick(item)}
                                className={`group relative bg-white dark:bg-surface-dark rounded-xl shadow-sm hover:shadow-lg transition-all border cursor-pointer overflow-hidden
                                    ${selectedItem?.id === item.id ? 'border-2 border-primary' : 'border-transparent hover:border-gray-200 dark:hover:border-gray-700'}`}
                            >
                                <div className="aspect-[3/4] w-full overflow-hidden bg-gray-100 dark:bg-gray-900">
                                    <img src={item.url} alt={item.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                                </div>
                                <div className="p-3">
                                    <h3 className="font-bold text-slate-900 dark:text-white text-sm truncate">{item.title}</h3>
                                    <div className="flex items-center justify-between mt-1">
                                        <span className="text-xs text-slate-500 dark:text-slate-400">{item.date}</span>
                                        {item.status === 'processed' && <span className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-[10px] px-1.5 py-0.5 rounded font-medium">已处理</span>}
                                        {item.status === 'new' && <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-[10px] px-1.5 py-0.5 rounded font-medium">New</span>}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </main>

            {/* Details Sidebar (Drawer) */}
            {detailsOpen && selectedItem && (
                <aside className="w-80 flex-none bg-white dark:bg-surface-dark border-l border-gray-200 dark:border-gray-800 flex flex-col overflow-y-auto shadow-xl z-20 animate-slide-in-right">
                    <div className="p-5 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between sticky top-0 bg-white dark:bg-surface-dark z-10">
                        <h3 className="font-bold text-lg text-slate-900 dark:text-white">素材详情</h3>
                        <button onClick={() => setDetailsOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                            <span className="material-symbols-outlined">close</span>
                        </button>
                    </div>
                    <div className="p-5 flex flex-col gap-6">
                        <div className="flex flex-col gap-3">
                            <div className="rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 aspect-[3/4] relative group">
                                <img src={selectedItem.url} alt={selectedItem.title} className="w-full h-full object-cover" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-slate-900 dark:text-white leading-tight">{selectedItem.title}</h2>
                                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">ID: #AS-{selectedItem.id}883</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex flex-col gap-1">
                                <span className="text-xs font-semibold text-slate-500 uppercase">分类</span>
                                <span className="text-sm font-medium bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded w-fit text-slate-700 dark:text-slate-300">女装</span>
                            </div>
                            <div className="flex flex-col gap-1">
                                <span className="text-xs font-semibold text-slate-500 uppercase">上传时间</span>
                                <span className="text-sm text-slate-700 dark:text-slate-300">{selectedItem.date}</span>
                            </div>
                        </div>

                        <div className="mt-auto pt-4 flex gap-3">
                            <button className="flex-1 bg-primary hover:bg-sky-600 text-white py-2.5 rounded-lg text-sm font-bold shadow-sm shadow-primary/20 transition-all">
                                去生成模特
                            </button>
                            <button className="bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-slate-700 dark:text-slate-200 p-2.5 rounded-lg transition-colors border border-gray-200 dark:border-gray-700">
                                <span className="material-symbols-outlined">more_horiz</span>
                            </button>
                        </div>
                    </div>
                </aside>
            )}
        </div>
    );
};

export default Materials;
