import React from 'react';
import Modal from '../Modal/Modal';
import EstimationHistory from './EstimationHistory';

interface EstimationHistoryModalProps {
    isOpen: boolean;
    onClose: () => void;
    projectId: string;
}

const EstimationHistoryModal: React.FC<EstimationHistoryModalProps> = ({ isOpen, onClose, projectId }) => {
    return (
        <Modal open={isOpen} onClose={onClose} title="Historial de Estimaciones">
            <div className="max-h-[70vh] overflow-y-auto">
                <EstimationHistory projectId={projectId} />
            </div>
        </Modal>
    );
};

export default EstimationHistoryModal;
