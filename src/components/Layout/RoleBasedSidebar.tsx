import React, { useState } from 'react';
import {
  BarChart3,
  Building,
  Building2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  HeartPulse,
  LayoutDashboard,
  Settings,
  Shield,
  Store,
  UserCircle,
  UserCog,
  Users,
} from 'lucide-react';

import type { UserRole } from '../../types/roles';
import { canAccessManagementPage, type ManagementPageKey } from '../../config/managementPermissions';

export type { UserRole };

interface SubMenuItem {
  id: string;
  label: string;
  path: string;
}

interface NavItem {
  id: string;
  label: string;
  icon: React.ElementType;
  path?: string;
  children?: SubMenuItem[];
  roles: UserRole[];
  managementPageKey?: ManagementPageKey;
}

const navItems: NavItem[] = [
  {
    id: 'dashboard',
    label: '数据概览',
    icon: LayoutDashboard,
    path: '#/dashboard',
    roles: ['system_admin', 'bureau_leader', 'treatment_director', 'fund_supervisor', 'medical_service_director'],
    managementPageKey: 'dashboard',
  },
  {
    id: 'reports',
    label: '统计报表',
    icon: BarChart3,
    path: '#/reports',
    roles: ['bureau_leader'],
    managementPageKey: 'reports',
  },
  {
    id: 'treatment',
    label: '待遇保障',
    icon: HeartPulse,
    path: '#/treatment',
    roles: ['system_admin', 'bureau_leader', 'treatment_director'],
    managementPageKey: 'treatment',
  },
  {
    id: 'fund-supervision',
    label: '基金监管',
    icon: Shield,
    path: '#/fund-supervision',
    roles: ['system_admin', 'bureau_leader', 'fund_supervisor'],
    managementPageKey: 'fund-supervision',
  },
  {
    id: 'medical-service',
    label: '医药服务管理',
    icon: Building2,
    path: '#/medical-service',
    roles: ['system_admin', 'bureau_leader', 'medical_service_director'],
    managementPageKey: 'medical-service',
  },
  {
    id: 'dept-staff',
    label: '部门人员管理',
    icon: UserCog,
    path: '#/dept-staff',
    roles: ['treatment_director', 'fund_supervisor', 'medical_service_director'],
    managementPageKey: 'dept-staff',
  },
  {
    id: 'agency-management',
    label: '机构管理',
    icon: Building,
    path: '#/agency-management',
    roles: ['system_admin', 'bureau_leader'],
    managementPageKey: 'agency-management',
  },
  {
    id: 'settings',
    label: '系统设置',
    icon: Settings,
    path: '#/settings',
    roles: ['system_admin'],
    managementPageKey: 'settings',
  },
  {
    id: 'institution-portal',
    label: '医疗机构门户',
    icon: Building2,
    path: '#/institutions',
    roles: ['institution_admin', 'institution_hospital'],
  },
  {
    id: 'pharmacy-portal',
    label: '药店门户',
    icon: Store,
    path: '#/institutions',
    roles: ['institution_pharmacy'],
  },
  {
    id: 'employer-portal',
    label: '参保单位门户',
    icon: Users,
    path: '#/employer',
    roles: ['employer_admin'],
  },
  {
    id: 'personal-portal',
    label: '个人服务大厅',
    icon: UserCircle,
    path: '#/personal',
    roles: ['insured_person'],
  },
];

const roleLabels: Partial<Record<UserRole, string>> = {
  system_admin: '系统管理员',
  bureau_leader: '医保局领导',
  treatment_director: '待遇保障司',
  fund_supervisor: '基金监管司',
  medical_service_director: '医药服务管理司',
  office_director: '办公室',
  operator: '经办人员',
  auditor_first: '初审岗',
  auditor_second: '复审岗',
  auditor_final: '终审岗',
  institution_admin: '医疗机构',
  institution_hospital: '医院端',
  institution_pharmacy: '药店端',
  employer_admin: '参保单位',
  insured_person: '参保人员',
};

interface RoleBasedSidebarProps {
  activeTab?: string;
  userRole?: UserRole;
  userAgency?: string;
}

export default function RoleBasedSidebar({
  activeTab = 'dashboard',
  userRole = 'system_admin',
  userAgency = 'headquarters',
}: RoleBasedSidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [expandedMenus, setExpandedMenus] = useState<string[]>([]);
  const [message, setMessage] = useState('');

  const filteredNavItems = navItems.filter((item) => item.roles.includes(userRole));

  const toggleMenu = (id: string) => {
    setExpandedMenus((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));
  };

  return (
    <aside className={`fixed left-0 top-0 z-50 h-screen border-r border-gray-200 bg-white transition-all duration-300 ${collapsed ? 'w-16' : 'w-64'}`}>
      <div className="flex h-full flex-col">
        <div className="flex h-16 items-center justify-between border-b border-gray-200 px-4">
          {!collapsed && (
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#0891B2]">
                <HeartPulse className="h-5 w-5 text-white" />
              </div>
              <span className="text-sm font-semibold text-gray-800">医保管理平台</span>
            </div>
          )}
          {collapsed && (
            <div className="mx-auto flex h-8 w-8 items-center justify-center rounded-lg bg-[#0891B2]">
              <HeartPulse className="h-5 w-5 text-white" />
            </div>
          )}
          {!collapsed && (
            <button onClick={() => setCollapsed(true)} className="rounded p-1 transition-colors hover:bg-gray-100">
              <ChevronLeft className="h-4 w-4 text-gray-500" />
            </button>
          )}
        </div>

        {collapsed && (
          <button onClick={() => setCollapsed(false)} className="absolute -right-3 top-20 flex h-6 w-6 items-center justify-center rounded-full bg-[#0891B2] shadow-md transition-colors hover:bg-[#0e7490]">
            <ChevronRight className="h-3 w-3 text-white" />
          </button>
        )}

        <nav className="flex-1 overflow-y-auto px-2 py-4">
          {message && !collapsed && <div className="mb-3 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-700">{message}</div>}
          {filteredNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            const hasChildren = Boolean(item.children?.length);
            const isExpanded = expandedMenus.includes(item.id);
            const canAccessItem = item.managementPageKey
              ? canAccessManagementPage(userRole, userAgency, item.managementPageKey)
              : true;
            const showBlockedState = Boolean(item.managementPageKey) && !canAccessItem;

            return (
              <div key={item.id}>
                <a
                  href={item.path || '#'}
                  onClick={(event) => {
                    if (hasChildren) {
                      event.preventDefault();
                      toggleMenu(item.id);
                      return;
                    }
                    if (!canAccessItem) {
                      event.preventDefault();
                      setMessage('当前账号无权限访问该页面');
                    }
                  }}
                  className={`mb-1 flex items-center gap-3 rounded-lg px-3 py-3 transition-all duration-200 ${
                    isActive ? 'bg-[#0891B2] text-white' : showBlockedState ? 'text-gray-400 hover:bg-gray-50' : 'text-gray-600 hover:bg-gray-100'
                  } ${collapsed ? 'justify-center' : ''}`}
                >
                  <Icon className="h-5 w-5 flex-shrink-0" />
                  {!collapsed && (
                    <>
                      <span className="flex-1 text-sm font-medium">{item.label}</span>
                      {showBlockedState && <span className="text-xs text-rose-500">无权限</span>}
                      {hasChildren && <ChevronDown className={`h-4 w-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />}
                    </>
                  )}
                </a>
                {!collapsed && hasChildren && isExpanded && (
                  <div className="ml-4 mt-1 space-y-1">
                    {item.children?.map((child) => (
                      <a key={child.id} href={child.path} className="flex items-center gap-2 rounded px-3 py-2 text-sm text-gray-500 transition-colors hover:bg-gray-50 hover:text-[#0891B2]">
                        {child.label}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        <div className="border-t border-gray-200 p-4">
          {!collapsed && (
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#0891B2]/10">
                <UserCircle className="h-5 w-5 text-[#0891B2]" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-gray-800">{roleLabels[userRole] || userRole}</p>
                <p className="truncate text-xs text-gray-500">{userRole}@nhis.gov.cn</p>
              </div>
            </div>
          )}
          {collapsed && (
            <div className="mx-auto flex h-8 w-8 items-center justify-center rounded-full bg-[#0891B2]/10">
              <UserCircle className="h-5 w-5 text-[#0891B2]" />
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
