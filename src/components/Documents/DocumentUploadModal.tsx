import React, { useState } from 'react';
import Modal from '../Modal/Modal';

interface DocumentUploadModalProps {
  open: boolean;
  onClose: () => void;
  onUpload: (files: File[]) => void;
  isLoading: boolean;
}

const DocumentUploadModal: React.FC<DocumentUploadModalProps> = ({ open, onClose, onUpload, isLoading }) => {
  const [files, setFiles] = useState<File[]>([]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFiles(Array.from(event.target.files));
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (event.dataTransfer.files) {
      setFiles(Array.from(event.dataTransfer.files));
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleSubmit = () => {
    onUpload(files);
  };

  return (
    <Modal open={open} onClose={onClose} title="Subir Documentos">
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center"
      >
        <p className="text-gray-500">Arrastra y suelta los archivos aquí, o</p>
        <input
          type="file"
          multiple
          onChange={handleFileChange}
          className="mt-4"
        />
      </div>
      <div className="mt-4">
        {files.map((file, index) => (
          <div key={index} className="text-gray-700">{file.name}</div>
        ))}
      </div>
      <div className="flex justify-end mt-4">
        <button
          onClick={onClose}
          className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md mr-2"
          disabled={isLoading}
        >
          Cancelar
        </button>
        <button
          onClick={handleSubmit}
          className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
          disabled={isLoading || files.length === 0}
        >
          {isLoading ? 'Subiendo...' : 'Subir'}
        </button>
      </div>
    </Modal>
  );
};

export default DocumentUploadModal;
