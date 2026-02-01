import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBatch } from '../../../contexts/BatchContext';

const MODELS = [
    { id: '1', name: 'Luna', type: 'female', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDvfo7Xl3jWkXnENFr3NaW0RQxBg3vQV53gRTB-9Jbkqaa9mGGA1LWVS5PJv9X-AlrjEcOypW1SiW0T21cqhN231DFoITt74BvcTK-zPKKfxNLAsUMne46S2A9goiuYEHCM9tovwtvrLVSYmvMF7iP102DpgDx3U3yDTamJcFnjbrOl-auC6SAA83qoh72Un--2hj0-GDfjHJg3pMMeUIvXY_WsR-8pxEhnTgRDjLwga7wFH0irjtYOXXZcnaA0NOKesvX-ltX_83QO' },
    { id: '2', name: 'Sarah', type: 'female', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC6DYWpddwGx5r-0m74Vz_XgSlEKtVOvNZ472w6gGCPCWF8KaWlKA3zzygHxBOehziYQ7oBhPFUEY5_mstxQG2DJyCg8FpehB41Babdn-z-XpbxhG01q0v5Wu-LpC7Yz5b8JuNMDw6cvDsIvkZ8z-CMHc_GGH98rKRVJDb9oGa3rkKlTEjAAohoW4GfBalSq-9FaKFLRAAtocs0q2cIZ4OitskWvePwjNgBjM1lH6SOUWRqGp2cRp_eo1FyS636KT2f2T7G16CwQbRK' },
    { id: '3', name: 'Nia', type: 'female', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA3YFcMhv5hAYPDlQnvurnUgDtp6III834WN43-znEYJSNOaekERMUd6eaKf4hYN7K01irZuAzSrZUeVvbks5BUltRmxUUDIeGkUwYqKh55rApDRmMgKdLzi5UXqnQfypLaaMWxEE1COFz-cUr019WGhYiLKeCds2De8zea1XWuVS1-8_WpOQDuGGpHHXjJEiJBaz5xFazThc2ot80fvKHRSzeeJFvit1JlDtJraXTEDx2wBMgeVjJAfMlQH6fFlTwIXbr8EIhEh-JP' },
    { id: '4', name: 'Emma', type: 'female', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBHVRT-lL154CGy-S7ZWXQFNszs_xPOlrXtqAfdPinv0Tdq-X9ePNwqN345UTZQ16mFTSS6ImYDkLAJA1MMPaeU_As8CoeuiD_CWH7Happ_JcIR5sNfhjo7Pm7o9eTK0QS4KkJWJc4_LZq3uQUqcxdgKsq9qRZ1zWhaDKcVFAPEz4-1hKELW616OzafRsdQyIaJNucTOGRKSZxRmOFT-0FKnV81mbg_rrYKBGkwSv9iyOvd5CoiHujH-SUFdPPOB1MzXh4RbaBVEcwp' },
    { id: '5', name: 'Sofia', type: 'female', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDnFJxfYEWyhpSbawnTIQ8V8b4i8T9vXPcD1yzBAmuielGUcDhEtJ4n53Gpa9NuGJ5Nux5hd0pw4zmfl2hZRGcJb-aj1Gcc5q07FsCeouKfsY2HiAzsg1Za3Jg2vvgfwRv5g7looOw8-ZLurRAyj2A23VwSnZ9CyMQacwL30l6mkWDSQYAy28mk4O24A-JOsKGhlGiidi2l-_c5t_JD_xmnbJd_ZdljwSnsrztCC0yq96I3DlOuFKgmANgbskGfOnqxQhWTV9oAtH2O' },
];

const SCENES = [
    { id: '1', name: '纯白摄影棚', type: 'studio', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB8kEmSMncMzi_jNq4k5k36BnIIBvHdEMOstjr762i9ew07paHcTT71KakKrxR-8JKBmX-5ucxncn6vRINxVQLA9UwRMGq8uCxSZ_ieL-dCO9Er6JGBB98nJ1o1OuYWV_8MIgNHnYm4VLbXnzHqwVjod_pf7U5z1C8LH7vLOmb1XgR0zNaPQ4O7O8uOV1h2R-KzSIjtgSUizK3nU2TntXtf_ImM9Uj8BjIbMQwOLIeW7WBnaRa6_axcqYA0tVkmnCXm7J34oR4Eqkyd' },
    { id: '2', name: '高级灰', type: 'studio', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC7idgOCgCEyuUfNlVif_amtRSNbUcJM6eP-c2h4nZqpf9BlXY5QF1AGOv1BiInu9XfgwCRHHhXkkNoyzBXv0RCfyOufdYaXJCNqoRsGvXsCkj0kobrUtxTUWKshxzADx0-73s-vXoPl_cTxkHN0PMU3DYd2rsC6aJhXet6bSG-s1f78KCHxCnyZdX5l2Tjz5Ddzo0qhQNXPJL_VtHGJXua_RrVH_xv2Wd2hA1r8JvTdeBb56xDd9Dbqo5r4uq4iHQdlmpmjH53gPLD' },
    { id: '3', name: '城市街拍', type: 'outdoor', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD85YGDkESavx2Ud5SoDb2FXUmZdHmP2rlEiWBYxIcSHAtKjCByf_VyAHhEbNfO6Gy8m6kTIf72FyKPsbD-4gmALpVzDTcmBbt-liPei0ajHZlWvvRrVfb5bG3o2vFLtfv5Vm1CgB2eRzrcfk8LKCuKnRnQiblFrpN6WsIwGaPCoVekQ9iUyTcU_qRgmkHn0YP68Fco48ELxzi_QSFqGDL5j5LqQI47z3PMQTQ-BWWsokArXbNHIjszEF7b-Qasqc9FRe5pcL2OEo0u' },
    { id: '4', name: '舒适咖啡馆', type: 'indoor', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDGGjQ06VNzEbFWkfltbOAqG92eSH_1uESH2XulPRMuUCgdLAcPDXe29qg9lQiu0R1A2i5lD7QKjiQqrR6ydMsAASUOV5rlyAvVQwUWvGICYWuQjcaaL3WcQ1jxU8FVFDLEVJHU-i0dyzsqe-zgQZuBkiWOBgYU6a76vUphrtw6OYC14O5LNYrZo1ekx298523iE9W2EIshmRbca_vJJIU2NWp79Q8DHveD6xnywftfB979BksCB4Pza0rjTJA9SyJoOwlRkB4--ujO' },
];

const POSES = [
    { id: '1', name: '正面站立', icon: 'accessibility_new' },
    { id: '2', name: '行走动态', icon: 'directions_walk' },
    { id: '3', name: '坐姿', icon: 'airline_seat_recline_normal' },
    { id: '4', name: '侧身3/4', icon: 'rotate_right' },
];

const BatchSettings: React.FC = () => {
    const navigate = useNavigate();
    const { fileList, globalSettings, updateGlobalSettings, startGeneration } = useBatch();
    const [modelType, setModelType] = useState('female');

    const handleGenerate = () => {
        startGeneration();
        navigate('/generate/batch/progress');
    };

    return (
        <div className="flex h-full overflow-hidden">
            {/* Left Sidebar: File Preview */}
            <aside className="w-[300px] xl:w-[340px] flex flex-col border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-surface-dark hidden lg:flex">
                <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center bg-white dark:bg-surface-dark z-10">
                    <div>
                        <h3 className="text-base font-bold leading-tight text-slate-900 dark:text-white">已选商品</h3>
                        <p className="text-xs text-slate-500 mt-1">{fileList.length}件商品待配置</p>
                    </div>
                    <span className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-100 px-2 py-0.5 rounded text-[10px] font-bold">就绪</span>
                </div>
                <div className="flex-1 overflow-y-auto p-3">
                    <div className="grid grid-cols-2 gap-3">
                        {fileList.map((file) => (
                            <div key={file.id} className="group relative bg-background-light dark:bg-background-dark rounded-lg p-2 border border-transparent hover:border-primary transition-all">
                                <div className="w-full aspect-[3/4] bg-gray-100 dark:bg-gray-800 rounded mb-2 relative overflow-hidden">
                                    <img src={file.previewUrl} alt={file.name} className="absolute inset-0 w-full h-full object-cover" />
                                </div>
                                <div className="flex items-center justify-between">
                                    <p className="text-xs font-medium truncate w-16 text-slate-700 dark:text-gray-300">{file.name}</p>
                                    <span className="material-symbols-outlined text-green-500 text-sm">check_circle</span>
                                </div>
                            </div>
                        ))}
                        {fileList.length === 0 && (
                            <div className="col-span-2 text-center py-8 text-xs text-gray-400">
                                未选择文件
                            </div>
                        )}
                    </div>
                </div>
            </aside>

            {/* Main Content: Settings Form */}
            <section className="flex-1 flex flex-col h-full bg-background-light dark:bg-background-dark relative">
                <div className="px-8 py-6 pb-2">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">批量生成配置</h1>
                            <p className="text-slate-500 dark:text-gray-400 mt-1">统一配置生成参数，应用于本批次所有商品。</p>
                        </div>
                    </div>
                    <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-primary p-4 rounded-r-md flex items-start gap-3 shadow-sm">
                        <span className="material-symbols-outlined text-primary">info</span>
                        <div>
                            <p className="text-sm font-medium text-blue-900 dark:text-blue-100">全局配置模式</p>
                            <p className="text-xs text-blue-700 dark:text-blue-300 mt-0.5">以下配置将应用于所有{fileList.length}件已选商品。</p>
                        </div>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto px-8 pb-32">
                    <div className="mt-6 mb-8">
                        {/* Model Selection */}
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-bold flex items-center gap-2 text-slate-900 dark:text-white">
                                <span className="flex items-center justify-center size-6 rounded-full bg-primary/20 text-primary text-sm font-bold">1</span>
                                选择模特
                            </h3>
                            <div className="bg-white dark:bg-surface-dark p-1 rounded-lg border border-gray-200 dark:border-gray-700 inline-flex">
                                <button onClick={() => setModelType('female')} className={`px-4 py-1.5 text-sm font-medium rounded transition-all ${modelType === 'female' ? 'bg-primary text-white shadow-sm' : 'text-slate-500 hover:bg-gray-50 dark:hover:bg-gray-800'}`}>女模</button>
                                <button onClick={() => setModelType('male')} className={`px-4 py-1.5 text-sm font-medium rounded transition-all ${modelType === 'male' ? 'bg-primary text-white shadow-sm' : 'text-slate-500 hover:bg-gray-50 dark:hover:bg-gray-800'}`}>男模</button>
                                <button onClick={() => setModelType('child')} className={`px-4 py-1.5 text-sm font-medium rounded transition-all ${modelType === 'child' ? 'bg-primary text-white shadow-sm' : 'text-slate-500 hover:bg-gray-50 dark:hover:bg-gray-800'}`}>童模</button>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                            {MODELS.map(model => (
                                <div
                                    key={model.id}
                                    onClick={() => updateGlobalSettings({ modelId: model.id })}
                                    className="cursor-pointer group"
                                >
                                    <div className={`relative aspect-square rounded-full overflow-hidden mb-2 transition-all ${globalSettings.modelId === model.id ? 'ring-4 ring-primary ring-offset-2 dark:ring-offset-background-dark' : 'ring-1 ring-gray-200 dark:ring-gray-700 hover:ring-primary'}`}>
                                        <img src={model.image} alt={model.name} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                                        {globalSettings.modelId === model.id && (
                                            <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                                                <span className="material-symbols-outlined text-white drop-shadow-md">check</span>
                                            </div>
                                        )}
                                    </div>
                                    <p className={`text-center text-sm ${globalSettings.modelId === model.id ? 'font-bold text-primary' : 'font-medium text-slate-500'}`}>{model.name}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <hr className="border-gray-200 dark:border-gray-800 mb-8" />

                    {/* Scene Selection */}
                    <div className="mb-8">
                        <h3 className="text-lg font-bold flex items-center gap-2 mb-4 text-slate-900 dark:text-white">
                            <span className="flex items-center justify-center size-6 rounded-full bg-primary/20 text-primary text-sm font-bold">2</span>
                            选择场景
                        </h3>
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                            {SCENES.map(scene => (
                                <div
                                    key={scene.id}
                                    onClick={() => updateGlobalSettings({ sceneId: scene.id })}
                                    className={`cursor-pointer group rounded-xl border overflow-hidden bg-white dark:bg-surface-dark transition-all
                                        ${globalSettings.sceneId === scene.id ? 'ring-2 ring-primary ring-offset-2 dark:ring-offset-background-dark border-primary' : 'border-gray-200 dark:border-gray-700 hover:border-primary'}`}
                                >
                                    <div className="h-28 bg-gray-100 dark:bg-gray-800 overflow-hidden relative">
                                        <img src={scene.image} alt={scene.name} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                                    </div>
                                    <div className="p-3 flex items-center justify-between">
                                        <span className={`text-sm ${globalSettings.sceneId === scene.id ? 'font-bold text-primary' : 'font-medium text-slate-700 dark:text-slate-300'}`}>{scene.name}</span>
                                        {globalSettings.sceneId === scene.id && <span className="material-symbols-outlined text-primary">check_circle</span>}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <hr className="border-gray-200 dark:border-gray-800 mb-8" />

                    {/* Pose Selection */}
                    <div className="mb-8">
                        <h3 className="text-lg font-bold flex items-center gap-2 mb-4 text-slate-900 dark:text-white">
                            <span className="flex items-center justify-center size-6 rounded-full bg-primary/20 text-primary text-sm font-bold">3</span>
                            选择姿势
                        </h3>
                        <div className="flex flex-wrap gap-3">
                            {POSES.map(pose => (
                                <div
                                    key={pose.id}
                                    onClick={() => updateGlobalSettings({ poseId: pose.id })}
                                    className={`px-5 py-2.5 rounded-lg border cursor-pointer transition-all flex items-center gap-2 text-sm font-medium
                                        ${globalSettings.poseId === pose.id
                                            ? 'bg-primary text-white border-primary'
                                            : 'bg-white dark:bg-surface-dark border-gray-200 dark:border-gray-700 text-slate-700 dark:text-slate-300 hover:border-primary'}`}
                                >
                                    <span className="material-symbols-outlined text-lg">{pose.icon}</span>
                                    {pose.name}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="absolute bottom-0 left-0 right-0 bg-white dark:bg-surface-dark border-t border-gray-200 dark:border-gray-800 p-6 flex items-center justify-between shadow-lg z-30">
                    <div className="hidden sm:block">
                        <p className="text-sm font-medium text-slate-900 dark:text-white">预计耗时: <span className="text-slate-500">~2分钟</span></p>
                        <p className="text-xs text-slate-500 mt-0.5">将扣除{fileList.length}点数</p>
                    </div>
                    <div className="flex items-center gap-4 w-full sm:w-auto">
                        <button
                            onClick={() => navigate('/generate/batch/upload')}
                            className="flex-1 sm:flex-none px-6 py-3 rounded-lg border border-gray-300 dark:border-gray-600 text-slate-700 dark:text-white font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                        >
                            返回
                        </button>
                        <button
                            onClick={handleGenerate}
                            disabled={!globalSettings.modelId || !globalSettings.sceneId || !globalSettings.poseId}
                            className="flex-1 sm:flex-none px-8 py-3 rounded-lg bg-primary hover:bg-sky-600 text-white font-bold shadow-lg shadow-primary/30 flex items-center justify-center gap-2 transition-all transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <span className="material-symbols-outlined">auto_awesome</span>
                            开始批量生成 ({fileList.length}张)
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default BatchSettings;
