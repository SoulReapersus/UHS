import { useState } from 'react';
import {
  BASELINE_ADMISSION_UPDATES,
  UHS_PUBLIC_MBBS_COLLEGES,
  calculateUhSAggregate,
} from './data/uhsColleges';
import type { College, MeritProfile } from './types/uhs';
import { CollegeDrawer } from './components/CollegeDrawer';
import { UpgradationTrackerView } from './components/UpgradationTrackerView';

const STORAGE_KEY = 'uhs_meritpulse_student_profile_v1';

const DEFAULT_MERIT_PROFILE: MeritProfile = {
  userId: 'local',
  matricMarks: 1045,
  matricTotal: 1100,
  fscMarks: 1025,
  fscTotal: 1100,
  mdcatMarks: 168,
  mdcatTotal: 180,
  calculatedAggregate: calculateUhSAggregate(1045, 1100, 1025, 1100, 168, 180),
  currentCollegeId: 'awaiting-list',
  quotaCategory: 'open_merit',
  preferredCollegeIds: [
    'kemu-lahore',
    'aimc-lahore',
    'sims-lahore',
    'nmu-multan',
    'rmu-rawalpindi',
    'fjmu-lahore',
    'amc-lahore',
    'fmu-faisalabad',
    'qamc-bahawalpur',
    'gmc-gujranwala',
    'smc-sargodha',
    'nsmc-gujrat',
    'szmc-ryk',
    'slmc-sahiwal',
    'kmsmc-sialkot',
    'dgkmc-dgkhan',
    'nmc-narowal',
  ],
};

interface StoredStudentState {
  profile: MeritProfile;
  useDirectAggregate: boolean;
  directAggregateValue: string;
}

function loadStoredStudentState(): StoredStudentState {
  if (typeof window === 'undefined') {
    return {
      profile: DEFAULT_MERIT_PROFILE,
      useDirectAggregate: false,
      directAggregateValue: DEFAULT_MERIT_PROFILE.calculatedAggregate.toFixed(4),
    };
  }
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return {
        profile: DEFAULT_MERIT_PROFILE,
        useDirectAggregate: false,
        directAggregateValue: DEFAULT_MERIT_PROFILE.calculatedAggregate.toFixed(4),
      };
    }
    const parsed = JSON.parse(raw) as Partial<StoredStudentState>;
    const p = parsed.profile;
    if (!p || typeof p.calculatedAggregate !== 'number') {
      throw new Error('Invalid stored profile');
    }
    const profile: MeritProfile = {
      userId: 'local',
      matricMarks: Number(p.matricMarks) || DEFAULT_MERIT_PROFILE.matricMarks,
      matricTotal: Number(p.matricTotal) || DEFAULT_MERIT_PROFILE.matricTotal,
      fscMarks: Number(p.fscMarks) || DEFAULT_MERIT_PROFILE.fscMarks,
      fscTotal: Number(p.fscTotal) || DEFAULT_MERIT_PROFILE.fscTotal,
      mdcatMarks: Number(p.mdcatMarks) || DEFAULT_MERIT_PROFILE.mdcatMarks,
      mdcatTotal: Number(p.mdcatTotal) || DEFAULT_MERIT_PROFILE.mdcatTotal,
      calculatedAggregate: Number(p.calculatedAggregate),
      currentCollegeId: typeof p.currentCollegeId === 'string' ? p.currentCollegeId : 'awaiting-list',
      quotaCategory: p.quotaCategory || 'open_merit',
      preferredCollegeIds: Array.isArray(p.preferredCollegeIds)
        ? p.preferredCollegeIds.map(String).slice(0, 17)
        : DEFAULT_MERIT_PROFILE.preferredCollegeIds,
    };
    return {
      profile,
      useDirectAggregate: Boolean(parsed.useDirectAggregate),
      directAggregateValue:
        typeof parsed.directAggregateValue === 'string'
          ? parsed.directAggregateValue
          : profile.calculatedAggregate.toFixed(4),
    };
  } catch {
    return {
      profile: DEFAULT_MERIT_PROFILE,
      useDirectAggregate: false,
      directAggregateValue: DEFAULT_MERIT_PROFILE.calculatedAggregate.toFixed(4),
    };
  }
}

export default function App() {
  const [selectedCollege, setSelectedCollege] = useState<College | null>(null);
  const [studentState, setStudentState] = useState<StoredStudentState>(() =>
    loadStoredStudentState()
  );

  function handleChangeProfile(
    nextProfile: MeritProfile,
    opts?: { useDirectAggregate?: boolean; directAggregateValue?: string }
  ) {
    setStudentState((prev) => {
      const updated: StoredStudentState = {
        profile: nextProfile,
        useDirectAggregate: opts?.useDirectAggregate ?? prev.useDirectAggregate,
        directAggregateValue:
          opts?.directAggregateValue ??
          (opts?.useDirectAggregate === false
            ? nextProfile.calculatedAggregate.toFixed(4)
            : prev.directAggregateValue),
      };
      if (typeof window !== 'undefined') {
        try {
          window.localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        } catch {
          // Ignore storage quota issues
        }
      }
      return updated;
    });
  }

  function handleResetProfile() {
    const fresh: StoredStudentState = {
      profile: DEFAULT_MERIT_PROFILE,
      useDirectAggregate: false,
      directAggregateValue: DEFAULT_MERIT_PROFILE.calculatedAggregate.toFixed(4),
    };
    setStudentState(fresh);
    if (typeof window !== 'undefined') {
      try {
        window.localStorage.removeItem(STORAGE_KEY);
      } catch {
        // Ignore storage issues
      }
    }
  }

  return (
    <div className="min-h-screen bg-[#FAFBFD] text-slate-900 flex flex-col">
      {/* Clean Single-Page Header */}
      <header className="h-16 bg-white border-b border-slate-200 px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4 shrink-0">
        <div className="flex items-center gap-2.5 min-w-0">
          <span className="text-base sm:text-lg font-bold tracking-tight text-slate-900 whitespace-nowrap shrink-0">
            UHS MeritPulse
          </span>
          <span className="hidden sm:inline text-slate-300" aria-hidden="true">
            /
          </span>
          <span className="hidden sm:inline text-xs font-medium text-slate-500 whitespace-nowrap">
            Punjab Public MBBS
          </span>
        </div>

        <div className="flex items-center gap-2 shrink-0 text-right">
          <span className="hidden sm:inline text-xs text-slate-500 whitespace-nowrap">
            Your Aggregate
          </span>
          <span className="text-sm sm:text-base font-mono tabular-nums font-semibold text-teal-700 whitespace-nowrap">
            {studentState.profile.calculatedAggregate.toFixed(4)}%
          </span>
        </div>
      </header>

      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-[1280px] w-full mx-auto">
        <UpgradationTrackerView
          colleges={UHS_PUBLIC_MBBS_COLLEGES}
          voteSummaries={{}}
          profile={studentState.profile}
          useDirectAggregate={studentState.useDirectAggregate}
          directAggregateValue={studentState.directAggregateValue}
          onChangeProfile={handleChangeProfile}
          onResetProfile={handleResetProfile}
          onSelectCollege={(c) => setSelectedCollege(c)}
        />
      </main>

      <footer className="py-4 px-4 text-center shrink-0">
        <p className="font-sans text-[11px] text-slate-400">
          M Saad Virk
        </p>
      </footer>

      {/* College Detail Drawer */}
      <CollegeDrawer
        college={selectedCollege}
        studentAggregate={studentState.profile.calculatedAggregate}
        relatedUpdates={
          selectedCollege
            ? BASELINE_ADMISSION_UPDATES.filter(
                (u) => u.collegeId === selectedCollege.id || u.collegeId === 'all'
              ).slice(0, 5)
            : []
        }
        onClose={() => setSelectedCollege(null)}
      />
    </div>
  );
}
