import { useEffect, useMemo, useState } from 'react';
import { ArrowDown, ArrowUp, ListPlus, Plus, RotateCcw, Trash2 } from 'lucide-react';
import type {
  College,
  CollegeVoteSummary,
  MeritProfile,
  QuotaCategory,
} from '../types/uhs';
import {
  QUOTA_LABELS,
  assessUpgradationChance,
  calculateUhSAggregate,
} from '../data/uhsColleges';
import { EditorialImage } from './EditorialImage';

interface UpgradationTrackerViewProps {
  colleges: College[];
  voteSummaries: Record<string, CollegeVoteSummary>;
  profile: MeritProfile;
  useDirectAggregate: boolean;
  directAggregateValue: string;
  onChangeProfile: (
    next: MeritProfile,
    opts?: { useDirectAggregate?: boolean; directAggregateValue?: string }
  ) => void;
  onResetProfile: () => void;
  onSelectCollege: (college: College) => void;
}

export function UpgradationTrackerView({
  colleges,
  voteSummaries,
  profile,
  useDirectAggregate,
  directAggregateValue,
  onChangeProfile,
  onResetProfile,
  onSelectCollege,
}: UpgradationTrackerViewProps) {
  const [matricMarks, setMatricMarks] = useState(String(profile.matricMarks));
  const [matricTotal, setMatricTotal] = useState(String(profile.matricTotal));
  const [fscMarks, setFscMarks] = useState(String(profile.fscMarks));
  const [fscTotal, setFscTotal] = useState(String(profile.fscTotal));
  const [mdcatMarks, setMdcatMarks] = useState(String(profile.mdcatMarks));
  const [mdcatTotal, setMdcatTotal] = useState(String(profile.mdcatTotal));
  const [directMode, setDirectMode] = useState(useDirectAggregate);
  const [directAggregate, setDirectAggregate] = useState(directAggregateValue);
  const [currentCollegeId, setCurrentCollegeId] = useState(profile.currentCollegeId);
  const [quotaCategory, setQuotaCategory] = useState<QuotaCategory>(profile.quotaCategory);
  const [preferredIds, setPreferredIds] = useState<string[]>(profile.preferredCollegeIds);
  const [collegeToAdd, setCollegeToAdd] = useState<string>('kemu-lahore');

  // Sync when reset from parent
  useEffect(() => {
    setMatricMarks(String(profile.matricMarks));
    setMatricTotal(String(profile.matricTotal));
    setFscMarks(String(profile.fscMarks));
    setFscTotal(String(profile.fscTotal));
    setMdcatMarks(String(profile.mdcatMarks));
    setMdcatTotal(String(profile.mdcatTotal));
    setDirectMode(useDirectAggregate);
    setDirectAggregate(directAggregateValue);
    setCurrentCollegeId(profile.currentCollegeId);
    setQuotaCategory(profile.quotaCategory);
    setPreferredIds(profile.preferredCollegeIds);
  }, [profile, useDirectAggregate, directAggregateValue]);

  const computedAggregate = useMemo(() => {
    if (directMode) {
      const val = Number(directAggregate);
      if (Number.isNaN(val)) return 0;
      return Number(Math.min(100, Math.max(0, val)).toFixed(4));
    }
    return calculateUhSAggregate(
      Number(matricMarks) || 0,
      Number(matricTotal) || 1100,
      Number(fscMarks) || 0,
      Number(fscTotal) || 1100,
      Number(mdcatMarks) || 0,
      Number(mdcatTotal) || 180
    );
  }, [
    directMode,
    directAggregate,
    matricMarks,
    matricTotal,
    fscMarks,
    fscTotal,
    mdcatMarks,
    mdcatTotal,
  ]);

  function emitChange(overrides?: {
    matricMarks?: string;
    matricTotal?: string;
    fscMarks?: string;
    fscTotal?: string;
    mdcatMarks?: string;
    mdcatTotal?: string;
    directMode?: boolean;
    directAggregate?: string;
    currentCollegeId?: string;
    quotaCategory?: QuotaCategory;
    preferredIds?: string[];
  }) {
    const nextDirectMode = overrides?.directMode ?? directMode;
    const nextDirectVal = overrides?.directAggregate ?? directAggregate;
    const mMarks = Math.min(1200, Math.max(0, Number(overrides?.matricMarks ?? matricMarks) || 0));
    const mTotal = Math.min(1200, Math.max(100, Number(overrides?.matricTotal ?? matricTotal) || 1100));
    const fMarks = Math.min(1200, Math.max(0, Number(overrides?.fscMarks ?? fscMarks) || 0));
    const fTotal = Math.min(1200, Math.max(100, Number(overrides?.fscTotal ?? fscTotal) || 1100));
    const mdMarks = Math.min(250, Math.max(0, Number(overrides?.mdcatMarks ?? mdcatMarks) || 0));
    const mdTotal = Math.min(250, Math.max(100, Number(overrides?.mdcatTotal ?? mdcatTotal) || 180));

    const nextAggregate = nextDirectMode
      ? Number(Math.min(100, Math.max(0, Number(nextDirectVal) || 0)).toFixed(4))
      : calculateUhSAggregate(mMarks, mTotal, fMarks, fTotal, mdMarks, mdTotal);

    onChangeProfile(
      {
        userId: 'local',
        matricMarks: mMarks,
        matricTotal: mTotal,
        fscMarks: fMarks,
        fscTotal: fTotal,
        mdcatMarks: mdMarks,
        mdcatTotal: mdTotal,
        calculatedAggregate: nextAggregate,
        currentCollegeId: (overrides?.currentCollegeId ?? currentCollegeId) || 'awaiting-list',
        quotaCategory: overrides?.quotaCategory ?? quotaCategory,
        preferredCollegeIds: (overrides?.preferredIds ?? preferredIds).slice(0, 17),
      },
      {
        useDirectAggregate: nextDirectMode,
        directAggregateValue: nextDirectVal,
      }
    );
  }

  const collegeMap = useMemo(() => {
    const map: Record<string, College> = {};
    for (const c of colleges) map[c.id] = c;
    return map;
  }, [colleges]);

  const availableToAdd = useMemo(
    () => colleges.filter((c) => !preferredIds.includes(c.id)),
    [colleges, preferredIds]
  );

  useEffect(() => {
    if (availableToAdd.length > 0 && !availableToAdd.some((c) => c.id === collegeToAdd)) {
      setCollegeToAdd(availableToAdd[0].id);
    }
  }, [availableToAdd, collegeToAdd]);

  const upgradationAssessments = useMemo(() => {
    const targetIds = preferredIds.length > 0 ? preferredIds : colleges.map((c) => c.id);
    return targetIds
      .map((id) => collegeMap[id])
      .filter((c): c is College => Boolean(c))
      .map((college) =>
        assessUpgradationChance(computedAggregate, college, voteSummaries[college.id])
      );
  }, [preferredIds, colleges, collegeMap, computedAggregate, voteSummaries]);

  function movePreference(index: number, direction: -1 | 1) {
    const next = [...preferredIds];
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= next.length) return;
    [next[index], next[targetIndex]] = [next[targetIndex], next[index]];
    setPreferredIds(next);
    emitChange({ preferredIds: next });
  }

  function removePreference(id: string) {
    const next = preferredIds.filter((item) => item !== id);
    setPreferredIds(next);
    emitChange({ preferredIds: next });
  }

  function addPreference() {
    if (!collegeToAdd || preferredIds.includes(collegeToAdd) || preferredIds.length >= 17) return;
    const next = [...preferredIds, collegeToAdd];
    setPreferredIds(next);
    emitChange({ preferredIds: next });
  }

  function loadAllColleges() {
    const remaining = colleges.map((c) => c.id).filter((id) => !preferredIds.includes(id));
    const next = [...preferredIds, ...remaining].slice(0, 17);
    setPreferredIds(next);
    emitChange({ preferredIds: next });
  }

  const mdcatContrib = (() => {
    const m = Number(mdcatMarks) || 0;
    const t = Number(mdcatTotal) || 180;
    return t > 0 ? Math.min(Math.max(m / t, 0), 1) * 50 : 0;
  })();
  const fscContrib = (() => {
    const m = Number(fscMarks) || 0;
    const t = Number(fscTotal) || 1100;
    return t > 0 ? Math.min(Math.max(m / t, 0), 1) * 40 : 0;
  })();
  const matricContrib = (() => {
    const m = Number(matricMarks) || 0;
    const t = Number(matricTotal) || 1100;
    return t > 0 ? Math.min(Math.max(m / t, 0), 1) * 10 : 0;
  })();

  return (
    <div className="space-y-6">
      {/* Free & Open Student Intro Banner */}
      <section className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1 max-w-2xl">
          <p className="text-xs font-medium text-teal-700">
            Free Student Tool · No Sign-In Required · UHS Punjab Public MBBS Cutoffs
          </p>
          <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-slate-900">
            Check Your Exact UHS Aggregate & Upgradation Chances
          </h1>
          <p className="text-sm text-slate-600 leading-relaxed">
            Enter your MDCAT, FSc, and Matric marks—or paste your exact aggregate—arrange your 17-college UHS preference ladder, and instantly see where you stand across Punjab Public Sector Medical Colleges.
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={onResetProfile}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors whitespace-nowrap shrink-0"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset Marks
          </button>
        </div>
      </section>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        {/* Left: Aggregate Calculator & Preference Builder */}
        <div className="xl:col-span-6 bg-white border border-slate-200 rounded-xl p-5 sm:p-6 space-y-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                UHS Aggregate & Preference Profile
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Formula: 50% MDCAT + 40% FSc (Pre-Medical) + 10% Matric
              </p>
            </div>
            <div className="text-right shrink-0">
              <p className="text-xs text-slate-500">Calculated</p>
              <p className="text-xl font-mono tabular-nums font-semibold text-teal-700">
                {computedAggregate.toFixed(4)}%
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
            <button
              type="button"
              onClick={() => {
                setDirectMode(false);
                emitChange({ directMode: false });
              }}
              className={`flex-1 py-1.5 px-3 text-xs font-medium rounded-md transition-colors ${
                !directMode
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Calculate From Marks
            </button>
            <button
              type="button"
              onClick={() => {
                const nextVal = computedAggregate.toFixed(4);
                setDirectMode(true);
                setDirectAggregate(nextVal);
                emitChange({ directMode: true, directAggregate: nextVal });
              }}
              className={`flex-1 py-1.5 px-3 text-xs font-medium rounded-md transition-colors ${
                directMode
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Enter Exact Aggregate
            </button>
          </div>

          {directMode ? (
            <div>
              <label
                htmlFor="direct-aggregate"
                className="block text-xs font-medium text-slate-700 mb-1"
              >
                Official UHS Aggregate (%)
              </label>
              <input
                id="direct-aggregate"
                type="number"
                step="0.0001"
                min="0"
                max="100"
                value={directAggregate}
                onChange={(e) => {
                  const val = e.target.value;
                  setDirectAggregate(val);
                  emitChange({ directAggregate: val });
                }}
                className="w-full px-3 py-2 text-sm font-mono tabular-nums bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-teal-700"
              />
            </div>
          ) : (
            <div className="space-y-2.5">
              <div className="flex items-center justify-between gap-2 text-xs">
                <span className="text-slate-500">
                  Enter marks directly in the UHS weightage table
                </span>
                <div className="flex items-center gap-1 p-0.5 bg-slate-100 rounded-md shrink-0">
                  {[180, 200].map((scale) => (
                    <button
                      key={scale}
                      type="button"
                      onClick={() => {
                        const nextScale = String(scale);
                        setMdcatTotal(nextScale);
                        emitChange({ mdcatTotal: nextScale });
                      }}
                      className={`px-2 py-1 text-xs font-mono tabular-nums rounded transition-colors whitespace-nowrap ${
                        Number(mdcatTotal) === scale
                          ? 'bg-white text-slate-900 shadow-xs font-medium'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      MDCAT /{scale}
                    </button>
                  ))}
                </div>
              </div>

              <div className="border border-slate-200 rounded-lg overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-xs font-medium text-slate-500">
                      <th className="py-2.5 px-3">Component</th>
                      <th className="py-2.5 px-2 text-right">Wt.</th>
                      <th className="py-2.5 px-2 text-right">Obtained</th>
                      <th className="py-2.5 px-2 text-right">Total</th>
                      <th className="py-2.5 px-3 text-right">Weighted</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 text-xs">
                    <tr className="bg-white">
                      <td className="py-2.5 px-3">
                        <div className="font-medium text-slate-900 whitespace-nowrap">MDCAT</div>
                        <div className="text-[11px] text-slate-500 whitespace-nowrap">PMDC Test</div>
                      </td>
                      <td className="py-2.5 px-2 text-right font-mono tabular-nums text-slate-600">
                        50%
                      </td>
                      <td className="py-2 px-2">
                        <input
                          aria-label="MDCAT Obtained Marks"
                          type="number"
                          min="0"
                          max="250"
                          value={mdcatMarks}
                          onChange={(e) => {
                            const val = e.target.value;
                            setMdcatMarks(val);
                            emitChange({ mdcatMarks: val });
                          }}
                          className="w-20 ml-auto block px-2.5 py-1.5 text-right text-sm font-mono tabular-nums bg-slate-50 border border-slate-200 rounded-md text-slate-900 focus:outline-none focus:border-teal-700"
                        />
                      </td>
                      <td className="py-2 px-2">
                        <input
                          aria-label="MDCAT Total Marks"
                          type="number"
                          min="100"
                          max="250"
                          value={mdcatTotal}
                          onChange={(e) => {
                            const val = e.target.value;
                            setMdcatTotal(val);
                            emitChange({ mdcatTotal: val });
                          }}
                          className="w-20 ml-auto block px-2.5 py-1.5 text-right text-sm font-mono tabular-nums bg-slate-50 border border-slate-200 rounded-md text-slate-700 focus:outline-none focus:border-teal-700"
                        />
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono tabular-nums font-semibold text-teal-700 whitespace-nowrap">
                        {mdcatContrib.toFixed(4)}%
                      </td>
                    </tr>

                    <tr className="bg-white">
                      <td className="py-2.5 px-3">
                        <div className="font-medium text-slate-900 whitespace-nowrap">FSc / HSSC</div>
                        <div className="text-[11px] text-slate-500 whitespace-nowrap">Pre-Medical</div>
                      </td>
                      <td className="py-2.5 px-2 text-right font-mono tabular-nums text-slate-600">
                        40%
                      </td>
                      <td className="py-2 px-2">
                        <input
                          aria-label="FSc Obtained Marks"
                          type="number"
                          min="0"
                          max="1200"
                          value={fscMarks}
                          onChange={(e) => {
                            const val = e.target.value;
                            setFscMarks(val);
                            emitChange({ fscMarks: val });
                          }}
                          className="w-20 ml-auto block px-2.5 py-1.5 text-right text-sm font-mono tabular-nums bg-slate-50 border border-slate-200 rounded-md text-slate-900 focus:outline-none focus:border-teal-700"
                        />
                      </td>
                      <td className="py-2 px-2">
                        <input
                          aria-label="FSc Total Marks"
                          type="number"
                          min="100"
                          max="1200"
                          value={fscTotal}
                          onChange={(e) => {
                            const val = e.target.value;
                            setFscTotal(val);
                            emitChange({ fscTotal: val });
                          }}
                          className="w-20 ml-auto block px-2.5 py-1.5 text-right text-sm font-mono tabular-nums bg-slate-50 border border-slate-200 rounded-md text-slate-700 focus:outline-none focus:border-teal-700"
                        />
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono tabular-nums font-semibold text-teal-700 whitespace-nowrap">
                        {fscContrib.toFixed(4)}%
                      </td>
                    </tr>

                    <tr className="bg-white">
                      <td className="py-2.5 px-3">
                        <div className="font-medium text-slate-900 whitespace-nowrap">Matric / SSC</div>
                        <div className="text-[11px] text-slate-500 whitespace-nowrap">Science Group</div>
                      </td>
                      <td className="py-2.5 px-2 text-right font-mono tabular-nums text-slate-600">
                        10%
                      </td>
                      <td className="py-2 px-2">
                        <input
                          aria-label="Matric Obtained Marks"
                          type="number"
                          min="0"
                          max="1200"
                          value={matricMarks}
                          onChange={(e) => {
                            const val = e.target.value;
                            setMatricMarks(val);
                            emitChange({ matricMarks: val });
                          }}
                          className="w-20 ml-auto block px-2.5 py-1.5 text-right text-sm font-mono tabular-nums bg-slate-50 border border-slate-200 rounded-md text-slate-900 focus:outline-none focus:border-teal-700"
                        />
                      </td>
                      <td className="py-2 px-2">
                        <input
                          aria-label="Matric Total Marks"
                          type="number"
                          min="100"
                          max="1200"
                          value={matricTotal}
                          onChange={(e) => {
                            const val = e.target.value;
                            setMatricTotal(val);
                            emitChange({ matricTotal: val });
                          }}
                          className="w-20 ml-auto block px-2.5 py-1.5 text-right text-sm font-mono tabular-nums bg-slate-50 border border-slate-200 rounded-md text-slate-700 focus:outline-none focus:border-teal-700"
                        />
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono tabular-nums font-semibold text-teal-700 whitespace-nowrap">
                        {matricContrib.toFixed(4)}%
                      </td>
                    </tr>
                  </tbody>
                  <tfoot>
                    <tr className="bg-slate-50 border-t border-slate-200 text-xs font-semibold">
                      <td className="py-2.5 px-3 text-slate-900">Total Aggregate</td>
                      <td className="py-2.5 px-2 text-right font-mono tabular-nums text-slate-700">
                        100%
                      </td>
                      <td colSpan={2} className="py-2.5 px-2 text-right text-slate-500 font-normal">
                        UHS Formula Sum
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono tabular-nums text-teal-800 whitespace-nowrap">
                        {computedAggregate.toFixed(4)}%
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-200">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Current Allotted College
              </label>
              <select
                value={currentCollegeId}
                onChange={(e) => {
                  const val = e.target.value;
                  setCurrentCollegeId(val);
                  emitChange({ currentCollegeId: val });
                }}
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-teal-700"
              >
                <option value="awaiting-list">Awaiting 1st / Next Allotment</option>
                {colleges.map((c) => (
                  <option key={c.id} value={c.id}>
                    #{c.rank} {c.shortName} ({c.city})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Seat Category
              </label>
              <select
                value={quotaCategory}
                onChange={(e) => {
                  const val = e.target.value as QuotaCategory;
                  setQuotaCategory(val);
                  emitChange({ quotaCategory: val });
                }}
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-teal-700"
              >
                {(Object.keys(QUOTA_LABELS) as QuotaCategory[]).map((key) => (
                  <option key={key} value={key}>
                    {QUOTA_LABELS[key]}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Preference Order Builder */}
          <div className="pt-2 border-t border-slate-200 space-y-3">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-semibold text-slate-800">
                Your Upgradation Preference Order ({preferredIds.length}/17)
              </span>
              {availableToAdd.length > 0 && (
                <button
                  type="button"
                  onClick={loadAllColleges}
                  className="inline-flex items-center gap-1 text-xs font-medium text-teal-700 hover:text-teal-800 whitespace-nowrap"
                >
                  <ListPlus className="w-3.5 h-3.5" />
                  Add All Remaining
                </button>
              )}
            </div>

            {availableToAdd.length > 0 && (
              <div className="flex gap-2">
                <select
                  aria-label="Select college to add to preferences"
                  value={collegeToAdd}
                  onChange={(e) => setCollegeToAdd(e.target.value)}
                  className="flex-1 min-w-0 px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-teal-700"
                >
                  {availableToAdd.map((c) => (
                    <option key={c.id} value={c.id}>
                      #{c.rank} {c.shortName} · {c.latestClosing.toFixed(4)}%
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={addPreference}
                  className="inline-flex items-center gap-1 px-3 py-2 text-xs font-medium text-teal-800 bg-teal-50 hover:bg-teal-100 rounded-lg transition-colors whitespace-nowrap shrink-0"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add
                </button>
              </div>
            )}

            <div className="divide-y divide-slate-200 border border-slate-200 rounded-lg overflow-hidden">
              {preferredIds.length === 0 ? (
                <p className="p-3 text-xs text-slate-500">
                  Showing all 17 colleges in the breakdown on the right, or add colleges above to customize your preference order.
                </p>
              ) : (
                preferredIds.map((id, idx) => {
                  const college = collegeMap[id];
                  if (!college) return null;
                  return (
                    <div
                      key={id}
                      className="flex items-center justify-between gap-2 px-3 py-2 bg-white text-xs"
                    >
                      <div className="min-w-0 flex items-center">
                        <span className="font-mono tabular-nums text-slate-400 mr-2 shrink-0">
                          {String(idx + 1).padStart(2, '0')}.
                        </span>
                        <span className="font-medium text-slate-900 truncate">
                          {college.shortName} — {college.city}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          type="button"
                          onClick={() => movePreference(idx, -1)}
                          disabled={idx === 0}
                          aria-label="Move preference up"
                          className="p-1 text-slate-500 hover:text-slate-900 disabled:opacity-30"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => movePreference(idx, 1)}
                          disabled={idx === preferredIds.length - 1}
                          aria-label="Move preference down"
                          className="p-1 text-slate-500 hover:text-slate-900 disabled:opacity-30"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => removePreference(id)}
                          aria-label="Remove preference"
                          className="p-1 text-slate-400 hover:text-rose-700"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          <p className="text-xs text-slate-500 pt-1">
            Your marks and preference list save automatically in this browser—no account or sign-in needed.
          </p>
        </div>

        {/* Right: Personalized Upgradation Odds & Milestone Preview */}
        <div className="xl:col-span-6 space-y-6">
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
            <div className="p-5 sm:p-6 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">
                  Upgradation Probability Breakdown
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Evaluated at{' '}
                  <span className="font-mono tabular-nums font-semibold text-slate-900">
                    {computedAggregate.toFixed(4)}%
                  </span>{' '}
                  against live UHS Round {colleges[0]?.currentRound ?? 3} cutoffs & List 1→Final movement. Tap any college for details.
                </p>
              </div>
            </div>

            <div className="divide-y divide-slate-200">
              {upgradationAssessments.map((item, idx) => {
                const isAllotted = item.college.id === currentCollegeId;
                const toneColor =
                  item.band === 'Allotted / Secured' || item.band === 'High Likelihood'
                    ? 'text-emerald-700'
                    : item.band === 'Borderline / Watchlist'
                    ? 'text-amber-700'
                    : 'text-rose-700';

                const barColor =
                  item.band === 'Allotted / Secured' || item.band === 'High Likelihood'
                    ? 'bg-emerald-600'
                    : item.band === 'Borderline / Watchlist'
                    ? 'bg-amber-500'
                    : 'bg-rose-600';

                return (
                  <div
                    key={item.college.id}
                    onClick={() => onSelectCollege(item.college)}
                    className="p-5 hover:bg-slate-50/80 transition-colors cursor-pointer"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3 mb-2">
                      <div>
                        <p className="text-xs text-slate-500">
                          {preferredIds.length > 0
                            ? `Preference ${String(idx + 1).padStart(2, '0')}`
                            : `Rank #${String(item.college.rank).padStart(2, '0')}`}{' '}
                          · {item.college.city} · Round {item.college.currentRound}
                          {isAllotted ? ' · Current Seat' : ''}
                        </p>
                        <h3 className="text-sm font-semibold text-slate-900">
                          {item.college.name}
                        </h3>
                      </div>
                      <div className="text-right">
                        <p className={`text-xs font-semibold ${toneColor}`}>
                          {item.band}
                        </p>
                        <p className="text-sm font-mono tabular-nums font-semibold text-slate-900">
                          {item.probabilityPercent}% odds
                        </p>
                      </div>
                    </div>

                    <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden mb-2.5">
                      <div
                        className={`h-full ${barColor} transition-all duration-200`}
                        style={{ width: `${item.probabilityPercent}%` }}
                      />
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-600">
                      <span>{item.rationale}</span>
                      <span className="font-mono tabular-nums text-slate-500 shrink-0">
                        Latest: {item.college.latestClosing.toFixed(4)}% · Est. Final:{' '}
                        {item.projectedFinalClosing.toFixed(4)}%
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden grid grid-cols-1 md:grid-cols-12 items-stretch">
            <div className="md:col-span-5 min-h-[160px]">
              <EditorialImage
                src="/src/assets/images/white_coat_milestone_1795506260703.jpg"
                alt="White medical coat and stethoscope on library desk"
                className="w-full h-full object-cover"
                fallbackLabel="MBBS White Coat Milestone"
              />
            </div>
            <div className="md:col-span-7 p-5 flex flex-col justify-center">
              <p className="text-xs font-medium text-teal-700 mb-1">
                UHS Upgradation Retention Rule
              </p>
              <h3 className="text-base font-semibold text-slate-900 mb-1.5">
                Keep Your Upgradation Eligibility Active
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Always deposit the fee challan and complete joining at your current provisionally allotted college before the round deadline. Unjoined allotments forfeit both the current seat and subsequent automatic upgradation rounds.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
