import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calculator, Calendar, Plus, Coins, Receipt, PauseCircle, Ban, ScrollText, Bell, CheckCircle, ArrowRight, X } from 'lucide-react';
import PaymentCalc from './modules/PaymentCalc';
import AnnualPayment from './modules/AnnualPayment';
import SupplementPayment from './modules/SupplementPayment';
import LumpSumPayment from './modules/LumpSumPayment';
import RefundProcess from './modules/RefundProcess';
import DeferApplication from './modules/DeferApplication';
import ExemptionApply from './modules/ExemptionApply';
import PaymentNotice from './modules/PaymentNotice';
import ReminderManage from './modules/ReminderManage';
import ArrivalConfirm from './modules/ArrivalConfirm';
import PaymentQueryCenter from './modules/PaymentQueryCenter';

const modules = [
  { id: 'payment_calc', title: '缴费基数核定', icon: Calculator, desc: '核定缴费基数和比例', color: 'from-emerald-500 to-emerald-600', component: PaymentCalc },
  { id: 'annual', title: '年度正常缴费', icon: Calendar, desc: '正常年度缴费核定', color: 'from-blue-500 to-blue-600', component: AnnualPayment },
  { id: 'supplement', title: '补缴核定', icon: Plus, desc: '断缴期间补缴计算', color: 'from-orange-500 to-orange-600', component: SupplementPayment },
  { id: 'lump_sum', title: '趸缴核定', icon: Coins, desc: '一次性缴清剩余年限', color: 'from-purple-500 to-purple-600', component: LumpSumPayment },
  { id: 'refund', title: '退费处理', icon: Receipt, desc: '多缴错缴退费', color: 'from-red-500 to-red-600', component: RefundProcess },
  { id: 'defer', title: '缓缴申请', icon: PauseCircle, desc: '困难企业缓缴申请', color: 'from-yellow-500 to-yellow-600', component: DeferApplication },
  { id: 'exemption', title: '免缴认定', icon: Ban, desc: '低保特困免缴认定', color: 'from-pink-500 to-pink-600', component: ExemptionApply },
  { id: 'notice', title: '缴费通知单', icon: ScrollText, desc: '生成缴费通知单', color: 'from-cyan-500 to-cyan-600', component: PaymentNotice },
  { id: 'reminder', title: '催缴管理', icon: Bell, desc: '短信电话上门催缴', color: 'from-indigo-500 to-indigo-600', component: ReminderManage },
  { id: 'arrival', title: '到账确认', icon: CheckCircle, desc: '银行税务到账确认', color: 'from-green-500 to-green-600', component: ArrivalConfirm },
  { id: 'query_center', title: '核定查询', icon: ScrollText, desc: '核定、到账、补退费查询与导入导出', color: 'from-teal-500 to-teal-600', component: PaymentQueryCenter },
];

export default function PaymentCalcWorkbench() {
  const [selectedModule, setSelectedModule] = useState<string | null>(null);

  const renderModule = () => {
    const module = modules.find(m => m.id === selectedModule);
    if (!module) return null;
    const Component = module.component;
    return (
      <motion.div
        key={selectedModule}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50"
      >
        <Component onClose={() => setSelectedModule(null)} onBack={() => setSelectedModule(null)} />
      </motion.div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">缴费核定工作台</h2>
          <p className="text-sm text-gray-500 mt-1">缴费计算、催缴、到账管理</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {modules.map((module, index) => {
          const Icon = module.icon;
          return (
            <motion.button
              key={module.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => setSelectedModule(module.id)}
              className="group bg-white rounded-2xl p-8 shadow-md border border-gray-200 hover:shadow-xl hover:border-emerald-400 hover:-translate-y-1 transition-all text-left"
            >
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${module.color} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform shadow-lg`}>
                <Icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-bold text-xl text-gray-800 mb-2">{module.title}</h3>
              <p className="text-base text-gray-500 mb-4">{module.desc}</p>
              <div className="flex items-center text-emerald-600 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                <span>进入办理</span>
                <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </div>
            </motion.button>
          );
        })}
      </div>

      <AnimatePresence>{selectedModule && renderModule()}</AnimatePresence>
    </div>
  );
}
