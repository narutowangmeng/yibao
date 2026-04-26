import React from 'react';
import ClaimsStageLayout from './ClaimsStageLayout';
import { claimsStages, type ClaimsRecord } from './claimsConfig';

const stage = claimsStages.find((item) => item.id === 'intake')!;

const records: ClaimsRecord[] = [
  { id: 'SL202604260021', applicant: '李海峰', institution: '市人民医院', amount: '12460', status: '待材料核验', risk: '资料缺页', claimType: '住院', submitDate: '2026-04-26' },
  { id: 'SL202604260034', applicant: '王敏', institution: '中医院', amount: '3280', status: '待身份校验', risk: '异地备案', claimType: '门诊', submitDate: '2026-04-26' },
  { id: 'SL202604260041', applicant: '张蕾', institution: '妇幼保健院', amount: '8760', status: '待任务分派', risk: '普通', claimType: '生育', submitDate: '2026-04-25' },
  { id: 'SL202604260053', applicant: '周博', institution: '骨科医院', amount: '26540', status: '待补件确认', risk: '发票缺失', claimType: '住院', submitDate: '2026-04-25' },
  { id: 'SL202604260061', applicant: '杨琳', institution: '中心医院', amount: '5400', status: '已受理', risk: '普通', claimType: '门诊', submitDate: '2026-04-24' },
];

export default function ClaimsIntakePage() {
  return (
    <ClaimsStageLayout
      stage={stage}
      subtitle="办理申报登记、材料接收、资料预审和任务分派。"
      fields={[
        { key: 'id', label: '申报编号' },
        { key: 'applicant', label: '参保人' },
        { key: 'institution', label: '就医机构' },
        { key: 'amount', label: '申报金额', type: 'number' },
        { key: 'status', label: '受理状态', type: 'select', options: ['待材料核验', '待身份校验', '待任务分派', '待补件确认', '已受理'] },
        { key: 'risk', label: '风险标签', type: 'select', options: ['普通', '资料缺页', '异地备案', '发票缺失'] },
        { key: 'claimType', label: '理赔类型', type: 'select', options: ['门诊', '住院', '生育', '特病'] },
        { key: 'submitDate', label: '申报日期', type: 'date' },
      ]}
      initialRecords={records}
      recordLabel="受理案件"
      createLabel="新增申报"
      processLabel="受理"
      processTitle="受理案件"
    />
  );
}
