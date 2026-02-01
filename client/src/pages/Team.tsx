import React, { useState } from 'react';

const MEMBERS = [
    { id: 1, name: 'Alice Wang', email: 'alice@fashionstep.ai', role: 'admin', status: 'active', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB7GT2csV7G3xHV1jOH305w9QQRfw3weHmjQltoZ8K2cxgU1D-y3LMh-hy2MQxgcLc-EBPPtnabiPXucdoUy8fvreaK4qDSZqXG3GzPsebEsxkda4WCwtnIDByUIlHKePTW5jXuokcEVl6AbL9l3AVmmoZyBxYd4zwg2DhPD8MQE7n8Dd-apl994Ya8IYc_PuIydgP6jA3zCHyV32DbWHLpyV2XixrMz24E0nmCr5nCYoueAJ0PCitqcdUFwXjTFjDxZ3Fw7U5Ruh9T', lastActive: '刚刚' },
    { id: 2, name: 'Bob Chen', email: 'bob@fashionstep.ai', role: 'editor', status: 'active', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBOgTVMHvk_GtbhgtCDH9saGl1Ai6LuwL5A7megA4idkkcqZklOCyOBKB1IeQ1E3ys5IrujfMnrFVG_dX0bQB7tI1eBEQe-aviD_FejJM4fs8d983zyyARW29ROdbaiIcksAugc916lRA4PAmaVlnnB9U6dEMSc2u8saZqcrsTeX4Uh9Gv5qoBUjPGA2_ZgSfY3cFD_9EfijcW6CP1Bdi77wzCHMOdPUUC5qI90LeU6BdDCFhzrNUkd1iEn0XtZWz8UKKJgP4hjV5fD', lastActive: '2 小时前' },
    { id: 3, name: 'Cathy Li', email: 'cathy@fashionstep.ai', role: 'editor', status: 'inactive', initials: 'CL', lastActive: '3 周前' },
    { id: 4, name: 'David Zhang', email: 'david.z@fashionstep.ai', role: 'editor', status: 'active', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDdDQyYViXZr_1e5mVBJwo5itPE-PJIdMKrfK_Nf4KjLBmgTee3QFIg82OgyJJTqoaRuuEivGl2VXktJsJC5YBUEdq017aBm_-eZnsh7Zs9afPHQkPoydaqF8n_2FmBaE339K2Fz5v2liXU_DhGvhe53v8l_9_QBVHIeGnL5nogcAnzU8wksCzfYt9c7lJaONc80foT9VcUUlEB5tZcjMQTpGnw9yaljrV2ySL_RsKlrLcVfP8cNZdGCUbNgl-yNNd23T1U1JFCjUHm', lastActive: '1 天前' },
    { id: 5, name: 'Eva Kim', email: 'eva@fashionstep.ai', role: 'editor', status: 'active', initials: 'EK', lastActive: '5 天前' },
];

const Team: React.FC = () => {
    const [filterRole, setFilterRole] = useState('all');

    return (
        <div className="flex-1 overflow-y-auto p-8 bg-background-light dark:bg-background-dark h-full">
            <div className="max-w-[1200px] mx-auto flex flex-col gap-6">

                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight mb-1">团队管理</h1>
                        <p className="text-slate-500 dark:text-slate-400 text-sm">管理您的团队成员、角色及访问权限 • <span className="font-medium text-slate-900 dark:text-slate-300">8 位成员</span></p>
                    </div>
                    <button className="flex items-center justify-center gap-2 bg-primary hover:bg-sky-600 text-white px-5 py-2.5 rounded-lg font-medium transition-colors shadow-sm shadow-primary/20 active:scale-95">
                        <span className="material-symbols-outlined text-[20px]">add</span>
                        <span>邀请成员</span>
                    </button>
                </div>

                {/* Filters */}
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-1 max-w-md group">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <span className="material-symbols-outlined text-slate-400 group-focus-within:text-primary transition-colors">search</span>
                        </div>
                        <input
                            type="text"
                            className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 dark:border-gray-700 rounded-lg leading-5 bg-white dark:bg-surface-dark text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary sm:text-sm transition-shadow"
                            placeholder="搜索姓名、邮箱或账号ID"
                        />
                    </div>
                    <div className="relative w-full sm:w-48">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <span className="material-symbols-outlined text-slate-400 text-[20px]">filter_list</span>
                        </div>
                        <select
                            className="block w-full pl-10 pr-10 py-2.5 text-base border-gray-200 dark:border-gray-700 bg-white dark:bg-surface-dark text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary sm:text-sm rounded-lg appearance-none cursor-pointer"
                            value={filterRole}
                            onChange={(e) => setFilterRole(e.target.value)}
                        >
                            <option value="all">所有角色</option>
                            <option value="admin">管理员</option>
                            <option value="editor">编辑员</option>
                        </select>
                        <div className="absolute inset-y-0 right-0 pr-2 flex items-center pointer-events-none">
                            <span className="material-symbols-outlined text-slate-400 text-[20px]">expand_more</span>
                        </div>
                    </div>
                </div>

                {/* Table */}
                <div className="bg-white dark:bg-surface-dark rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
                            <thead className="bg-gray-50 dark:bg-gray-800/50">
                                <tr>
                                    <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">成员信息</th>
                                    <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">角色</th>
                                    <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">状态</th>
                                    <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">最近活跃</th>
                                    <th scope="col" className="relative px-6 py-4 text-right text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                        操作
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white dark:bg-surface-dark divide-y divide-gray-200 dark:divide-gray-800">
                                {MEMBERS.map(member => (
                                    <tr key={member.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                {member.avatar ? (
                                                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-cover bg-center" style={{ backgroundImage: `url('${member.avatar}')` }}></div>
                                                ) : (
                                                    <div className="flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-300 font-bold text-sm">
                                                        {member.initials}
                                                    </div>
                                                )}
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-slate-900 dark:text-white">{member.name}</div>
                                                    <div className="text-sm text-slate-500 dark:text-slate-400">{member.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {member.role === 'admin' ? (
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                                                    管理员
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-slate-300">
                                                    编辑员
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-2">
                                                <div className={`size-2 rounded-full ${member.status === 'active' ? 'bg-green-500' : 'bg-gray-400 dark:bg-gray-600'}`}></div>
                                                <span className="text-sm text-slate-900 dark:text-slate-300">{member.status === 'active' ? '正常' : '已停用'}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">
                                            {member.lastActive}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <div className="flex items-center justify-end gap-4">
                                                {member.role === 'admin' ? (
                                                    <button className="text-slate-500 hover:text-primary dark:text-gray-400 dark:hover:text-primary transition-colors">编辑资料</button>
                                                ) : member.status === 'inactive' ? (
                                                    <button className="text-primary hover:text-blue-600 dark:text-primary dark:hover:text-blue-300 transition-colors">启用账号</button>
                                                ) : (
                                                    <>
                                                        <button className="text-primary hover:text-blue-600 dark:text-primary dark:hover:text-blue-300 transition-colors">修改权限</button>
                                                        <button className="text-slate-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 transition-colors">禁用账号</button>
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="px-6 py-4 flex items-center justify-between border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
                        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                            <div>
                                <p className="text-sm text-slate-500 dark:text-slate-400">
                                    显示第 <span className="font-medium text-slate-900 dark:text-white">1</span> 到 <span class="font-medium text-slate-900 dark:text-white">5</span> 条，共 <span className="font-medium text-slate-900 dark:text-white">8</span> 条结果
                                </p>
                            </div>
                            <div>
                                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                                    <button className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-surface-dark text-sm font-medium text-slate-500 hover:bg-gray-50 dark:hover:bg-gray-700">
                                        <span className="sr-only">上一页</span>
                                        <span className="material-symbols-outlined text-[20px]">chevron_left</span>
                                    </button>
                                    <button aria-current="page" className="z-10 bg-primary/10 border-primary text-primary relative inline-flex items-center px-4 py-2 border text-sm font-medium">
                                        1
                                    </button>
                                    <button className="bg-white dark:bg-surface-dark border-gray-300 dark:border-gray-700 text-slate-500 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-gray-700 relative inline-flex items-center px-4 py-2 border text-sm font-medium">
                                        2
                                    </button>
                                    <button className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-surface-dark text-sm font-medium text-slate-500 hover:bg-gray-50 dark:hover:bg-gray-700">
                                        <span className="sr-only">下一页</span>
                                        <span className="material-symbols-outlined text-[20px]">chevron_right</span>
                                    </button>
                                </nav>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Team;
