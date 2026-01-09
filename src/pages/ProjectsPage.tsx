import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';

import ProjectsTable from '../components/Projects/ProjectsTable';
import ProjectCreateModal from '../components/Projects/ProjectCreateModal';
import { createProject, getProjects } from '../services/projectsService';
import type { Project } from '../core/models/Project';
import Loader from '../components/Loader/Loader';
import EstimationGenerator from '../components/Projects/EstimationGenerator'; // Import EstimationGenerator
import Modal from '../components/Modal/Modal'; // Assuming a generic Modal component exists

const ProjectsPage: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // State for estimation
  const [selectedProjectForEstimationId, setSelectedProjectForEstimationId] = useState<string | null>(null);
  const [selectedDocumentForEstimationId, setSelectedDocumentForEstimationId] = useState<string | null>(null);
  const [isEstimationModalOpen, setIsEstimationModalOpen] = useState<boolean>(false);

  const fetchProjects = async () => {
    setPageLoading(true);
    try {
        const data = await getProjects();
        setProjects(data);
    } catch (error) {
        setError('No se pudieron cargar los proyectos');
    } finally {
        setPageLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  // Handlers for estimation
  const handleOpenEstimationModal = (projectId: string, documentId: string) => {
    setSelectedProjectForEstimationId(projectId);
    setSelectedDocumentForEstimationId(documentId);
    setIsEstimationModalOpen(true);
  };

  const handleCloseEstimationModal = () => {
    setSelectedProjectForEstimationId(null);
    setSelectedDocumentForEstimationId(null);
    setIsEstimationModalOpen(false);
  };

  const handleSubmitProject = async (projectData: Omit<Project, 'id' | 'createdAt'>) => {
    setIsLoading(true);
    setError(null);
    try {
      const newProject = await createProject(projectData);
      // Optimistic UI update
      setProjects(prevProjects => [newProject, ...prevProjects]);
      handleCloseModal();
    } catch (err) {
      setError('Failed to create project. Please try again.');
      // Using alert as a placeholder for the toast notification
      alert('Error: No se pudo crear el proyecto.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Proyectos</h1>
        <button
          onClick={handleOpenModal}
          className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 flex items-center"
        >
          <Plus size={20} className="mr-2" />
          Nuevo Proyecto
        </button>
      </div>

      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
        <span className="block sm:inline">{error}</span>
      </div>}

      {pageLoading ? <Loader /> : <ProjectsTable projects={projects} onSelectProjectAndDocumentForEstimation={handleOpenEstimationModal} />}

      <ProjectCreateModal
        open={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmitProject}
        isLoading={isLoading}
      />

      {/* Estimation Modal */}
      {isEstimationModalOpen && selectedProjectForEstimationId && selectedDocumentForEstimationId && (
        <Modal open={isEstimationModalOpen} onClose={handleCloseEstimationModal} title="Generar Estimación">
          <EstimationGenerator
            projectId={selectedProjectForEstimationId}
            documentId={selectedDocumentForEstimationId}
          />
        </Modal>
      )}
    </div>
  );
};

export default ProjectsPage;

