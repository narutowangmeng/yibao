import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wallet, CreditCard, CheckCircle, Clock, AlertCircle, Search, Filter, Download, Eye, FileText, TrendingUp, History, Settings, ArrowRight, Building2, Calendar, DollarSign, ArrowLeft } from 'lucide-react';
import SettlementApply from './modules/SettlementApply';
import SettlementAudit from './modules/SettlementAudit';
import PaymentManage from './modules/PaymentManage';
import ReconcileProcess from './modules/ReconcileProcess';
import SettlementQuery from './modules/SettlementQuery';
import SettlementStats from './modules/SettlementStats';
import SettlementException from './modules/SettlementException';
import SettlementHistory from './modules/SettlementHistory';

const modules = [
  { id: 'apply', title: '结算申请', icon: FileText, desc: '医疗机构提交结算申请', color: 'from-blue-500 to-blue-600', component: SettlementApply },
  { id: 'audit', title: '结算审核', icon: CheckCircle, desc: '审核结算单据和金额', color: 'from-emerald-500 to-emerald-600', component: SettlementAudit },
  { id: 'payment', title: '拨付管理', icon: CreditCard, desc: '基金拨付和资金划转', color: 'from-purple-500 to-purple-600', component: PaymentManage },
  { id: 'reconcile', title: '对账处理', icon: TrendingUp, desc: '银行税务对账核对', color: 'from-cyan-500 to-cyan-600', component: ReconcileProcess },
  { id: 'query', title: '结算查询', icon: Search, desc: '查询结算状态和明细', color: 'from-orange-500 to-orange-600', component: SettlementQuery },
  { id: 'stats', title: '结算统计', icon: TrendingUp, desc: '结算数据统计分析', color: 'from-pink-500 to-pink-600', component: SettlementStats },
  { id: 'exception', title: '异常处理', icon: AlertCircle, desc: '处理结算异常情况', color: 'from-red-500 to-red-600', component: SettlementException },
  { id: 'history', title: '历史记录', icon: History, desc: '查看历史结算记录', color: 'from-gray-500 to-gray-600', component: SettlementHistory },
];

export default function FundSettlementWorkbench() {
  const [selectedModule, setSelectedModule] = useState<string | null>(null);

  const renderModule = () => {
    if (!selectedModule) return null;
    const module = modules.find(m => m.id === selectedModule);
    if (!module || !module.component) return null;
    const Component = module.component;
    return <Component onClose={() => setSelectedModule(null)} onBack={() => setSelectedModule(null)} />;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">基金结算工作台</h2>
          <p className="text-sm text-gray-500 mt-1">医保基金结算与拨付管理</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-800">结算流程</h3>
          <div className="flex items-center gap-3 text-sm text-gray-500">
            <span className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-blue-500"></div>初审</span>
            <span className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-cyan-500"></div>复审</span>
            <span className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-emerald-500"></div>终审</span>
          </div>
        </div>
        <div className="flex items-center gap-6">
          {['申请提交', '初审审核', '复审确认', '财务拨付', '银行到账'].map((step, i) => (
            <React.Fragment key={step}>
              <div className="flex flex-col items-center">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white font-bold text-lg ${i <= 2 ? 'bg-gradient-to-br from-cyan-500 to-cyan-600 shadow-lg' : 'bg-gray-300'}`}>
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
