import React from 'react';

const AuthLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <div className="min-h-screen w-full flex overflow-hidden font-display">
            {/* Left Panel: Brand Showcase */}
            <div className="hidden lg:flex w-1/2 relative flex-col justify-between bg-cover bg-center" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDj38LNF7LzIN8cprOocM0IvcL68rCmbdld3zw_u6bPtGhYpTNiZ8FT0Hx8k4TvfkljMaxuB3ZZusCA9RKDBCRClTeaWZ_PqiJhoy7C8fZGWeISpN_n-bwZ0aRfiU6jxCR8PH8IFF2HcQ_hO9RR6DvywD4f4jMb2KVvWW5z86MPnyza6Nd6SI0hboczlVhM97pd6u8FGAeJ_E6MJlUzcc4czwj8hipxe-8VWjRbhejjc--qoU2IGbOtWIeh0ZXahWZurSGa-2IlPEgo')" }}>
                {/* Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/70"></div>

                {/* Content */}
                <div className="relative z-10 flex flex-col h-full justify-between p-12 xl:p-20">
                    {/* Logo Area */}
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center text-white">
                            <span className="material-symbols-outlined text-[24px]">view_in_ar</span>
                        </div>
                        <span className="text-white text-xl font-bold tracking-tight">AI Fashion Gen</span>
                    </div>

                    {/* Value Proposition */}
                    <div className="max-w-lg">
                        <h1 className="text-white text-5xl font-black leading-[1.15] mb-6 tracking-tight">
                            三步生成<br />商用级服装模特图
                        </h1>
                        <p className="text-white/90 text-lg font-normal leading-relaxed">
                            专为中小电商打造的AI摄影师，无需昂贵外拍，<br />上传服装平铺图，即刻生成专业模特大片。
                        </p>

                        <div className="mt-10 flex gap-4">
                            <div className="flex -space-x-3">
                                <img className="w-10 h-10 rounded-full border-2 border-white object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBW3waibple8aSLVWuAm5PfJrnTCjpuTeNEjqSmyIRQKIs30KVm4jmFfV0FacPkEDRzNYDjphuTXnfyfj69m9auYbhaoZfH8Zdu8JTg3uwxrYrRgC7rrUvAFwjV74OyYXT8cNgv6sTHh1Dr6U2xOhl8f6aB2EHweSM27VySOOB3YXtCgrKO2AHPnCFfPJ2-vUGx2oLKWmcQfVFwM2eSnHRdy4-8U8QuXO4qa4WLhRB34bHpsv9IfD2iKuqdja_DozRT-zNihc43kM0i" alt="User" />
                                <img className="w-10 h-10 rounded-full border-2 border-white object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAOYPxs6d84Q_18Bf2R9lucQ_WXEyFtHFLsbiWzKrnXRK3yPVVfpaQbRjbgxmGgN9rfKWbE9qrnkmZAT1wTBslnwovhEotvzdHiGbN8XlFTYCRqAJ17mXQ8F1kbrz-JCBLF1Grs1IeZoB41L91eharoYZfuejTqfy4rORm5fHV4BdKtmqU6cUZnCYqqFL2wSRojQE8lkFjtNIH7KrXt-j7WOfE1W5mgqqS3AZVGYTbKQrCKxD5Yg2fPLq_qg5Mbyoc8ukqTRG8m9J6E" alt="User" />
                                <img className="w-10 h-10 rounded-full border-2 border-white object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBfmUpBAMHXnjjJc4hxlrgt34wqRtp6A1ryWLXC8bjnumC794h1omHX9MGlSsoBj1VLe1_1thRltJVapyNHMhrR-r0_k-05qFHVD4IrmRS93mHAukk3B1M-KsmSmCO1NkwHbneEEHODrGw6s2mp66eM0zBWhR_2tS1lC1gim99vBbV6eiSdyWz7jQJ1NreRCrZzv9yN2ql3SnK0tzH8NDKzIIBPdAT5_aruWHsLv-x1-7tGsn46I0tRq6_fr2qee9lZfiQc1emjcK5P" alt="User" />
                                <div className="w-10 h-10 rounded-full border-2 border-white bg-white/20 backdrop-blur-sm flex items-center justify-center text-xs text-white font-medium">+2k</div>
                            </div>
                            <div className="flex flex-col justify-center">
                                <div className="flex text-yellow-400 text-xs">
                                    <span className="material-symbols-outlined text-[16px] filled">star</span>
                                    <span className="material-symbols-outlined text-[16px] filled">star</span>
                                    <span className="material-symbols-outlined text-[16px] filled">star</span>
                                    <span className="material-symbols-outlined text-[16px] filled">star</span>
                                    <span className="material-symbols-outlined text-[16px] filled">star</span>
                                </div>
                                <span className="text-white/80 text-xs font-medium mt-0.5">已有 2000+ 店铺使用</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Panel: Content (Form) */}
            <div className="w-full lg:w-1/2 flex flex-col justify-center items-center bg-white dark:bg-background-dark p-6 sm:p-12 overflow-y-auto">
                <div className="w-full max-w-[420px] flex flex-col gap-8">
                    {/* Mobile Logo (Only visible on small screens) */}
                    <div className="lg:hidden flex items-center gap-2 mb-4">
                        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white">
                            <span className="material-symbols-outlined text-[20px]">view_in_ar</span>
                        </div>
                        <span className="text-slate-900 dark:text-white text-lg font-bold">AI Fashion Gen</span>
                    </div>
                    {children}
                </div>
            </div>
        </div>
    );
};

export default AuthLayout;
