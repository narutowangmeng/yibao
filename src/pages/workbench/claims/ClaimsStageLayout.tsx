import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Plus, Search } from 'lucide-react';
import { claimsStages, type ClaimsRecord, type ClaimsStageConfig, type CrudField } from './claimsConfig';

interface ProcessField {
  key: string;
  label: string;
  type?: 'text' | 'select' | 'date' | 'textarea';
  options?: string[];
}

interface Props {
  stage: ClaimsStageConfig;
  subtitle: string;
  fields: CrudField[];
  initialRecords: ClaimsRecord[];
  recordLabel: string;
  createLabel: string;
  processLabel: string;
  processTitle: string;
  processFields?: ProcessField[];
  processActions?: string[];
}

type ModalMode = 'create' | 'process' | 'view';

const pageSize = 5;

export default function ClaimsStageLayout({
  stage,
  subtitle,
  fields,
  initialRecords,
  recordLabel,
  createLabel,
  processLabel,
  processTitle,
  processFields = [],
  processActions = ['保存'],
}: Props) {
  const [records, setRecords] = useState<ClaimsRecord[]>(initialRecords);
  const [keyword, setKeyword] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [modalMode, setModalMode] = useState<ModalMode | null>(null);
  const [activeRecord, setActiveRecord] = useState<ClaimsRecord | null>(null);
  const [formData, setFormData] = useState<ClaimsRecord>(initialRecords[0]);
  const [selectedAction, setSelectedAction] = useState(processActions[0] || '保存');

  const filteredRecords = useMemo(() => {
    return records.filter((record) =>
      Object.values(record).some((value) => String(value).toLowerCase().includes(keyword.toLowerCase()))
    );
  }, [keyword, records]);

  const totalPages = Math.max(1, Math.ceil(filteredRecords.length / pageSize));
  const pagedRecords = filteredRecords.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const processSteps = claimsStages.map((item) => item.title);
  const currentStep = processSteps.findIndex((item) => item === stage.title);

  const buildEmptyRecord = () =>
    fields.reduce<ClaimsRecord>((acc, field, index) => {
      acc[field.key] = field.type === 'select' && field.options ? field.options[0] : '';
      if (index === 0) acc[field.key] = `${stage.shortTitle}-${Date.now().toString().slice(-6)}`;
      return acc;
    }, { id: `${stage.shortTitle}-${Date.now().toString().slice(-6)}`, applicant: '', institution: '', amount: '', status: '', risk: '' });

  const openCreate = () => {
    setFormData(buildEmptyRecord());
    setActiveRecord(null);
    setSelectedAction(processActions[0] || '保存');
    setModalMode('create');
  };

  const openProcess = (record: ClaimsRecord) => {
    const enrichedRecord = { ...record };
    processFields.forEach((field) => {
      if (!(field.key in enrichedRecord)) {
        enrichedRecord[field.key] = field.type === 'select' && field.options ? field.options[0] : '';
      }
    });
    setActiveRecord(record);
    setFormData(enrichedRecord);
    setSelectedAction(processActions[0] || '保存');
    setModalMode('process');
  };

  const openView = (record: ClaimsRecord) => {
    setActiveRecord(record);
    setFormData(record);
    setModalMode('view');
  };

  const removeRecord = (id: string) => {
    setRecords((prev) => prev.filter((item) => item.id !== id));
  };

  const saveRecord = () => {
    const payload = modalMode === 'process' ? { ...formData, latestAction: selectedAction } : formData;

    if (modalMode === 'create') {
      setRecords((prev) => [payload, ...prev]);
    }
    if (modalMode === 'process' && activeRecord) {
      setRecords((prev) => prev.map((item) => (item.id === activeRecord.id ? payload : item)));
    }
    setModalMode(null);
  };

  const runProcessAction = (action: string) => {
    const payload = { ...formData, latestAction: action };
    if (activeRecord) {
      setRecords((prev) => prev.map((item) => (item.id === activeRecord.id ? payload : item)));
    }
    setSelectedAction(action);
    setModalMode(null);
  };

  const updateField = (key: string, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const renderField = (field: ProcessField | CrudField, disabled: boolean) => {
    if (field.type === 'select') {
      return (
        <select
          value={formData[field.key] || ''}
          disabled={disabled}
          onChange={(event) => updateField(field.key, event.target.value)}
          className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-cyan-400 disabled:bg-gray-50"
        >
          {field.options?.map((option) => <option key={option} value={option}>{option}</option>)}
        </select>
      );
    }

    if (field.type === 'textarea') {
      return (
        <textarea
          value={formData[field.key] || ''}
          disabled={disabled}
          onChange={(event) => updateField(field.key, event.target.value)}
          rows={4}
          className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-cyan-400 disabled:bg-gray-50"
        />
      );
    }

    return (
      <input
        type={field.type === 'number' ? 'number' : field.type === 'date' ? 'date' : 'text'}
        value={formData[field.key] || ''}
        disabled={disabled || field.key === 'id'}
        onChange={(event) => updateField(field.key, event.target.value)}
        className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-cyan-400 disabled:bg-gray-50"
      />
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="mb-2">
            <Link to="/workbench/claims" className="inline-flex items-center gap-2 text-sm text-cyan-600 hover:text-cyan-700">
              <ArrowLeft className="w-4 h-4" />
              返回理赔管理
            </Link>
          </div>
          <h2 className="text-2xl font-bold text-gray-800">{stage.title}</h2>
          <p className="mt-1 text-sm text-gray-500">{subtitle}</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-8">
        <h3 className="text-xl font-bold text-gray-800 mb-6">办理流程</h3>
        <div className="flex items-center gap-6">
          {processSteps.map((step, index) => (
            <React.Fragment key={step}>
              <div className="flex flex-col items-center min-w-[96px]">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white font-bold text-lg ${
                  index <= currentStep ? 'bg-gradient-to-br from-cyan-500 to-cyan-600 shadow-lg' : 'bg-gray-300'
                }`}>
                  {index + 1}
                </div>
                <span className="text-sm text-gray-600 mt-2 font-medium">{step}</span>
              </div>
              {index < processSteps.length - 1 && (
                <div className="flex-1 h-2 bg-gray-200 rounded-full max-w-[100px]">
                  <div className={`h-full rounded-full bg-gradient-to-r from-cyan-500 to-cyan-600 ${index < currentStep ? 'w-full' : index === currentStep ? 'w-1/2' : 'w-0'}`} />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {stage.metrics.map((metric) => (
          <div key={metric.label} className="bg-white rounded-2xl p-6 shadow-md border border-gray-200">
            <div className="text-sm text-gray-500">{metric.label}</div>
            <div className="mt-3 text-3xl font-bold text-gray-800">{metric.value}</div>
            <div className="mt-2 text-sm text-cyan-600">{metric.trend}</div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-200">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="text-xl font-bold text-gray-800">{recordLabel}列表</h3>
            <p className="mt-1 text-sm text-gray-500">按当前环节进行查看、办理、删除和分页管理</p>
          </div>
          <button
            onClick={openCreate}
            className="inline-flex items-center gap-2 rounded-xl bg-cyan-600 px-4 py-2 text-sm font-medium text-white hover:bg-cyan-700"
          >
            <Plus className="w-4 h-4" />
            {createLabel}
          </button>
        </div>

        <div className="mb-5 flex items-center gap-3">
          <div className="flex flex-1 items-center gap-2 rounded-xl border border-gray-200 px-3 py-2">
            <Search className="w-4 h-4 text-gray-400" />
            <input
              value={keyword}
              onChange={(event) => {
                setKeyword(event.target.value);
                setCurrentPage(1);
              }}
              placeholder={`搜索${recordLabel}编号、人员、机构`}
              className="w-full bg-transparent text-sm outline-none"
            />
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50">
              <tr className="text-left text-gray-500">
                {fields.slice(0, 6).map((field) => (
                  <th key={field.key} className="px-4 py-3 font-medium">{field.label}</th>
                ))}
                <th className="px-4 py-3 font-medium">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {pagedRecords.map((record) => (
                <tr key={record.id} className="hover:bg-gray-50 transition">
                  {fields.slice(0, 6).map((field) => (
                    <td key={field.key} className="px-4 py-3 text-gray-700">
                      {field.key === 'status'
                        ? <span className="rounded-full bg-cyan-50 px-2.5 py-1 text-xs font-medium text-cyan-700">{record[field.key]}</span>
                        : field.key === 'risk'
                          ? <span className="text-rose-600">{record[field.key]}</span>
                          : record[field.key]}
                    </td>
                  ))}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-4 text-sm">
                      <button onClick={() => openView(record)} className="text-slate-500 hover:text-cyan-700">查看</button>
                      <button onClick={() => openProcess(record)} className="text-amber-600 hover:text-amber-700">{processLabel}</button>
                      <button onClick={() => removeRecord(record.id)} className="text-rose-600 hover:text-rose-700">删除</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-5 flex items-center justify-between text-sm text-gray-500">
          <span>共 {filteredRecords.length} 条，当前第 {currentPage}/{totalPages} 页</span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              className="rounded-lg border border-gray-200 px-3 py-1.5 hover:border-cyan-300 hover:text-cyan-700"
            >
              上一页
            </button>
            <button
              onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
              className="rounded-lg border border-gray-200 px-3 py-1.5 hover:border-cyan-300 hover:text-cyan-700"
            >
              下一页
            </button>
          </div>
        </div>
      </div>

      {modalMode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-4xl rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
              <h3 className="text-xl font-bold text-gray-800">
                {modalMode === 'create' ? createLabel : modalMode === 'process' ? processTitle : `${recordLabel}详情`}
              </h3>
              <button onClick={() => setModalMode(null)} className="rounded-lg px-3 py-1.5 text-sm text-gray-500 hover:bg-gray-100">关闭</button>
            </div>

            <div className="grid grid-cols-2 gap-4 px-6 py-6">
              {fields.map((field) => (
                <label key={field.key} className="block">
                  <span className="mb-2 block text-sm font-medium text-gray-700">{field.label}</span>
                  {renderField(field, modalMode === 'view')}
                </label>
              ))}

              {modalMode === 'process' && processFields.map((field) => (
                <label key={field.key} className={field.type === 'textarea' ? 'col-span-2 block' : 'block'}>
                  <span className="mb-2 block text-sm font-medium text-gray-700">{field.label}</span>
                  {renderField(field, false)}
                </label>
              ))}
            </div>

            {modalMode === 'process' && processActions.length > 0 && (
              <div className="border-t border-gray-100 px-6 py-4">
                <div className="mb-3 text-sm font-medium text-gray-700">处置动作</div>
                <div className="flex flex-wrap gap-3">
                  {processActions.map((action) => (
                    <button
                      key={action}
                      onClick={() => runProcessAction(action)}
                      className={`rounded-xl px-4 py-2 text-sm ${
                        selectedAction === action
                          ? 'bg-cyan-600 text-white'
                          : 'border border-gray-200 text-gray-600 hover:border-cyan-300 hover:text-cyan-700'
                      }`}
                    >
                      {action}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {modalMode !== 'view' && modalMode !== 'process' && (
              <div className="flex justify-end gap-3 border-t border-gray-200 px-6 py-4">
                <button onClick={() => setModalMode(null)} className="rounded-xl px-4 py-2 text-sm text-gray-600 hover:bg-gray-100">取消</button>
                <button onClick={saveRecord} className="rounded-xl bg-cyan-600 px-4 py-2 text-sm font-medium text-white hover:bg-cyan-700">
                  {modalMode === 'process' ? `确认${selectedAction}` : '保存'}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
