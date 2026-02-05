import React from 'react';
import { FileText, Trash2, Calculator, ClipboardList } from 'lucide-react'; // Import Calculator icon
import type { Document } from '../../core/models/Document';

interface DocumentsTableProps {
  documents: Document[];
  onDelete: (documentId: string) => void;
  onSelectForEstimation: (documentId: string) => void;
  requirementId?: string;
  onViewEstimation?: (requirementId: string) => void;
}

const DocumentsTable: React.FC<DocumentsTableProps> = ({ documents, onDelete, onSelectForEstimation, requirementId, onViewEstimation }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white">
        <thead className="bg-gray-50">
          <tr>
            <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre del Archivo</th>
            <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estatus</th>
            <th className="py-3 px-6 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
            <th className="py-3 px-6 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Estimación</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {documents.map((doc) => {
            const cells = [
              <td key="fileName" className="py-4 px-6 whitespace-nowrap">
                <div className="flex items-center">
                  <FileText className="h-5 w-5 text-gray-400 mr-3" />
                  <span className="font-medium text-gray-900">{doc.fileName}</span>
                </div>
              </td>,
              <td key="uploadDate" className="py-4 px-6 whitespace-nowrap text-sm text-gray-500">{doc.fileStatus}</td>,
              <td key="actions" className="py-4 px-6 whitespace-nowrap text-right">
                <div className="flex items-center justify-end gap-2">
                  <button onClick={() => onDelete(doc.id)} className="text-red-600 hover:text-red-900" title="Eliminar">
                    <Trash2 className="h-5 w-5" />
                  </button>
                  {requirementId && (
                    <button
                      onClick={() => onViewEstimation && onViewEstimation(requirementId)}
                      className="text-emerald-600 hover:text-emerald-900"
                      title="Ver Estimación"
                    >
                      <ClipboardList className="h-5 w-5" />
                    </button>
                  )}
                </div>
              </td>,
              <td key="estimation" className="py-4 px-6 whitespace-nowrap text-right">
                <button
                  onClick={() => onSelectForEstimation(doc.id)}
                  className="text-indigo-600 hover:text-indigo-900 ml-4"
                  title="Generar Estimación"
                  disabled={doc.fileStatus !== 'Ready'}
                >
                  <Calculator className="h-5 w-5" />
                </button>
              </td>,
            ];
            return <tr key={doc.id}>{...cells}</tr>;
          })}
        </tbody>
      </table>
    </div>
  );
};

export default DocumentsTable;
