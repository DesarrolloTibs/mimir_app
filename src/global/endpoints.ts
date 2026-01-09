const urlBase = import.meta.env.VITE_BASE_URL+'/api/';

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
};

