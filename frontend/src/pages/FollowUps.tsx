import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../lib/api-client.ts';
import toast from 'react-hot-toast';
import GroupedFollowUpSection from '../components/dashboard/GroupedFollowUp.tsx';
import SendEmailModal from '../components/SendEmailModal.tsx';
import StaffSelectModal from '../components/StaffSelectModal.tsx';
import ConfirmModal from '../components/ConfirmModal.tsx';
import { getTodayNY, toNYDateString, extractNYDate } from '../utils/timezone.ts';
import { useLanguage } from '../contexts/LanguageContext.tsx';
import { getCustomerDisplayName } from '../utils/customerDisplay.ts';
import { RotateCcw, EyeOff, CheckCircle } from 'lucide-react';

interface PackageFee {
  fee_id: string;
  mail_item_id: string;
  fee_amount: number;
  days_charged: number;
  fee_status: 'pending' | 'paid' | 'waived';
  paid_date?: string;
  waived_date?: string;
  waive_reason?: string;
}

interface MailItem {
  mail_item_id: string;
  item_type: string;
  status: string;
  received_date: string;
  pickup_date?: string;
  contact_id: string;
  quantity?: number;
  last_notified?: string;
  notification_count?: number;
  packageFee?: PackageFee;
  contacts?: {
    contact_person?: string;
    company_name?: string;
    mailbox_number?: string;
  };
}

interface GroupedFollowUp {
  contact: {
    contact_id: string;
    contact_person?: string;
    company_name?: string;
    mailbox_number?: string;
    display_name_preference?: 'company' | 'person' | 'both';
  };
  packages: MailItem[];
  letters: MailItem[];
  totalFees: number;
  urgencyScore: number;
  lastNotified?: string;
}


interface DismissedItem {
  mail_item_id: string;
  item_type: string;
  quantity: number;
  received_date: string;
  dismissed_at: string;
  dismissed_by: string;
  contact_id: string;
  contacts: {
    contact_id: string;
    contact_person?: string;
    company_name?: string;
    mailbox_number?: string;
    display_name_preference?: 'company' | 'person' | 'both';
  };
}

export default function FollowUpsPage() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [followUps, setFollowUps] = useState<GroupedFollowUp[]>([]);
  const [loading, setLoading] = useState(true);

  // Dismissed items state
  const [showDismissed, setShowDismissed] = useState(false);
  const [dismissedItems, setDismissedItems] = useState<DismissedItem[]>([]);
  const [loadingDismissed, setLoadingDismissed] = useState(false);

  // Staff select modal state
  const [staffModalOpen, setStaffModalOpen] = useState(false);
  const [staffModalTitle, setStaffModalTitle] = useState('');
  const [staffModalDescription, setStaffModalDescription] = useState('');
  const [pendingAction, setPendingAction] = useState<((staffName: string) => Promise<void>) | null>(null);

  // Confirm modal state (for mark abandoned)
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [confirmModalTitle, setConfirmModalTitle] = useState('');
  const [confirmModalMessage, setConfirmModalMessage] = useState('');
  const [confirmModalAction, setConfirmModalAction] = useState<(() => Promise<void>) | null>(null);
  const [confirmModalLoading, setConfirmModalLoading] = useState(false);

  // Send Email Modal states
  const [isSendEmailModalOpen, setIsSendEmailModalOpen] = useState(false);
  const [emailingMailItem, setEmailingMailItem] = useState<MailItem | null>(null);
  const [emailingBulkItems, setEmailingBulkItems] = useState<MailItem[]>([]);
  const [suggestedTemplateType, setSuggestedTemplateType] = useState<string | undefined>(undefined);
  const [emailingGroupKey, setEmailingGroupKey] = useState<string | null>(null);

  const loadFollowUps = useCallback(async () => {
    try {
      setLoading(true);
      const statsData = await api.stats.getDashboardStats(7);
      setFollowUps(statsData.needsFollowUp || []);
    } catch (err) {
      console.error('Error loading follow-ups:', err);
      toast.error(t('followUps.failedToLoad'));
    } finally {
      setLoading(false);
    }
  }, []);

  const loadDismissedItems = useCallback(async () => {
    try {
      setLoadingDismissed(true);
      const data = await api.mailItems.getDismissedContacts();
      // Only use dismissed items (we no longer use contact-level dismissals)
      setDismissedItems(data?.dismissedItems || []);
    } catch (err) {
      console.error('Error loading dismissed items:', err);
      toast.error(t('followUps.failedToLoadDismissed'));
    } finally {
      setLoadingDismissed(false);
    }
  }, [t]);

  useEffect(() => {
    void loadFollowUps();
    void loadDismissedItems();
  }, [loadFollowUps, loadDismissedItems]);

  // Open staff modal with pending action
  const openStaffModal = (
    title: string,
    description: string,
    action: (staffName: string) => Promise<void>
  ) => {
    setStaffModalTitle(title);
    setStaffModalDescription(description);
    setPendingAction(() => action);
    setStaffModalOpen(true);
  };

  // Handle staff selection confirmation
  const handleStaffConfirm = async (staffName: string) => {
    if (pendingAction) {
      await pendingAction(staffName);
    }
    setPendingAction(null);
  };

  // Dismiss all items for a contact (dismisses each item individually)
  const handleDismissContact = (group: GroupedFollowUp) => {
    const customerName = getCustomerDisplayName(group.contact);
    const contactId = group.contact.contact_id;
    const allItems = [...group.packages, ...group.letters];

    openStaffModal(
      t('followUps.dismissCustomer'),
      t('followUps.dismissCustomerDesc', { name: customerName }),
      async (staffName: string) => {
        // Optimistic update: immediately remove contact group from UI
        setFollowUps(prevFollowUps => 
          prevFollowUps.filter(g => g.contact.contact_id !== contactId)
        );

        try {
          // Dismiss each item individually
          await Promise.all(
            allItems.map(item => api.mailItems.dismissItem(item.mail_item_id, staffName))
          );
          toast.success(t('followUps.contactDismissed', { name: customerName }));
          // Reload to ensure data is in sync
          await loadFollowUps();
          await loadDismissedItems();
        } catch (err) {
          console.error('Error dismissing contact items:', err);
          toast.error(t('followUps.failedToDismiss'));
          // Reload to restore if API failed
          await loadFollowUps();
        }
      }
    );
  };

  // Dismiss a single item from follow-up
  const handleDismissItem = (itemId: string, _group: GroupedFollowUp) => {
    openStaffModal(
      t('followUps.dismissItemTitle'),
      t('followUps.dismissItemDesc'),
      async (staffName: string) => {
        // Optimistic update: immediately remove item from UI
        setFollowUps(prevFollowUps => {
          return prevFollowUps.map(group => {
            const updatedPackages = group.packages.filter(p => p.mail_item_id !== itemId);
            const updatedLetters = group.letters.filter(l => l.mail_item_id !== itemId);
            
            // If group has no items left, it will be filtered out below
            return {
              ...group,
              packages: updatedPackages,
              letters: updatedLetters,
            };
          }).filter(group => group.packages.length > 0 || group.letters.length > 0);
        });

        try {
          await api.mailItems.dismissItem(itemId, staffName);
          toast.success(t('followUps.itemDismissed'));
          // Reload to ensure data is in sync with server
          await loadFollowUps();
        } catch (err) {
          console.error('Error dismissing item:', err);
          toast.error(t('followUps.failedToDismiss'));
          // Reload to restore the item if API failed
          await loadFollowUps();
        }
      }
    );
  };

  // Restore a dismissed item (no staff needed - just restore)
  const handleRestoreItem = async (item: DismissedItem) => {
    const itemId = item.mail_item_id;
    
    // Optimistic update: immediately remove from dismissed items list
    setDismissedItems(prev => prev.filter(i => i.mail_item_id !== itemId));

    try {
      await api.mailItems.restoreItem(itemId);
      toast.success(t('followUps.itemRestored'));
      await loadFollowUps();
      await loadDismissedItems();
    } catch (err) {
      console.error('Error restoring item:', err);
      toast.error(t('followUps.failedToRestore'));
      // Reload to restore if API failed
      await loadDismissedItems();
    }
  };

  // Mark a dismissed item as resolved (removes from dismissed list permanently)
  const handleMarkResolved = async (item: DismissedItem) => {
    const itemId = item.mail_item_id;
    
    // Optimistic update: immediately remove from dismissed items list
    setDismissedItems(prev => prev.filter(i => i.mail_item_id !== itemId));

    try {
      await api.mailItems.updateStatus(itemId, 'Resolved');
      toast.success(t('followUps.itemResolved'));
      await loadDismissedItems();
    } catch (err) {
      console.error('Error marking item as resolved:', err);
      toast.error(t('common.error'));
      // Reload to restore if API failed
      await loadDismissedItems();
    }
  };

  const getDaysSince = (dateStr: string) => {
    const todayNY = getTodayNY();
    const todayDate = new Date(todayNY + 'T00:00:00');
    const itemDateNY = toNYDateString(dateStr);
    const itemDate = new Date(itemDateNY + 'T00:00:00');
    const diffTime = todayDate.getTime() - itemDate.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  };

  const openSendEmailForGroup = (group: GroupedFollowUp) => {
    const allItems = [...group.packages, ...group.letters];
    const firstItem = allItems[0];
    
    if (firstItem && allItems.length > 0) {
      const oldestDays = Math.max(...allItems.map(item => getDaysSince(item.received_date)));
      
      let suggested: string | undefined;
      if (allItems.length > 1) {
        suggested = 'Summary Notification (All Items)';
      } else if (oldestDays >= 28) {
        suggested = 'Final Notice Before Abandonment';
      } else if (group.totalFees > 0) {
        suggested = 'Package Fee Reminder';
      } else {
        suggested = 'General Reminder';
      }
      
      setSuggestedTemplateType(suggested);
      setEmailingBulkItems(allItems);
      
      const groupKey = `${firstItem.contact_id}|${extractNYDate(firstItem.received_date)}|${firstItem.item_type}`;
      setEmailingGroupKey(groupKey);
      
      setEmailingMailItem(firstItem);
      setIsSendEmailModalOpen(true);
    }
  };

  const handleEmailSuccess = async () => {
    const isBulk = emailingBulkItems.length > 0;
    await new Promise(resolve => setTimeout(resolve, isBulk ? 800 : 200));
    
    loadFollowUps();
    
    if (emailingMailItem) {
      const customerName = emailingMailItem.contacts?.contact_person || 
                          emailingMailItem.contacts?.company_name || 
                          'Customer';
      
      if (isBulk) {
        const groupKeys = emailingBulkItems.map(item => 
          `${item.contact_id}|${extractNYDate(item.received_date)}|${item.item_type}`
        );
        const uniqueGroupKeys = [...new Set(groupKeys)];
        
        toast.success(
          (t) => (
            <div className="flex items-center justify-between gap-4">
              <span>📧 Summary email sent to {customerName} ({emailingBulkItems.length} items)</span>
              <button
                onClick={() => {
                  toast.dismiss(t.id);
                  navigate('/dashboard/mail', { 
                    state: { 
                      jumpToGroupKeys: uniqueGroupKeys,
                      sortByLastNotified: true
                    } 
                  });
                }}
                className="text-blue-600 hover:underline text-sm font-medium whitespace-nowrap"
              >
                View in Log →
              </button>
            </div>
          ),
          { duration: 15000 }
        );
      } else {
        const groupKey = emailingGroupKey || 
          `${emailingMailItem.contact_id}|${extractNYDate(emailingMailItem.received_date)}|${emailingMailItem.item_type}`;
        
        toast.success(
          (t) => (
            <div className="flex items-center justify-between gap-4">
              <span>✅ Email sent to {customerName}</span>
              <button
                onClick={() => {
                  toast.dismiss(t.id);
                  navigate('/dashboard/mail', { 
                    state: { 
                      jumpToGroupKey: groupKey,
                      sortByLastNotified: true
                    } 
                  });
                }}
                className="text-blue-600 hover:underline text-sm"
              >
                View in Log →
              </button>
            </div>
          ),
          { duration: 15000 }
        );
      }
    }
    
    setIsSendEmailModalOpen(false);
    setEmailingMailItem(null);
    setEmailingBulkItems([]);
    setEmailingGroupKey(null);
  };

  const handleMarkAbandoned = (group: GroupedFollowUp) => {
    const allItems = [...group.packages, ...group.letters];
    const abandonedItems = allItems.filter(item => getDaysSince(item.received_date) >= 30);
    
    if (abandonedItems.length === 0) {
      toast.error(t('followUps.noItemsOver30Days'));
      return;
    }
    
    const customerName = group.contact.contact_person || group.contact.company_name || 'Unknown';
    const confirmMessage = abandonedItems.length === 1
      ? t('followUps.confirmAbandonSingle', { name: customerName })
      : t('followUps.confirmAbandon', { count: abandonedItems.length, name: customerName });
    
    // Open confirm modal instead of browser confirm
    setConfirmModalTitle(t('followUps.markAbandoned'));
    setConfirmModalMessage(confirmMessage);
    setConfirmModalAction(() => async () => {
      setConfirmModalLoading(true);
      try {
        for (const item of abandonedItems) {
          await api.mailItems.updateStatus(item.mail_item_id, 'Abandoned Package');
        }
        
        await new Promise(resolve => setTimeout(resolve, 200));
        
        loadFollowUps();
        
        toast.success(
          t('followUps.markedAbandoned', { count: abandonedItems.length, name: customerName })
        );
      } catch (err) {
        console.error('Error marking items as abandoned:', err);
        toast.error(t('followUps.failedToMarkAbandoned'));
      } finally {
        setConfirmModalLoading(false);
      }
    });
    setConfirmModalOpen(true);
  };

  // Handle confirm modal confirmation
  const handleConfirmModalConfirm = async () => {
    if (confirmModalAction) {
      await confirmModalAction();
    }
    setConfirmModalOpen(false);
    setConfirmModalAction(null);
  };

  // Show loading state while data is being fetched
  if (loading) {
    return (
      <div className="max-w-full mx-auto px-4 md:px-8 lg:px-16 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-gray-900">{t('followUps.title')}</h1>
        </div>

        {/* Loading Animation */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-12 flex flex-col items-center justify-center">
          <div className="w-32 h-32">
            <img
              src="/mail-moving-animation.gif"
              alt="Loading mail animation"
              className="w-full h-full object-contain"
            />
          </div>
          <p className="mt-4 text-lg font-medium text-gray-600 animate-pulse">
            {t('common.loading')}
          </p>
        </div>
      </div>
    );
  }

  // Calculate summary stats
  const totalCustomers = followUps.length;
  const totalFees = followUps.reduce((sum, g) => sum + g.totalFees, 0);
  const abandonedCount = followUps.filter(g => {
    const allItems = [...g.packages, ...g.letters];
    const oldestDays = Math.max(...allItems.map(item => getDaysSince(item.received_date)));
    return oldestDays >= 30;
  }).length;

  return (
    <div className="max-w-full mx-auto px-4 md:px-8 lg:px-16 py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-900">{t('followUps.title')}</h1>

        {/* Summary stats */}
        {totalCustomers > 0 && (
          <div className="flex items-center gap-6 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <span className="text-xl font-semibold text-gray-900">{totalCustomers}</span>
              <span>{t('nav.customers').toLowerCase()}</span>
            </div>
            {totalFees > 0 && (
              <>
                <div className="w-px h-5 bg-gray-300" />
                <div className="flex items-center gap-2">
                  <span className="text-xl font-semibold text-gray-900">${totalFees.toFixed(0)}</span>
                  <span>{t('followUps.inFees')}</span>
                </div>
              </>
            )}
            {abandonedCount > 0 && (
              <>
                <div className="w-px h-5 bg-gray-300" />
                <div className="flex items-center gap-2">
                  <span className="text-xl font-semibold text-red-600">{abandonedCount}</span>
                  <span>{t('followUps.daysPlus', { count: 30 })}</span>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* View Dismissed Toggle */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => setShowDismissed(!showDismissed)}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
            showDismissed
              ? 'bg-gray-800 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <EyeOff className="w-4 h-4" />
          {showDismissed ? t('followUps.showActive') : t('followUps.viewDismissed')}
          {dismissedItems.length > 0 && (
            <span className={`ml-1 px-2 py-0.5 text-xs rounded-full ${
              showDismissed ? 'bg-white/20' : 'bg-gray-300'
            }`}>
              {dismissedItems.length}
            </span>
          )}
        </button>
      </div>

      {/* Dismissed Section */}
      {showDismissed && (
        <div className="mb-8 space-y-6">
          {/* Dismissed Items (Individual) */}
          {dismissedItems.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold text-gray-700 mb-4">{t('followUps.dismissedItems')}</h2>
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t('followUps.item')}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t('followUps.customer')}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t('followUps.dismissedBy')}
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t('followUps.actions')}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {dismissedItems.map((item) => (
                      <tr key={item.mail_item_id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <span>{item.item_type === 'Package' ? '📦' : '✉️'}</span>
                            <span className="font-medium text-gray-900">{item.item_type}</span>
                            {item.quantity > 1 && (
                              <span className="text-gray-500">x{item.quantity}</span>
                            )}
                          </div>
                          <div className="text-sm text-gray-500">
                            {new Date(item.received_date).toLocaleDateString()}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="font-medium text-gray-900">
                            {getCustomerDisplayName(item.contacts)}
                          </div>
                          <div className="text-sm text-gray-500">
                            {t('followUps.mailbox')} {item.contacts?.mailbox_number || 'N/A'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {item.dismissed_by}
                          <div className="text-xs text-gray-400">
                            {new Date(item.dismissed_at).toLocaleDateString()}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <div className="flex items-center gap-2 justify-end">
                            <button
                              onClick={() => handleRestoreItem(item)}
                              className="px-3 py-1.5 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5"
                              title={t('followUps.restore')}
                            >
                              <RotateCcw className="w-3.5 h-3.5" />
                              {t('followUps.restore')}
                            </button>
                            <button
                              onClick={() => handleMarkResolved(item)}
                              className="px-3 py-1.5 bg-green-100 hover:bg-green-200 text-green-700 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5"
                              title={t('followUps.markResolvedDesc')}
                            >
                              <CheckCircle className="w-3.5 h-3.5" />
                              {t('followUps.markResolved')}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* No dismissed items */}
          {loadingDismissed ? (
            <div className="bg-white rounded-xl p-8 text-center text-gray-500">
              {t('common.loading')}
            </div>
          ) : dismissedItems.length === 0 && (
            <div className="bg-white rounded-xl p-8 text-center text-gray-500">
              {t('followUps.noDismissed')}
            </div>
          )}
        </div>
      )}

      {/* Color Legend */}
      {followUps.length > 0 && (
        <div className="flex flex-wrap items-center justify-end gap-4 mb-4 text-xs text-gray-600">
          <span className="font-medium text-gray-700">{t('followUps.colorLegend')}:</span>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-gradient-to-br from-red-100 to-pink-100 border border-red-300"></span>
            <span>{t('followUps.legend30Days')}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-gradient-to-br from-amber-100 to-yellow-100 border border-amber-300"></span>
            <span>{t('followUps.legend14Days')}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 border border-blue-300"></span>
            <span>{t('followUps.legend7Days')}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-gradient-to-br from-gray-100 to-slate-100 border border-gray-300"></span>
            <span>{t('followUps.legendRecent')}</span>
          </div>
        </div>
      )}

      {/* Follow-up Cards */}
      <GroupedFollowUpSection
        groups={followUps}
        onSendEmail={openSendEmailForGroup}
        onMarkAbandoned={handleMarkAbandoned}
        onDismissContact={handleDismissContact}
        onDismissItem={handleDismissItem}
        getDaysSince={getDaysSince}
        loading={false}
      />

      {/* Send Email Modal */}
      {emailingMailItem && (
        <SendEmailModal
          isOpen={isSendEmailModalOpen}
          onClose={() => {
            setIsSendEmailModalOpen(false);
            setEmailingMailItem(null);
            setEmailingBulkItems([]);
            setSuggestedTemplateType(undefined);
          }}
          mailItem={emailingMailItem}
          bulkMailItems={emailingBulkItems}
          onSuccess={handleEmailSuccess}
          suggestedTemplateType={suggestedTemplateType}
        />
      )}

      {/* Staff Select Modal (for dismiss/restore actions) */}
      <StaffSelectModal
        isOpen={staffModalOpen}
        onClose={() => {
          setStaffModalOpen(false);
          setPendingAction(null);
        }}
        onConfirm={handleStaffConfirm}
        title={staffModalTitle}
        description={staffModalDescription}
      />

      {/* Confirm Modal (for mark abandoned) */}
      <ConfirmModal
        isOpen={confirmModalOpen}
        onClose={() => {
          setConfirmModalOpen(false);
          setConfirmModalAction(null);
          setConfirmModalLoading(false);
        }}
        onConfirm={handleConfirmModalConfirm}
        title={confirmModalTitle}
        message={confirmModalMessage}
        confirmText={t('common.confirm')}
        variant="danger"
        isLoading={confirmModalLoading}
      />
    </div>
  );
}
