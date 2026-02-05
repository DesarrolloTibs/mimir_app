export interface Requirement {
  id: string;
  projectId: string;
  title: string;
  originalText: string;
  status: string;
  createdAt: string;
}

export interface Project {
  id?: string;
  name: string;
  clientName: string;
  description: string | null;
  techStackContext: string;
  status: string;
  createdAt?: string;
  updatedAt?: string;
  createdById?: string | null;
  requirement?: Requirement;
}
