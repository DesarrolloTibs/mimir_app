import axiosInstance from '../core/axios/axiosInstance';
import { DOCUMENTS } from '../global/endpoints';
import type { Document } from '../core/models/Document';

export const getDocumentsByProjectId = async (projectId: string): Promise<Document[]> => {
  const response = await axiosInstance.get<Document[]>(DOCUMENTS.DOCUMENTS_BY_PROJECT(projectId));
  return response.data;
};

export const uploadDocuments = async (projectId: string, files: File[]): Promise<Document[]> => {

  const formData = new FormData();

  files.forEach(file => {

    formData.append('file', file);

  });

  const response = await axiosInstance.post<Document[]>(DOCUMENTS.UPLOAD(projectId), formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const deleteDocument = async (documentId: string): Promise<void> => {
  await axiosInstance.delete(DOCUMENTS.DOCUMENTS + `/${documentId}`);
};
