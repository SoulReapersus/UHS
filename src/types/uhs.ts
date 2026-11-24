export type CollegeStatus = 'open_upgradation' | 'filling_fast' | 'finalized';

export type VoteSentiment = 'drop_likely' | 'steady' | 'tight';

export type UpdateCategory =
  | 'official_list'
  | 'fee_deadline'
  | 'seat_movement'
  | 'upgradation_alert';

export type QuotaCategory =
  | 'open_merit'
  | 'udd'
  | 'overseas'
  | 'reciprocal'
  | 'disability';

export interface College {
  id: string;
  rank: number;
  name: string;
  shortName: string;
  city: string;
  established: number;
  openMeritSeats: number;
  totalSeats: number;
  firstListClosing: number;
  latestClosing: number;
  priorYearFinalClosing: number;
  currentRound: number;
  status: CollegeStatus;
  quotaHighlights: string;
}

export interface CollegeVote {
  id: string;
  collegeId: string;
  userId: string;
  sentiment: VoteSentiment;
  predictedClosing: number;
  aggregateSnapshot: number;
  updatedAt: string;
}

export interface CollegeVoteSummary {
  total: number;
  dropLikely: number;
  steady: number;
  tight: number;
  avgPredictedClosing: number | null;
}

export interface AdmissionUpdate {
  id: string;
  title: string;
  body: string;
  category: UpdateCategory;
  collegeId: string;
  roundNumber: number;
  authorId: string;
  authorName: string;
  verifiedSource: boolean;
  createdAt: string;
  isPinnedBaseline?: boolean;
}

export interface MeritProfile {
  userId: string;
  matricMarks: number;
  matricTotal: number;
  fscMarks: number;
  fscTotal: number;
  mdcatMarks: number;
  mdcatTotal: number;
  calculatedAggregate: number;
  currentCollegeId: string;
  quotaCategory: QuotaCategory;
  preferredCollegeIds: string[];
  updatedAt?: string;
}

export type ProbabilityBand =
  | 'Allotted / Secured'
  | 'High Likelihood'
  | 'Borderline / Watchlist'
  | 'Reach';

export interface UpgradationAssessment {
  college: College;
  gapFromLatest: number;
  projectedFinalClosing: number;
  probabilityPercent: number;
  band: ProbabilityBand;
  rationale: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  model?: string;
  timestamp: string;
}

export type ChatModelId =
  | 'gemini-4-hydrogen'
  | 'gemini-3.1-flash-lite'
  | 'gemini-4-carbon'
  | 'gemini-4-neon';

export type ImageSizeOption = '1K' | '2K' | '4K';
export type AspectRatioOption = '1:1' | '4:3' | '3:4' | '16:9';

export type IntentionStatus = 'leaving' | 'upgrading' | 'staying';

export interface SeatIntention {
  userId: string;
  currentCollegeId: string;
  willLeaveCollege: boolean;
  optForUpgradation: boolean;
  intentionStatus: IntentionStatus;
  targetCollegeId: string;
  updatedAt: string;
}

export interface CollegeIntentionSummary {
  total: number;
  leaving: number;
  upgrading: number;
  staying: number;
}
