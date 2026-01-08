import React, { useState } from 'react';
import type { Project } from '../../core/models/Project';
import { Inbox, UploadCloud } from 'lucide-react';
import DocumentUploadModal from '../Documents/DocumentUploadModal';
import DocumentsTable from '../Documents/DocumentsTable';
import { uploadDocuments, getDocumentsByProjectId, deleteDocument } from '../../services/documentService';
import type { Document } from '../../core/models/Document';
import Notification from '../Modal/Notification';

interface Props {
  projects: Project[];
}

const ProjectsTable: React.FC<Props> = ({ projects }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [expandedProjectId, setExpandedProjectId] = useState<string | null>(null);
  const [notification, setNotification] = useState<{
    show: boolean;
    type: 'success' | 'error';
    title: string;
    message: string;
  } | null>(null);

  const handleOpenModal = (project: Project) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedProject(null);
    setIsModalOpen(false);
  };

  const handleUpload = async (files: File[]) => {
    if (!selectedProject || !selectedProject.id) return;
    setIsLoading(true);
    try {
      await uploadDocuments(selectedProject.id, files);
      const fetchedDocuments = await getDocumentsByProjectId(selectedProject.id);
      setDocuments(fetchedDocuments);
      setNotification({
        show: true,
        type: 'success',
        title: 'Éxito',
        message: 'Documentos subidos correctamente.',
      });
    } catch (error) {
      console.error('Failed to upload documents', error);
      setNotification({
        show: true,
        type: 'error',
        title: 'Error',
        message: 'Hubo un error al subir los documentos.',
      });
    } finally {
      setIsLoading(false);
      handleCloseModal();
    }
  };

  const handleDeleteDocument = async (documentId: string) => {
    try {
      await deleteDocument(documentId);
      setDocuments(prev => prev.filter(doc => doc.id !== documentId));
      setNotification({
        show: true,
        type: 'success',
        title: 'Éxito',
        message: 'Documento eliminado correctamente.',
      });
    } catch (error) {
      console.error('Failed to delete document', error);
      setNotification({
        show: true,
        type: 'error',
        title: 'Error',
        message: 'Hubo un error al eliminar el documento.',
      });
    }
  };

  const toggleDocuments = async (projectId: string) => {
    if (expandedProjectId === projectId) {
      setExpandedProjectId(null);
    } else {
      try {
        const fetchedDocuments = await getDocumentsByProjectId(projectId);
        setDocuments(fetchedDocuments);
        setExpandedProjectId(projectId);
      } catch (error) {
        console.error('Failed to fetch documents', error);
      }
    }
  };

  return (
    <div className="overflow-x-auto">
      {notification && (
        <Notification
          show={notification.show}
          type={notification.type}
          title={notification.title}
          message={notification.message}
          onConfirm={() => setNotification(null)}
        />
      )}
      <table className="min-w-full border-separate" style={{ borderSpacing: '0 0.75rem' }}>
        <thead>
          <tr>
            <th className="p-4 text-left text-sm font-semibold text-gray-500 uppercase tracking-wider"></th>
            <th className="p-4 text-left text-sm font-semibold text-gray-500 uppercase tracking-wider">Nombre del Proyecto</th>
            <th className="p-4 text-left text-sm font-semibold text-gray-500 uppercase tracking-wider">Cliente</th>
            <th className="p-4 text-left text-sm font-semibold text-gray-500 uppercase tracking-wider">Tech Stack</th>
            <th className="p-4 text-left text-sm font-semibold text-gray-500 uppercase tracking-wider">Fecha de Creación</th>
            <th className="p-4 text-left text-sm font-semibold text-gray-500 uppercase tracking-wider">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {projects.length > 0 ? (
            projects.map(project => (
              <React.Fragment key={project.id}>
                <tr className="bg-white shadow-sm rounded-lg transition-all hover:shadow-md hover:-translate-y-px">
                  <td className="p-4 rounded-l-lg">
                    <button
                      onClick={() => project.id && toggleDocuments(project.id)}
                      className="text-indigo-600 hover:text-indigo-900"
                      disabled={!project.id}
                    >
                      {expandedProjectId === project.id ? '▼' : '►'}
                    </button>
                  </td>
                  <td className="p-4 font-semibold text-gray-900">{project.name}</td>
                  <td className="p-4 text-gray-700">{project.client}</td>
                  <td className="p-4 text-gray-700">{project.techStack}</td>
                  <td className="p-4 text-gray-700">{project.createdAt ? new Date(project.createdAt).toLocaleDateString() : '-'}</td>
                  <td className="p-4 rounded-r-lg">
                    <button onClick={() => handleOpenModal(project)} className="text-indigo-600 hover:text-indigo-900">
                      <UploadCloud size={20} />
                    </button>
                  </td>
                </tr>
                {expandedProjectId === project.id && (
                  <tr>
                    <td colSpan={6} className="p-4 bg-gray-50">
                      <DocumentsTable documents={documents} onDelete={handleDeleteDocument} />
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))
          ) : (
            <tr>
              <td colSpan={6} className="text-center py-16">
                <div className="flex flex-col items-center text-gray-500">
                  <Inbox size={48} className="mb-4" />
                  <h3 className="text-xl font-semibold">No se encontraron proyectos</h3>
                  <p className="text-sm">Crea un nuevo proyecto para comenzar.</p>
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>
      {selectedProject && (
        <DocumentUploadModal
          open={isModalOpen}
          onClose={handleCloseModal}
          onUpload={handleUpload}
          isLoading={isLoading}
        />
      )}
    </div>
  );
};

export default ProjectsTable;
