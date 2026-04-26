import React, { useState } from 'react';
import {
  LayoutDashboard, Building2, Shield, Settings,
  ChevronLeft, ChevronRight, HeartPulse, UserCog, Building,
  ChevronDown, Users,
  BarChart3, UserCircle
} from 'lucide-react';

import type { UserRole } from '../../types/roles';

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
}

const navItems: NavItem[] = [
  // 决策层 - 局领导
  { id: 'dashboard', label: '数据概览', icon: LayoutDashboard, path: '#/dashboard', roles: ['system_admin', 'bureau_leader', 'treatment_director', 'fund_supervisor', 'medical_service_director'] },
  { id: 'reports', label: '统计报表', icon: BarChart3, path: '#/reports', roles: ['bureau_leader'] },

  // 管理层 - 三个司
  { id: 'treatment', label: '待遇保障', icon: HeartPulse, path: '#/treatment', roles: ['system_admin', 'bureau_leader', 'treatment_director'] },
  { id: 'fund-supervision', label: '基金监管', icon: Shield, path: '#/fund-supervision', roles: ['system_admin', 'bureau_leader', 'fund_supervisor'] },
  { id: 'medical-service', label: '医药服务管理', icon: Building2, path: '#/medical-service', roles: ['system_admin', 'bureau_leader', 'medical_service_director'] },

  // 执行层 - 7个业务模块工作台（登录后直接跳转，不在侧边栏显示）
  { id: 'operation-admin', label: '系统管理', icon: Settings, path: '#/workbench/operation-admin', roles: ['operation_admin'] },

  // 外部用户门户
  { id: 'institution-portal', label: '医疗机构门户', icon: Building2, path: '#/institutions', roles: ['institution_admin'] },
  { id: 'employer-portal', label: '参保单位门户', icon: Users, path: '#/employer', roles: ['employer_admin'] },
  { id: 'personal-portal', label: '个人服务大厅', icon: UserCircle, path: '#/personal', roles: ['insured_person'] },

  // 业务管理层 - 部门人员管理
  { id: 'dept-staff', label: '部门人员管理', icon: UserCog, path: '#/dept-staff', roles: ['treatment_director', 'fund_supervisor', 'medical_service_director'] },

  // 机构管理 - 系统管理员和医保局领导管理各机构经办/审核人员
  { id: 'agency-management', label: '机构管理', icon: Building, path: '#/agency-management', roles: ['system_admin', 'bureau_leader'] },


  // 系统管理 - 仅保留系统级配置
  { id: 'settings', label: '系统设置', icon: Settings, path: '#/settings', roles: ['system_admin'] },
];

const roleLabels: Record<UserRole, string> = {
  system_admin: '系统管理员',
  bureau_leader: '医保局领导',
  treatment_director: '待遇保障',
  fund_supervisor: '基金监管',
  medical_service_director: '医药服务管理',
  office_director: '办公室',
  operator: '经办人员',
  auditor_first: '初审岗',
  auditor_second: '复审岗',
  auditor_final: '终审',
  institution_admin: '医疗机构',
  employer_admin: '参保单位',
  insured_person: '参保人员'
};

interface RoleBasedSidebarProps {
  activeTab?: string;
  userRole?: UserRole;
}

export default function RoleBasedSidebar({ activeTab = 'dashboard', userRole = 'system_admin' }: RoleBasedSidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [expandedMenus, setExpandedMenus] = useState<string[]>([]);

  const filteredNavItems = navItems.filter(item => item.roles.includes(userRole));

  const toggleMenu = (id: string) => {
    setExpandedMenus(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  return (
    <aside className={`fixed left-0 top-0 h-screen bg-white border-r border-gray-200 transition-all duration-300 z-50 ${collapsed ? 'w-16' : 'w-64'}`}>
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
            <button onClick={() => setCollapsed(true)} className="p-1 rounded hover:bg-gray-100 transition-colors">
              <ChevronLeft className="w-4 h-4 text-gray-500" />
            </button>
          )}
        </div>

        {collapsed && (
          <button onClick={() => setCollapsed(false)} className="absolute -right-3 top-20 w-6 h-6 bg-[#0891B2] rounded-full flex items-center justify-center shadow-md hover:bg-[#0e7490] transition-colors">
            <ChevronRight className="w-3 h-3 text-white" />
          </button>
        )}

        <nav className="flex-1 py-4 px-2 overflow-y-auto">
          {filteredNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            const hasChildren = item.children && item.children.length > 0;
            const isExpanded = expandedMenus.includes(item.id);

            return (
              <div key={item.id}>
                <a
                  href={item.path || '#'}
                  onClick={(e) => { if (hasChildren) { e.preventDefault(); toggleMenu(item.id); } }}
                  className={`flex items-center gap-3 px-3 py-3 rounded-lg mb-1 transition-all duration-200 ${isActive ? 'bg-[#0891B2] text-white' : 'text-gray-600 hover:bg-gray-100'} ${collapsed ? 'justify-center' : ''}`}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  {!collapsed && (
                    <>
                      <span className="text-sm font-medium flex-1">{item.label}</span>
                      {hasChildren && <ChevronDown className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />}
                    </>
                  )}
                </a>
                {!collapsed && hasChildren && isExpanded && (
                  <div className="ml-4 mt-1 space-y-1">
                    {item.children?.map(child => (
                      <a key={child.id} href={child.path} className="flex items-center gap-2 px-3 py-2 rounded text-sm text-gray-500 hover:text-[#0891B2] hover:bg-gray-50 transition-colors">
                        {child.label}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-200">
          {!collapsed && (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#0891B2]/10 flex items-center justify-center">
                <UserCircle className="w-5 h-5 text-[#0891B2]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-800 truncate">{roleLabels[userRole]}</p>
                <p className="text-xs text-gray-500 truncate">{userRole}@nhis.gov.cn</p>
              </div>
            </div>
          )}
          {collapsed && (
            <div className="w-8 h-8 rounded-full bg-[#0891B2]/10 flex items-center justify-center mx-auto">
              <UserCircle className="w-5 h-5 text-[#0891B2]" />
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
