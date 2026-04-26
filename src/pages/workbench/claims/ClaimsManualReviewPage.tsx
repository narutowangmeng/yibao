import React from 'react';
import ClaimsStageLayout from './ClaimsStageLayout';
import { claimsStages, type ClaimsRecord } from './claimsConfig';

const stage = claimsStages.find((item) => item.id === 'manual-review')!;

const records: ClaimsRecord[] = [
  { id: 'RG202604260006', applicant: '赵晨', institution: '中心医院', amount: '18230', status: '待审核', risk: '重复收费疑点', reviewer: '周敏', reviewDate: '2026-04-26' },
  { id: 'RG202604260011', applicant: '陈晓莉', institution: '肿瘤医院', amount: '42680', status: '复核中', risk: '特药限制', reviewer: '李涛', reviewDate: '2026-04-26' },
  { id: 'RG202604260016', applicant: '刘刚', institution: '康复医院', amount: '9860', status: '待病历核对', risk: '住院天数异常', reviewer: '吴桐', reviewDate: '2026-04-25' },
  { id: 'RG202604260022', applicant: '宋梅', institution: '市妇幼', amount: '6540', status: '待结论确认', risk: '普通', reviewer: '郑欣', reviewDate: '2026-04-25' },
  { id: 'RG202604260029', applicant: '王磊', institution: '市人民医院', amount: '21200', status: '已审核', risk: '普通', reviewer: '周敏', reviewDate: '2026-04-24' },
];

export default function ClaimsManualReviewPage() {
  return (
    <ClaimsStageLayout
      stage={stage}
      subtitle="办理人工复核、病历核对、规则命中处理和审核结论确认。"
      fields={[
        { key: 'id', label: '审核编号' },
        { key: 'applicant', label: '参保人' },
        { key: 'institution', label: '就医机构' },
        { key: 'amount', label: '审核金额', type: 'number' },
        { key: 'status', label: '审核状态', type: 'select', options: ['待审核', '复核中', '待病历核对', '待结论确认', '已审核'] },
        { key: 'risk', label: '风险标签', type: 'select', options: ['普通', '重复收费疑点', '特药限制', '住院天数异常'] },
        { key: 'reviewer', label: '审核人' },
        { key: 'reviewDate', label: '审核日期', type: 'date' },
      ]}
      initialRecords={records}
      recordLabel="审核案件"
      createLabel="新增审核任务"
      processLabel="审核"
      processTitle="审核案件"
    />
  );
}
