import React from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard: React.FC = () => {
    const navigate = useNavigate();

    // Mock data for recent generations
    const recentHistory = [
        {
            id: 1,
            title: "夏季针织系列",
            date: "已完成 (2小时前)",
            model: "模特 A",
            image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDG3dzjrK_4eo0WSPrfrcWT8GoYmfLNXibfA1lRq69TpkJnMqjhr2MHMOn3eqEtvDkIdrqD4EwpqWpUm98603JYUBAu-H3BO_kfU9dXV4oNPQ6-VV-1vquhFgCadBwSzrCRUBHOM88JkkNgCagbNOp3wTah4E_cmKdKWdCnR6IwgX3a5E793OccaegUuilVUo9BYJvV29tDf2iFPm9z-TlOygYy9a-ROwMPjHYC_C9Q5wVEGPPYuQ8lUhkHmmc6w7NTrJJrzh9d8Vz6"
        },
        {
            id: 2,
            title: "秋季外套",
            date: "已完成 (5小时前)",
            model: "模特 B",
            image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDoUQjxTz55m7CIYPW-fn2f5e-GTlTwVWoKwpm4fWk98hwnxxEEKgHQ3bu2X6yyg7Ynv8CIODe35z1GCvJoQYQa8DXxiy2Hs42eWQPuNxCd_0FJHcY14n94QKAbscLwaBcZIAeV9vldlXXb0M5FC7ITyPSnsKsMZwYItnRfLTkjvjQzfSfjxGCFlri6CL1Z6uyVFLb1N3dI2iZlovCf7aVhNkGRvkUg6MgzSEa5a5J5JTJbDN1fK48TnxpF_cT0PXha_rcg1b6h2YRa"
        },
        {
            id: 3,
            title: "男士街头潮牌",
            date: "已完成 (1天前)",
            model: "模特 M",
            image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBJER8YthslDchAGI8rTGDbA7lEFHk423NE5Tcswks3ahiYkpCrSL6fdywIlPDFRRKrORh-OriOAzlEmfVgIBDoJ3XISdk3nh21c7oMp36a98asx04c1x2T8doaCHJmGqmM837wGBOH50XrDuS9vGAPsThFVfvrr4Mu2dJ04bWc-Po7N6Z_2aubJkQsbRoGT2esBTcYus2m4US1c6y4IVtX0iCHr6S4w-d47lU_-j2wQUgU9vZ_lpor1Hag2v2u61oG7Tz-T666Rl_8"
        },
        {
            id: 4,
            title: "亚麻西装",
            date: "已完成 (1天前)",
            model: "模特 A",
            image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBLXgnC-7s3DnQ5xuIJ9yIgpmybEPqZyYfOZ_AHnbdLBVHhIv_ZJ_qYJSzHc_YPhJWXErdHstnDJ8k8UNTTmvncl0VWDiG_QV7veKR1BaTqa26RVtrRWFjqjW5XL0jc2AXYoq06IeObMc3LOxD6DT79Fuv3K_0Ozhb8dMTtALSnnDwPvsFC3PqCTqC4VlMxAGBBbajKnE5mpRtCDIhgKdP3U1i3E9olbNNcePaV2TvDXsws9O0mBATKBhBDMQrbLcxRtzOZTXN47gfM"
        }
    ];

    return (
        <div className="w-full max-w-[1200px] mx-auto px-6 flex flex-col gap-8 pb-12 animate-fade-in">
            <header className="pt-10 pb-6">
                <div className="flex flex-col gap-2">
                    <h1 className="text-[#111618] dark:text-white text-3xl font-black leading-tight tracking-[-0.033em]">AI模特生成控制台</h1>
                    <p className="text-[#607c8a] dark:text-gray-400 text-base font-normal leading-normal">欢迎回来，开始创作新的风格吧。</p>
                </div>
            </header>

            <section>
                <h2 className="text-[#111618] dark:text-white tracking-tight text-[22px] font-bold leading-tight pb-5">立即生成</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Single Generation Card */}
                    <div
                        onClick={() => navigate('/generate/single')} // Navigate to Wizard
                        className="group relative flex flex-col sm:flex-row gap-5 p-6 rounded-xl border border-[#dbe2e6] dark:border-gray-700 bg-white dark:bg-surface-dark hover:border-primary/50 dark:hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 transition-all cursor-pointer hover:-translate-y-1 duration-300"
                    >
                        <div className="size-14 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0 group-hover:scale-110 transition-transform duration-300 shadow-sm">
                            <span className="material-symbols-outlined text-3xl">camera_alt</span>
                        </div>
                        <div className="flex flex-col gap-2 flex-1">
                            <div className="flex justify-between items-start">
                                <h3 className="text-[#111618] dark:text-white text-lg font-bold leading-tight group-hover:text-primary transition-colors">单图生成</h3>
                                <span className="material-symbols-outlined text-gray-300 dark:text-gray-600 group-hover:text-primary transition-colors group-hover:translate-x-1 duration-300">arrow_forward</span>
                            </div>
                            <p className="text-[#607c8a] dark:text-gray-400 text-sm font-normal leading-relaxed">将单张平铺图瞬间转化为专业模特图。适合快速上新。</p>
                        </div>
                    </div>

                    {/* Batch Generation Card */}
                    <div
                        onClick={() => navigate('/generate/batch')}
                        className="group relative flex flex-col sm:flex-row gap-5 p-6 rounded-xl border border-[#dbe2e6] dark:border-gray-700 bg-white dark:bg-surface-dark hover:border-primary/50 dark:hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 transition-all cursor-pointer hover:-translate-y-1 duration-300"
                    >
                        <div className="size-14 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-400 shrink-0 group-hover:scale-110 transition-transform duration-300 shadow-sm">
                            <span className="material-symbols-outlined text-3xl">collections</span>
                        </div>
                        <div className="flex flex-col gap-2 flex-1">
                            <div className="flex justify-between items-start">
                                <h3 className="text-[#111618] dark:text-white text-lg font-bold leading-tight group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">批量生成</h3>
                                <span className="material-symbols-outlined text-gray-300 dark:text-gray-600 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors group-hover:translate-x-1 duration-300">arrow_forward</span>
                            </div>
                            <p className="text-[#607c8a] dark:text-gray-400 text-sm font-normal leading-relaxed">一次性处理系列服装。支持每批次最多10张图片。节省换季上新时间。</p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="flex flex-col flex-1">
                <div className="flex justify-between items-center pb-5 pt-2">
                    <h2 className="text-[#111618] dark:text-white tracking-tight text-[22px] font-bold leading-tight">最近生成记录</h2>
                    <a className="text-sm font-semibold text-primary hover:text-primary/80 flex items-center gap-1 transition-colors group cursor-pointer">
                        查看全部
                        <span className="material-symbols-outlined text-sm transition-transform group-hover:translate-x-0.5">chevron_right</span>
                    </a>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {recentHistory.map((item, index) => (
                        <div
                            key={item.id}
                            className="group flex flex-col gap-3 animate-slide-up"
                            style={{ animationDelay: `${index * 100}ms` }}
                        >
                            <div className="aspect-[3/4] w-full rounded-xl bg-gray-100 dark:bg-gray-800 relative overflow-hidden shadow-sm group-hover:shadow-md transition-shadow">
                                <div
                                    className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                                    style={{ backgroundImage: `url('${item.image}')` }}
                                ></div>
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-2 backdrop-blur-[2px]">
                                    <button className="bg-white text-gray-900 rounded-full p-2 hover:scale-110 transition-transform shadow-lg hover:shadow-xl active:scale-95" title="下载原图">
                                        <span className="material-symbols-outlined text-[20px]">download</span>
                                    </button>
                                    <button className="bg-white text-gray-900 rounded-full p-2 hover:scale-110 transition-transform shadow-lg hover:shadow-xl active:scale-95" title="编辑">
                                        <span className="material-symbols-outlined text-[20px]">edit</span>
                                    </button>
                                </div>
                                <div className="absolute top-3 right-3 bg-white/90 dark:bg-black/60 backdrop-blur-sm px-2 py-1 rounded text-xs font-medium dark:text-white shadow-sm">
                                    {item.model}
                                </div>
                            </div>
                            <div className="flex justify-between items-start px-1">
                                <div>
                                    <h3 className="text-sm font-bold text-[#111618] dark:text-white group-hover:text-primary transition-colors cursor-pointer">{item.title}</h3>
                                    <p className="text-xs text-[#607c8a] dark:text-gray-400">{item.date}</p>
                                </div>
                                <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-1 hover:bg-gray-100 dark:hover:bg-white/10 rounded-full transition-colors">
                                    <span className="material-symbols-outlined text-[20px]">more_vert</span>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default Dashboard;
