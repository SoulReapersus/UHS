import type {
  AdmissionUpdate,
  College,
  CollegeVote,
  CollegeVoteSummary,
  QuotaCategory,
  UpgradationAssessment,
} from '../types/uhs';

export const UHS_PUBLIC_MBBS_COLLEGES: College[] = [
  {
    id: 'kemu-lahore',
    rank: 1,
    name: 'King Edward Medical University (KEMU)',
    shortName: 'KEMU',
    city: 'Lahore',
    established: 1860,
    openMeritSeats: 302,
    totalSeats: 325,
    firstListClosing: 95.3212,
    latestClosing: 94.9636,
    priorYearFinalClosing: 94.8727,
    currentRound: 1,
    status: 'filling_fast',
    quotaHighlights: '302 Open Merit · Overseas, Disability & Reciprocal seats active',
  },
  {
    id: 'aimc-lahore',
    rank: 2,
    name: 'Allama Iqbal Medical College (AIMC)',
    shortName: 'AIMC',
    city: 'Lahore',
    established: 1975,
    openMeritSeats: 294,
    totalSeats: 325,
    firstListClosing: 94.8909,
    latestClosing: 94.5364,
    priorYearFinalClosing: 94.4500,
    currentRound: 1,
    status: 'open_upgradation',
    quotaHighlights: '294 Open Merit · High upward turnover into KEMU across Lists 2–5',
  },
  {
    id: 'sims-lahore',
    rank: 3,
    name: 'Services Institute of Medical Sciences (SIMS)',
    shortName: 'SIMS',
    city: 'Lahore',
    established: 2003,
    openMeritSeats: 188,
    totalSeats: 220,
    firstListClosing: 94.6455,
    latestClosing: 94.3182,
    priorYearFinalClosing: 94.2182,
    currentRound: 1,
    status: 'open_upgradation',
    quotaHighlights: '188 Open Merit · Strong AIMC & KEMU cascade movement',
  },
  {
    id: 'nmu-multan',
    rank: 4,
    name: 'Nishtar Medical University (NMU)',
    shortName: 'Nishtar',
    city: 'Multan',
    established: 1951,
    openMeritSeats: 272,
    totalSeats: 300,
    firstListClosing: 94.5273,
    latestClosing: 94.1864,
    priorYearFinalClosing: 94.0909,
    currentRound: 1,
    status: 'open_upgradation',
    quotaHighlights: '272 Open Merit · Flagship Southern Punjab teaching center',
  },
  {
    id: 'rmu-rawalpindi',
    rank: 5,
    name: 'Rawalpindi Medical University (RMU)',
    shortName: 'RMU',
    city: 'Rawalpindi',
    established: 1974,
    openMeritSeats: 303,
    totalSeats: 350,
    firstListClosing: 94.3636,
    latestClosing: 94.0182,
    priorYearFinalClosing: 93.9227,
    currentRound: 1,
    status: 'open_upgradation',
    quotaHighlights: '303 Open Merit · High Twin Cities retention rate across rounds',
  },
  {
    id: 'fjmu-lahore',
    rank: 6,
    name: 'Fatima Jinnah Medical University (FJMU)',
    shortName: 'FJMU',
    city: 'Lahore',
    established: 1948,
    openMeritSeats: 187,
    totalSeats: 250,
    firstListClosing: 94.2818,
    latestClosing: 93.9455,
    priorYearFinalClosing: 93.8545,
    currentRound: 1,
    status: 'open_upgradation',
    quotaHighlights: '187 Open Merit · Female-only MBBS with federal & reciprocal quotas',
  },
  {
    id: 'amc-lahore',
    rank: 7,
    name: 'Ameer-ud-Din Medical College (AMC / PGMI)',
    shortName: 'AMC',
    city: 'Lahore',
    established: 2012,
    openMeritSeats: 98,
    totalSeats: 110,
    firstListClosing: 94.2455,
    latestClosing: 93.9182,
    priorYearFinalClosing: 93.8318,
    currentRound: 1,
    status: 'filling_fast',
    quotaHighlights: '98 Open Merit · Smaller intake yields tighter late-round drops',
  },
  {
    id: 'fmu-faisalabad',
    rank: 8,
    name: 'Punjab Medical College / FMU Faisalabad',
    shortName: 'PMC / FMU',
    city: 'Faisalabad',
    established: 1973,
    openMeritSeats: 269,
    totalSeats: 300,
    firstListClosing: 94.1682,
    latestClosing: 93.8409,
    priorYearFinalClosing: 93.7545,
    currentRound: 1,
    status: 'open_upgradation',
    quotaHighlights: '269 Open Merit · Active central Punjab upgradation corridor',
  },
  {
    id: 'qamc-bahawalpur',
    rank: 9,
    name: 'Quaid-e-Azam Medical College (QAMC)',
    shortName: 'QAMC',
    city: 'Bahawalpur',
    established: 1971,
    openMeritSeats: 267,
    totalSeats: 305,
    firstListClosing: 94.1136,
    latestClosing: 93.7909,
    priorYearFinalClosing: 93.7045,
    currentRound: 1,
    status: 'open_upgradation',
    quotaHighlights: '267 Open Merit · Includes Cholistan & UDD reserved seats',
  },
  {
    id: 'gmc-gujranwala',
    rank: 10,
    name: 'Gujranwala Medical College (GMC)',
    shortName: 'GMC',
    city: 'Gujranwala',
    established: 2010,
    openMeritSeats: 98,
    totalSeats: 110,
    firstListClosing: 94.0455,
    latestClosing: 93.7364,
    priorYearFinalClosing: 93.6591,
    currentRound: 1,
    status: 'open_upgradation',
    quotaHighlights: '98 Open Merit · Frequent movement toward Lahore & Rawalpindi',
  },
  {
    id: 'smc-sargodha',
    rank: 11,
    name: 'Sargodha Medical College (SMC)',
    shortName: 'SMC',
    city: 'Sargodha',
    established: 2006,
    openMeritSeats: 98,
    totalSeats: 110,
    firstListClosing: 94.0091,
    latestClosing: 93.7000,
    priorYearFinalClosing: 93.6273,
    currentRound: 1,
    status: 'open_upgradation',
    quotaHighlights: '98 Open Merit · Balanced central-west Punjab preference cluster',
  },
  {
    id: 'nsmc-gujrat',
    rank: 12,
    name: 'Nawaz Sharif Medical College (NSMC)',
    shortName: 'NSMC',
    city: 'Gujrat',
    established: 2008,
    openMeritSeats: 98,
    totalSeats: 110,
    firstListClosing: 93.9818,
    latestClosing: 93.6727,
    priorYearFinalClosing: 93.6000,
    currentRound: 1,
    status: 'open_upgradation',
    quotaHighlights: '98 Open Merit · Strong GT-Road belt applicant pool',
  },
  {
    id: 'szmc-ryk',
    rank: 13,
    name: 'Sheikh Zayed Medical College (SZMC)',
    shortName: 'SZMC',
    city: 'Rahim Yar Khan',
    established: 2003,
    openMeritSeats: 145,
    totalSeats: 165,
    firstListClosing: 93.9545,
    latestClosing: 93.6500,
    priorYearFinalClosing: 93.5773,
    currentRound: 1,
    status: 'open_upgradation',
    quotaHighlights: '145 Open Merit · UDD & Cholistan clearances drive mid-cycle shifts',
  },
  {
    id: 'slmc-sahiwal',
    rank: 14,
    name: 'Sahiwal Medical College (SLMC)',
    shortName: 'SLMC',
    city: 'Sahiwal',
    established: 2010,
    openMeritSeats: 98,
    totalSeats: 110,
    firstListClosing: 93.9364,
    latestClosing: 93.6364,
    priorYearFinalClosing: 93.5636,
    currentRound: 1,
    status: 'open_upgradation',
    quotaHighlights: '98 Open Merit · Consistent 0.05–0.08% drop per mid-cycle list',
  },
  {
    id: 'kmsmc-sialkot',
    rank: 15,
    name: 'Khawaja Muhammad Safdar Medical College (KMSMC)',
    shortName: 'KMSMC',
    city: 'Sialkot',
    established: 2011,
    openMeritSeats: 98,
    totalSeats: 110,
    firstListClosing: 93.9182,
    latestClosing: 93.6182,
    priorYearFinalClosing: 93.5455,
    currentRound: 1,
    status: 'open_upgradation',
    quotaHighlights: '98 Open Merit · High crossover with Gujranwala & Gujrat',
  },
  {
    id: 'dgkmc-dgkhan',
    rank: 16,
    name: 'D.G. Khan Medical College (DGKMC)',
    shortName: 'DGKMC',
    city: 'D.G. Khan',
    established: 2010,
    openMeritSeats: 98,
    totalSeats: 115,
    firstListClosing: 93.8909,
    latestClosing: 93.5955,
    priorYearFinalClosing: 93.5318,
    currentRound: 1,
    status: 'open_upgradation',
    quotaHighlights: '98 Open Merit · Tribal & UDD quota clearances drive vacancies',
  },
  {
    id: 'nmc-narowal',
    rank: 17,
    name: 'Narowal Medical College (NMC)',
    shortName: 'NMC',
    city: 'Narowal',
    established: 2023,
    openMeritSeats: 92,
    totalSeats: 100,
    firstListClosing: 93.8636,
    latestClosing: 93.5727,
    priorYearFinalClosing: 93.5091,
    currentRound: 1,
    status: 'open_upgradation',
    quotaHighlights: '92 Open Merit · Entry threshold for Punjab Public MBBS Open Merit',
  },
];

export const BASELINE_ADMISSION_UPDATES: AdmissionUpdate[] = [
  {
    id: 'baseline-round-3-open-merit',
    title: 'UHS Public MBBS Selection & Upgradation Cycle (MDCAT 180 Scale)',
    body: 'Based on UHS Open Merit benchmarks (10% Matric + 40% FSc + 50% MDCAT/180), KEMU stands near 94.96% while Narowal Medical College anchors the public Open Merit threshold near 93.57% (2025–2026 final close: 93.5091%).',
    category: 'official_list',
    collegeId: 'all',
    roundNumber: 3,
    authorId: 'uhs-registry',
    authorName: 'UHS Public Registry Benchmark',
    verifiedSource: true,
    createdAt: '2026-11-23T09:00:00.000Z',
    isPinnedBaseline: true,
  },
  {
    id: 'baseline-fee-challan-rule',
    title: 'Fee Challan & Joining Deadline Mandatory to Retain Upgradation',
    body: 'Candidates allotted a seat in the current selection list must deposit the Bank of Punjab fee challan and report to their provisionally allotted medical college before the cutoff window to remain eligible for automatic upgradation.',
    category: 'fee_deadline',
    collegeId: 'all',
    roundNumber: 3,
    authorId: 'uhs-registry',
    authorName: 'UHS Admissions Protocol',
    verifiedSource: true,
    createdAt: '2026-11-22T15:30:00.000Z',
    isPinnedBaseline: true,
  },
  {
    id: 'baseline-aimc-sims-shift',
    title: 'AIMC & SIMS Vacancy Cascade Observed Following KEMU Joins',
    body: 'Unjoined reciprocal and dual-offer seats in Lahore centers opened cascading slots across AIMC (94.5364%) and SIMS (94.3182%) during mid-cycle upgradation.',
    category: 'seat_movement',
    collegeId: 'aimc-lahore',
    roundNumber: 3,
    authorId: 'uhs-registry',
    authorName: 'Merit Watch Desk',
    verifiedSource: true,
    createdAt: '2026-11-21T11:15:00.000Z',
    isPinnedBaseline: true,
  },
];

export const QUOTA_LABELS: Record<QuotaCategory, string> = {
  open_merit: 'Open Merit (Punjab Domicile)',
  udd: 'Underdeveloped Districts (UDD)',
  overseas: 'Overseas / Dual National',
  reciprocal: 'Reciprocal Quota',
  disability: 'Students with Disabilities',
};

export function calculateUhSAggregate(
  matricMarks: number,
  matricTotal: number,
  fscMarks: number,
  fscTotal: number,
  mdcatMarks: number,
  mdcatTotal: number
): number {
  const safeMatric = matricTotal > 0 ? Math.min(Math.max(matricMarks / matricTotal, 0), 1) : 0;
  const safeFsc = fscTotal > 0 ? Math.min(Math.max(fscMarks / fscTotal, 0), 1) : 0;
  const safeMdcat = mdcatTotal > 0 ? Math.min(Math.max(mdcatMarks / mdcatTotal, 0), 1) : 0;
  const aggregate = safeMdcat * 50 + safeFsc * 40 + safeMatric * 10;
  return Number(aggregate.toFixed(4));
}

export function summarizeVotesByCollege(
  votes: CollegeVote[]
): Record<string, CollegeVoteSummary> {
  const map: Record<string, CollegeVoteSummary> = {};
  const predictionSums: Record<string, number> = {};
  const predictionCounts: Record<string, number> = {};

  for (const vote of votes) {
    if (!map[vote.collegeId]) {
      map[vote.collegeId] = {
        total: 0,
        dropLikely: 0,
        steady: 0,
        tight: 0,
        avgPredictedClosing: null,
      };
      predictionSums[vote.collegeId] = 0;
      predictionCounts[vote.collegeId] = 0;
    }

    const summary = map[vote.collegeId];
    summary.total += 1;
    if (vote.sentiment === 'drop_likely') summary.dropLikely += 1;
    else if (vote.sentiment === 'steady') summary.steady += 1;
    else if (vote.sentiment === 'tight') summary.tight += 1;

    if (typeof vote.predictedClosing === 'number' && !Number.isNaN(vote.predictedClosing)) {
      predictionSums[vote.collegeId] += vote.predictedClosing;
      predictionCounts[vote.collegeId] += 1;
    }
  }

  for (const collegeId of Object.keys(map)) {
    const count = predictionCounts[collegeId];
    map[collegeId].avgPredictedClosing =
      count > 0 ? Number((predictionSums[collegeId] / count).toFixed(4)) : null;
  }

  return map;
}

export function assessUpgradationChance(
  studentAggregate: number,
  college: College,
  voteSummary?: CollegeVoteSummary
): UpgradationAssessment {
  const gapFromLatest = Number((studentAggregate - college.latestClosing).toFixed(4));
  const historicalDropSoFar = Math.max(0.05, college.firstListClosing - college.latestClosing);
  // Typical remaining late-round drop is ~35–55% of the List 1->3 drop, modulated by seat pool size
  const seatPoolFactor = college.openMeritSeats >= 200 ? 0.52 : 0.42;
  const expectedRemainingDrop = Number((historicalDropSoFar * seatPoolFactor).toFixed(4));

  let crowdBias = 0;
  if (voteSummary && voteSummary.total >= 1) {
    const dropShare = voteSummary.dropLikely / voteSummary.total;
    const tightShare = voteSummary.tight / voteSummary.total;
    crowdBias = (dropShare - tightShare) * 0.025;
  }

  const projectedFinalClosing = Number(
    Math.max(college.priorYearFinalClosing - 0.04, college.latestClosing - expectedRemainingDrop - crowdBias).toFixed(4)
  );

  if (gapFromLatest >= 0) {
    return {
      college,
      gapFromLatest,
      projectedFinalClosing,
      probabilityPercent: 98,
      band: 'Allotted / Secured',
      rationale: `Your aggregate clears the current closing cutoff by +${gapFromLatest.toFixed(4)}%.`,
    };
  }

  const deficit = Math.abs(gapFromLatest);
  const projectedMargin = Number((studentAggregate - projectedFinalClosing).toFixed(4));

  if (deficit <= expectedRemainingDrop * 0.85 || projectedMargin >= 0.015) {
    const pct = Math.min(91, Math.max(66, Math.round(86 - (deficit / Math.max(expectedRemainingDrop, 0.04)) * 22)));
    return {
      college,
      gapFromLatest,
      projectedFinalClosing,
      probabilityPercent: pct,
      band: 'High Likelihood',
      rationale: `Within ${deficit.toFixed(4)}% of current cutoff; typical Round 4–5 movement (${expectedRemainingDrop.toFixed(3)}%) favors upgradation.`,
    };
  }

  if (deficit <= expectedRemainingDrop * 1.65) {
    const pct = Math.min(64, Math.max(34, Math.round(58 - (deficit / Math.max(expectedRemainingDrop, 0.04)) * 14)));
    return {
      college,
      gapFromLatest,
      projectedFinalClosing,
      probabilityPercent: pct,
      band: 'Borderline / Watchlist',
      rationale: `Needs ${deficit.toFixed(4)}% drop across remaining lists; outcome depends on unjoined seat vacancies.`,
    };
  }

  const pct = Math.max(4, Math.min(30, Math.round(28 - deficit * 45)));
  return {
    college,
    gapFromLatest,
    projectedFinalClosing,
    probabilityPercent: pct,
    band: 'Reach',
    rationale: `Currently ${deficit.toFixed(4)}% below latest cutoff; exceeds historical late-round movement.`,
  };
}

export function summarizeIntentionsByCollege(
  intentions: import('../types/uhs').SeatIntention[]
): Record<string, import('../types/uhs').CollegeIntentionSummary> {
  const map: Record<string, import('../types/uhs').CollegeIntentionSummary> = {};
  for (const item of intentions) {
    if (!item.currentCollegeId || item.currentCollegeId === 'awaiting-list') continue;
    if (!map[item.currentCollegeId]) {
      map[item.currentCollegeId] = {
        total: 0,
        leaving: 0,
        upgrading: 0,
        staying: 0,
      };
    }
    const summary = map[item.currentCollegeId];
    summary.total += 1;
    if (item.willLeaveCollege || item.intentionStatus === 'leaving') {
      summary.leaving += 1;
    } else if (item.optForUpgradation || item.intentionStatus === 'upgrading') {
      summary.upgrading += 1;
    } else {
      summary.staying += 1;
    }
  }
  return map;
}
