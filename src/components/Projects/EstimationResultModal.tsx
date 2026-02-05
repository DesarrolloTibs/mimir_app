import React from 'react';
import type { EstimationResponseDto } from '../../core/models/Estimation';
import Modal from '../Modal/Modal';
import EstimationTable from './EstimationTable';

interface EstimationResultModalProps {
  isOpen: boolean;
  onClose: () => void;
  estimationResult: EstimationResponseDto | null;
}

const EstimationResultModal: React.FC<EstimationResultModalProps> = ({ isOpen, onClose, estimationResult }) => {
  return (
    <Modal open={isOpen} onClose={onClose} title="Detalle de la Estimación">
      {estimationResult ? (
        <>
          <EstimationTable 
            summary={estimationResult.summary}
            tasks={estimationResult.tasks || []}
            totalHours={estimationResult.totalHours}
            confidenceScore={estimationResult.confidenceScore}
          />
          <div className="mt-4 flex justify-end">
             <button onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300">Cerrar</button>
          </div>
        </>
      ) : (
        <div className="text-center py-4 text-gray-500">No hay información de estimación disponible.</div>
      )}
    </Modal>
  );
};

export default EstimationResultModal;
