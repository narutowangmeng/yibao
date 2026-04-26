export const managementDataUpdatedAt = '2024年末口径';

export const managementOverview = {
  insuredPopulation: '1268.4万人',
  fundIncome: '1586.42亿元',
  fundExpense: '1462.18亿元',
  annualSettlements: '3.42亿人次',
  designatedInstitutions: '2.43万家',
  reimbursementRate: '72.8%',
  fundBalance: '124.24亿元',
  riskAlerts: 842,
  inspectionCases: 126,
  smartReviewCoverage: '97.6%'
};

export const fundTrend = [
  { month: '1月', income: 118.4, expense: 109.8, balance: 8.6 },
  { month: '2月', income: 121.3, expense: 110.4, balance: 10.9 },
  { month: '3月', income: 128.6, expense: 116.2, balance: 12.4 },
  { month: '4月', income: 130.8, expense: 119.6, balance: 11.2 },
  { month: '5月', income: 133.9, expense: 122.8, balance: 11.1 },
  { month: '6月', income: 136.5, expense: 125.7, balance: 10.8 },
  { month: '7月', income: 131.7, expense: 123.9, balance: 7.8 },
  { month: '8月', income: 129.2, expense: 121.4, balance: 7.8 },
  { month: '9月', income: 132.6, expense: 123.1, balance: 9.5 },
  { month: '10月', income: 137.8, expense: 127.4, balance: 10.4 },
  { month: '11月', income: 141.5, expense: 130.6, balance: 10.9 },
  { month: '12月', income: 144.1, expense: 131.3, balance: 12.8 }
];

export const cityFundDistribution = [
  { city: '济南', insured: 118.6, income: 162.4, expense: 149.2, warnings: 126 },
  { city: '青岛', insured: 132.8, income: 178.9, expense: 166.3, warnings: 108 },
  { city: '淄博', insured: 63.2, income: 82.6, expense: 77.8, warnings: 61 },
  { city: '烟台', insured: 84.5, income: 96.8, expense: 89.7, warnings: 73 },
  { city: '潍坊', insured: 91.4, income: 112.7, expense: 104.2, warnings: 88 },
  { city: '临沂', insured: 103.7, income: 118.5, expense: 111.1, warnings: 96 }
];

export const policyEffectData = [
  { policy: '门诊共济保障机制', coverage: '91.4%', beneficiaries: '842.6万人', effect: '次均门诊自付下降11.8%' },
  { policy: '集采落地执行', coverage: '100%', beneficiaries: '全省定点机构', effect: '重点药耗平均降幅48.6%' },
  { policy: '异地就医直接结算', coverage: '96.8%', beneficiaries: '214.3万人次', effect: '垫资金额减少18.4亿元' },
  { policy: 'DRG/DIP支付改革', coverage: '83.7%', beneficiaries: '247家住院机构', effect: '住院次均费用下降6.3%' }
];

export const crossDeptApprovals = [
  { id: 'AP-2024-018', title: '2025年度门诊慢特病保障目录调整', departments: ['待遇保障处', '医药服务处', '基金监管处'], progress: 82, status: '会签中' },
  { id: 'AP-2024-026', title: '国家集采中选药品落地执行评估', departments: ['医药服务处', '办公室'], progress: 68, status: '待分管领导批示' },
  { id: 'AP-2024-031', title: '基金运行风险月度分析专报', departments: ['基金监管处', '待遇保障处'], progress: 100, status: '已办结' }
];

export const policyPublications = [
  { id: 1, title: '关于完善门诊共济保障机制的实施细则', type: '政策文件', date: '2024-11-12', views: 18342 },
  { id: 2, title: 'DRG/DIP支付方式改革运行监测通报', type: '运行通报', date: '2024-10-24', views: 12680 },
  { id: 3, title: '国家医保目录新增药品落地工作提示', type: '政策解读', date: '2024-09-18', views: 9746 }
];

export const riskTrend = [
  { month: '1月', high: 28, medium: 64, low: 102 },
  { month: '2月', high: 25, medium: 58, low: 96 },
  { month: '3月', high: 31, medium: 69, low: 108 },
  { month: '4月', high: 22, medium: 55, low: 90 },
  { month: '5月', high: 19, medium: 49, low: 84 },
  { month: '6月', high: 17, medium: 46, low: 79 },
  { month: '7月', high: 21, medium: 52, low: 88 },
  { month: '8月', high: 18, medium: 47, low: 81 },
  { month: '9月', high: 16, medium: 43, low: 78 },
  { month: '10月', high: 14, medium: 39, low: 73 },
  { month: '11月', high: 13, medium: 37, low: 69 },
  { month: '12月', high: 11, medium: 34, low: 66 }
];

export const violationTypeData = [
  { name: '分解住院', value: 146, color: '#ef4444' },
  { name: '过度诊疗', value: 121, color: '#f59e0b' },
  { name: '串换项目', value: 96, color: '#0891b2' },
  { name: '冒名就医', value: 44, color: '#8b5cf6' },
  { name: '超限用药', value: 73, color: '#22c55e' }
];

export const inspectionSummary = [
  { name: '定点医院', count: 72, amount: 1.86, unit: '亿元' },
  { name: '定点药店', count: 34, amount: 0.42, unit: '亿元' },
  { name: '参保个人', count: 20, amount: 0.08, unit: '亿元' }
];

export const realtimeAlerts = [
  { id: 1, level: 'high', title: '青岛某三级医院住院总费用异常波动', desc: '近7日住院总费用环比增长32.4%，超同级机构均值2.1倍。', time: '10分钟前' },
  { id: 2, level: 'medium', title: '济南某连锁药店高频刷卡预警', desc: '同一证件在3小时内发生9次购药结算，涉及慢病处方叠加使用。', time: '43分钟前' },
  { id: 3, level: 'low', title: '临沂异地就医结算回传延迟', desc: '跨省结算明细回传平均延迟提升至19分钟，已触发运维协同。', time: '2小时前' }
];

export const institutionGrowthTrend = [
  { month: '1月', hospital: 2438, clinic: 8421, pharmacy: 11286 },
  { month: '2月', hospital: 2441, clinic: 8456, pharmacy: 11318 },
  { month: '3月', hospital: 2448, clinic: 8512, pharmacy: 11386 },
  { month: '4月', hospital: 2452, clinic: 8560, pharmacy: 11418 },
  { month: '5月', hospital: 2459, clinic: 8614, pharmacy: 11496 },
  { month: '6月', hospital: 2466, clinic: 8682, pharmacy: 11584 },
  { month: '7月', hospital: 2471, clinic: 8730, pharmacy: 11642 },
  { month: '8月', hospital: 2478, clinic: 8806, pharmacy: 11718 },
  { month: '9月', hospital: 2486, clinic: 8874, pharmacy: 11812 },
  { month: '10月', hospital: 2491, clinic: 8946, pharmacy: 11896 },
  { month: '11月', hospital: 2498, clinic: 9021, pharmacy: 11974 },
  { month: '12月', hospital: 2506, clinic: 9093, pharmacy: 12057 }
];

export const procurementDropData = [
  { name: '心血管常用药', value: 52, color: '#0891b2' },
  { name: '肿瘤治疗药', value: 41, color: '#22c55e' },
  { name: '骨科高值耗材', value: 63, color: '#f59e0b' },
  { name: '检验试剂', value: 28, color: '#8b5cf6' }
];

export const procurementExecutionData = [
  { name: '国家集采', count: 428, amount: 38.6 },
  { name: '省际联盟', count: 362, amount: 21.4 },
  { name: '省级集采', count: 295, amount: 16.8 }
];

export const paymentMethodData = [
  { name: 'DRG付费', value: 58, color: '#0891b2' },
  { name: 'DIP付费', value: 24, color: '#22c55e' },
  { name: '按病种分值', value: 11, color: '#f59e0b' },
  { name: '按项目付费', value: 7, color: '#8b5cf6' }
];

export const treatmentFundingTrend = [
  { month: '1月', employee: 66.4, resident: 34.8, flexible: 5.9 },
  { month: '2月', employee: 67.8, resident: 35.4, flexible: 6.1 },
  { month: '3月', employee: 69.5, resident: 36.2, flexible: 6.4 },
  { month: '4月', employee: 70.1, resident: 36.8, flexible: 6.6 },
  { month: '5月', employee: 71.2, resident: 37.1, flexible: 6.8 },
  { month: '6月', employee: 72.4, resident: 37.6, flexible: 7.0 },
  { month: '7月', employee: 73.1, resident: 37.9, flexible: 7.2 },
  { month: '8月', employee: 73.8, resident: 38.1, flexible: 7.3 },
  { month: '9月', employee: 74.5, resident: 38.4, flexible: 7.5 },
  { month: '10月', employee: 75.6, resident: 38.8, flexible: 7.8 },
  { month: '11月', employee: 76.4, resident: 39.2, flexible: 8.1 },
  { month: '12月', employee: 77.3, resident: 39.6, flexible: 8.4 }
];

export const benefitStructureData = [
  { name: '住院待遇', value: 48, amount: 702.6 },
  { name: '普通门诊', value: 23, amount: 336.4 },
  { name: '门诊慢特病', value: 17, amount: 248.7 },
  { name: '生育待遇', value: 5, amount: 76.2 },
  { name: '医疗救助衔接', value: 7, amount: 98.3 }
];

export const policyProgressData = [
  { name: '门诊共济待遇扩围', progress: 92, status: '已完成年度目标' },
  { name: '异地就医直接结算提质', progress: 88, status: '持续优化中' },
  { name: '长期护理保险试点', progress: 64, status: '试点推进中' },
  { name: '生育待遇免申即享', progress: 57, status: '系统联调中' }
];

export const insuranceTypeComparison = [
  { name: '职工医保', enrollment: 402.5, revenue: 928.4 },
  { name: '居民医保', enrollment: 831.6, revenue: 587.3 },
  { name: '灵活就业', enrollment: 34.3, revenue: 70.7 }
];

export const leaderFocusList = [
  { title: '基金运行总体平稳', detail: '全年收入高于支出124.24亿元，职工基金结余率保持在8%以上。', tag: '基金运行' },
  { title: '集采降价持续释放红利', detail: '重点药耗累计减负超58亿元，三级医院中选结果执行率达到98.2%。', tag: '医药服务' },
  { title: '风险预警数量连续4个月下降', detail: '高风险预警从3月31件降至12月11件，疑点处置闭环率达到93.5%。', tag: '基金监管' },
  { title: '直接结算服务进一步扩面', detail: '异地门诊直接结算定点机构达1.12万家，跨省住院直接结算成功率99.1%。', tag: '待遇保障' }
];
