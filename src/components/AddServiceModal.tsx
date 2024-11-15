import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import type { Service } from '../types';

interface AddServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (service: Omit<Service, 'id' | 'lastCheck' | 'isActive'>) => void;
  onUpdate: (service: Service) => void;
  editingService: Service | null;
}

const CLOUD_PROVIDERS = [
  'AWS',
  'Google Cloud',
  'Azure',
  'DigitalOcean',
  'Heroku',
  'UpCloud',
  'Netuy.net',
  'Other'
];

const DEFAULT_FORM_DATA = {
  name: '',
  projectName: '',
  url: '',
  ip: '',
  description: '',
  cloudProvider: 'AWS',
  monthlyCost: 0,
  supportedBy: '',
};

export function AddServiceModal({ isOpen, onClose, onAdd, onUpdate, editingService }: AddServiceModalProps) {
  const [formData, setFormData] = useState(DEFAULT_FORM_DATA);

  useEffect(() => {
    if (editingService) {
      setFormData({
        name: editingService.name,
        projectName: editingService.projectName,
        url: editingService.url,
        ip: editingService.ip,
        description: editingService.description,
        cloudProvider: editingService.cloudProvider,
        monthlyCost: editingService.monthlyCost,
        supportedBy: editingService.supportedBy,
      });
    } else {
      setFormData(DEFAULT_FORM_DATA);
    }
  }, [editingService]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingService) {
      onUpdate({
        ...editingService,
        ...formData,
      });
    } else {
      onAdd(formData);
    }
    setFormData(DEFAULT_FORM_DATA);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-md">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-800">
            {editingService ? 'Edit Service' : 'Add New Service'}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Service Name
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., API Server"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Project Name
            </label>
            <input
              type="text"
              required
              value={formData.projectName}
              onChange={(e) => setFormData({ ...formData, projectName: e.target.value })}
              className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., E-commerce Platform"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              IP Address
            </label>
            <input
              type="text"
              required
              value={formData.ip}
              onChange={(e) => setFormData({ ...formData, ip: e.target.value })}
              className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., 192.168.1.100"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              URL
            </label>
            <input
              type="url"
              required
              value={formData.url}
              onChange={(e) => setFormData({ ...formData, url: e.target.value })}
              className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., https://api.example.com"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cloud Provider
              </label>
              <select
                value={formData.cloudProvider}
                onChange={(e) => setFormData({ ...formData, cloudProvider: e.target.value })}
                className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                {CLOUD_PROVIDERS.map(provider => (
                  <option key={provider} value={provider}>
                    {provider}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Monthly Cost ($)
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                required
                value={formData.monthlyCost}
                onChange={(e) => setFormData({ ...formData, monthlyCost: parseFloat(e.target.value) })}
                className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="0.00"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Supported By
            </label>
            <input
              type="text"
              required
              value={formData.supportedBy}
              onChange={(e) => setFormData({ ...formData, supportedBy: e.target.value })}
              className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., DevOps Team"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
              rows={3}
              placeholder="Service description..."
            />
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
            >
              {editingService ? 'Update Service' : 'Add Service'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}