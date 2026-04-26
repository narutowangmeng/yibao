import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, User, Lock, Eye, EyeOff, ChevronRight, Building2, Users, PersonStanding, ArrowLeft, Crown, Wallet, FileCheck, Stethoscope, Settings, FileText, UserCheck, Building, Briefcase, MapPin } from 'lucide-react';
import type { UserRole } from '../types/roles';

interface LoginProps {
  onLogin: (role: UserRole, agency?: string) => void;
}

type SystemType = 'management' | 'operation' | 'portal';

const ROLE_ICONS: Record<string, React.ElementType> = {
  bureau_leader: Crown,
  treatment_director: Wallet,
  fund_supervisor: FileCheck,
  medical_service_director: Stethoscope,
  system_admin: Settings,
  operator: UserCheck,
  auditor_first: FileText,
  auditor_second: FileText,
  auditor_final: FileCheck,
  operator_claims: FileCheck,
  institution_admin: Building,
  employer_admin: Briefcase,
  insured_person: User,
};

const AGENCIES = [
  { code: 'headquarters', name: '省局' },
  { code: 'nanjing', name: '南京' },
  { code: 'suzhou', name: '苏州' },
  { code: 'wuxi', name: '无锡' },
  { code: 'changzhou', name: '常州' },
  { code: 'zhenjiang', name: '镇江' },
  { code: 'nantong', name: '南通' },
  { code: 'taizhou', name: '泰州' },
  { code: 'yangzhou', name: '扬州' },
  { code: 'yancheng', name: '盐城' },
  { code: 'huaian', name: '淮安' },
  { code: 'suqian', name: '宿迁' },
  { code: 'lianyungang', name: '连云港' },
  { code: 'xuzhou', name: '徐州' },
];

const OPERATION_AGENCIES = AGENCIES.filter((agency) => agency.code !== 'headquarters');

const SYSTEMS = [
  {
    id: 'management' as SystemType,
    name: '管理系统',
    subtitle: 'Management System',
    desc: '医保局内部管理使用',
    icon: Building2,
    color: 'from-blue-500 to-indigo-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    hoverBorder: 'hover:border-blue-400',
    needAgency: true,
    roles: [
      { code: 'bureau_leader' as UserRole, name: '报表中心', desc: '进入医保报表中心，查看全局统计、专题分析和监管报表' },
      { code: 'treatment_director' as UserRole, name: '待遇保障司', desc: '待遇政策、险种管理' },
      { code: 'fund_supervisor' as UserRole, name: '基金监管司', desc: '基金监管、违规查处' },
      { code: 'medical_service_director' as UserRole, name: '医药服务管理司', desc: '医药价格、目录管理' },
      { code: 'system_admin' as UserRole, name: '系统管理员', desc: '系统配置、用户管理' },
    ]
  },
  {
    id: 'operation' as SystemType,
    name: '经办系统',
    subtitle: 'Operation System',
    desc: '业务经办人员使用',
    icon: Users,
    color: 'from-cyan-500 to-teal-600',
    bgColor: 'bg-cyan-50',
    borderColor: 'border-cyan-200',
    hoverBorder: 'hover:border-cyan-400',
    needAgency: true,
    roles: [
      { code: 'operator_enrollment' as UserRole, name: '参保登记', desc: '参保登记、信息变更、关系转移' },
      { code: 'operator_payment' as UserRole, name: '缴费核定', desc: '缴费基数核定、费用计算、催缴管理' },
      { code: 'operator_reimbursement' as UserRole, name: '费用报销', desc: '医疗费用报销申请受理、材料初审' },
      { code: 'operator_claims' as UserRole, name: '理赔管理', desc: '申报受理、人工审核、结算审核、支付指令、机构对账、异常处理' },
      { code: 'auditor_audit' as UserRole, name: '费用审核', desc: '医疗费用审核、合规性检查、异常处理' },
      { code: 'auditor_settlement' as UserRole, name: '基金结算', desc: '基金结算、拨付管理、对账处理' },
      { code: 'finance_manager' as UserRole, name: '财务管理', desc: '自动对账、总账管理、基金报表' },
      { code: 'auditor_inspection' as UserRole, name: '稽核检查', desc: '稽核检查、违规查处、飞行检查' },
      { code: 'employer_management' as UserRole, name: '参保单位管理', desc: '单位参保管理、员工增减员、缴费申报' },
      { code: 'operation_admin' as UserRole, name: '系统管理', desc: '系统配置、人员管理、权限分配' },
    ]
  },
  {
    id: 'portal' as SystemType,
    name: '门户网站',
    subtitle: 'Portal System',
    desc: '对外服务门户',
    icon: PersonStanding,
    color: 'from-emerald-500 to-green-600',
    bgColor: 'bg-emerald-50',
    borderColor: 'border-emerald-200',
    hoverBorder: 'hover:border-emerald-400',
    needAgency: false,
    roles: [
      { code: 'institution_admin' as UserRole, name: '医疗机构', desc: '机构业务、结算申请' },
      { code: 'employer_admin' as UserRole, name: '参保单位', desc: '单位参保、员工管理' },
      { code: 'insured_person' as UserRole, name: '参保人员', desc: '个人查询、业务办理' },
    ]
  }
];

export default function Login({ onLogin }: LoginProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedSystem, setSelectedSystem] = useState<SystemType | null>(null);
  const [selectedAgency, setSelectedAgency] = useState<string>('headquarters');

  // 从URL参数读取系统类型
  React.useEffect(() => {
    const hash = window.location.hash;
    const match = hash.match(/\?system=(management|operation|portal)/);
    if (match) {
      setSelectedSystem(match[1] as SystemType);
    }
  }, []);

  const handleSystemSelect = (systemId: SystemType) => {
    setSelectedSystem(systemId);
    if (systemId === 'operation' && selectedAgency === 'headquarters') {
      setSelectedAgency('nanjing');
    }
    // 清除URL参数
    window.location.hash = '';
  };

  const handleBack = () => {
    setSelectedSystem(null);
    setSelectedAgency('headquarters');
  };

  const handleRoleLogin = (role: UserRole) => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onLogin(role, selectedAgency);
    }, 500);
  };

  const handlePasswordLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onLogin('bureau_leader', selectedAgency);
    }, 1000);
  };

  const currentSystem = SYSTEMS.find(s => s.id === selectedSystem);
  const currentAgency = AGENCIES.find(a => a.code === selectedAgency);
  const visibleAgencies = selectedSystem === 'operation' ? OPERATION_AGENCIES : AGENCIES;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-gray-200 flex items-center justify-center p-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-6xl"
      >
        <AnimatePresence mode="wait">
          {!selectedSystem ? (
            <motion.div
              key="systems"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center"
            >
              <div className="mb-12">
                <div className="w-24 h-24 bg-white rounded-3xl shadow-xl flex items-center justify-center mx-auto mb-8">
                  <Shield className="w-12 h-12 text-cyan-600" />
                </div>
                <h1 className="text-5xl font-bold text-gray-800 mb-4">医保管理平台</h1>
                <p className="text-xl text-gray-500">Medical Insurance Management Platform</p>
              </div>

              <div className="grid grid-cols-3 gap-8">
                {SYSTEMS.map((system, index) => {
                  const Icon = system.icon;
                  return (
                    <motion.button
                      key={system.id}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      onClick={() => handleSystemSelect(system.id)}
                      className="group relative bg-white rounded-3xl p-12 shadow-xl hover:shadow-2xl transition-all duration-300 border-2 border-gray-100 hover:border-cyan-300"
                    >
                      <div className={`w-24 h-24 rounded-3xl ${system.bgColor} flex items-center justify-center mx-auto mb-8 group-hover:scale-110 transition-transform duration-300`}>
                        <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${system.color} flex items-center justify-center`}>
                          <Icon className="w-8 h-8 text-white" />
                        </div>
                      </div>
                      <h2 className="text-3xl font-bold text-gray-800 mb-3">{system.name}</h2>
                      <p className="text-base text-gray-400 mb-3">{system.subtitle}</p>
                      <p className="text-gray-500 text-lg">{system.desc}</p>
                      <div className="mt-8 flex items-center justify-center gap-2 text-cyan-600 font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                        <span>进入系统</span>
                        <ChevronRight className="w-5 h-5" />
                      </div>
                    </motion.button>
                  );
                })}
              </div>

              <div className="mt-16 flex items-center justify-center gap-8 text-gray-400">
                <button className="hover:text-gray-600 transition-colors">帮助中心</button>
                <span className="w-px h-4 bg-gray-300" />
                <button className="hover:text-gray-600 transition-colors">联系客服</button>
                <span className="w-px h-4 bg-gray-300" />
                <span>© 2025 医疗保障局</span>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="roles"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="bg-white rounded-3xl shadow-2xl p-12 max-w-5xl mx-auto"
            >
              <div className="text-center mb-10">
                <div className="flex items-center justify-between mb-6">
                  <button
                    onClick={handleBack}
                    className="flex items-center gap-2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <ArrowLeft className="w-5 h-5" />
                    <span>返回</span>
                  </button>
                  <div />
                </div>
                <div className={`w-20 h-20 rounded-3xl ${currentSystem?.bgColor} flex items-center justify-center mx-auto mb-6`}>
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${currentSystem?.color} flex items-center justify-center`}>
                    {currentSystem && <currentSystem.icon className="w-7 h-7 text-white" />}
                  </div>
                </div>
                <h2 className="text-4xl font-bold text-gray-800 mb-3">{currentSystem?.name}</h2>
                <p className="text-lg text-gray-500 mb-6">{currentSystem?.subtitle}</p>

                {currentSystem?.needAgency && (
                  <div className="inline-flex items-center gap-3 bg-gray-50 rounded-2xl p-2 pr-4">
                    <MapPin className="w-5 h-5 text-gray-400 ml-3" />
                    <select
                      value={selectedAgency}
                      onChange={(e) => setSelectedAgency(e.target.value)}
                      className="bg-transparent text-gray-700 font-medium py-2 pr-8 focus:outline-none cursor-pointer min-w-[200px]"
                    >
                      {visibleAgencies.map((agency) => (
                        <option key={agency.code} value={agency.code}>
                          {agency.name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              <div className={`grid gap-6 ${currentSystem?.roles.length === 3 ? 'grid-cols-3' : currentSystem?.roles.length === 4 ? 'grid-cols-2' : 'grid-cols-3'}`}>
                {currentSystem?.roles.map((role, index) => {
                  const RoleIcon = ROLE_ICONS[role.code] || User;
                  return (
                    <motion.button
                      key={role.code}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.08 }}
                      onClick={() => handleRoleLogin(role.code)}
                      disabled={isLoading}
                      className={`group relative bg-white rounded-2xl p-8 border-2 ${currentSystem?.borderColor} ${currentSystem?.hoverBorder} hover:shadow-xl transition-all duration-300 text-left`}
                    >
                      <div className={`w-16 h-16 rounded-2xl ${currentSystem?.bgColor} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${currentSystem?.color} flex items-center justify-center`}>
                          <RoleIcon className="w-6 h-6 text-white" />
                        </div>
                      </div>
                      <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-gray-900">{role.name}</h3>
                      <p className="text-gray-500 text-sm">{role.desc}</p>
                      <div className="absolute top-8 right-8 opacity-0 group-hover:opacity-100 transition-opacity">
                        <ChevronRight className={`w-6 h-6 ${currentSystem?.color.replace('from-', 'text-').split(' ')[0].replace('to-', '')}`} />
                      </div>
                    </motion.button>
                  );
                })}
              </div>

              <div className="mt-12 pt-10 border-t border-gray-100">
                <form onSubmit={handlePasswordLogin} className="max-w-2xl mx-auto">
                  <div className="flex items-center gap-3">
                    <div className="relative flex-1">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                        placeholder="用户名"
                      />
                    </div>
                    <div className="relative flex-1">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full pl-12 pr-10 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                        placeholder="密码"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="px-8 py-3 bg-cyan-600 text-white rounded-xl font-medium hover:bg-cyan-700 disabled:bg-gray-300 transition-colors whitespace-nowrap"
                    >
                      {isLoading ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto" />
                      ) : (
                        '登录'
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
