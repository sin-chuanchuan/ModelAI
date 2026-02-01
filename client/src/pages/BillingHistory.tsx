import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const MOCK_HISTORY = [
    { id: 'ORD-20231024-8832', date: '2023-10-24 14:30:00', type: '基础包 (200张)', amount: '¥ 299.00', method: 'wechat', status: 'success' },
    { id: 'ORD-20231022-7719', date: '2023-10-22 09:15:23', type: '标准包 (1000张)', amount: '¥ 99.00', method: 'alipay', status: 'success' },
    { id: 'ORD-20231021-6652', date: '2023-10-21 18:45:10', type: '企业点数充值', amount: '¥ 1,000.00', method: 'bank', status: 'pending' },
    { id: 'ORD-20231018-4411', date: '2023-10-18 11:20:05', type: '基础包 (200张)', amount: '¥ 99.00', method: 'wechat', status: 'success' },
    { id: 'ORD-20231015-3390', date: '2023-10-15 16:10:00', type: '体验包', amount: '¥ 49.00', method: 'alipay', status: 'failed' },
    { id: 'ORD-20231010-2281', date: '2023-10-10 10:05:45', type: '基础包 (200张)', amount: '¥ 299.00', method: 'wechat', status: 'success' },
    { id: 'ORD-20231005-1192', date: '2023-10-05 15:20:10', type: '体验包', amount: '¥ 9.90', method: 'alipay', status: 'success' },
    { id: 'ORD-20230928-0053', date: '2023-09-28 09:30:00', type: '标准包 (1000张)', amount: '¥ 99.00', method: 'wechat', status: 'success' },
];

const BillingHistory: React.FC = () => {
    const [filterStatus, setFilterStatus] = useState('');

    return (
        <div className="flex-1 overflow-y-auto p-4 md:p-8 bg-background-light dark:bg-background-dark h-full">
            <div className="max-w-6xl mx-auto flex flex-col gap-6">

                {/* Breadcrumb */}
                <nav className="flex text-sm font-medium text-slate-500 dark:text-slate-400">
                    <ol className="flex flex-wrap items-center gap-2">
                        <li><Link to="/billing" className="hover:text-primary transition-colors">费用中心</Link></li>
                        <li><span className="material-symbols-outlined text-[16px] pt-1">chevron_right</span></li>
                        <li aria-current="page" className="text-slate-900 dark:text-slate-200 font-semibold">充值记录</li>
                    </ol>
                </nav>

                {/* Header Actions */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div className="flex flex-col gap-2">
                        <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">充值记录与对账</h1>
                        <p className="text-slate-500 dark:text-slate-400 text-base">查看您的账户余额、充值记录及消费明细。</p>
                    </div>
                    <button className="group flex items-center justify-center gap-2 rounded-lg bg-primary hover:bg-sky-600 text-white px-6 py-2.5 text-sm font-bold shadow-sm shadow-primary/30 transition-all active:scale-95">
                        <span className="material-symbols-outlined text-[20px]">add_card</span>
                        <span>账户充值</span>
                    </button>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1 rounded-xl bg-white dark:bg-surface-dark p-6 shadow-sm border border-slate-200 dark:border-slate-800 relative overflow-hidden group">
                        <div className="absolute right-0 top-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                            <span className="material-symbols-outlined text-8xl text-primary">account_balance_wallet</span>
                        </div>
                        <p className="text-slate-500 dark:text-slate-400 text-sm font-medium uppercase tracking-wider">当前账户余额</p>
                        <div className="flex items-baseline gap-2 mt-2">
                            <span className="text-slate-900 dark:text-white text-3xl font-bold tracking-tight">12,450</span>
                            <span className="text-slate-500 dark:text-slate-400 text-sm font-medium">点数</span>
                        </div>
                        <div className="mt-4 flex items-center gap-1 text-emerald-600 dark:text-emerald-400 text-sm font-medium bg-emerald-50 dark:bg-emerald-900/20 w-fit px-2 py-1 rounded">
                            <span className="material-symbols-outlined text-[16px]">trending_up</span>
                            <span>约可生成 1,245 张图片</span>
                        </div>
                    </div>
                    <div className="flex flex-col gap-1 rounded-xl bg-white dark:bg-surface-dark p-6 shadow-sm border border-slate-200 dark:border-slate-800 relative overflow-hidden group">
                        <div className="absolute right-0 top-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                            <span className="material-symbols-outlined text-8xl text-slate-500">history</span>
                        </div>
                        <p className="text-slate-500 dark:text-slate-400 text-sm font-medium uppercase tracking-wider">累计消费点数</p>
                        <div className="flex items-baseline gap-2 mt-2">
                            <span className="text-slate-900 dark:text-white text-3xl font-bold tracking-tight">45,200</span>
                            <span className="text-slate-500 dark:text-slate-400 text-sm font-medium">点数</span>
                        </div>
                        <div className="mt-4 flex items-center gap-1 text-slate-500 dark:text-slate-400 text-sm font-medium bg-slate-50 dark:bg-slate-800 w-fit px-2 py-1 rounded">
                            <span>历史总支出统计</span>
                        </div>
                    </div>
                </div>

                {/* Filters Toolbar */}
                <div className="bg-white dark:bg-surface-dark rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-4 flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
                    <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                        <div className="relative group w-full md:w-auto">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <span className="material-symbols-outlined text-slate-400 text-[20px]">calendar_today</span>
                            </div>
                            <input
                                className="pl-10 pr-4 py-2 w-full md:w-48 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm rounded-lg focus:ring-primary focus:border-primary block outline-none transition-shadow"
                                placeholder="选择日期范围"
                                type="text"
                            />
                        </div>
                        <div className="relative w-full md:w-auto">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <span className="material-symbols-outlined text-slate-400 text-[20px]">filter_list</span>
                            </div>
                            <select
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                                className="pl-10 pr-8 py-2 w-full md:w-40 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm rounded-lg focus:ring-primary focus:border-primary block appearance-none outline-none cursor-pointer"
                            >
                                <option value="">所有状态</option>
                                <option value="success">支付成功</option>
                                <option value="pending">待支付</option>
                                <option value="failed">支付失败</option>
                            </select>
                            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                                <span className="material-symbols-outlined text-slate-400 text-[16px]">expand_more</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 w-full md:w-auto justify-end">
                        <div className="relative w-full md:w-64">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <span className="material-symbols-outlined text-slate-400 text-[20px]">search</span>
                            </div>
                            <input
                                className="pl-10 pr-4 py-2 w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm rounded-lg focus:ring-primary focus:border-primary block outline-none transition-shadow"
                                placeholder="搜索订单编号"
                                type="text"
                            />
                        </div>
                        <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 focus:z-10 focus:ring-2 focus:ring-primary transition-colors whitespace-nowrap">
                            <span className="material-symbols-outlined text-[20px]">download</span>
                            <span className="hidden sm:inline">导出账单</span>
                        </button>
                    </div>
                </div>

                {/* Table */}
                <div className="bg-white dark:bg-surface-dark rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700 text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 font-semibold">
                                    <th className="px-6 py-4 whitespace-nowrap">交易时间</th>
                                    <th className="px-6 py-4 whitespace-nowrap">订单编号</th>
                                    <th className="px-6 py-4 whitespace-nowrap">套餐名称</th>
                                    <th className="px-6 py-4 whitespace-nowrap text-right">支付金额</th>
                                    <th className="px-6 py-4 whitespace-nowrap">支付方式</th>
                                    <th className="px-6 py-4 whitespace-nowrap">状态</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
                                {MOCK_HISTORY.map(tx => (
                                    <tr key={tx.id} className="group hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap text-slate-600 dark:text-slate-300">
                                            {tx.date}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="font-mono text-slate-900 dark:text-white select-all">{tx.id}</span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-slate-900 dark:text-white font-medium">
                                            {tx.type}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-slate-900 dark:text-white font-semibold">
                                            {tx.amount}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                                                <span className={`material-symbols-outlined ${tx.method === 'wechat' ? 'text-green-500' :
                                                    tx.method === 'alipay' ? 'text-sky-500' : 'text-slate-500'
                                                    }`}>
                                                    {tx.method === 'wechat' ? 'chat_bubble' :
                                                        tx.method === 'alipay' ? 'payments' : 'account_balance'}
                                                </span>
                                                <span>
                                                    {tx.method === 'wechat' ? '微信支付' :
                                                        tx.method === 'alipay' ? '支付宝' : '银行转账'}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {tx.status === 'success' && (
                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400">
                                                    <span className="size-1.5 rounded-full bg-emerald-500"></span>
                                                    支付成功
                                                </span>
                                            )}
                                            {tx.status === 'pending' && (
                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400">
                                                    <span className="size-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                                                    待支付
                                                </span>
                                            )}
                                            {tx.status === 'failed' && (
                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-400">
                                                    <span className="size-1.5 rounded-full bg-rose-500"></span>
                                                    支付失败
                                                </span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {/* Pagination */}
                    <div className="flex items-center justify-between border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 px-6 py-4">
                        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                            <div>
                                <p className="text-sm text-slate-700 dark:text-slate-300">
                                    显示 <span className="font-medium text-slate-900 dark:text-white">1</span> 至 <span className="font-medium text-slate-900 dark:text-white">8</span> 条，共 <span className="font-medium text-slate-900 dark:text-white">42</span> 条结果
                                </p>
                            </div>
                            <div>
                                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                                    <button className="relative inline-flex items-center rounded-l-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-2 py-2 text-sm font-medium text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700">
                                        <span className="sr-only">Previous</span>
                                        <span className="material-symbols-outlined text-[20px]">chevron_left</span>
                                    </button>
                                    <button aria-current="page" className="relative z-10 inline-flex items-center border border-primary bg-primary/10 px-4 py-2 text-sm font-medium text-primary">1</button>
                                    <button className="relative inline-flex items-center border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-4 py-2 text-sm font-medium text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700">2</button>
                                    <button className="relative inline-flex items-center border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-4 py-2 text-sm font-medium text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700">3</button>
                                    <span className="relative inline-flex items-center border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-400">...</span>
                                    <button className="relative inline-flex items-center rounded-r-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-2 py-2 text-sm font-medium text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700">
                                        <span className="sr-only">Next</span>
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

export default BillingHistory;
