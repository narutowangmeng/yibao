import React from 'react';
import {
  AlertTriangle,
  ArrowLeft,
  Download,
  FileBarChart,
  Info,
  LineChart as LineChartIcon,
  PieChart as PieChartIcon,
  Table2
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
              onClick={() => window.alert(`已预留“${report.name}”导出接口。`)}
              className="rounded-2xl bg-white px-4 py-3 text-left text-sm font-medium text-sky-700 transition-colors hover:bg-sky-50"
            >
              <Download className="mb-2 h-4 w-4" />
              导出当前报表
            </button>
          </div>
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

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-[320px_1fr]">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-xl font-semibold text-slate-900">同类报表</h3>
          <p className="mt-1 text-sm text-slate-500">点击切换到该分类下的其他单独报表界面。</p>
          <div className="mt-5 space-y-3">
            {group.reports.map((item) => (
              <Link
                key={item.id}
                to={`/reports/${group.id}/${item.id}`}
                className={`block rounded-2xl border p-4 transition-all ${
                  item.id === report.id
                    ? 'border-sky-300 bg-sky-50'
                    : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-medium text-slate-900">{item.name}</p>
                    <p className="mt-1 text-sm text-slate-500">{item.owner}</p>
                  </div>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600">{item.cycle}</span>
                </div>
                <p className="mt-3 text-sm leading-6 text-slate-500">{item.summary}</p>
              </Link>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-6 2xl:grid-cols-2">
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
          </div>

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
        </div>
      </section>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-[1.1fr_0.9fr]">
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
              <p className="text-sm font-medium text-slate-900">可继续扩展</p>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                后续还可以给每张报表继续加筛选器、打印版式、导出字段选择和钻取页。
              </p>
            </div>
          </div>
        </section>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="text-xl font-semibold text-slate-900">其他报表分类</h3>
        <p className="mt-1 text-sm text-slate-500">如果你要切到别的医保条线，直接从这里跳。</p>
        <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          {reportGroups
            .filter((item) => item.id !== group.id)
            .map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.id}
                  to={`/reports/${item.id}/${item.reports[0].id}`}
                  className="rounded-2xl border border-slate-200 bg-slate-50 p-4 transition-all hover:border-slate-300 hover:bg-white"
                >
                  <div className={`inline-flex rounded-2xl p-3 ${item.color}`}>
                    <Icon className="h-5 w-5 text-white" />
                  </div>
                  <p className="mt-4 font-medium text-slate-900">{item.name}</p>
                  <p className="mt-2 text-sm leading-6 text-slate-500">{item.description}</p>
                </Link>
              );
            })}
        </div>
      </section>
    </div>
  );
}
