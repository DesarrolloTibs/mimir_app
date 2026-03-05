import React from 'react';
import type { EstimationResponseDto } from '../../core/models/Estimation';
// Usaremos un contendor adaptado sin invocar al Modal genérico si el genérico no permite sobreescritura fácil de ancho.
// Pero asumiendo que Modal recibe prop width o clashing CSS, lo mejor es emular un modal con ancho de pantalla grande (max-w-7xl)
import { X } from 'lucide-react';
import EstimationTable from './EstimationTable';

interface EstimationResultModalProps {
  isOpen: boolean;
  onClose: () => void;
  estimationResult: EstimationResponseDto | null;
}

const EstimationResultModal: React.FC<EstimationResultModalProps> = ({ isOpen, onClose, estimationResult }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm p-4 sm:p-6 lg:p-8">
      {/* 
        This is the large modal container 
        We use w-full and max-w-6xl for extremely wide screens, providing plenty of room for editing/tables
      */}
      <div
        className="bg-gray-50 rounded-xl shadow-2xl flex flex-col w-full max-w-6xl max-h-[90vh] overflow-hidden transform transition-all"
        role="dialog"
        aria-modal="true"
      >
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200 bg-white">
          <h3 className="text-xl font-bold text-gray-900">
            {/* If we have a title from history use it, else generic */}
            {estimationResult && 'title' in estimationResult ? (estimationResult as EstimationResponseDto & { title?: string }).title : 'Detalle de la Estimación'}
          </h3>
          <button
            title="Cerrar modal"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-2 rounded-full transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Scrollable Content Area */}
        <div className="p-6 overflow-y-auto overflow-x-hidden flex-1">
          {estimationResult ? (
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <EstimationTable
                summary={estimationResult.summary}
                tasks={estimationResult.tasks || []}
                totalHours={estimationResult.totalHours}
                confidenceScore={estimationResult.confidenceScore}
              />
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500 flex flex-col items-center">
              <p className="text-lg">Cargando información de estimación...</p>
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="px-6 py-4 bg-gray-100 border-t border-gray-200 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-white border border-gray-300 shadow-sm text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cerrar Panel
          </button>
        </div>
      </div>
    </div>
  );
};

export default EstimationResultModal;
