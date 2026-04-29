import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Upload,
  FileText,
  CheckCircle,
  AlertTriangle,
  Bell,
  Pill,
  Eye,
  X,
  Check,
  Trash2,
  Stethoscope,
  Syringe,
  ShieldCheck,
  Package,
  Receipt,
  Search,
} from 'lucide-react';
import type { UserRole } from '../../types/roles';

type PortalMode = 'hospital' | 'pharmacy';
type SettlementStatus = '待上传' | '已上传' | '已审核';
type ReviewStatus = '待审方' | '已通过' | '已退回';
type AlertLevel = '预警' | '严重';
type AlertStatus = '待处理' | '已处理';

interface InstitutionPortalProps {
  portalRole?: UserRole;
}

interface SettlementItem {
  id: string;
  patient: string;
  idCard: string;
  visitType: string;
  department: string;
  diagnosis: string;
  insuranceType: string;
  totalAmount: number;
  fundAmount: number;
  personalAmount: number;
  status: SettlementStatus;
  operator: string;
  date: string;
}

interface ClaimBatchItem {
  id: string;
  institution: string;
  settlementCount: number;
  insuranceType: string;
  totalAmount: number;
  claimAmount: number;
  submitter: string;
  submitTime: string;
  status: string;
  returnReason: string;
}

interface ReconcileItem {
  id: string;
  period: string;
  institution: string;
  claimAmount: number;
  confirmedAmount: number;
  diffAmount: number;
  diffType: string;
  confirmer: string;
  confirmTime: string;
  status: string;
}

interface WorkItem {
  id: string;
  patient: string;
  department: string;
  diagnosis: string;
  doctor: string;
  task: string;
  status: string;
  time: string;
}

interface PrescriptionItem {
  id: string;
  patient: string;
  idCard: string;
  doctor: string;
  department: string;
  diagnosis: string;
  itemCount: number;
  amount: number;
  destination: string;
  status: ReviewStatus;
}

interface AlertItem {
  id: string;
  type: string;
  patient: string;
  department: string;
  message: string;
  ruleSource: string;
  level: AlertLevel;
  status: AlertStatus;
}

interface PharmacyOrder {
  id: string;
  prescriptionNo: string;
  patient: string;
  idCard: string;
  sourceHospital: string;
  category: string;
  drugName: string;
  amount: number;
  pharmacist: string;
  status: string;
  date: string;
}

interface PharmacyReviewItem {
  id: string;
  prescriptionNo: string;
  patient: string;
  idCard: string;
  drugName: string;
  reviewRule: string;
  pharmacist: string;
  reviewTime: string;
  status: string;
  reviewOpinion: string;
}

interface PharmacyDispenseItem {
  id: string;
  pickupNo: string;
  patient: string;
  idCard: string;
  drugName: string;
  quantity: string;
  dispenseWindow: string;
  dispenser: string;
  pickupMethod: string;
  status: string;
  dispenseTime: string;
}

interface PharmacySettlementItem {
  id: string;
  settlementNo: string;
  patient: string;
  insuranceType: string;
  category: string;
  totalAmount: number;
  fundAmount: number;
  personalAmount: number;
  cashier: string;
  status: string;
  settlementTime: string;
}

interface PharmacySpecialItem {
  id: string;
  registerNo: string;
  patient: string;
  specialDrug: string;
  treatmentType: string;
  hospital: string;
  approvalStatus: string;
  materialStatus: string;
  registrar: string;
  registerTime: string;
}

interface PharmacyReconcileItem {
  id: string;
  period: string;
  institution: string;
  settlementCount: number;
  settlementAmount: number;
  returnedAmount: number;
  diffAmount: number;
  bankStatus: string;
  operator: string;
  status: string;
}

interface DrugStock {
  id: string;
  drugName: string;
  spec: string;
  traceCode: string;
  batchNo: string;
  manufacturer: string;
  stock: number;
  expireDate: string;
  status: string;
}

const hospitalTabs = [
  { id: 'settlement', label: '结算清单', icon: FileText },
  { id: 'claim', label: '费用申报', icon: Upload },
  { id: 'reconcile', label: '对账确认', icon: CheckCircle },
  { id: 'prescription', label: '处方流转', icon: Pill },
  { id: 'alerts', label: '智能提醒', icon: Bell },
] as const;

const pharmacyTabs = [
  { id: 'receive', label: '处方接收', icon: FileText },
  { id: 'review', label: '药师审方', icon: ShieldCheck },
  { id: 'dispense', label: '调剂发药', icon: Pill },
  { id: 'settle', label: '医保结算', icon: Receipt },
  { id: 'special', label: '特药登记', icon: Bell },
  { id: 'stock', label: '库存追溯', icon: Package },
  { id: 'reconcile', label: '对账回盘', icon: CheckCircle },
] as const;

const patientNames = ['张雨晴', '李书涵', '王思远', '周语桐', '许文博', '陆书怡', '韩宁', '唐悦', '赵静宜', '高宁', '彭雪', '曹颖', '沈知夏', '顾晨曦', '苏子墨', '程若安', '梁嘉禾', '秦以宁', '邵景澄', '蒋安然'];
const idCards = ['320102198903152415', '320104199210083524', '320106198807214516', '320111199407263526', '320302198805204517', '320507200812163214', '320802199511136247', '321102199209047523', '321002198911305624', '320582198604126711', '320684199808217128', '321003197912202226', '320924198910162344', '320701198711234515', '320411199304286722', '320381198908187746', '320621199901054234', '321202198612116419', '321181199112087813', '320922200106145928'];
const departments = ['心内科', '内分泌科', '骨科', '儿科', '妇科', '肿瘤科', '神经内科', '肾内科', '风湿免疫科', '普外科'];
const diagnoses = ['高血压三级', '2型糖尿病', '膝关节损伤', '急性支气管炎', '子宫肌瘤', '乳腺恶性肿瘤门特', '脑卒中恢复期', '慢性肾功能不全', '类风湿关节炎', '胆囊结石术后'];
const insuranceTypes = ['职工医保', '城乡居民医保', '学生医保', '灵活就业医保', '大病保险'];
const doctors = ['王哲', '李慧', '张凯', '陈静', '许峰', '蒋晨', '周浩', '叶青', '郭然', '宋宇'];
const pharmacists = ['周琪', '蒋诚', '叶倩', '陈瑶', '顾川'];
const hospitals = ['江苏省人民医院', '南京鼓楼医院', '苏州大学附属第一医院', '无锡市人民医院', '徐州医科大学附属医院'];
const pharmacies = ['南京国大双通道药店', '苏州雷允上双通道药房', '无锡九州大药房', '常州百姓人家药房', '南通医保特药药房'];
const drugs = ['阿托伐他汀钙片', '门冬胰岛素注射液', '曲妥珠单抗注射液', '阿达木单抗注射液', '利拉鲁肽注射液', '瑞舒伐他汀钙片', '奥希替尼片', '甲磺酸伊马替尼片', '托珠单抗注射液', '依折麦布片'];
const manufacturers = ['江苏豪森药业', '正大天晴药业', '齐鲁制药', '恒瑞医药', '扬子江药业'];

const formatDate = (index: number) => `2026-04-${String(28 - (index % 10)).padStart(2, '0')}`;
const formatTime = (index: number) => `${formatDate(index)} ${String(8 + (index % 9)).padStart(2, '0')}:${String((index * 7) % 60).padStart(2, '0')}`;
const settlementStatuses: SettlementStatus[] = ['待上传', '已上传', '已审核'];
const reviewStatuses: ReviewStatus[] = ['待审方', '已通过', '已退回'];
const alertLevels: AlertLevel[] = ['预警', '严重'];
const alertStatuses: AlertStatus[] = ['待处理', '已处理'];

const hospitalSettlementsSeed: SettlementItem[] = Array.from({ length: 20 }, (_, index) => ({
  id: `ST${String(index + 1).padStart(3, '0')}`,
  patient: patientNames[index],
  idCard: idCards[index],
  visitType: index % 3 === 0 ? '住院' : index % 3 === 1 ? '门诊慢特病' : '普通门诊',
  department: departments[index % departments.length],
  diagnosis: diagnoses[index % diagnoses.length],
  insuranceType: insuranceTypes[index % insuranceTypes.length],
  totalAmount: 1800 + index * 430,
  fundAmount: 1200 + index * 310,
  personalAmount: 600 + index * 120,
  status: settlementStatuses[index % settlementStatuses.length],
  operator: doctors[index % doctors.length],
  date: formatDate(index),
}));

const claimBatchSeed: ClaimBatchItem[] = Array.from({ length: 20 }, (_, index) => ({
  id: `SB${String(index + 1).padStart(3, '0')}`,
  institution: index % 2 === 0 ? '南京市第一医院' : '江苏省人民医院',
  settlementCount: 18 + index,
  insuranceType: insuranceTypes[index % insuranceTypes.length],
  totalAmount: 86000 + index * 5200,
  claimAmount: 64200 + index * 4100,
  submitter: doctors[index % doctors.length],
  submitTime: formatTime(index),
  status: ['待提交', '已提交', '退回修改', '医保受理'][index % 4],
  returnReason: ['无', '缺少护理回传', '门特备案信息缺失', '特药审方说明待补充'][index % 4],
}));

const reconcileSeed: ReconcileItem[] = Array.from({ length: 20 }, (_, index) => ({
  id: `DZ${String(index + 1).padStart(3, '0')}`,
  period: `2026-${String((index % 4) + 1).padStart(2, '0')}月下旬`,
  institution: index % 2 === 0 ? '南京市第一医院' : '江苏省人民医院',
  claimAmount: 128000 + index * 6300,
  confirmedAmount: 126500 + index * 5980,
  diffAmount: 1500 + (index % 5) * 320,
  diffType: ['目录外费用剔除', '重复收费核减', '高值耗材限价差异', '门特待遇差异', '无差异'][index % 5],
  confirmer: doctors[(index + 2) % doctors.length],
  confirmTime: formatTime(index),
  status: ['待确认', '差异处理中', '已确认', '已回退'][index % 4],
}));

const physicianSeed: WorkItem[] = Array.from({ length: 20 }, (_, index) => ({
  id: `YS${String(index + 1).padStart(3, '0')}`,
  patient: patientNames[index],
  department: departments[index % departments.length],
  diagnosis: diagnoses[index % diagnoses.length],
  doctor: doctors[index % doctors.length],
  task: ['补录病程记录', '确认门特外配', '提交住院结算清单', '审核术前检查套餐', '完成双通道特药备案'][index % 5],
  status: ['待处理', '处理中', '待提交', '已完成'][index % 4],
  time: formatTime(index),
}));

const nurseSeed: WorkItem[] = Array.from({ length: 20 }, (_, index) => ({
  id: `HS${String(index + 1).padStart(3, '0')}`,
  patient: patientNames[index],
  department: departments[(index + 2) % departments.length],
  diagnosis: diagnoses[(index + 2) % diagnoses.length],
  doctor: doctors[(index + 3) % doctors.length],
  task: ['回传输液执行单', '上传护理记录单', '核对康复治疗次数', '确认耗材使用', '补录生命体征记录'][index % 5],
  status: ['待执行', '处理中', '待核对', '已完成'][index % 4],
  time: formatTime(index),
}));

const pharmacistSeed: WorkItem[] = Array.from({ length: 20 }, (_, index) => ({
  id: `YSH${String(index + 1).padStart(3, '0')}`,
  patient: patientNames[index],
  department: departments[(index + 4) % departments.length],
  diagnosis: diagnoses[(index + 4) % diagnoses.length],
  doctor: doctors[(index + 5) % doctors.length],
  task: ['双通道特药审核', '围术期抗菌药复核', '生物制剂审方', '门特外配确认', '目录外药品说明'][index % 5],
  status: ['待审方', '处理中', '已完成'][index % 3],
  time: formatTime(index),
}));

const prescriptionSeed: PrescriptionItem[] = Array.from({ length: 20 }, (_, index) => ({
  id: `RX${String(index + 1).padStart(3, '0')}`,
  patient: patientNames[index],
  idCard: idCards[index],
  doctor: doctors[index % doctors.length],
  department: departments[index % departments.length],
  diagnosis: diagnoses[index % diagnoses.length],
  itemCount: 2 + (index % 5),
  amount: 180 + index * 56,
  destination: pharmacies[index % pharmacies.length],
  status: reviewStatuses[index % reviewStatuses.length],
}));

const alertSeed: AlertItem[] = Array.from({ length: 20 }, (_, index) => ({
  id: `AL${String(index + 1).padStart(3, '0')}`,
  type: ['超量用药', '重复收费', '规则拦截', '目录外收费', '诊疗频次异常'][index % 5],
  patient: patientNames[index],
  department: departments[index % departments.length],
  message: ['7日用量超过常规标准', '同日重复开具检查项目', '高值耗材与术式不匹配', '诊疗项目超出目录范围', '慢特病复诊频次异常'][index % 5],
  ruleSource: ['药品规则库', '诊疗项目规则库', '耗材规则库', '门特规则库'][index % 4],
  level: alertLevels[index % alertLevels.length],
  status: alertStatuses[index % alertStatuses.length],
}));

const pharmacyReceiveSeed: PharmacyOrder[] = Array.from({ length: 20 }, (_, index) => ({
  id: `DD${String(index + 1).padStart(3, '0')}`,
  prescriptionNo: `CF202604${String(100 + index).padStart(3, '0')}`,
  patient: patientNames[index],
  idCard: idCards[index],
  sourceHospital: hospitals[index % hospitals.length],
  category: ['双通道特药', '外配处方', '门慢处方', '门特处方'][index % 4],
  drugName: drugs[index % drugs.length],
  amount: 220 + index * 148,
  pharmacist: pharmacists[index % pharmacists.length],
  status: ['待接收', '已接收', '待审方', '待发药'][index % 4],
  date: formatTime(index),
}));

const pharmacyReviewSeed: PharmacyOrder[] = Array.from({ length: 20 }, (_, index) => ({
  ...pharmacyReceiveSeed[index],
  id: `SF${String(index + 1).padStart(3, '0')}`,
  status: ['待审方', '已通过', '已退回'][index % 3],
}));

const pharmacyReviewDetailSeed: PharmacyReviewItem[] = Array.from({ length: 20 }, (_, index) => ({
  id: `SF${String(index + 1).padStart(3, '0')}`,
  prescriptionNo: `CF202604${String(100 + index).padStart(3, '0')}`,
  patient: patientNames[index],
  idCard: idCards[index],
  drugName: drugs[index % drugs.length],
  reviewRule: ['重复用药校验', '双通道资格校验', '门特诊断匹配', '超量给药预警'][index % 4],
  pharmacist: pharmacists[index % pharmacists.length],
  reviewTime: formatTime(index),
  status: ['待审方', '已通过', '已退回'][index % 3],
  reviewOpinion: ['待审方', '符合处方流转条件', '缺少门特备案', '处方剂量需复核'][index % 4],
}));

const pharmacyDispenseSeed: PharmacyDispenseItem[] = Array.from({ length: 20 }, (_, index) => ({
  id: `FY${String(index + 1).padStart(3, '0')}`,
  pickupNo: `QY${String(300 + index).padStart(4, '0')}`,
  patient: patientNames[index],
  idCard: idCards[index],
  drugName: drugs[index % drugs.length],
  quantity: `${1 + (index % 3)}盒 / ${1 + (index % 2)}支`,
  dispenseWindow: `发药${(index % 4) + 1}号窗`,
  dispenser: pharmacists[index % pharmacists.length],
  pickupMethod: ['窗口自取', '院内配送', '冷链配送'][index % 3],
  status: ['待发药', '已发药', '已取药', '配送中'][index % 4],
  dispenseTime: formatTime(index),
}));

const pharmacySpecialSeed: PharmacySpecialItem[] = Array.from({ length: 20 }, (_, index) => ({
  id: `TY${String(index + 1).padStart(3, '0')}`,
  registerNo: `ZY${String(500 + index).padStart(4, '0')}`,
  patient: patientNames[index],
  specialDrug: drugs[(index + 2) % drugs.length],
  treatmentType: ['双通道特药', '门特续方', '肿瘤靶向治疗', '罕见病用药'][index % 4],
  hospital: hospitals[index % hospitals.length],
  approvalStatus: ['待登记', '已登记', '审核退回'][index % 3],
  materialStatus: ['材料齐全', '缺少处方原件', '缺少备案凭证', '待补患者承诺书'][index % 4],
  registrar: pharmacists[index % pharmacists.length],
  registerTime: formatTime(index),
}));

const pharmacySettlementSeed: PharmacySettlementItem[] = Array.from({ length: 20 }, (_, index) => ({
  id: `JS${String(index + 1).padStart(3, '0')}`,
  settlementNo: `YBJS${String(800 + index).padStart(5, '0')}`,
  patient: patientNames[index],
  insuranceType: insuranceTypes[index % insuranceTypes.length],
  category: ['双通道特药结算', '外配处方结算', '门慢处方结算', '门特处方结算'][index % 4],
  totalAmount: 600 + index * 210,
  fundAmount: 420 + index * 168,
  personalAmount: 180 + index * 42,
  cashier: pharmacists[index % pharmacists.length],
  status: ['已结算', '待回盘', '已回盘', '结算退回'][index % 4],
  settlementTime: formatTime(index),
}));

const pharmacyReconcileSeed: PharmacyReconcileItem[] = Array.from({ length: 20 }, (_, index) => ({
  id: `HP${String(index + 1).padStart(3, '0')}`,
  period: `2026-${String((index % 4) + 1).padStart(2, '0')}月`,
  institution: '南京国大双通道药店',
  settlementCount: 22 + index,
  settlementAmount: 98000 + index * 4500,
  returnedAmount: 96500 + index * 4300,
  diffAmount: 1500 + (index % 5) * 260,
  bankStatus: ['银行已回盘', '待银行回盘', '回盘失败'][index % 3],
  operator: pharmacists[index % pharmacists.length],
  status: ['待核对', '差异处理中', '已确认', '已回退'][index % 4],
}));

const stockSeed: DrugStock[] = Array.from({ length: 20 }, (_, index) => ({
  id: `KC${String(index + 1).padStart(3, '0')}`,
  drugName: drugs[index % drugs.length],
  spec: ['10mg*28片', '40mg/支', '440mg/瓶', '3ml:300IU', '80mg*30片'][index % 5],
  traceCode: `69012345${String(1000 + index)}`,
  batchNo: `JP${202604 + index}`,
  manufacturer: manufacturers[index % manufacturers.length],
  stock: 5 + index * 3,
  expireDate: `2027-${String((index % 9) + 1).padStart(2, '0')}-28`,
  status: index % 5 === 0 ? '近效期预警' : index % 4 === 0 ? '低库存预警' : '库存正常',
}));

const StatCard = ({ title, value, subValue }: { title: string; value: string; subValue: string }) => (
  <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
    <p className="text-sm text-gray-500">{title}</p>
    <p className="mt-3 text-2xl font-bold text-gray-800">{value}</p>
    <p className="mt-2 text-xs text-gray-400">{subValue}</p>
  </div>
);

const SectionBlock = ({ title, desc, children }: { title: string; desc: string; children: React.ReactNode }) => (
  <div className="space-y-3 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
    <div className="flex items-start justify-between gap-3">
      <div>
        <h3 className="text-base font-semibold text-gray-800">{title}</h3>
        <p className="mt-1 text-sm text-gray-500">{desc}</p>
      </div>
    </div>
    {children}
  </div>
);

export default function InstitutionPortal({ portalRole = 'institution_hospital' }: InstitutionPortalProps) {
  const [mode, setMode] = useState<PortalMode>('hospital');
  const [hospitalTab, setHospitalTab] = useState<(typeof hospitalTabs)[number]['id']>('settlement');
  const [pharmacyTab, setPharmacyTab] = useState<(typeof pharmacyTabs)[number]['id']>('receive');
  const [searchText, setSearchText] = useState('');
  const [settlements, setSettlements] = useState<SettlementItem[]>(hospitalSettlementsSeed);
  const [claimBatches, setClaimBatches] = useState<ClaimBatchItem[]>(claimBatchSeed);
  const [reconciles, setReconciles] = useState<ReconcileItem[]>(reconcileSeed);
  const [prescriptions, setPrescriptions] = useState<PrescriptionItem[]>(prescriptionSeed);
  const [alerts, setAlerts] = useState<AlertItem[]>(alertSeed);
  const [showModal, setShowModal] = useState(false);
  const [currentSettlement, setCurrentSettlement] = useState<SettlementItem | null>(null);

  useEffect(() => {
    const search = new URLSearchParams(window.location.hash.split('?')[1] || '');
    const hashMode = search.get('mode');
    if (hashMode === 'pharmacy') {
      setMode('pharmacy');
      return;
    }
    if (portalRole === 'institution_pharmacy') {
      setMode('pharmacy');
      return;
    }
    setMode('hospital');
  }, [portalRole]);

  const headerTitle = mode === 'hospital' ? '医疗机构门户 / 医院端' : '医疗机构门户 / 药店端';

  const filteredSettlements = useMemo(() => {
    if (!searchText.trim()) return settlements;
    return settlements.filter((item) => [item.id, item.patient, item.idCard, item.department, item.diagnosis].some((field) => field.includes(searchText)));
  }, [searchText, settlements]);

  const filteredClaimBatches = useMemo(() => {
    if (!searchText.trim()) return claimBatches;
    return claimBatches.filter((item) =>
      [item.id, item.institution, item.insuranceType, item.status, item.submitter, item.returnReason].some((field) => field.includes(searchText)),
    );
  }, [claimBatches, searchText]);

  const filteredReconciles = useMemo(() => {
    if (!searchText.trim()) return reconciles;
    return reconciles.filter((item) =>
      [item.id, item.period, item.institution, item.diffType, item.status, item.confirmer].some((field) => field.includes(searchText)),
    );
  }, [reconciles, searchText]);

  const filteredPrescriptions = useMemo(() => {
    if (!searchText.trim()) return prescriptions;
    return prescriptions.filter((item) => [item.id, item.patient, item.idCard, item.department, item.diagnosis, item.destination].some((field) => field.includes(searchText)));
  }, [searchText, prescriptions]);

  const filteredAlerts = useMemo(() => {
    if (!searchText.trim()) return alerts;
    return alerts.filter((item) => [item.id, item.patient, item.department, item.type, item.message].some((field) => field.includes(searchText)));
  }, [searchText, alerts]);

  const filterOrders = (rows: PharmacyOrder[]) => {
    if (!searchText.trim()) return rows;
    return rows.filter((item) =>
      [item.id, item.prescriptionNo, item.patient, item.idCard, item.sourceHospital, item.drugName, item.category].some((field) => field.includes(searchText)),
    );
  };

  const filterReviews = (rows: PharmacyReviewItem[]) => {
    if (!searchText.trim()) return rows;
    return rows.filter((item) =>
      [item.id, item.prescriptionNo, item.patient, item.idCard, item.drugName, item.reviewRule, item.status, item.reviewOpinion].some((field) =>
        field.includes(searchText),
      ),
    );
  };

  const filterDispenses = (rows: PharmacyDispenseItem[]) => {
    if (!searchText.trim()) return rows;
    return rows.filter((item) =>
      [item.id, item.pickupNo, item.patient, item.idCard, item.drugName, item.dispenseWindow, item.pickupMethod, item.status].some((field) =>
        field.includes(searchText),
      ),
    );
  };

  const filterSettlements = (rows: PharmacySettlementItem[]) => {
    if (!searchText.trim()) return rows;
    return rows.filter((item) =>
      [item.id, item.settlementNo, item.patient, item.insuranceType, item.category, item.cashier, item.status].some((field) =>
        field.includes(searchText),
      ),
    );
  };

  const filterSpecials = (rows: PharmacySpecialItem[]) => {
    if (!searchText.trim()) return rows;
    return rows.filter((item) =>
      [item.id, item.registerNo, item.patient, item.specialDrug, item.treatmentType, item.hospital, item.approvalStatus, item.materialStatus].some(
        (field) => field.includes(searchText),
      ),
    );
  };

  const filterReconciles = (rows: PharmacyReconcileItem[]) => {
    if (!searchText.trim()) return rows;
    return rows.filter((item) =>
      [item.id, item.period, item.institution, item.bankStatus, item.operator, item.status].some((field) => field.includes(searchText)),
    );
  };

  const filterStocks = (rows: DrugStock[]) => {
    if (!searchText.trim()) return rows;
    return rows.filter((item) =>
      [item.id, item.drugName, item.spec, item.traceCode, item.batchNo, item.manufacturer, item.status].some((field) => field.includes(searchText)),
    );
  };

  const handleUploadSettlement = () => {
    const item = settlements.find((row) => row.status === '待上传');
    if (!item) return;
    setSettlements((prev) => prev.map((row) => (row.id === item.id ? { ...row, status: '已上传' } : row)));
  };

  const handleDeleteSettlement = (id: string) => {
    setSettlements((prev) => prev.filter((row) => row.id !== id));
  };

  const handleViewSettlement = (item: SettlementItem) => {
    setCurrentSettlement(item);
    setShowModal(true);
  };

  const handleAlert = (id: string) => {
    setAlerts((prev) => prev.map((item) => (item.id === id ? { ...item, status: '已处理' } : item)));
  };

  const handlePrescriptionStatus = (id: string, status: ReviewStatus) => {
    setPrescriptions((prev) => prev.map((item) => (item.id === id ? { ...item, status } : item)));
  };

  const handleCreateClaimBatch = () => {
    const pendingSettlements = settlements.filter((item) => item.status !== '待上传');
    const submitTime = new Date().toISOString().slice(0, 16).replace('T', ' ');
    const totalAmount = pendingSettlements.reduce((sum, item) => sum + item.totalAmount, 0);
    const claimAmount = pendingSettlements.reduce((sum, item) => sum + item.fundAmount, 0);
    const newBatch: ClaimBatchItem = {
      id: `SB${String(claimBatches.length + 1).padStart(3, '0')}`,
      institution: '南京市第一医院',
      settlementCount: pendingSettlements.length || settlements.length,
      insuranceType: '职工医保',
      totalAmount,
      claimAmount,
      submitter: '王哲',
      submitTime,
      status: '已提交',
      returnReason: '无',
    };
    setClaimBatches((prev) => [newBatch, ...prev]);
  };

  const handleConfirmReconcile = () => {
    const latestTime = new Date().toISOString().slice(0, 16).replace('T', ' ');
    setReconciles((prev) =>
      prev.map((item, index) =>
        index === 0 || item.status === '待确认'
          ? { ...item, status: '已确认', confirmer: '周琛', confirmTime: latestTime, diffAmount: 0, diffType: '无差异' }
          : item,
      ),
    );
  };

  const renderToolbar = (placeholder: string, primaryAction?: { label: string; onClick: () => void }) => (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-gray-200 bg-white p-4">
      <div className="relative w-full max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <input
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          placeholder={placeholder}
          className="w-full rounded-xl border border-gray-200 py-2.5 pl-9 pr-4 text-sm outline-none transition focus:border-cyan-500"
        />
      </div>
      <div className="flex items-center gap-2">
        <button className="rounded-xl border border-gray-200 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50">导出</button>
        {primaryAction && (
          <button onClick={primaryAction.onClick} className="rounded-xl bg-cyan-600 px-4 py-2 text-sm text-white hover:bg-cyan-700">
            {primaryAction.label}
          </button>
        )}
      </div>
    </div>
  );

  const renderSettlementTable = (title: string) => (
    <div className="space-y-4">
      {renderToolbar('搜索清单号、姓名、身份证号、诊断', {
        label: title === '费用申报' ? '批量申报' : '上传清单',
        onClick: handleUploadSettlement,
      })}
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="px-4 py-3 text-left">清单号</th>
              <th className="px-4 py-3 text-left">参保人</th>
              <th className="px-4 py-3 text-left">身份证号</th>
              <th className="px-4 py-3 text-left">就诊类型</th>
              <th className="px-4 py-3 text-left">科室</th>
              <th className="px-4 py-3 text-left">诊断</th>
              <th className="px-4 py-3 text-left">总费用</th>
              <th className="px-4 py-3 text-left">基金支付</th>
              <th className="px-4 py-3 text-left">个人自付</th>
              <th className="px-4 py-3 text-left">状态</th>
              <th className="px-4 py-3 text-left">操作</th>
            </tr>
          </thead>
          <tbody>
            {filteredSettlements.map((item) => (
              <tr key={item.id} className="border-t border-gray-100 hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-gray-800">{item.id}</td>
                <td className="px-4 py-3">{item.patient}</td>
                <td className="px-4 py-3">{item.idCard}</td>
                <td className="px-4 py-3">{item.visitType}</td>
                <td className="px-4 py-3">{item.department}</td>
                <td className="px-4 py-3">{item.diagnosis}</td>
                <td className="px-4 py-3">¥{item.totalAmount.toLocaleString()}</td>
                <td className="px-4 py-3 text-green-700">¥{item.fundAmount.toLocaleString()}</td>
                <td className="px-4 py-3 text-orange-700">¥{item.personalAmount.toLocaleString()}</td>
                <td className="px-4 py-3">{item.status}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <button onClick={() => handleViewSettlement(item)} className="rounded-lg p-1.5 text-blue-600 hover:bg-blue-50">
                      <Eye className="h-4 w-4" />
                    </button>
                    <button onClick={() => handleDeleteSettlement(item.id)} className="rounded-lg p-1.5 text-red-600 hover:bg-red-50">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderClaimBatchTable = () => (
    <div className="space-y-4">
      {renderToolbar('搜索申报批次号、申报机构、险种、状态', {
        label: '发起申报',
        onClick: handleCreateClaimBatch,
      })}
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="px-4 py-3 text-left">申报批次号</th>
              <th className="px-4 py-3 text-left">申报机构</th>
              <th className="px-4 py-3 text-left">清单数量</th>
              <th className="px-4 py-3 text-left">险种类型</th>
              <th className="px-4 py-3 text-left">清单总金额</th>
              <th className="px-4 py-3 text-left">申报金额</th>
              <th className="px-4 py-3 text-left">提交人</th>
              <th className="px-4 py-3 text-left">提交时间</th>
              <th className="px-4 py-3 text-left">申报状态</th>
              <th className="px-4 py-3 text-left">退回原因</th>
            </tr>
          </thead>
          <tbody>
            {filteredClaimBatches.map((item) => (
              <tr key={item.id} className="border-t border-gray-100 hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-gray-800">{item.id}</td>
                <td className="px-4 py-3">{item.institution}</td>
                <td className="px-4 py-3">{item.settlementCount}</td>
                <td className="px-4 py-3">{item.insuranceType}</td>
                <td className="px-4 py-3">¥{item.totalAmount.toLocaleString()}</td>
                <td className="px-4 py-3 text-green-700">¥{item.claimAmount.toLocaleString()}</td>
                <td className="px-4 py-3">{item.submitter}</td>
                <td className="px-4 py-3">{item.submitTime}</td>
                <td className="px-4 py-3">{item.status}</td>
                <td className="px-4 py-3">{item.returnReason}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderReconcileTable = () => (
    <div className="space-y-4">
      {renderToolbar('搜索对账批次号、结算周期、差异类型、状态', {
        label: '确认对账',
        onClick: handleConfirmReconcile,
      })}
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="px-4 py-3 text-left">对账批次号</th>
              <th className="px-4 py-3 text-left">结算周期</th>
              <th className="px-4 py-3 text-left">机构名称</th>
              <th className="px-4 py-3 text-left">申报金额</th>
              <th className="px-4 py-3 text-left">医保确认金额</th>
              <th className="px-4 py-3 text-left">差异金额</th>
              <th className="px-4 py-3 text-left">差异类型</th>
              <th className="px-4 py-3 text-left">确认人</th>
              <th className="px-4 py-3 text-left">确认时间</th>
              <th className="px-4 py-3 text-left">对账状态</th>
            </tr>
          </thead>
          <tbody>
            {filteredReconciles.map((item) => (
              <tr key={item.id} className="border-t border-gray-100 hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-gray-800">{item.id}</td>
                <td className="px-4 py-3">{item.period}</td>
                <td className="px-4 py-3">{item.institution}</td>
                <td className="px-4 py-3">¥{item.claimAmount.toLocaleString()}</td>
                <td className="px-4 py-3 text-green-700">¥{item.confirmedAmount.toLocaleString()}</td>
                <td className="px-4 py-3 text-orange-700">¥{item.diffAmount.toLocaleString()}</td>
                <td className="px-4 py-3">{item.diffType}</td>
                <td className="px-4 py-3">{item.confirmer}</td>
                <td className="px-4 py-3">{item.confirmTime}</td>
                <td className="px-4 py-3">{item.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderWorkTable = (rows: WorkItem[], title: string) => (
    <div className="space-y-4">
      {renderToolbar(`搜索${title}任务号、姓名、诊断`)}
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="px-4 py-3 text-left">任务号</th>
              <th className="px-4 py-3 text-left">患者姓名</th>
              <th className="px-4 py-3 text-left">科室</th>
              <th className="px-4 py-3 text-left">诊断</th>
              <th className="px-4 py-3 text-left">责任医生</th>
              <th className="px-4 py-3 text-left">当前任务</th>
              <th className="px-4 py-3 text-left">状态</th>
              <th className="px-4 py-3 text-left">更新时间</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((item) => (
              <tr key={item.id} className="border-t border-gray-100 hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-gray-800">{item.id}</td>
                <td className="px-4 py-3">{item.patient}</td>
                <td className="px-4 py-3">{item.department}</td>
                <td className="px-4 py-3">{item.diagnosis}</td>
                <td className="px-4 py-3">{item.doctor}</td>
                <td className="px-4 py-3">{item.task}</td>
                <td className="px-4 py-3">{item.status}</td>
                <td className="px-4 py-3">{item.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderAlertTable = () => (
    <div className="space-y-4">
      {renderToolbar('搜索预警编号、姓名、规则来源、预警类型')}
      <div className="space-y-3">
        {filteredAlerts.map((item) => (
          <div key={item.id} className={`rounded-2xl border p-4 ${item.level === '严重' ? 'border-red-200 bg-red-50' : 'border-amber-200 bg-amber-50'}`}>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <AlertTriangle className={`h-5 w-5 ${item.level === '严重' ? 'text-red-600' : 'text-amber-600'}`} />
                <div>
                  <p className="font-semibold text-gray-800">{item.id} · {item.type}</p>
                  <p className="text-sm text-gray-600">{item.patient} / {item.department} / {item.ruleSource}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-white/80 px-3 py-1 text-xs text-gray-600">{item.status}</span>
                {item.status === '待处理' && (
                  <button onClick={() => handleAlert(item.id)} className="rounded-xl bg-cyan-600 px-3 py-1.5 text-sm text-white hover:bg-cyan-700">
                    处理
                  </button>
                )}
              </div>
            </div>
            <p className="mt-3 text-sm text-gray-700">{item.message}</p>
          </div>
        ))}
      </div>
    </div>
  );

  const renderPrescriptionTable = () => (
    <div className="space-y-4">
      {renderToolbar('搜索处方号、姓名、身份证号、流转药店')}
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="px-4 py-3 text-left">处方号</th>
              <th className="px-4 py-3 text-left">患者姓名</th>
              <th className="px-4 py-3 text-left">身份证号</th>
              <th className="px-4 py-3 text-left">开方医生</th>
              <th className="px-4 py-3 text-left">科室</th>
              <th className="px-4 py-3 text-left">诊断</th>
              <th className="px-4 py-3 text-left">药品数</th>
              <th className="px-4 py-3 text-left">处方金额</th>
              <th className="px-4 py-3 text-left">流转药店</th>
              <th className="px-4 py-3 text-left">状态</th>
              <th className="px-4 py-3 text-left">操作</th>
            </tr>
          </thead>
          <tbody>
            {filteredPrescriptions.map((item) => (
              <tr key={item.id} className="border-t border-gray-100 hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-gray-800">{item.id}</td>
                <td className="px-4 py-3">{item.patient}</td>
                <td className="px-4 py-3">{item.idCard}</td>
                <td className="px-4 py-3">{item.doctor}</td>
                <td className="px-4 py-3">{item.department}</td>
                <td className="px-4 py-3">{item.diagnosis}</td>
                <td className="px-4 py-3">{item.itemCount}</td>
                <td className="px-4 py-3">¥{item.amount.toLocaleString()}</td>
                <td className="px-4 py-3">{item.destination}</td>
                <td className="px-4 py-3">{item.status}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <button onClick={() => handlePrescriptionStatus(item.id, '已通过')} className="rounded-lg p-1.5 text-green-600 hover:bg-green-50">
                      <Check className="h-4 w-4" />
                    </button>
                    <button onClick={() => handlePrescriptionStatus(item.id, '已退回')} className="rounded-lg p-1.5 text-red-600 hover:bg-red-50">
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderOrderTable = (rows: PharmacyOrder[], primaryLabel?: string) => (
    <div className="space-y-4">
      {renderToolbar('搜索处方号、姓名、身份证号、来源医院、药品名称')}
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="px-4 py-3 text-left">{primaryLabel || '业务编号'}</th>
              <th className="px-4 py-3 text-left">处方号</th>
              <th className="px-4 py-3 text-left">参保人</th>
              <th className="px-4 py-3 text-left">身份证号</th>
              <th className="px-4 py-3 text-left">来源医院</th>
              <th className="px-4 py-3 text-left">业务类别</th>
              <th className="px-4 py-3 text-left">药品名称</th>
              <th className="px-4 py-3 text-left">金额</th>
              <th className="px-4 py-3 text-left">药师</th>
              <th className="px-4 py-3 text-left">状态</th>
              <th className="px-4 py-3 text-left">时间</th>
            </tr>
          </thead>
          <tbody>
            {filterOrders(rows).map((item) => (
              <tr key={item.id} className="border-t border-gray-100 hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-gray-800">{item.id}</td>
                <td className="px-4 py-3">{item.prescriptionNo}</td>
                <td className="px-4 py-3">{item.patient}</td>
                <td className="px-4 py-3">{item.idCard}</td>
                <td className="px-4 py-3">{item.sourceHospital}</td>
                <td className="px-4 py-3">{item.category}</td>
                <td className="px-4 py-3">{item.drugName}</td>
                <td className="px-4 py-3">¥{item.amount.toLocaleString()}</td>
                <td className="px-4 py-3">{item.pharmacist}</td>
                <td className="px-4 py-3">{item.status}</td>
                <td className="px-4 py-3">{item.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderReviewTable = () => (
    <div className="space-y-4">
      {renderToolbar('搜索审方编号、处方号、药品名称、审方规则')}
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="px-4 py-3 text-left">审方编号</th>
              <th className="px-4 py-3 text-left">处方号</th>
              <th className="px-4 py-3 text-left">患者姓名</th>
              <th className="px-4 py-3 text-left">药品名称</th>
              <th className="px-4 py-3 text-left">审方规则</th>
              <th className="px-4 py-3 text-left">审方药师</th>
              <th className="px-4 py-3 text-left">审方时间</th>
              <th className="px-4 py-3 text-left">状态</th>
              <th className="px-4 py-3 text-left">审方意见</th>
            </tr>
          </thead>
          <tbody>
            {filterReviews(pharmacyReviewDetailSeed).map((item) => (
              <tr key={item.id} className="border-t border-gray-100 hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-gray-800">{item.id}</td>
                <td className="px-4 py-3">{item.prescriptionNo}</td>
                <td className="px-4 py-3">{item.patient}</td>
                <td className="px-4 py-3">{item.drugName}</td>
                <td className="px-4 py-3">{item.reviewRule}</td>
                <td className="px-4 py-3">{item.pharmacist}</td>
                <td className="px-4 py-3">{item.reviewTime}</td>
                <td className="px-4 py-3">{item.status}</td>
                <td className="px-4 py-3">{item.reviewOpinion}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderDispenseTable = () => (
    <div className="space-y-4">
      {renderToolbar('搜索发药编号、取药号、发药窗口、取药方式')}
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="px-4 py-3 text-left">发药编号</th>
              <th className="px-4 py-3 text-left">取药号</th>
              <th className="px-4 py-3 text-left">患者姓名</th>
              <th className="px-4 py-3 text-left">药品名称</th>
              <th className="px-4 py-3 text-left">数量</th>
              <th className="px-4 py-3 text-left">发药窗口</th>
              <th className="px-4 py-3 text-left">发药员</th>
              <th className="px-4 py-3 text-left">取药方式</th>
              <th className="px-4 py-3 text-left">状态</th>
              <th className="px-4 py-3 text-left">发药时间</th>
            </tr>
          </thead>
          <tbody>
            {filterDispenses(pharmacyDispenseSeed).map((item) => (
              <tr key={item.id} className="border-t border-gray-100 hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-gray-800">{item.id}</td>
                <td className="px-4 py-3">{item.pickupNo}</td>
                <td className="px-4 py-3">{item.patient}</td>
                <td className="px-4 py-3">{item.drugName}</td>
                <td className="px-4 py-3">{item.quantity}</td>
                <td className="px-4 py-3">{item.dispenseWindow}</td>
                <td className="px-4 py-3">{item.dispenser}</td>
                <td className="px-4 py-3">{item.pickupMethod}</td>
                <td className="px-4 py-3">{item.status}</td>
                <td className="px-4 py-3">{item.dispenseTime}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderPharmacySettlementTable = () => (
    <div className="space-y-4">
      {renderToolbar('搜索结算编号、结算单号、险种、结算状态')}
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="px-4 py-3 text-left">结算编号</th>
              <th className="px-4 py-3 text-left">结算单号</th>
              <th className="px-4 py-3 text-left">患者姓名</th>
              <th className="px-4 py-3 text-left">险种类型</th>
              <th className="px-4 py-3 text-left">结算类别</th>
              <th className="px-4 py-3 text-left">总金额</th>
              <th className="px-4 py-3 text-left">医保支付</th>
              <th className="px-4 py-3 text-left">个人自付</th>
              <th className="px-4 py-3 text-left">收费员</th>
              <th className="px-4 py-3 text-left">状态</th>
              <th className="px-4 py-3 text-left">结算时间</th>
            </tr>
          </thead>
          <tbody>
            {filterSettlements(pharmacySettlementSeed).map((item) => (
              <tr key={item.id} className="border-t border-gray-100 hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-gray-800">{item.id}</td>
                <td className="px-4 py-3">{item.settlementNo}</td>
                <td className="px-4 py-3">{item.patient}</td>
                <td className="px-4 py-3">{item.insuranceType}</td>
                <td className="px-4 py-3">{item.category}</td>
                <td className="px-4 py-3">¥{item.totalAmount.toLocaleString()}</td>
                <td className="px-4 py-3 text-green-700">¥{item.fundAmount.toLocaleString()}</td>
                <td className="px-4 py-3 text-orange-700">¥{item.personalAmount.toLocaleString()}</td>
                <td className="px-4 py-3">{item.cashier}</td>
                <td className="px-4 py-3">{item.status}</td>
                <td className="px-4 py-3">{item.settlementTime}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderSpecialTable = () => (
    <div className="space-y-4">
      {renderToolbar('搜索登记编号、特药名称、治疗类型、材料状态')}
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="px-4 py-3 text-left">登记编号</th>
              <th className="px-4 py-3 text-left">登记单号</th>
              <th className="px-4 py-3 text-left">患者姓名</th>
              <th className="px-4 py-3 text-left">特药名称</th>
              <th className="px-4 py-3 text-left">治疗类型</th>
              <th className="px-4 py-3 text-left">来源医院</th>
              <th className="px-4 py-3 text-left">审批状态</th>
              <th className="px-4 py-3 text-left">材料状态</th>
              <th className="px-4 py-3 text-left">登记人</th>
              <th className="px-4 py-3 text-left">登记时间</th>
            </tr>
          </thead>
          <tbody>
            {filterSpecials(pharmacySpecialSeed).map((item) => (
              <tr key={item.id} className="border-t border-gray-100 hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-gray-800">{item.id}</td>
                <td className="px-4 py-3">{item.registerNo}</td>
                <td className="px-4 py-3">{item.patient}</td>
                <td className="px-4 py-3">{item.specialDrug}</td>
                <td className="px-4 py-3">{item.treatmentType}</td>
                <td className="px-4 py-3">{item.hospital}</td>
                <td className="px-4 py-3">{item.approvalStatus}</td>
                <td className="px-4 py-3">{item.materialStatus}</td>
                <td className="px-4 py-3">{item.registrar}</td>
                <td className="px-4 py-3">{item.registerTime}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderPharmacyReconcileTable = () => (
    <div className="space-y-4">
      {renderToolbar('搜索回盘批次、周期、银行状态、对账状态')}
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="px-4 py-3 text-left">回盘批次号</th>
              <th className="px-4 py-3 text-left">对账周期</th>
              <th className="px-4 py-3 text-left">机构名称</th>
              <th className="px-4 py-3 text-left">结算笔数</th>
              <th className="px-4 py-3 text-left">结算金额</th>
              <th className="px-4 py-3 text-left">回盘金额</th>
              <th className="px-4 py-3 text-left">差异金额</th>
              <th className="px-4 py-3 text-left">银行状态</th>
              <th className="px-4 py-3 text-left">经办人</th>
              <th className="px-4 py-3 text-left">对账状态</th>
            </tr>
          </thead>
          <tbody>
            {filterReconciles(pharmacyReconcileSeed).map((item) => (
              <tr key={item.id} className="border-t border-gray-100 hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-gray-800">{item.id}</td>
                <td className="px-4 py-3">{item.period}</td>
                <td className="px-4 py-3">{item.institution}</td>
                <td className="px-4 py-3">{item.settlementCount}</td>
                <td className="px-4 py-3">¥{item.settlementAmount.toLocaleString()}</td>
                <td className="px-4 py-3 text-green-700">¥{item.returnedAmount.toLocaleString()}</td>
                <td className="px-4 py-3 text-orange-700">¥{item.diffAmount.toLocaleString()}</td>
                <td className="px-4 py-3">{item.bankStatus}</td>
                <td className="px-4 py-3">{item.operator}</td>
                <td className="px-4 py-3">{item.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderStockTable = () => (
    <div className="space-y-4">
      {renderToolbar('搜索药品名称、追溯码、批号、生产企业')}
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="px-4 py-3 text-left">库存编号</th>
              <th className="px-4 py-3 text-left">药品名称</th>
              <th className="px-4 py-3 text-left">规格</th>
              <th className="px-4 py-3 text-left">追溯码</th>
              <th className="px-4 py-3 text-left">批号</th>
              <th className="px-4 py-3 text-left">生产企业</th>
              <th className="px-4 py-3 text-left">库存量</th>
              <th className="px-4 py-3 text-left">有效期</th>
              <th className="px-4 py-3 text-left">状态</th>
            </tr>
          </thead>
          <tbody>
            {filterStocks(stockSeed).map((item) => (
              <tr key={item.id} className="border-t border-gray-100 hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-gray-800">{item.id}</td>
                <td className="px-4 py-3">{item.drugName}</td>
                <td className="px-4 py-3">{item.spec}</td>
                <td className="px-4 py-3">{item.traceCode}</td>
                <td className="px-4 py-3">{item.batchNo}</td>
                <td className="px-4 py-3">{item.manufacturer}</td>
                <td className="px-4 py-3">{item.stock}</td>
                <td className="px-4 py-3">{item.expireDate}</td>
                <td className="px-4 py-3">{item.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderHospitalClaimPanel = () => (
    <div className="space-y-4">
      {renderClaimBatchTable()}
      <div className="grid gap-4 xl:grid-cols-2">
        <SectionBlock title="医师协同" desc="围绕病历补录、门特外配确认、清单提交等申报前置事项。">
          <div className="overflow-hidden rounded-xl border border-gray-100">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50 text-gray-600">
                <tr>
                  <th className="px-4 py-3 text-left">任务号</th>
                  <th className="px-4 py-3 text-left">患者姓名</th>
                  <th className="px-4 py-3 text-left">当前任务</th>
                  <th className="px-4 py-3 text-left">状态</th>
                </tr>
              </thead>
              <tbody>
                {physicianSeed.slice(0, 8).map((item) => (
                  <tr key={item.id} className="border-t border-gray-100">
                    <td className="px-4 py-3 font-medium text-gray-800">{item.id}</td>
                    <td className="px-4 py-3">{item.patient}</td>
                    <td className="px-4 py-3">{item.task}</td>
                    <td className="px-4 py-3">{item.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SectionBlock>
        <SectionBlock title="护理补录" desc="围绕护理执行回传、耗材补录、执行单补传等申报支撑事项。">
          <div className="overflow-hidden rounded-xl border border-gray-100">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50 text-gray-600">
                <tr>
                  <th className="px-4 py-3 text-left">任务号</th>
                  <th className="px-4 py-3 text-left">患者姓名</th>
                  <th className="px-4 py-3 text-left">当前任务</th>
                  <th className="px-4 py-3 text-left">状态</th>
                </tr>
              </thead>
              <tbody>
                {nurseSeed.slice(0, 8).map((item) => (
                  <tr key={item.id} className="border-t border-gray-100">
                    <td className="px-4 py-3 font-medium text-gray-800">{item.id}</td>
                    <td className="px-4 py-3">{item.patient}</td>
                    <td className="px-4 py-3">{item.task}</td>
                    <td className="px-4 py-3">{item.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SectionBlock>
      </div>
    </div>
  );

  const renderHospitalReconcilePanel = () => (
    <div className="space-y-4">
      {renderReconcileTable()}
      <SectionBlock title="药学复核" desc="对账前集中查看药学复核、特药审核和目录外用药说明。">
        <div className="overflow-hidden rounded-xl border border-gray-100">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="px-4 py-3 text-left">任务号</th>
                <th className="px-4 py-3 text-left">患者姓名</th>
                <th className="px-4 py-3 text-left">复核事项</th>
                <th className="px-4 py-3 text-left">状态</th>
                <th className="px-4 py-3 text-left">更新时间</th>
              </tr>
            </thead>
            <tbody>
              {pharmacistSeed.slice(0, 10).map((item) => (
                <tr key={item.id} className="border-t border-gray-100">
                  <td className="px-4 py-3 font-medium text-gray-800">{item.id}</td>
                  <td className="px-4 py-3">{item.patient}</td>
                  <td className="px-4 py-3">{item.task}</td>
                  <td className="px-4 py-3">{item.status}</td>
                  <td className="px-4 py-3">{item.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionBlock>
    </div>
  );

  const renderHospitalPrescriptionPanel = () => (
    <div className="space-y-4">
      {renderPrescriptionTable()}
      <div className="grid gap-4 xl:grid-cols-2">
        <SectionBlock title="医师开方协同" desc="查看待流转处方、门慢门特外配处方和双通道特药处方。">
          <div className="space-y-3">
            {prescriptions.slice(0, 6).map((item) => (
              <div key={item.id} className="rounded-xl border border-gray-100 bg-gray-50 px-4 py-3">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-medium text-gray-800">{item.id} · {item.patient}</p>
                    <p className="mt-1 text-sm text-gray-500">{item.department} / {item.diagnosis} / {item.destination}</p>
                  </div>
                  <span className="rounded-full bg-white px-3 py-1 text-xs text-gray-600">{item.status}</span>
                </div>
              </div>
            ))}
          </div>
        </SectionBlock>
        <SectionBlock title="药师审方协同" desc="将药师复核结果作为处方流转的协同反馈，不再单独作为一级入口。">
          <div className="overflow-hidden rounded-xl border border-gray-100">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50 text-gray-600">
                <tr>
                  <th className="px-4 py-3 text-left">任务号</th>
                  <th className="px-4 py-3 text-left">患者姓名</th>
                  <th className="px-4 py-3 text-left">审方事项</th>
                  <th className="px-4 py-3 text-left">状态</th>
                </tr>
              </thead>
              <tbody>
                {pharmacistSeed.slice(0, 8).map((item) => (
                  <tr key={item.id} className="border-t border-gray-100">
                    <td className="px-4 py-3 font-medium text-gray-800">{item.id}</td>
                    <td className="px-4 py-3">{item.patient}</td>
                    <td className="px-4 py-3">{item.task}</td>
                    <td className="px-4 py-3">{item.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SectionBlock>
      </div>
    </div>
  );

  const renderHospitalAlertsPanel = () => (
    <div className="space-y-4">
      {renderAlertTable()}
      <div className="grid gap-4 xl:grid-cols-3">
        <SectionBlock title="医师提醒" desc="医生需处理的规则拦截、目录外收费、门特合规提醒。">
          <div className="space-y-2">
            {physicianSeed.slice(0, 5).map((item) => (
              <div key={item.id} className="rounded-xl bg-gray-50 px-3 py-3 text-sm">
                <p className="font-medium text-gray-800">{item.patient}</p>
                <p className="mt-1 text-gray-500">{item.task}</p>
              </div>
            ))}
          </div>
        </SectionBlock>
        <SectionBlock title="护理提醒" desc="护理执行回传、耗材登记异常、护理记录缺失等提醒。">
          <div className="space-y-2">
            {nurseSeed.slice(0, 5).map((item) => (
              <div key={item.id} className="rounded-xl bg-gray-50 px-3 py-3 text-sm">
                <p className="font-medium text-gray-800">{item.patient}</p>
                <p className="mt-1 text-gray-500">{item.task}</p>
              </div>
            ))}
          </div>
        </SectionBlock>
        <SectionBlock title="药学提醒" desc="合理用药、特药审核、审方退回等提醒。">
          <div className="space-y-2">
            {pharmacistSeed.slice(0, 5).map((item) => (
              <div key={item.id} className="rounded-xl bg-gray-50 px-3 py-3 text-sm">
                <p className="font-medium text-gray-800">{item.patient}</p>
                <p className="mt-1 text-gray-500">{item.task}</p>
              </div>
            ))}
          </div>
        </SectionBlock>
      </div>
    </div>
  );

  const hospitalStats = [
    { title: '结算清单', value: '20', subValue: '含住院、门诊慢特病、普通门诊' },
    { title: '待申报', value: '7', subValue: '待上传或待提交医保清单' },
    { title: '智能预警', value: '20', subValue: '药品、项目、耗材规则均已覆盖' },
    { title: '协同事项', value: '60', subValue: '医师、护理、药学协同任务已下沉到业务页' },
  ];

  const pharmacyStats = [
    { title: '处方接收', value: '20', subValue: '来源医院已覆盖省内主要三甲医院' },
    { title: '待审方', value: '7', subValue: '含双通道特药、门特、外配处方' },
    { title: '医保结算', value: '20', subValue: '含待回盘和已回盘结算记录' },
    { title: '库存追溯', value: '20', subValue: '特药追溯码、批号、效期完整展示' },
  ];

  const renderHospitalContent = () => {
    if (hospitalTab === 'settlement') return renderSettlementTable('结算清单');
    if (hospitalTab === 'claim') return renderHospitalClaimPanel();
    if (hospitalTab === 'reconcile') return renderHospitalReconcilePanel();
    if (hospitalTab === 'prescription') return renderHospitalPrescriptionPanel();
    return renderHospitalAlertsPanel();
  };

  const renderPharmacyContent = () => {
    if (pharmacyTab === 'receive') return renderOrderTable(pharmacyReceiveSeed, '接收编号');
    if (pharmacyTab === 'review') return renderReviewTable();
    if (pharmacyTab === 'dispense') return renderDispenseTable();
    if (pharmacyTab === 'settle') return renderPharmacySettlementTable();
    if (pharmacyTab === 'special') return renderSpecialTable();
    if (pharmacyTab === 'stock') return renderStockTable();
    return renderPharmacyReconcileTable();
  };

  const tabs = mode === 'hospital' ? hospitalTabs : pharmacyTabs;
  const activeTab = mode === 'hospital' ? hospitalTab : pharmacyTab;

  return (
    <div className="space-y-6">
      <div className="rounded-3xl bg-gradient-to-r from-cyan-600 to-teal-600 p-6 text-white shadow-lg">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm text-cyan-100">{mode === 'hospital' ? '定点医院业务入口' : '零售药店 / 双通道药店业务入口'}</p>
            <h2 className="mt-2 text-3xl font-bold">{headerTitle}</h2>
            <p className="mt-3 text-sm text-cyan-50">
              {mode === 'hospital'
                ? '围绕结算清单、费用申报、对账确认、智能提醒和医护药协同处理。'
                : '围绕处方接收、药师审方、调剂发药、医保结算、特药登记和库存追溯。'}
            </p>
          </div>
          <div className="rounded-2xl bg-white/12 px-5 py-4 text-right">
            <p className="text-xs text-cyan-100">当前机构</p>
            <p className="mt-1 text-lg font-semibold">{mode === 'hospital' ? '南京市第一医院' : '南京国大双通道药店'}</p>
            <p className="mt-1 text-xs text-cyan-100">{mode === 'hospital' ? '三级甲等 / 定点医疗机构' : '双通道药店 / 医保定点零售药店'}</p>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        {(mode === 'hospital' ? hospitalStats : pharmacyStats).map((item) => (
          <StatCard key={item.title} title={item.title} value={item.value} subValue={item.subValue} />
        ))}
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-3 shadow-sm">
        <div className="flex flex-wrap gap-3">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = tab.id === activeTab;
            return (
              <button
                key={tab.id}
                onClick={() => (mode === 'hospital' ? setHospitalTab(tab.id as (typeof hospitalTabs)[number]['id']) : setPharmacyTab(tab.id as (typeof pharmacyTabs)[number]['id']))}
                className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition ${
                  isActive ? 'bg-cyan-600 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {mode === 'hospital' ? renderHospitalContent() : renderPharmacyContent()}

      {showModal && currentSettlement && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-6">
          <motion.div initial={{ scale: 0.96, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="w-full max-w-3xl rounded-3xl bg-white p-6 shadow-2xl">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-gray-800">结算清单详情</h3>
                <p className="mt-1 text-sm text-gray-500">{currentSettlement.id} / {currentSettlement.patient}</p>
              </div>
              <button onClick={() => setShowModal(false)} className="rounded-xl p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {[
                ['参保人姓名', currentSettlement.patient],
                ['身份证号', currentSettlement.idCard],
                ['就诊类型', currentSettlement.visitType],
                ['就诊科室', currentSettlement.department],
                ['主要诊断', currentSettlement.diagnosis],
                ['险种类型', currentSettlement.insuranceType],
                ['总费用', `¥${currentSettlement.totalAmount.toLocaleString()}`],
                ['基金支付', `¥${currentSettlement.fundAmount.toLocaleString()}`],
                ['个人自付', `¥${currentSettlement.personalAmount.toLocaleString()}`],
                ['经办人员', currentSettlement.operator],
                ['清单状态', currentSettlement.status],
                ['结算日期', currentSettlement.date],
              ].map(([label, value]) => (
                <div key={label} className="rounded-2xl bg-gray-50 p-4">
                  <p className="text-xs text-gray-500">{label}</p>
                  <p className="mt-2 text-sm font-medium text-gray-800">{value}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
