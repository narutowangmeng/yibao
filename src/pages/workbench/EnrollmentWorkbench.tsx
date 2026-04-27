import React, { useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  UserPlus,
  RefreshCcw,
  Home,
  Building2,
  Briefcase,
  Baby,
  ShieldCheck,
  GraduationCap,
  Upload,
  Search,
  CheckCircle,
  ChevronRight,
  ChevronLeft,
  Camera,
  FileText,
  CreditCard,
  Download,
  AlertCircle,
  Check,
  Fingerprint,
  ScanFace,
  Eye,
} from 'lucide-react';
import * as XLSX from 'xlsx';

type EnrollmentCategory =
  | 'resident'
  | 'employee'
  | 'flexible'
  | 'newborn'
  | 'veteran'
  | 'student';

type PhotoFieldKey =
  | 'profilePhoto'
  | 'idCardFront'
  | 'idCardBack'
  | 'householdRegister'
  | 'birthCertificate'
  | 'guardianIdFront'
  | 'guardianIdBack'
  | 'studentProof'
  | 'veteranCertificate'
  | 'placementProof'
  | 'employmentProof';

interface FormField {
  key: string;
  label: string;
  required?: boolean;
  type?: 'text' | 'date' | 'select';
  options?: string[];
  placeholder?: string;
}

interface RecordItem {
  id: string;
  category: EnrollmentCategory;
  name: string;
  idCard: string;
  insuranceType: string;
  status: string;
  agency: string;
  submitDate: string;
  basic: Record<string, string>;
  extra: Record<string, string>;
  photos: Partial<Record<PhotoFieldKey, boolean>>;
  biometrics?: {
    fingerprint?: boolean;
    faceScan?: boolean;
    irisScan?: boolean;
  };
}

interface EnrollmentFormState {
  basic: Record<string, string>;
  insurance: Record<string, string>;
  photos: Partial<Record<PhotoFieldKey, boolean>>;
  biometrics: {
    fingerprint: boolean;
    faceScan: boolean;
    irisScan: boolean;
  };
}

interface BatchImportRecord {
  row: number;
  name: string;
  idCard: string;
  phone: string;
  category: string;
  insuranceType: string;
  agency: string;
  status: 'success' | 'error';
  message: string;
}

interface BatchImportRow {
  姓名: string;
  身份证号: string;
  手机号: string;
  参保类型: string;
  险种: string;
  所属地: string;
}

type QueryImportRow = Record<string, string>;

const batchTemplateHeaders = ['姓名', '身份证号', '手机号', '参保类型', '险种', '所属地'];
const batchCategoryOptions = ['城乡居民', '城镇职工', '灵活就业', '新生儿', '退役军人', '学生'];
const batchInsuranceOptions = ['城乡居民基本医疗保险', '职工基本医疗保险', '大病保险', '长期护理保险'];
const batchAgencyOptions = ['南京', '无锡', '徐州', '常州', '苏州', '南通', '连云港', '淮安', '盐城', '扬州', '镇江', '泰州', '宿迁'];
const batchSampleRows: BatchImportRow[] = [
  { 姓名: '陈思远', 身份证号: '320102198903152415', 手机号: '13851760011', 参保类型: '城镇职工', 险种: '职工基本医疗保险', 所属地: '南京' },
  { 姓名: '周语彤', 身份证号: '320205199407263526', 手机号: '13915230027', 参保类型: '城乡居民', 险种: '城乡居民基本医疗保险', 所属地: '无锡' },
  { 姓名: '顾嘉言', 身份证号: '320302199101084633', 手机号: '13775880039', 参保类型: '灵活就业', 险种: '职工基本医疗保险', 所属地: '徐州' },
  { 姓名: '沈知夏', 身份证号: '320412201910215628', 手机号: '13685210018', 参保类型: '新生儿', 险种: '城乡居民基本医疗保险', 所属地: '常州' },
  { 姓名: '陆书意', 身份证号: '320507200812163214', 手机号: '13584820042', 参保类型: '学生', 险种: '城乡居民基本医疗保险', 所属地: '苏州' },
  { 姓名: '许文博', 身份证号: '320602198805204517', 手机号: '13862750016', 参保类型: '退役军人', 险种: '职工基本医疗保险', 所属地: '南通' }
];

const queryFieldColumns = [
  { header: '联系电话', key: 'phone' },
  { header: '性别', key: 'gender' },
  { header: '出生日期', key: 'birthDate' },
  { header: '户籍地址', key: 'householdAddress' },
  { header: '居住地址', key: 'residenceAddress' },
  { header: '参保生效日期', key: 'enrollmentDate' },
  { header: '参保身份', key: 'identityType' },
  { header: '户籍性质', key: 'householdType' },
  { header: '社区/村居', key: 'community' },
  { header: '财政补助类别', key: 'subsidyType' },
  { header: '家庭关系', key: 'familyRelation' },
  { header: '单位名称', key: 'employerName' },
  { header: '统一社会信用代码', key: 'creditCode' },
  { header: '用工形式', key: 'employmentType' },
  { header: '参加工作时间', key: 'joinWorkDate' },
  { header: '缴费基数', key: 'paymentBase' },
  { header: '就业形态', key: 'employmentForm' },
  { header: '当前就业状态', key: 'currentStatus' },
  { header: '缴费档次', key: 'paymentGrade' },
  { header: '收入申报口径', key: 'declaredIncome' },
  { header: '出生医学证明编号', key: 'birthCertNo' },
  { header: '监护人姓名', key: 'guardianName' },
  { header: '监护人关系', key: 'guardianRelation' },
  { header: '监护人电话', key: 'guardianPhone' },
  { header: '父亲姓名', key: 'fatherName' },
  { header: '父亲身份证号', key: 'fatherIdCard' },
  { header: '母亲姓名', key: 'motherName' },
  { header: '母亲身份证号', key: 'motherIdCard' },
  { header: '随父母参保方式', key: 'followInsured' },
  { header: '落户状态', key: 'settlementStatus' },
  { header: '退役证编号', key: 'veteranCertNo' },
  { header: '退役时间', key: 'retireDate' },
  { header: '服役类别', key: 'serviceType' },
  { header: '安置方式', key: 'placementType' },
  { header: '退役军人事务认定单位', key: 'retireBureau' },
  { header: '优抚对象类别', key: 'preferentialType' },
  { header: '学校名称', key: 'schoolName' },
  { header: '学校所在地', key: 'schoolArea' },
  { header: '学籍号', key: 'studentNo' },
  { header: '学段', key: 'educationStage' },
  { header: '班级', key: 'className' },
  { header: '入学日期', key: 'admissionDate' },
] as const;

const queryPhotoColumns = [
  { header: '参保人照片', key: 'profilePhoto' },
  { header: '身份证正面', key: 'idCardFront' },
  { header: '身份证反面', key: 'idCardBack' },
  { header: '户口簿页', key: 'householdRegister' },
  { header: '出生医学证明影像', key: 'birthCertificate' },
  { header: '监护人身份证正面', key: 'guardianIdFront' },
  { header: '监护人身份证反面', key: 'guardianIdBack' },
  { header: '学生证/学籍证明', key: 'studentProof' },
  { header: '退役证', key: 'veteranCertificate' },
  { header: '安置或认定证明', key: 'placementProof' },
  { header: '劳动合同/就业证明', key: 'employmentProof' },
] as const satisfies Array<{ header: string; key: PhotoFieldKey }>;

const queryImportHeaders = [
  '登记编号',
  '姓名',
  '身份证号',
  '参保类型',
  '险种',
  '参保地',
  '参保状态',
  '提交日期',
  ...queryFieldColumns.map((item) => item.header),
  ...queryPhotoColumns.map((item) => item.header),
];

const modules = [
  { id: 'new', title: '新参保登记', icon: UserPlus, desc: '首次参加医保登记', color: 'from-blue-500 to-blue-600' },
  { id: 'renewal', title: '续保登记', icon: RefreshCcw, desc: '断缴后重新参保', color: 'from-cyan-500 to-cyan-600' },
  { id: 'urban_rural', title: '城乡居民参保', icon: Home, desc: '城乡居民参保登记', color: 'from-emerald-500 to-emerald-600' },
  { id: 'employee', title: '城镇职工参保', icon: Building2, desc: '单位职工参保登记', color: 'from-indigo-500 to-indigo-600' },
  { id: 'flexible', title: '灵活就业参保', icon: Briefcase, desc: '灵活就业人员参保', color: 'from-purple-500 to-purple-600' },
  { id: 'newborn', title: '新生儿参保', icon: Baby, desc: '出生医学证明参保', color: 'from-pink-500 to-pink-600' },
  { id: 'veteran', title: '退役军人参保', icon: ShieldCheck, desc: '退役军人身份参保', color: 'from-orange-500 to-orange-600' },
  { id: 'student', title: '学生参保', icon: GraduationCap, desc: '在校学生参保登记', color: 'from-teal-500 to-teal-600' },
  { id: 'batch', title: '批量参保导入', icon: Upload, desc: '单位批量导入参保', color: 'from-violet-500 to-violet-600' },
  { id: 'query', title: '参保信息查询', icon: Search, desc: '查询参保状态与档案', color: 'from-gray-500 to-gray-600' },
];

const stepTitles = [
  { id: 'basic', title: '基础信息' },
  { id: 'insurance', title: '参保信息' },
  { id: 'materials', title: '材料影像' },
  { id: 'confirm', title: '确认提交' },
];

const commonBasicFields: FormField[] = [
  { key: 'name', label: '姓名', required: true, placeholder: '请输入姓名' },
  { key: 'idCard', label: '身份证号', required: true, placeholder: '请输入身份证号' },
  { key: 'gender', label: '性别', required: true, type: 'select', options: ['男', '女'] },
  { key: 'birthDate', label: '出生日期', required: true, type: 'date' },
  { key: 'phone', label: '联系电话', required: true, placeholder: '请输入联系电话' },
  { key: 'householdAddress', label: '户籍地址', required: true, placeholder: '请输入户籍地址' },
  { key: 'residenceAddress', label: '居住地址', required: true, placeholder: '请输入居住地址' },
  { key: 'agency', label: '参保地', required: true, type: 'select', options: ['南京', '无锡', '徐州', '常州', '苏州', '南通', '连云港', '淮安', '盐城', '扬州', '镇江', '泰州', '宿迁'] },
];

const newbornCommonBasicFields: FormField[] = [
  { key: 'motherName', label: '母亲姓名', required: true, placeholder: '请输入母亲姓名' },
  { key: 'motherIdCard', label: '母亲身份证号', required: true, placeholder: '请输入母亲身份证号' },
  { key: 'gender', label: '性别', required: true, type: 'select', options: ['男', '女'] },
  { key: 'birthDate', label: '出生日期', required: true, type: 'date' },
  { key: 'phone', label: '联系电话', required: true, placeholder: '请输入联系电话' },
  { key: 'householdAddress', label: '户籍地址', required: true, placeholder: '请输入户籍地址' },
  { key: 'residenceAddress', label: '居住地址', required: true, placeholder: '请输入居住地址' },
  { key: 'agency', label: '参保地', required: true, type: 'select', options: ['南京', '无锡', '徐州', '常州', '苏州', '南通', '连云港', '淮安', '盐城', '扬州', '镇江', '泰州', '宿迁'] },
];

const commonInsuranceFields: FormField[] = [
  { key: 'insuranceType', label: '险种', required: true, type: 'select', options: ['职工基本医疗保险', '城乡居民基本医疗保险', '城乡居民大病保险', '长期护理保险', '医疗救助待遇保障'] },
  { key: 'enrollmentDate', label: '参保生效日期', required: true, type: 'date' },
  { key: 'identityType', label: '参保身份', required: true, placeholder: '请输入参保身份' },
];

const categoryFields: Record<EnrollmentCategory, { basic: FormField[]; insurance: FormField[]; photos: { key: PhotoFieldKey; label: string; required?: boolean }[] }> = {
  resident: {
    basic: [
      { key: 'householdType', label: '户籍性质', required: true, type: 'select', options: ['城镇居民', '农村居民'] },
      { key: 'community', label: '社区/村居', required: true, placeholder: '请输入社区或村居名称' },
    ],
    insurance: [
      { key: 'subsidyType', label: '财政补助类别', required: true, type: 'select', options: ['普通居民', '低保对象', '特困人员', '重度残疾人'] },
      { key: 'familyRelation', label: '家庭关系', placeholder: '如户主、配偶、子女' },
    ],
    photos: [
      { key: 'profilePhoto', label: '参保人照片', required: true },
      { key: 'idCardFront', label: '身份证正面', required: true },
      { key: 'idCardBack', label: '身份证反面', required: true },
      { key: 'householdRegister', label: '户口簿页', required: true },
    ],
  },
  employee: {
    basic: [
      { key: 'employerName', label: '单位名称', required: true, placeholder: '请输入单位名称' },
      { key: 'creditCode', label: '统一社会信用代码', required: true, placeholder: '请输入统一社会信用代码' },
    ],
    insurance: [
      { key: 'employmentType', label: '用工形式', required: true, type: 'select', options: ['正式在编', '合同制', '劳务派遣'] },
      { key: 'joinWorkDate', label: '参加工作时间', required: true, type: 'date' },
      { key: 'paymentBase', label: '缴费基数', required: true, placeholder: '请输入缴费基数' },
    ],
    photos: [
      { key: 'profilePhoto', label: '参保人照片', required: true },
      { key: 'idCardFront', label: '身份证正面', required: true },
      { key: 'idCardBack', label: '身份证反面', required: true },
      { key: 'employmentProof', label: '劳动合同/在职证明', required: true },
    ],
  },
  flexible: {
    basic: [
      { key: 'employmentForm', label: '就业形态', required: true, type: 'select', options: ['个体经营', '平台就业', '自由职业', '自主创业'] },
      { key: 'currentStatus', label: '当前就业状态', required: true, type: 'select', options: ['首次参保', '断保续保', '职工转灵活就业'] },
    ],
    insurance: [
      { key: 'paymentGrade', label: '缴费档次', required: true, type: 'select', options: ['60%', '80%', '100%', '300%'] },
      { key: 'declaredIncome', label: '收入申报口径', placeholder: '请输入月收入或年收入口径' },
    ],
    photos: [
      { key: 'profilePhoto', label: '参保人照片', required: true },
      { key: 'idCardFront', label: '身份证正面', required: true },
      { key: 'idCardBack', label: '身份证反面', required: true },
      { key: 'employmentProof', label: '经营/就业证明', required: true },
    ],
  },
  newborn: {
    basic: [
      { key: 'birthCertNo', label: '出生医学证明编号', required: true, placeholder: '请输入出生医学证明编号' },
      { key: 'guardianName', label: '监护人姓名', required: true, placeholder: '请输入监护人姓名' },
      { key: 'guardianRelation', label: '监护人关系', required: true, type: 'select', options: ['母亲', '父亲', '祖父母', '其他监护人'] },
      { key: 'guardianPhone', label: '监护人电话', required: true, placeholder: '请输入监护人电话' },
    ],
    insurance: [
      { key: 'fatherName', label: '父亲姓名', placeholder: '请输入父亲姓名' },
      { key: 'fatherIdCard', label: '父亲身份证号', placeholder: '请输入父亲身份证号' },
      { key: 'followInsured', label: '拟随父母参保', required: true, type: 'select', options: ['随父参保', '随母参保'] },
      { key: 'settlementStatus', label: '落户状态', required: true, type: 'select', options: ['已落户', '待落户'] },
    ],
    photos: [
      { key: 'profilePhoto', label: '新生儿照片', required: true },
      { key: 'birthCertificate', label: '出生医学证明', required: true },
      { key: 'guardianIdFront', label: '监护人身份证正面', required: true },
      { key: 'guardianIdBack', label: '监护人身份证反面', required: true },
      { key: 'householdRegister', label: '户口簿页', required: true },
    ],
  },
  veteran: {
    basic: [
      { key: 'veteranCertNo', label: '退役证编号', required: true, placeholder: '请输入退役证编号' },
      { key: 'retireDate', label: '退役时间', required: true, type: 'date' },
      { key: 'serviceType', label: '服役类别', required: true, type: 'select', options: ['义务兵', '士官', '军官', '文职人员'] },
    ],
    insurance: [
      { key: 'placementType', label: '安置方式', required: true, type: 'select', options: ['自主就业', '政府安排工作', '逐月领取退役金'] },
      { key: 'retireBureau', label: '退役军人事务认定单位', required: true, placeholder: '请输入认定单位' },
      { key: 'preferentialType', label: '优抚对象类别', type: 'select', options: ['普通退役军人', '重点优抚对象', '伤残军人'] },
    ],
    photos: [
      { key: 'profilePhoto', label: '本人照片', required: true },
      { key: 'idCardFront', label: '身份证正面', required: true },
      { key: 'idCardBack', label: '身份证反面', required: true },
      { key: 'veteranCertificate', label: '退役证', required: true },
      { key: 'placementProof', label: '安置或认定证明', required: true },
    ],
  },
  student: {
    basic: [
      { key: 'schoolName', label: '学校名称', required: true, placeholder: '请输入学校名称' },
      { key: 'schoolArea', label: '学校所在地', required: true, placeholder: '请输入学校所在地' },
      { key: 'studentNo', label: '学籍号', required: true, placeholder: '请输入学籍号' },
    ],
    insurance: [
      { key: 'educationStage', label: '学段', required: true, type: 'select', options: ['幼儿园', '小学', '初中', '高中', '中职', '大专', '本科', '研究生'] },
      { key: 'className', label: '班级', placeholder: '请输入班级' },
      { key: 'admissionDate', label: '入学日期', required: true, type: 'date' },
      { key: 'guardianName', label: '监护人姓名', required: true, placeholder: '请输入监护人姓名' },
      { key: 'guardianPhone', label: '监护人电话', required: true, placeholder: '请输入监护人电话' },
    ],
    photos: [
      { key: 'profilePhoto', label: '学生照片', required: true },
      { key: 'idCardFront', label: '身份证正面', required: true },
      { key: 'idCardBack', label: '身份证反面', required: true },
      { key: 'studentProof', label: '学生证/学籍证明', required: true },
      { key: 'householdRegister', label: '户口簿页', required: true },
    ],
  },
};

const categoryLabels: Record<EnrollmentCategory, string> = {
  resident: '城乡居民',
  employee: '城镇职工',
  flexible: '灵活就业',
  newborn: '新生儿',
  veteran: '退役军人',
  student: '学生',
};

const moduleCategoryMap: Partial<Record<string, EnrollmentCategory>> = {
  urban_rural: 'resident',
  employee: 'employee',
  flexible: 'flexible',
  newborn: 'newborn',
  veteran: 'veteran',
  student: 'student',
};

const initialRecords: RecordItem[] = [
  {
    id: 'EB20260426001',
    category: 'newborn',
    name: '陈沐恩',
    idCard: '320102202603180026',
    insuranceType: '城乡居民基本医疗保险',
    status: '待审核',
    agency: '南京',
    submitDate: '2026-04-26',
    basic: {
      gender: '男',
      birthDate: '2026-03-18',
      phone: '13851760021',
      householdAddress: '南京市秦淮区升州路138号',
      residenceAddress: '南京市秦淮区升州路138号',
      agency: '南京',
      birthCertNo: 'JS320100202603180026',
      guardianName: '陈晓雨',
      guardianRelation: '母亲',
      guardianPhone: '13851760022',
    },
    extra: {
      fatherName: '陈志远',
      fatherIdCard: '320102198907163219',
      motherName: '陈晓雨',
      motherIdCard: '320102199103128425',
      followInsured: '随母参保',
      settlementStatus: '已落户',
    },
    photos: {
      profilePhoto: true,
      birthCertificate: true,
      guardianIdFront: true,
      guardianIdBack: true,
      householdRegister: true,
    },
  },
  {
    id: 'EB20260425012',
    category: 'student',
    name: '沈语桐',
    idCard: '320111201109182846',
    insuranceType: '城乡居民基本医疗保险',
    status: '已生效',
    agency: '苏州',
    submitDate: '2026-04-25',
    basic: {
      gender: '女',
      birthDate: '2011-09-18',
      phone: '13962180016',
      householdAddress: '苏州市姑苏区十梓街98号',
      residenceAddress: '苏州市工业园区东沙湖路75号',
      agency: '苏州',
      schoolName: '苏州工业园区星海实验中学',
      schoolArea: '苏州工业园区',
      studentNo: 'SZXH202611023',
    },
    extra: {
      educationStage: '初中',
      className: '七年级（3）班',
      admissionDate: '2024-09-01',
      guardianName: '沈立峰',
      guardianPhone: '13962180019',
    },
    photos: {
      profilePhoto: true,
      idCardFront: true,
      idCardBack: true,
      studentProof: true,
      householdRegister: true,
    },
  },
  {
    id: 'EB20260424008',
    category: 'veteran',
    name: '顾承泽',
    idCard: '320621199112064517',
    insuranceType: '职工基本医疗保险',
    status: '待审核',
    agency: '南通',
    submitDate: '2026-04-24',
    basic: {
      gender: '男',
      birthDate: '1991-12-06',
      phone: '13862710028',
      householdAddress: '南通市崇川区人民中路110号',
      residenceAddress: '南通市崇川区工农路75号',
      agency: '南通',
      veteranCertNo: 'TYJR-NT-2025-0618',
      retireDate: '2025-06-30',
      serviceType: '士官',
    },
    extra: {
      placementType: '自主就业',
      retireBureau: '南通市退役军人事务局',
      preferentialType: '普通退役军人',
    },
    photos: {
      profilePhoto: true,
      idCardFront: true,
      idCardBack: true,
      veteranCertificate: true,
      placementProof: true,
    },
  },
  {
    id: 'EB20260423017',
    category: 'employee',
    name: '宋嘉禾',
    idCard: '320105198908154816',
    insuranceType: '职工基本医疗保险',
    status: '已生效',
    agency: '无锡',
    submitDate: '2026-04-23',
    basic: {
      gender: '男',
      birthDate: '1989-08-15',
      phone: '13861590031',
      householdAddress: '无锡市梁溪区人民中路166号',
      residenceAddress: '无锡市滨湖区太湖新城和风路22号',
      agency: '无锡',
      employerName: '无锡云联数据科技有限公司',
      creditCode: '91320200MA1M9X2R5F',
    },
    extra: {
      employmentType: '合同制',
      joinWorkDate: '2026-04-01',
      paymentBase: '9800',
    },
    photos: {
      profilePhoto: true,
      idCardFront: true,
      idCardBack: true,
      employmentProof: true,
    },
  },
];

const defaultPhotoState: Partial<Record<PhotoFieldKey, boolean>> = {};

function buildInitialForm(category: EnrollmentCategory): EnrollmentFormState {
  const basic: Record<string, string> = {};
  const insurance: Record<string, string> = {};

  const categoryCommonBasicFields = category === 'newborn' ? newbornCommonBasicFields : commonBasicFields;

  [...categoryCommonBasicFields, ...categoryFields[category].basic].forEach((field) => {
    basic[field.key] = field.type === 'select' && field.options?.length ? field.options[0] : '';
  });
  [...commonInsuranceFields, ...categoryFields[category].insurance].forEach((field) => {
    if (field.key === 'identityType') {
      insurance[field.key] = categoryLabels[category];
    } else {
      insurance[field.key] = field.type === 'select' && field.options?.length ? field.options[0] : '';
    }
  });

  return {
    basic,
    insurance,
    photos: { ...defaultPhotoState },
    biometrics: {
      fingerprint: false,
      faceScan: false,
      irisScan: false,
    },
  };
}

function renderField(
  field: FormField,
  value: string,
  onChange: (value: string) => void,
) {
  return (
    <div key={field.key}>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {field.label}
        {field.required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {field.type === 'select' ? (
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
        >
          {(field.options || []).map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      ) : (
        <input
          type={field.type || 'text'}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={field.placeholder}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
        />
      )}
    </div>
  );
}

export default function EnrollmentWorkbench() {
  const [selectedModule, setSelectedModule] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<EnrollmentCategory>('resident');
  const [formState, setFormState] = useState(buildInitialForm('resident'));
  const [queryKeyword, setQueryKeyword] = useState('');
  const [records, setRecords] = useState<RecordItem[]>(initialRecords);
  const [showSuccess, setShowSuccess] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<RecordItem | null>(null);
  const [queryImporting, setQueryImporting] = useState(false);
  const [batchFile, setBatchFile] = useState<File | null>(null);
  const [batchUploading, setBatchUploading] = useState(false);
  const [batchProgress, setBatchProgress] = useState(0);
  const [batchResults, setBatchResults] = useState<BatchImportRecord[] | null>(null);
  const queryImportInputRef = useRef<HTMLInputElement>(null);
  const batchFileInputRef = useRef<HTMLInputElement>(null);

  const activeCategory = useMemo<EnrollmentCategory>(() => {
    if (selectedModule && moduleCategoryMap[selectedModule]) {
      return moduleCategoryMap[selectedModule] as EnrollmentCategory;
    }
    return selectedCategory;
  }, [selectedModule, selectedCategory]);

  const categoryCommonBasicFields = activeCategory === 'newborn' ? newbornCommonBasicFields : commonBasicFields;
  const basicFields = [...categoryCommonBasicFields, ...categoryFields[activeCategory].basic];
  const insuranceFields = [...commonInsuranceFields, ...categoryFields[activeCategory].insurance];
  const photoFields = categoryFields[activeCategory].photos;

  const resetForm = () => {
    setSelectedModule(null);
    setCurrentStep(0);
    setSelectedCategory('resident');
    setFormState(buildInitialForm('resident'));
    setSelectedRecord(null);
    setBatchFile(null);
    setBatchUploading(false);
    setBatchProgress(0);
    setBatchResults(null);
  };

  const downloadBatchWorkbook = (rows: Array<Record<string, string>>, fileName: string) => {
    const worksheet = XLSX.utils.json_to_sheet(rows, { header: batchTemplateHeaders });
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, '参保批量导入');
    XLSX.writeFile(workbook, fileName);
  };

  const validateBatchRow = (row: Partial<BatchImportRow>, index: number): BatchImportRecord => {
    const name = String(row.姓名 || '').trim();
    const idCard = String(row.身份证号 || '').trim().toUpperCase();
    const phone = String(row.手机号 || '').trim();
    const category = String(row.参保类型 || '').trim();
    const insuranceType = String(row.险种 || '').trim();
    const agency = String(row.所属地 || '').trim();
    const messages: string[] = [];

    if (!name) messages.push('姓名不能为空');
    if (!/^\d{17}[\dX]$/.test(idCard)) messages.push('身份证号格式错误');
    if (!/^1\d{10}$/.test(phone)) messages.push('手机号格式错误');
    if (!batchCategoryOptions.includes(category)) messages.push('参保类型不在支持范围');
    if (!batchInsuranceOptions.includes(insuranceType)) messages.push('险种不在支持范围');
    if (!batchAgencyOptions.includes(agency)) messages.push('所属地不在江苏13市范围');

    return {
      row: index + 2,
      name,
      idCard,
      phone,
      category,
      insuranceType,
      agency,
      status: messages.length ? 'error' : 'success',
      message: messages.length ? messages.join('；') : '导入成功'
    };
  };

  const handleBatchFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setBatchFile(selectedFile);
      setBatchResults(null);
    }
  };

  const handleBatchDrop = (event: React.DragEvent) => {
    event.preventDefault();
    const droppedFile = event.dataTransfer.files[0];
    if (droppedFile && /\.(xlsx|xls|csv)$/i.test(droppedFile.name)) {
      setBatchFile(droppedFile);
      setBatchResults(null);
    }
  };

  const handleBatchTemplateDownload = () => {
    downloadBatchWorkbook(
      [{ 姓名: '', 身份证号: '', 手机号: '', 参保类型: '', 险种: '', 所属地: '' }],
      '参保批量导入模板.xlsx'
    );
  };

  const handleBatchSampleDownload = () => {
    downloadBatchWorkbook(batchSampleRows, '参保批量导入示例数据.xlsx');
  };

  const handleBatchResultsExport = (onlyErrors = false) => {
    if (!batchResults) return;
    const rows = (onlyErrors ? batchResults.filter((item) => item.status === 'error') : batchResults).map((item) => ({
      行号: String(item.row),
      姓名: item.name,
      身份证号: item.idCard,
      手机号: item.phone,
      参保类型: item.category,
      险种: item.insuranceType,
      所属地: item.agency,
      导入状态: item.status === 'success' ? '成功' : '失败',
      处理说明: item.message
    }));
    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, onlyErrors ? '失败记录' : '导入结果');
    XLSX.writeFile(workbook, onlyErrors ? '参保导入失败记录.xlsx' : '参保导入结果.xlsx');
  };

  const handleBatchUpload = async () => {
    if (!batchFile) return;
    setBatchUploading(true);
    setBatchProgress(20);

    try {
      const buffer = await batchFile.arrayBuffer();
      setBatchProgress(50);
      const workbook = XLSX.read(buffer, { type: 'array' });
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const rows = XLSX.utils.sheet_to_json<Partial<BatchImportRow>>(worksheet, { defval: '', raw: false });
      setBatchProgress(80);
      setBatchResults(rows.map((row, index) => validateBatchRow(row, index)));
      setBatchProgress(100);
    } catch (error) {
      setBatchResults([
        {
          row: 0,
          name: '',
          idCard: '',
          phone: '',
          category: '',
          insuranceType: '',
          agency: '',
          status: 'error',
          message: '文件解析失败，请检查 Excel 格式'
        }
      ]);
    } finally {
      setBatchUploading(false);
    }
  };

  const downloadQueryWorkbook = (rows: Array<Record<string, string>>, fileName: string) => {
    const worksheet = XLSX.utils.json_to_sheet(rows, { header: queryImportHeaders });
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, '参保信息查询');
    XLSX.writeFile(workbook, fileName);
  };

  const handleQueryTemplateDownload = () => {
    const emptyRow = queryImportHeaders.reduce<Record<string, string>>((acc, header) => {
      acc[header] = '';
      return acc;
    }, {});
    downloadQueryWorkbook([emptyRow], '参保信息查询导入模板.xlsx');
  };

  const normalizePhotoValue = (value: string) => ['是', '已上传', 'Y', 'YES', 'TRUE', '1'].includes(value.trim().toUpperCase());

  const exportQueryRecords = () => {
    const rows = filteredRecords.map((item) => {
      const row: Record<string, string> = {
        登记编号: item.id,
        姓名: item.name,
        身份证号: item.idCard,
        参保类型: categoryLabels[item.category],
        险种: item.insuranceType,
        参保地: item.agency,
        参保状态: item.status,
        提交日期: item.submitDate
      };

      queryFieldColumns.forEach(({ header, key }) => {
        row[header] = item.basic[key] || item.extra[key] || '';
      });

      queryPhotoColumns.forEach(({ header, key }) => {
        row[header] = item.photos[key] ? '已上传' : '未上传';
      });

      return row;
    });

    downloadQueryWorkbook(rows, `参保信息查询结果_${new Date().toISOString().slice(0, 10)}.xlsx`);
  };

  const handleQueryImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) return;

    setQueryImporting(true);

    try {
      const buffer = await selectedFile.arrayBuffer();
      const workbook = XLSX.read(buffer, { type: 'array' });
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const rows = XLSX.utils.sheet_to_json<Partial<QueryImportRow>>(worksheet, { defval: '', raw: false });
      const statusMap: Record<string, string> = {
        已生效: '已生效',
        待审核: '待审核',
        审核中: '待审核',
        暂停参保: '暂停参保'
      };
      const categoryMap: Record<string, EnrollmentCategory> = {
        城乡居民: 'resident',
        城镇职工: 'employee',
        灵活就业: 'flexible',
        新生儿: 'newborn',
        退役军人: 'veteran',
        学生: 'student'
      };

      const importedRecords = rows
        .filter((row) => String(row.姓名 || '').trim() && String(row.身份证号 || '').trim())
        .map((row, index) => {
          const categoryLabel = String(row.参保类型 || '').trim();
          const category = categoryMap[categoryLabel] || 'resident';
          const agency = String(row.参保地 || '').trim() || '南京';
          const status = statusMap[String(row.参保状态 || '').trim()] || '待审核';
          const id = String(row.登记编号 || '').trim() || `EBIMP${new Date().toISOString().slice(0, 10).replace(/-/g, '')}${String(index + 1).padStart(3, '0')}`;
          const name = String(row.姓名 || '').trim();
          const idCard = String(row.身份证号 || '').trim().toUpperCase();
          const insuranceType = String(row.险种 || '').trim() || '城乡居民基本医疗保险';
          const submitDate = String(row.提交日期 || '').trim() || new Date().toISOString().slice(0, 10);
          const importCommonBasicFields = category === 'newborn' ? newbornCommonBasicFields : commonBasicFields;
          const basicKeys = new Set([
            ...importCommonBasicFields.map((field) => field.key),
            ...categoryFields[category].basic.map((field) => field.key),
          ]);
          const extraKeys = new Set([
            ...commonInsuranceFields.map((field) => field.key),
            ...categoryFields[category].insurance.map((field) => field.key),
          ]);
          const basic: Record<string, string> = {
            name,
            idCard,
            agency,
          };
          const extra: Record<string, string> = {
            insuranceType,
          };
          const photos: Partial<Record<PhotoFieldKey, boolean>> = {};

          queryFieldColumns.forEach(({ header, key }) => {
            const value = String(row[header] || '').trim();
            if (!value) return;
            if (basicKeys.has(key)) {
              basic[key] = value;
              return;
            }
            if (extraKeys.has(key)) {
              extra[key] = value;
            }
          });

          queryPhotoColumns.forEach(({ header, key }) => {
            const value = String(row[header] || '').trim();
            if (!value) return;
            photos[key] = normalizePhotoValue(value);
          });

          return {
            id,
            category,
            name,
            idCard,
            insuranceType,
            status,
            agency,
            submitDate,
            basic,
            extra,
            photos,
          } as RecordItem;
        });

      if (importedRecords.length) {
        setRecords((prev) => [...importedRecords, ...prev]);
      }
    } finally {
      setQueryImporting(false);
      event.target.value = '';
    }
  };

  const openModule = (moduleId: string) => {
    setSelectedModule(moduleId);
    setCurrentStep(0);
    const presetCategory = moduleCategoryMap[moduleId] || 'resident';
    setSelectedCategory(presetCategory as EnrollmentCategory);
    setFormState(buildInitialForm(presetCategory as EnrollmentCategory));
  };

  const updateBasic = (key: string, value: string) => {
    setFormState((prev) => ({ ...prev, basic: { ...prev.basic, [key]: value } }));
  };

  const updateInsurance = (key: string, value: string) => {
    setFormState((prev) => ({ ...prev, insurance: { ...prev.insurance, [key]: value } }));
  };

  const togglePhoto = (key: PhotoFieldKey) => {
    setFormState((prev) => ({ ...prev, photos: { ...prev.photos, [key]: !prev.photos[key] } }));
  };

  const captureBiometric = (type: 'fingerprint' | 'faceScan' | 'irisScan') => {
    setFormState((prev) => ({
      ...prev,
      biometrics: {
        ...prev.biometrics,
        [type]: !prev.biometrics[type],
      },
    }));
  };

  const filteredRecords = records.filter(
    (item) => item.name.includes(queryKeyword) || item.idCard.includes(queryKeyword) || item.id.includes(queryKeyword),
  );

  const isStepValid = (step: number) => {
    if (step === 0) {
      return basicFields.every((field) => !field.required || Boolean(formState.basic[field.key]));
    }
    if (step === 1) {
      return insuranceFields.every((field) => !field.required || Boolean(formState.insurance[field.key]));
    }
    if (step === 2) {
      return photoFields.every((field) => !field.required || Boolean(formState.photos[field.key]));
    }
    return true;
  };

  const submitEnrollment = () => {
    const newRecord: RecordItem = {
      id: `EB${new Date().toISOString().slice(0, 10).replace(/-/g, '')}${String(records.length + 1).padStart(3, '0')}`,
      category: activeCategory,
      name: activeCategory === 'newborn' ? `新生儿（母亲：${formState.basic.motherName || '未填写'}）` : formState.basic.name || '未命名',
      idCard: activeCategory === 'newborn' ? '未赋码' : formState.basic.idCard || '',
      insuranceType: formState.insurance.insuranceType || '',
      status: '待审核',
      agency: formState.basic.agency || '',
      submitDate: new Date().toISOString().split('T')[0],
      basic: formState.basic,
      extra: formState.insurance,
      photos: formState.photos,
      biometrics: formState.biometrics,
    };
    setRecords((prev) => [newRecord, ...prev]);
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      resetForm();
    }, 1800);
  };

  const renderCategorySelector = () => {
    if (selectedModule !== 'new' && selectedModule !== 'renewal') return null;
    return (
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">登记对象类型</label>
        <div className="grid grid-cols-3 gap-3">
          {(Object.keys(categoryLabels) as EnrollmentCategory[]).map((category) => (
            <button
              key={category}
              onClick={() => {
                setSelectedCategory(category);
                setFormState(buildInitialForm(category));
              }}
              className={`px-4 py-3 rounded-xl border text-sm font-medium ${
                activeCategory === category ? 'border-cyan-500 bg-cyan-50 text-cyan-700' : 'border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              {categoryLabels[category]}
            </button>
          ))}
        </div>
      </div>
    );
  };

  const renderBasicStep = () => (
    <div className="space-y-6">
      {renderCategorySelector()}
      <div className="grid grid-cols-2 gap-4">
        {basicFields.map((field) => renderField(field, formState.basic[field.key] || '', (value) => updateBasic(field.key, value)))}
      </div>
    </div>
  );

  const renderInsuranceStep = () => (
    <div className="space-y-6">
      <div className="bg-cyan-50 border border-cyan-100 rounded-xl p-4 text-sm text-cyan-800">
        当前登记对象：{categoryLabels[activeCategory]}。请根据对象类型补充专属参保信息，系统将按对象口径生成经办审核材料。
      </div>
      <div className="grid grid-cols-2 gap-4">
        {insuranceFields.map((field) => renderField(field, formState.insurance[field.key] || '', (value) => updateInsurance(field.key, value)))}
      </div>
    </div>
  );

  const renderMaterialsStep = () => (
    <div className="space-y-6">
      <div className="rounded-xl border border-cyan-100 bg-cyan-50 p-4">
        <h4 className="font-semibold text-cyan-800">材料影像与现场采集</h4>
        <p className="mt-1 text-sm text-cyan-700">先上传本次参保所需影像材料，再补充现场拍照和生物识别采集信息。</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {photoFields.map((photo) => (
          <div key={photo.key} className={`rounded-xl border p-4 ${formState.photos[photo.key] ? 'border-green-300 bg-green-50' : 'border-gray-200 bg-white'}`}>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${formState.photos[photo.key] ? 'bg-green-100' : 'bg-gray-100'}`}>
                  {photo.key === 'profilePhoto' ? <Camera className={`w-5 h-5 ${formState.photos[photo.key] ? 'text-green-600' : 'text-gray-500'}`} /> : <FileText className={`w-5 h-5 ${formState.photos[photo.key] ? 'text-green-600' : 'text-gray-500'}`} />}
                </div>
                <div>
                  <p className="font-medium text-gray-800">
                    {photo.label}
                    {photo.required && <span className="text-red-500 ml-1">*</span>}
                  </p>
                  <p className="text-xs text-gray-500">{formState.photos[photo.key] ? '已上传影像材料' : '点击模拟上传材料'}</p>
                </div>
              </div>
              {formState.photos[photo.key] && <CheckCircle className="w-5 h-5 text-green-600" />}
            </div>
            <button
              onClick={() => togglePhoto(photo.key)}
              className={`mt-4 px-4 py-2 rounded-lg text-sm ${formState.photos[photo.key] ? 'bg-white border border-green-300 text-green-700' : 'bg-cyan-600 text-white'}`}
            >
              {formState.photos[photo.key] ? '撤销上传' : '上传材料'}
            </button>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-5">
        <div className="mb-4 flex items-center gap-2">
          <Camera className="w-5 h-5 text-cyan-600" />
          <h4 className="font-semibold text-gray-800">现场拍照</h4>
        </div>
        <div className={`rounded-xl border p-4 ${formState.photos.profilePhoto ? 'border-green-300 bg-green-50' : 'border-dashed border-gray-300 bg-gray-50'}`}>
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="font-medium text-gray-800">参保人现场照片</p>
              <p className="mt-1 text-sm text-gray-500">
                {formState.photos.profilePhoto ? '已完成现场拍照，可撤销后重新采集。' : '点击下方按钮模拟现场拍照留档。'}
              </p>
            </div>
            {formState.photos.profilePhoto && <CheckCircle className="w-5 h-5 text-green-600" />}
          </div>
          <button
            onClick={() => togglePhoto('profilePhoto')}
            className={`mt-4 inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm ${
              formState.photos.profilePhoto ? 'border border-green-300 bg-white text-green-700' : 'bg-cyan-600 text-white'
            }`}
          >
            <Camera className="w-4 h-4" />
            {formState.photos.profilePhoto ? '重拍照片' : '开始拍照'}
          </button>
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-5">
        <div className="mb-4 flex items-center gap-2">
          <Fingerprint className="w-5 h-5 text-cyan-600" />
          <h4 className="font-semibold text-gray-800">生物识别采集</h4>
        </div>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          {[
            {
              key: 'fingerprint' as const,
              title: '指纹采集',
              desc: '采集参保人指纹信息，用于实名核验。',
              icon: Fingerprint,
              active: formState.biometrics.fingerprint,
              primary: true,
            },
            {
              key: 'faceScan' as const,
              title: '人脸采集',
              desc: '采集现场人脸图像，用于经办身份比对。',
              icon: ScanFace,
              active: formState.biometrics.faceScan,
              primary: true,
            },
            {
              key: 'irisScan' as const,
              title: '虹膜采集',
              desc: '可选采集项，用于增强身份核验能力。',
              icon: Eye,
              active: formState.biometrics.irisScan,
              primary: false,
            },
          ].map((item) => (
            <div key={item.key} className={`rounded-xl border-2 p-5 transition ${item.active ? 'border-green-400 bg-green-50' : 'border-gray-200 bg-white'}`}>
              <div className="text-center">
                <div className={`mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full ${item.active ? 'bg-green-100' : 'bg-gray-100'}`}>
                  <item.icon className={`w-7 h-7 ${item.active ? 'text-green-600' : 'text-gray-400'}`} />
                </div>
                <p className="font-medium text-gray-800">{item.title}</p>
                <p className="mt-2 text-sm text-gray-500">{item.desc}</p>
                {item.primary && <p className="mt-2 text-xs text-red-500">建议至少完成指纹或人脸其中一项</p>}
                <button
                  onClick={() => captureBiometric(item.key)}
                  className={`mt-4 rounded-lg px-4 py-2 text-sm ${item.active ? 'border border-green-300 bg-white text-green-700' : 'bg-cyan-600 text-white'}`}
                >
                  {item.active ? '已采集，点击重采' : '开始采集'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderConfirmStep = () => (
    <div className="space-y-6">
      <div className="bg-gray-50 rounded-xl p-5">
        <h4 className="font-semibold text-gray-800 mb-4">基础信息</h4>
        <div className="grid grid-cols-2 gap-3 text-sm">
          {basicFields.map((field) => (
            <div key={field.key} className="flex justify-between border-b border-gray-200 py-2 gap-4">
              <span className="text-gray-500">{field.label}</span>
              <span className="font-medium text-gray-800 text-right">{formState.basic[field.key] || '-'}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="bg-gray-50 rounded-xl p-5">
        <h4 className="font-semibold text-gray-800 mb-4">参保信息</h4>
        <div className="grid grid-cols-2 gap-3 text-sm">
          {insuranceFields.map((field) => (
            <div key={field.key} className="flex justify-between border-b border-gray-200 py-2 gap-4">
              <span className="text-gray-500">{field.label}</span>
              <span className="font-medium text-gray-800 text-right">{formState.insurance[field.key] || '-'}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="bg-gray-50 rounded-xl p-5">
        <h4 className="font-semibold text-gray-800 mb-4">材料影像</h4>
        <div className="grid grid-cols-2 gap-3 text-sm">
          {photoFields.map((photo) => (
            <div key={photo.key} className="flex justify-between border-b border-gray-200 py-2">
              <span className="text-gray-500">{photo.label}</span>
              <span className={formState.photos[photo.key] ? 'text-green-600 font-medium' : 'text-red-500'}>
                {formState.photos[photo.key] ? '已上传' : '未上传'}
              </span>
            </div>
          ))}
        </div>
      </div>
      <div className="bg-gray-50 rounded-xl p-5">
        <h4 className="font-semibold text-gray-800 mb-4">现场采集</h4>
        <div className="grid grid-cols-2 gap-3 text-sm">
          {[
            { label: '现场拍照', value: formState.photos.profilePhoto },
            { label: '指纹采集', value: formState.biometrics.fingerprint },
            { label: '人脸采集', value: formState.biometrics.faceScan },
            { label: '虹膜采集', value: formState.biometrics.irisScan },
          ].map((item) => (
            <div key={item.label} className="flex justify-between border-b border-gray-200 py-2">
              <span className="text-gray-500">{item.label}</span>
              <span className={item.value ? 'text-green-600 font-medium' : 'text-red-500'}>
                {item.value ? '已完成' : '未采集'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderEnrollmentFlow = () => (
    <>
      <div className="flex items-center justify-between mb-8">
        {stepTitles.map((step, index) => (
          <React.Fragment key={step.id}>
            <div className="flex flex-col items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${index <= currentStep ? 'bg-cyan-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
                {index < currentStep ? <CheckCircle className="w-5 h-5" /> : index + 1}
              </div>
              <span className={`mt-2 text-xs ${index <= currentStep ? 'text-cyan-700' : 'text-gray-400'}`}>{step.title}</span>
            </div>
            {index < stepTitles.length - 1 && <div className="flex-1 h-1 mx-2 rounded bg-gray-200"><div className={`h-1 rounded bg-cyan-600 ${index < currentStep ? 'w-full' : 'w-0'}`} /></div>}
          </React.Fragment>
        ))}
      </div>
      <div className="min-h-[380px]">
        {currentStep === 0 && renderBasicStep()}
        {currentStep === 1 && renderInsuranceStep()}
        {currentStep === 2 && renderMaterialsStep()}
        {currentStep === 3 && renderConfirmStep()}
      </div>
    </>
  );

  const renderQuery = () => (
    <div className="space-y-5">
      <input
        ref={queryImportInputRef}
        type="file"
        accept=".xlsx,.xls,.csv"
        onChange={handleQueryImport}
        className="hidden"
      />

      <div className="grid grid-cols-4 gap-4">
        <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
          <p className="text-sm text-gray-500">参保记录</p>
          <p className="mt-2 text-3xl font-bold text-gray-800">{records.length}</p>
        </div>
        <div className="rounded-2xl border border-green-200 bg-green-50 p-4">
          <p className="text-sm text-green-700">已生效</p>
          <p className="mt-2 text-3xl font-bold text-green-600">{records.filter((item) => item.status === '已生效').length}</p>
        </div>
        <div className="rounded-2xl border border-yellow-200 bg-yellow-50 p-4">
          <p className="text-sm text-yellow-700">待审核</p>
          <p className="mt-2 text-3xl font-bold text-yellow-600">{records.filter((item) => item.status === '待审核').length}</p>
        </div>
        <div className="rounded-2xl border border-cyan-200 bg-cyan-50 p-4">
          <p className="text-sm text-cyan-700">当前结果</p>
          <p className="mt-2 text-3xl font-bold text-cyan-600">{filteredRecords.length}</p>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-5">
        <div className="flex items-center justify-between gap-4">
          <div className="flex flex-1 gap-3">
            <input
              value={queryKeyword}
              onChange={(e) => setQueryKeyword(e.target.value)}
              className="flex-1 rounded-lg border border-gray-300 px-4 py-2"
              placeholder="请输入姓名、身份证号或登记编号查询"
            />
            <button
              onClick={() => setQueryKeyword('')}
              className="rounded-lg border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50"
            >
              重置
            </button>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleQueryTemplateDownload}
              className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50"
            >
              <Download className="h-4 w-4" />
              下载导入模板
            </button>
            <button
              onClick={() => queryImportInputRef.current?.click()}
              className="inline-flex items-center gap-2 rounded-lg border border-cyan-300 px-4 py-2 text-cyan-700 hover:bg-cyan-50"
            >
              <Upload className="h-4 w-4" />
              {queryImporting ? '导入中...' : '导入参保台账'}
            </button>
            <button
              onClick={exportQueryRecords}
              className="inline-flex items-center gap-2 rounded-lg bg-cyan-600 px-4 py-2 text-white hover:bg-cyan-700"
            >
              <Download className="h-4 w-4" />
              导出查询结果
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div className="border-b border-gray-200 px-5 py-4">
          <h4 className="text-lg font-semibold text-gray-800">参保信息台账</h4>
          <p className="mt-1 text-sm text-gray-500">支持经办查询、Excel 导入补录、结果导出</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1200px]">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">登记编号</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">姓名</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">身份证号</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">对象类型</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">险种</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">参保地</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">提交日期</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">状态</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">操作</th>
              </tr>
            </thead>
            <tbody>
              {filteredRecords.map((item) => (
                <tr key={item.id} className="border-t border-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-700">{item.id}</td>
                  <td className="px-4 py-3 text-sm font-medium text-gray-800">{item.name}</td>
                  <td className="px-4 py-3 text-sm text-gray-600 font-mono">{item.idCard}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{categoryLabels[item.category]}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{item.insuranceType}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{item.agency}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{item.submitDate}</td>
                  <td className="px-4 py-3 text-sm">
                    <span className={`px-2 py-1 rounded text-xs ${item.status === '已生效' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <button onClick={() => setSelectedRecord(item)} className="text-cyan-600 hover:text-cyan-700">
                      查看详情
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderBatch = () => {
    const successCount = batchResults?.filter((record) => record.status === 'success').length || 0;
    const errorCount = batchResults?.filter((record) => record.status === 'error').length || 0;

    if (batchResults) {
      return (
        <div className="space-y-6">
          <div className="grid grid-cols-3 gap-4">
            <div className="rounded-2xl border border-gray-200 bg-gray-50 p-5">
              <p className="text-sm text-gray-500">总记录数</p>
              <p className="mt-2 text-3xl font-bold text-gray-800">{batchResults.length}</p>
            </div>
            <div className="rounded-2xl border border-green-200 bg-green-50 p-5">
              <p className="text-sm text-green-700">导入成功</p>
              <p className="mt-2 text-3xl font-bold text-green-600">{successCount}</p>
            </div>
            <div className="rounded-2xl border border-red-200 bg-red-50 p-5">
              <p className="text-sm text-red-700">导入失败</p>
              <p className="mt-2 text-3xl font-bold text-red-600">{errorCount}</p>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200 overflow-hidden">
            <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
              <div>
                <h4 className="text-lg font-semibold text-gray-800">导入校验结果</h4>
                <p className="text-sm text-gray-500">支持导出全部结果或仅导出失败记录</p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleBatchResultsExport(false)}
                  className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                >
                  <Download className="h-4 w-4" />
                  导出结果
                </button>
                <button
                  onClick={() => handleBatchResultsExport(true)}
                  className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-700"
                >
                  <Download className="h-4 w-4" />
                  导出失败记录
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[1080px]">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">行号</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">姓名</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">身份证号</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">手机号</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">参保类型</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">险种</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">所属地</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">状态</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">说明</th>
                  </tr>
                </thead>
                <tbody>
                  {batchResults.map((record) => (
                    <tr key={`${record.row}-${record.idCard}`} className="border-t border-gray-100">
                      <td className="px-4 py-3 text-sm text-gray-600">{record.row}</td>
                      <td className="px-4 py-3 text-sm font-medium text-gray-800">{record.name || '-'}</td>
                      <td className="px-4 py-3 text-sm text-gray-600 font-mono">{record.idCard || '-'}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{record.phone || '-'}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{record.category || '-'}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{record.insuranceType || '-'}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{record.agency || '-'}</td>
                      <td className="px-4 py-3 text-sm">
                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium ${
                            record.status === 'success'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-red-100 text-red-700'
                          }`}
                        >
                          {record.status === 'success' ? <Check className="h-3.5 w-3.5" /> : <AlertCircle className="h-3.5 w-3.5" />}
                          {record.status === 'success' ? '成功' : '失败'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">{record.message}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <button
              onClick={() => {
                setBatchResults(null);
                setBatchFile(null);
                setBatchProgress(0);
              }}
              className="rounded-lg border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50"
            >
              继续导入
            </button>
            <button
              onClick={resetForm}
              className="rounded-lg bg-cyan-600 px-5 py-2 text-white hover:bg-cyan-700"
            >
              完成
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <div className="rounded-2xl border border-cyan-200 bg-cyan-50 p-5">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h4 className="text-lg font-semibold text-cyan-900">批量参保导入</h4>
              <p className="mt-1 text-sm text-cyan-700">按模板整理参保人员基础信息，支持江苏省 13 个设区市参保数据校验</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleBatchTemplateDownload}
                className="inline-flex items-center gap-2 rounded-lg border border-cyan-300 bg-white px-4 py-2 text-sm text-cyan-700 hover:bg-cyan-50"
              >
                <Download className="h-4 w-4" />
                下载模板
              </button>
              <button
                onClick={handleBatchSampleDownload}
                className="inline-flex items-center gap-2 rounded-lg bg-cyan-600 px-4 py-2 text-sm text-white hover:bg-cyan-700"
              >
                <Download className="h-4 w-4" />
                下载示例数据
              </button>
            </div>
          </div>
        </div>

        <div
          onDrop={handleBatchDrop}
          onDragOver={(event) => event.preventDefault()}
          className={`rounded-2xl border-2 border-dashed p-10 text-center transition-all ${
            batchFile ? 'border-green-400 bg-green-50' : 'border-gray-300 hover:border-cyan-400'
          }`}
        >
          <input
            ref={batchFileInputRef}
            type="file"
            accept=".xlsx,.xls,.csv"
            onChange={handleBatchFileSelect}
            className="hidden"
          />

          {batchFile ? (
            <div className="space-y-4">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-100">
                <FileText className="h-7 w-7 text-green-600" />
              </div>
              <div>
                <p className="text-base font-semibold text-gray-800">{batchFile.name}</p>
                <p className="mt-1 text-sm text-gray-500">{(batchFile.size / 1024).toFixed(2)} KB</p>
              </div>
              <button
                onClick={() => batchFileInputRef.current?.click()}
                className="rounded-lg border border-green-300 px-4 py-2 text-sm text-green-700 hover:bg-green-100"
              >
                重新选择
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gray-100">
                <Upload className="h-7 w-7 text-gray-400" />
              </div>
              <div>
                <p className="text-base font-semibold text-gray-800">选择或拖拽 Excel 文件到这里</p>
                <p className="mt-1 text-sm text-gray-500">支持 `.xlsx`、`.xls`、`.csv` 格式</p>
              </div>
              <button
                onClick={() => batchFileInputRef.current?.click()}
                className="rounded-lg bg-cyan-600 px-5 py-2 text-white hover:bg-cyan-700"
              >
                选择导入文件
              </button>
            </div>
          )}
        </div>

        <div className="rounded-2xl border border-gray-200 bg-gray-50 p-5 text-sm text-gray-600">
          <div className="grid grid-cols-2 gap-3">
            <div>必填字段：姓名、身份证号、手机号、参保类型、险种、所属地。</div>
            <div>所属地统一按南京、无锡、徐州、常州、苏州、南通、连云港、淮安、盐城、扬州、镇江、泰州、宿迁填写。</div>
            <div>参保类型支持：城乡居民、城镇职工、灵活就业、新生儿、退役军人、学生。</div>
            <div>险种支持：城乡居民基本医疗保险、职工基本医疗保险、大病医疗保险、长期护理保险。</div>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <button
            onClick={resetForm}
            className="rounded-lg border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50"
          >
            取消
          </button>
          <button
            onClick={handleBatchUpload}
            disabled={!batchFile || batchUploading}
            className="inline-flex items-center gap-2 rounded-lg bg-cyan-600 px-5 py-2 text-white hover:bg-cyan-700 disabled:cursor-not-allowed disabled:bg-gray-300"
          >
            {batchUploading ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                导入中 {batchProgress}%
              </>
            ) : (
              <>
                <Upload className="h-4 w-4" />
                开始导入
              </>
            )}
          </button>
        </div>
      </div>
    );
  };

  const getRecordFieldLabel = (category: EnrollmentCategory, key: string) => {
    const fieldMap = new Map<string, string>();

    const recordCommonBasicFields = category === 'newborn' ? newbornCommonBasicFields : commonBasicFields;

    [...recordCommonBasicFields, ...categoryFields[category].basic, ...commonInsuranceFields, ...categoryFields[category].insurance].forEach((field) => {
      fieldMap.set(field.key, field.label);
    });

    return fieldMap.get(key) || key;
  };

  const getRecordPhotoLabel = (category: EnrollmentCategory, key: string) => {
    const photo = categoryFields[category].photos.find((item) => item.key === key);
    return photo?.label || key;
  };

  const renderRecordEntries = (
    category: EnrollmentCategory,
    entries: Array<[string, string]>,
  ) => {
    if (!entries.length) {
      return <div className="text-sm text-gray-400">暂无数据</div>;
    }

    return (
      <div className="grid grid-cols-2 gap-3 text-sm">
        {entries.map(([key, value]) => (
          <div key={key} className="flex justify-between border-b border-gray-100 py-2 gap-4">
            <span className="text-gray-500">{getRecordFieldLabel(category, key)}</span>
            <span className="font-medium text-gray-800 text-right">{value || '-'}</span>
          </div>
        ))}
      </div>
    );
  };

  const renderRecordPhotos = (record: RecordItem) => {
    const requiredPhotos = categoryFields[record.category].photos;

    return (
      <div className="grid grid-cols-2 gap-3 text-sm">
        {requiredPhotos.map((photo) => (
          <div key={photo.key} className="flex justify-between border-b border-gray-100 py-2">
            <span className="text-gray-500">
              {photo.label}
              {photo.required && <span className="ml-1 text-red-500">*</span>}
            </span>
            <span className={record.photos[photo.key] ? 'font-medium text-green-600' : 'font-medium text-red-500'}>
              {record.photos[photo.key] ? '已上传' : '未上传'}
            </span>
          </div>
        ))}
      </div>
    );
  };

  const renderRecordBiometrics = (record: RecordItem) => {
    const biometrics = record.biometrics || {};
    return (
      <div className="grid grid-cols-2 gap-3 text-sm">
        {[
          { label: '现场拍照', value: record.photos.profilePhoto },
          { label: '指纹采集', value: biometrics.fingerprint },
          { label: '人脸采集', value: biometrics.faceScan },
          { label: '虹膜采集', value: biometrics.irisScan },
        ].map((item) => (
          <div key={item.label} className="flex justify-between border-b border-gray-100 py-2">
            <span className="text-gray-500">{item.label}</span>
            <span className={item.value ? 'font-medium text-green-600' : 'font-medium text-red-500'}>
              {item.value ? '已完成' : '未采集'}
            </span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">参保登记工作台</h2>
          <p className="text-base text-gray-500 mt-2">按参保对象类型分字段登记，支持证件材料和照片影像留档</p>
        </div>
        <div className="flex items-center gap-6 text-base text-gray-500">
          <span>今日办理: 156笔</span>
          <span>待审核: 23笔</span>
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
              onClick={() => openModule(module.id)}
              className="group bg-white rounded-2xl p-8 shadow-md border border-gray-200 hover:shadow-2xl hover:border-cyan-400 hover:-translate-y-1 transition-all text-left"
            >
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
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className={`bg-white rounded-2xl shadow-2xl w-full max-h-[90vh] overflow-auto ${
                selectedModule === 'query' ? 'max-w-7xl' : selectedModule === 'batch' ? 'max-w-6xl' : 'max-w-5xl'
              }`}
            >
              <div className="p-6 border-b flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-800">
                  {modules.find((m) => m.id === selectedModule)?.title}
                  {selectedModule !== 'query' && selectedModule !== 'batch' ? ` / ${categoryLabels[activeCategory]}` : ''}
                </h3>
                <button onClick={resetForm} className="p-2 hover:bg-gray-100 rounded-lg"><X className="w-5 h-5" /></button>
              </div>
              <div className="p-6">
                {selectedModule === 'query' ? renderQuery() : selectedModule === 'batch' ? renderBatch() : renderEnrollmentFlow()}
              </div>
              {selectedModule !== 'query' && selectedModule !== 'batch' && (
                <div className="p-6 border-t flex justify-between">
                  <button onClick={resetForm} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">取消</button>
                  <div className="flex gap-3">
                    {currentStep > 0 && (
                      <button onClick={() => setCurrentStep((prev) => prev - 1)} className="px-4 py-2 border rounded-lg hover:bg-gray-50 flex items-center gap-1">
                        <ChevronLeft className="w-4 h-4" />上一步
                      </button>
                    )}
                    {currentStep < stepTitles.length - 1 ? (
                      <button
                        onClick={() => setCurrentStep((prev) => prev + 1)}
                        disabled={!isStepValid(currentStep)}
                        className="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 disabled:opacity-50 flex items-center gap-2"
                      >
                        下一步 <ChevronRight className="w-4 h-4" />
                      </button>
                    ) : (
                      <button onClick={submitEnrollment} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2">
                        <CheckCircle className="w-4 h-4" />提交登记
                      </button>
                    )}
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedRecord && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setSelectedRecord(null)}>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} onClick={(e) => e.stopPropagation()} className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[88vh] overflow-auto p-6">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h3 className="text-xl font-bold text-gray-800">{selectedRecord.name}</h3>
                  <p className="text-sm text-gray-500">{selectedRecord.id} / {categoryLabels[selectedRecord.category]}</p>
                </div>
                <button onClick={() => setSelectedRecord(null)} className="p-2 hover:bg-gray-100 rounded-lg"><X className="w-5 h-5" /></button>
              </div>

              <div className="grid grid-cols-4 gap-4 mb-6">
                <div className="rounded-xl border border-gray-200 p-4 bg-gray-50">
                  <p className="text-xs text-gray-500 mb-1">参保状态</p>
                  <p className="font-semibold text-gray-800">{selectedRecord.status}</p>
                </div>
                <div className="rounded-xl border border-gray-200 p-4 bg-gray-50">
                  <p className="text-xs text-gray-500 mb-1">参保地</p>
                  <p className="font-semibold text-gray-800">{selectedRecord.agency}</p>
                </div>
                <div className="rounded-xl border border-gray-200 p-4 bg-gray-50">
                  <p className="text-xs text-gray-500 mb-1">险种</p>
                  <p className="font-semibold text-gray-800">{selectedRecord.insuranceType}</p>
                </div>
                <div className="rounded-xl border border-gray-200 p-4 bg-gray-50">
                  <p className="text-xs text-gray-500 mb-1">影像材料</p>
                  <p className="font-semibold text-gray-800">
                    {Object.values(selectedRecord.photos).filter(Boolean).length}/{categoryFields[selectedRecord.category].photos.length}
                  </p>
                </div>
              </div>

              <div className="space-y-5">
                <div className="rounded-xl border border-gray-200 p-5">
                  <h4 className="font-semibold text-gray-800 mb-4 flex items-center gap-2"><CreditCard className="w-4 h-4 text-cyan-600" />基础信息</h4>
                  {renderRecordEntries(
                    selectedRecord.category,
                    Object.entries(selectedRecord.basic),
                  )}
                </div>

                <div className="rounded-xl border border-gray-200 p-5">
                  <h4 className="font-semibold text-gray-800 mb-4 flex items-center gap-2"><FileText className="w-4 h-4 text-cyan-600" />专属信息</h4>
                  {renderRecordEntries(
                    selectedRecord.category,
                    Object.entries(selectedRecord.extra),
                  )}
                </div>

                  <div className="rounded-xl border border-gray-200 p-5">
                    <h4 className="font-semibold text-gray-800 mb-4">影像材料</h4>
                    {renderRecordPhotos(selectedRecord)}
                  </div>

                  <div className="rounded-xl border border-gray-200 p-5">
                    <h4 className="font-semibold text-gray-800 mb-4">现场采集</h4>
                    {renderRecordBiometrics(selectedRecord)}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
      </AnimatePresence>

      <AnimatePresence>
        {showSuccess && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-white rounded-2xl p-8 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"><CheckCircle className="w-8 h-8 text-green-600" /></div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">登记提交成功</h3>
              <p className="text-gray-600">参保登记已进入经办审核队列</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
