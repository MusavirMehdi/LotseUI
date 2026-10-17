import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  User,
  GraduationCap,
  Briefcase,
  Building2,
  FileText,
  AlertTriangle,
  Play,
  RefreshCw,
  Loader2,
} from 'lucide-react';
import { api } from '../../api/client';
import { ApplicantProfileResponse } from '../../api/types';
import { useAuth } from '../../context/AuthContext';
import { useChat } from '../../hooks/useChat';

export interface ProfileSidebarProps {
  onRunQualification?: () => void;
  className?: string;
}

export const ProfileSidebar: React.FC<ProfileSidebarProps> = ({
  onRunQualification,
  className = '',
}) => {
  const { user, refreshUser } = useAuth();
  const { sendGoal, isGoalPending, isAgentRunning, messages } = useChat();
  const [profile, setProfile] = useState<ApplicantProfileResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [updatingPathway, setUpdatingPathway] = useState(false);
  const [activeTab, setActiveTab] = useState<'profile' | 'uploads' | 'conflicts'>('profile');

  const fetchProfile = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const data = await api.getProfile();
      setProfile(data);
    } catch (err) {
      console.warn('Could not load applicant profile:', err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  // Real-time synchronization: refresh profile when fields are saved or agent turns finish
  const savedFieldsCount = messages.filter((m) => !!m.fieldSavedData).length;
  const prevIsRunningRef = useRef(isAgentRunning);

  useEffect(() => {
    if (prevIsRunningRef.current && !isAgentRunning) {
      fetchProfile();
    }
    prevIsRunningRef.current = isAgentRunning;
  }, [isAgentRunning, fetchProfile]);

  useEffect(() => {
    if (savedFieldsCount > 0) {
      fetchProfile();
    }
  }, [savedFieldsCount, fetchProfile]);

  const handlePathwayChange = async (pathway: 'study' | 'training' | 'work') => {
    if (pathway === (user?.targetPathway?.toLowerCase() || 'study') || updatingPathway || isGoalPending || isAgentRunning) {
      return;
    }
    setUpdatingPathway(true);
    try {
      await sendGoal(pathway);
      await refreshUser();
      await fetchProfile();
    } catch (err) {
      console.warn('Could not update pathway:', err);
    } finally {
      setUpdatingPathway(false);
    }
  };

  const [showTasks, setShowTasks] = useState(false);

  const currentPathway = user?.targetPathway || 'study';

  const pathwayOptions = [
    { key: 'study', label: 'Study', icon: GraduationCap },
    { key: 'training', label: 'Ausbildung', icon: Building2 },
    { key: 'work', label: 'Work', icon: Briefcase },
  ];

  // Requirements matrix by pathway
  const requirementsConfig = {
    study: [
      { id: 'target_pathway', label: 'Study Goal Declared', category: 'Academic' },
      { id: 'study_level', label: 'Target Degree Level', category: 'Academic' },
      { id: 'highest_qualification', label: 'Previous Qualification', category: 'Academic' },
      { id: 'german_level', label: 'German Proficiency', category: 'Language' },
      { id: 'blocked_account', label: 'Financial Proof', category: 'Finances' },
    ],
    training: [
      { id: 'target_pathway', label: 'Ausbildung Goal Declared', category: 'Academic' },
      { id: 'highest_qualification', label: 'School Certificate', category: 'Academic' },
      { id: 'german_level', label: 'German B1/B2 Level', category: 'Language' },
      { id: 'blocked_account', label: 'Living Support / Funds', category: 'Finances' },
    ],
    work: [
      { id: 'target_pathway', label: 'Employment Goal Declared', category: 'Professional' },
      { id: 'qualification_recognition', label: 'Degree Recognition', category: 'Professional' },
      { id: 'german_level', label: 'German Language', category: 'Language' },
      { id: 'job_offer', label: 'German Job Offer', category: 'Employment' },
    ],
  };

  const reqList =
    requirementsConfig[currentPathway.toLowerCase() as keyof typeof requirementsConfig] ||
    requirementsConfig.study;

  const fieldsMap = new Map((profile?.fields || []).map((f) => [f.key, f]));

  const isFieldSatisfied = (fieldKey: string) => {
    const f = fieldsMap.get(fieldKey);
    return Boolean(f && (f.status === 'PROVIDED' || f.status === 'VERIFIED'));
  };

  const isTaskSatisfied = (taskId: string) => {
    if (taskId === 'target_pathway') {
      return Boolean(user?.targetPathway || fieldsMap.get('target_pathway')?.value || profile?.fields?.some((f) => f.key === 'target_pathway'));
    }
    if (taskId === 'highest_qualification') {
      return (
        isFieldSatisfied('highest_qualification') ||
        isFieldSatisfied('class_12_percentage') ||
        isFieldSatisfied('bachelor_completed') ||
        isFieldSatisfied('school_certificate') ||
        isFieldSatisfied('vocational_diploma')
      );
    }
    if (taskId === 'blocked_account') {
      return (
        isFieldSatisfied('blocked_account') ||
        isFieldSatisfied('financial_proof_eur') ||
        isFieldSatisfied('financial_funds_eur') ||
        isFieldSatisfied('has_blocked_account')
      );
    }
    return isFieldSatisfied(taskId);
  };

  const completedTasks = reqList.filter((r) => isTaskSatisfied(r.id));
  const pendingTasks = reqList.filter((r) => !isTaskSatisfied(r.id));

  const readinessPct = Math.round((completedTasks.length / reqList.length) * 100);
  const ringRadius = 24;
  const ringCircumference = 2 * Math.PI * ringRadius;
  const strokeDashoffset = ringCircumference - (readinessPct / 100) * ringCircumference;

  return (
    <div className={`flex flex-col h-full bg-[var(--surface-card)] text-[var(--text-primary)] border-r border-[var(--border-subtle)] ${className}`}>
      {/* Header */}
      <div className="p-4 border-b border-[var(--border-subtle)]">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-blue-500/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center text-xs font-bold">
              <User className="w-3.5 h-3.5" />
            </div>
            <div>
              <div className="text-xs font-bold truncate max-w-[140px] text-zinc-950 dark:text-white">
                {user ? user.email.split('@')[0] : 'Guest Session'}
              </div>
              <div className="text-[10px] text-zinc-400 truncate">
                {user ? user.email : 'Not signed in'}
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={fetchProfile}
            disabled={loading}
            aria-label="Refresh profile"
            className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {/* Target Pathway Selector */}
        <div className="mb-3.5">
          <div className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
            Active Target Pathway
          </div>
          <div className="grid grid-cols-3 gap-1 p-1 rounded-xl bg-[var(--surface-elevated)] border border-[var(--border-subtle)]">
            {pathwayOptions.map((opt) => {
              const Icon = opt.icon;
              const isActive = currentPathway.toLowerCase() === opt.key;
              return (
                <button
                  key={opt.key}
                  type="button"
                  disabled={updatingPathway || isGoalPending || isAgentRunning || isActive}
                  onClick={() => handlePathwayChange(opt.key as any)}
                  className={`py-1.5 px-2 rounded-lg text-[11px] font-medium flex items-center justify-center gap-1 transition-all ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-xs font-semibold cursor-default'
                      : updatingPathway || isGoalPending || isAgentRunning
                        ? 'text-zinc-400 opacity-50 cursor-not-allowed'
                        : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white cursor-pointer'
                  }`}
                >
                  <Icon className="w-3 h-3 shrink-0" />
                  <span>{opt.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Readiness Dashboard Widget */}
        <div className="p-3 rounded-xl bg-[var(--surface-elevated)] border border-[var(--border-subtle)] space-y-2.5">
          <div className="flex items-center gap-3">
            {/* SVG Readiness Ring */}
            <div className="relative w-14 h-14 shrink-0 flex items-center justify-center">
              <svg className="w-14 h-14 -rotate-90" viewBox="0 0 60 60">
                <circle
                  cx="30"
                  cy="30"
                  r={ringRadius}
                  stroke="currentColor"
                  strokeWidth="4"
                  className="text-zinc-200 dark:text-zinc-800"
                  fill="transparent"
                />
                <circle
                  cx="30"
                  cy="30"
                  r={ringRadius}
                  stroke="currentColor"
                  strokeWidth="4"
                  className={`transition-all duration-700 ease-out ${
                    readinessPct >= 80
                      ? 'text-emerald-500'
                      : readinessPct >= 40
                        ? 'text-blue-500'
                        : 'text-amber-500'
                  }`}
                  fill="transparent"
                  strokeDasharray={ringCircumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-[11px] font-extrabold tracking-tight text-zinc-900 dark:text-white">
                  {readinessPct}%
                </span>
              </div>
            </div>

            {/* Readiness Summary */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <span
                  className={`inline-block w-2 h-2 rounded-full ${
                    readinessPct >= 80
                      ? 'bg-emerald-500'
                      : readinessPct >= 40
                        ? 'bg-blue-500'
                        : 'bg-amber-500'
                  }`}
                />
                <span className="text-xs font-bold text-zinc-900 dark:text-white truncate">
                  {readinessPct >= 80
                    ? 'Ready for Stage 2'
                    : readinessPct >= 40
                      ? 'Profile in Progress'
                      : 'Initial Exploration'}
                </span>
              </div>
              <div className="text-[10px] text-zinc-500 dark:text-zinc-400 mt-0.5">
                {completedTasks.length} of {reqList.length} criteria satisfied
              </div>
              <div className="w-full bg-zinc-200 dark:bg-zinc-800 h-1.5 rounded-full overflow-hidden mt-1.5">
                <div
                  className={`h-full transition-all duration-500 ${
                    readinessPct >= 80
                      ? 'bg-emerald-500'
                      : readinessPct >= 40
                        ? 'bg-blue-500'
                        : 'bg-amber-500'
                  }`}
                  style={{ width: `${readinessPct}%` }}
                />
              </div>
            </div>
          </div>

          {/* Tasks Left Toggle */}
          {pendingTasks.length > 0 && (
            <div className="pt-2 border-t border-[var(--border-subtle)]">
              <button
                type="button"
                onClick={() => setShowTasks((prev) => !prev)}
                className="w-full flex items-center justify-between text-[11px] text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white font-medium cursor-pointer"
              >
                <span>{pendingTasks.length} remaining tasks</span>
                <span className="text-[10px] text-blue-500">
                  {showTasks ? 'Hide' : 'View'}
                </span>
              </button>

              {showTasks && (
                <div className="mt-2 space-y-1">
                  {pendingTasks.map((t) => (
                    <div
                      key={t.id}
                      className="flex items-center gap-1.5 text-[10px] text-zinc-500 dark:text-zinc-400 p-1 rounded bg-black/5 dark:bg-white/5"
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                      <span className="truncate">{t.label}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[var(--border-subtle)] text-xs font-medium">
        <button
          type="button"
          onClick={() => setActiveTab('profile')}
          className={`flex-1 py-2.5 text-center border-b-2 transition-colors cursor-pointer ${
            activeTab === 'profile'
              ? 'border-blue-600 text-blue-600 dark:text-blue-400 font-semibold'
              : 'border-transparent text-zinc-500 hover:text-zinc-900 dark:hover:text-white'
          }`}
        >
          Fields ({profile?.fields.length || 0})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('uploads')}
          className={`flex-1 py-2.5 text-center border-b-2 transition-colors cursor-pointer ${
            activeTab === 'uploads'
              ? 'border-blue-600 text-blue-600 dark:text-blue-400 font-semibold'
              : 'border-transparent text-zinc-500 hover:text-zinc-900 dark:hover:text-white'
          }`}
        >
          Documents ({profile?.uploads.length || 0})
        </button>
        {profile?.unresolved_conflicts && profile.unresolved_conflicts.length > 0 && (
          <button
            type="button"
            onClick={() => setActiveTab('conflicts')}
            className={`flex-1 py-2.5 text-center border-b-2 transition-colors flex items-center justify-center gap-1 cursor-pointer ${
              activeTab === 'conflicts'
                ? 'border-amber-500 text-amber-600 font-semibold'
                : 'border-transparent text-amber-500 hover:text-amber-600'
            }`}
          >
            <span>Conflicts</span>
            <span className="w-4 h-4 rounded-full bg-amber-500/20 text-[10px] font-bold flex items-center justify-center">
              {profile.unresolved_conflicts.length}
            </span>
          </button>
        )}
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-2">
        {loading && !profile ? (
          <div className="flex items-center justify-center py-10 text-xs text-zinc-400 gap-2">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Loading authoritative records...</span>
          </div>
        ) : activeTab === 'profile' ? (
          <div>
            {!profile?.fields || profile.fields.length === 0 ? (
              <div className="text-center py-8 text-xs text-zinc-400">
                No profile fields yet. Answer agent questions or upload documents to populate your record.
              </div>
            ) : (
              <div className="space-y-2">
                {profile.fields.map((f) => (
                  <div
                    key={f.id}
                    className="p-2.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-elevated)] text-xs"
                  >
                    <div className="flex items-center justify-between text-[11px] text-zinc-400 mb-1">
                      <span className="font-mono text-zinc-500 truncate max-w-[120px]">{f.key}</span>
                      <span
                        className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase ${
                          f.status === 'VERIFIED'
                            ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                            : 'bg-blue-500/15 text-blue-600 dark:text-blue-400'
                        }`}
                      >
                        {f.status}
                      </span>
                    </div>
                    <div className="font-semibold text-zinc-900 dark:text-white break-words">
                      {typeof f.value === 'object' ? JSON.stringify(f.value) : String(f.value)}
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-zinc-400 mt-1">
                      <span>Source: {f.source}</span>
                      <span>Confidence: {(f.confidence * 100).toFixed(0)}%</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : activeTab === 'uploads' ? (
          <div>
            {!profile?.uploads || profile.uploads.length === 0 ? (
              <div className="text-center py-8 text-xs text-zinc-400">
                No documents uploaded. Click the paperclip icon in chat to upload.
              </div>
            ) : (
              <div className="space-y-2">
                {profile.uploads.map((u) => (
                  <div
                    key={u.id}
                    className="p-2.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-elevated)] text-xs"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <FileText className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                      <span className="font-medium text-zinc-900 dark:text-white truncate">
                        {u.file_name}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-zinc-400">
                      <span className="uppercase">{u.kind}</span>
                      <span className={u.processed ? 'text-emerald-500 font-semibold' : 'text-amber-500'}>
                        {u.processed ? 'Processed' : 'Pending'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div>
            {profile?.unresolved_conflicts.map((c) => (
              <div
                key={c.id}
                className="p-2.5 rounded-xl border border-amber-500/30 bg-amber-500/10 text-xs mb-2"
              >
                <div className="flex items-center gap-1.5 font-semibold text-amber-700 dark:text-amber-300 mb-1">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>Conflict: {c.field_key}</span>
                </div>
                <div className="text-[11px] text-zinc-600 dark:text-zinc-400">
                  Existing: <strong className="text-zinc-900 dark:text-white">{String(c.existing_value)}</strong>
                  <br />
                  Incoming: <strong className="text-zinc-900 dark:text-white">{String(c.incoming_value)}</strong>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Manual Check Qualification Action */}
      {onRunQualification && (
        <div className="p-3 border-t border-[var(--border-subtle)]">
          <button
            type="button"
            onClick={onRunQualification}
            className="w-full py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Evaluate Qualification</span>
          </button>
        </div>
      )}
    </div>
  );
};
