import React, { useState } from 'react';
import Modal from '../Modal/Modal';
import type { Project } from '../../core/models/Project';
import { Loader } from 'lucide-react';

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (project: Omit<Project, 'id' | 'createdAt'>) => void;
  isLoading: boolean;
}

const ProjectCreateModal: React.FC<Props> = ({ open, onClose, onSubmit, isLoading }) => {
  const [form, setForm] = useState({
    name: '',
    client: '',
    techStack: '',
  });
  const [errors, setErrors] = useState({ name: '' });

  const validate = () => {
    let isValid = true;
    const newErrors = { name: '' };

    if (form.name.length < 5 || form.name.length > 50) {
      newErrors.name = 'El nombre debe tener entre 5 y 50 caracteres.';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(form);
    }
  };

  return (
    <Modal open={open} onClose={onClose} maxWidth="max-w-2xl" height="h-auto" title="Crear Nuevo Proyecto">
      <div className="p-2">
        <form onSubmit={handleSubmit} className="space-y-6">
          <fieldset>
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Nombre del Proyecto <span className="text-red-500">*</span>
              </label>
              <input
                id="name"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Ej: Mimir App"
                required
                className={`w-full border rounded px-3 py-2 ${errors.name ? 'border-red-500' : 'border-gray-300'} focus:ring-indigo-500 focus:border-indigo-500`}
              />
              {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name}</p>}
            </div>

            <div className="mt-4">
              <label htmlFor="client" className="block text-sm font-medium text-gray-700 mb-1">
                Cliente
              </label>
              <input
                id="client"
                name="client"
                value={form.client}
                onChange={handleChange}
                placeholder="Ej: ACME Corp"
                className="w-full border rounded px-3 py-2 border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div className="mt-4">
              <label htmlFor="techStack" className="block text-sm font-medium text-gray-700 mb-1">
                Tech Stack <span className="text-red-500">*</span>
              </label>
              <textarea
                id="techStack"
                name="techStack"
                value={form.techStack}
                onChange={handleChange}
                placeholder="Ej: React, Node, AWS"
                required
                rows={3}
                className="w-full border rounded px-3 py-2 border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </fieldset>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 flex items-center justify-center disabled:bg-indigo-400"
            >
              {isLoading && <Loader className="animate-spin mr-2" size={20} />}
              {isLoading ? 'Creando...' : 'Crear'}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default ProjectCreateModal;
