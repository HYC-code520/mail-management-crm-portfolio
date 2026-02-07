import React, { useState } from 'react';
import { X } from 'lucide-react';
import { api } from '../lib/api-client.ts';
import toast from 'react-hot-toast';
import { useLanguage } from '../contexts/LanguageContext.tsx';

interface QuickNotifyModalProps {
  isOpen: boolean;
  onClose: () => void;
  mailItemId: string;
  contactId: string;
  customerName: string;
  onSuccess: () => void;
}

export default function QuickNotifyModal({
  isOpen,
  onClose,
  mailItemId,
  contactId,
  customerName,
  onSuccess
}: QuickNotifyModalProps) {
  const { t } = useLanguage();
  const [notifiedBy, setNotifiedBy] = useState('');
  const [notificationMethod, setNotificationMethod] = useState('Email');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!notifiedBy.trim()) {
      toast.error(t('validation.selectPerformer'));
      return;
    }

    setLoading(true);

    try {
      // Create notification record
      await api.notifications.quickNotify({
        mail_item_id: mailItemId,
        contact_id: contactId,
        notified_by: notifiedBy,
        notification_method: notificationMethod,
        ...(notes && { notes })
      });

      // Also log to action history
      await api.actionHistory.create({
        mail_item_id: mailItemId,
        action_type: 'notified',
        action_description: `Customer notified via ${notificationMethod}`,
        performed_by: notifiedBy,
        notes: notes.trim() || null
      });

      toast.success(`✓ ${customerName} ${t('notifyModal.customerNotifiedVia', { method: notificationMethod })}`);
      onSuccess();
      handleClose();
    } catch (err) {
      console.error('Failed to log notification:', err);
      toast.error(t('common.error'));
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setNotifiedBy('');
    setNotificationMethod('Email');
    setNotes('');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">{t('notifyModal.title')}</h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
            <p className="text-sm text-gray-600">{t('actionModal.customerLabel')}</p>
            <p className="font-semibold text-gray-900">{customerName}</p>
          </div>

          {/* Who Notified */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              {t('notifyModal.whoNotified')} <span className="text-red-500">*</span>
            </label>
            <select
              value={notifiedBy}
              onChange={(e) => setNotifiedBy(e.target.value)}
              required
              className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="">{t('staff.selectStaff')}</option>
              <option value="Merlin">{t('staff.merlin')}</option>
              <option value="Madison">{t('staff.madison')}</option>
            </select>
          </div>

          {/* Notification Method */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              {t('notifyModal.howNotified')} <span className="text-red-500">*</span>
            </label>
            <select
              value={notificationMethod}
              onChange={(e) => setNotificationMethod(e.target.value)}
              required
              className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="Email">{t('notificationMethods.email')}</option>
              <option value="Phone">{t('notificationMethods.phone')}</option>
              <option value="Text">{t('notificationMethods.text')}</option>
              <option value="WeChat">{t('notificationMethods.wechat')}</option>
              <option value="In-Person">{t('notificationMethods.inPerson')}</option>
            </select>
          </div>

          {/* Optional Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              {t('notifyModal.notesOptional')}
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={t('notifyModal.additionalDetails')}
              rows={3}
              className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-4 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-medium transition-colors"
            >
              {t('common.cancel')}
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? t('common.saving') : t('notifyModal.markAsNotified')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

