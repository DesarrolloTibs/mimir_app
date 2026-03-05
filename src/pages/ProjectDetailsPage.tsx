import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, FileText, BarChart3 } from 'lucide-react';

import { getProjects } from '../services/projectsService';
import type { Project } from '../core/models/Project';

import Loader from '../components/Loader/Loader';
import DocumentsTable from '../components/Documents/DocumentsTable';
import EstimationGenerator from '../components/Projects/EstimationGenerator';
import EstimationHistory from '../components/Projects/EstimationHistory';
// import ChatWidget from '../components/Projects/ChatWidget'; // Conservado para futuro
import ProjectChat from '../components/Projects/ProjectChat';
import DocumentUploadModal from '../components/Documents/DocumentUploadModal';

import { getDocumentsByProjectId, uploadDocuments, deleteDocument } from '../services/documentService';
import type { Document } from '../core/models/Document';
import Notification from '../components/Modal/Notification';
import EstimationResultModal from '../components/Projects/EstimationResultModal';

const ProjectDetailsPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [project, setProject] = useState<Project | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<'overview' | 'documents' | 'estimations' | 'chat'>('overview');

    // Documents state
    const [documents, setDocuments] = useState<Document[]>([]);
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [notification, setNotification] = useState<{ show: boolean; type: 'success' | 'error'; title: string; message: string } | null>(null);

    // Estimation state (generating)
    const [selectedDocumentForEstimationId, setSelectedDocumentForEstimationId] = useState<string | null>(null);
    const [isGeneratingEstimation, setIsGeneratingEstimation] = useState(false);
    const [estimationModalOpen, setEstimationModalOpen] = useState(false);

    useEffect(() => {
        const fetchProjectDetails = async () => {
            if (!id) return;
            setLoading(true);
            try {
                // As there is no getProjectById in the API service based on earlier context, we filter from the list
                // If a getProjectById exists, use that instead for performance.
                const projects = await getProjects();
                const foundProject = projects.find(p => p.id === id);
                if (foundProject) {
                    setProject(foundProject);
                    const docs = await getDocumentsByProjectId(id);
                    setDocuments(docs);
                } else {
                    setError('Proyecto no encontrado');
                }
            } catch {
                setError('Error cargando detalles del proyecto');
            } finally {
                setLoading(false);
            }
        };

        fetchProjectDetails();
    }, [id]);

    const handleUpload = async (files: File[]) => {
        if (!project || !project.id) return;
        setUploading(true);
        try {
            await uploadDocuments(project.id, files);
            const fetchedDocuments = await getDocumentsByProjectId(project.id);
            setDocuments(fetchedDocuments);
            setNotification({ show: true, type: 'success', title: 'Éxito', message: 'Documentos subidos correctamente.' });
        } catch {
            setNotification({ show: true, type: 'error', title: 'Error', message: 'Hubo un error al subir los documentos.' });
        } finally {
            setUploading(false);
            setIsUploadModalOpen(false);
        }
    };

    const handleDeleteDocument = async (documentId: string) => {
        try {
            await deleteDocument(documentId);
            setDocuments(prev => prev.filter(doc => doc.id !== documentId));
            setNotification({ show: true, type: 'success', title: 'Éxito', message: 'Documento eliminado correctamente.' });
        } catch {
            setNotification({ show: true, type: 'error', title: 'Error', message: 'Hubo un error al eliminar el documento.' });
        }
    };

    if (loading) return <div className="p-8"><Loader /></div>;
    if (error || !project) return <div className="p-8 text-red-500">{error || 'Proyecto no encontrado'}</div>;

    return (
        <div className="flex flex-col h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between shadow-sm z-10">
                <div className="flex items-center space-x-4">
                    <button
                        onClick={() => navigate('/projects')}
                        className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors"
                    >
                        <ArrowLeft size={24} />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">{project.name}</h1>
                        <p className="text-sm text-gray-500">{project.clientName}</p>
                    </div>
                </div>
            </div>

            {notification && (
                <Notification
                    show={notification.show}
                    type={notification.type}
                    title={notification.title}
                    message={notification.message}
                    onConfirm={() => setNotification(null)}
                />
            )}

            {/* Workspace Content */}
            <div className="flex-1 overflow-hidden flex flex-col">
                {/* Tabs */}
                <div className="bg-white px-6 border-b border-gray-200">
                    <div className="flex space-x-8">
                        <button
                            onClick={() => setActiveTab('overview')}
                            className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 transition-colors ${activeTab === 'overview' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                        >
                            <span>Resumen</span>
                        </button>
                        <button
                            onClick={() => setActiveTab('documents')}
                            className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 transition-colors ${activeTab === 'documents' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                        >
                            <FileText size={18} />
                            <span>Documentos ({documents.length})</span>
                        </button>
                        <button
                            onClick={() => setActiveTab('estimations')}
                            className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 transition-colors ${activeTab === 'estimations' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                        >
                            <BarChart3 size={18} />
                            <span>Estimaciones</span>
                        </button>
                        <button
                            onClick={() => setActiveTab('chat')}
                            className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 transition-colors ${activeTab === 'chat' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                        >
                            <span className="flex items-center justify-center w-5 h-5 rounded-full bg-indigo-100 text-indigo-600">✨</span>
                            <span>Mimir Chat</span>
                        </button>
                    </div>
                </div>

                {/* Tab Content Panels */}
                <div className="flex-1 overflow-y-auto p-6">
                    {activeTab === 'overview' && (
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 max-w-3xl">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">Información del Proyecto</h2>
                            <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                                <div className="sm:col-span-1">
                                    <dt className="text-sm font-medium text-gray-500">Nombre</dt>
                                    <dd className="mt-1 text-sm text-gray-900">{project.name}</dd>
                                </div>
                                <div className="sm:col-span-1">
                                    <dt className="text-sm font-medium text-gray-500">Cliente</dt>
                                    <dd className="mt-1 text-sm text-gray-900">{project.clientName}</dd>
                                </div>
                                <div className="sm:col-span-2">
                                    <dt className="text-sm font-medium text-gray-500">Stack Tecnológico</dt>
                                    <dd className="mt-1 text-sm text-gray-900 bg-gray-50 p-3 rounded-md border border-gray-100">{project.techStackContext}</dd>
                                </div>
                                <div className="sm:col-span-1">
                                    <dt className="text-sm font-medium text-gray-500">Fecha de Creación</dt>
                                    <dd className="mt-1 text-sm text-gray-900">{project.createdAt ? new Date(project.createdAt).toLocaleDateString() : 'N/A'}</dd>
                                </div>
                            </dl>
                        </div>
                    )}

                    {activeTab === 'documents' && (
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <h2 className="text-lg font-semibold text-gray-900">Documentos del Proyecto</h2>
                                <button
                                    onClick={() => setIsUploadModalOpen(true)}
                                    className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 text-sm font-medium"
                                >
                                    Subir Documento
                                </button>
                            </div>

                            <div className="bg-white shadow-sm border border-gray-200 rounded-lg overflow-hidden">
                                <DocumentsTable
                                    documents={documents}
                                    onDelete={handleDeleteDocument}
                                />
                            </div>

                            <DocumentUploadModal
                                open={isUploadModalOpen}
                                onClose={() => setIsUploadModalOpen(false)}
                                onUpload={handleUpload}
                                isLoading={uploading}
                            />

                            <EstimationResultModal
                                isOpen={estimationModalOpen}
                                onClose={() => setEstimationModalOpen(false)}
                                estimationResult={null}
                            />
                        </div>
                    )}

                    {activeTab === 'estimations' && (
                        <div className="space-y-8">
                            {/* Estimation Generation Action Panel */}
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 flex flex-col sm:flex-row items-start sm:items-end gap-4">
                                <div className="flex-1 w-full">
                                    <label htmlFor="document-select" className="block text-sm font-medium text-gray-700 mb-2">
                                        Generar nueva estimación desde documento
                                    </label>
                                    <select
                                        id="document-select"
                                        className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md disabled:bg-gray-100 disabled:text-gray-500"
                                        value={selectedDocumentForEstimationId || ''}
                                        onChange={(e) => setSelectedDocumentForEstimationId(e.target.value)}
                                        disabled={isGeneratingEstimation || documents.length === 0}
                                    >
                                        <option value="" disabled>Selecciona un archivo de requerimientos...</option>
                                        {documents.map((doc) => (
                                            <option key={doc.id} value={doc.id}>{doc.fileName}</option>
                                        ))}
                                    </select>
                                </div>
                                <button
                                    onClick={() => {
                                        if (selectedDocumentForEstimationId) {
                                            setIsGeneratingEstimation(true);
                                        }
                                    }}
                                    disabled={!selectedDocumentForEstimationId || isGeneratingEstimation}
                                    className="w-full sm:w-auto bg-indigo-600 border border-transparent rounded-md shadow-sm py-2 px-6 inline-flex justify-center text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-300 disabled:cursor-not-allowed transition-colors whitespace-nowrap"
                                >
                                    {isGeneratingEstimation ? 'Generando...' : 'Iniciar Estimación Mimir'}
                                </button>
                            </div>

                            {isGeneratingEstimation && selectedDocumentForEstimationId && (
                                <div className="bg-white rounded-lg shadow-sm border border-indigo-200 overflow-hidden">
                                    <div className="bg-indigo-50 px-6 py-4 border-b border-indigo-100 flex justify-between items-center">
                                        <h3 className="text-lg font-medium text-indigo-900">Generando Nueva Estimación</h3>
                                        <button onClick={() => setIsGeneratingEstimation(false)} className="text-indigo-600 text-sm hover:underline">Ocultar</button>
                                    </div>
                                    <div className="p-6">
                                        <EstimationGenerator
                                            projectId={project.id!}
                                            documentId={selectedDocumentForEstimationId}
                                        />
                                    </div>
                                </div>
                            )}

                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                <h2 className="text-lg font-semibold text-gray-900 mb-6">Historial de Estimaciones Científicas</h2>
                                <EstimationHistory projectId={project.id!} />
                            </div>
                        </div>
                    )}
                    {activeTab === 'chat' && (
                        <div className="h-full">
                            <ProjectChat projectId={project.id!} />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProjectDetailsPage;
