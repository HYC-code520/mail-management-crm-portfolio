/**
 * Collect Fee Modal Component
 * 
 * Allows staff to collect, waive, or skip package storage fees.
 * Used during pickup flow and standalone fee collection.
 */

import React, { useState, useEffect } from 'react';
import Modal from './Modal.tsx';
import { api } from '../lib/api-client.ts';
import toast from 'react-hot-toast';
import { CreditCard, Banknote, Smartphone, CheckCircle, XCircle, ArrowRight, PackageCheck, Mail, AlertTriangle } from 'lucide-react';
import CelebrationOverlay from './CelebrationOverlay.tsx';
import { useLanguage } from '../contexts/LanguageContext.tsx';

interface PackageFee {
  fee_id: string;
  mail_item_id: string;
  fee_amount: number;
  days_charged: number;
  fee_status: 'pending' | 'paid' | 'waived';
}

interface MailItem {
  mail_item_id: string;
  item_type: string;
  received_date: string;
  quantity?: number;
  packageFee?: PackageFee;
}

interface GroupedFollowUp {
  contact: {
    contact_id: string;
    contact_person?: string;
    company_name?: string;
    mailbox_number?: string;
  };
  packages: MailItem[];
  letters: MailItem[];
  totalFees: number;
  urgencyScore: number;
  lastNotified?: string;
}

type PaymentMethod = 'cash' | 'card' | 'venmo' | 'zelle' | 'paypal' | 'check' | 'other';

interface CollectFeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  group: GroupedFollowUp | null;
  onSuccess: (action: 'collected' | 'waived' | 'skipped') => void;
  /** If true, marking as picked up after collection/waive/skip */
  isPickupFlow?: boolean;
  /** Callback to mark items as picked up after fee handling */
  onMarkPickedUp?: () => Promise<void>;
}

const PAYMENT_METHODS: { value: PaymentMethod; labelKey: string; icon: React.ReactNode }[] = [
  { value: 'cash', labelKey: 'fees.cash', icon: <Banknote className="w-4 h-4" /> },
  { value: 'card', labelKey: 'fees.card', icon: <CreditCard className="w-4 h-4" /> },
  { value: 'venmo', labelKey: 'fees.venmo', icon: <Smartphone className="w-4 h-4" /> },
  { value: 'zelle', labelKey: 'fees.zelle', icon: <Smartphone className="w-4 h-4" /> },
  { value: 'paypal', labelKey: 'fees.paypal', icon: <CreditCard className="w-4 h-4" /> },
  { value: 'check', labelKey: 'fees.check', icon: <CheckCircle className="w-4 h-4" /> },
  { value: 'other', labelKey: 'fees.other', icon: <ArrowRight className="w-4 h-4" /> },
];

export default function CollectFeeModal({ 
  isOpen, 
  onClose, 
  group, 
  onSuccess,
  isPickupFlow = false,
  onMarkPickedUp
}: CollectFeeModalProps) {
  const { t } = useLanguage();
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash');
  const [waiveReason, setWaiveReason] = useState('');
  const [showWaiveInput, setShowWaiveInput] = useState(false);
  const [saving, setSaving] = useState(false);
  const [markAsPickedUp, setMarkAsPickedUp] = useState(false);
  const [markLettersAsPickedUp, setMarkLettersAsPickedUp] = useState(true); // Default to true for convenience
  const [isEditingAmount, setIsEditingAmount] = useState(false);
  const [editedAmount, setEditedAmount] = useState('');
  const [collectedBy, setCollectedBy] = useState<'Madison' | 'Merlin' | ''>(''); // Staff selection
  const [fullUnpaidAmount, setFullUnpaidAmount] = useState<number | null>(null); // Total unpaid fees across ALL items
  const [loadingFullAmount, setLoadingFullAmount] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [celebrationData, setCelebrationData] = useState({ amount: '', method: '' });

  // Fetch the customer's FULL unpaid fees (not just from Needs Follow-Up)
  useEffect(() => {
    if (!group || !isOpen) {
      setFullUnpaidAmount(null);
      return;
    }

    const fetchFullUnpaidFees = async () => {
      setLoadingFullAmount(true);
      try {
        const response = await api.fees.getUnpaidByContact(group.contact.contact_id);
        // API returns array directly, not wrapped in { fees: [...] }
        const feesArray = Array.isArray(response) ? response : (response.fees || []);
        const total = feesArray.reduce((sum: number, fee: any) => sum + (fee.fee_amount || 0), 0);
        setFullUnpaidAmount(total);
      } catch (error) {
        console.error('Error fetching full unpaid fees:', error);
        // Don't show error to user, just fail silently
        setFullUnpaidAmount(null);
      } finally {
        setLoadingFullAmount(false);
      }
    };

    fetchFullUnpaidFees();
  }, [group, isOpen]);

  if (!group) return null;

  const customerName = group.contact.contact_person || group.contact.company_name || t('labels.customer');
  const pendingPackages = group.packages.filter(
    pkg => pkg.packageFee && pkg.packageFee.fee_status === 'pending' && pkg.packageFee.fee_amount > 0
  );

  // Calculate total fee - use edited amount if in edit mode, otherwise use original
  const displayAmount = isEditingAmount && editedAmount ? parseFloat(editedAmount) : group.totalFees;
  const finalAmount = isNaN(displayAmount) ? group.totalFees : displayAmount;

  const handleCollect = async () => {
    if (!collectedBy) {
      toast(t('staff.selectWhoCollected'), {
        icon: 'ℹ️',
        style: {
          background: '#EFF6FF',
          color: '#1E40AF',
          border: '1px solid #BFDBFE',
        },
      });
      return;
    }
    
    setSaving(true);
    try {
      // Collect fees for all pending packages in this group
      for (const pkg of pendingPackages) {
        if (pkg.packageFee) {
          await api.fees.markPaid(
            pkg.packageFee.fee_id, 
            paymentMethod,
            finalAmount / pendingPackages.length, // Split edited amount evenly across packages
            collectedBy
          );
        }
      }

      // If checkbox is checked or pickup flow, mark items as picked up
      const shouldMarkPickedUp = markAsPickedUp || (isPickupFlow && onMarkPickedUp);
      
      if (shouldMarkPickedUp) {
        // Mark all packages in this group as picked up
        for (const pkg of group.packages) {
          await api.mailItems.updateStatus(pkg.mail_item_id, 'Picked Up');
        }
        
        // Mark letters as picked up if checkbox is checked
        if (markLettersAsPickedUp && group.letters.length > 0) {
          for (const letter of group.letters) {
            await api.mailItems.updateStatus(letter.mail_item_id, 'Picked Up');
          }
        }
      }

      // If pickup flow callback provided, call it
      if (isPickupFlow && onMarkPickedUp) {
        await onMarkPickedUp();
      }

      // Show celebration overlay in center of screen FIRST
      setCelebrationData({ amount: finalAmount.toFixed(2), method: paymentMethod });
      setShowCelebration(true);
      
      // Call onSuccess immediately so data refreshes
      onSuccess('collected');
      
      // Note: Don't call onClose() here - wait for celebration to complete
      // The celebration will auto-dismiss and then we close
    } catch (error) {
      console.error('Error collecting fees:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to collect fees';
      toast.error(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  const handleWaive = async () => {
    if (!waiveReason || waiveReason.trim().length < 5) {
      toast.error(t('validation.provideReason'));
      return;
    }

    setSaving(true);
    try {
      let totalWaived = 0;

      for (const pkg of pendingPackages) {
        if (pkg.packageFee) {
          await api.fees.waive(pkg.packageFee.fee_id, waiveReason.trim());
          totalWaived += pkg.packageFee.fee_amount;
        }
      }

      // If checkbox is checked or pickup flow, mark items as picked up
      const shouldMarkPickedUp = markAsPickedUp || (isPickupFlow && onMarkPickedUp);
      
      if (shouldMarkPickedUp) {
        // Mark all packages in this group as picked up
        for (const pkg of group.packages) {
          await api.mailItems.updateStatus(pkg.mail_item_id, 'Picked Up');
        }

        // Mark letters as picked up if checkbox is checked
        if (markLettersAsPickedUp && group.letters.length > 0) {
          for (const letter of group.letters) {
            await api.mailItems.updateStatus(letter.mail_item_id, 'Picked Up');
          }
        }

        // Show appropriate toast message
        const itemsMarked = markLettersAsPickedUp && group.letters.length > 0
          ? t('collectFeeModal.allItems')
          : t('plurals.packages');
        toast.success(
          `✅ ${t('collectFeeModal.waivedAndMarked', { amount: `$${totalWaived.toFixed(2)}`, items: itemsMarked })}`,
          { duration: 5000 }
        );
      } else {
        toast.success(
          `✅ ${t('collectFeeModal.waivedFor', { amount: `$${totalWaived.toFixed(2)}`, customer: customerName })}`,
          { duration: 5000 }
        );
      }

      // If pickup flow callback provided, call it
      if (isPickupFlow && onMarkPickedUp) {
        await onMarkPickedUp();
      }

      resetForm();
      onSuccess('waived');
      onClose();
    } catch (error) {
      console.error('Error waiving fees:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to waive fees';
      toast.error(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  const handleSkip = async () => {
    // Skip fee collection - mark as unpaid debt
    setSaving(true);
    try {
      // If checkbox is checked or pickup flow, mark items as picked up
      const shouldMarkPickedUp = markAsPickedUp || (isPickupFlow && onMarkPickedUp);

      if (shouldMarkPickedUp) {
        // Mark all packages in this group as picked up
        for (const pkg of group.packages) {
          await api.mailItems.updateStatus(pkg.mail_item_id, 'Picked Up');
        }
        
        // Mark letters as picked up if checkbox is checked
        if (markLettersAsPickedUp && group.letters.length > 0) {
          for (const letter of group.letters) {
            await api.mailItems.updateStatus(letter.mail_item_id, 'Picked Up');
          }
        }
        
        // Show appropriate toast message
        const itemsMarked = markLettersAsPickedUp && group.letters.length > 0
          ? t('collectFeeModal.allItems')
          : t('plurals.packages');
        toast.success(
          `⏭️ ${t('collectFeeModal.skippedMarked', { items: itemsMarked, amount: `$${group.totalFees.toFixed(2)}` })}`,
          { duration: 5000 }
        );
      } else {
        toast.success(
          `⏭️ ${t('collectFeeModal.skippedFor', { customer: customerName, amount: `$${group.totalFees.toFixed(2)}` })}`,
          { duration: 5000 }
        );
      }

      // If pickup flow callback provided, call it
      if (isPickupFlow && onMarkPickedUp) {
        await onMarkPickedUp();
      }

      resetForm();
      onSuccess('skipped');
      onClose();
    } catch (error) {
      console.error('Error skipping fees:', error);
      toast.error(t('common.error'));
    } finally {
      setSaving(false);
    }
  };

  const resetForm = () => {
    setPaymentMethod('cash');
    setWaiveReason('');
    setShowWaiveInput(false);
    setMarkAsPickedUp(false);
    setMarkLettersAsPickedUp(true); // Reset to default true
    setIsEditingAmount(false);
    setEditedAmount('');
    setCollectedBy('');
    // Note: fullUnpaidAmount is managed by useEffect, not reset here
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  // Handle celebration complete - close modal and reset
  const handleCelebrationComplete = () => {
    setShowCelebration(false);
    resetForm();
    onClose();
  };

  return (
    <>
    {/* Celebration overlay - shows after successful fee collection */}
    <CelebrationOverlay
      isVisible={showCelebration}
      amount={celebrationData.amount}
      method={celebrationData.method}
      onComplete={handleCelebrationComplete}
    />
    
    <Modal isOpen={isOpen} onClose={handleClose} title={`💵 ${t('collectFeeModal.title')}`}>
      <div className="space-y-4">
        {/* Customer Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-gray-600 mb-1">
            {isPickupFlow ? t('collectFeeModal.pickingUpFor') : t('collectFeeModal.collectingFrom')}
          </p>
          <p className="text-lg font-bold text-gray-900">{customerName}</p>
          <p className="text-sm text-gray-600">📮 {t('collectFeeModal.mailbox')}: {group.contact.mailbox_number || t('labels.na')}</p>
        </div>

        {/* Warning: Additional unpaid fees exist */}
        {!loadingFullAmount && fullUnpaidAmount !== null && fullUnpaidAmount > group.totalFees && (
          <div className="bg-amber-50 border-2 border-amber-400 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-bold text-amber-900 mb-1">⚠️ {t('collectFeeModal.additionalFeesWarning')}</p>
                <p className="text-sm text-amber-800 mb-2">
                  {t('collectFeeModal.additionalFeesDesc', { total: `$${fullUnpaidAmount.toFixed(2)}`, shown: `$${group.totalFees.toFixed(2)}` })}
                </p>
                <p className="text-sm text-amber-800">
                  {t('collectFeeModal.additionalAmount', { amount: `$${(fullUnpaidAmount - group.totalFees).toFixed(2)}` })}
                </p>
                <ul className="text-xs text-amber-700 ml-4 mt-1 space-y-0.5">
                  <li>• {t('collectFeeModal.alreadyPickedUp')}</li>
                  <li>• {t('collectFeeModal.recentlyNotified')}</li>
                  <li>• {t('collectFeeModal.abandonedOweFees')}</li>
                </ul>
                <p className="text-sm font-bold text-amber-900 mt-2 bg-amber-100 p-2 rounded border border-amber-300">
                  💡 {t('collectFeeModal.considerCollecting', { amount: `$${fullUnpaidAmount.toFixed(2)}` })}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Fee Summary */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">{t('collectFeeModal.totalOutstanding')}</span>
            {!isEditingAmount ? (
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-green-600">
                  ${group.totalFees.toFixed(2)}
                </span>
                <button
                  onClick={() => {
                    setIsEditingAmount(true);
                    // Remove trailing zeros (28.00 -> 28, 28.50 -> 28.5)
                    setEditedAmount(parseFloat(group.totalFees.toFixed(2)).toString());
                  }}
                  disabled={saving}
                  className="px-2 py-1 text-xs bg-blue-100 hover:bg-blue-200 text-blue-700 rounded transition-colors"
                  title="Edit amount (for discounts/adjustments)"
                >
                  {t('collectFeeModal.edit')}
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">$</span>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={editedAmount}
                  onChange={(e) => setEditedAmount(e.target.value)}
                  disabled={saving}
                  className="w-24 px-2 py-1 text-xl font-bold text-green-600 border border-green-300 rounded focus:ring-2 focus:ring-green-500"
                  autoFocus
                />
                <button
                  onClick={() => {
                    setIsEditingAmount(false);
                    setEditedAmount('');
                  }}
                  disabled={saving}
                  className="px-2 py-1 text-xs bg-gray-200 hover:bg-gray-300 text-gray-700 rounded transition-colors"
                >
                  {t('common.cancel')}
                </button>
              </div>
            )}
          </div>

          {isEditingAmount && parseFloat(editedAmount) < group.totalFees && (
            <p className="text-xs text-blue-600 mb-2">
              💡 {t('collectFeeModal.discount', { amount: `$${(group.totalFees - parseFloat(editedAmount || '0')).toFixed(2)}` })}
            </p>
          )}

          {/* Package Details */}
          <div className="mt-3 space-y-1">
            <p className="text-xs font-semibold text-gray-700 uppercase">
              {t('collectFeeModal.packagesWithFees')} ({pendingPackages.length}):
            </p>
            {pendingPackages.map(pkg => (
              <div key={pkg.mail_item_id} className="text-xs text-gray-600 ml-2">
                • {t('collectFeeModal.day')} {pkg.packageFee?.days_charged || 0} - ${(pkg.packageFee?.fee_amount || 0).toFixed(2)}
                {pkg.quantity && pkg.quantity > 1 && ` (×${pkg.quantity})`}
              </div>
            ))}
          </div>
        </div>

        {/* Staff Selection - Who collected the fee */}
        {!showWaiveInput && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('collectFeeModal.collectedBy')} <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setCollectedBy('Madison')}
                disabled={saving}
                className={`flex-1 px-4 py-3 rounded-lg border-2 font-medium transition-all ${
                  collectedBy === 'Madison'
                    ? 'bg-purple-600 border-purple-600 text-white shadow-md'
                    : 'bg-white border-gray-300 text-gray-700 hover:border-purple-400 hover:bg-purple-50'
                } disabled:opacity-50`}
              >
                {t('staff.madison')}
              </button>
              <button
                type="button"
                onClick={() => setCollectedBy('Merlin')}
                disabled={saving}
                className={`flex-1 px-4 py-3 rounded-lg border-2 font-medium transition-all ${
                  collectedBy === 'Merlin'
                    ? 'bg-blue-600 border-blue-600 text-white shadow-md'
                    : 'bg-white border-gray-300 text-gray-700 hover:border-blue-400 hover:bg-blue-50'
                } disabled:opacity-50`}
              >
                {t('staff.merlin')}
              </button>
            </div>
          </div>
        )}

        {/* Payment Method Selection */}
        {!showWaiveInput && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('collectFeeModal.paymentMethod')}
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
              {PAYMENT_METHODS.map((method) => (
                <button
                  key={method.value}
                  type="button"
                  onClick={() => setPaymentMethod(method.value)}
                  disabled={saving}
                  className={`flex items-center justify-center gap-2 px-3 py-2 rounded-lg border text-sm font-medium transition-colors ${
                    paymentMethod === method.value
                      ? 'bg-green-100 border-green-500 text-green-700'
                      : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                  } disabled:opacity-50`}
                >
                  {method.icon}
                  {t(method.labelKey)}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Mark as Picked Up Checkbox */}
        {!isPickupFlow && !showWaiveInput && (
          <div className="space-y-2">
            <label className="flex items-center gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg cursor-pointer hover:bg-blue-100 transition-colors">
              <input
                type="checkbox"
                checked={markAsPickedUp}
                onChange={(e) => setMarkAsPickedUp(e.target.checked)}
                disabled={saving}
                className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <div className="flex items-center gap-2">
                <PackageCheck className="w-5 h-5 text-blue-600" />
                <span className="text-sm font-medium text-gray-700">
                  {t('collectFeeModal.alsoMarkPickedUp')}
                </span>
              </div>
            </label>

            {/* Letter Pickup Sub-checkbox - Only show if customer has letters AND main checkbox is checked */}
            {markAsPickedUp && group.letters.length > 0 && (
              <label className="flex items-center gap-3 p-3 ml-6 bg-green-50 border border-green-200 rounded-lg cursor-pointer hover:bg-green-100 transition-colors">
                <input
                  type="checkbox"
                  checked={markLettersAsPickedUp}
                  onChange={(e) => setMarkLettersAsPickedUp(e.target.checked)}
                  disabled={saving}
                  className="w-5 h-5 text-green-600 border-gray-300 rounded focus:ring-green-500"
                />
                <div className="flex items-center gap-2">
                  <Mail className="w-5 h-5 text-green-600" />
                  <span className="text-sm font-medium text-gray-700">
                    {t('collectFeeModal.alsoMarkLetters', { count: group.letters.length })}
                  </span>
                </div>
              </label>
            )}
          </div>
        )}

        {/* Waive Reason Input (conditional) */}
        {showWaiveInput && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('collectFeeModal.reasonForWaiving')} <span className="text-red-500">*</span>
            </label>
            <textarea
              value={waiveReason}
              onChange={(e) => setWaiveReason(e.target.value)}
              placeholder={t('collectFeeModal.waivePlaceholder')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
              rows={2}
              maxLength={500}
              disabled={saving}
            />
            <p className="text-xs text-gray-500 mt-1">
              {waiveReason.length}/500 {t('collectFeeModal.characters')}
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="border-t pt-4 space-y-2">
          {!showWaiveInput ? (
            <>
              {/* Primary: Collect Fee */}
              <button
                onClick={handleCollect}
                disabled={saving || pendingPackages.length === 0}
                className="w-full px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <Banknote className="w-5 h-5" />
                {saving ? t('common.processing') : `${t('collectFeeModal.collect')} $${finalAmount.toFixed(2)} (${t(`fees.${paymentMethod}`)})`}
              </button>

              {/* Secondary Options */}
              <div className="flex gap-2">
                <button
                  onClick={() => setShowWaiveInput(true)}
                  disabled={saving || pendingPackages.length === 0}
                  className="flex-1 px-4 py-2 bg-orange-100 hover:bg-orange-200 text-orange-700 rounded-lg font-medium disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <XCircle className="w-4 h-4" />
                  {t('collectFeeModal.waiveFee')}
                </button>
                <button
                  onClick={handleSkip}
                  disabled={saving}
                  className="flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <ArrowRight className="w-4 h-4" />
                  {t('collectFeeModal.skipOwes')}
                </button>
              </div>
            </>
          ) : (
            <>
              {/* Waive confirmation */}
              <div className="flex gap-2">
                <button
                  onClick={() => setShowWaiveInput(false)}
                  disabled={saving}
                  className="flex-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-900 rounded-lg font-medium disabled:opacity-50"
                >
                  {t('common.back')}
                </button>
                <button
                  onClick={handleWaive}
                  disabled={!waiveReason.trim() || waiveReason.trim().length < 5 || saving}
                  className="flex-1 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? t('collectFeeModal.waiving') : `${t('collectFeeModal.waive')} $${group.totalFees.toFixed(2)}`}
                </button>
              </div>
            </>
          )}

          {/* Cancel */}
          <button
            onClick={handleClose}
            disabled={saving}
            className="w-full px-4 py-2 text-gray-500 hover:text-gray-700 font-medium disabled:opacity-50"
          >
            {t('common.cancel')}
          </button>
        </div>

        {/* Info about skipping */}
        {!showWaiveInput && (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
            <p className="text-xs text-gray-600">
              💡 <strong>{t('collectFeeModal.skipOwes')}</strong>: {t('collectFeeModal.skipInfo')}
            </p>
          </div>
        )}
      </div>
    </Modal>
    </>
  );
}

