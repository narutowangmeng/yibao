import React, { useState } from 'react';
import {
  LayoutDashboard,
  Users,
  FileText,
  CreditCard,
  Building2,
  Shield,
  Settings,
  ChevronLeft,
  ChevronRight,
  HeartPulse
} from 'lucide-react';

interface NavItem {
  id: string;
  label: string;
  icon: React.ElementType;
  path: string;
}

const navItems: NavItem[] = [
  { id: 'dashboard', label: '仪表盘', icon: LayoutDashboard, path: '#/dashboard' },
  { id: 'insured', label: '参保管理', icon: Users, path: '#/insured' },
  { id: 'reimbursement', label: '报销管理', icon: FileText, path: '#/reimbursement' },
  { id: 'payment', label: '缴费管理', icon: CreditCard, path: '#/payment' },
  { id: 'institutions', label: '医疗机构', icon: Building2, path: '#/institutions' },
  { id: 'supervision', label: '基金监管', icon: Shield, path: '#/supervision' },
  { id: 'settings', label: '系统设置', icon: Settings, path: '#/settings' },
];

interface SidebarProps {
  activeTab?: string;
}

export default function Sidebar({ activeTab = 'dashboard' }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={`fixed left-0 top-0 h-screen bg-white border-r border-gray-200 transition-all duration-300 z-50 ${
        collapsed ? 'w-16' : 'w-64'
      }`}
    >
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
          {!collapsed && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#0891B2] flex items-center justify-center">
                <HeartPulse className="w-5 h-5 text-white" />
              </div>
              <span className="font-semibold text-gray-800 text-sm">医保管理平台</span>
            </div>
          )}
          {collapsed && (
            <div className="w-8 h-8 rounded-lg bg-[#0891B2] flex items-center justify-center mx-auto">
              <HeartPulse className="w-5 h-5 text-white" />
            </div>
          )}
          {!collapsed && (
            <button
              onClick={() => setCollapsed(true)}
              className="p-1 rounded hover:bg-gray-100 transition-colors"
            >
              <ChevronLeft className="w-4 h-4 text-gray-500" />
            </button>
          )}
        </div>

        {collapsed && (
          <button
            onClick={() => setCollapsed(false)}
            className="absolute -right-3 top-20 w-6 h-6 bg-[#0891B2] rounded-full flex items-center justify-center shadow-md hover:bg-[#0e7490] transition-colors"
          >
            <ChevronRight className="w-3 h-3 text-white" />
          </button>
        )}

        <nav className="flex-1 py-4 px-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <a
                key={item.id}
                href={item.path}
                className={`flex items-center gap-3 px-3 py-3 rounded-lg mb-1 transition-all duration-200 ${
                  isActive
                    ? 'bg-[#0891B2] text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                } ${collapsed ? 'justify-center' : ''}`}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {!collapsed && <span className="text-sm font-medium">{item.label}</span>}
              </a>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-200">
          {!collapsed && (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                <span className="text-xs font-medium text-gray-600">管</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-800 truncate">管理员</p>
                <p className="text-xs text-gray-500 truncate">admin@nhis.gov.cn</p>
              </div>
            </div>
          )}
          {collapsed && (
            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center mx-auto">
              <span className="text-xs font-medium text-gray-600">管</span>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
