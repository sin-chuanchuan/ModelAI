import React from 'react';
import { Link } from 'react-router-dom';

const TRANSACTIONS = [
    { id: 'ORD-20231024-8832', date: '2023-10-24 14:30:00', type: '基础包 (200张)', amount: '¥ 299.00', method: 'wechat', status: 'success' },
    { id: 'ORD-20231022-7719', date: '2023-10-22 09:15:23', type: '标准包 (1000张)', amount: '¥ 99.00', method: 'alipay', status: 'success' },
    { id: 'ORD-20231021-6652', date: '2023-10-21 18:45:10', type: '企业点数充值', amount: '¥ 1,000.00', method: 'bank', status: 'pending' },
    { id: 'ORD-20231018-4411', date: '2023-10-18 11:20:05', type: '基础包 (200张)', amount: '¥ 99.00', method: 'wechat', status: 'success' },
    { id: 'ORD-20231015-3390', date: '2023-10-15 16:10:00', type: '体验包', amount: '¥ 49.00', method: 'alipay', status: 'failed' },
];

const Billing: React.FC = () => {
    return (
        <div className="flex-1 overflow-y-auto p-6 lg:p-10 bg-background-light dark:bg-background-dark h-full">
            <div className="max-w-[1200px] mx-auto">

                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
                    <div className="flex flex-col gap-1">
                        <h1 className="text-2xl md:text-3xl font-black leading-tight tracking-[-0.01em] text-slate-900 dark:text-white">费用中心</h1>
                        <p className="text-slate-500 dark:text-slate-400 text-sm font-normal">管理账户余额与充值记录</p>
                    </div>
                    <div className="flex items-center gap-4 bg-white dark:bg-surface-dark px-6 py-4 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm min-w-[240px]">
                        <div className="bg-primary/10 p-2.5 rounded-full text-primary">
                            <span className="material-symbols-outlined text-[24px]">account_balance_wallet</span>
                        </div>
                        <div>
                            <p className="text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-0.5">当前余额</p>
                            <p className="text-2xl font-bold leading-none text-slate-900 dark:text-white">45 <span className="text-sm font-medium text-slate-500 dark:text-slate-400 ml-1">张</span></p>
                        </div>
                    </div>
                </div>

                <div className="grid lg:grid-cols-12 gap-6">
                    {/* Recharge Options */}
                    <div className="lg:col-span-8 flex flex-col gap-6">
                        <section>
                            <h2 className="text-base font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary text-[20px]">shopping_cart</span>
                                选择充值套餐
                            </h2>
                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="group relative flex flex-col gap-4 rounded-xl border-2 border-transparent bg-white dark:bg-surface-dark hover:border-primary/50 transition-all p-5 shadow-sm ring-1 ring-gray-200 dark:ring-gray-700 hover:ring-primary/50 cursor-pointer">
                                    <div className="flex flex-col gap-1">
                                        <h3 className="text-slate-500 dark:text-slate-400 text-sm font-bold uppercase tracking-wider">体验包</h3>
                                        <div className="flex items-baseline gap-1 mt-1">
                                            <span className="text-3xl font-black leading-tight tracking-[-0.033em] text-slate-900 dark:text-white">¥9.9</span>
                                            <span className="text-slate-500 dark:text-slate-400 font-medium text-sm">/ 10 张</span>
                                        </div>
                                    </div>
                                    <div className="h-px w-full bg-gray-100 dark:bg-gray-700 my-1"></div>
                                    <div className="flex flex-col gap-2">
                                        <div className="text-sm font-medium flex items-center gap-2 text-slate-900 dark:text-slate-200">
                                            <span className="material-symbols-outlined text-green-500 text-[18px]">check_circle</span>
                                            适合测试风格
                                        </div>
                                        <div className="text-sm font-medium flex items-center gap-2 text-slate-900 dark:text-slate-200">
                                            <span className="material-symbols-outlined text-green-500 text-[18px]">check_circle</span>
                                            无过期时间
                                        </div>
                                    </div>
                                </div>
                                <div className="relative flex flex-col gap-4 rounded-xl border-2 border-primary bg-white dark:bg-surface-dark p-5 shadow-md cursor-pointer">
                                    <div className="absolute -top-3 left-6">
                                        <span className="bg-primary text-white text-xs font-bold px-2 py-0.5 rounded-full shadow-sm uppercase tracking-wide">超值推荐</span>
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <h3 className="text-primary text-sm font-bold uppercase tracking-wider">基础包</h3>
                                        <div className="flex items-baseline gap-1 mt-1">
                                            <span className="text-3xl font-black leading-tight tracking-[-0.033em] text-slate-900 dark:text-white">¥99</span>
                                            <span className="text-slate-500 dark:text-slate-400 font-medium text-sm">/ 200 张</span>
                                        </div>
                                        <p className="text-xs text-green-600 dark:text-green-400 font-semibold mt-0.5">单张成本节省 50%</p>
                                    </div>
                                    <div className="h-px w-full bg-gray-100 dark:bg-gray-700 my-1"></div>
                                    <div className="flex flex-col gap-2">
                                        <div className="text-sm font-medium flex items-center gap-2 text-slate-900 dark:text-slate-200">
                                            <span className="material-symbols-outlined text-green-500 text-[18px]">check_circle</span>
                                            适合季度推广
                                        </div>
                                        <div className="text-sm font-medium flex items-center gap-2 text-slate-900 dark:text-slate-200">
                                            <span className="material-symbols-outlined text-green-500 text-[18px]">check_circle</span>
                                            高优先级生成
                                        </div>
                                        <div className="text-sm font-medium flex items-center gap-2 text-slate-900 dark:text-slate-200">
                                            <span className="material-symbols-outlined text-green-500 text-[18px]">check_circle</span>
                                            包含商用授权
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <section className="bg-white dark:bg-surface-dark rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
                            <h2 className="text-base font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary text-[20px]">payments</span>
                                支付方式
                            </h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <label className="relative flex items-center justify-between p-3.5 rounded-lg border border-gray-200 dark:border-gray-700 cursor-pointer hover:bg-background-light dark:hover:bg-gray-800 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 rounded bg-[#09B83E] flex items-center justify-center text-white">
                                            <span className="material-symbols-outlined text-[20px]">chat_bubble</span>
                                        </div>
                                        <div>
                                            <span className="block text-sm font-bold text-slate-900 dark:text-white">微信支付</span>
                                            <span className="block text-xs text-slate-500 dark:text-slate-400">扫码支付</span>
                                        </div>
                                    </div>
                                    <input type="radio" name="payment" className="h-4 w-4 border-gray-300 text-primary focus:ring-primary" defaultChecked />
                                </label>
                                <label className="relative flex items-center justify-between p-3.5 rounded-lg border border-gray-200 dark:border-gray-700 cursor-pointer hover:bg-background-light dark:hover:bg-gray-800 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 rounded bg-[#1677FF] flex items-center justify-center text-white">
                                            <span className="material-symbols-outlined text-[20px]">account_balance_wallet</span>
                                        </div>
                                        <div>
                                            <span className="block text-sm font-bold text-slate-900 dark:text-white">支付宝</span>
                                            <span className="block text-xs text-slate-500 dark:text-slate-400">即时到账</span>
                                        </div>
                                    </div>
                                    <input type="radio" name="payment" className="h-4 w-4 border-gray-300 text-primary focus:ring-primary" />
                                </label>
                            </div>
                        </section>

                        <div className="flex justify-end">
                            <button className="flex w-full md:w-auto min-w-[200px] cursor-pointer items-center justify-center rounded-lg h-11 px-6 bg-primary text-white text-base font-bold leading-normal tracking-[0.015em] shadow-lg shadow-primary/30 hover:bg-primary/90 hover:shadow-primary/40 transition-all">
                                立即支付 ¥99
                            </button>
                        </div>
                    </div>

                    {/* Transaction History */}
                    <div className="lg:col-span-4 flex flex-col gap-6">
                        <section className="bg-white dark:bg-surface-dark rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm flex flex-col h-full">
                            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                                <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                    <span className="material-symbols-outlined text-primary text-[20px]">history</span>
                                    充值记录
                                </h2>
                                <Link to="/billing/history" className="text-xs font-semibold text-primary hover:underline">查看全部</Link>
                            </div>
                            <div className="overflow-x-auto flex-1">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-background-light dark:bg-gray-800">
                                            <th className="px-4 py-2.5 text-xs font-semibold text-slate-500 dark:text-gray-400 uppercase tracking-wider">套餐</th>
                                            <th className="px-4 py-2.5 text-xs font-semibold text-slate-500 dark:text-gray-400 uppercase tracking-wider text-right">金额</th>
                                            <th className="px-4 py-2.5 text-xs font-semibold text-slate-500 dark:text-gray-400 uppercase tracking-wider text-right">状态</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                        {TRANSACTIONS.map(tx => (
                                            <tr key={tx.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                                <td className="px-4 py-3">
                                                    <div className="flex flex-col">
                                                        <span className="text-sm font-semibold text-slate-900 dark:text-white">{tx.type}</span>
                                                        <span className="text-xs text-slate-500 dark:text-gray-500">{tx.date.split(' ')[0]}</span>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3 text-right">
                                                    <span className="text-sm font-bold text-slate-900 dark:text-white">{tx.amount}</span>
                                                </td>
                                                <td className="px-4 py-3 text-right">
                                                    {tx.status === 'success' && <span className="text-xs text-green-600 dark:text-green-400 font-medium">成功</span>}
                                                    {tx.status === 'pending' && <span className="text-xs text-amber-600 dark:text-amber-400 font-medium">待支付</span>}
                                                    {tx.status === 'failed' && <span className="text-xs text-red-600 dark:text-red-400 font-medium">失败</span>}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Billing;
