// src/components/Projects/EstimationGenerator.tsx

import React, { useState } from 'react';
import { estimationService } from '../../services/estimationService';
import type { GenerateEstimationDto, EstimationResponseDto, EstimationTaskDto } from '../../core/models/Estimation';
import Loader from '../Loader/Loader'; // Assuming Loader is a named export or default

interface EstimationGeneratorProps {
  projectId: string;
  documentId: string; // This needs to be selected by the user, but for now, we assume it's passed.
}

const EstimationGenerator: React.FC<EstimationGeneratorProps> = ({ projectId, documentId }) => {
  const [requirementText, setRequirementText] = useState<string>('');
  const [estimationResult, setEstimationResult] = useState<EstimationResponseDto | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setEstimationResult(null);
    setIsLoading(true);

    try {
      const payload: GenerateEstimationDto = {
        projectId,
        documentId, // In a real scenario, this would be user-selected
        requirementText,
      };
      const result = await estimationService.generateEstimation(payload);
      setEstimationResult(result);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const getConfidenceBadgeClass = (score: number) => {
    if (score < 50) return 'bg-red-500';
    if (score <= 80) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const SkeletonLoader = () => (
    <div className="animate-pulse space-y-4">
      <div className="h-4 bg-gray-300 rounded w-3/4"></div>
      <div className="h-4 bg-gray-300 rounded"></div>
      <div className="h-4 bg-gray-300 rounded w-5/6"></div>
      <div className="h-4 bg-gray-300 rounded"></div>
      <div className="h-4 bg-gray-300 rounded w-1/2"></div>
    </div>
  );

  return (
    <div className="p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-semibold mb-4">Generar Estimación Técnica</h2>

      <form onSubmit={handleSubmit} className="space-y-4 mb-6">
        <div>
          <label htmlFor="requirement" className="block text-sm font-medium text-gray-700">
            Requerimiento en Lenguaje Natural:
          </label>
          <textarea
            id="requirement"
            rows={5}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            value={requirementText}
            onChange={(e) => setRequirementText(e.target.value)}
            required
            placeholder="Ej: Necesito un login con Google y autenticación de doble factor."
          ></textarea>
        </div>
        <button
          type="submit"
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isLoading || !requirementText.trim()}
        >
          {isLoading ? (
            <>
              <Loader /> {/* Re-using the existing spinner, could be replaced with a custom small spinner if preferred */}
              <span className="ml-2">Generando...</span>
            </>
          ) : (
            'Generar Estimación'
          )}
        </button>
      </form>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <strong className="font-bold">Error:</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      )}

      {isLoading && <SkeletonLoader />}

      {estimationResult && (
        <div className="mt-8">
          <h3 className="text-xl font-semibold mb-3">Resumen de la Estimación:</h3>
          <p className="mb-4">{estimationResult.summary}</p>
          
          <div className="overflow-x-auto">
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
                    Horas Sugeridas
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Justificación
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {estimationResult.tasks.map((task: EstimationTaskDto, index: number) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{task.description}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{task.layer}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{task.hours}</td>
                    <td className="px-6 py-4 whitespace-pre-wrap text-sm text-gray-500 max-w-xs">{task.reason}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6 flex items-center space-x-4">
            <p className="text-md font-medium text-gray-700">Total Horas Estimadas: <span className="font-bold">{estimationResult.totalHours}</span></p>
            <div className={`px-3 py-1 rounded-full text-white text-sm font-semibold ${getConfidenceBadgeClass(estimationResult.confidenceScore)}`}>
              Confianza: {estimationResult.confidenceScore}%
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EstimationGenerator;
