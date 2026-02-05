// src/components/Projects/EstimationGenerator.tsx

import React, { useState } from 'react';
import { estimationService } from '../../services/estimationService';
import type { GenerateEstimationDto, EstimationResponseDto } from '../../core/models/Estimation';
import Loader from '../Loader/Loader';
import EstimationTable from './EstimationTable';

interface EstimationGeneratorProps {
  projectId: string;
  documentId: string;
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
        documentId,
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
              <Loader />
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
           <EstimationTable 
            summary={estimationResult.summary}
            tasks={estimationResult.tasks}
            totalHours={estimationResult.totalHours}
            confidenceScore={estimationResult.confidenceScore}
           />
        </div>
      )}
    </div>
  );
};

export default EstimationGenerator;
