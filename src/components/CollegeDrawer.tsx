import { X } from 'lucide-react';
import type {
  AdmissionUpdate,
  College,
  CollegeIntentionSummary,
  CollegeVoteSummary,
} from '../types/uhs';
import { assessUpgradationChance } from '../data/uhsColleges';

interface CollegeDrawerProps {
  college: College | null;
  voteSummary?: CollegeVoteSummary;
  intentionSummary?: CollegeIntentionSummary;
  studentAggregate: number | null;
  relatedUpdates: AdmissionUpdate[];
  onClose: () => void;
}

export function CollegeDrawer({
  college,
  voteSummary,
  intentionSummary,
  studentAggregate,
  relatedUpdates,
  onClose,
}: CollegeDrawerProps) {
  if (!college) return null;

  const assessment =
    studentAggregate !== null
      ? assessUpgradationChance(studentAggregate, college, voteSummary)
      : null;

  const statusLabel =
    college.status === 'open_upgradation'
      ? 'Open Upgradation'
      : college.status === 'filling_fast'
      ? 'Filling Fast'
      : 'Finalized';

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/35">
      <div
        className="w-full max-w-xl bg-white h-full border-l border-slate-200 flex flex-col overflow-hidden"
        role="dialog"
        aria-modal="true"
        aria-label={college.name}
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-200 flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-medium text-teal-700 mb-1">
              Rank #{String(college.rank).padStart(2, '0')} · {college.city} · Est. {college.established} · {statusLabel}
            </p>
            <h2 className="text-lg font-semibold text-slate-900 leading-snug">
              {college.name}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close college details"
            className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Merit Trajectory Grid */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3.5">
              <p className="text-xs text-slate-500 mb-1">1st List Closing</p>
              <p className="text-base font-mono tabular-nums font-semibold text-slate-900">
                {college.firstListClosing.toFixed(4)}%
              </p>
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3.5">
              <p className="text-xs text-slate-500 mb-1">Latest (Round {college.currentRound})</p>
              <p className="text-base font-mono tabular-nums font-semibold text-teal-700">
                {college.latestClosing.toFixed(4)}%
              </p>
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3.5">
              <p className="text-xs text-slate-500 mb-1">Prior Year Final</p>
              <p className="text-base font-mono tabular-nums font-semibold text-slate-700">
                {college.priorYearFinalClosing.toFixed(4)}%
              </p>
            </div>
          </div>

          {/* Seat & Quota Details */}
          <div className="border-t border-slate-200 pt-5 space-y-3">
            <div>
              <h3 className="text-sm font-semibold text-slate-900 mb-2">
                Seat Allocation & Upgradation Pattern
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                {college.quotaHighlights}. Total MBBS intake is{' '}
                <span className="font-mono tabular-nums font-medium text-slate-900">
                  {college.totalSeats}
                </span>{' '}
                seats ({college.openMeritSeats} Open Merit).
              </p>
            </div>

            {intentionSummary && intentionSummary.total > 0 && (
              <div className="grid grid-cols-3 gap-2.5 pt-1">
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
                  <p className="text-xs text-slate-500">Leaving Seat</p>
                  <p className="text-sm font-mono tabular-nums font-semibold text-rose-700">
                    {intentionSummary.leaving}
                  </p>
                </div>
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
                  <p className="text-xs text-slate-500">Opted Upgrade</p>
                  <p className="text-sm font-mono tabular-nums font-semibold text-teal-700">
                    {intentionSummary.upgrading}
                  </p>
                </div>
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
                  <p className="text-xs text-slate-500">Freezing Seat</p>
                  <p className="text-sm font-mono tabular-nums font-semibold text-slate-700">
                    {intentionSummary.staying}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Personal Upgradation Assessment */}
          {assessment && (
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <span className="text-xs font-medium text-slate-500">
                  Your Upgradation Projection
                </span>
                <span
                  className={`text-xs font-semibold tabular-nums ${
                    assessment.band === 'Allotted / Secured' ||
                    assessment.band === 'High Likelihood'
                      ? 'text-emerald-700'
                      : assessment.band === 'Borderline / Watchlist'
                      ? 'text-amber-700'
                      : 'text-rose-700'
                  }`}
                >
                  {assessment.band} · {assessment.probabilityPercent}% odds
                </span>
              </div>
              <p className="text-sm text-slate-700 leading-relaxed">
                {assessment.rationale}
              </p>
              <p className="text-xs font-mono tabular-nums text-slate-500 mt-2">
                Projected cycle floor: {assessment.projectedFinalClosing.toFixed(4)}%
              </p>
            </div>
          )}

          {/* College-specific updates */}
          <div className="border-t border-slate-200 pt-5">
            <h3 className="text-sm font-semibold text-slate-900 mb-3">
              UHS Benchmarks & Notices for {college.shortName}
            </h3>
            {relatedUpdates.length === 0 ? (
              <p className="text-xs text-slate-500">
                All live cutoffs and selection round numbers are synced directly from UHS MeritPulse updates.
              </p>
            ) : (
              <div className="space-y-3">
                {relatedUpdates.map((upd) => (
                  <div
                    key={upd.id}
                    className="bg-slate-50 border border-slate-200 rounded-lg p-3.5"
                  >
                    <p className="text-xs text-slate-500 mb-1">
                      Round {upd.roundNumber} · {upd.authorName}
                    </p>
                    <p className="text-sm font-medium text-slate-900 mb-1">{upd.title}</p>
                    <p className="text-xs text-slate-600 leading-relaxed">{upd.body}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
