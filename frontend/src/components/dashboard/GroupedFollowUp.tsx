/**
 * Grouped Follow-Up Component
 * 
 * Displays mail items that need follow-up, grouped by person.
 * Modern card-based design inspired by job listing cards.
 * 
 * Urgency Priority:
 * 1. Packages with fees (orange/peach background)
 * 2. Abandoned items 30+ days (red/pink background)
 * 3. Regular items (gray/neutral background)
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { AlertCircle, Package, Mail, ChevronDown, Send, DollarSign, Clock, CheckCircle, User } from 'lucide-react';
import { getCustomerDisplayName } from '../../utils/customerDisplay';
import { useLanguage } from '../../contexts/LanguageContext';
import { formatNYDate } from '../../utils/timezone';

interface PackageFee {
  fee_id: string;
  mail_item_id: string;
  fee_amount: number;
  days_charged: number;
  fee_status: 'pending' | 'paid' | 'waived';
}

interface MailItem {
  mail_item_id: string;
  contact_id: string;
  item_type: string;
  status: string;
  received_date: string;
  quantity?: number;
  last_notified?: string;
  packageFee?: PackageFee;
  contacts?: {
    contact_person?: string;
    company_name?: string;
    mailbox_number?: string;
    display_name_preference?: 'company' | 'person' | 'both';
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

interface GroupedFollowUpProps {
  groups: GroupedFollowUp[];
  onSendEmail: (group: GroupedFollowUp) => void;
  onMarkAbandoned: (group: GroupedFollowUp) => void;
  onDismissContact: (group: GroupedFollowUp) => void;
  onDismissItem: (itemId: string, group: GroupedFollowUp) => void;
  getDaysSince: (date: string) => number;
  loading?: boolean;
}

// Get background color based on urgency
const getCardColors = (isAbandoned: boolean, hasFees: boolean, oldestDays: number) => {
  if (isAbandoned) {
    return {
      bg: 'bg-gradient-to-br from-red-50 to-pink-50',
      border: 'border-red-200',
      dateBg: 'bg-red-100 text-red-700',
      accent: 'text-red-600'
    };
  }
  if (hasFees) {
    return {
      bg: 'bg-gradient-to-br from-orange-50 to-amber-50',
      border: 'border-orange-200',
      dateBg: 'bg-orange-100 text-orange-700',
      accent: 'text-orange-600'
    };
  }
  if (oldestDays >= 14) {
    return {
      bg: 'bg-gradient-to-br from-amber-50 to-yellow-50',
      border: 'border-amber-200',
      dateBg: 'bg-amber-100 text-amber-700',
      accent: 'text-amber-600'
    };
  }
  if (oldestDays >= 7) {
    return {
      bg: 'bg-gradient-to-br from-blue-50 to-indigo-50',
      border: 'border-blue-200',
      dateBg: 'bg-blue-100 text-blue-700',
      accent: 'text-blue-600'
    };
  }
  return {
    bg: 'bg-gradient-to-br from-gray-50 to-slate-50',
    border: 'border-gray-200',
    dateBg: 'bg-gray-100 text-gray-700',
    accent: 'text-gray-600'
  };
};

export default function GroupedFollowUpSection({
  groups,
  onSendEmail,
  onMarkAbandoned,
  onDismissContact,
  onDismissItem,
  getDaysSince,
  loading
}: GroupedFollowUpProps) {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [displayCount, setDisplayCount] = useState(12);
  const [expandedPersons, setExpandedPersons] = useState<Set<string>>(new Set());

  const togglePersonExpand = (contactId: string) => {
    setExpandedPersons(prev => {
      const newSet = new Set(prev);
      if (newSet.has(contactId)) {
        newSet.delete(contactId);
      } else {
        newSet.add(contactId);
      }
      return newSet;
    });
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="w-24 h-24">
          <img
            src="/mail-moving-animation.gif"
            alt="Loading mail animation"
            className="w-full h-full object-contain"
          />
        </div>
        <p className="mt-4 text-base font-medium text-gray-600 animate-pulse">
          {t('followUps.loadingFollowUps')}
        </p>
      </div>
    );
  }

  if (!groups || groups.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">{t('followUps.allCaughtUp')}</h3>
        <p className="text-gray-600">{t('followUps.noCustomersNeedFollowUp')}</p>
        <p className="text-sm text-gray-500 mt-1">{t('followUps.greatJob')}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {groups.slice(0, displayCount).map((group) => {
        const customerName = getCustomerDisplayName(group.contact);
        const hasFees = group.totalFees > 0;
        const totalItems =
          group.packages.reduce((sum, pkg) => sum + (pkg.quantity || 1), 0) +
          group.letters.reduce((sum, letter) => sum + (letter.quantity || 1), 0);
        
        // Calculate oldest item age
        const allItems = [...group.packages, ...group.letters];
        const oldestDays = Math.max(
          ...allItems.map(item => getDaysSince(item.received_date))
        );
        const isAbandoned = oldestDays >= 30;
        const isPersonExpanded = expandedPersons.has(group.contact.contact_id);
        const colors = getCardColors(isAbandoned, hasFees, oldestDays);
        
        // Get oldest item date for display
        const oldestItem = allItems.reduce((oldest, item) => {
          const itemDate = new Date(item.received_date);
          const oldestDate = new Date(oldest.received_date);
          return itemDate < oldestDate ? item : oldest;
        }, allItems[0]);
        const oldestDateStr = formatNYDate(new Date(oldestItem.received_date), { month: 'short', day: 'numeric', year: 'numeric' });
        
        return (
          <div
            key={group.contact.contact_id}
            onClick={() => togglePersonExpand(group.contact.contact_id)}
            className={`relative rounded-2xl ${colors.bg} ${colors.border} border p-5 transition-all duration-200 hover:shadow-lg hover:-translate-y-1 cursor-pointer`}
          >
            {/* Top row: Date badge and expand indicator */}
            <div className="flex items-start justify-between mb-4">
              <span className={`px-3 py-1.5 rounded-full text-xs font-semibold ${colors.dateBg}`}>
                {oldestDateStr}
              </span>
              <div
                className={`p-1.5 rounded-lg transition-all duration-200 ${isPersonExpanded ? 'bg-gray-900 rotate-180' : 'bg-white/50'}`}
                title={isPersonExpanded ? t('followUps.clickToCollapse') : t('followUps.clickToExpand')}
              >
                <ChevronDown className={`w-4 h-4 transition-colors ${isPersonExpanded ? 'text-white' : 'text-gray-500'}`} />
              </div>
            </div>

            {/* Customer info */}
            <div className="mb-4">
              <p className="text-sm text-gray-500 mb-1">
                📮 {t('followUps.mailbox')} {group.contact.mailbox_number || 'N/A'}
              </p>
              <h3 className="text-xl font-bold text-gray-900 leading-tight">
                {customerName}
              </h3>
            </div>

            {/* Tags row */}
            <div className="flex flex-wrap gap-2 mb-4">
              {/* Item count tag */}
              <span className="px-3 py-1 bg-white/70 border border-gray-200 rounded-full text-xs font-medium text-gray-700">
                {totalItems === 1 ? t('followUps.nItem', { count: totalItems }) : t('followUps.nItems', { count: totalItems })}
              </span>
              
              {/* Age tag */}
              <span className={`px-3 py-1 bg-white/70 border rounded-full text-xs font-medium ${
                oldestDays >= 30 ? 'border-red-300 text-red-700' :
                oldestDays >= 14 ? 'border-orange-300 text-orange-700' :
                oldestDays >= 7 ? 'border-amber-300 text-amber-700' :
                'border-gray-200 text-gray-700'
              }`}>
                {t('followUps.nDays', { count: oldestDays })}
              </span>
              
              {/* Package/Letter breakdown */}
              {group.packages.length > 0 && (
                <span className="px-3 py-1 bg-white/70 border border-amber-200 rounded-full text-xs font-medium text-amber-700 flex items-center gap-1">
                  <Package className="w-3 h-3 text-amber-600" />
                  {group.packages.reduce((sum, pkg) => sum + (pkg.quantity || 1), 0)}
                </span>
              )}
              {group.letters.length > 0 && (
                <span className="px-3 py-1 bg-white/70 border border-blue-200 rounded-full text-xs font-medium text-blue-700 flex items-center gap-1">
                  <Mail className="w-3 h-3 text-blue-500" />
                  {group.letters.reduce((sum, letter) => sum + (letter.quantity || 1), 0)}
                </span>
              )}
              
            </div>

            {/* Expandable details - Table View */}
            {isPersonExpanded && (
              <div className="mb-4 animate-fadeIn">
                {/* Table Header */}
                <div className="grid grid-cols-12 gap-2 px-2 py-1.5 text-xs font-medium text-gray-400 uppercase tracking-wide">
                  <div className="col-span-3 text-center">{t('followUps.item')}</div>
                  <div className="col-span-2 text-center">{t('followUps.qty')}</div>
                  <div className="col-span-2 text-center">{t('followUps.age')}</div>
                  <div className="col-span-3 text-center">{t('followUps.fee')}</div>
                  <div className="col-span-2 text-center"></div>
                </div>

                {/* Aggregate packages by date */}
                {(() => {
                  // Group packages by date
                  const packagesByDate: Record<string, { items: typeof group.packages; totalQty: number; totalFee: number; hasWaived: boolean; hasPaid: boolean }> = {};
                  group.packages.forEach(pkg => {
                    const dateKey = format(new Date(pkg.received_date), 'yyyy-MM-dd');
                    if (!packagesByDate[dateKey]) {
                      packagesByDate[dateKey] = { items: [], totalQty: 0, totalFee: 0, hasWaived: false, hasPaid: false };
                    }
                    packagesByDate[dateKey].items.push(pkg);
                    packagesByDate[dateKey].totalQty += pkg.quantity || 1;
                    if (pkg.packageFee?.fee_amount) {
                      packagesByDate[dateKey].totalFee += pkg.packageFee.fee_amount;
                    }
                    if (pkg.packageFee?.fee_status === 'waived') packagesByDate[dateKey].hasWaived = true;
                    if (pkg.packageFee?.fee_status === 'paid') packagesByDate[dateKey].hasPaid = true;
                  });

                  // Sort by date (newest first)
                  const sortedDates = Object.keys(packagesByDate).sort((a, b) => b.localeCompare(a));

                  return sortedDates.map(dateKey => {
                    const data = packagesByDate[dateKey];
                    const days = getDaysSince(data.items[0].received_date);
                    const receivedDateStr = formatNYDate(new Date(dateKey), { month: 'short', day: 'numeric' });

                    return (
                      <div
                        key={`pkg-${dateKey}`}
                        className="grid grid-cols-12 gap-2 px-2 py-1.5 text-sm items-center group/row hover:bg-gray-50 rounded"
                      >
                        <div className="col-span-3 flex items-center gap-2">
                          <Package className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
                          <span className="text-gray-700 truncate">{receivedDateStr}</span>
                        </div>
                        <div className="col-span-2 text-center text-gray-600">{data.totalQty}</div>
                        <div className="col-span-2 text-center text-gray-600">
                          {t('followUps.nDays', { count: days })}
                        </div>
                        <div className="col-span-3 text-center">
                          {data.totalFee > 0 ? (
                            <span className={data.hasWaived ? 'text-gray-400 line-through' : 'text-gray-600'}>
                              ${data.totalFee.toFixed(2)}
                              {data.hasPaid && <span className="text-green-600 ml-1">✓</span>}
                            </span>
                          ) : (
                            <span className="text-gray-300">—</span>
                          )}
                        </div>
                        <div className="col-span-2 text-right opacity-0 group-hover/row:opacity-100 transition-opacity">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              // Dismiss all items in this date group
                              data.items.forEach(item => onDismissItem(item.mail_item_id, group));
                            }}
                            className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded transition-colors"
                            title={t('followUps.dismissItem')}
                          >
                            <span className="text-xs">✕</span>
                          </button>
                        </div>
                      </div>
                    );
                  });
                })()}

                {/* Aggregate letters by date */}
                {(() => {
                  // Group letters by date
                  const lettersByDate: Record<string, { items: typeof group.letters; totalQty: number }> = {};
                  group.letters.forEach(letter => {
                    const dateKey = format(new Date(letter.received_date), 'yyyy-MM-dd');
                    if (!lettersByDate[dateKey]) {
                      lettersByDate[dateKey] = { items: [], totalQty: 0 };
                    }
                    lettersByDate[dateKey].items.push(letter);
                    lettersByDate[dateKey].totalQty += letter.quantity || 1;
                  });

                  // Sort by date (newest first)
                  const sortedDates = Object.keys(lettersByDate).sort((a, b) => b.localeCompare(a));

                  return sortedDates.map(dateKey => {
                    const data = lettersByDate[dateKey];
                    const days = getDaysSince(data.items[0].received_date);
                    const receivedDateStr = formatNYDate(new Date(dateKey), { month: 'short', day: 'numeric' });

                    return (
                      <div
                        key={`letter-${dateKey}`}
                        className="grid grid-cols-12 gap-2 px-2 py-1.5 text-sm items-center group/row hover:bg-gray-50 rounded"
                      >
                        <div className="col-span-3 flex items-center gap-2">
                          <Mail className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" />
                          <span className="text-gray-700 truncate">{receivedDateStr}</span>
                        </div>
                        <div className="col-span-2 text-center text-gray-600">{data.totalQty}</div>
                        <div className="col-span-2 text-center text-gray-600">
                          {t('followUps.nDays', { count: days })}
                        </div>
                        <div className="col-span-3 text-center text-gray-300">—</div>
                        <div className="col-span-2 text-right opacity-0 group-hover/row:opacity-100 transition-opacity">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              // Dismiss all items in this date group
                              data.items.forEach(item => onDismissItem(item.mail_item_id, group));
                            }}
                            className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded transition-colors"
                            title={t('followUps.dismissItem')}
                          >
                            <span className="text-xs">✕</span>
                          </button>
                        </div>
                      </div>
                    );
                  });
                })()}
                
                {/* Footer with totals and last notified */}
                <div className="flex items-center justify-between text-xs text-gray-400 mt-2 pt-2">
                  <div className="flex items-center gap-3">
                    {group.packages.length > 0 && (
                      <span className="flex items-center gap-1 text-amber-700">
                        <Package className="w-3 h-3 text-amber-600" />
                        {group.packages.reduce((sum, pkg) => sum + (pkg.quantity || 1), 0)} {t('followUps.pkg')}
                      </span>
                    )}
                    {group.letters.length > 0 && (
                      <span className="flex items-center gap-1 text-blue-700">
                        <Mail className="w-3 h-3 text-blue-500" />
                        {group.letters.reduce((sum, letter) => sum + (letter.quantity || 1), 0)} {t('followUps.letters')}
                      </span>
                    )}
                  </div>
                  {group.lastNotified && (
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {t('followUps.notifiedAgo', { days: getDaysSince(group.lastNotified) })}
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Bottom row: Fees and info */}
            <div className="flex items-center justify-between pt-3 border-t border-gray-200/50">
              <div>
                {hasFees ? (
                  <div>
                    <p className={`text-2xl font-bold ${colors.accent}`}>
                      ${group.totalFees.toFixed(2)}
                    </p>
                    <p className="text-xs text-gray-500">{t('followUps.storageFees')}</p>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 text-gray-500">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm text-green-600 font-medium">{t('followUps.noFees')}</span>
                  </div>
                )}
              </div>
              
              <div className={`px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${
                isPersonExpanded 
                  ? 'bg-gray-200 text-gray-600' 
                  : 'bg-gray-800 text-white'
              }`}>
                {isPersonExpanded ? t('followUps.clickToCollapse') : t('followUps.clickForDetails')}
              </div>
            </div>

            {/* Action buttons - shown when expanded */}
            {isPersonExpanded && (
              <div className="flex flex-wrap items-center gap-2 mt-4 pt-3 border-t border-gray-200/50">
                {/* Fee button - if has fees */}
                {hasFees && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate('/dashboard/fees');
                    }}
                    className="px-3 py-2 rounded-full text-xs font-medium flex items-center gap-1.5 transition-colors bg-green-100 hover:bg-green-200 text-green-700 border border-green-200"
                  >
                    <DollarSign className="w-3.5 h-3.5" />
                    {t('followUps.collect')}
                  </button>
                )}
                
                {/* Send Email/Reminder button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onSendEmail(group);
                  }}
                  className={`px-3 py-2 rounded-full text-xs font-medium flex items-center gap-1.5 transition-colors border ${
                    isAbandoned 
                      ? 'bg-red-100 hover:bg-red-200 text-red-700 border-red-200' 
                      : hasFees 
                        ? 'bg-orange-100 hover:bg-orange-200 text-orange-700 border-orange-200'
                        : 'bg-blue-100 hover:bg-blue-200 text-blue-700 border-blue-200'
                  }`}
                >
                  <Send className="w-3.5 h-3.5" />
                  {isAbandoned ? t('followUps.finalNotice') : t('followUps.remind')}
                </button>
                
                {/* Mark Abandoned button - if 30+ days */}
                {isAbandoned && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onMarkAbandoned(group);
                    }}
                    className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full text-xs font-medium transition-colors border border-gray-200"
                    title={t('followUps.markAbandoned')}
                  >
                    {t('followUps.abandon')}
                  </button>
                )}
                
                {/* View Profile button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/dashboard/contacts/${group.contact.contact_id}`);
                  }}
                  className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full text-xs font-medium transition-colors border border-gray-200 flex items-center gap-1.5"
                >
                  <User className="w-3.5 h-3.5" />
                  {t('followUps.profile')}
                </button>

                {/* Dismiss All button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDismissContact(group);
                  }}
                  className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-500 rounded-full text-xs font-medium transition-colors border border-gray-200"
                  title={t('followUps.dismissAllTooltip')}
                >
                  {t('followUps.dismissAll')}
                </button>
              </div>
            )}

            {/* Urgency warning - always visible for abandoned */}
            {isAbandoned && !isPersonExpanded && (
              <div className="mt-3 pt-3 border-t border-red-200/50">
                <p className="text-xs text-red-600 font-medium flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {t('followUps.requiresImmediateAttention', { days: oldestDays })}
                </p>
              </div>
            )}
          </div>
        );
      })}
      
      {/* Show more button */}
      {groups.length > displayCount && (
        <div className="md:col-span-2 xl:col-span-3">
          <button
            onClick={() => setDisplayCount(displayCount + 12)}
            className="w-full py-3 px-4 bg-white hover:bg-gray-50 text-gray-700 rounded-2xl font-medium transition-colors border border-gray-200 shadow-sm"
          >
            {t('followUps.showMoreCustomers', { count: Math.min(12, groups.length - displayCount) })}
          </button>
        </div>
      )}
    </div>
  );
}
