import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import ProjectsTable from '../components/Projects/ProjectsTable';
import ProjectCreateModal from '../components/Projects/ProjectCreateModal';
import { createProject, getProjects } from '../services/projectsService';
import type { Project } from '../core/models/Project';
import Loader from '../components/Loader/Loader';

const ProjectsPage: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProjects = async () => {
    setPageLoading(true);
    try {
      const data = await getProjects();
      setProjects(data);
    } catch {
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

  const handleSubmitProject = async (projectData: Omit<Project, 'id' | 'createdAt'>) => {
    setIsLoading(true);
    setError(null);
    try {
      const newProject = await createProject(projectData);
      setProjects(prevProjects => [newProject, ...prevProjects]);
      handleCloseModal();
    } catch {
      setError('Failed to create project. Please try again.');
      alert('Error: No se pudo crear el proyecto.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Proyectos</h1>
          <p className="text-sm text-gray-500 mt-1">Selecciona un proyecto para abrir el espacio de trabajo.</p>
        </div>
        <button
          onClick={handleOpenModal}
          className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 flex items-center transition-colors shadow-sm"
        >
          <Plus size={20} className="mr-2" />
          Nuevo Proyecto
        </button>
      </div>

      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
        <span className="block sm:inline">{error}</span>
      </div>}

      {pageLoading ? <Loader /> : (
        <ProjectsTable projects={projects} />
      )}

      <ProjectCreateModal
        open={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmitProject}
        isLoading={isLoading}
      />
    </div>
  );
};

export default ProjectsPage;

