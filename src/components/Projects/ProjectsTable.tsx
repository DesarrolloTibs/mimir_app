import React from 'react';
import type { Project } from '../../core/models/Project';
import { ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Props {
  projects: Project[];
}

const ProjectsTable: React.FC<Props> = ({ projects }) => {
  const navigate = useNavigate();

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border-separate" style={{ borderSpacing: '0 0.75rem' }}>
        <thead>
          <tr>
            <th className="p-4 text-left text-sm font-semibold text-gray-500 uppercase tracking-wider pl-6">Nombre del Proyecto</th>
            <th className="p-4 text-left text-sm font-semibold text-gray-500 uppercase tracking-wider">Cliente</th>
            <th className="p-4 text-left text-sm font-semibold text-gray-500 uppercase tracking-wider">Tech Stack</th>
            <th className="p-4 text-left text-sm font-semibold text-gray-500 uppercase tracking-wider">Fecha de Creación</th>
            <th className="p-4 text-right text-sm font-semibold text-gray-500 uppercase tracking-wider pr-6"></th>
          </tr>
        </thead>
        <tbody>
          {projects.length > 0 ? (
            projects.map(project => (
              <tr
                key={project.id}
                className="bg-white shadow-sm rounded-lg transition-all hover:shadow-md hover:-translate-y-px cursor-pointer hover:ring-1 hover:ring-indigo-300"
                onClick={() => project.id && navigate(`/projects/${project.id}`)}
              >
                <td className="p-4 font-semibold text-gray-900 rounded-l-lg pl-6">{project.name}</td>
                <td className="p-4 text-gray-700">{project.clientName}</td>
                <td className="p-4 text-gray-700 truncate max-w-xs">{project.techStackContext}</td>
                <td className="p-4 text-gray-500 text-sm">{project.createdAt ? new Date(project.createdAt).toLocaleDateString() : '-'}</td>
                <td className="p-4 text-right rounded-r-lg text-gray-400 pr-6">
                  <ChevronRight size={20} className="inline-block" />
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={5} className="text-center py-16 bg-white rounded-lg shadow-sm">
                <div className="flex flex-col items-center text-gray-500">
                  <h3 className="text-xl font-semibold mb-2">No se encontraron proyectos</h3>
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
