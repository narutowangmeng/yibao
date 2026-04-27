import React, { useState } from 'react';
import { Search, Bell, User, ChevronDown, LogOut, Settings } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { UserRole } from '../../types/roles';

interface HeaderProps {
  title: string;
  theme: 'light' | 'dark';
  userRole?: UserRole;
  userAgency?: string;
  userOperatorIdentity?: '经办' | '审核';
  onLogout?: () => void;
}

const ROLE_NAMES: Record<string, string> = {
  system_admin: '系统管理员',
  bureau_leader: '医保局领导',
  treatment_director: '待遇保障',
  fund_supervisor: '基金监管',
  medical_service_director: '医药服务管理',
  office_director: '办公室',
  operator: '经办人员',
  operator_enrollment: '参保登记',
  operator_contribution: '缴费',
  operator_payment: '缴费核定',
  operator_reimbursement: '费用报销',
  operator_claims: '理赔管理',
  auditor_first: '初审岗',
  auditor_second: '复审岗',
  auditor_final: '终审',
  auditor_audit: '费用审核',
  auditor_settlement: '基金结算',
  auditor_inspection: '稽核检查',
  operation_admin: '系统管理',
  employer_management: '参保单位管理',
  institution_admin: '医疗机构',
  employer_admin: '参保单位',
  insured_person: '参保人员',
};

const AGENCY_NAMES: Record<string, string> = {
  headquarters: '省局',
  nanjing: '南京',
  suzhou: '苏州',
  wuxi: '无锡',
  changzhou: '常州',
  zhenjiang: '镇江',
  nantong: '南通',
  taizhou: '泰州',
  yangzhou: '扬州',
  yancheng: '盐城',
  huaian: '淮安',
  suqian: '宿迁',
  lianyungang: '连云港',
  xuzhou: '徐州',
};

const OPERATION_ROLES: UserRole[] = [
  'operator_enrollment',
  'operator_contribution',
  'operator_payment',
  'operator_reimbursement',
  'operator_claims',
  'auditor_audit',
  'auditor_settlement',
  'auditor_inspection',
  'employer_management',
  'operation_admin',
];

export const Header: React.FC<HeaderProps> = ({
  title,
  theme,
  userRole,
  userAgency,
  userOperatorIdentity,
  onLogout,
}) => {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');

  const isDark = theme === 'dark';
  const bgColor = isDark ? 'bg-slate-900' : 'bg-white';
  const textColor = isDark ? 'text-slate-100' : 'text-slate-800';
  const borderColor = isDark ? 'border-slate-700' : 'border-slate-200';
  const inputBg = isDark ? 'bg-slate-800' : 'bg-slate-50';

  const agencyName = userAgency && AGENCY_NAMES[userAgency] ? AGENCY_NAMES[userAgency] : '省局';
  const roleName = userRole && ROLE_NAMES[userRole] ? ROLE_NAMES[userRole] : '管理员';

  const displayName =
    userRole && ['institution_admin', 'employer_admin', 'insured_person'].includes(userRole)
      ? userRole === 'institution_admin'
        ? '南京市第一医院'
        : userRole === 'employer_admin'
          ? '某某科技有限公司'
          : '张三'
      : userRole && OPERATION_ROLES.includes(userRole)
        ? `${agencyName}${userOperatorIdentity || '经办'}${roleName}`
        : `${agencyName} · ${roleName}`;

  return (
    <header className={`sticky top-0 z-50 flex h-16 items-center justify-between border-b px-6 ${bgColor} ${borderColor}`}>
      <h1 className={`text-xl font-semibold ${textColor}`}>{title}</h1>

      <div className="flex items-center gap-4">
        <div className={`flex w-64 items-center gap-2 rounded-lg px-3 py-2 ${inputBg}`}>
          <Search size={18} className={isDark ? 'text-slate-400' : 'text-slate-500'} />
          <input
            type="text"
            placeholder="搜索..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className={`w-full bg-transparent text-sm outline-none ${textColor} placeholder:text-slate-400`}
          />
        </div>

        <button className={`relative rounded-lg p-2 transition-colors ${isDark ? 'hover:bg-slate-800' : 'hover:bg-slate-100'}`}>
          <Bell size={20} className={isDark ? 'text-slate-300' : 'text-slate-600'} />
          <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-red-500" />
        </button>

        <div className="relative">
          <button
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            className={`flex items-center gap-2 rounded-lg p-2 transition-colors ${isDark ? 'hover:bg-slate-800' : 'hover:bg-slate-100'}`}
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500 to-teal-600">
              <User size={16} className="text-white" />
            </div>
            <span className={`text-sm font-medium ${textColor}`}>{displayName}</span>
            <ChevronDown size={16} className={isDark ? 'text-slate-400' : 'text-slate-500'} />
          </button>

          <AnimatePresence>
            {isUserMenuOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className={`absolute right-0 top-full mt-2 w-48 rounded-lg border py-2 shadow-lg ${borderColor} ${isDark ? 'bg-slate-800' : 'bg-white'}`}
              >
                <button className={`flex w-full items-center gap-3 px-4 py-2 text-sm transition-colors ${textColor} ${isDark ? 'hover:bg-slate-700' : 'hover:bg-slate-50'}`}>
                  <Settings size={16} />
                  系统设置
                </button>
                <button
                  onClick={onLogout}
                  className={`flex w-full items-center gap-3 px-4 py-2 text-sm text-red-500 transition-colors ${isDark ? 'hover:bg-slate-700' : 'hover:bg-slate-50'}`}
                >
                  <LogOut size={16} />
                  退出登录
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
};
