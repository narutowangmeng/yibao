import React from 'react';
import {
  AlertTriangle,
  ArrowLeft,
  BarChart3,
  Download,
  FileBarChart,
  Info,
  LineChart as LineChartIcon,
  PieChart as PieChartIcon,
  Table2,
  TrendingUp
} from 'lucide-react';
import { Link, Navigate, useParams } from 'react-router-dom';
import {
  buildReportDetail,
  getReportGroup,
  getReportItem,
  reportGroups,
  type ChartMode,
  type ReportDetail,
  type ReportGroupId
} from './reportData';
import { downloadTextFile, exportJsonToWorkbook } from '../../utils/exportHelpers';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';

function renderChart(detail: ReportDetail, key: 'primary' | 'secondary') {
  const chartMode = key === 'primary' ? detail.primaryChartMode : detail.secondaryChartMode;
  const chartData = key === 'primary' ? detail.primaryChartData : detail.secondaryChartData;
  const chartKeys = key === 'primary' ? detail.primaryChartKeys : detail.secondaryChartKeys;

  if (chartMode === 'pie') {
    return (
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie data={chartData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={68} outerRadius={110}>
            {chartData.map((entry, index) => (
              <Cell
                key={`${String(entry.name)}-${index}`}
                fill={detail.pieColors?.[index % (detail.pieColors?.length || 1)] || '#0284C7'}
              />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    );
  }

  if (chartMode === 'bar') {
    return (
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
          <XAxis dataKey="period" stroke="#64748B" />
          <YAxis stroke="#64748B" />
          <Tooltip />
          <Legend />
          {chartKeys.map((dataKey, index) => (
            <Bar
              key={dataKey}
              dataKey={dataKey}
              fill={['#0284C7', '#16A34A', '#E11D48', '#7C3AED', '#F59E0B'][index % 5]}
              radius={[8, 8, 0, 0]}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
        <XAxis dataKey="period" stroke="#64748B" />
        <YAxis stroke="#64748B" />
        <Tooltip />
        <Legend />
        {chartKeys.map((dataKey, index) => (
          <Line
            key={dataKey}
            type="monotone"
            dataKey={dataKey}
            stroke={['#0284C7', '#16A34A', '#E11D48', '#7C3AED', '#F59E0B'][index % 5]}
            strokeWidth={3}
            dot={{ r: 4 }}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
}

function modeIcon(mode: ChartMode) {
  if (mode === 'pie') return PieChartIcon;
  return LineChartIcon;
}

function parseMetricNumber(value: string) {
  const normalized = value.replace(/,/g, '');
  const matched = normalized.match(/-?\d+(\.\d+)?/);
  if (!matched) return 0;
  let base = Number(matched[0]);
  if (normalized.includes('亿')) base *= 10000;
  if (normalized.includes('万')) base *= 1;
  if (normalized.includes('%')) return base;
  return base;
}

function buildExtraCharts(detail: ReportDetail) {
  const tableColumns = detail.tableColumns;
  const rows = detail.tableRows;
  const firstKey = tableColumns[0]?.key;
  const valueKey = tableColumns[1]?.key;
  const compareKey = tableColumns[2]?.key;
  const statusKey = tableColumns[3]?.key;

  const rankingData = rows.slice(0, 6).map((row, index) => ({
    name: String(row[firstKey] || `对象${index + 1}`),
    value: parseMetricNumber(String(row[valueKey] || '0')),
  }));

  const compareData = rows.slice(0, 6).map((row, index) => ({
    name: String(row[firstKey] || `对象${index + 1}`),
    valueA: parseMetricNumber(String(row[valueKey] || '0')),
    valueB: parseMetricNumber(String(row[compareKey] || '0')),
  }));

  const trendData = detail.primaryChartData.map((item, index) => {
    const label = String(item.period || item.name || `阶段${index + 1}`);
    const keys = detail.primaryChartKeys;
    return {
      period: label,
      核心值: Number(item[keys[0]] || 0),
      对比值: Number(item[keys[1]] || 0),
    };
  });

  const structureData = rows.slice(0, 5).map((row, index) => ({
    name: String(row[firstKey] || `分类${index + 1}`),
    value: Math.max(parseMetricNumber(String(row[valueKey] || '0')), 1),
  }));

  const statusData = rows.slice(0, 5).map((row, index) => ({
    name: String(row[firstKey] || `对象${index + 1}`),
    value: parseMetricNumber(String(row[statusKey] || row[compareKey] || '0')),
  }));

  return { rankingData, compareData, trendData, structureData, statusData };
}

function renderSimpleBarChart(data: Array<Record<string, string | number>>, firstKey: string, secondKey: string) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
        <XAxis dataKey={firstKey} stroke="#64748B" tick={{ fontSize: 12 }} />
        <YAxis stroke="#64748B" tick={{ fontSize: 12 }} />
        <Tooltip />
        <Bar dataKey={secondKey} fill="#0ea5e9" radius={[8, 8, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

function renderCompareBarChart(data: Array<Record<string, string | number>>) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
        <XAxis dataKey="name" stroke="#64748B" tick={{ fontSize: 12 }} />
        <YAxis stroke="#64748B" tick={{ fontSize: 12 }} />
        <Tooltip />
        <Legend />
        <Bar dataKey="valueA" name="主指标" fill="#0284C7" radius={[8, 8, 0, 0]} />
        <Bar dataKey="valueB" name="对比指标" fill="#16A34A" radius={[8, 8, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

function renderSimpleLineChart(data: Array<Record<string, string | number>>) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
        <XAxis dataKey="period" stroke="#64748B" tick={{ fontSize: 12 }} />
        <YAxis stroke="#64748B" tick={{ fontSize: 12 }} />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="核心值" stroke="#0284C7" strokeWidth={3} dot={{ r: 4 }} />
        <Line type="monotone" dataKey="对比值" stroke="#7C3AED" strokeWidth={3} dot={{ r: 4 }} />
      </LineChart>
    </ResponsiveContainer>
  );
}

function renderSimplePieChart(data: Array<Record<string, string | number>>) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <PieChart>
        <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={54} outerRadius={92}>
          {data.map((entry, index) => (
            <Cell key={`${String(entry.name)}-${index}`} fill={['#0284C7', '#16A34A', '#E11D48', '#7C3AED', '#F59E0B'][index % 5]} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  );
}

export default function ReportDetailPage() {
  const params = useParams();
  const groupId = params.groupId as ReportGroupId | undefined;
  const reportId = params.reportId;

  if (!groupId || !reportId) {
    return <Navigate to="/reports" replace />;
  }

  const group = getReportGroup(groupId);
  const report = getReportItem(groupId, reportId);

  if (!group || !report) {
    return <Navigate to="/reports" replace />;
  }

  const detail = buildReportDetail(groupId, reportId);
  const PrimaryIcon = modeIcon(detail.primaryChartMode);
  const SecondaryIcon = modeIcon(detail.secondaryChartMode);
  const { rankingData, compareData, trendData, structureData, statusData } = buildExtraCharts(detail);
  const handleExportCurrentReport = () => {
    exportJsonToWorkbook(
      detail.tableRows.map((row) =>
        detail.tableColumns.reduce<Record<string, string>>((accumulator, column) => {
          accumulator[column.label] = String(row[column.key] ?? '');
          return accumulator;
        }, {}),
      ),
      '报表明细',
      `${report.name}_明细数据.xlsx`,
    );

    downloadTextFile(
      `${report.name}_分析摘要.txt`,
      [
        detail.heroTitle,
        `统计期间：${detail.period}`,
        `统计口径：${detail.scope}`,
        '',
        '核心指标：',
        ...detail.metrics.map((metric) => `- ${metric.label}：${metric.value}（${metric.sub}）`),
        '',
        '分析结论：',
        ...detail.insights.map((insight, index) => `${index + 1}. ${insight}`),
      ].join('\n'),
    );
  };

  return (
    <div className="space-y-6">
      <section className="rounded-[32px] bg-[radial-gradient(circle_at_top_right,_rgba(255,255,255,0.16),_transparent_30%),linear-gradient(145deg,_#0f172a,_#0f766e_48%,_#1d4ed8)] px-8 py-8 text-white shadow-xl">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-4xl">
            <Link to="/reports" className="inline-flex items-center gap-2 text-sm text-white/70 transition-colors hover:text-white">
              <ArrowLeft className="h-4 w-4" />
              返回报表中心
            </Link>
            <p className="mt-4 text-sm uppercase tracking-[0.18em] text-white/65">{group.name}</p>
            <h2 className="mt-3 text-4xl font-bold">{detail.heroTitle}</h2>
            <p className="mt-4 text-sm leading-7 text-white/82">{detail.heroSummary}</p>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            <div className="rounded-2xl bg-white/10 px-4 py-3">
              <p className="text-xs text-white/65">统计期间</p>
              <p className="mt-2 text-sm font-medium">{detail.period}</p>
            </div>
            <div className="rounded-2xl bg-white/10 px-4 py-3">
              <p className="text-xs text-white/65">统计口径</p>
              <p className="mt-2 text-sm font-medium">{detail.scope}</p>
            </div>
            <button
              onClick={handleExportCurrentReport}
              className="rounded-2xl bg-white px-4 py-3 text-left text-sm font-medium text-sky-700 transition-colors hover:bg-sky-50"
            >
              <Download className="mb-2 h-4 w-4" />
              导出当前报表
            </button>
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-slate-900">报表分类</h3>
          <p className="mt-1 text-sm text-slate-500">直接在上方切换分类，不再放到底部卡片区跳转。</p>
        </div>
        <div className="flex flex-wrap gap-3">
          {reportGroups.map((item) => {
            const Icon = item.icon;
            const isActive = item.id === group.id;
            return (
              <Link
                key={item.id}
                to={`/reports/${item.id}/${item.reports[0].id}`}
                className={`inline-flex items-center gap-2 rounded-2xl px-4 py-2 text-sm font-medium transition-all ${
                  isActive
                    ? `${item.color} text-white shadow-sm`
                    : 'border border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <Icon className="h-4 w-4" />
                {item.name}
              </Link>
            );
          })}
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {detail.metrics.map((metric) => (
          <div key={metric.label} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">{metric.label}</p>
            <p className="mt-3 text-3xl font-semibold text-slate-900">{metric.value}</p>
            <p className="mt-2 text-sm text-slate-500">{metric.sub}</p>
          </div>
        ))}
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">当前分类报表</h3>
            <p className="mt-1 text-sm text-slate-500">在当前分类下快速切换具体报表。</p>
          </div>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600">{group.reports.length} 个报表</span>
        </div>
        <div className="flex flex-wrap gap-3">
          {group.reports.map((item) => (
            <Link
              key={item.id}
              to={`/reports/${group.id}/${item.id}`}
              className={`rounded-2xl border px-4 py-3 text-sm transition-all ${
                item.id === report.id
                  ? 'border-sky-300 bg-sky-50 text-sky-700'
                  : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              <div className="font-medium">{item.name}</div>
              <div className="mt-1 text-xs opacity-80">{item.cycle} / {item.owner}</div>
            </Link>
          ))}
        </div>
      </section>

      <section className="grid grid-cols-1 gap-6 2xl:grid-cols-2">
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center gap-2">
            <PrimaryIcon className="h-5 w-5 text-sky-600" />
            <h3 className="text-lg font-semibold text-slate-900">{detail.primaryChartTitle}</h3>
          </div>
          {renderChart(detail, 'primary')}
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center gap-2">
            <SecondaryIcon className="h-5 w-5 text-violet-600" />
            <h3 className="text-lg font-semibold text-slate-900">{detail.secondaryChartTitle}</h3>
          </div>
          {renderChart(detail, 'secondary')}
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-cyan-600" />
            <h3 className="text-lg font-semibold text-slate-900">对象排名对比</h3>
          </div>
          {renderSimpleBarChart(rankingData, 'name', 'value')}
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-emerald-600" />
            <h3 className="text-lg font-semibold text-slate-900">主指标与对比指标</h3>
          </div>
          {renderCompareBarChart(compareData)}
        </section>
      </section>

      <section className="grid grid-cols-1 gap-6 2xl:grid-cols-3">
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center gap-2">
            <LineChartIcon className="h-5 w-5 text-sky-600" />
            <h3 className="text-lg font-semibold text-slate-900">核心趋势跟踪</h3>
          </div>
          {renderSimpleLineChart(trendData)}
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center gap-2">
            <PieChartIcon className="h-5 w-5 text-violet-600" />
            <h3 className="text-lg font-semibold text-slate-900">结构分布演示</h3>
          </div>
          {renderSimplePieChart(structureData)}
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-rose-600" />
            <h3 className="text-lg font-semibold text-slate-900">重点对象表现</h3>
          </div>
          {renderSimpleBarChart(statusData, 'name', 'value')}
        </section>
      </section>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_320px]">
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center gap-2">
            <Table2 className="h-5 w-5 text-slate-700" />
            <h3 className="text-lg font-semibold text-slate-900">{detail.tableTitle}</h3>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-left">
              <thead className="border-b border-slate-200 text-sm text-slate-500">
                <tr>
                  {detail.tableColumns.map((column) => (
                    <th key={column.key} className="px-3 py-3 font-medium">{column.label}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {detail.tableRows.map((row, rowIndex) => (
                  <tr key={`${report.id}-${rowIndex}`} className="border-b border-slate-100 text-sm text-slate-700">
                    {detail.tableColumns.map((column) => (
                      <td key={column.key} className="px-3 py-4">{row[column.key]}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center gap-2">
            <Info className="h-5 w-5 text-sky-600" />
            <h3 className="text-lg font-semibold text-slate-900">阅读提示</h3>
          </div>
          <div className="space-y-4">
            <div className={`rounded-2xl p-4 ${group.light}`}>
              <p className="text-sm font-medium text-slate-900">当前分类</p>
              <p className="mt-2 text-sm leading-6 text-slate-600">{group.description}</p>
            </div>
            <div className="rounded-2xl bg-amber-50 p-4">
              <div className="flex items-center gap-2 text-amber-800">
                <AlertTriangle className="h-4 w-4" />
                <p className="text-sm font-medium">关注点</p>
              </div>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                这类报表建议优先看趋势变化、结构占比、异常波动和重点对象名单，再看明细。
              </p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-sm font-medium text-slate-900">可持续扩展</p>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                当前页已补充趋势、结构、排名和对比图，后续还可以继续加筛选器、打印版式和钻取页。
              </p>
            </div>
          </div>
        </section>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center gap-2">
          <FileBarChart className="h-5 w-5 text-emerald-600" />
          <h3 className="text-lg font-semibold text-slate-900">分析结论</h3>
        </div>
        <div className="grid grid-cols-1 gap-3">
          {detail.insights.map((insight) => (
            <div key={insight} className="rounded-2xl bg-slate-50 p-4 text-sm leading-6 text-slate-600">
              {insight}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
