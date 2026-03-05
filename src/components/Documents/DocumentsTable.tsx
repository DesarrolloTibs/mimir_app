import React from 'react';
import type { Document } from '../../core/models/Document';
import { Trash2 } from 'lucide-react';

interface Props {
  documents: Document[];
  onDelete: (documentId: string) => void;
  requirementId?: string;
}

const DocumentsTable: React.FC<Props> = ({ documents, onDelete }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-200">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre del Archivo</th>
            <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estatus</th>
            <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {documents.length > 0 ? (
            documents.map(doc => (
              <tr key={doc.id} className="hover:bg-gray-50 transition-colors">
                <td className="p-3 text-sm text-gray-900 truncate max-w-xs" title={doc.fileName}>
                  {doc.fileName}
                </td>
                <td className="p-3 text-sm text-gray-500">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800`}>
                    {doc.fileStatus}
                  </span>
                </td>
                <td className="p-3 text-sm text-gray-500">
                  {/* The Document model in core/models might not have createdAt, fallback to a placeholder or use property if it exists using any cast to skip strict check temporarily if needed, but best is to use any date available or just say N/A */}
                  {('createdAt' in doc && doc.createdAt) ? new Date(doc.createdAt as string).toLocaleDateString() : '-'}
                </td>
                <td className="p-3 text-sm font-medium">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => doc.id && onDelete(doc.id)}
                      className="text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 p-1.5 rounded-md transition-colors"
                      title="Eliminar Documento"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={5} className="p-6 text-center text-gray-500 text-sm">
                No hay documentos asociados a este proyecto.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default DocumentsTable;
