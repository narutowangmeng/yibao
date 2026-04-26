import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { claimsStages } from './claims/claimsConfig';
import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import ClaimsQueryCenter from './modules/ClaimsQueryCenter';

export default function ClaimsManagementWorkbench() {
  const [showQueryCenter, setShowQueryCenter] = useState(false);
  const QueryIcon = claimsStages[0].icon;
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">理赔管理工作台</h2>
          <p className="mt-1 text-sm text-gray-500">请选择具体业务环节进入办理</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-800">理赔流程</h3>
        </div>
        <div className="flex items-center gap-6">
          {claimsStages.map((stage, index) => (
            <React.Fragment key={stage.id}>
              <div className="flex flex-col items-center min-w-[96px]">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white font-bold text-lg shadow-lg bg-gradient-to-br ${stage.accent}`}>
                  {index + 1}
                </div>
                <span className="text-sm text-gray-600 mt-2 font-medium">{stage.title}</span>
              </div>
              {index < claimsStages.length - 1 && (
                <div className="flex-1 h-2 bg-gray-200 rounded-full max-w-[100px]">
                  <div className="h-full w-full rounded-full bg-gradient-to-r from-cyan-500 to-cyan-600" />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <button
          onClick={() => setShowQueryCenter(true)}
          className="group bg-white rounded-2xl p-8 shadow-md border border-gray-200 hover:shadow-xl hover:border-cyan-400 hover:-translate-y-1 transition-all text-left"
        >
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-sky-500 to-sky-600 flex items-center justify-center mb-5 shadow-lg">
            <QueryIcon className="w-8 h-8 text-white" />
          </div>
          <h3 className="font-bold text-xl text-gray-800 mb-2">理赔查询</h3>
          <p className="text-base text-gray-500 mb-5">理赔受理、审核、支付、对账、异常处理统一查询与导入导出</p>
          <div className="flex items-center text-cyan-600 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
            <span>进入办理</span>
            <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
          </div>
        </button>
        {claimsStages.map((stage) => (
          <Link
            key={stage.id}
            to={stage.path}
            className="group bg-white rounded-2xl p-8 shadow-md border border-gray-200 hover:shadow-xl hover:border-cyan-400 hover:-translate-y-1 transition-all text-left"
          >
            <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${stage.accent} flex items-center justify-center mb-5 shadow-lg`}>
              <stage.icon className="w-8 h-8 text-white" />
            </div>
            <h3 className="font-bold text-xl text-gray-800 mb-2">{stage.title}</h3>
            <p className="text-base text-gray-500 mb-5">{stage.summary}</p>
            <div className="flex items-center text-cyan-600 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
              <span>进入办理</span>
              <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        ))}
      </div>
      <AnimatePresence>
        {showQueryCenter && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50">
            <ClaimsQueryCenter onBack={() => setShowQueryCenter(false)} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
