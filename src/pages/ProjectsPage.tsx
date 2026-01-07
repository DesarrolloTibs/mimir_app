import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';

import ProjectsTable from '../components/Projects/ProjectsTable';
import ProjectCreateModal from '../components/Projects/ProjectCreateModal';
import { createProject } from '../services/projectsService';
import type { Project } from '../core/models/Project';

// Mock function to get projects, will be replaced by a service call
async function getProjects(): Promise<Project[]> {
  // In a real app, this would fetch from an API
  return Promise.resolve([]);
}

const ProjectsPage: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // In a real implementation, you would fetch the projects here.
    // For now, we start with an empty list.
    // getProjects().then(setProjects);
  }, []);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

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

      <ProjectsTable projects={projects} />

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
