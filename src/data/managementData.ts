export const managementDataUpdatedAt = '2025年江苏省医保管理口径';

export const managementOverview = {
  insuredPopulation: '8726.3万人',
  fundIncome: '2148.62亿元',
  fundExpense: '2016.45亿元',
  annualSettlements: '4.87亿人次',
  designatedInstitutions: '5.16万家',
  reimbursementRate: '74.6%',
  fundBalance: '132.17亿元',
  riskAlerts: 1268,
  inspectionCases: 214,
  smartReviewCoverage: '98.3%'
};

export const fundTrend = [
  { month: '1月', income: 163.8, expense: 152.1, balance: 11.7 },
  { month: '2月', income: 168.5, expense: 154.3, balance: 14.2 },
  { month: '3月', income: 176.9, expense: 161.8, balance: 15.1 },
  { month: '4月', income: 180.6, expense: 167.9, balance: 12.7 },
  { month: '5月', income: 183.4, expense: 171.2, balance: 12.2 },
  { month: '6月', income: 186.7, expense: 174.8, balance: 11.9 },
  { month: '7月', income: 179.2, expense: 171.5, balance: 7.7 },
  { month: '8月', income: 177.6, expense: 169.4, balance: 8.2 },
  { month: '9月', income: 181.5, expense: 171.6, balance: 9.9 },
  { month: '10月', income: 186.3, expense: 175.2, balance: 11.1 },
  { month: '11月', income: 191.2, expense: 178.6, balance: 12.6 },
  { month: '12月', income: 192.5, expense: 168.1, balance: 24.4 }
];

export const cityFundDistribution = [
  { city: '南京', insured: 986.4, income: 254.8, expense: 238.6, warnings: 138 },
  { city: '无锡', insured: 641.7, income: 156.2, expense: 146.4, warnings: 81 },
  { city: '徐州', insured: 922.5, income: 181.5, expense: 173.8, warnings: 116 },
  { city: '常州', insured: 481.3, income: 117.9, expense: 110.4, warnings: 64 },
  { city: '苏州', insured: 1297.8, income: 328.6, expense: 307.1, warnings: 166 },
  { city: '南通', insured: 734.2, income: 173.7, expense: 163.8, warnings: 95 },
  { city: '连云港', insured: 434.5, income: 89.4, expense: 84.6, warnings: 58 },
  { city: '淮安', insured: 472.8, income: 94.7, expense: 89.8, warnings: 61 },
  { city: '盐城', insured: 705.6, income: 141.2, expense: 133.5, warnings: 93 },
  { city: '扬州', insured: 461.9, income: 103.8, expense: 97.6, warnings: 57 },
  { city: '镇江', insured: 329.1, income: 77.5, expense: 72.1, warnings: 43 },
  { city: '泰州', insured: 505.3, income: 108.2, expense: 102.4, warnings: 63 },
  { city: '宿迁', insured: 453.2, income: 84.9, expense: 80.7, warnings: 56 }
];

export const policyEffectData = [
  { policy: '门诊共济保障机制', coverage: '94.2%', beneficiaries: '3568.7万人', effect: '统筹基金支付后普通门诊次均自付下降9.6%' },
  { policy: '国家集采与省级联盟集采落地', coverage: '100%', beneficiaries: '全省定点医疗机构和双通道药店', effect: '重点药品和高值耗材平均降价41.3%' },
  { policy: '异地就医直接结算扩面', coverage: '98.1%', beneficiaries: '428.6万人次', effect: '跨省住院直接结算成功率稳定在99%以上' },
  { policy: 'DRG/DIP支付方式改革', coverage: '87.5%', beneficiaries: '312家二级及以上医疗机构', effect: '住院次均费用同比下降5.8%，平均住院日缩短0.6天' }
];

export const crossDeptApprovals = [
  { id: 'AP-2025-012', title: '2025年度门诊慢特病待遇目录调整', departments: ['待遇保障处', '医药服务管理处', '基金监管处'], progress: 84, status: '会签中' },
  { id: 'AP-2025-019', title: '双通道药店准入年度评估方案', departments: ['医药服务管理处', '基金监管处', '办公室'], progress: 71, status: '待分管领导审批' },
  { id: 'AP-2025-027', title: '全省异地就医备案服务优化专报', departments: ['待遇保障处', '信息中心'], progress: 93, status: '已提交审签' },
  { id: 'AP-2025-033', title: '医保基金飞行检查整改复盘报告', departments: ['基金监管处', '待遇保障处'], progress: 100, status: '已办结' }
];

export const policyPublications = [
  { id: 1, title: '关于优化江苏省门诊共济保障机制有关事项的通知', type: '政策文件', date: '2025-02-18', views: 21864 },
  { id: 2, title: '江苏省DRG/DIP支付方式改革运行监测通报', type: '运行通报', date: '2025-01-26', views: 16422 },
  { id: 3, title: '关于推进双通道药品保障服务标准化建设的工作提示', type: '政策解读', date: '2024-12-30', views: 12386 },
  { id: 4, title: '医保基金监管信用评价结果公示（2024年度）', type: '公告公示', date: '2024-12-16', views: 11574 }
];

export const riskTrend = [
  { month: '1月', high: 42, medium: 96, low: 148 },
  { month: '2月', high: 39, medium: 88, low: 140 },
  { month: '3月', high: 46, medium: 102, low: 156 },
  { month: '4月', high: 34, medium: 80, low: 128 },
  { month: '5月', high: 31, medium: 76, low: 119 },
  { month: '6月', high: 27, medium: 69, low: 108 },
  { month: '7月', high: 30, medium: 72, low: 113 },
  { month: '8月', high: 26, medium: 65, low: 102 },
  { month: '9月', high: 24, medium: 60, low: 96 },
  { month: '10月', high: 21, medium: 56, low: 88 },
  { month: '11月', high: 19, medium: 49, low: 81 },
  { month: '12月', high: 17, medium: 45, low: 77 }
];

export const violationTypeData = [
  { name: '分解住院', value: 182, color: '#ef4444' },
  { name: '过度诊疗', value: 157, color: '#f59e0b' },
  { name: '串换诊疗项目', value: 114, color: '#0891b2' },
  { name: '冒名就医', value: 51, color: '#8b5cf6' },
  { name: '超限定支付用药', value: 93, color: '#22c55e' }
];

export const inspectionSummary = [
  { name: '定点医院', count: 124, amount: 2.94, unit: '亿元' },
  { name: '零售药店与双通道药店', count: 63, amount: 0.76, unit: '亿元' },
  { name: '参保个人', count: 27, amount: 0.11, unit: '亿元' }
];

export const realtimeAlerts = [
  { id: 1, level: 'high', title: '苏州某三级医院心血管住院费用波动异常', desc: '近7日心血管住院总费用环比增长38.6%，高于同级医院均值2.4倍，已推送基金监管复核。', time: '12分钟前' },
  { id: 2, level: 'medium', title: '南京双通道药店门诊慢特病刷卡频次偏高', desc: '同一慢病参保人48小时内重复结算3次，涉及肿瘤靶向药与辅助用药组合支付。', time: '47分钟前' },
  { id: 3, level: 'low', title: '徐州跨省异地就医结算回传延迟', desc: '跨省住院明细回传平均延迟提升至11分钟，已触发信息中心运维协同处理。', time: '1小时25分钟前' }
];

export const institutionGrowthTrend = [
  { month: '1月', hospital: 3568, clinic: 12842, pharmacy: 14736 },
  { month: '2月', hospital: 3574, clinic: 12918, pharmacy: 14810 },
  { month: '3月', hospital: 3588, clinic: 13006, pharmacy: 14928 },
  { month: '4月', hospital: 3596, clinic: 13092, pharmacy: 15016 },
  { month: '5月', hospital: 3608, clinic: 13184, pharmacy: 15102 },
  { month: '6月', hospital: 3621, clinic: 13275, pharmacy: 15218 },
  { month: '7月', hospital: 3630, clinic: 13334, pharmacy: 15294 },
  { month: '8月', hospital: 3641, clinic: 13420, pharmacy: 15386 },
  { month: '9月', hospital: 3652, clinic: 13506, pharmacy: 15482 },
  { month: '10月', hospital: 3661, clinic: 13594, pharmacy: 15568 },
  { month: '11月', hospital: 3673, clinic: 13682, pharmacy: 15660 },
  { month: '12月', hospital: 3686, clinic: 13754, pharmacy: 15748 }
];

export const procurementDropData = [
  { name: '心血管常用药品', value: 47, color: '#0891b2' },
  { name: '肿瘤治疗药品', value: 38, color: '#22c55e' },
  { name: '骨科高值耗材', value: 59, color: '#f59e0b' },
  { name: '检验试剂', value: 26, color: '#8b5cf6' }
];

export const procurementExecutionData = [
  { name: '国家集采', count: 512, amount: 46.3 },
  { name: '省际联盟集采', count: 388, amount: 24.9 },
  { name: '省级集中带量采购', count: 326, amount: 18.7 }
];

export const paymentMethodData = [
  { name: 'DRG付费', value: 61, color: '#0891b2' },
  { name: 'DIP付费', value: 22, color: '#22c55e' },
  { name: '按病种分值付费', value: 10, color: '#f59e0b' },
  { name: '按项目付费', value: 7, color: '#8b5cf6' }
];

export const treatmentFundingTrend = [
  { month: '1月', employee: 82.6, resident: 49.2, flexible: 8.4 },
  { month: '2月', employee: 83.4, resident: 49.8, flexible: 8.6 },
  { month: '3月', employee: 85.1, resident: 50.9, flexible: 8.8 },
  { month: '4月', employee: 86.3, resident: 51.6, flexible: 9.1 },
  { month: '5月', employee: 87.2, resident: 52.1, flexible: 9.3 },
  { month: '6月', employee: 88.4, resident: 52.8, flexible: 9.5 },
  { month: '7月', employee: 89.1, resident: 53.2, flexible: 9.6 },
  { month: '8月', employee: 89.7, resident: 53.6, flexible: 9.8 },
  { month: '9月', employee: 90.5, resident: 54.1, flexible: 10.0 },
  { month: '10月', employee: 91.6, resident: 54.8, flexible: 10.3 },
  { month: '11月', employee: 92.4, resident: 55.2, flexible: 10.6 },
  { month: '12月', employee: 93.5, resident: 55.9, flexible: 10.8 }
];

export const benefitStructureData = [
  { name: '住院待遇', value: 46, amount: 892.4 },
  { name: '普通门诊', value: 24, amount: 468.2 },
  { name: '门诊慢特病', value: 18, amount: 351.7 },
  { name: '生育待遇', value: 4, amount: 82.9 },
  { name: '医疗救助衔接', value: 8, amount: 154.1 }
];

export const policyProgressData = [
  { name: '门诊共济待遇扩围', progress: 94, status: '已完成年度阶段目标' },
  { name: '异地就医直接结算提质', progress: 89, status: '持续优化中' },
  { name: '长期护理保险试点扩面', progress: 68, status: '试点推进中' },
  { name: '生育待遇免申即享', progress: 61, status: '系统联调中' }
];

export const insuranceTypeComparison = [
  { name: '职工医保', enrollment: 4128.6, revenue: 1286.4 },
  { name: '居民医保', enrollment: 4382.7, revenue: 706.8 },
  { name: '灵活就业', enrollment: 215.0, revenue: 155.4 }
];

export const leaderFocusList = [
  { title: '基金运行总体平稳可控', detail: '全年基金收入高于支出132.17亿元，13个设区市基金运行均保持当期收支平衡。', tag: '基金运行' },
  { title: '集采降价持续释放改革红利', detail: '国家集采、省际联盟和省级带量采购累计减负超71亿元，双通道药品可及性明显提升。', tag: '医药服务' },
  { title: '高风险预警闭环处置效率提升', detail: '智能监管高风险预警平均处置时长压缩至3.8天，基金追回和违规结算核减联动增强。', tag: '基金监管' },
  { title: '异地就医与慢特病保障持续扩面', detail: '跨省住院直接结算和门诊慢特病联网结算覆盖13市，群众报销获得感持续提升。', tag: '待遇保障' }
];
