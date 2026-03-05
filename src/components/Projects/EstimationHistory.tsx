import React, { useEffect, useState } from 'react';
import { estimationService } from '../../services/estimationService';
import Loader from '../Loader/Loader';
import type { EstimationResponseDto } from '../../core/models/Estimation';
import { Clock, CheckCircle, AlertTriangle, FileText } from 'lucide-react';
import EstimationResultModal from './EstimationResultModal';

interface EstimationItem extends EstimationResponseDto {
    id: string;
    projectId: string;
    title: string;
    status: string;
    createdAt: string;
}

interface EstimationHistoryProps {
    projectId: string;
}

const EstimationHistory: React.FC<EstimationHistoryProps> = ({ projectId }) => {
    const [estimations, setEstimations] = useState<EstimationItem[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [selectedEstimation, setSelectedEstimation] = useState<EstimationItem | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const fetchHistory = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const data = await estimationService.getProjectEstimations(projectId);
                setEstimations(data);
            } catch (err: any) {
                setError(err.message || 'Error al cargar el historial de estimaciones');
            } finally {
                setIsLoading(false);
            }
        };
        fetchHistory();
    }, [projectId]);

    const handleCardClick = (estimation: EstimationItem) => {
        setSelectedEstimation(estimation);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setTimeout(() => setSelectedEstimation(null), 300); // keep data for closing animation
    };

    if (isLoading) return <Loader />;
    if (error) return <div className="text-red-500 bg-red-50 p-4 rounded-md border border-red-200">{error}</div>;
    if (!estimations || estimations.length === 0) return (
        <div className="flex flex-col items-center justify-center p-8 text-gray-500 bg-gray-50 rounded-lg border border-dashed border-gray-300">
            <FileText size={48} className="text-gray-400 mb-4" />
            <p className="text-lg font-medium">No hay estimaciones previas para este proyecto.</p>
            <p className="text-sm">Genera una nueva estimación desde un documento de requerimientos subido.</p>
        </div>
    );

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {estimations.map((estimation) => {
                    const confidenceColor =
                        estimation.confidenceScore > 80 ? 'text-green-600 bg-green-50 border-green-200' :
                            estimation.confidenceScore > 50 ? 'text-yellow-600 bg-yellow-50 border-yellow-200' :
                                'text-red-600 bg-red-50 border-red-200';

                    return (
                        <div
                            key={estimation.id}
                            onClick={() => handleCardClick(estimation)}
                            className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md hover:border-indigo-300 hover:ring-1 hover:ring-indigo-300 transition-all cursor-pointer flex flex-col justify-between"
                        >
                            <div>
                                <div className="flex justify-between items-start mb-3">
                                    <h3 className="text-base font-semibold text-gray-900 line-clamp-2">{estimation.title}</h3>
                                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${confidenceColor} whitespace-nowrap ml-2`}>
                                        {estimation.confidenceScore}%
                                    </span>
                                </div>
                                <p className="text-sm text-gray-500 mb-4 flex items-center">
                                    <Clock size={14} className="mr-1" />
                                    {new Date(estimation.createdAt).toLocaleDateString()}
                                </p>
                            </div>

                            <div className="pt-4 border-t border-gray-100 flex justify-between items-center text-sm">
                                <span className="font-medium text-gray-700">Horas Estimadas: <span className="text-indigo-600 font-bold">{estimation.totalHours}h</span></span>
                                <span className="flex items-center text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-md">
                                    {estimation.status === 'Completed' || estimation.status === 'Generada' ? (
                                        <><CheckCircle size={12} className="text-green-500 mr-1" /> Lista</>
                                    ) : (
                                        <><AlertTriangle size={12} className="text-yellow-500 mr-1" /> {estimation.status}</>
                                    )}
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Estimation Detail Modal */}
            <EstimationResultModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                estimationResult={selectedEstimation}
            />
        </div>
    );
}

export default EstimationHistory;
