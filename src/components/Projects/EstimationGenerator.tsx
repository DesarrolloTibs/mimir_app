import React, { useState } from 'react';
import { estimationService } from '../../services/estimationService';
import type { GenerateEstimationDto, EstimationResponseDto } from '../../core/models/Estimation';
import { Sparkles, Loader2, Bot } from 'lucide-react';
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
        requirementText: requirementText.trim() || undefined,
      };
      const result = await estimationService.generateEstimation(payload);
      setEstimationResult(result);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Ocurrió un error inesperado al consultar a Mimir.');
    } finally {
      setIsLoading(false);
    }
  };

  const SkeletonLoader = () => (
    <div className="animate-pulse space-y-4 mt-8">
      <div className="flex items-center space-x-3 mb-6">
        <Loader2 className="animate-spin text-indigo-500" size={24} />
        <span className="text-indigo-600 font-medium">Mimir está analizando el documento y estructurando las tareas técnicas... Esto puede tomar un minuto.</span>
      </div>
      <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
      <div className="h-4 bg-gray-200 rounded w-full mb-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 bottom-0 left-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-shimmer"></div>
      </div>

      <div className="border rounded-lg overflow-hidden border-indigo-100 shadow-sm">
        <div className="bg-indigo-50 px-6 py-3 border-b border-indigo-100 flex space-x-4">
          <div className="h-4 bg-indigo-200 rounded w-1/3"></div>
          <div className="h-4 bg-indigo-200 rounded w-1/6"></div>
          <div className="h-4 bg-indigo-200 rounded w-1/6"></div>
          <div className="h-4 bg-indigo-200 rounded w-1/3"></div>
        </div>
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="px-6 py-4 flex space-x-4 border-b border-gray-100 bg-white items-center">
            <div className="h-4 bg-gray-200 rounded w-1/3"></div>
            <div className="h-4 bg-gray-200 rounded w-1/6"></div>
            <div className="h-4 bg-gray-200 rounded w-1/6"></div>
            <div className="h-4 bg-gray-200 rounded w-1/3"></div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="bg-transparent">
      {!estimationResult && !isLoading && (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-5">
            <div className="flex items-start mb-4">
              <Bot className="text-indigo-500 mr-3 mt-1" size={24} />
              <div>
                <h4 className="text-sm font-semibold text-gray-900">Contexto Analítico Opcional</h4>
                <p className="text-xs text-gray-500 mt-1">
                  Mimir leerá automáticamente el documento de requerimientos asociado. Si lo deseas, puedes proveer instrucciones adicionales, como "Enfocáte especialmente en la arquitectura de base de datos" o "Ignora la fase de diseño UI".
                </p>
              </div>
            </div>
            <label htmlFor="requirement" className="sr-only">Instrucciones o contexto adicional (Opcional):</label>
            <textarea
              id="requirement"
              rows={3}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm resize-y"
              value={requirementText}
              onChange={(e) => setRequirementText(e.target.value)}
              placeholder="Instrucciones adicionales para la IA (Opcional)..."
            ></textarea>
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className="inline-flex items-center justify-center py-2.5 px-6 border border-transparent shadow-md text-sm font-semibold rounded-lg text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:-translate-y-0.5"
              disabled={isLoading}
            >
              <Sparkles size={18} className="mr-2" />
              Generar con Mimir
            </button>
          </div>
        </form>
      )}

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-md mt-4" role="alert">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" /></svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium">{error}</p>
            </div>
          </div>
        </div>
      )}

      {isLoading && <SkeletonLoader />}

      {estimationResult && (
        <div className="mt-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-100">
            <div className="flex items-center text-green-600 bg-green-50 px-3 py-1 rounded-full text-sm font-medium border border-green-200">
              <Sparkles size={16} className="mr-1.5" />
              Mimir completó el análisis con éxito
            </div>
            <button
              onClick={() => {
                setEstimationResult(null);
                setRequirementText(''); // Reset state to allow generating another
              }}
              className="text-indigo-600 hover:text-indigo-800 text-sm font-medium hover:underline"
            >
              Nueva Estimación
            </button>
          </div>
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
