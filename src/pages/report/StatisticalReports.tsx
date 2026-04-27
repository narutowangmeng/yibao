import React, { useMemo, useState } from 'react';
import { ArrowRight, Download, Filter, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import { publishedReports, reportGroups, topSummaryCards } from './reportData';

export default function StatisticalReports() {
  const [keyword, setKeyword] = useState('');
  const [cycle, setCycle] = useState('全部周期');
  const [activeGroupId, setActiveGroupId] = useState(reportGroups[0]?.id ?? 'overview');

  const activeGroup = useMemo(
    () => reportGroups.find((group) => group.id === activeGroupId) || reportGroups[0],
    [activeGroupId],
  );

  const filteredPublishedReports = useMemo(() => {
    return publishedReports.filter((item) => {
      const search = keyword.trim();
      const matchKeyword = !search || item.name.includes(search) || item.department.includes(search);
      const matchCycle = cycle === '全部周期' || item.cycle === cycle;
      const matchGroup = item.groupId === activeGroupId;
      return matchKeyword && matchCycle && matchGroup;
    });
  }, [activeGroupId, cycle, keyword]);

  return (
    <div className="space-y-6">
      <section className="rounded-[32px] bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.18),_transparent_32%),linear-gradient(135deg,_#0f766e,_#155e75_46%,_#1d4ed8)] px-8 py-8 text-white shadow-xl">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-4xl">
            <p className="text-sm uppercase tracking-[0.22em] text-white/70">Medical Insurance Report Center</p>
            <h2 className="mt-3 text-4xl font-bold">医保报表中心</h2>
            <p className="mt-4 text-sm leading-7 text-white/85">
              报表中心改成上方分类标签的操作方式，先切换报表分类，再进入具体报表页面，减少用户在页面下方反复查找入口。
            </p>
          </div>
          <button
            onClick={() => window.alert('已预留报表汇编导出接口。')}
            className="rounded-2xl bg-white px-5 py-3 text-sm font-medium text-sky-700 transition-colors hover:bg-sky-50"
          >
            导出报表汇编
          </button>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {topSummaryCards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm text-slate-500">{card.label}</p>
                  <p className="mt-3 text-3xl font-semibold text-slate-900">{card.value}</p>
                  <p className="mt-2 text-sm text-slate-500">{card.sub}</p>
                </div>
                <div className={`rounded-2xl p-3 ${card.tone}`}>
                  <Icon className="h-6 w-6" />
                </div>
              </div>
            </div>
          );
        })}
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-5">
          <h3 className="text-xl font-semibold text-slate-900">报表分类</h3>
          <p className="mt-1 text-sm text-slate-500">使用上方 tab 直接切换分类，当前分类下的报表入口和列表会同步刷新。</p>
        </div>

        <div className="mb-6 flex flex-wrap gap-3 border-b border-slate-200 pb-4">
          {reportGroups.map((group) => {
            const Icon = group.icon;
            const isActive = group.id === activeGroupId;
            return (
              <button
                key={group.id}
                onClick={() => setActiveGroupId(group.id)}
                className={`inline-flex items-center gap-2 rounded-2xl px-4 py-2 text-sm font-medium transition-all ${
                  isActive
                    ? `${group.color} text-white shadow-sm`
                    : 'border border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <Icon className="h-4 w-4" />
                {group.name}
              </button>
            );
          })}
        </div>

        {activeGroup && (
          <div className="rounded-3xl bg-slate-50 p-5">
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-sky-700">当前分类</p>
                <h4 className="mt-2 text-2xl font-semibold text-slate-900">{activeGroup.name}</h4>
                <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">{activeGroup.description}</p>
              </div>
              <div className={`rounded-2xl p-3 ${activeGroup.color}`}>
                <activeGroup.icon className="h-6 w-6 text-white" />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
              {activeGroup.reports.map((report) => (
                <Link
                  key={report.id}
                  to={`/reports/${activeGroup.id}/${report.id}`}
                  className="group rounded-3xl border border-slate-200 bg-white p-5 transition-all hover:-translate-y-1 hover:border-slate-300 hover:shadow-lg"
                >
                  <div className="flex items-start justify-between gap-3">
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">{report.cycle}</span>
                    <ArrowRight className="h-5 w-5 text-slate-400 transition-transform group-hover:translate-x-1 group-hover:text-sky-600" />
                  </div>
                  <h5 className="mt-4 text-lg font-semibold text-slate-900">{report.name}</h5>
                  <p className="mt-2 text-sm leading-6 text-slate-500">{report.summary}</p>
                  <p className="mt-4 text-xs text-slate-400">{report.owner}</p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </section>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-[0.78fr_1.22fr]">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center gap-2">
            <Filter className="h-5 w-5 text-sky-600" />
            <h3 className="text-lg font-semibold text-slate-900">报表检索</h3>
          </div>

          <div className="grid grid-cols-1 gap-3">
            <div className="rounded-2xl border border-slate-200 px-4 py-3">
              <label className="mb-2 block text-sm text-slate-500">报表名称/处室</label>
              <div className="flex items-center gap-2">
                <Search className="h-4 w-4 text-slate-400" />
                <input
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  placeholder="输入关键字"
                  className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
                />
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 px-4 py-3">
              <label className="mb-2 block text-sm text-slate-500">报表周期</label>
              <select value={cycle} onChange={(e) => setCycle(e.target.value)} className="w-full bg-transparent text-sm outline-none">
                <option>全部周期</option>
                <option>日报</option>
                <option>周报</option>
                <option>月报</option>
                <option>季报</option>
                <option>专题</option>
                <option>年报</option>
              </select>
            </div>
          </div>

          <div className="mt-5 rounded-3xl bg-sky-50 p-5">
            <p className="text-sm font-medium text-sky-800">操作说明</p>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              现在用户不需要先滚到下面找分类入口，先点上方 tab 即可，再从右侧列表直接进入对应报表。
            </p>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-xl font-semibold text-slate-900">{activeGroup?.name || '当前分类'}已生成报表</h3>
              <p className="mt-1 text-sm text-slate-500">当前只展示所选分类下的已生成报表，点名称即可进入单独报表界面。</p>
            </div>
            <button
              onClick={() => window.alert('批量导出接口已预留。')}
              className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 px-4 py-2 text-sm text-slate-700 transition-colors hover:bg-slate-50"
            >
              <Download className="h-4 w-4" />
              批量导出
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-left">
              <thead className="border-b border-slate-200 text-sm text-slate-500">
                <tr>
                  <th className="px-3 py-3 font-medium">报表名称</th>
                  <th className="px-3 py-3 font-medium">周期</th>
                  <th className="px-3 py-3 font-medium">归属处室</th>
                  <th className="px-3 py-3 font-medium">状态</th>
                </tr>
              </thead>
              <tbody>
                {filteredPublishedReports.map((item) => (
                  <tr key={item.id} className="border-b border-slate-100 text-sm text-slate-700 transition-colors hover:bg-slate-50">
                    <td className="px-3 py-4">
                      <Link to={`/reports/${item.groupId}/${item.reportId}`} className="block">
                        <p className="font-medium text-slate-900 hover:text-sky-700">{item.name}</p>
                        <p className="mt-1 text-xs text-slate-400">{item.updatedAt}</p>
                      </Link>
                    </td>
                    <td className="px-3 py-4">{item.cycle}</td>
                    <td className="px-3 py-4">{item.department}</td>
                    <td className="px-3 py-4">
                      <span className={`rounded-full px-3 py-1 text-xs font-medium ${
                        item.status === '已发布'
                          ? 'bg-emerald-100 text-emerald-700'
                          : item.status === '待审核'
                            ? 'bg-amber-100 text-amber-700'
                            : 'bg-slate-100 text-slate-700'
                      }`}>
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))}
                {filteredPublishedReports.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-3 py-10 text-center text-sm text-slate-400">
                      当前分类下没有匹配的报表
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
}
