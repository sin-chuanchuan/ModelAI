import React from 'react';
import { Button } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';

const ResultFooter: React.FC = () => {
    return (
        <div className="h-16 px-6 bg-white dark:bg-[#1e293b] border-t border-slate-100 dark:border-slate-800 flex items-center justify-between shrink-0 z-30 shadow-[0_-4px_20px_rgba(0,0,0,0.03)]">
            <div className="flex items-center gap-10">
                <Button
                    variant="text"
                    className="text-slate-500 font-bold hover:text-slate-800 dark:hover:text-white border-none bg-transparent h-auto p-0"
                >
                    保存草稿
                </Button>
            </div>

            <div className="flex items-center gap-4">
                <Button
                    type="primary"
                    icon={<DownloadOutlined />}
                    className="h-11 px-8 rounded-lg bg-[#0da6f2] hover:bg-[#0c95da] border-none font-bold shadow-lg shadow-[#0da6f2]/20 flex items-center gap-2"
                >
                    导出全套商用图
                </Button>
            </div>
        </div>
    );
};

export default ResultFooter;
