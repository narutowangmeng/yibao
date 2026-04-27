import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Building2, FileCheck, Award, LogOut, Plus, Search, Stethoscope, Pill, Edit2, Trash2 } from 'lucide-react';
import { getAgencyLevel } from '../../../config/managementPermissions';

const tabs = [
  { id: 'access', label: '医院', icon: Building2 },
  { id: 'classification', label: '药店', icon: Award },
  { id: 'physician', label: '医保医师', icon: Stethoscope },
  { id: 'pharmacist', label: '医保药师', icon: Pill },
  { id: 'agreement', label: '协议管理', icon: FileCheck },
  { id: 'assessment', label: '机构考核', icon: Award },
  { id: 'exit', label: '退出管理', icon: LogOut },
];

interface Hospital {
  id: string;
  name: string;
  hospitalType: string;
  level: string;
  ownership: string;
  region: string;
  beds: number;
  physicians: number;
  annualVolume: string;
  status: '正常' | '待准入' | '暂停协议';
}

interface Pharmacy {
  id: string;
  name: string;
  pharmacyType: string;
  qualification: string;
  region: string;
  chainBrand: string;
  pharmacistCount: number;
  specialDrug: string;
  status: '正常' | '待评估' | '暂停服务';
}

interface Physician {
  id: string;
  name: string;
  gender: string;
  title: string;
  department: string;
  institution: string;
  licenseNo: string;
  creditScore: number;
  status: '正常' | '暂停';
}

interface Pharmacist {
  id: string;
  name: string;
  gender: string;
  title: string;
  institution: string;
  licenseNo: string;
  creditScore: number;
  status: '正常' | '暂停';
}

interface AgreementItem {
  id: string;
  institutionName: string;
  institutionType: string;
  agreementType: string;
  signDate: string;
  validDate: string;
  manager: string;
  status: '履约中' | '待续签' | '补充协议中' | '暂停协议';
}

interface AssessmentItem {
  id: string;
  institutionName: string;
  institutionType: string;
  period: string;
  serviceScore: number;
  complianceScore: number;
  settlementScore: number;
  finalGrade: string;
  conclusion: string;
}

interface ExitItem {
  id: string;
  institutionName: string;
  institutionType: string;
  reason: string;
  applyDate: string;
  progress: string;
  settlementStatus: string;
  result: string;
}

const hospitalSeed: Hospital[] = [
  { id: 'HOS-001', name: '江苏省人民医院', hospitalType: '综合医院', level: '三级甲等', ownership: '省属公立', region: '南京', beds: 3200, physicians: 1180, annualVolume: '246.8万人次', status: '正常' },
  { id: 'HOS-002', name: '南京鼓楼医院', hospitalType: '综合医院', level: '三级甲等', ownership: '市属公立', region: '南京', beds: 3000, physicians: 1060, annualVolume: '231.5万人次', status: '正常' },
  { id: 'HOS-003', name: '无锡市人民医院', hospitalType: '综合医院', level: '三级甲等', ownership: '市属公立', region: '无锡', beds: 2200, physicians: 860, annualVolume: '182.4万人次', status: '正常' },
  { id: 'HOS-004', name: '徐州医科大学附属医院', hospitalType: '综合医院', level: '三级甲等', ownership: '省属公立', region: '徐州', beds: 2800, physicians: 990, annualVolume: '208.7万人次', status: '正常' },
  { id: 'HOS-005', name: '常州市第一人民医院', hospitalType: '综合医院', level: '三级甲等', ownership: '市属公立', region: '常州', beds: 2100, physicians: 820, annualVolume: '165.3万人次', status: '正常' },
  { id: 'HOS-006', name: '苏州大学附属第一医院', hospitalType: '综合医院', level: '三级甲等', ownership: '省属公立', region: '苏州', beds: 3000, physicians: 1140, annualVolume: '236.2万人次', status: '正常' },
  { id: 'HOS-007', name: '南通大学附属医院', hospitalType: '综合医院', level: '三级甲等', ownership: '省属公立', region: '南通', beds: 2500, physicians: 910, annualVolume: '189.6万人次', status: '正常' },
  { id: 'HOS-008', name: '连云港市第一人民医院', hospitalType: '综合医院', level: '三级甲等', ownership: '市属公立', region: '连云港', beds: 1800, physicians: 690, annualVolume: '141.2万人次', status: '正常' },
  { id: 'HOS-009', name: '淮安市第一人民医院', hospitalType: '综合医院', level: '三级甲等', ownership: '市属公立', region: '淮安', beds: 2000, physicians: 760, annualVolume: '152.8万人次', status: '正常' },
  { id: 'HOS-010', name: '盐城市第一人民医院', hospitalType: '综合医院', level: '三级甲等', ownership: '市属公立', region: '盐城', beds: 2400, physicians: 880, annualVolume: '176.9万人次', status: '正常' },
  { id: 'HOS-011', name: '扬州大学附属医院', hospitalType: '综合医院', level: '三级甲等', ownership: '省属公立', region: '扬州', beds: 2200, physicians: 830, annualVolume: '171.6万人次', status: '正常' },
  { id: 'HOS-012', name: '镇江市第一人民医院', hospitalType: '综合医院', level: '三级甲等', ownership: '市属公立', region: '镇江', beds: 1600, physicians: 620, annualVolume: '129.5万人次', status: '正常' },
  { id: 'HOS-013', name: '泰州市人民医院', hospitalType: '综合医院', level: '三级甲等', ownership: '市属公立', region: '泰州', beds: 1900, physicians: 710, annualVolume: '145.7万人次', status: '正常' },
  { id: 'HOS-014', name: '宿迁市人民医院', hospitalType: '综合医院', level: '三级甲等', ownership: '市属公立', region: '宿迁', beds: 1500, physicians: 560, annualVolume: '118.9万人次', status: '正常' },
  { id: 'HOS-015', name: '南京市建邺区双闸社区卫生服务中心', hospitalType: '社区医院', level: '一级', ownership: '区属公立', region: '南京', beds: 120, physicians: 46, annualVolume: '18.6万人次', status: '正常' },
  { id: 'HOS-016', name: '无锡市梁溪区广益街道社区卫生服务中心', hospitalType: '社区医院', level: '一级', ownership: '区属公立', region: '无锡', beds: 98, physicians: 39, annualVolume: '15.3万人次', status: '正常' },
  { id: 'HOS-017', name: '苏州市吴中人民医院', hospitalType: '综合医院', level: '三级乙等', ownership: '区属公立', region: '苏州', beds: 1200, physicians: 420, annualVolume: '88.5万人次', status: '正常' },
  { id: 'HOS-018', name: '扬州市中医院', hospitalType: '中医医院', level: '三级甲等', ownership: '市属公立', region: '扬州', beds: 1350, physicians: 510, annualVolume: '96.8万人次', status: '正常' },
  { id: 'HOS-019', name: '南通市通州区人民医院', hospitalType: '综合医院', level: '三级乙等', ownership: '区属公立', region: '南通', beds: 980, physicians: 360, annualVolume: '73.2万人次', status: '待准入' },
  { id: 'HOS-020', name: '盐城市亭湖区人民医院', hospitalType: '综合医院', level: '二级甲等', ownership: '区属公立', region: '盐城', beds: 680, physicians: 240, annualVolume: '49.7万人次', status: '暂停协议' },
];

const pharmacySeed: Pharmacy[] = [
  { id: 'PHA-ORG-001', name: '南京国大药房新街口店', pharmacyType: '零售药店', qualification: '定点零售药店', region: '南京', chainBrand: '国大药房', pharmacistCount: 6, specialDrug: '否', status: '正常' },
  { id: 'PHA-ORG-002', name: '南京先声再康双通道药房鼓楼店', pharmacyType: '双通道药店', qualification: '双通道定点', region: '南京', chainBrand: '先声再康', pharmacistCount: 8, specialDrug: '是', status: '正常' },
  { id: 'PHA-ORG-003', name: '无锡九州大药房中山路店', pharmacyType: '零售药店', qualification: '定点零售药店', region: '无锡', chainBrand: '九州大药房', pharmacistCount: 5, specialDrug: '否', status: '正常' },
  { id: 'PHA-ORG-004', name: '徐州广济连锁药房云龙店', pharmacyType: '门诊统筹药店', qualification: '门诊统筹定点', region: '徐州', chainBrand: '广济药房', pharmacistCount: 4, specialDrug: '否', status: '正常' },
  { id: 'PHA-ORG-005', name: '常州一心堂双通道药房文化宫店', pharmacyType: '双通道药店', qualification: '双通道定点', region: '常州', chainBrand: '一心堂', pharmacistCount: 7, specialDrug: '是', status: '正常' },
  { id: 'PHA-ORG-006', name: '苏州粤海大药房观前店', pharmacyType: '零售药店', qualification: '定点零售药店', region: '苏州', chainBrand: '粤海大药房', pharmacistCount: 5, specialDrug: '否', status: '正常' },
  { id: 'PHA-ORG-007', name: '苏州雷允上双通道药房园区店', pharmacyType: '双通道药店', qualification: '双通道定点', region: '苏州', chainBrand: '雷允上', pharmacistCount: 9, specialDrug: '是', status: '正常' },
  { id: 'PHA-ORG-008', name: '南通医保惠民药房崇川店', pharmacyType: '门诊统筹药店', qualification: '门诊统筹定点', region: '南通', chainBrand: '惠民药房', pharmacistCount: 4, specialDrug: '否', status: '正常' },
  { id: 'PHA-ORG-009', name: '连云港康缘大药房海州店', pharmacyType: '零售药店', qualification: '定点零售药店', region: '连云港', chainBrand: '康缘大药房', pharmacistCount: 3, specialDrug: '否', status: '正常' },
  { id: 'PHA-ORG-010', name: '淮安天士力大药房清江浦店', pharmacyType: '门诊统筹药店', qualification: '门诊统筹定点', region: '淮安', chainBrand: '天士力', pharmacistCount: 4, specialDrug: '否', status: '正常' },
  { id: 'PHA-ORG-011', name: '盐城益丰大药房解放路店', pharmacyType: '零售药店', qualification: '定点零售药店', region: '盐城', chainBrand: '益丰大药房', pharmacistCount: 5, specialDrug: '否', status: '正常' },
  { id: 'PHA-ORG-012', name: '盐城双通道特药药房城南店', pharmacyType: '双通道药店', qualification: '双通道定点', region: '盐城', chainBrand: '医保特药', pharmacistCount: 6, specialDrug: '是', status: '正常' },
  { id: 'PHA-ORG-013', name: '扬州百信缘大药房文昌阁店', pharmacyType: '零售药店', qualification: '定点零售药店', region: '扬州', chainBrand: '百信缘', pharmacistCount: 4, specialDrug: '否', status: '正常' },
  { id: 'PHA-ORG-014', name: '镇江存仁堂药房京口店', pharmacyType: '门诊统筹药店', qualification: '门诊统筹定点', region: '镇江', chainBrand: '存仁堂', pharmacistCount: 3, specialDrug: '否', status: '待评估' },
  { id: 'PHA-ORG-015', name: '泰州国华双通道药房海陵店', pharmacyType: '双通道药店', qualification: '双通道定点', region: '泰州', chainBrand: '国华药房', pharmacistCount: 7, specialDrug: '是', status: '正常' },
  { id: 'PHA-ORG-016', name: '宿迁人民大药房宿城店', pharmacyType: '零售药店', qualification: '定点零售药店', region: '宿迁', chainBrand: '人民大药房', pharmacistCount: 3, specialDrug: '否', status: '正常' },
  { id: 'PHA-ORG-017', name: '南京门诊统筹药房江宁店', pharmacyType: '门诊统筹药店', qualification: '门诊统筹定点', region: '南京', chainBrand: '医保惠民药房', pharmacistCount: 5, specialDrug: '否', status: '正常' },
  { id: 'PHA-ORG-018', name: '苏州特药双通道药房相城店', pharmacyType: '双通道药店', qualification: '双通道定点', region: '苏州', chainBrand: '特药药房', pharmacistCount: 6, specialDrug: '是', status: '正常' },
  { id: 'PHA-ORG-019', name: '无锡门慢统筹药房滨湖店', pharmacyType: '门诊统筹药店', qualification: '门诊统筹定点', region: '无锡', chainBrand: '九州大药房', pharmacistCount: 4, specialDrug: '否', status: '正常' },
  { id: 'PHA-ORG-020', name: '徐州特药服务药房泉山店', pharmacyType: '双通道药店', qualification: '双通道定点', region: '徐州', chainBrand: '广济药房', pharmacistCount: 5, specialDrug: '是', status: '暂停服务' },
];

const physicianSeed: Physician[] = [
  { id: 'DOC-001', name: '周文斌', gender: '男', title: '主任医师', department: '心血管内科', institution: '江苏省人民医院', licenseNo: '110320100001', creditScore: 98, status: '正常' },
  { id: 'DOC-002', name: '顾晨曦', gender: '女', title: '副主任医师', department: '呼吸与危重症医学科', institution: '南京鼓楼医院', licenseNo: '110320100002', creditScore: 96, status: '正常' },
  { id: 'DOC-003', name: '沈嘉豪', gender: '男', title: '主任医师', department: '骨科', institution: '无锡市人民医院', licenseNo: '110320100003', creditScore: 94, status: '正常' },
  { id: 'DOC-004', name: '陶雨晴', gender: '女', title: '主治医师', department: '内分泌科', institution: '徐州医科大学附属医院', licenseNo: '110320100004', creditScore: 90, status: '正常' },
  { id: 'DOC-005', name: '陈志远', gender: '男', title: '主任医师', department: '普外科', institution: '常州市第一人民医院', licenseNo: '110320100005', creditScore: 95, status: '正常' },
  { id: 'DOC-006', name: '陆欣怡', gender: '女', title: '副主任医师', department: '肿瘤科', institution: '苏州大学附属第一医院', licenseNo: '110320100006', creditScore: 97, status: '正常' },
  { id: 'DOC-007', name: '赵明哲', gender: '男', title: '主任医师', department: '神经内科', institution: '南通大学附属医院', licenseNo: '110320100007', creditScore: 95, status: '正常' },
  { id: 'DOC-008', name: '韩雪宁', gender: '女', title: '主治医师', department: '儿科', institution: '连云港市第一人民医院', licenseNo: '110320100008', creditScore: 91, status: '正常' },
  { id: 'DOC-009', name: '邵立成', gender: '男', title: '副主任医师', department: '肾内科', institution: '淮安市第一人民医院', licenseNo: '110320100009', creditScore: 89, status: '正常' },
  { id: 'DOC-010', name: '丁若涵', gender: '女', title: '主任医师', department: '妇产科', institution: '盐城市第一人民医院', licenseNo: '110320100010', creditScore: 94, status: '正常' },
  { id: 'DOC-011', name: '许承泽', gender: '男', title: '副主任医师', department: '消化内科', institution: '扬州大学附属医院', licenseNo: '110320100011', creditScore: 92, status: '正常' },
  { id: 'DOC-012', name: '魏心如', gender: '女', title: '主治医师', department: '中医内科', institution: '扬州市中医院', licenseNo: '110320100012', creditScore: 90, status: '正常' },
  { id: 'DOC-013', name: '袁博文', gender: '男', title: '主任医师', department: '泌尿外科', institution: '镇江市第一人民医院', licenseNo: '110320100013', creditScore: 91, status: '正常' },
  { id: 'DOC-014', name: '夏静怡', gender: '女', title: '副主任医师', department: '康复医学科', institution: '泰州市人民医院', licenseNo: '110320100014', creditScore: 88, status: '正常' },
  { id: 'DOC-015', name: '顾海峰', gender: '男', title: '主治医师', department: '急诊医学科', institution: '宿迁市人民医院', licenseNo: '110320100015', creditScore: 87, status: '正常' },
  { id: 'DOC-016', name: '蒋雯丽', gender: '女', title: '主治医师', department: '全科医学科', institution: '南京市建邺区双闸社区卫生服务中心', licenseNo: '110320100016', creditScore: 86, status: '正常' },
  { id: 'DOC-017', name: '钱宇航', gender: '男', title: '副主任医师', department: '感染性疾病科', institution: '苏州市吴中人民医院', licenseNo: '110320100017', creditScore: 84, status: '暂停' },
  { id: 'DOC-018', name: '黎书瑶', gender: '女', title: '主治医师', department: '眼科', institution: '南通市通州区人民医院', licenseNo: '110320100018', creditScore: 88, status: '正常' },
  { id: 'DOC-019', name: '宋嘉木', gender: '男', title: '主治医师', department: '骨伤科', institution: '盐城市亭湖区人民医院', licenseNo: '110320100019', creditScore: 83, status: '正常' },
  { id: 'DOC-020', name: '唐若宁', gender: '女', title: '主任医师', department: '血液科', institution: '江苏省人民医院', licenseNo: '110320100020', creditScore: 96, status: '正常' },
];

const pharmacistSeed: Pharmacist[] = [
  { id: 'PHA-001', name: '胡雅琪', gender: '女', title: '主任药师', institution: '江苏省人民医院', licenseNo: '210320200001', creditScore: 97, status: '正常' },
  { id: 'PHA-002', name: '严启峰', gender: '男', title: '副主任药师', institution: '南京鼓楼医院', licenseNo: '210320200002', creditScore: 95, status: '正常' },
  { id: 'PHA-003', name: '顾明珊', gender: '女', title: '主管药师', institution: '无锡市人民医院', licenseNo: '210320200003', creditScore: 92, status: '正常' },
  { id: 'PHA-004', name: '邵泽宇', gender: '男', title: '主任药师', institution: '徐州医科大学附属医院', licenseNo: '210320200004', creditScore: 94, status: '正常' },
  { id: 'PHA-005', name: '范书宁', gender: '女', title: '副主任药师', institution: '常州市第一人民医院', licenseNo: '210320200005', creditScore: 91, status: '正常' },
  { id: 'PHA-006', name: '章天佑', gender: '男', title: '主管药师', institution: '苏州大学附属第一医院', licenseNo: '210320200006', creditScore: 93, status: '正常' },
  { id: 'PHA-007', name: '叶清如', gender: '女', title: '主任药师', institution: '南通大学附属医院', licenseNo: '210320200007', creditScore: 94, status: '正常' },
  { id: 'PHA-008', name: '施雨辰', gender: '男', title: '主管药师', institution: '连云港市第一人民医院', licenseNo: '210320200008', creditScore: 89, status: '正常' },
  { id: 'PHA-009', name: '陆佳宁', gender: '女', title: '副主任药师', institution: '淮安市第一人民医院', licenseNo: '210320200009', creditScore: 90, status: '正常' },
  { id: 'PHA-010', name: '郑博闻', gender: '男', title: '主任药师', institution: '盐城市第一人民医院', licenseNo: '210320200010', creditScore: 92, status: '正常' },
  { id: 'PHA-011', name: '方思敏', gender: '女', title: '主管药师', institution: '扬州大学附属医院', licenseNo: '210320200011', creditScore: 90, status: '正常' },
  { id: 'PHA-012', name: '曹晨阳', gender: '男', title: '副主任药师', institution: '镇江市第一人民医院', licenseNo: '210320200012', creditScore: 88, status: '正常' },
  { id: 'PHA-013', name: '彭若溪', gender: '女', title: '主任药师', institution: '泰州市人民医院', licenseNo: '210320200013', creditScore: 91, status: '正常' },
  { id: 'PHA-014', name: '周致远', gender: '男', title: '主管药师', institution: '宿迁市人民医院', licenseNo: '210320200014', creditScore: 87, status: '正常' },
  { id: 'PHA-015', name: '高婧妤', gender: '女', title: '主管药师', institution: '南京市建邺区双闸社区卫生服务中心', licenseNo: '210320200015', creditScore: 86, status: '正常' },
  { id: 'PHA-016', name: '汤睿哲', gender: '男', title: '副主任药师', institution: '无锡市梁溪区广益街道社区卫生服务中心', licenseNo: '210320200016', creditScore: 85, status: '正常' },
  { id: 'PHA-017', name: '宋羽彤', gender: '女', title: '主任药师', institution: '扬州市中医院', licenseNo: '210320200017', creditScore: 90, status: '正常' },
  { id: 'PHA-018', name: '罗俊凯', gender: '男', title: '主管药师', institution: '苏州市吴中人民医院', licenseNo: '210320200018', creditScore: 83, status: '暂停' },
  { id: 'PHA-019', name: '谢宁远', gender: '男', title: '副主任药师', institution: '南通市通州区人民医院', licenseNo: '210320200019', creditScore: 87, status: '正常' },
  { id: 'PHA-020', name: '程书瑶', gender: '女', title: '主管药师', institution: '盐城市亭湖区人民医院', licenseNo: '210320200020', creditScore: 84, status: '正常' },
];

const agreementSeed: AgreementItem[] = [
  { id: 'AGR-001', institutionName: '江苏省人民医院', institutionType: '医院', agreementType: '定点医疗机构服务协议', signDate: '2026-01-01', validDate: '2026-12-31', manager: '周岚', status: '履约中' },
  { id: 'AGR-002', institutionName: '南京鼓楼医院', institutionType: '医院', agreementType: '定点医疗机构服务协议', signDate: '2026-01-01', validDate: '2026-12-31', manager: '顾明珠', status: '履约中' },
  { id: 'AGR-003', institutionName: '无锡市人民医院', institutionType: '医院', agreementType: 'DRG付费补充协议', signDate: '2026-02-01', validDate: '2026-12-31', manager: '林悦', status: '补充协议中' },
  { id: 'AGR-004', institutionName: '徐州医科大学附属医院', institutionType: '医院', agreementType: '门诊慢特病服务协议', signDate: '2026-01-15', validDate: '2026-12-31', manager: '韩松', status: '履约中' },
  { id: 'AGR-005', institutionName: '常州市第一人民医院', institutionType: '医院', agreementType: '定点医疗机构服务协议', signDate: '2026-01-01', validDate: '2026-12-31', manager: '王敏', status: '履约中' },
  { id: 'AGR-006', institutionName: '苏州大学附属第一医院', institutionType: '医院', agreementType: '双通道特药结算补充协议', signDate: '2026-02-18', validDate: '2026-12-31', manager: '周岚', status: '履约中' },
  { id: 'AGR-007', institutionName: '南通大学附属医院', institutionType: '医院', agreementType: '定点医疗机构服务协议', signDate: '2026-01-01', validDate: '2026-12-31', manager: '顾明珠', status: '履约中' },
  { id: 'AGR-008', institutionName: '连云港市第一人民医院', institutionType: '医院', agreementType: '门诊统筹服务协议', signDate: '2026-01-20', validDate: '2026-12-31', manager: '林悦', status: '待续签' },
  { id: 'AGR-009', institutionName: '淮安市第一人民医院', institutionType: '医院', agreementType: '定点医疗机构服务协议', signDate: '2026-01-01', validDate: '2026-12-31', manager: '韩松', status: '履约中' },
  { id: 'AGR-010', institutionName: '盐城市第一人民医院', institutionType: '医院', agreementType: '定点医疗机构服务协议', signDate: '2026-01-01', validDate: '2026-12-31', manager: '王敏', status: '履约中' },
  { id: 'AGR-011', institutionName: '扬州大学附属医院', institutionType: '医院', agreementType: '日间手术结算补充协议', signDate: '2026-03-01', validDate: '2026-12-31', manager: '周岚', status: '履约中' },
  { id: 'AGR-012', institutionName: '镇江市第一人民医院', institutionType: '医院', agreementType: '定点医疗机构服务协议', signDate: '2026-01-01', validDate: '2026-12-31', manager: '顾明珠', status: '履约中' },
  { id: 'AGR-013', institutionName: '泰州市人民医院', institutionType: '医院', agreementType: '门诊慢特病服务协议', signDate: '2026-02-12', validDate: '2026-12-31', manager: '林悦', status: '履约中' },
  { id: 'AGR-014', institutionName: '宿迁市人民医院', institutionType: '医院', agreementType: '定点医疗机构服务协议', signDate: '2026-01-01', validDate: '2026-12-31', manager: '韩松', status: '待续签' },
  { id: 'AGR-015', institutionName: '南京先声再康双通道药房鼓楼店', institutionType: '药店', agreementType: '双通道药店服务协议', signDate: '2026-01-10', validDate: '2026-12-31', manager: '王敏', status: '履约中' },
  { id: 'AGR-016', institutionName: '常州一心堂双通道药房文化宫店', institutionType: '药店', agreementType: '双通道药店服务协议', signDate: '2026-01-10', validDate: '2026-12-31', manager: '周岚', status: '履约中' },
  { id: 'AGR-017', institutionName: '苏州雷允上双通道药房园区店', institutionType: '药店', agreementType: '双通道药店服务协议', signDate: '2026-01-10', validDate: '2026-12-31', manager: '顾明珠', status: '履约中' },
  { id: 'AGR-018', institutionName: '泰州国华双通道药房海陵店', institutionType: '药店', agreementType: '双通道药店服务协议', signDate: '2026-02-05', validDate: '2026-12-31', manager: '林悦', status: '补充协议中' },
  { id: 'AGR-019', institutionName: '徐州特药服务药房泉山店', institutionType: '药店', agreementType: '特药保障服务协议', signDate: '2026-01-18', validDate: '2026-12-31', manager: '韩松', status: '暂停协议' },
  { id: 'AGR-020', institutionName: '扬州百信缘大药房文昌阁店', institutionType: '药店', agreementType: '定点零售药店服务协议', signDate: '2026-01-06', validDate: '2026-12-31', manager: '王敏', status: '履约中' },
];

const assessmentSeed: AssessmentItem[] = [
  { id: 'ASM-001', institutionName: '江苏省人民医院', institutionType: '医院', period: '2026年一季度', serviceScore: 98, complianceScore: 97, settlementScore: 96, finalGrade: 'A', conclusion: '继续保持示范定点机构' },
  { id: 'ASM-002', institutionName: '南京鼓楼医院', institutionType: '医院', period: '2026年一季度', serviceScore: 97, complianceScore: 96, settlementScore: 95, finalGrade: 'A', conclusion: '门诊慢特病管理规范' },
  { id: 'ASM-003', institutionName: '无锡市人民医院', institutionType: '医院', period: '2026年一季度', serviceScore: 95, complianceScore: 94, settlementScore: 93, finalGrade: 'A', conclusion: '住院清单上传及时' },
  { id: 'ASM-004', institutionName: '徐州医科大学附属医院', institutionType: '医院', period: '2026年一季度', serviceScore: 94, complianceScore: 92, settlementScore: 93, finalGrade: 'B+', conclusion: '部分高值耗材说明需补强' },
  { id: 'ASM-005', institutionName: '常州市第一人民医院', institutionType: '医院', period: '2026年一季度', serviceScore: 93, complianceScore: 94, settlementScore: 92, finalGrade: 'B+', conclusion: '门诊统筹审核通过率较高' },
  { id: 'ASM-006', institutionName: '苏州大学附属第一医院', institutionType: '医院', period: '2026年一季度', serviceScore: 98, complianceScore: 97, settlementScore: 97, finalGrade: 'A', conclusion: '双通道特药管理闭环良好' },
  { id: 'ASM-007', institutionName: '南通大学附属医院', institutionType: '医院', period: '2026年一季度', serviceScore: 95, complianceScore: 93, settlementScore: 94, finalGrade: 'A-', conclusion: '异地结算质量稳定' },
  { id: 'ASM-008', institutionName: '连云港市第一人民医院', institutionType: '医院', period: '2026年一季度', serviceScore: 91, complianceScore: 89, settlementScore: 90, finalGrade: 'B', conclusion: '病案首页质控需提升' },
  { id: 'ASM-009', institutionName: '淮安市第一人民医院', institutionType: '医院', period: '2026年一季度', serviceScore: 92, complianceScore: 91, settlementScore: 90, finalGrade: 'B+', conclusion: '基金使用总体平稳' },
  { id: 'ASM-010', institutionName: '盐城市第一人民医院', institutionType: '医院', period: '2026年一季度', serviceScore: 94, complianceScore: 92, settlementScore: 91, finalGrade: 'B+', conclusion: '需加强耗材追溯一致性' },
  { id: 'ASM-011', institutionName: '扬州大学附属医院', institutionType: '医院', period: '2026年一季度', serviceScore: 93, complianceScore: 93, settlementScore: 94, finalGrade: 'A-', conclusion: '日间手术管理较规范' },
  { id: 'ASM-012', institutionName: '镇江市第一人民医院', institutionType: '医院', period: '2026年一季度', serviceScore: 90, complianceScore: 89, settlementScore: 88, finalGrade: 'B', conclusion: '违规编码预警需压降' },
  { id: 'ASM-013', institutionName: '泰州市人民医院', institutionType: '医院', period: '2026年一季度', serviceScore: 91, complianceScore: 90, settlementScore: 91, finalGrade: 'B+', conclusion: '门诊慢特病结算及时' },
  { id: 'ASM-014', institutionName: '宿迁市人民医院', institutionType: '医院', period: '2026年一季度', serviceScore: 89, complianceScore: 87, settlementScore: 88, finalGrade: 'B', conclusion: '协议续签前需完成整改' },
  { id: 'ASM-015', institutionName: '南京先声再康双通道药房鼓楼店', institutionType: '药店', period: '2026年一季度', serviceScore: 96, complianceScore: 97, settlementScore: 95, finalGrade: 'A', conclusion: '特药登记材料完整' },
  { id: 'ASM-016', institutionName: '常州一心堂双通道药房文化宫店', institutionType: '药店', period: '2026年一季度', serviceScore: 94, complianceScore: 95, settlementScore: 93, finalGrade: 'A-', conclusion: '审方流转效率较高' },
  { id: 'ASM-017', institutionName: '苏州雷允上双通道药房园区店', institutionType: '药店', period: '2026年一季度', serviceScore: 95, complianceScore: 96, settlementScore: 95, finalGrade: 'A', conclusion: '双通道结算差异率低' },
  { id: 'ASM-018', institutionName: '扬州百信缘大药房文昌阁店', institutionType: '药店', period: '2026年一季度', serviceScore: 90, complianceScore: 88, settlementScore: 89, finalGrade: 'B', conclusion: '门诊统筹处方留存需完善' },
  { id: 'ASM-019', institutionName: '徐州特药服务药房泉山店', institutionType: '药店', period: '2026年一季度', serviceScore: 82, complianceScore: 80, settlementScore: 81, finalGrade: 'C', conclusion: '暂停协议，限期整改' },
  { id: 'ASM-020', institutionName: '镇江存仁堂药房京口店', institutionType: '药店', period: '2026年一季度', serviceScore: 88, complianceScore: 86, settlementScore: 87, finalGrade: 'B', conclusion: '待完成门诊统筹复核评估' },
];

const exitSeed: ExitItem[] = [
  { id: 'EXIT-001', institutionName: '徐州特药服务药房泉山店', institutionType: '药店', reason: '双通道特药台账不完整，多次整改不到位', applyDate: '2026-03-18', progress: '市级初审完成', settlementStatus: '待完成清算', result: '拟解除协议' },
  { id: 'EXIT-002', institutionName: '宿迁市人民医院', institutionType: '医院', reason: '协议续签前需完成重点问题整改', applyDate: '2026-03-26', progress: '整改复核中', settlementStatus: '结算正常', result: '暂缓退出' },
  { id: 'EXIT-003', institutionName: '镇江存仁堂药房京口店', institutionType: '药店', reason: '门诊统筹处方流转记录缺失', applyDate: '2026-04-02', progress: '提交整改说明', settlementStatus: '对账中', result: '观察期管理' },
  { id: 'EXIT-004', institutionName: '盐城市亭湖区人民医院', institutionType: '医院', reason: '暂停协议后申请退出定点管理', applyDate: '2026-02-28', progress: '省级审核中', settlementStatus: '历史费用清算中', result: '拟终止协议' },
  { id: 'EXIT-005', institutionName: '连云港康缘大药房海州店', institutionType: '药店', reason: '主动申请转为普通零售药店', applyDate: '2026-03-12', progress: '市级备案完成', settlementStatus: '清算完成', result: '已退出门诊统筹' },
  { id: 'EXIT-006', institutionName: '南京门诊统筹药房江宁店', institutionType: '药店', reason: '经营地址变更，原协议终止重签', applyDate: '2026-04-08', progress: '重新准入评估中', settlementStatus: '待核账', result: '原协议注销' },
  { id: 'EXIT-007', institutionName: '无锡市梁溪区广益街道社区卫生服务中心', institutionType: '医院', reason: '机构整合并入区域医共体统一管理', applyDate: '2026-03-05', progress: '清算归并中', settlementStatus: '历史账务移交', result: '并入后重新签约' },
  { id: 'EXIT-008', institutionName: '苏州市吴中人民医院', institutionType: '医院', reason: '部分医保服务权限调整退出', applyDate: '2026-04-10', progress: '补充材料待提交', settlementStatus: '正常', result: '待定' },
  { id: 'EXIT-009', institutionName: '宿迁人民大药房宿城店', institutionType: '药店', reason: '主动放弃双通道药店资质申请', applyDate: '2026-03-22', progress: '流程办结', settlementStatus: '无专项清算', result: '保留普通定点资格' },
  { id: 'EXIT-010', institutionName: '南通市通州区人民医院', institutionType: '医院', reason: '新院区启用，原院区定点资格注销', applyDate: '2026-04-15', progress: '资料核验中', settlementStatus: '待迁移', result: '新老院区切换中' },
  { id: 'EXIT-011', institutionName: '盐城双通道特药药房城南店', institutionType: '药店', reason: '冷链药品追溯异常', applyDate: '2026-04-06', progress: '暂停期间整改', settlementStatus: '结算冻结', result: '待复评' },
  { id: 'EXIT-012', institutionName: '南京市建邺区双闸社区卫生服务中心', institutionType: '医院', reason: '申请退出住院定点保留门诊统筹', applyDate: '2026-03-30', progress: '市级审核中', settlementStatus: '正常', result: '部分退出评估中' },
  { id: 'EXIT-013', institutionName: '扬州百信缘大药房文昌阁店', institutionType: '药店', reason: '连锁主体变更需要重新签约', applyDate: '2026-04-12', progress: '主体资料复核', settlementStatus: '对账中', result: '拟注销旧协议' },
  { id: 'EXIT-014', institutionName: '泰州市人民医院', institutionType: '医院', reason: '申请退出部分门诊病种试点', applyDate: '2026-03-14', progress: '补充说明中', settlementStatus: '正常', result: '待批复' },
  { id: 'EXIT-015', institutionName: '无锡门慢统筹药房滨湖店', institutionType: '药店', reason: '门慢服务能力不足主动退出', applyDate: '2026-03-25', progress: '流程办结', settlementStatus: '清算完成', result: '已退出专项资格' },
  { id: 'EXIT-016', institutionName: '江苏省人民医院', institutionType: '医院', reason: '无退出事项，列入负面清单为零示例', applyDate: '2026-04-01', progress: '无', settlementStatus: '正常', result: '不退出' },
  { id: 'EXIT-017', institutionName: '苏州特药双通道药房相城店', institutionType: '药店', reason: '新增门店整合旧门店资格', applyDate: '2026-04-09', progress: '省级备案中', settlementStatus: '正常', result: '资格迁转中' },
  { id: 'EXIT-018', institutionName: '扬州市中医院', institutionType: '医院', reason: '申请退出部分支付方式试点资格', applyDate: '2026-03-17', progress: '政策评估中', settlementStatus: '正常', result: '待研究' },
  { id: 'EXIT-019', institutionName: '常州一心堂双通道药房文化宫店', institutionType: '药店', reason: '无退出事项，保留样本', applyDate: '2026-04-11', progress: '无', settlementStatus: '正常', result: '不退出' },
  { id: 'EXIT-020', institutionName: '淮安市第一人民医院', institutionType: '医院', reason: '申请退出历史专项补充协议', applyDate: '2026-03-29', progress: '协议收尾中', settlementStatus: '正常', result: '拟终止补充协议' },
];

const categoryColors: Record<string, string> = {
  正常: 'bg-green-100 text-green-700',
  待准入: 'bg-amber-100 text-amber-700',
  暂停协议: 'bg-red-100 text-red-700',
  待评估: 'bg-amber-100 text-amber-700',
  暂停服务: 'bg-red-100 text-red-700',
  履约中: 'bg-green-100 text-green-700',
  待续签: 'bg-amber-100 text-amber-700',
  补充协议中: 'bg-blue-100 text-blue-700',
  暂停: 'bg-red-100 text-red-700',
};

export default function InstitutionManagement({ userAgency }: { userAgency: string }) {
  const isProvince = getAgencyLevel(userAgency) === 'province';
  const [activeTab, setActiveTab] = useState('access');
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [modalType, setModalType] = useState<'institution' | 'physician' | 'pharmacist'>('institution');

  const [hospitals, setHospitals] = useState<Hospital[]>(hospitalSeed);
  const [pharmacies, setPharmacies] = useState<Pharmacy[]>(pharmacySeed);
  const [physicians, setPhysicians] = useState<Physician[]>(physicianSeed);
  const [pharmacists, setPharmacists] = useState<Pharmacist[]>(pharmacistSeed);
  const [agreements, setAgreements] = useState<AgreementItem[]>(agreementSeed);
  const [assessments] = useState<AssessmentItem[]>(assessmentSeed);
  const [exitItems] = useState<ExitItem[]>(exitSeed);

  const filteredHospitals = useMemo(
    () =>
      hospitals.filter((item) =>
        [item.id, item.name, item.hospitalType, item.level, item.region, item.ownership, item.status].some((field) => field.includes(searchQuery)),
      ),
    [hospitals, searchQuery],
  );

  const filteredPharmacies = useMemo(
    () =>
      pharmacies.filter((item) =>
        [item.id, item.name, item.pharmacyType, item.qualification, item.region, item.chainBrand, item.status].some((field) => field.includes(searchQuery)),
      ),
    [pharmacies, searchQuery],
  );

  const filteredPhysicians = useMemo(
    () =>
      physicians.filter((item) =>
        [item.id, item.name, item.title, item.department, item.institution, item.status].some((field) => field.includes(searchQuery)),
      ),
    [physicians, searchQuery],
  );

  const filteredPharmacists = useMemo(
    () =>
      pharmacists.filter((item) =>
        [item.id, item.name, item.title, item.institution, item.status].some((field) => field.includes(searchQuery)),
      ),
    [pharmacists, searchQuery],
  );

  const filteredAgreements = useMemo(
    () =>
      agreements.filter((item) =>
        [item.id, item.institutionName, item.institutionType, item.agreementType, item.manager, item.status].some((field) => field.includes(searchQuery)),
      ),
    [agreements, searchQuery],
  );

  const filteredAssessments = useMemo(
    () =>
      assessments.filter((item) =>
        [item.id, item.institutionName, item.institutionType, item.period, item.finalGrade, item.conclusion].some((field) => field.includes(searchQuery)),
      ),
    [assessments, searchQuery],
  );

  const filteredExitItems = useMemo(
    () =>
      exitItems.filter((item) =>
        [item.id, item.institutionName, item.institutionType, item.reason, item.progress, item.result].some((field) => field.includes(searchQuery)),
      ),
    [exitItems, searchQuery],
  );

  const openModal = (type: 'institution' | 'physician' | 'pharmacist', item: any = null) => {
    setModalType(type);
    setEditingItem(item);
    setShowModal(true);
  };

  const handleDelete = (id: string, type: 'hospital' | 'pharmacy' | 'physician' | 'pharmacist' | 'agreement') => {
    if (type === 'hospital') setHospitals((prev) => prev.filter((item) => item.id !== id));
    if (type === 'pharmacy') setPharmacies((prev) => prev.filter((item) => item.id !== id));
    if (type === 'physician') setPhysicians((prev) => prev.filter((item) => item.id !== id));
    if (type === 'pharmacist') setPharmacists((prev) => prev.filter((item) => item.id !== id));
    if (type === 'agreement') setAgreements((prev) => prev.filter((item) => item.id !== id));
  };

  const handleSave = (formData: any) => {
    if (modalType === 'institution') {
      if (activeTab === 'access') {
        if (editingItem) {
          setHospitals((prev) => prev.map((item) => (item.id === editingItem.id ? { ...item, ...formData, beds: Number(formData.beds), physicians: Number(formData.physicians) } : item)));
        } else {
          setHospitals((prev) => [
            ...prev,
            {
              id: `HOS-${String(prev.length + 1).padStart(3, '0')}`,
              name: String(formData.name || ''),
              hospitalType: String(formData.hospitalType || '综合医院'),
              level: String(formData.level || '三级甲等'),
              ownership: String(formData.ownership || '市属公立'),
              region: String(formData.region || '南京'),
              beds: Number(formData.beds || 0),
              physicians: Number(formData.physicians || 0),
              annualVolume: String(formData.annualVolume || '0万人次'),
              status: (formData.status as Hospital['status']) || '正常',
            },
          ]);
        }
      } else {
        if (editingItem) {
          setPharmacies((prev) => prev.map((item) => (item.id === editingItem.id ? { ...item, ...formData, pharmacistCount: Number(formData.pharmacistCount) } : item)));
        } else {
          setPharmacies((prev) => [
            ...prev,
            {
              id: `PHA-ORG-${String(prev.length + 1).padStart(3, '0')}`,
              name: String(formData.name || ''),
              pharmacyType: String(formData.pharmacyType || '零售药店'),
              qualification: String(formData.qualification || '定点零售药店'),
              region: String(formData.region || '南京'),
              chainBrand: String(formData.chainBrand || '医保药房'),
              pharmacistCount: Number(formData.pharmacistCount || 0),
              specialDrug: String(formData.specialDrug || '否'),
              status: (formData.status as Pharmacy['status']) || '正常',
            },
          ]);
        }
      }
    }

    if (modalType === 'physician') {
      if (editingItem) {
        setPhysicians((prev) => prev.map((item) => (item.id === editingItem.id ? { ...item, ...formData, creditScore: Number(formData.creditScore) } : item)));
      } else {
        setPhysicians((prev) => [
          ...prev,
          {
            id: `DOC-${String(prev.length + 1).padStart(3, '0')}`,
            name: String(formData.name || ''),
            gender: String(formData.gender || '男'),
            title: String(formData.title || '主治医师'),
            department: String(formData.department || ''),
            institution: String(formData.institution || ''),
            licenseNo: String(formData.licenseNo || ''),
            creditScore: Number(formData.creditScore || 90),
            status: (formData.status as Physician['status']) || '正常',
          },
        ]);
      }
    }

    if (modalType === 'pharmacist') {
      if (editingItem) {
        setPharmacists((prev) => prev.map((item) => (item.id === editingItem.id ? { ...item, ...formData, creditScore: Number(formData.creditScore) } : item)));
      } else {
        setPharmacists((prev) => [
          ...prev,
          {
            id: `PHA-${String(prev.length + 1).padStart(3, '0')}`,
            name: String(formData.name || ''),
            gender: String(formData.gender || '女'),
            title: String(formData.title || '主管药师'),
            institution: String(formData.institution || ''),
            licenseNo: String(formData.licenseNo || ''),
            creditScore: Number(formData.creditScore || 90),
            status: (formData.status as Pharmacist['status']) || '正常',
          },
        ]);
      }
    }

    setShowModal(false);
  };

  const renderToolbar = (placeholder: string, onAdd?: () => void, addLabel?: string) => (
    <div className="flex gap-4">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder={placeholder}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full rounded-lg border border-gray-200 py-2 pl-10 pr-4"
        />
      </div>
      {isProvince && onAdd ? (
        <button onClick={onAdd} className="flex items-center gap-2 rounded-lg bg-cyan-600 px-4 py-2 text-white hover:bg-cyan-700">
          <Plus className="h-4 w-4" />
          {addLabel}
        </button>
      ) : null}
    </div>
  );

  const renderStatus = (status: string) => (
    <span className={`rounded px-2 py-1 text-xs ${categoryColors[status] || 'bg-gray-100 text-gray-700'}`}>{status}</span>
  );

  const renderHospitalContent = () => (
    <div className="space-y-4">
      {renderToolbar('搜索医院名称、编码、医院类型、地区', () => openModal('institution'), '新增医院')}
      <div className="rounded-xl border border-gray-200 bg-white">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">医院名称</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">医院类型</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">等级</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">举办性质</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">地区</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">床位数</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">医师数</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">年服务量</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">状态</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">操作</th>
            </tr>
          </thead>
          <tbody>
            {filteredHospitals.map((item) => (
              <tr key={item.id} className="border-t border-gray-100 hover:bg-gray-50">
                <td className="px-4 py-3 text-sm font-medium text-gray-800">{item.name}</td>
                <td className="px-4 py-3 text-sm text-gray-600">{item.hospitalType}</td>
                <td className="px-4 py-3 text-sm text-gray-600">{item.level}</td>
                <td className="px-4 py-3 text-sm text-gray-600">{item.ownership}</td>
                <td className="px-4 py-3 text-sm text-gray-600">{item.region}</td>
                <td className="px-4 py-3 text-sm text-gray-600">{item.beds}</td>
                <td className="px-4 py-3 text-sm text-gray-600">{item.physicians}</td>
                <td className="px-4 py-3 text-sm text-gray-600">{item.annualVolume}</td>
                <td className="px-4 py-3">{renderStatus(item.status)}</td>
                <td className="px-4 py-3">
                  {isProvince && (
                    <div className="flex gap-2">
                      <button onClick={() => openModal('institution', item)} className="rounded p-1.5 text-gray-500 hover:bg-cyan-50 hover:text-cyan-600">
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button onClick={() => handleDelete(item.id, 'hospital')} className="rounded p-1.5 text-gray-500 hover:bg-red-50 hover:text-red-600">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderPharmacyContent = () => (
    <div className="space-y-4">
      {renderToolbar('搜索药店名称、类型、资质、地区', () => openModal('institution'), '新增药店')}
      <div className="rounded-xl border border-gray-200 bg-white">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">药店名称</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">药店类型</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">定点类型</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">地区</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">连锁品牌</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">药师数</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">特药服务</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">状态</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">操作</th>
            </tr>
          </thead>
          <tbody>
            {filteredPharmacies.map((item) => (
              <tr key={item.id} className="border-t border-gray-100 hover:bg-gray-50">
                <td className="px-4 py-3 text-sm font-medium text-gray-800">{item.name}</td>
                <td className="px-4 py-3 text-sm text-gray-600">{item.pharmacyType}</td>
                <td className="px-4 py-3 text-sm text-gray-600">{item.qualification}</td>
                <td className="px-4 py-3 text-sm text-gray-600">{item.region}</td>
                <td className="px-4 py-3 text-sm text-gray-600">{item.chainBrand}</td>
                <td className="px-4 py-3 text-sm text-gray-600">{item.pharmacistCount}</td>
                <td className="px-4 py-3 text-sm text-gray-600">{item.specialDrug}</td>
                <td className="px-4 py-3">{renderStatus(item.status)}</td>
                <td className="px-4 py-3">
                  {isProvince && (
                    <div className="flex gap-2">
                      <button onClick={() => openModal('institution', item)} className="rounded p-1.5 text-gray-500 hover:bg-cyan-50 hover:text-cyan-600">
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button onClick={() => handleDelete(item.id, 'pharmacy')} className="rounded p-1.5 text-gray-500 hover:bg-red-50 hover:text-red-600">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderPhysicianContent = () => (
    <div className="space-y-4">
      {renderToolbar('搜索医保医师姓名、科室、机构', () => openModal('physician'), '新增医师')}
      <div className="rounded-xl border border-gray-200 bg-white">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">医师姓名</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">职称</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">科室</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">所属机构</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">执业证号</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">信用分</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">状态</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">操作</th>
            </tr>
          </thead>
          <tbody>
            {filteredPhysicians.map((item) => (
              <tr key={item.id} className="border-t border-gray-100 hover:bg-gray-50">
                <td className="px-4 py-3 text-sm font-medium text-gray-800">{item.name}</td>
                <td className="px-4 py-3 text-sm text-gray-600">{item.title}</td>
                <td className="px-4 py-3 text-sm text-gray-600">{item.department}</td>
                <td className="px-4 py-3 text-sm text-gray-600">{item.institution}</td>
                <td className="px-4 py-3 text-sm text-gray-600">{item.licenseNo}</td>
                <td className="px-4 py-3 text-sm font-medium text-green-600">{item.creditScore}</td>
                <td className="px-4 py-3">{renderStatus(item.status)}</td>
                <td className="px-4 py-3">
                  {isProvince && (
                    <div className="flex gap-2">
                      <button onClick={() => openModal('physician', item)} className="rounded p-1.5 text-gray-500 hover:bg-cyan-50 hover:text-cyan-600">
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button onClick={() => handleDelete(item.id, 'physician')} className="rounded p-1.5 text-gray-500 hover:bg-red-50 hover:text-red-600">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderPharmacistContent = () => (
    <div className="space-y-4">
      {renderToolbar('搜索医保药师姓名、机构、证号', () => openModal('pharmacist'), '新增药师')}
      <div className="rounded-xl border border-gray-200 bg-white">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">药师姓名</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">职称</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">所属机构</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">执业证号</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">信用分</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">状态</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">操作</th>
            </tr>
          </thead>
          <tbody>
            {filteredPharmacists.map((item) => (
              <tr key={item.id} className="border-t border-gray-100 hover:bg-gray-50">
                <td className="px-4 py-3 text-sm font-medium text-gray-800">{item.name}</td>
                <td className="px-4 py-3 text-sm text-gray-600">{item.title}</td>
                <td className="px-4 py-3 text-sm text-gray-600">{item.institution}</td>
                <td className="px-4 py-3 text-sm text-gray-600">{item.licenseNo}</td>
                <td className="px-4 py-3 text-sm font-medium text-green-600">{item.creditScore}</td>
                <td className="px-4 py-3">{renderStatus(item.status)}</td>
                <td className="px-4 py-3">
                  {isProvince && (
                    <div className="flex gap-2">
                      <button onClick={() => openModal('pharmacist', item)} className="rounded p-1.5 text-gray-500 hover:bg-cyan-50 hover:text-cyan-600">
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button onClick={() => handleDelete(item.id, 'pharmacist')} className="rounded p-1.5 text-gray-500 hover:bg-red-50 hover:text-red-600">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderAgreementContent = () => (
    <div className="space-y-4">
      {renderToolbar('搜索协议编号、机构名称、协议类型、状态')}
      <div className="rounded-xl border border-gray-200 bg-white">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">协议编号</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">机构名称</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">机构类型</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">协议类型</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">签订日期</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">有效期至</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">协议管理员</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">状态</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">操作</th>
            </tr>
          </thead>
          <tbody>
            {filteredAgreements.map((item) => (
              <tr key={item.id} className="border-t border-gray-100 hover:bg-gray-50">
                <td className="px-4 py-3 text-sm font-medium text-gray-800">{item.id}</td>
                <td className="px-4 py-3 text-sm text-gray-600">{item.institutionName}</td>
                <td className="px-4 py-3 text-sm text-gray-600">{item.institutionType}</td>
                <td className="px-4 py-3 text-sm text-gray-600">{item.agreementType}</td>
                <td className="px-4 py-3 text-sm text-gray-600">{item.signDate}</td>
                <td className="px-4 py-3 text-sm text-gray-600">{item.validDate}</td>
                <td className="px-4 py-3 text-sm text-gray-600">{item.manager}</td>
                <td className="px-4 py-3">{renderStatus(item.status)}</td>
                <td className="px-4 py-3">
                  {isProvince && (
                    <button onClick={() => handleDelete(item.id, 'agreement')} className="rounded p-1.5 text-gray-500 hover:bg-red-50 hover:text-red-600">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderAssessmentContent = () => (
    <div className="space-y-4">
      {renderToolbar('搜索考核编号、机构名称、考核周期、等级')}
      <div className="rounded-xl border border-gray-200 bg-white">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">考核编号</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">机构名称</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">机构类型</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">考核周期</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">服务得分</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">合规得分</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">结算得分</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">综合等级</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">考核结论</th>
            </tr>
          </thead>
          <tbody>
            {filteredAssessments.map((item) => (
              <tr key={item.id} className="border-t border-gray-100 hover:bg-gray-50">
                <td className="px-4 py-3 text-sm font-medium text-gray-800">{item.id}</td>
                <td className="px-4 py-3 text-sm text-gray-600">{item.institutionName}</td>
                <td className="px-4 py-3 text-sm text-gray-600">{item.institutionType}</td>
                <td className="px-4 py-3 text-sm text-gray-600">{item.period}</td>
                <td className="px-4 py-3 text-sm text-gray-600">{item.serviceScore}</td>
                <td className="px-4 py-3 text-sm text-gray-600">{item.complianceScore}</td>
                <td className="px-4 py-3 text-sm text-gray-600">{item.settlementScore}</td>
                <td className="px-4 py-3 text-sm font-medium text-cyan-600">{item.finalGrade}</td>
                <td className="px-4 py-3 text-sm text-gray-600">{item.conclusion}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderExitContent = () => (
    <div className="space-y-4">
      {renderToolbar('搜索退出编号、机构名称、退出原因、处理结果')}
      <div className="rounded-xl border border-gray-200 bg-white">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">退出编号</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">机构名称</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">机构类型</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">退出原因</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">申请日期</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">当前进度</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">结算清算</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">处理结果</th>
            </tr>
          </thead>
          <tbody>
            {filteredExitItems.map((item) => (
              <tr key={item.id} className="border-t border-gray-100 hover:bg-gray-50">
                <td className="px-4 py-3 text-sm font-medium text-gray-800">{item.id}</td>
                <td className="px-4 py-3 text-sm text-gray-600">{item.institutionName}</td>
                <td className="px-4 py-3 text-sm text-gray-600">{item.institutionType}</td>
                <td className="px-4 py-3 text-sm text-gray-600">{item.reason}</td>
                <td className="px-4 py-3 text-sm text-gray-600">{item.applyDate}</td>
                <td className="px-4 py-3 text-sm text-gray-600">{item.progress}</td>
                <td className="px-4 py-3 text-sm text-gray-600">{item.settlementStatus}</td>
                <td className="px-4 py-3 text-sm text-gray-600">{item.result}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderModal = () => {
    if (!showModal) return null;

    const isHospitalModal = modalType === 'institution' && activeTab === 'access';
    const isPharmacyModal = modalType === 'institution' && activeTab === 'classification';

    return (
      <AnimatePresence>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="w-full max-w-2xl rounded-xl bg-white p-6">
            <h3 className="mb-4 text-lg font-bold text-gray-800">
              {editingItem ? '编辑' : '新增'}
              {isHospitalModal ? '医院' : isPharmacyModal ? '药店' : modalType === 'physician' ? '医师' : '药师'}
            </h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSave(Object.fromEntries(new FormData(e.currentTarget)));
              }}
              className="space-y-4"
            >
              {isHospitalModal && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <input name="name" defaultValue={editingItem?.name} placeholder="医院名称" className="rounded-lg border border-gray-200 px-3 py-2" required />
                    <input name="region" defaultValue={editingItem?.region} placeholder="所属地市" className="rounded-lg border border-gray-200 px-3 py-2" required />
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <input name="hospitalType" defaultValue={editingItem?.hospitalType} placeholder="医院类型" className="rounded-lg border border-gray-200 px-3 py-2" />
                    <input name="level" defaultValue={editingItem?.level} placeholder="等级" className="rounded-lg border border-gray-200 px-3 py-2" />
                    <input name="ownership" defaultValue={editingItem?.ownership} placeholder="举办性质" className="rounded-lg border border-gray-200 px-3 py-2" />
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <input name="beds" type="number" defaultValue={editingItem?.beds} placeholder="床位数" className="rounded-lg border border-gray-200 px-3 py-2" />
                    <input name="physicians" type="number" defaultValue={editingItem?.physicians} placeholder="医师数" className="rounded-lg border border-gray-200 px-3 py-2" />
                    <input name="annualVolume" defaultValue={editingItem?.annualVolume} placeholder="年服务量" className="rounded-lg border border-gray-200 px-3 py-2" />
                  </div>
                  <select name="status" defaultValue={editingItem?.status || '正常'} className="w-full rounded-lg border border-gray-200 px-3 py-2">
                    <option value="正常">正常</option>
                    <option value="待准入">待准入</option>
                    <option value="暂停协议">暂停协议</option>
                  </select>
                </>
              )}

              {isPharmacyModal && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <input name="name" defaultValue={editingItem?.name} placeholder="药店名称" className="rounded-lg border border-gray-200 px-3 py-2" required />
                    <input name="region" defaultValue={editingItem?.region} placeholder="所属地市" className="rounded-lg border border-gray-200 px-3 py-2" required />
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <input name="pharmacyType" defaultValue={editingItem?.pharmacyType} placeholder="药店类型" className="rounded-lg border border-gray-200 px-3 py-2" />
                    <input name="qualification" defaultValue={editingItem?.qualification} placeholder="定点类型" className="rounded-lg border border-gray-200 px-3 py-2" />
                    <input name="chainBrand" defaultValue={editingItem?.chainBrand} placeholder="连锁品牌" className="rounded-lg border border-gray-200 px-3 py-2" />
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <input name="pharmacistCount" type="number" defaultValue={editingItem?.pharmacistCount} placeholder="药师数" className="rounded-lg border border-gray-200 px-3 py-2" />
                    <select name="specialDrug" defaultValue={editingItem?.specialDrug || '否'} className="rounded-lg border border-gray-200 px-3 py-2">
                      <option value="否">不提供特药</option>
                      <option value="是">提供特药</option>
                    </select>
                    <select name="status" defaultValue={editingItem?.status || '正常'} className="rounded-lg border border-gray-200 px-3 py-2">
                      <option value="正常">正常</option>
                      <option value="待评估">待评估</option>
                      <option value="暂停服务">暂停服务</option>
                    </select>
                  </div>
                </>
              )}

              {modalType === 'physician' && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <input name="name" defaultValue={editingItem?.name} placeholder="医师姓名" className="rounded-lg border border-gray-200 px-3 py-2" required />
                    <input name="gender" defaultValue={editingItem?.gender} placeholder="性别" className="rounded-lg border border-gray-200 px-3 py-2" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <input name="title" defaultValue={editingItem?.title} placeholder="职称" className="rounded-lg border border-gray-200 px-3 py-2" />
                    <input name="department" defaultValue={editingItem?.department} placeholder="科室" className="rounded-lg border border-gray-200 px-3 py-2" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <input name="institution" defaultValue={editingItem?.institution} placeholder="所属机构" className="rounded-lg border border-gray-200 px-3 py-2" />
                    <input name="licenseNo" defaultValue={editingItem?.licenseNo} placeholder="执业证号" className="rounded-lg border border-gray-200 px-3 py-2" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <input name="creditScore" type="number" defaultValue={editingItem?.creditScore} placeholder="信用分" className="rounded-lg border border-gray-200 px-3 py-2" />
                    <select name="status" defaultValue={editingItem?.status || '正常'} className="rounded-lg border border-gray-200 px-3 py-2">
                      <option value="正常">正常</option>
                      <option value="暂停">暂停</option>
                    </select>
                  </div>
                </>
              )}

              {modalType === 'pharmacist' && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <input name="name" defaultValue={editingItem?.name} placeholder="药师姓名" className="rounded-lg border border-gray-200 px-3 py-2" required />
                    <input name="gender" defaultValue={editingItem?.gender} placeholder="性别" className="rounded-lg border border-gray-200 px-3 py-2" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <input name="title" defaultValue={editingItem?.title} placeholder="职称" className="rounded-lg border border-gray-200 px-3 py-2" />
                    <input name="institution" defaultValue={editingItem?.institution} placeholder="所属机构" className="rounded-lg border border-gray-200 px-3 py-2" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <input name="licenseNo" defaultValue={editingItem?.licenseNo} placeholder="执业证号" className="rounded-lg border border-gray-200 px-3 py-2" />
                    <input name="creditScore" type="number" defaultValue={editingItem?.creditScore} placeholder="信用分" className="rounded-lg border border-gray-200 px-3 py-2" />
                  </div>
                  <select name="status" defaultValue={editingItem?.status || '正常'} className="w-full rounded-lg border border-gray-200 px-3 py-2">
                    <option value="正常">正常</option>
                    <option value="暂停">暂停</option>
                  </select>
                </>
              )}

              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={() => setShowModal(false)} className="rounded-lg px-4 py-2 text-gray-600 hover:bg-gray-100">
                  取消
                </button>
                <button type="submit" className="rounded-lg bg-cyan-600 px-4 py-2 text-white hover:bg-cyan-700">
                  保存
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-2 border-b border-gray-200">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setSearchQuery('');
              }}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors ${
                activeTab === tab.id ? 'border-b-2 border-cyan-600 text-cyan-600' : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <Icon className="h-4 w-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {activeTab === 'access' && renderHospitalContent()}
      {activeTab === 'classification' && renderPharmacyContent()}
      {activeTab === 'physician' && renderPhysicianContent()}
      {activeTab === 'pharmacist' && renderPharmacistContent()}
      {activeTab === 'agreement' && renderAgreementContent()}
      {activeTab === 'assessment' && renderAssessmentContent()}
      {activeTab === 'exit' && renderExitContent()}
      {renderModal()}
    </div>
  );
}
