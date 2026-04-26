import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, CheckCircle, XCircle, AlertTriangle, FileText, BarChart3, Search, Filter, Users, Settings, ClipboardCheck, RotateCcw, ArrowRight, Wallet, Scale, BookOpen, TrendingUp } from 'lucide-react';
import FirstAudit from './modules/FirstAudit';
import SecondAudit from './modules/SecondAudit';
import FinalAudit from './modules/FinalAudit';
import BatchAudit from './modules/BatchAudit';
import RuleCheck from './modules/RuleCheck';
import ExceptionHandle from './modules/ExceptionHandle';
import AuditQuery from './modules/AuditQuery';
import AuditReport from './modules/AuditReport';

const modules = [
  { id: 'first', title: '初审审核', icon: Eye, desc: '报销申请初审', color: 'from-blue-500 to-blue-600', component: FirstAudit },
  { id: 'second', title: '复审审核', icon: ClipboardCheck, desc: '初审结果复核', color: 'from-cyan-500 to-cyan-600', component: SecondAudit },
  { id: 'final', title: '终审审核', icon: CheckCircle, desc: '最终审批确认', color: 'from-emerald-500 to-emerald-600', component: FinalAudit },
  { id: 'batch', title: '批量审核', icon: Users, desc: '批量处理申请', color: 'from-purple-500 to-purple-600', component: BatchAudit },
  { id: 'rule', title: '规则校验', icon: Settings, desc: '智能规则检查', color: 'from-orange-500 to-orange-600', component: RuleCheck },
  { id: 'exception', title: '异常处理', icon: AlertTriangle, desc: '异常单据处理', color: 'from-red-500 to-red-600', component: ExceptionHandle },
  { id: 'query', title: '审核查询', icon: Search, desc: '历史审核查询', color: 'from-indigo-500 to-indigo-600', component: AuditQuery },
  { id: 'report', title: '统计报表', icon: BarChart3, desc: '审核数据统计', color: 'from-teal-500 to-teal-600', component: AuditReport },
  { id: 'finance', title: '财务管理', icon: Wallet, desc: '自动对账、总账管理', color: 'from-amber-500 to-amber-600', component: null },
];

export default function AuditWorkbench() {
  const [selectedModule, setSelectedModule] = useState<string | null>(null);

  const renderModule = () => {
    if (!selectedModule) return null;
    const module = modules.find(m => m.id === selectedModule);
    if (!module) return null;
    if (module.id === 'finance') {
      return (
        <div className="p-6">
          <div className="flex items-center gap-4 mb-6">
            <button onClick={() => setSelectedModule(null)} className="p-2 hover:bg-gray-100 rounded-lg">
              <ArrowRight className="w-5 h-5 rotate-180" />
            </button>
            <h3 className="text-xl font-bold">财务管理</h3>
          </div>
          <div className="grid grid-cols-3 gap-6">
            <div className="bg-white rounded-xl p-6 border border-amber-200 hover:shadow-lg cursor-pointer" onClick={() => alert('自动对账功能')}>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center mb-4">
                <Scale className="w-6 h-6 text-white" />
              </div>
              <h4 className="font-bold text-lg mb-2">自动对账</h4>
              <p className="text-sm text-gray-500">对账规则配置与执行</p>
            </div>
            <div className="bg-white rounded-xl p-6 border border-amber-200 hover:shadow-lg cursor-pointer" onClick={() => alert('总账管理功能')}>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center mb-4">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <h4 className="font-bold text-lg mb-2">总账管理</h4>
              <p className="text-sm text-gray-500">科目管理与明细查询</p>
            </div>
            <div className="bg-white rounded-xl p-6 border border-amber-200 hover:shadow-lg cursor-pointer" onClick={() => alert('基金报表功能')}>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <h4 className="font-bold text-lg mb-2">基金报表</h4>
              <p className="text-sm text-gray-500">财务报表生成与分析</p>
            </div>
          </div>
        </div>
      );
    }
    if (!module.component) return null;
    const Component = module.component;
    return <Component onClose={() => setSelectedModule(null)} onBack={() => setSelectedModule(null)} />;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">费用审核工作台</h2>
          <p className="text-sm text-gray-500 mt-1">报销申请多级审核管理</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-800">审核流程</h3>
          <div className="flex items-center gap-3 text-sm text-gray-500">
            <span className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-blue-500"></div>初审</span>
            <span className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-cyan-500"></div>复审</span>
            <span className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-emerald-500"></div>终审</span>
          </div>
        </div>
        <div className="flex items-center gap-6">
          {['提交申请', '初审审核', '复审审核', '终审审批', '拨付结算'].map((step, i) => (
            <React.Fragment key={step}>
              <div className="flex flex-col items-center">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white font-bold text-lg ${i < 3 ? 'bg-gradient-to-br from-cyan-500 to-cyan-600 shadow-lg' : 'bg-gray-300'}`}>
                  {i + 1}
                </div>
                <span className="text-sm text-gray-600 mt-2 font-medium">{step}</span>
              </div>
              {i < 4 && <div className="flex-1 h-2 bg-gray-200 rounded-full max-w-[100px]"><div className={`h-full bg-gradient-to-r from-cyan-500 to-cyan-600 rounded-full ${i < 2 ? 'w-full' : 'w-1/2'}`}></div></div>}
            </React.Fragment>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-4 gap-6">
        {modules.map((module, index) => {
          const Icon = module.icon;
          return (
            <motion.button
              key={module.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => setSelectedModule(module.id)}
              className="group bg-white rounded-2xl p-8 shadow-md border border-gray-200 hover:shadow-xl hover:border-cyan-400 hover:-translate-y-1 transition-all text-left"
            >
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${module.color} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform shadow-lg`}>
                <Icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-bold text-xl text-gray-800 mb-2">{module.title}</h3>
              <p className="text-base text-gray-500 mb-4">{module.desc}</p>
              <div className="flex items-center text-cyan-600 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                <span>进入办理</span>
                <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </div>
            </motion.button>
          );
        })}
      </div>

      <AnimatePresence>
        {selectedModule && (
          <motion.div
            key="module"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedModule(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-auto"
              onClick={e => e.stopPropagation()}
            >
              {renderModule()}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
