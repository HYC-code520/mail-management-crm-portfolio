import React, { useState } from 'react';
import { X } from 'lucide-react';
import { api } from '../lib/api-client.ts';
import toast from 'react-hot-toast';
import { useLanguage } from '../contexts/LanguageContext.tsx';

interface ActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  mailItemId: string;
  mailItemIds?: string[]; // Optional: all item IDs in the group for bulk update
  mailItemDetails: {
    customerName: string;
    itemType: string;
    currentStatus: string;
    totalQuantity?: number; // Optional: total quantity for display
  };
  actionType: 'picked_up' | 'forward' | 'scanned' | 'abandoned';
  onSuccess: () => void;
}

// Status values that don't need translation (used for API)
const STATUS_VALUES = {
  picked_up: 'Picked Up',
  forward: 'Forward',
  scanned: 'Scanned',
  abandoned: 'Abandoned'
};

export default function ActionModal({
  isOpen,
  onClose,
  mailItemId,
  mailItemIds,
  mailItemDetails,
  actionType,
  onSuccess
}: ActionModalProps) {
  const { t } = useLanguage();
  const [performedBy, setPerformedBy] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  // Map action type to translation keys
  const actionKey = actionType === 'picked_up' ? 'pickedUp' : actionType;
  const statusValue = STATUS_VALUES[actionType];

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!performedBy.trim()) {
      toast.error(t('validation.selectPerformer'));
      return;
    }

    setLoading(true);

    try {
      // Get all IDs to update (use mailItemIds if provided, otherwise just mailItemId)
      const idsToUpdate = mailItemIds && mailItemIds.length > 0 ? mailItemIds : [mailItemId];

      // Update all mail items in the group
      for (const id of idsToUpdate) {
        await api.mailItems.update(id, {
          status: statusValue,
          performed_by: performedBy, // Pass staff name to backend for action history
          action_notes: notes.trim() || null // Pass notes to be included in action history
        });
      }

      // Note: Backend automatically logs action history, no need to create it manually here

      const itemCount = idsToUpdate.length;
      const successMessage = t(`actionModal.${actionKey}.successMessage`);
      const quantityDisplay = mailItemDetails.totalQuantity && mailItemDetails.totalQuantity > 1
        ? ` (${mailItemDetails.totalQuantity} ${t('actionModal.items')})`
        : '';
      const successMsg = itemCount > 1
        ? `✓ ${itemCount} ${t('plurals.entries')} ${mailItemDetails.customerName}${quantityDisplay} ${successMessage}`
        : `✓ ${mailItemDetails.customerName} ${mailItemDetails.itemType} ${successMessage}`;
      toast.success(successMsg);
      onSuccess();
      handleClose();
    } catch (err) {
      console.error('Failed to perform action:', err);
      toast.error(t('toast.failedToUpdateMailItem'));
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setPerformedBy('');
    setNotes('');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">{t(`actionModal.${actionKey}.title`)}</h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            disabled={loading}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Mail Item Info */}
          <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 space-y-1">
            <div>
              <span className="text-sm text-gray-600">{t('actionModal.customerLabel')} </span>
              <span className="font-semibold text-gray-900">{mailItemDetails.customerName}</span>
            </div>
            <div>
              <span className="text-sm text-gray-600">{t('actionModal.itemLabel')} </span>
              <span className="font-medium text-gray-900">{mailItemDetails.itemType}</span>
            </div>
            <div>
              <span className="text-sm text-gray-600">{t('actionModal.currentStatusLabel')} </span>
              <span className="font-medium text-gray-900">{mailItemDetails.currentStatus}</span>
            </div>
          </div>

          {/* Who Performed Action */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              {t('actionModal.whoPerformed')} <span className="text-red-500">*</span>
            </label>
            <select
              value={performedBy}
              onChange={(e) => setPerformedBy(e.target.value)}
              required
              disabled={loading}
              className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:bg-gray-100"
            >
              <option value="">{t('staff.selectStaff')}</option>
              <option value="Merlin">{t('staff.merlin')}</option>
              <option value="Madison">{t('staff.madison')}</option>
            </select>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              {t('actionModal.notesOptional')}
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              disabled={loading}
              placeholder={t('actionModal.addDetailsPlaceholder')}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:bg-gray-100"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={handleClose}
              disabled={loading}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors disabled:opacity-50"
            >
              {t('common.cancel')}
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? t('common.processing') : t(`actionModal.${actionKey}.buttonText`)}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

