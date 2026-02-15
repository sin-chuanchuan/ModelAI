export interface MenuItem {
    icon: string;
    label: string;
    path: string;
}

export const SIDEBAR_MENU_ITEMS: MenuItem[] = [
    { icon: 'dashboard', label: '工作台', path: '/projects' },
    { icon: 'folder_open', label: '素材库', path: '/materials' },
    { icon: 'people', label: '团队管理', path: '/team' },
    { icon: 'account_balance_wallet', label: '费用中心', path: '/billing' },
];

export const BRAND_CONFIG = {
    name: 'ModelAI',
    description: 'AI 电商模特生成',
    primaryColor: '#0da6f2',
};
