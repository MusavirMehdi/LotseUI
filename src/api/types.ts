export type UiEventType =
  | 'turn_started'
  | 'step_started'
  | 'step_finished'
  | 'question'
  | 'field_saved'
  | 'conflict_found'
  | 'qualification_result'
  | 'recommendation'
  | 'budget_low'
  | 'error'
  | 'turn_finished';

export interface UiEventRecord {
  seq: number;
  turn_id: string | null;
  type: UiEventType;
  payload: Record<string, any>;
  created_at: string;
}

export interface UserResponse {
  id: string;
  email: string;
  applicantId: string;
}

export interface UserProfileResponse {
  id: string;
  email: string;
  applicantId: string;
  targetPathway: string | null;
  createdAt: string;
}

export interface ConversationStatusResponse {
  hasStarted: boolean;
  activePathway: 'study' | 'training' | 'work' | null;
  state: 'none' | 'running' | 'waiting_for_applicant' | 'idle';
  runningTurnId: string | null;
  pendingQuestion: {
    question_id: string;
    kind: string;
    prompt: string;
    options: string[] | null;
    field_key: string | null;
    reason_text: string | null;
  } | null;
  turnsCount: number;
  latestTurnStatus: string | null;
}


export interface ProfileFieldItem {
  id: string;
  applicant_id: string;
  key: string;
  value: any;
  status: 'PROVIDED' | 'VERIFIED' | 'NEEDS_CLARIFICATION' | 'REJECTED' | 'UNVERIFIED' | 'CONFLICT';
  source: 'APPLICANT' | 'DOCUMENT' | 'SYSTEM';
  confidence: number;
  created_at: string;
  updated_at: string;
}

export interface ConflictItem {
  id: string;
  applicant_id: string;
  field_key: string;
  existing_value: any;
  incoming_value: any;
  resolved: boolean;
  chosen_value?: any;
  created_at: string;
}

export interface UploadMetadata {
  id: string;
  applicant_id: string;
  kind: string;
  file_name: string;
  mime_type: string;
  size_bytes: number;
  sha256: string;
  processed: boolean;
  created_at: string;
}

export interface ApplicantProfileResponse {
  fields: ProfileFieldItem[];
  unresolved_conflicts: ConflictItem[];
  uploads: UploadMetadata[];
}

export interface RuleResultItem {
  rule_id: string;
  status: 'MET' | 'NOT_MET' | 'UNKNOWN' | 'NOT_APPLICABLE';
  reason_text?: string;
  label?: string;
}

export interface GroupedRuleResult {
  stage: string;
  rules: RuleResultItem[];
}

export interface CheckQualificationResult {
  pathway: string;
  overall: 'MET' | 'NOT_MET' | 'UNKNOWN';
  grouped_results: GroupedRuleResult[];
  missing_fields: string[];
}

export interface EducaroServiceDetails {
  id: string;
  name: string;
  description: string;
  cta_label: string;
  cta_url: string;
}

export interface RouteNextStep {
  label: string;
  educaro_service: EducaroServiceDetails | 'TBD';
}

export interface RouteResult {
  status: 'eligible' | 'ineligible' | 'needs_info';
  message: string;
  steps: RouteNextStep[];
}

export interface QualificationRunResponse {
  qualification: CheckQualificationResult;
  route: RouteResult;
}

export type ApplicantEventInput =
  | {
      client_event_id: string;
      type: 'goal';
      value: 'study' | 'training' | 'work' | 'ausbildung';
    }
  | {
      client_event_id: string;
      type: 'message';
      text: string;
    }
  | {
      client_event_id: string;
      type: 'upload';
      upload_id: string;
    }
  | {
      client_event_id: string;
      type: 'answer';
      question_id: string;
      value: string | number | boolean;
    }
  | {
      client_event_id: string;
      type: 'confirm';
      field_key: string;
      value: string | number | boolean;
    }
  | {
      client_event_id: string;
      type: 'edit';
      field_key: string;
      value: string | number | boolean;
    }
  | {
      client_event_id: string;
      type: 'resolve_conflict';
      conflict_id: string;
      chosen_value: string | number | boolean;
    }
  | {
      client_event_id: string;
      type: 'stop';
    };
