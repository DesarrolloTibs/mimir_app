import React from 'react';
import type { EstimationTaskDto } from '../../core/models/Estimation';

interface EstimationTableProps {
  summary: string;
  tasks: EstimationTaskDto[];
  totalHours: number;
  confidenceScore: number;
}

const EstimationTable: React.FC<EstimationTableProps> = ({ summary, tasks, totalHours, confidenceScore }) => {
  const getConfidenceBadgeClass = (score: number) => {
    if (score < 50) return 'bg-red-500';
    if (score <= 80) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return (
    <div className="mt-2">
      <h3 className="text-xl font-semibold mb-3">Resumen:</h3>
      <p className="mb-4 text-gray-700">{summary || 'Sin resumen disponible'}</p>
      
      <div className="overflow-x-auto border rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tarea
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Capa
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Horas
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Justificación
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {(tasks || []).map((task, index) => (
              <tr key={index}>
                <td className="px-6 py-4 text-sm font-medium text-gray-900">{task.description}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{task.layer}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{task.hours}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{task.reason}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 flex items-center space-x-4">
        <p className="text-md font-medium text-gray-700">Total Horas: <span className="font-bold">{totalHours}</span></p>
        <div className={`px-3 py-1 rounded-full text-white text-sm font-semibold ${getConfidenceBadgeClass(confidenceScore)}`}>
          Confianza: {confidenceScore}%
        </div>
      </div>
    </div>
  );
};

export default EstimationTable;
