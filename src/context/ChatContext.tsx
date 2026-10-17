import React, { createContext, useState, useEffect, useCallback, ReactNode, useRef } from 'react';
import { api } from '../api/client';
import { UiEventRecord } from '../api/types';
import { useAuth } from './AuthContext';
import { QuestionData } from '../components/chat/QuestionControl';
import { ConflictResolutionCardProps } from '../components/chat/ConflictResolutionCard';
import { QualificationCardProps } from '../components/chat/QualificationCard';
import { RecommendationCardProps } from '../components/chat/RecommendationCard';

export interface ChatMessage {
  id: string;
  sender: 'genie' | 'user' | 'system';
  text: string;
  timestamp: number;
  questionData?: QuestionData;
  conflictData?: Omit<ConflictResolutionCardProps, 'onResolve'>;
  qualificationData?: QualificationCardProps;
  recommendationData?: RecommendationCardProps;
  fieldSavedData?: {
    field_key: string;
    field_label: string;
    value: any;
    status: string;
  };
  errorData?: {
    code?: string;
    message?: string;
    retryable?: boolean;
    reason?: string;
  };
}

export interface TransitionRect {
  top: number;
  left: number;
  width: number;
  height: number;
  borderRadius?: string;
}

export interface StartSessionAction {
  kind: 'goal' | 'text' | 'upload';
  value?: string;
  uploadId?: string;
  fileName?: string;
  documentKind?: string;
}

export interface ChatContextType {
  messages: ChatMessage[];
  welcomePlayed: boolean;
  isTransitioning: boolean;
  isTyping: boolean;
  isAgentRunning: boolean;
  currentAgentReason: string;
  currentIteration: number;
  currentToolName: string;
  pendingQuestion: QuestionData | null;
  transitionRect: TransitionRect | null;
  isFullScreenMounted: boolean;
  pendingStartAction: StartSessionAction | null;
  activePathway: 'study' | 'training' | 'work' | null;
  isGoalPending: boolean;
  hasStarted: boolean;
  conversationState: 'none' | 'running' | 'waiting_for_applicant' | 'idle';
  refreshConversationStatus: () => Promise<void>;
  triggerWelcomeMessage: () => void;
  sendUserMessage: (text: string) => Promise<void>;
  sendAnswer: (questionId: string, value: string | number | boolean) => Promise<void>;
  sendGoal: (goal: 'study' | 'training' | 'work', forceRetry?: boolean) => Promise<void>;
  sendUpload: (uploadId: string, fileName: string, kind: string) => Promise<void>;
  resolveConflict: (conflictId: string, choose: 'old' | 'new') => Promise<void>;
  stopCurrentTurn: () => Promise<void>;
  runManualQualification: () => Promise<void>;
  lastTurnFailed: boolean;
  retryLastAction: () => Promise<void>;
  startSession: (action: StartSessionAction) => void;
  consumePendingStartAction: () => StartSessionAction | null;
  startTransition: (rect?: TransitionRect | null) => void;
  endTransition: () => void;
  markFullScreenMounted: () => void;
  resetChat: () => void;
}

export const WELCOME_MESSAGE_TEXT = `Welcome! I'm LOTSE GENIE, your personal guide to opportunities in Germany. Whether you're planning to study, pursue vocational training or explore career opportunities, I'll help you figure out where to begin.

What brings you to Germany?`;

const STORAGE_KEY_PENDING_ACTION = 'lotse_pending_start_action';

export const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user, isAuthenticated, quickStartGuest } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [welcomePlayed, setWelcomePlayed] = useState<boolean>(false);
  const [pendingStartAction, setPendingStartAction] = useState<StartSessionAction | null>(() => {
    try {
      if (typeof window === 'undefined') return null;
      const raw = window.sessionStorage.getItem(STORAGE_KEY_PENDING_ACTION);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [isAgentRunning, setIsAgentRunning] = useState<boolean>(false);
  const [currentAgentReason, setCurrentAgentReason] = useState<string>('');
  const [currentIteration, setCurrentIteration] = useState<number>(0);
  const [currentToolName, setCurrentToolName] = useState<string>('');
  const [pendingQuestion, setPendingQuestion] = useState<QuestionData | null>(null);
  const [transitionRect, setTransitionRect] = useState<TransitionRect | null>(null);
  const [isFullScreenMounted, setIsFullScreenMounted] = useState<boolean>(false);
  const [hasStarted, setHasStarted] = useState<boolean>(false);
  const [lastTurnFailed, setLastTurnFailed] = useState<boolean>(false);
  const lastActionRef = useRef<
    | { type: 'goal'; goal: 'study' | 'training' | 'work' }
    | { type: 'message'; text: string }
    | { type: 'answer'; questionId: string; value: string | number | boolean }
    | { type: 'upload'; uploadId: string; fileName: string; kind: string }
    | null
  >(null);
  const [conversationState, setConversationState] = useState<'none' | 'running' | 'waiting_for_applicant' | 'idle'>('none');
  const [activePathway, setActivePathway] = useState<'study' | 'training' | 'work' | null>(() => {
    if (user?.targetPathway) {
      return user.targetPathway.toLowerCase() as any;
    }
    return null;
  });
  const [isGoalPending, setIsGoalPending] = useState<boolean>(false);
  const isGoalUpdatingRef = useRef<boolean>(false);
  const turnTimingRef = useRef<{ clientEventId?: string; startTime: number } | null>(null);

  const refreshConversationStatus = useCallback(async () => {
    try {
      const status = await api.getConversationStatus();
      if (status) {
        setHasStarted(Boolean(status.hasStarted));
        setConversationState(status.state || 'none');
        if (status.activePathway) {
          const p = status.activePathway.toLowerCase();
          if (p === 'study' || p === 'training' || p === 'work') {
            setActivePathway(p as any);
          }
        }
        if (status.state === 'running') {
          setIsAgentRunning(true);
        } else if (status.state === 'idle' || status.state === 'none') {
          setIsAgentRunning(false);
        }
        if (status.pendingQuestion) {
          setPendingQuestion(status.pendingQuestion);
        }
      }
    } catch (err) {
      console.warn('Could not fetch conversation status:', err);
    }
  }, []);

  useEffect(() => {
    refreshConversationStatus();
  }, [refreshConversationStatus, user]);

  useEffect(() => {
    if (user?.targetPathway) {
      setActivePathway(user.targetPathway.toLowerCase() as any);
    }
  }, [user?.targetPathway]);

  // SSE Stream cleanup ref
  const closeStreamRef = useRef<(() => void) | null>(null);

  // Replay UI events into message history
  const processUiEvent = useCallback((event: UiEventRecord) => {
    const { type, payload, seq } = event;

    switch (type) {
      case 'turn_started':
        setHasStarted(true);
        setLastTurnFailed(false);
        setConversationState('running');
        setIsAgentRunning(true);
        setCurrentAgentReason(payload.reason || 'Agent evaluating next action...');
        setCurrentIteration(0);
        setCurrentToolName('');
        break;

      case 'step_started':
        setHasStarted(true);
        setConversationState('running');
        setIsAgentRunning(true);
        setCurrentIteration(payload.iteration || 0);
        setCurrentAgentReason(payload.reason || 'Evaluating requirements and available tools...');
        break;

      case 'step_finished':
        setCurrentToolName(payload.tool_name || '');
        if (payload.outcome_summary) {
          setCurrentAgentReason(payload.outcome_summary);
        }
        break;

      case 'question': {
        setHasStarted(true);
        setConversationState('waiting_for_applicant');
        const qData: QuestionData = {
          question_id: payload.question_id,
          kind: payload.kind,
          prompt: payload.prompt,
          options: payload.options,
          field_key: payload.field_key,
          field_label: payload.field_label,
          reason: payload.reason,
          answered: false,
        };
        setPendingQuestion(qData);
        setMessages((prev) => {
          if (prev.some((m) => m.questionData?.question_id === payload.question_id)) {
            return prev;
          }
          return [
            ...prev,
            {
              id: `q-${payload.question_id || seq}`,
              sender: 'genie',
              text: payload.prompt,
              timestamp: Date.now(),
              questionData: qData,
            },
          ];
        });
        break;
      }

      case 'field_saved': {
        const isVerified = payload.status === 'VERIFIED';
        const prefix = isVerified ? 'Verified record saved' : 'Record saved';
        setMessages((prev) => [
          ...prev,
          {
            id: `field-${seq}-${Date.now()}`,
            sender: 'system',
            text: `${prefix}: ${payload.field_label || payload.field_key} = "${String(payload.value)}"`,
            timestamp: Date.now(),
            fieldSavedData: {
              field_key: payload.field_key,
              field_label: payload.field_label || payload.field_key,
              value: payload.value,
              status: payload.status,
            },
          },
        ]);
        break;
      }

      case 'conflict_found': {
        const conflictData = {
          conflictId: payload.conflict_id || `conf-${seq}`,
          fieldKey: payload.field_key,
          fieldLabel: payload.field_label || payload.field_key,
          oldValue: payload.old_value,
          newValue: payload.new_value,
          reason: payload.reason,
        };
        setMessages((prev) => [
          ...prev,
          {
            id: `conflict-${seq}`,
            sender: 'system',
            text: `Data conflict identified for ${payload.field_label || payload.field_key}. Please choose the authoritative value.`,
            timestamp: Date.now(),
            conflictData,
          },
        ]);
        break;
      }

      case 'qualification_result': {
        const displayStatus =
          payload.status === 'UNKNOWN' ? 'INCOMPLETE' : payload.status;
        const qualData: QualificationCardProps = {
          pathway: payload.pathway || 'study',
          status: displayStatus,
          reason: payload.reason,
          results: payload.results,
          missingFields: payload.missing_fields,
        };
        setMessages((prev) => [
          ...prev,
          {
            id: `qual-${seq}`,
            sender: 'genie',
            text: `Qualification Evaluation Complete: Pathway status is ${displayStatus}.`,
            timestamp: Date.now(),
            qualificationData: qualData,
          },
        ]);
        break;
      }

      case 'recommendation': {
        const actionLabel =
          payload.action ||
          (payload.steps && payload.steps[0]?.label) ||
          'Action Plan';
        const recData: RecommendationCardProps = {
          pathway: payload.pathway,
          action: actionLabel,
          steps: payload.steps || [],
          reason: payload.reason,
        };
        setMessages((prev) => [
          ...prev,
          {
            id: `rec-${seq}`,
            sender: 'genie',
            text: `Recommended Route: ${actionLabel}`,
            timestamp: Date.now(),
            recommendationData: recData,
          },
        ]);
        break;
      }

      case 'budget_low':
        setMessages((prev) => {
          if (prev.some((m) => m.id === `budget-${seq}`)) return prev;
          return [
            ...prev,
            {
              id: `budget-${seq}`,
              sender: 'system',
              text: `Notice: System daily evaluation request budget is running low (${payload.remaining_requests ?? 'few'} requests remaining).`,
              timestamp: Date.now(),
            },
          ];
        });
        break;

      case 'error':
        setIsAgentRunning(false);
        setLastTurnFailed(true);
        setConversationState('idle');
        setMessages((prev) => {
          if (prev.some((m) => m.id === `err-${seq}`)) return prev;
          return [
            ...prev,
            {
              id: `err-${seq}`,
              sender: 'system',
              text: `Error: ${payload.message || 'The assistant service is temporarily unreachable. Please try again shortly.'}`,
              timestamp: Date.now(),
              errorData: {
                code: payload.code || 'LLM_UNAVAILABLE',
                message: payload.message || 'The assistant service is temporarily unreachable. Please try again shortly.',
                retryable: payload.retryable !== false,
                reason: payload.reason,
              },
            },
          ];
        });
        break;

      case 'turn_finished':
        setIsAgentRunning(false);
        setCurrentAgentReason('');
        setConversationState((prev) => (prev === 'waiting_for_applicant' ? 'waiting_for_applicant' : 'idle'));
        if (turnTimingRef.current) {
          const totalSseTurnDurationMs = Math.round(performance.now() - turnTimingRef.current.startTime);
          console.log(
            `[TIMING] Total turn duration from client dispatch to final SSE turn_finished: ${totalSseTurnDurationMs}ms (stop_reason: ${payload.stop_reason})`,
          );
          turnTimingRef.current = null;
        }
        break;
    }
  }, []);

  // Connect SSE stream and load history whenever applicant/user is active
  useEffect(() => {
    if (!user) {
      if (closeStreamRef.current) {
        closeStreamRef.current();
        closeStreamRef.current = null;
      }
      resetChat();
      return;
    }

    // Reset messages and load this user's history fresh
    setMessages([]);
    setPendingQuestion(null);
    setCurrentAgentReason('');
    setIsAgentRunning(false);

    // 1. Fetch historical UI events from DB
    api.getHistory().then((res) => {
      if (res && Array.isArray(res.events) && res.events.length > 0) {
        setWelcomePlayed(true);
        // Process in chronological order
        res.events.forEach(processUiEvent);
      }
    }).catch((err) => {
      console.warn('Could not fetch events history:', err);
    });

    // 2. Open live SSE stream
    const closeStream = api.createEventStream((event) => {
      processUiEvent(event);
    }, (err) => {
      console.warn('SSE stream error / reconnection:', err);
    });

    closeStreamRef.current = closeStream;

    return () => {
      closeStream();
      closeStreamRef.current = null;
    };
  }, [user, processUiEvent]);

  // Ensure an authenticated session exists before dispatching events
  const ensureAuthenticated = useCallback(async () => {
    if (!isAuthenticated) {
      await quickStartGuest();
    }
  }, [isAuthenticated, quickStartGuest]);

  const triggerWelcomeMessage = useCallback(() => {
    setWelcomePlayed(true);
    setMessages((prev) => {
      if (prev.some((m) => m.text === WELCOME_MESSAGE_TEXT && m.sender === 'genie')) {
        return prev;
      }
      return [
        ...prev,
        {
          id: `welcome-${Date.now()}`,
          sender: 'genie',
          text: WELCOME_MESSAGE_TEXT,
          timestamp: Date.now(),
        },
      ];
    });
  }, []);

  const sendUserMessage = useCallback(async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;

    await ensureAuthenticated();
    setLastTurnFailed(false);
    lastActionRef.current = { type: 'message', text: trimmed };

    const client_event_id = `msg-${Date.now()}-${Math.random().toString(36).substring(7)}`;

    // Add immediate user message bubble
    const userMsg: ChatMessage = {
      id: client_event_id,
      sender: 'user',
      text: trimmed,
      timestamp: Date.now(),
    };
    setMessages((prev) => [...prev, userMsg]);

    // If there is an active pending question, treat this input as the answer!
    if (pendingQuestion && !pendingQuestion.answered) {
      const qId = pendingQuestion.question_id;
      setPendingQuestion(null);
      setConversationState('running');
      setMessages((prev) =>
        prev.map((m) =>
          m.questionData?.question_id === qId
            ? { ...m, questionData: { ...m.questionData, answered: true, selectedAnswer: trimmed } }
            : m
        )
      );
      try {
        await api.ingestEvent({
          client_event_id,
          type: 'answer',
          question_id: qId,
          value: trimmed,
        });
      } catch (err: any) {
        setMessages((prev) => [
          ...prev,
          {
            id: `err-${Date.now()}`,
            sender: 'system',
            text: `Could not send answer: ${err?.message || 'Server error'}`,
            timestamp: Date.now(),
          },
        ]);
      }
      return;
    }

    // Otherwise send normal message event
    try {
      setHasStarted(true);
      setConversationState('running');
      await api.ingestEvent({
        client_event_id,
        type: 'message',
        text: trimmed,
      });
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          sender: 'system',
          text: `Message dispatch error: ${err?.message || 'Server error'}`,
          timestamp: Date.now(),
        },
      ]);
    }
  }, [ensureAuthenticated, pendingQuestion]);

  const sendAnswer = useCallback(async (questionId: string, value: string | number | boolean) => {
    await ensureAuthenticated();
    setLastTurnFailed(false);
    lastActionRef.current = { type: 'answer', questionId, value };

    const client_event_id = `ans-${Date.now()}-${Math.random().toString(36).substring(7)}`;

    // Mark question as answered in state
    setConversationState('running');
    setMessages((prev) =>
      prev.map((m) =>
        m.questionData?.question_id === questionId
          ? { ...m, questionData: { ...m.questionData, answered: true, selectedAnswer: value } }
          : m
      )
    );
    if (pendingQuestion?.question_id === questionId) {
      setPendingQuestion(null);
    }

    // Add user answer bubble
    const answerLabel = typeof value === 'boolean' ? (value ? 'Yes, confirm' : 'No, change') : String(value);
    setMessages((prev) => [
      ...prev,
      {
        id: client_event_id,
        sender: 'user',
        text: answerLabel,
        timestamp: Date.now(),
      },
    ]);

    try {
      await api.ingestEvent({
        client_event_id,
        type: 'answer',
        question_id: questionId,
        value,
      });
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          sender: 'system',
          text: `Answer submission failed: ${err?.message || 'Server error'}`,
          timestamp: Date.now(),
        },
      ]);
    }
  }, [ensureAuthenticated, pendingQuestion]);

  const sendGoal = useCallback(async (goal: 'study' | 'training' | 'work', forceRetry = false) => {
    // 1. Prevent duplicate submission while already pending
    if (isGoalUpdatingRef.current || isGoalPending) {
      console.warn(`[ChatContext] Goal update already in flight. Ignoring duplicate call for "${goal}"`);
      return;
    }

    // 2. Prevent selecting an already-active pathway unless retrying a failed turn
    if (activePathway === goal && !forceRetry && !lastTurnFailed) {
      console.log(`[ChatContext] Pathway "${goal}" is already active. Ignoring redundant selection.`);
      return;
    }

    isGoalUpdatingRef.current = true;
    setIsGoalPending(true);
    setLastTurnFailed(false);
    lastActionRef.current = { type: 'goal', goal };

    try {
      await ensureAuthenticated();

      const client_event_id = `goal-${Date.now()}-${Math.random().toString(36).substring(7)}`;
      const goalLabel = goal === 'study' ? 'Study' : goal === 'training' ? 'Ausbildung' : 'Work';

      setMessages((prev) => [
        ...prev,
        {
          id: client_event_id,
          sender: 'user',
          text: `Target Pathway selected: ${goalLabel}`,
          timestamp: Date.now(),
        },
      ]);

      turnTimingRef.current = { clientEventId: client_event_id, startTime: performance.now() };

      await api.ingestEvent({
        client_event_id,
        type: 'goal',
        value: goal,
      });

      setActivePathway(goal);
      setHasStarted(true);
      setConversationState('running');
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          sender: 'system',
          text: `Goal update failed: ${err?.message || 'Server error'}`,
          timestamp: Date.now(),
        },
      ]);
    } finally {
      isGoalUpdatingRef.current = false;
      setIsGoalPending(false);
    }
  }, [ensureAuthenticated, activePathway, isGoalPending]);

  const sendUpload = useCallback(async (uploadId: string, fileName: string, kind: string) => {
    await ensureAuthenticated();
    setLastTurnFailed(false);
    lastActionRef.current = { type: 'upload', uploadId, fileName, kind };

    const client_event_id = `up-${Date.now()}-${Math.random().toString(36).substring(7)}`;

    setMessages((prev) => [
      ...prev,
      {
        id: client_event_id,
        sender: 'user',
        text: `Uploaded document: ${fileName} (${kind})`,
        timestamp: Date.now(),
      },
    ]);

    try {
      setHasStarted(true);
      setConversationState('running');
      await api.ingestEvent({
        client_event_id,
        type: 'upload',
        upload_id: uploadId,
      });
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          sender: 'system',
          text: `Document processing dispatch failed: ${err?.message || 'Server error'}`,
          timestamp: Date.now(),
        },
      ]);
    }
  }, [ensureAuthenticated]);

  const resolveConflict = useCallback(async (conflictId: string, choose: 'old' | 'new') => {
    await ensureAuthenticated();
    try {
      await api.resolveConflict(conflictId, choose);
      setMessages((prev) =>
        prev.map((m) =>
          m.conflictData?.conflictId === conflictId
            ? { ...m, conflictData: { ...m.conflictData, resolved: true, chosen: choose } as any }
            : m
        )
      );
    } catch (err: any) {
      console.warn('Conflict resolution error:', err);
    }
  }, [ensureAuthenticated]);

  const stopCurrentTurn = useCallback(async () => {
    try {
      await api.stopTurn();
      setIsAgentRunning(false);
      setCurrentAgentReason('Turn stopped by applicant.');
    } catch (err: any) {
      console.warn('Stop turn error:', err);
    }
  }, []);

  const retryLastAction = useCallback(async () => {
    setLastTurnFailed(false);
    setMessages((prev) => prev.filter((m) => !m.errorData && !m.text.startsWith('Error:')));
    const lastAction = lastActionRef.current;
    if (!lastAction) {
      if (activePathway) {
        await sendGoal(activePathway, true);
      }
      return;
    }
    if (lastAction.type === 'goal') {
      await sendGoal(lastAction.goal, true);
    } else if (lastAction.type === 'message') {
      await sendUserMessage(lastAction.text);
    } else if (lastAction.type === 'answer') {
      await sendAnswer(lastAction.questionId, lastAction.value);
    } else if (lastAction.type === 'upload') {
      await sendUpload(lastAction.uploadId, lastAction.fileName, lastAction.kind);
    }
  }, [activePathway, sendGoal, sendUserMessage, sendAnswer, sendUpload]);

  const runManualQualification = useCallback(async () => {
    await ensureAuthenticated();
    try {
      const res = await api.runQualification();
      if (res.qualification) {
        setMessages((prev) => [
          ...prev,
          {
            id: `qual-manual-${Date.now()}`,
            sender: 'genie',
            text: `Authoritative Qualification Result: ${res.qualification.overall}`,
            timestamp: Date.now(),
            qualificationData: {
              pathway: res.qualification.pathway,
              status: res.qualification.overall,
              results: res.qualification.grouped_results?.flatMap((g) => g.rules) || [],
              missingFields: res.qualification.missing_fields,
            },
          },
        ]);
      }
      if (res.route) {
        const actionLabel =
          res.route.message ||
          (res.route.steps && res.route.steps[0]?.label) ||
          'Action Plan';
        setMessages((prev) => [
          ...prev,
          {
            id: `rec-manual-${Date.now()}`,
            sender: 'genie',
            text: `Recommended Route: ${actionLabel}`,
            timestamp: Date.now(),
            recommendationData: {
              pathway: res.qualification.pathway,
              action: actionLabel,
              steps: res.route.steps,
            },
          },
        ]);
      }
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: `err-qual-${Date.now()}`,
          sender: 'system',
          text: `Qualification check failed: ${err?.message || 'Server error'}`,
          timestamp: Date.now(),
        },
      ]);
    }
  }, [ensureAuthenticated]);

  const startSession = useCallback((action: StartSessionAction) => {
    setPendingStartAction(action);
    try {
      if (typeof window !== 'undefined') {
        window.sessionStorage.setItem(STORAGE_KEY_PENDING_ACTION, JSON.stringify(action));
      }
    } catch {
      // Ignore
    }
    setWelcomePlayed(true);
  }, []);

  const consumePendingStartAction = useCallback((): StartSessionAction | null => {
    let action = pendingStartAction;
    if (!action && typeof window !== 'undefined') {
      try {
        const raw = window.sessionStorage.getItem(STORAGE_KEY_PENDING_ACTION);
        if (raw) action = JSON.parse(raw);
      } catch {
        // Ignore
      }
    }
    if (action) {
      setPendingStartAction(null);
      if (typeof window !== 'undefined') {
        window.sessionStorage.removeItem(STORAGE_KEY_PENDING_ACTION);
      }
    }
    return action;
  }, [pendingStartAction]);

  const startTransition = useCallback((rect?: TransitionRect | null) => {
    setTransitionRect(rect || null);
    setIsFullScreenMounted(false);
    setIsTransitioning(true);
  }, []);

  const endTransition = useCallback(() => {
    setIsTransitioning(false);
    setTransitionRect(null);
    setIsFullScreenMounted(false);
    if (typeof document !== 'undefined') {
      document.body.style.overflow = '';
    }
  }, []);

  const markFullScreenMounted = useCallback(() => {
    setIsFullScreenMounted(true);
  }, []);

  const resetChat = useCallback(() => {
    setMessages([]);
    setWelcomePlayed(false);
    setIsTransitioning(false);
    setIsTyping(false);
    setIsAgentRunning(false);
    setCurrentAgentReason('');
    setPendingQuestion(null);
    setTransitionRect(null);
    setIsFullScreenMounted(false);
    setPendingStartAction(null);
    setHasStarted(false);
    setConversationState('none');
    setActivePathway(null);
    setLastTurnFailed(false);
    lastActionRef.current = null;
  }, []);

  return (
    <ChatContext.Provider
      value={{
        messages,
        welcomePlayed,
        isTransitioning,
        isTyping,
        isAgentRunning,
        currentAgentReason,
        currentIteration,
        currentToolName,
        pendingQuestion,
        transitionRect,
        isFullScreenMounted,
        pendingStartAction,
        activePathway,
        isGoalPending,
        hasStarted,
        conversationState,
        refreshConversationStatus,
        triggerWelcomeMessage,
        sendUserMessage,
        sendAnswer,
        sendGoal,
        sendUpload,
        resolveConflict,
        stopCurrentTurn,
        runManualQualification,
        lastTurnFailed,
        retryLastAction,
        startSession,
        consumePendingStartAction,
        startTransition,
        endTransition,
        markFullScreenMounted,
        resetChat,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
