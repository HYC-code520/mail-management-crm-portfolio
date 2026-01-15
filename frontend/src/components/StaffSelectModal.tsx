import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface StaffSelectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (staffName: string) => void;
  title: string;
  description?: string;
}

export default function StaffSelectModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description
}: StaffSelectModalProps) {
  const { t } = useLanguage();
  const [selectedStaff, setSelectedStaff] = useState<string>('Merlin');

  if (!isOpen) return null;

  const handleConfirm = () => {
    if (selectedStaff) {
      onConfirm(selectedStaff);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md transform transition-all">
          {/* Header */}
          <div className="flex items-center justify-between p-5 border-b border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-5">
            {description && (
              <p className="text-sm text-gray-600 mb-4">{description}</p>
            )}

            <label className="block text-sm font-medium text-gray-700 mb-3">
              {t('followUps.selectStaff')}
            </label>

            {/* Staff buttons */}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setSelectedStaff('Merlin')}
                className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all ${
                  selectedStaff === 'Merlin'
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-200'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Merlin
              </button>
              <button
                type="button"
                onClick={() => setSelectedStaff('Madison')}
                className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all ${
                  selectedStaff === 'Madison'
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-200'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Madison
              </button>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 p-5 border-t border-gray-100">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg font-medium transition-colors"
            >
              {t('common.cancel')}
            </button>
            <button
              onClick={handleConfirm}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
            >
              {t('common.confirm')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
