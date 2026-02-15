import { Upload } from 'antd';
import { CloudUploadOutlined, DeleteOutlined, CheckCircleFilled } from '@ant-design/icons';

const { Dragger } = Upload;

interface GarmentSidebarProps {
    garmentUrls: string[];
    uploading: boolean;
    onUpload: (file: File) => Promise<boolean>;
    onRemove?: (index: number) => void;
}

const GarmentSidebar: React.FC<GarmentSidebarProps> = ({
    garmentUrls,
    uploading,
    onUpload,
    onRemove
}) => {
    const garmentCount = garmentUrls.length;

    return (
        <div className="w-1/3 flex flex-col border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-[#1e293b]">
            <div className="p-6 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <span className="material-symbols-outlined text-[#0da6f2]">checkroom</span>
                        上传待合成服装
                    </h3>
                    <span className="text-xs text-slate-400 font-medium">{garmentCount}/20</span>
                </div>

                <Dragger
                    multiple
                    showUploadList={false}
                    customRequest={({ file }) => onUpload(file as File)}
                    className="bg-slate-50 dark:bg-slate-800/50 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl hover:border-[#0da6f2] transition-all"
                    disabled={uploading || garmentCount >= 20}
                >
                    <div className="py-4">
                        <div className="w-12 h-12 rounded-full bg-white dark:bg-slate-600 flex items-center justify-center mx-auto mb-3 shadow-sm">
                            <CloudUploadOutlined className="text-xl text-[#0da6f2]" />
                        </div>
                        <p className="text-xs font-bold text-slate-700 dark:text-slate-200">点击或拖拽上传</p>
                        <p className="text-[10px] text-slate-400 mt-1">支持 PNG/JPG, 最大 10MB</p>
                    </div>
                </Dragger>
            </div>

            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
                {garmentUrls.length === 0 ? (
                    <div className="flex-1 flex flex-col items-center justify-center opacity-40 py-20">
                        <span className="material-symbols-outlined text-5xl mb-2">inventory_2</span>
                        <p className="text-xs font-medium">暂无已上传服装</p>
                    </div>
                ) : (
                    garmentUrls.map((url, i) => (
                        <div key={i} className="group relative flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-700 hover:border-[#0da6f2]/30 transition-all">
                            <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0 bg-slate-200">
                                <img src={url} className="w-full h-full object-cover" alt="" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-xs font-bold text-slate-700 dark:text-slate-200 truncate">款式 #{i + 1}</p>
                                <div className="flex items-center gap-1.5 mt-1 text-[10px] text-green-500 font-bold">
                                    <CheckCircleFilled />
                                    <span>检测成功</span>
                                </div>
                            </div>
                            <button
                                onClick={() => onRemove?.(i)}
                                className="opacity-0 group-hover:opacity-100 p-2 text-slate-400 hover:text-red-500 transition-all"
                            >
                                <DeleteOutlined />
                            </button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default GarmentSidebar;
