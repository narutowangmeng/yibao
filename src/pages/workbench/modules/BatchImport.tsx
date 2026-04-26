import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  Upload, ArrowLeft, FileText, CheckCircle, AlertCircle,
  Download, X, Users, Check, AlertTriangle
} from 'lucide-react';

interface ImportRecord {
  row: number;
  name: string;
  idCard: string;
  phone: string;
  status: 'success' | 'error' | 'pending';
  message: string;
}

export default function BatchImport({ onBack }: { onBack: () => void }) {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [importProgress, setImportProgress] = useState(0);
  const [importResults, setImportResults] = useState<ImportRecord[] | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && (droppedFile.name.endsWith('.xlsx') || droppedFile.name.endsWith('.xls') || droppedFile.name.endsWith('.csv'))) {
      setFile(droppedFile);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setIsUploading(true);
    setImportProgress(0);

    // 模拟上传进度
    for (let i = 0; i <= 100; i += 10) {
      await new Promise(resolve => setTimeout(resolve, 200));
      setImportProgress(i);
    }

    // 模拟导入结果
    setImportResults([
      { row: 1, name: '参保人A', idCard: '110101199001011234', phone: '13800138001', status: 'success', message: '导入成功' },
      { row: 2, name: '参保人B', idCard: '110101198505056789', phone: '13900139002', status: 'success', message: '导入成功' },
      { row: 3, name: '参保人C', idCard: '110101199212123456', phone: '13700137003', status: 'error', message: '身份证号格式错误' },
      { row: 4, name: '参保人D', idCard: '110101198808084321', phone: '13600136004', status: 'success', message: '导入成功' },
      { row: 5, name: '钱七', idCard: '110101199505055678', phone: '13500135005', status: 'error', message: '手机号格式错误' },
    ]);

    setIsUploading(false);
    setShowSuccess(true);
  };

  const successCount = importResults?.filter(r => r.status === 'success').length || 0;
  const errorCount = importResults?.filter(r => r.status === 'error').length || 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 头部 */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-gray-800">批量参保导入</h1>
            <p className="text-sm text-gray-500">通过Excel文件批量导入参保人员</p>
          </div>
        </div>
      </div>

      <div className="p-6 max-w-6xl mx-auto">
        {!importResults ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* 模板下载 */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-100 rounded-xl">
                    <FileText className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-blue-800">导入模板</h3>
                    <p className="text-sm text-blue-600">请下载模板文件，按格式填写后上传</p>
                  </div>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  <Download className="w-4 h-4" />
                  下载模板
                </button>
              </div>
            </div>

            {/* 文件上传区 */}
            <div
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
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
                  <button
                    onClick={() => setFile(null)}
                    className="text-sm text-red-600 hover:text-red-700"
                  >
                    重新选择
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                    <Upload className="w-8 h-8 text-gray-400" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-700">点击或拖拽文件到此处上传</p>
                    <p className="text-sm text-gray-500 mt-1">支持 .xlsx, .xls, .csv 格式</p>
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

            {/* 导入说明 */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-800 mb-4">导入说明</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-blue-600 font-medium">1</span>
                  </div>
                  <p className="text-gray-600">下载导入模板，按照模板格式填写参保人员信息</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-blue-600 font-medium">2</span>
                  </div>
                  <p className="text-gray-600">确保身份证号、手机号格式正确，姓名不能为空</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-blue-600 font-medium">3</span>
                  </div>
                  <p className="text-gray-600">单次导入不超过1000条记录，文件大小不超过10MB</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-blue-600 font-medium">4</span>
                  </div>
                  <p className="text-gray-600">导入完成后可查看导入结果，失败记录可单独处理</p>
                </div>
              </div>
            </div>

            {/* 操作按钮 */}
            <div className="flex justify-end gap-4">
              <button
                onClick={onBack}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
              >
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
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* 导入结果统计 */}
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

            {/* 导入结果列表 */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="font-semibold text-gray-800">导入结果详情</h3>
              </div>
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">行号</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">姓名</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">身份证号</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">联系电话</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">状态</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">说明</th>
                  </tr>
                </thead>
                <tbody>
                  {importResults.map((record) => (
                    <tr key={record.row} className="border-t border-gray-100">
                      <td className="px-6 py-4 text-sm text-gray-600">{record.row}</td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-800">{record.name}</td>
                      <td className="px-6 py-4 text-sm text-gray-600 font-mono">{record.idCard}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{record.phone}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                          record.status === 'success'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-red-100 text-red-700'
                        }`}>
                          {record.status === 'success' ? (
                            <Check className="w-3 h-3" />
                          ) : (
                            <X className="w-3 h-3" />
                          )}
                          {record.status === 'success' ? '成功' : '失败'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{record.message}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* 操作按钮 */}
            <div className="flex justify-end gap-4">
              <button
                onClick={() => {
                  setImportResults(null);
                  setFile(null);
                }}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
              >
                继续导入
              </button>
              <button
                onClick={onBack}
                className="px-8 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
              >
                完成
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
