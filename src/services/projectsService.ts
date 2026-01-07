import axiosInstance from '../core/axios/axiosInstance';
import { PROJECTS } from '../global/endpoints';
import type { Project } from '../core/models/Project';

export async function createProject(project: Omit<Project, 'id' | 'createdAt'>): Promise<Project> {
    const response = await axiosInstance.post(PROJECTS.PROJECTS, project);
    return response.data;
}
