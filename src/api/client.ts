import {
  ApplicantEventInput,
  ApplicantProfileResponse,
  ConversationStatusResponse,
  QualificationRunResponse,
  UiEventRecord,
  UiEventType,
  UploadMetadata,
  UserProfileResponse,
  UserResponse,
} from './types';

const TOKEN_STORAGE_KEY = 'lotse_jwt_token';

class ApiClient {
  private token: string | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem(TOKEN_STORAGE_KEY);
    }
  }

  setToken(token: string | null) {
    this.token = token;
    if (typeof window !== 'undefined') {
      if (token) {
        localStorage.setItem(TOKEN_STORAGE_KEY, token);
      } else {
        localStorage.removeItem(TOKEN_STORAGE_KEY);
      }
    }
  }

  getToken(): string | null {
    return this.token;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const headers = new Headers(options.headers || {});
    if (this.token && !headers.has('Authorization')) {
      headers.set('Authorization', `Bearer ${this.token}`);
    }
    if (!(options.body instanceof FormData) && !headers.has('Content-Type')) {
      headers.set('Content-Type', 'application/json');
    }

    const res = await fetch(endpoint, {
      ...options,
      headers,
      credentials: 'include', // Ensures HTTP-only cookies are sent and received
    });

    if (!res.ok) {
      if (res.status === 401) {
        this.setToken(null);
      }
      let errorMessage = `HTTP Error ${res.status}`;
      try {
        const errorJson = await res.json();
        if (errorJson.message) {
          errorMessage = Array.isArray(errorJson.message)
            ? errorJson.message.join(', ')
            : errorJson.message;
        } else if (errorJson.error) {
          errorMessage = errorJson.error;
        }
      } catch {
        // Fallback to text
        const text = await res.text().catch(() => '');
        if (text) errorMessage = text;
      }
      const err = new Error(errorMessage);
      (err as any).status = res.status;
      throw err;
    }

    if (res.status === 204 || res.headers.get('content-length') === '0') {
      return {} as T;
    }

    return res.json();
  }

  // --- Auth Endpoints ---

  async register(email: string, password: string): Promise<UserResponse> {
    const res = await this.request<UserResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    return res;
  }

  async login(email: string, password: string): Promise<UserResponse> {
    const res = await this.request<UserResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    return res;
  }

  async logout(): Promise<{ message: string }> {
    this.setToken(null);
    return this.request<{ message: string }>('/auth/logout', {
      method: 'POST',
    });
  }

  async getMe(): Promise<UserProfileResponse> {
    return this.request<UserProfileResponse>('/auth/me');
  }

  // --- Applicant Endpoints ---

  async getProfile(): Promise<ApplicantProfileResponse> {
    return this.request<ApplicantProfileResponse>('/applicant/profile');
  }

  async updatePathway(target_pathway: 'study' | 'training' | 'work'): Promise<{ target_pathway: string }> {
    return this.request<{ target_pathway: string }>('/applicant/pathway', {
      method: 'PATCH',
      body: JSON.stringify({ target_pathway }),
    });
  }

  async resolveConflict(
    conflictId: string,
    choose: 'old' | 'new',
  ): Promise<{ success: boolean; chosen: 'old' | 'new'; field_key: string }> {
    return this.request<{ success: boolean; chosen: 'old' | 'new'; field_key: string }>(
      `/applicant/conflicts/${conflictId}/resolve`,
      {
        method: 'POST',
        body: JSON.stringify({ choose }),
      },
    );
  }

  async runQualification(): Promise<QualificationRunResponse> {
    return this.request<QualificationRunResponse>('/applicant/qualification/run', {
      method: 'POST',
    });
  }

  // --- Uploads Endpoints ---

  async uploadFile(file: File, kind: string = 'degree'): Promise<UploadMetadata> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('kind', kind);

    return this.request<UploadMetadata>('/uploads', {
      method: 'POST',
      body: formData,
    });
  }

  async listUploads(): Promise<UploadMetadata[]> {
    return this.request<UploadMetadata[]>('/uploads');
  }

  // --- Events Endpoints ---

  async ingestEvent(event: ApplicantEventInput): Promise<{ turn_id: string | null; seq: number }> {
    const t0 = performance.now();
    const res = await this.request<{ turn_id: string | null; seq: number }>('/events', {
      method: 'POST',
      body: JSON.stringify(event),
    });
    const frontendToApiMs = Math.round(performance.now() - t0);
    console.log(`[TIMING] Frontend event "${event.type}" submission to API response: ${frontendToApiMs}ms (turn_id: ${res.turn_id})`);
    return res;
  }

  async getHistory(): Promise<{ events: UiEventRecord[] }> {
    return this.request<{ events: UiEventRecord[] }>('/events/history');
  }

  async getConversationStatus(): Promise<ConversationStatusResponse> {
    return this.request<ConversationStatusResponse>('/events/status');
  }

  async stopTurn(): Promise<{ cancelled: boolean; turn_id?: string | null }> {
    return this.request<{ cancelled: boolean; turn_id?: string | null }>('/events/stop', {
      method: 'POST',
    });
  }

  // --- SSE Stream Helper ---

  createEventStream(
    onEvent: (event: UiEventRecord) => void,
    onError?: (err: any) => void,
  ): () => void {
    const eventSource = new EventSource('/events/stream', {
      withCredentials: true,
    });

    const handleMessage = (e: MessageEvent) => {
      try {
        if (!e.data) return;
        const parsed = JSON.parse(e.data) as UiEventRecord;
        if ((parsed as any).type === 'ping') return;
        onEvent(parsed);
      } catch (err) {
        console.warn('Could not parse SSE message:', e.data, err);
      }
    };

    // Standard onmessage handles unnamed events
    eventSource.onmessage = handleMessage;

    // Browser EventSource requires explicit listeners for named events
    const eventTypes: UiEventType[] = [
      'turn_started',
      'step_started',
      'step_finished',
      'question',
      'field_saved',
      'conflict_found',
      'qualification_result',
      'recommendation',
      'budget_low',
      'error',
      'turn_finished',
    ];

    eventTypes.forEach((evtType) => {
      eventSource.addEventListener(evtType, handleMessage as EventListener);
    });

    eventSource.onerror = (e) => {
      if (onError) onError(e);
    };

    return () => {
      eventTypes.forEach((evtType) => {
        eventSource.removeEventListener(evtType, handleMessage as EventListener);
      });
      eventSource.close();
    };
  }
}

export const api = new ApiClient();
