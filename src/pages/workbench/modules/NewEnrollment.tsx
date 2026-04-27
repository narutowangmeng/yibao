import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  UserPlus, ArrowLeft, Save, CheckCircle, AlertCircle,
  Search, Upload, FileText, Calendar, Phone, MapPin,
  Building2, Briefcase, Baby, GraduationCap, ShieldCheck,
  Globe, Plane, Home, Fingerprint, ScanFace, Eye, Camera
} from 'lucide-react';

interface FormData {
  name: string;
  idCard: string;
  motherName: string;
  motherIdCard: string;
  gender: 'male' | 'female';
  birthDate: string;
  phone: string;
  address: string;
  enrollmentType: string;
  workUnit: string;
  emergencyContact: string;
  emergencyPhone: string;
  nationality: string;
  education: string;
  householdType: string;
  bankAccount: string;
  bankName: string;
  fingerprint: boolean;
  faceScan: boolean;
  irisScan: boolean;
}

const featureToEnrollmentType: Record<string, string> = {
  urban_rural: 'urban_rural',
  employee: 'employee',
  flexible: 'flexible',
  newborn: 'newborn',
  student: 'student',
  veteran: 'veteran',
};

export default function NewEnrollment({ onBack, initialFeatureId }: { onBack: () => void; initialFeatureId?: string }) {
  const defaultEnrollmentType = initialFeatureId && featureToEnrollmentType[initialFeatureId] ? featureToEnrollmentType[initialFeatureId] : 'urban_rural';
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    idCard: '',
    motherName: '',
    motherIdCard: '',
    gender: 'male',
    birthDate: '',
    phone: '',
    address: '',
    enrollmentType: defaultEnrollmentType,
    workUnit: '',
    emergencyContact: '',
    emergencyPhone: '',
    nationality: '中国',
    education: '',
    householdType: '城镇',
    bankAccount: '',
    bankName: '',
    fingerprint: false,
    faceScan: false,
    irisScan: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [capturing, setCapturing] = useState<string | null>(null);

  const enrollmentTypes = [
    { id: 'urban_rural', label: '城乡居民', icon: Home },
    { id: 'employee', label: '城镇职工', icon: Building2 },
    { id: 'flexible', label: '灵活就业', icon: Briefcase },
    { id: 'newborn', label: '新生儿', icon: Baby },
    { id: 'student', label: '学生', icon: GraduationCap },
    { id: 'veteran', label: '退役军人', icon: ShieldCheck },
    { id: 'hk_tw', label: '港澳台居民', icon: Globe },
    { id: 'foreigner', label: '外籍人员', icon: Plane },
  ];

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleBiometricCapture = (type: string) => {
    setCapturing(type);
    setTimeout(() => {
      setCapturing(null);
      if (type === 'fingerprint') setFormData(prev => ({ ...prev, fingerprint: true }));
      if (type === 'face') setFormData(prev => ({ ...prev, faceScan: true }));
      if (type === 'iris') setFormData(prev => ({ ...prev, irisScan: true }));
    }, 2000);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      onBack();
    }, 2000);
  };

  const isNewborn = formData.enrollmentType === 'newborn';
  const isStep1Valid = isNewborn
    ? formData.motherName && formData.motherIdCard && formData.phone && formData.birthDate
    : formData.name && formData.idCard && formData.phone && formData.birthDate;
  const isStep2Valid = formData.address && formData.enrollmentType && formData.nationality;
  const isStep3Valid = formData.fingerprint || formData.faceScan;

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="bg-blue-50 rounded-xl p-4 mb-6">
        <h4 className="font-medium text-blue-800 flex items-center gap-2">
          <UserPlus className="w-5 h-5" />
          第一步：填写基础信息
        </h4>
        <p className="text-sm text-blue-600 mt-1">
          {isNewborn ? '新生儿按出生后28天内口径办理，不采集本人姓名和身份证号，请填写母亲身份信息。' : '请填写参保人员的基本身份信息'}
        </p>
      </div>
      <div className="grid grid-cols-2 gap-6">
        {isNewborn ? (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">母亲姓名 <span className="text-red-500">*</span></label>
              <input
                type="text"
                value={formData.motherName}
                onChange={(e) => handleInputChange('motherName', e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="请输入母亲姓名"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">母亲身份证号 <span className="text-red-500">*</span></label>
              <input
                type="text"
                value={formData.motherIdCard}
                onChange={(e) => handleInputChange('motherIdCard', e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="请输入母亲18位身份证号"
                maxLength={18}
              />
            </div>
          </>
        ) : (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">姓名 <span className="text-red-500">*</span></label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="请输入姓名"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">身份证号 <span className="text-red-500">*</span></label>
              <input
                type="text"
                value={formData.idCard}
                onChange={(e) => handleInputChange('idCard', e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="请输入18位身份证号"
                maxLength={18}
              />
            </div>
          </>
        )}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">性别 <span className="text-red-500">*</span></label>
          <div className="flex gap-4">
            <button
              onClick={() => handleInputChange('gender', 'male')}
              className={`flex-1 py-3 rounded-xl border-2 transition-all ${
                formData.gender === 'male'
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              男
            </button>
            <button
              onClick={() => handleInputChange('gender', 'female')}
              className={`flex-1 py-3 rounded-xl border-2 transition-all ${
                formData.gender === 'female'
                  ? 'border-pink-500 bg-pink-50 text-pink-700'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              女
            </button>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">出生日期 <span className="text-red-500">*</span></label>
          <input
            type="date"
            value={formData.birthDate}
            onChange={(e) => handleInputChange('birthDate', e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">联系电话 <span className="text-red-500">*</span></label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => handleInputChange('phone', e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="请输入手机号码"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">国籍/地区 <span className="text-red-500">*</span></label>
          <select
            value={formData.nationality}
            onChange={(e) => handleInputChange('nationality', e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="中国">中国</option>
            <option value="中国香港">中国香港</option>
            <option value="中国澳门">中国澳门</option>
            <option value="中国台湾">中国台湾</option>
            <option value="外国">外国</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">户籍类型</label>
          <select
            value={formData.householdType}
            onChange={(e) => handleInputChange('householdType', e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="城镇">城镇</option>
            <option value="农村">农村</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">学历</label>
          <select
            value={formData.education}
            onChange={(e) => handleInputChange('education', e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">请选择</option>
            <option value="小学">小学</option>
            <option value="初中">初中</option>
            <option value="高中">高中</option>
            <option value="大专">大专</option>
            <option value="本科">本科</option>
            <option value="硕士">硕士</option>
            <option value="博士">博士</option>
          </select>
        </div>
        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">居住地址 <span className="text-red-500">*</span></label>
          <textarea
            value={formData.address}
            onChange={(e) => handleInputChange('address', e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            rows={2}
            placeholder="请输入详细居住地址"
          />
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="bg-blue-50 rounded-xl p-4 mb-6">
        <h4 className="font-medium text-blue-800 flex items-center gap-2">
          <ShieldCheck className="w-5 h-5" />
          第二步：参保信息
        </h4>
        <p className="text-sm text-blue-600 mt-1">选择参保类型并完善参保相关信息</p>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">参保类型 <span className="text-red-500">*</span></label>
        <div className="grid grid-cols-4 gap-3">
          {enrollmentTypes.map((type) => (
            <button
              key={type.id}
              onClick={() => handleInputChange('enrollmentType', type.id)}
              className={`p-4 rounded-xl border-2 transition-all text-left ${
                formData.enrollmentType === type.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <type.icon className={`w-6 h-6 mb-2 ${
                formData.enrollmentType === type.id ? 'text-blue-600' : 'text-gray-400'
              }`} />
              <div className={`text-sm font-medium ${
                formData.enrollmentType === type.id ? 'text-blue-700' : 'text-gray-700'
              }`}>{type.label}</div>
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">工作单位/学校</label>
          <input
            type="text"
            value={formData.workUnit}
            onChange={(e) => handleInputChange('workUnit', e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="请输入工作单位或学校名称（选填）"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">紧急联系人</label>
          <input
            type="text"
            value={formData.emergencyContact}
            onChange={(e) => handleInputChange('emergencyContact', e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="请输入紧急联系人姓名"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">紧急联系电话</label>
          <input
            type="tel"
            value={formData.emergencyPhone}
            onChange={(e) => handleInputChange('emergencyPhone', e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="请输入紧急联系人电话"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">开户银行</label>
          <select
            value={formData.bankName}
            onChange={(e) => handleInputChange('bankName', e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">请选择</option>
            <option value="工商银行">工商银行</option>
            <option value="农业银行">农业银行</option>
            <option value="中国银行">中国银行</option>
            <option value="建设银行">建设银行</option>
            <option value="邮储银行">邮储银行</option>
          </select>
        </div>
        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">银行账号</label>
          <input
            type="text"
            value={formData.bankAccount}
            onChange={(e) => handleInputChange('bankAccount', e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="请输入银行账号（用于医保待遇发放）"
          />
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="bg-blue-50 rounded-xl p-4 mb-6">
        <h4 className="font-medium text-blue-800 flex items-center gap-2">
          <Fingerprint className="w-5 h-5" />
          第三步：生物识别采集
        </h4>
        <p className="text-sm text-blue-600 mt-1">请完成至少一项生物特征采集（指纹或人脸）</p>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className={`p-6 rounded-xl border-2 transition-all ${
          formData.fingerprint ? 'border-green-500 bg-green-50' : 'border-gray-200'
        }`}>
          <div className="text-center">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
              formData.fingerprint ? 'bg-green-100' : 'bg-gray-100'
            }`}>
              <Fingerprint className={`w-8 h-8 ${formData.fingerprint ? 'text-green-600' : 'text-gray-400'}`} />
            </div>
            <h5 className="font-medium mb-2">指纹采集</h5>
            <p className="text-sm text-gray-500 mb-4">采集十指指纹信息</p>
            {formData.fingerprint ? (
              <div className="flex items-center justify-center gap-2 text-green-600">
                <CheckCircle className="w-5 h-5" />
                <span>已采集</span>
              </div>
            ) : (
              <button
                onClick={() => handleBiometricCapture('fingerprint')}
                disabled={capturing === 'fingerprint'}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300"
              >
                {capturing === 'fingerprint' ? '采集...' : '开始采集'}
              </button>
            )}
          </div>
        </div>

        <div className={`p-6 rounded-xl border-2 transition-all ${
          formData.faceScan ? 'border-green-500 bg-green-50' : 'border-gray-200'
        }`}>
          <div className="text-center">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
              formData.faceScan ? 'bg-green-100' : 'bg-gray-100'
            }`}>
              <ScanFace className={`w-8 h-8 ${formData.faceScan ? 'text-green-600' : 'text-gray-400'}`} />
            </div>
            <h5 className="font-medium mb-2">人脸采集</h5>
            <p className="text-sm text-gray-500 mb-4">采集面部特征信息</p>
            {formData.faceScan ? (
              <div className="flex items-center justify-center gap-2 text-green-600">
                <CheckCircle className="w-5 h-5" />
                <span>已采集</span>
              </div>
            ) : (
              <button
                onClick={() => handleBiometricCapture('face')}
                disabled={capturing === 'face'}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300"
              >
                {capturing === 'face' ? '采集...' : '开始采集'}
              </button>
            )}
          </div>
        </div>

        <div className={`p-6 rounded-xl border-2 transition-all ${
          formData.irisScan ? 'border-green-500 bg-green-50' : 'border-gray-200'
        }`}>
          <div className="text-center">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
              formData.irisScan ? 'bg-green-100' : 'bg-gray-100'
            }`}>
              <Eye className={`w-8 h-8 ${formData.irisScan ? 'text-green-600' : 'text-gray-400'}`} />
            </div>
            <h5 className="font-medium mb-2">虹膜采集</h5>
            <p className="text-sm text-gray-500 mb-4">采集虹膜特征信息（可选）</p>
            {formData.irisScan ? (
              <div className="flex items-center justify-center gap-2 text-green-600">
                <CheckCircle className="w-5 h-5" />
                <span>已采集</span>
              </div>
            ) : (
              <button
                onClick={() => handleBiometricCapture('iris')}
                disabled={capturing === 'iris'}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:bg-gray-300"
              >
                {capturing === 'iris' ? '采集...' : '开始采集'}
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5" />
          <div>
            <h4 className="font-medium text-amber-800">采集说明</h4>
            <p className="text-sm text-amber-700 mt-1">
              请确保采集环境光线充足，指纹和人脸采集为必选项，虹膜采集为可选项。采集的数据将加密存储用于身份核验。
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-6">
      <div className="bg-blue-50 rounded-xl p-4 mb-6">
        <h4 className="font-medium text-blue-800 flex items-center gap-2">
          <CheckCircle className="w-5 h-5" />
          第四步：信息确认
        </h4>
        <p className="text-sm text-blue-600 mt-1">请核对以下信息，确认无误后提交</p>
      </div>
      <div className="bg-gray-50 rounded-xl p-6">
        <h3 className="font-semibold text-gray-800 mb-4">基础信息</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          {isNewborn ? (
            <>
              <div className="flex justify-between py-2 border-b border-gray-200">
                <span className="text-gray-500">母亲姓名</span>
                <span className="font-medium text-gray-800">{formData.motherName}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-200">
                <span className="text-gray-500">母亲身份证号</span>
                <span className="font-medium text-gray-800">{formData.motherIdCard}</span>
              </div>
            </>
          ) : (
            <>
              <div className="flex justify-between py-2 border-b border-gray-200">
                <span className="text-gray-500">姓名</span>
                <span className="font-medium text-gray-800">{formData.name}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-200">
                <span className="text-gray-500">身份证号</span>
                <span className="font-medium text-gray-800">{formData.idCard}</span>
              </div>
            </>
          )}
          <div className="flex justify-between py-2 border-b border-gray-200">
            <span className="text-gray-500">性别</span>
            <span className="font-medium text-gray-800">{formData.gender === 'male' ? '男' : '女'}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-gray-200">
            <span className="text-gray-500">出生日期</span>
            <span className="font-medium text-gray-800">{formData.birthDate}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-gray-200">
            <span className="text-gray-500">联系电话</span>
            <span className="font-medium text-gray-800">{formData.phone}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-gray-200">
            <span className="text-gray-500">国籍</span>
            <span className="font-medium text-gray-800">{formData.nationality}</span>
          </div>
          <div className="col-span-2 flex justify-between py-2 border-b border-gray-200">
            <span className="text-gray-500">居住地址</span>
            <span className="font-medium text-gray-800">{formData.address}</span>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 rounded-xl p-6">
        <h3 className="font-semibold text-gray-800 mb-4">参保信息</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex justify-between py-2 border-b border-gray-200">
            <span className="text-gray-500">参保类型</span>
            <span className="font-medium text-gray-800">
              {enrollmentTypes.find(t => t.id === formData.enrollmentType)?.label}
            </span>
          </div>
          <div className="flex justify-between py-2 border-b border-gray-200">
            <span className="text-gray-500">工作单位</span>
            <span className="font-medium text-gray-800">{formData.workUnit || '无'}</span>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 rounded-xl p-6">
        <h3 className="font-semibold text-gray-800 mb-4">生物识别采集状态</h3>
        <div className="flex gap-4">
          <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${formData.fingerprint ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
            <Fingerprint className="w-4 h-4" />
            <span>指纹{formData.fingerprint ? '已采集' : '未采集'}</span>
          </div>
          <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${formData.faceScan ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
            <ScanFace className="w-4 h-4" />
            <span>人脸{formData.faceScan ? '已采集' : '未采集'}</span>
          </div>
          <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${formData.irisScan ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
            <Eye className="w-4 h-4" />
            <span>虹膜{formData.irisScan ? '已采集' : '未采集'}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 text-sm text-gray-600">
        <input type="checkbox" className="w-4 h-4 rounded border-gray-300" defaultChecked />
        <span>我已确认以上信息真实准确，同意医保参保协议</span>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-gray-800">新参保登记</h1>
              <p className="text-sm text-gray-500">首次参加医疗保险登记</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {[1, 2, 3, 4].map((s, i) => (
              <React.Fragment key={s}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step >= s ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-500'
                }`}>{s}</div>
                {i < 3 && <div className={`w-8 h-1 ${step > s ? 'bg-blue-500' : 'bg-gray-200'}`} />}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      <div className="p-6 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8"
        >
          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
          {step === 3 && renderStep3()}
          {step === 4 && renderStep4()}
        </motion.div>

        <div className="flex justify-between mt-8">
          <button
            onClick={step === 1 ? onBack : () => setStep(step - 1)}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
          >
            {step === 1 ? '取消' : '上一步'}
          </button>
          <button
            onClick={() => {
              if (step < 4) {
                setStep(step + 1);
              } else {
                handleSubmit();
              }
            }}
            disabled={step === 1 ? !isStep1Valid : step === 2 ? !isStep2Valid : step === 3 ? !isStep3Valid : false}
            className="px-8 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
          >
            {step === 4 ? (isSubmitting ? '提交中...' : '提交登记') : '下一步'}
            {step !== 4 && <ArrowLeft className="w-4 h-4 rotate-180" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          >
            <div className="bg-white rounded-2xl p-8 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">登记成功</h3>
              <p className="text-gray-600">参保登记已提交，请等待审核</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
