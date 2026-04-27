export type UserRole =
  | 'system_admin'
  | 'bureau_leader'
  | 'treatment_director'
  | 'fund_supervisor'
  | 'medical_service_director'
  | 'office_director'
  | 'operator'
  | 'operator_enrollment'
  | 'operator_contribution'
  | 'operator_payment'
  | 'operator_reimbursement'
  | 'operator_claims'
  | 'auditor_first'
  | 'auditor_second'
  | 'auditor_final'
  | 'auditor_audit'
  | 'auditor_settlement'
  | 'auditor_inspection'
  | 'operation_admin'
  | 'employer_management'
  | 'institution_admin'
  | 'employer_admin'
  | 'insured_person';

export interface RoleConfig {
  code: UserRole;
  name: string;
  department: string;
  level: 1 | 2 | 3;
  description: string;
  permissions: Permission[];
}

export type Permission =
  | 'dashboard:view'
  | 'insured:view' | 'insured:create' | 'insured:edit' | 'insured:delete'
  | 'reimbursement:view' | 'reimbursement:create' | 'reimbursement:audit' | 'reimbursement:approve'
  | 'payment:view' | 'payment:create' | 'payment:audit'
  | 'institutions:view' | 'institutions:manage'
  | 'supervision:view' | 'supervision:risk' | 'supervision:audit' | 'supervision:inspect'
  | 'finance:view' | 'finance:allocate' | 'finance:settle'
  | 'reports:view' | 'reports:export'
  | 'users:view' | 'users:manage'
  | 'roles:view' | 'roles:manage'
  | 'settings:view' | 'settings:system'
  | 'treatment:policy' | 'treatment:directory' | 'treatment:benefit'
  | 'medical:institution' | 'medical:drug' | 'medical:price' | 'medical:service'
  | 'office:document' | 'office:meeting' | 'office:archive';

export const ROLE_CONFIGS: Record<UserRole, RoleConfig> = {
  system_admin: {
    code: 'system_admin',
    name: '系统管理员',
    department: '信息中心',
    level: 1,
    description: '负责系统配置、用户管理、权限分配和数据安全。',
    permissions: ['dashboard:view', 'users:view', 'users:manage', 'roles:view', 'roles:manage', 'settings:view', 'settings:system'],
  },
  bureau_leader: {
    code: 'bureau_leader',
    name: '医保局领导',
    department: '局领导',
    level: 1,
    description: '统筹全局工作，查看核心经营和监管数据。',
    permissions: [
      'dashboard:view', 'insured:view', 'reimbursement:view', 'payment:view',
      'institutions:view', 'supervision:view', 'finance:view', 'reports:view', 'reports:export',
      'treatment:policy', 'medical:institution', 'medical:drug', 'medical:price',
    ],
  },
  treatment_director: {
    code: 'treatment_director',
    name: '待遇保障',
    department: '待遇保障处',
    level: 1,
    description: '负责待遇政策、目录管理和待遇保障业务。',
    permissions: [
      'dashboard:view', 'insured:view', 'insured:create', 'insured:edit',
      'reimbursement:view', 'reimbursement:audit', 'payment:view',
      'treatment:policy', 'treatment:directory', 'treatment:benefit',
    ],
  },
  fund_supervisor: {
    code: 'fund_supervisor',
    name: '基金监管',
    department: '基金监管处',
    level: 1,
    description: '负责基金监管、飞检稽核、风险监测和违规查处。',
    permissions: [
      'dashboard:view', 'supervision:view', 'supervision:risk', 'supervision:audit',
      'supervision:inspect', 'institutions:view', 'finance:view',
    ],
  },
  medical_service_director: {
    code: 'medical_service_director',
    name: '医药服务管理',
    department: '医药服务管理处',
    level: 1,
    description: '负责医药服务、目录、价格和机构管理。',
    permissions: [
      'dashboard:view', 'institutions:view', 'institutions:manage',
      'medical:institution', 'medical:drug', 'medical:price', 'medical:service',
    ],
  },
  office_director: {
    code: 'office_director',
    name: '办公室',
    department: '办公室',
    level: 1,
    description: '负责公文、会议、档案和综合协调。',
    permissions: ['dashboard:view', 'office:document', 'office:meeting', 'office:archive', 'settings:view'],
  },
  operator: {
    code: 'operator',
    name: '经办人员',
    department: '经办机构',
    level: 2,
    description: '负责日常经办业务处理。',
    permissions: [
      'dashboard:view', 'insured:view', 'insured:create', 'insured:edit',
      'reimbursement:view', 'reimbursement:create', 'payment:view', 'payment:create',
    ],
  },
  operator_enrollment: {
    code: 'operator_enrollment',
    name: '参保登记',
    department: '参保登记科',
    level: 2,
    description: '负责参保登记、信息变更和关系转移。',
    permissions: ['dashboard:view', 'insured:view', 'insured:create', 'insured:edit'],
  },
  operator_contribution: {
    code: 'operator_contribution',
    name: '缴费',
    department: '缴费科',
    level: 2,
    description: '负责单位缴费、个人缴费、缴费单管理、到账状态查询和缴费回执打印。',
    permissions: ['dashboard:view', 'payment:view', 'payment:create'],
  },
  operator_payment: {
    code: 'operator_payment',
    name: '缴费核定',
    department: '缴费核定科',
    level: 2,
    description: '负责缴费基数核定、费用计算和催缴管理。',
    permissions: ['dashboard:view', 'payment:view', 'payment:create'],
  },
  operator_reimbursement: {
    code: 'operator_reimbursement',
    name: '费用报销',
    department: '费用报销科',
    level: 2,
    description: '负责医疗费用报销申请受理和材料初审。',
    permissions: ['dashboard:view', 'reimbursement:view', 'reimbursement:create'],
  },
  operator_claims: {
    code: 'operator_claims',
    name: '理赔管理',
    department: '理赔管理科',
    level: 2,
    description: '负责申报受理、人工审核、结算审核、支付指令、机构对账和异常处理。',
    permissions: [
      'dashboard:view', 'reimbursement:view', 'reimbursement:create',
      'reimbursement:audit', 'payment:view', 'payment:create',
    ],
  },
  auditor_first: {
    code: 'auditor_first',
    name: '初审岗',
    department: '审核科',
    level: 2,
    description: '负责业务初审和材料完整性检查。',
    permissions: [
      'dashboard:view', 'insured:view', 'reimbursement:view', 'reimbursement:audit', 'payment:view',
    ],
  },
  auditor_second: {
    code: 'auditor_second',
    name: '复审岗',
    department: '审核科',
    level: 2,
    description: '负责业务复审、合规性审查和疑点复核。',
    permissions: [
      'dashboard:view', 'insured:view', 'reimbursement:view', 'reimbursement:audit',
      'payment:view', 'payment:audit', 'supervision:view', 'supervision:audit',
    ],
  },
  auditor_final: {
    code: 'auditor_final',
    name: '终审',
    department: '财务科',
    level: 2,
    description: '负责最终审批、基金拨付和结算审核。',
    permissions: [
      'dashboard:view', 'finance:view', 'finance:allocate', 'finance:settle',
      'insured:view', 'reimbursement:view', 'reimbursement:audit', 'reimbursement:approve',
      'payment:view', 'payment:audit', 'supervision:view', 'supervision:audit',
    ],
  },
  auditor_audit: {
    code: 'auditor_audit',
    name: '费用审核',
    department: '费用审核科',
    level: 2,
    description: '负责医疗费用审核、合规性检查和异常处理。',
    permissions: ['dashboard:view', 'reimbursement:view', 'reimbursement:audit', 'supervision:view'],
  },
  auditor_settlement: {
    code: 'auditor_settlement',
    name: '基金结算',
    department: '基金结算科',
    level: 2,
    description: '负责基金结算、拨付管理和对账处理。',
    permissions: ['dashboard:view', 'finance:view', 'finance:allocate', 'finance:settle'],
  },
  auditor_inspection: {
    code: 'auditor_inspection',
    name: '稽核检查',
    department: '稽核检查科',
    level: 2,
    description: '负责稽核检查、违规查处和飞行检查。',
    permissions: ['dashboard:view', 'supervision:view', 'supervision:audit', 'supervision:inspect'],
  },
  operation_admin: {
    code: 'operation_admin',
    name: '系统管理',
    department: '系统管理科',
    level: 2,
    description: '负责经办系统配置、人员管理和权限分配。',
    permissions: ['dashboard:view', 'users:view', 'users:manage', 'settings:view'],
  },
  employer_management: {
    code: 'employer_management',
    name: '参保单位管理',
    department: '单位管理科',
    level: 2,
    description: '负责参保单位管理、员工增减员和缴费申报。',
    permissions: ['dashboard:view', 'insured:view', 'insured:create', 'insured:edit', 'payment:view'],
  },
  institution_admin: {
    code: 'institution_admin',
    name: '医疗机构',
    department: '定点医疗机构',
    level: 3,
    description: '负责机构业务管理和医保结算申报。',
    permissions: ['dashboard:view', 'institutions:view', 'reimbursement:view', 'reimbursement:create'],
  },
  employer_admin: {
    code: 'employer_admin',
    name: '参保单位',
    department: '参保单位',
    level: 3,
    description: '负责单位参保管理和员工缴费。',
    permissions: ['dashboard:view', 'insured:view', 'insured:create', 'payment:view', 'payment:create'],
  },
  insured_person: {
    code: 'insured_person',
    name: '参保人员',
    department: '个人',
    level: 3,
    description: '个人业务查询与办理。',
    permissions: ['dashboard:view', 'insured:view', 'reimbursement:view', 'payment:view'],
  },
};

export const DEPARTMENT_MODULES: Record<string, { name: string; modules: string[] }> = {
  treatment_director: {
    name: '待遇保障处',
    modules: [
      '参保管理 - 参保登记、信息变更、关系转移接续',
      '缴费管理 - 筹资政策、缴费核定、催缴管理',
      '待遇政策 - 医保待遇标准制定、待遇调整',
      '医保目录 - 药品目录、诊疗项目目录、医用耗材目录管理',
      '长期护理保险 - 失能评估、护理服务管理',
      '异地就医 - 异地备案、结算管理',
    ],
  },
  fund_supervisor: {
    name: '基金监管处',
    modules: [
      '基金监管 - 基金收支监控、风险预警',
      '飞行检查 - 现场检查、专项检查',
      '智能监管 - 大数据监控、规则库管理',
      '违规查处 - 欺诈骗保查处、违规处理',
      '信用管理 - 定点机构信用评价、黑名单管理',
      '举报投诉 - 举报受理、奖励发放',
    ],
  },
  medical_service_director: {
    name: '医药服务管理处',
    modules: [
      '医疗机构管理 - 定点机构准入、协议管理、退出管理',
      '药品管理 - 药品目录调整、集采管理、价格监测',
      '医疗服务价格 - 价格项目制定、价格调整',
      '招标采购 - 药品耗材招标、采购监管',
      '支付方式改革 - DRG/DIP付费、按病种付费',
      '医疗服务行为监管 - 诊疗规范、合理用药',
    ],
  },
  office_director: {
    name: '办公室',
    modules: [
      '公文管理 - 发文、收文、传阅',
      '会议管理 - 会议组织、纪要管理',
      '档案管理 - 文书档案、业务档案',
      '信息公开 - 政务公开、政策解读',
      '信访接待 - 群众来访、来信处理',
      '综合协调 - 部门协调、督办落实',
    ],
  },
};

export const hasPermission = (role: UserRole, permission: Permission): boolean => {
  return ROLE_CONFIGS[role].permissions.includes(permission);
};

export const getRoleName = (role: UserRole): string => ROLE_CONFIGS[role].name;

export const getRoleLevel = (role: UserRole): number => ROLE_CONFIGS[role].level;

export const getDepartmentName = (role: UserRole): string => ROLE_CONFIGS[role].department;
