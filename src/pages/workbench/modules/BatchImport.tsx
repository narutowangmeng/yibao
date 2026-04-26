import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Upload,
  ArrowLeft,
  FileText,
  CheckCircle,
  AlertCircle,
  Download,
  X,
  Users,
  Check
} from 'lucide-react';
import * as XLSX from 'xlsx';

interface ImportRecord {
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

interface EnrollmentImportRow {
  姓名: string;
  身份证号: string;
  手机号: string;
  参保类型: string;
  险种: string;
  所属地: string;
}

const TEMPLATE_HEADERS = ['姓名', '身份证号', '手机号', '参保类型', '险种', '所属地'];
const VALID_AGENCIES = ['南京', '无锡', '徐州', '常州', '苏州', '南通', '连云港', '淮安', '盐城', '扬州', '镇江', '泰州', '宿迁'];
const VALID_CATEGORIES = ['城乡居民', '城镇职工', '灵活就业', '新生儿', '退役军人', '学生'];
const VALID_INSURANCE_TYPES = ['城乡居民基本医疗保险', '职工基本医疗保险', '大病保险', '长期护理保险'];

const SAMPLE_ROWS: EnrollmentImportRow[] = [
  { 姓名: '陈思远', 身份证号: '320102198903152415', 手机号: '13851760011', 参保类型: '城镇职工', 险种: '职工基本医疗保险', 所属地: '南京' },
  { 姓名: '周语彤', 身份证号: '320205199407263526', 手机号: '13915230027', 参保类型: '城乡居民', 险种: '城乡居民基本医疗保险', 所属地: '无锡' },
  { 姓名: '顾嘉言', 身份证号: '320302199101084633', 手机号: '13775880039', 参保类型: '灵活就业', 险种: '职工基本医疗保险', 所属地: '徐州' },
  { 姓名: '沈知夏', 身份证号: '320412201910215628', 手机号: '13685210018', 参保类型: '新生儿', 险种: '城乡居民基本医疗保险', 所属地: '常州' },
  { 姓名: '陆书意', 身份证号: '320507200812163214', 手机号: '13584820042', 参保类型: '学生', 险种: '城乡居民基本医疗保险', 所属地: '苏州' },
  { 姓名: '许文博', 身份证号: '320602198805204517', 手机号: '13862750016', 参保类型: '退役军人', 险种: '职工基本医疗保险', 所属地: '南通' },
  { 姓名: '顾清越', 身份证号: '320706199612308424', 手机号: '13961380033', 参保类型: '城乡居民', 险种: '大病保险', 所属地: '连云港' },
  { 姓名: '程安宁', 身份证号: '320803199211184826', 手机号: '13770450056', 参保类型: '灵活就业', 险种: '长期护理保险', 所属地: '淮安' },
  { 姓名: '唐若琳', 身份证号: '320902198706113229', 手机号: '13605150087', 参保类型: '城镇职工', 险种: '职工基本医疗保险', 所属地: '盐城' },
  { 姓名: '韩景澄', 身份证号: '321002199504096831', 手机号: '13511730048', 参保类型: '城乡居民', 险种: '城乡居民基本医疗保险', 所属地: '扬州' },
  { 姓名: '俞安然', 身份证号: '321102198809273617', 手机号: '13815460025', 参保类型: '城镇职工', 险种: '职工基本医疗保险', 所属地: '镇江' },
  { 姓名: '赵明峻', 身份证号: '321202199303017015', 手机号: '13952610052', 参保类型: '退役军人', 险种: '职工基本医疗保险', 所属地: '泰州' }
];

function downloadWorkbook(rows: Array<Record<string, string>>, fileName: string) {
  const worksheet = XLSX.utils.json_to_sheet(rows, {
    header: TEMPLATE_HEADERS
  });
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, '参保批量导入');
  XLSX.writeFile(workbook, fileName);
}

function validateRow(row: Partial<EnrollmentImportRow>, index: number): ImportRecord {
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
  if (!VALID_CATEGORIES.includes(category)) messages.push('参保类型不在支持范围');
  if (!VALID_INSURANCE_TYPES.includes(insuranceType)) messages.push('险种不在支持范围');
  if (!VALID_AGENCIES.includes(agency)) messages.push('所属地不在江苏13市范围');

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
}

export default function BatchImport({ onBack }: { onBack: () => void }) {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [importProgress, setImportProgress] = useState(0);
  const [importResults, setImportResults] = useState<ImportRecord[] | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const successCount = importResults?.filter((record) => record.status === 'success').length || 0;
  const errorCount = importResults?.filter((record) => record.status === 'error').length || 0;

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setImportResults(null);
    }
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    const droppedFile = event.dataTransfer.files[0];
    if (droppedFile && /\.(xlsx|xls|csv)$/i.test(droppedFile.name)) {
      setFile(droppedFile);
      setImportResults(null);
    }
  };

  const handleDownloadTemplate = () => {
    downloadWorkbook(
      [
        {
          姓名: '',
          身份证号: '',
          手机号: '',
          参保类型: '',
          险种: '',
          所属地: ''
        }
      ],
      '参保批量导入模板.xlsx'
    );
  };

  const handleDownloadSample = () => {
    downloadWorkbook(SAMPLE_ROWS, '参保批量导入示例数据.xlsx');
  };

  const handleExportResults = (onlyErrors = false) => {
    if (!importResults) return;

    const rows = (onlyErrors ? importResults.filter((item) => item.status === 'error') : importResults).map((item) => ({
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

  const handleUpload = async () => {
    if (!file) return;

    setIsUploading(true);
    setImportProgress(15);

    try {
      const buffer = await file.arrayBuffer();
      setImportProgress(45);

      const workbook = XLSX.read(buffer, { type: 'array' });
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];
      const rows = XLSX.utils.sheet_to_json<Partial<EnrollmentImportRow>>(worksheet, {
        defval: '',
        raw: false
      });

      setImportProgress(75);

      const results = rows.map((row, index) => validateRow(row, index));
      setImportResults(results);
      setImportProgress(100);
    } catch (error) {
      setImportResults([
        {
          row: 0,
          name: '',
          idCard: '',
          phone: '',
          category: '',
          insuranceType: '',
          agency: '',
          status: 'error',
          message: '文件解析失败，请检查 Excel 格式是否正确'
        }
      ]);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-gray-800">批量参保导入</h1>
            <p className="text-sm text-gray-500">通过 Excel 文件批量导入参保人员信息，并导出校验结果</p>
          </div>
        </div>
      </div>

      <div className="p-6 max-w-6xl mx-auto">
        {!importResults ? (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-100 rounded-xl">
                    <FileText className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-blue-800">导入资料准备</h3>
                    <p className="text-sm text-blue-600">先下载模板或示例数据，再按字段口径整理参保人员信息</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <button onClick={handleDownloadTemplate} className="flex items-center gap-2 px-4 py-2 border border-blue-300 text-blue-700 rounded-lg hover:bg-white transition-colors">
                    <Download className="w-4 h-4" />
                    下载模板
                  </button>
                  <button onClick={handleDownloadSample} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    <Download className="w-4 h-4" />
                    下载示例数据
                  </button>
                </div>
              </div>
            </div>

            <div
              onDrop={handleDrop}
              onDragOver={(event) => event.preventDefault()}
              className={`bg-white rounded-xl border-2 border-dashed transition-all p-12 text-center ${
                file ? 'border-green-400 bg-green-50' : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              {file ? (
                <div className="space-y-4">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                    <FileText className="w-8 h-8 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">{file.name}</p>
                    <p className="text-sm text-gray-500">{(file.size / 1024).toFixed(2)} KB</p>
                  </div>
                  <button onClick={() => setFile(null)} className="text-sm text-red-600 hover:text-red-700">
                    重新选择
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                    <Upload className="w-8 h-8 text-gray-400" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-700">点击或拖拽 Excel 文件到此处上传</p>
                    <p className="text-sm text-gray-500 mt-1">支持 .xlsx、.xls、.csv 格式</p>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".xlsx,.xls,.csv"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    选择文件
                  </button>
                </div>
              )}
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-800 mb-4">字段口径说明</h3>
              <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                <div>1. 必填字段：姓名、身份证号、手机号、参保类型、险种、所属地</div>
                <div>2. 所属地统一按江苏省 13 个设区市填写</div>
                <div>3. 参保类型支持：城乡居民、城镇职工、灵活就业、新生儿、退役军人、学生</div>
                <div>4. 险种支持：城乡居民基本医疗保险、职工基本医疗保险、大病保险、长期护理保险</div>
              </div>
            </div>

            <div className="flex justify-end gap-4">
              <button onClick={onBack} className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors">
                取消
              </button>
              <button
                onClick={handleUpload}
                disabled={!file || isUploading}
                className="px-8 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
              >
                {isUploading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    导入中 {importProgress}%
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4" />
                    开始导入
                  </>
                )}
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="grid grid-cols-3 gap-6">
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-100 rounded-xl">
                    <Users className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-800">{importResults.length}</div>
                    <div className="text-sm text-gray-500">总记录数</div>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-green-100 rounded-xl">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-green-600">{successCount}</div>
                    <div className="text-sm text-gray-500">导入成功</div>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-red-100 rounded-xl">
                    <AlertCircle className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-red-600">{errorCount}</div>
                    <div className="text-sm text-gray-500">导入失败</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                <h3 className="font-semibold text-gray-800">导入结果详情</h3>
                <div className="flex items-center gap-3">
                  <button onClick={() => handleExportResults(false)} className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                    <Download className="w-4 h-4" />
                    导出结果
                  </button>
                  <button onClick={() => handleExportResults(true)} className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                    <Download className="w-4 h-4" />
                    导出失败记录
                  </button>
                </div>
              </div>
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">行号</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">姓名</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">身份证号</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">手机号</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">参保类型</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">险种</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">所属地</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">状态</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">说明</th>
                  </tr>
                </thead>
                <tbody>
                  {importResults.map((record) => (
                    <tr key={`${record.row}-${record.idCard}`} className="border-t border-gray-100">
                      <td className="px-6 py-4 text-sm text-gray-600">{record.row}</td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-800">{record.name || '-'}</td>
                      <td className="px-6 py-4 text-sm text-gray-600 font-mono">{record.idCard || '-'}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{record.phone || '-'}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{record.category || '-'}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{record.insuranceType || '-'}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{record.agency || '-'}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                          record.status === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}>
                          {record.status === 'success' ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                          {record.status === 'success' ? '成功' : '失败'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{record.message}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-end gap-4">
              <button
                onClick={() => {
                  setImportResults(null);
                  setFile(null);
                  setImportProgress(0);
                }}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
              >
                继续导入
              </button>
              <button onClick={onBack} className="px-8 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors">
                完成
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
