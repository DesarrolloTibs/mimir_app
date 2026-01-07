import React from 'react';
import type { Project } from '../../core/models/Project';
import { Inbox } from 'lucide-react';

interface Props {
  projects: Project[];
}

const ProjectsTable: React.FC<Props> = ({ projects }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border-separate" style={{ borderSpacing: '0 0.75rem' }}>
        <thead>
          <tr>
            <th className="p-4 text-left text-sm font-semibold text-gray-500 uppercase tracking-wider">Nombre del Proyecto</th>
            <th className="p-4 text-left text-sm font-semibold text-gray-500 uppercase tracking-wider">Cliente</th>
            <th className="p-4 text-left text-sm font-semibold text-gray-500 uppercase tracking-wider">Tech Stack</th>
            <th className="p-4 text-left text-sm font-semibold text-gray-500 uppercase tracking-wider">Fecha de Creación</th>
          </tr>
        </thead>
        <tbody>
          {projects.length > 0 ? (
            projects.map(project => (
              <tr key={project.id} className="bg-white shadow-sm rounded-lg transition-all hover:shadow-md hover:-translate-y-px">
                <td className="p-4 rounded-l-lg font-semibold text-gray-900">{project.name}</td>
                <td className="p-4 text-gray-700">{project.client}</td>
                <td className="p-4 text-gray-700">{project.techStack}</td>
                <td className="p-4 rounded-r-lg text-gray-700">{project.createdAt ? new Date(project.createdAt).toLocaleDateString() : '-'}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={4} className="text-center py-16">
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
    </div>
  );
};

export default ProjectsTable;
