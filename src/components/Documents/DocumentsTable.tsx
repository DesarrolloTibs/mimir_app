import React from 'react';
import { FileText, Trash2 } from 'lucide-react';
import type { Document } from '../../core/models/Document';

interface DocumentsTableProps {
  documents: Document[];
  onDelete: (documentId: string) => void;
}

const DocumentsTable: React.FC<DocumentsTableProps> = ({ documents, onDelete }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white">
        <thead className="bg-gray-50">
          <tr>
            <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre del Archivo</th>
            <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha de Subida</th>
            <th className="py-3 px-6 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {documents.map((doc) => (
            <tr key={doc.id}>
              <td className="py-4 px-6 whitespace-nowrap">
                <div className="flex items-center">
                  <FileText className="h-5 w-5 text-gray-400 mr-3" />
                  <span className="font-medium text-gray-900">{doc.fileName}</span>
                </div>
              </td>
              <td className="py-4 px-6 whitespace-nowrap text-sm text-gray-500">{new Date(doc.uploadDate).toLocaleDateString()}</td>
              <td className="py-4 px-6 whitespace-nowrap text-right">
                <button onClick={() => onDelete(doc.id)} className="text-red-600 hover:text-red-900">
                  <Trash2 className="h-5 w-5" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DocumentsTable;
