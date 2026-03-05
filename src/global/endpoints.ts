const urlBase = import.meta.env.VITE_BASE_URL + '/api/';

export const auth = {
    LOGIN: urlBase + 'auth/login'
};

export const USERS = {
    USERS: urlBase + 'users',
};

export const PROJECTS = {
    PROJECTS: urlBase + 'projects',
};

export const DOCUMENTS = {
    DOCUMENTS: urlBase + 'documents',
    DOCUMENTS_BY_PROJECT: (projectId: string) => `${urlBase}projects/${projectId}/documents`,
    UPLOAD: (projectId: string) => `${urlBase}projects/${projectId}/documents/upload`
};

export const ESTIMATIONS = {
    GENERATE: urlBase + 'estimations/generate',
    GET_BY_REQUIREMENT: (requirementId: string) => `${urlBase}estimations/requirement/${requirementId}`,
    GET_BY_PROJECT: (projectId: string) => `${urlBase}estimations/project/${projectId}`,
};

export const CHAT = {
    MESSAGE: urlBase + 'chat/message',
    SESSIONS_BY_PROJECT: (projectId: string) => `${urlBase}chat/sessions/project/${projectId}`,
    MESSAGES_BY_SESSION: (sessionId: string) => `${urlBase}chat/sessions/${sessionId}/messages`,
};

