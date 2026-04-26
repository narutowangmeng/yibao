import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, UserPlus, RefreshCcw, Home, Building2, Briefcase, Baby, ShieldCheck, GraduationCap, Upload, Search, Fingerprint, CheckCircle, ChevronRight, Camera, FileText, User, Phone, MapPin, ScanFace, EyeIcon, ChevronLeft } from 'lucide-react';

const modules = [
  { id: 'new', title: '新参保登记', icon: UserPlus, desc: '首次参加医保登记', color: 'from-blue-500 to-blue-600' },
  { id: 'renewal', title: '续保登记', icon: RefreshCcw, desc: '断缴后重新参保', color: 'from-cyan-500 to-cyan-600' },
  { id: 'urban_rural', title: '城乡居民参保', icon: Home, desc: '城镇居民/农村居民参保', color: 'from-emerald-500 to-emerald-600' },
  { id: 'employee', title: '城镇职工参保', icon: Building2, desc: '企业职工/机关事业单位参保', color: 'from-indigo-500 to-indigo-600' },
  { id: 'flexible', title: '灵活就业参保', icon: Briefcase, desc: '个体户/自由职业者参保', color: 'from-purple-500 to-purple-600' },
  { id: 'newborn', title: '新生儿参保', icon: Baby, desc: '出生医学证明参保', color: 'from-pink-500 to-pink-600' },
  { id: 'veteran', title: '退役军人参保', icon: ShieldCheck, desc: '退役安置人员参保', color: 'from-orange-500 to-orange-600' },
  { id: 'student', title: '学生参保', icon: GraduationCap, desc: '大中小学生参保', color: 'from-teal-500 to-teal-600' },
  { id: 'batch', title: '批量参保导入', icon: Upload, desc: '企业批量导入参保', color: 'from-violet-500 to-violet-600' },
  { id: 'query', title: '参保信息查询', icon: Search, desc: '查询参保状态信息', color: 'from-gray-500 to-gray-600' },
];

const enrollmentSteps = [
  { id: 'basic', title: '基础信息', desc: '填写个人基本信息' },
  { id: 'enrollment', title: '参保信息', desc: '选择参保类型和险种' },
  { id: 'biometric', title: '生物识别', desc: '采集指纹人脸虹膜' },
  { id: 'confirm', title: '确认提交', desc: '核对信息并提交' },
];

const bioSteps = [
  { id: 'fingerprint', title: '指纹采集', desc: '录入指纹信息' },
  { id: 'face', title: '人脸识别', desc: '人脸特征采集' },
  { id: 'iris', title: '虹膜采集', desc: '虹膜特征录入' },
];

export default function EnrollmentWorkbench() {
  const [selectedModule, setSelectedModule] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [bioStep, setBioStep] = useState(0);
  const [bioStatus, setBioStatus] = useState<Record<string, 'waiting' | 'scanning' | 'success'>>({
    fingerprint: 'waiting', face: 'waiting', iris: 'waiting'
  });
  const [capturedData, setCapturedData] = useState<Record<string, string[]>>({});
  const [queryResult, setQueryResult] = useState<any[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    idCard: '',
    gender: '',
    phone: '',
    address: '',
    insuranceType: '',
    paymentBase: '',
    startDate: '',
  });

  const resetForm = () => {
    setSelectedModule(null);
    setCurrentStep(0);
    setBioStep(0);
    setBioStatus({ fingerprint: 'waiting', face: 'waiting', iris: 'waiting' });
    setCapturedData({});
    setQueryResult([]);
    setHasSearched(false);
    setFormData({
      name: '',
      idCard: '',
      gender: '',
      phone: '',
      address: '',
      insuranceType: '',
      paymentBase: '',
      startDate: '',
    });
  };

  const startCapture = (type: string) => {
    setBioStatus({ ...bioStatus, [type]: 'scanning' });
    setTimeout(() => {
      setBioStatus(prev => ({ ...prev, [type]: 'success' }));
      const labels: Record<string, string[]> = {
        fingerprint: ['右手拇指', '右手食指', '左手拇指'],
        face: ['正面人脸', '左侧人脸', '右侧人脸'],
        iris: ['左眼虹膜', '右眼虹膜']
      };
      setCapturedData(prev => ({ ...prev, [type]: labels[type] }));
    }, 2000);
  };

  const nextStep = () => {
    if (currentStep < enrollmentSteps.length - 1) {
      setCurrentStep(currentStep + 1);
      if (currentStep + 1 === 2) {
        setBioStep(0);
      }
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      if (currentStep === 2) {
        setBioStep(0);
      }
    }
  };

  const nextBioStep = () => {
    if (bioStep < bioSteps.length - 1) {
      setBioStep(bioStep + 1);
    } else {
      nextStep();
    }
  };

  const prevBioStep = () => {
    if (bioStep > 0) {
      setBioStep(bioStep - 1);
    } else {
      prevStep();
    }
  };

  const handleSearch = () => {
    setHasSearched(true);
    setQueryResult([
      { id: '1', name: '张三', idCard: '320101199001011234', gender: '男', phone: '13800138001', type: '城镇职工', status: '正常参保', date: '2024-01-15' },
      { id: '2', name: '李四', idCard: '320101198505056789', gender: '女', phone: '13900139002', type: '城乡居民', status: '暂停参保', date: '2023-06-20' },
    ]);
  };

  const renderBasicInfo = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">姓名 <span className="text-red-500">*</span></label>
          <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500" placeholder="请输入姓名" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">身份证号 <span className="text-red-500">*</span></label>
          <input type="text" value={formData.idCard} onChange={(e) => setFormData({...formData, idCard: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500" placeholder="请输入身份证号" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">性别 <span className="text-red-500">*</span></label>
          <select value={formData.gender} onChange={(e) => setFormData({...formData, gender: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500">
            <option value="">请选择</option>
            <option value="男">男</option>
            <option value="女">女</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">联系电话 <span className="text-red-500">*</span></label>
          <input type="text" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500" placeholder="请输入联系电话" />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">居住地址 <span className="text-red-500">*</span></label>
        <input type="text" value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500" placeholder="请输入详细居住地址" />
      </div>
    </div>
  );

  const renderEnrollmentInfo = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">参保类型 <span className="text-red-500">*</span></label>
          <select value={formData.insuranceType} onChange={(e) => setFormData({...formData, insuranceType: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500">
            <option value="">请选择参保类型</option>
            <option value="城镇职工">城镇职工基本医疗保险</option>
            <option value="城乡居民">城乡居民基本医疗保险</option>
            <option value="灵活就业">灵活就业人员医保</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">缴费基数</label>
          <input type="text" value={formData.paymentBase} onChange={(e) => setFormData({...formData, paymentBase: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500" placeholder="请输入缴费基数" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">参保开始日期 <span className="text-red-500">*</span></label>
          <input type="date" value={formData.startDate} onChange={(e) => setFormData({...formData, startDate: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">参保地区</label>
          <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500">
            <option value="">请选择参保地区</option>
            <option value="杭州市">杭州市</option>
            <option value="宁波市">宁波市</option>
            <option value="温州市">温州市</option>
          </select>
        </div>
      </div>
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800">
          <span className="font-medium">提示：</span>缴费基数范围为 3957元 - 22311元，系统将自动计算个人和单位应缴金额。
        </p>
      </div>
    </div>
  );

  const renderBioCapture = () => {
    const step = bioSteps[bioStep];
    const status = bioStatus[step.id];
    const icons: Record<string, any> = { fingerprint: Fingerprint, face: ScanFace, iris: EyeIcon };
    const Icon = icons[step.id];

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center gap-2 mb-4">
          {bioSteps.map((s, idx) => (
            <React.Fragment key={s.id}>
              <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm ${idx <= bioStep ? 'bg-cyan-100 text-cyan-700' : 'bg-gray-100 text-gray-500'}`}>
                {bioStatus[s.id] === 'success' ? <CheckCircle className="w-4 h-4" /> : <span>{idx + 1}</span>}
                <span>{s.title}</span>
              </div>
              {idx < bioSteps.length - 1 && <ChevronRight className="w-4 h-4 text-gray-300" />}
            </React.Fragment>
          ))}
        </div>
        <div className="flex justify-center">
          <motion.div className={`w-48 h-48 rounded-3xl flex items-center justify-center ${status === 'success' ? 'bg-green-100' : 'bg-gradient-to-br from-cyan-100 to-blue-100'}`}
            animate={status === 'scanning' ? { scale: [1, 1.05, 1] } : {}}
            transition={{ duration: 0.5, repeat: status === 'scanning' ? Infinity : 0 }}>
            <Icon className={`w-24 h-24 ${status === 'success' ? 'text-green-600' : 'text-cyan-600'}`} />
            {status === 'scanning' && <motion.div className="absolute inset-0 rounded-3xl border-4 border-cyan-400" animate={{ opacity: [0, 1, 0] }} transition={{ duration: 1, repeat: Infinity }} />}
          </motion.div>
        </div>
        <div className="text-center">
          {status === 'waiting' && <p className="text-gray-600">请点击下方按钮开始{step.title}</p>}
          {status === 'scanning' && <motion.p className="text-cyan-600 font-medium" animate={{ opacity: [1, 0.5, 1] }} transition={{ duration: 0.5, repeat: Infinity }}>正在采集，请保持...</motion.p>}
          {status === 'success' && <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="flex items-center justify-center gap-2 text-green-600"><CheckCircle className="w-5 h-5" /><span className="font-medium">{step.title}成功</span></motion.div>}
        </div>
        {capturedData[step.id] && (
          <div className="bg-gray-50 rounded-xl p-4">
            <p className="text-sm font-medium text-gray-700 mb-2">已采集数据</p>
            <div className="flex gap-2">
              {capturedData[step.id].map((item, i) => (
                <span key={i} className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">{item}</span>
              ))}
            </div>
          </div>
        )}
        <div className="flex gap-3 justify-center">
          <button onClick={prevBioStep} className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-1">
            <ChevronLeft className="w-4 h-4" />上一步
          </button>
          {status === 'waiting' && (
            <button onClick={() => startCapture(step.id)} className="px-6 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 font-medium">开始{step.title}</button>
          )}
          {status === 'success' && (
            <button onClick={nextBioStep} className="px-6 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 flex items-center gap-1">
              {bioStep < bioSteps.length - 1 ? '下一步' : '完成采集'}<ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    );
  };

  const renderConfirm = () => (
    <div className="space-y-4">
      <div className="bg-gray-50 rounded-xl p-4 space-y-3">
        <p className="font-medium text-gray-800 mb-3">基础信息</p>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex justify-between"><span className="text-gray-600">姓名</span><span className="font-medium">{formData.name || '张三'}</span></div>
          <div className="flex justify-between"><span className="text-gray-600">身份证号</span><span className="font-medium">{formData.idCard || '320101199001011234'}</span></div>
          <div className="flex justify-between"><span className="text-gray-600">性别</span><span className="font-medium">{formData.gender || '男'}</span></div>
          <div className="flex justify-between"><span className="text-gray-600">联系电话</span><span className="font-medium">{formData.phone || '13800138001'}</span></div>
        </div>
      </div>
      <div className="bg-gray-50 rounded-xl p-4 space-y-3">
        <p className="font-medium text-gray-800 mb-3">参保信息</p>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex justify-between"><span className="text-gray-600">参保类型</span><span className="font-medium">{formData.insuranceType || '城镇职工基本医疗保险'}</span></div>
          <div className="flex justify-between"><span className="text-gray-600">缴费基数</span><span className="font-medium">{formData.paymentBase || '5000元'}</span></div>
          <div className="flex justify-between"><span className="text-gray-600">开始日期</span><span className="font-medium">{formData.startDate || '2024-01-01'}</span></div>
        </div>
      </div>
      <div className="bg-gray-50 rounded-xl p-4 space-y-3">
        <p className="font-medium text-gray-800 mb-3">生物识别采集</p>
        <div className="flex gap-4 text-sm">
          <span className="text-green-600 flex items-center gap-1"><CheckCircle className="w-4 h-4" />指纹采集完成</span>
          <span className="text-green-600 flex items-center gap-1"><CheckCircle className="w-4 h-4" />人脸识别完成</span>
          <span className="text-green-600 flex items-center gap-1"><CheckCircle className="w-4 h-4" />虹膜采集完成</span>
        </div>
      </div>
      <div className="bg-green-50 border border-green-200 rounded-xl p-4">
        <p className="text-green-800 text-sm">请核对以上信息，确认无误后点击提交完成参保登记</p>
      </div>
    </div>
  );

  const renderStepContent = () => {
    const moduleId = selectedModule;
    if (moduleId === 'batch') {
      return (
        <div className="space-y-6">
          <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center">
            <Upload className="w-12 h-12 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600 mb-2">拖拽文件到此处或点击上传</p>
            <p className="text-sm text-gray-400">支持 Excel、CSV 格式</p>
            <button className="mt-4 px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700">选择文件</button>
          </div>
        </div>
      );
    }
    if (moduleId === 'query') {
      return (
        <div className="space-y-4">
          <div className="flex gap-2">
            <input type="text" className="flex-1 px-3 py-2 border rounded-lg" placeholder="请输入姓名或身份证号查询" />
            <button onClick={handleSearch} className="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700">查询</button>
          </div>
          {hasSearched ? (
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr><th className="px-4 py-3 text-left text-sm font-medium">姓名</th><th className="px-4 py-3 text-left text-sm font-medium">身份证号</th><th className="px-4 py-3 text-left text-sm font-medium">参保类型</th><th className="px-4 py-3 text-left text-sm font-medium">状态</th><th className="px-4 py-3 text-left text-sm font-medium">操作</th></tr>
                </thead>
                <tbody className="divide-y">
                  {queryResult.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium">{item.name}</td>
                      <td className="px-4 py-3 text-gray-600">{item.idCard}</td>
                      <td className="px-4 py-3">{item.type}</td>
                      <td className="px-4 py-3"><span className={`px-2 py-1 rounded-full text-xs ${item.status === '正常参保' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{item.status}</span></td>
                      <td className="px-4 py-3"><button onClick={() => setSelectedRecord(item)} className="text-cyan-600 hover:underline">查看</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="bg-gray-50 rounded-xl p-8 text-center">
              <Search className="w-12 h-12 mx-auto text-gray-300 mb-2" />
              <p className="text-gray-500">请输入查询条件进行搜索</p>
            </div>
          )}
        </div>
      );
    }

    switch (currentStep) {
      case 0: return renderBasicInfo();
      case 1: return renderEnrollmentInfo();
      case 2: return renderBioCapture();
      case 3: return renderConfirm();
      default: return null;
    }
  };

  const canProceed = () => {
    if (currentStep === 0) {
      return formData.name && formData.idCard && formData.gender && formData.phone && formData.address;
    }
    if (currentStep === 1) {
      return formData.insuranceType && formData.startDate;
    }
    if (currentStep === 2) {
      return bioStatus.fingerprint === 'success' && bioStatus.face === 'success' && bioStatus.iris === 'success';
    }
    return true;
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">参保登记工作台</h2>
          <p className="text-base text-gray-500 mt-2">各类人员参保业务办理（支持多模态生物识别）</p>
        </div>
        <div className="flex items-center gap-6 text-base text-gray-500">
          <span>今日办理: 156笔</span>
          <span>累计办理: 2,340笔</span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {modules.map((module, index) => {
          const Icon = module.icon;
          return (
            <motion.button key={module.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }}
              onClick={() => setSelectedModule(module.id)}
              className="group bg-white rounded-2xl p-8 shadow-md border border-gray-200 hover:shadow-2xl hover:border-cyan-400 hover:-translate-y-1 transition-all text-left">
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${module.color} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform shadow-lg`}>
                <Icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-bold text-xl text-gray-800 mb-2">{module.title}</h3>
              <p className="text-base text-gray-500">{module.desc}</p>
            </motion.button>
          );
        })}
      </div>

      <AnimatePresence>
        {selectedModule && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={resetForm}>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} onClick={(e) => e.stopPropagation()} className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-auto">
              <div className="p-6 border-b flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-800">{modules.find(m => m.id === selectedModule)?.title} - 业务办理</h3>
                <button onClick={resetForm} className="p-2 hover:bg-gray-100 rounded-lg"><X className="w-5 h-5" /></button>
              </div>
              <div className="p-6">
                {selectedModule !== 'batch' && selectedModule !== 'query' && (
                  <div className="flex items-center justify-between mb-8">
                    {enrollmentSteps.map((step, index) => (
                      <React.Fragment key={step.id}>
                        <div className="flex flex-col items-center">
                          <motion.div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${index <= currentStep ? 'bg-cyan-600 text-white' : 'bg-gray-200 text-gray-500'}`}
                            animate={index === currentStep ? { scale: [1, 1.1, 1] } : {}} transition={{ duration: 0.3 }}>
                            {index < currentStep ? <CheckCircle className="w-5 h-5" /> : index + 1}
                          </motion.div>
                          <span className={`text-xs mt-2 ${index <= currentStep ? 'text-cyan-600 font-medium' : 'text-gray-400'}`}>{step.title}</span>
                        </div>
                        {index < enrollmentSteps.length - 1 && (
                          <div className="flex-1 h-1 mx-2 bg-gray-200 rounded">
                            <motion.div className="h-full bg-cyan-600 rounded" initial={{ width: 0 }} animate={{ width: index < currentStep ? '100%' : '0%' }} transition={{ duration: 0.3 }} />
                          </div>
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                )}
                <div className="min-h-[300px]">{renderStepContent()}</div>
              </div>
              <div className="p-6 border-t flex justify-between">
                <button onClick={resetForm} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">取消</button>
                {selectedModule !== 'batch' && selectedModule !== 'query' && (
                  <div className="flex gap-3">
                    {currentStep > 0 && currentStep !== 2 && (
                      <button onClick={prevStep} className="px-4 py-2 border rounded-lg hover:bg-gray-50">上一步</button>
                    )}
                    {currentStep < enrollmentSteps.length - 1 ? (
                      <button onClick={nextStep} disabled={!canProceed()}
                        className="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 disabled:opacity-50 flex items-center gap-2">
                        下一步<ChevronRight className="w-4 h-4" />
                      </button>
                    ) : (
                      <button onClick={resetForm} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2">
                        <CheckCircle className="w-4 h-4" />提交办理
                      </button>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedRecord && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setSelectedRecord(null)}>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} onClick={(e) => e.stopPropagation()} className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-800">参保详情</h3>
                <button onClick={() => setSelectedRecord(null)} className="p-2 hover:bg-gray-100 rounded-lg"><X className="w-5 h-5" /></button>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between"><span className="text-gray-500">姓名</span><span className="font-medium">{selectedRecord.name}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">身份证号</span><span className="font-medium">{selectedRecord.idCard}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">参保类型</span><span className="font-medium">{selectedRecord.type}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">状态</span><span className={`px-2 py-1 rounded-full text-xs ${selectedRecord.status === '正常参保' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{selectedRecord.status}</span></div>
              </div>
              <div className="mt-6 flex justify-end">
                <button onClick={() => setSelectedRecord(null)} className="px-4 py-2 bg-cyan-600 text-white rounded-lg">关闭</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
