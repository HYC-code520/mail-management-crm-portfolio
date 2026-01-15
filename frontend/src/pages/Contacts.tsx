import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Archive, ArchiveRestore, Eye, Edit, ArrowUpDown, ArrowUp, ArrowDown, Loader2, Mail } from 'lucide-react';
import { api } from '../lib/api-client.ts';
import toast from 'react-hot-toast';
import Modal from '../components/Modal.tsx';
import LoadingSpinner from '../components/LoadingSpinner.tsx';
import BulkEmailModal from '../components/BulkEmailModal.tsx';
import { validateContactForm } from '../utils/validation.ts';
import { getCustomerAvatarUrl } from '../utils/customerAvatars.ts';
import { useLanguage } from '../contexts/LanguageContext.tsx';

// Helper function to generate avatar color based on name
const getAvatarColor = (name: string): string => {
  const colors = [
    'bg-blue-500',
    'bg-green-500',
    'bg-purple-500',
    'bg-pink-500',
    'bg-indigo-500',
    'bg-red-500',
    'bg-yellow-500',
    'bg-teal-500',
  ];
  const index = name.charCodeAt(0) % colors.length;
  return colors[index];
};

// Helper function to get initials from name
const getInitials = (name: string): string => {
  const words = name.trim().split(' ');
  if (words.length >= 2) {
    return (words[0][0] + words[words.length - 1][0]).toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
};

interface Contact {
  contact_id: string;
  contact_person?: string;
  company_name?: string;
  unit_number?: string;
  mailbox_number?: string;
  email?: string;
  phone_number?: string;
  status?: string;
  language_preference?: string;
  service_tier?: number;
  display_name_preference?: 'company' | 'person' | 'both';
}

export default function ContactsPage() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  
  // Helper to translate contact status
  const translateStatus = (status: string | undefined) => {
    const statusKey = (status || 'Active').toLowerCase();
    return t(`customerStatus.${statusKey}`) || status || t('customerStatus.active');
  };
  
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [allContacts, setAllContacts] = useState<Contact[]>([]); // Store all contacts including archived
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showArchived, setShowArchived] = useState(false); // Toggle for showing archived
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isBulkEmailModalOpen, setIsBulkEmailModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const [deletingContactId, setDeletingContactId] = useState<string | null>(null);
  
  // Sorting states
  const [sortColumn, setSortColumn] = useState<'mailbox' | 'name' | 'status'>('mailbox');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  
  // Form data
  const [formData, setFormData] = useState({
    contact_person: '',
    company_name: '',
    mailbox_number: '',
    unit_number: '',
    email: '',
    phone_number: '',
    language_preference: 'English',
    service_tier: 1,
    status: 'Pending',
    display_name_preference: 'both' as 'company' | 'person' | 'both'
  });

  const loadContacts = useCallback(async () => {
    try {
      const data = await api.contacts.getAll();
      const contactsList = Array.isArray(data) ? data : [];
      setAllContacts(contactsList); // Store all contacts - filtering happens in useEffect
    } catch (err) {
      console.error('Error loading contacts:', err);
      toast.error(t('toast.failedToLoadContacts'));
    } finally {
      setLoading(false);
    }
  }, []); // No dependencies - just loads data once

  useEffect(() => {
    void loadContacts(); // Explicitly ignore the promise
  }, [loadContacts]);

  // Re-filter when showArchived toggle changes
  useEffect(() => {
    if (allContacts.length > 0) {
      const filteredContacts = showArchived 
        ? allContacts.filter(c => c.status === 'No')
        : allContacts.filter(c => c.status !== 'No');
      setContacts(filteredContacts);
    }
  }, [showArchived, allContacts]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Apply phone formatting if the field is 'phone_number'
    if (name === 'phone_number') {
      const formatted = formatPhoneNumber(value);
      setFormData(prev => ({
        ...prev,
        [name]: formatted
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: name === 'service_tier' ? parseInt(value) : value
      }));
    }
  };

  // Format phone number as user types: 917-822-5751
  const formatPhoneNumber = (value: string) => {
    // Remove all non-digits
    const digits = value.replace(/\D/g, '');
    
    // Limit to 10 digits
    const limitedDigits = digits.slice(0, 10);
    
    // Format: XXX-XXX-XXXX
    if (limitedDigits.length <= 3) {
      return limitedDigits;
    } else if (limitedDigits.length <= 6) {
      return `${limitedDigits.slice(0, 3)}-${limitedDigits.slice(3)}`;
    } else {
      return `${limitedDigits.slice(0, 3)}-${limitedDigits.slice(3, 6)}-${limitedDigits.slice(6)}`;
    }
  };

  const openEditModal = (contact: Contact) => {
    setEditingContact(contact);
    setFormData({
      contact_person: contact.contact_person || '',
      company_name: contact.company_name || '',
      mailbox_number: contact.mailbox_number || '',
      unit_number: contact.unit_number || '',
      email: contact.email || '',
      phone_number: contact.phone_number || '',
      language_preference: contact.language_preference || 'English',
      service_tier: contact.service_tier || 1,
      status: contact.status || 'Pending',
      display_name_preference: contact.display_name_preference || 'both'
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingContact(null);
    setFormData({
      contact_person: '',
      company_name: '',
      mailbox_number: '',
      unit_number: '',
      email: '',
      phone_number: '',
      language_preference: 'English',
      service_tier: 1,
      status: 'Pending',
      display_name_preference: 'both'
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form data
    const validation = validateContactForm(formData);
    
    if (!validation.isValid) {
      // Display validation errors
      if (validation.errors.general) {
        toast.error(validation.errors.general);
      }
      
      Object.entries(validation.errors).forEach(([field, error]) => {
        if (field !== 'general') {
          const fieldName = field.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
          toast.error(`${fieldName}: ${error}`);
        }
      });
      
      return;
    }

    if (!formData.mailbox_number) {
      toast.error(t('validation.mailboxRequired'));
      return;
    }

    setSaving(true);

    try {
      if (editingContact) {
        // Update existing contact
        await api.contacts.update(editingContact.contact_id, formData);
        toast.success(t('toast.customerUpdated'));
      } else {
        // Create new contact
        await api.contacts.create(formData);
        toast.success(t('toast.customerAdded'));
      }
      closeModal();
      loadContacts();
    } catch (err: any) {
      console.error('Failed to save contact:', err);
      
      // Handle backend validation errors
      if (err.response?.data?.details) {
        const backendErrors = err.response.data.details;
        Object.entries(backendErrors).forEach(([field, error]) => {
          const fieldName = field.replace('_', ' ').replace(/\b\w/g, l => (l as string).toUpperCase());
          toast.error(`${fieldName}: ${error}`);
        });
      } else {
        toast.error(`Failed to ${editingContact ? 'update' : 'add'} customer: ${err.message || 'Unknown error'}`);
      }
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (contactId: string) => {
    if (!confirm(t('warnings.confirmArchiveWithRestore'))) {
      return;
    }

    setDeletingContactId(contactId);

    try {
      await api.contacts.delete(contactId);
      toast.success(t('toast.customerArchived'));
      loadContacts();
    } catch (err) {
      console.error('Failed to delete contact:', err);
      toast.error(t('toast.failedToArchiveCustomer'));
    } finally {
      setDeletingContactId(null);
    }
  };

  const handleRestore = async (contactId: string) => {
    if (!confirm(t('warnings.confirmRestore'))) {
      return;
    }

    setDeletingContactId(contactId);

    try {
      // Restore by setting status back to 'Active'
      await api.contacts.update(contactId, { status: 'Active' });
      toast.success(t('toast.customerRestored'));
      loadContacts();
    } catch (err) {
      console.error('Failed to restore contact:', err);
      toast.error(t('toast.failedToRestoreCustomer'));
    } finally {
      setDeletingContactId(null);
    }
  };

  const handleSort = (column: 'mailbox' | 'name' | 'status') => {
    if (sortColumn === column) {
      // Toggle direction if clicking the same column
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // New column, default to ascending
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const filteredContacts = contacts.filter((contact) => {
    const matchesSearch = searchTerm === '' ||
      contact.contact_person?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.company_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.mailbox_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.unit_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.phone_number?.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesSearch;
  });

  // Sorting
  const sortedContacts = [...filteredContacts].sort((a, b) => {
    let comparison = 0;
    
    switch (sortColumn) {
      case 'mailbox':
        comparison = (a.mailbox_number || '').localeCompare(b.mailbox_number || '');
        break;
      case 'name': {
        const nameA = a.contact_person || a.company_name || '';
        const nameB = b.contact_person || b.company_name || '';
        comparison = nameA.localeCompare(nameB);
        break;
      }
      case 'status':
        comparison = (a.status || '').localeCompare(b.status || '');
        break;
    }
    
    return sortDirection === 'asc' ? comparison : -comparison;
  });

  if (loading) {
    return (
      <div className="max-w-full mx-auto px-16 py-6">
        <div className="flex items-center justify-center min-h-[60vh]">
          <LoadingSpinner 
            message={t('toast.loadingContacts')} 
            size="lg"
            variant="mail"
          />
        </div>
        <div className="animate-pulse space-y-6 opacity-50 mt-8">
          <div className="h-8 bg-gray-200 rounded w-48"></div>
          <div className="h-96 bg-gray-100 rounded-lg"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-full mx-auto px-16 py-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">{t('customers.title')}</h1>
        <div className="flex items-center gap-4">
          {/* Bulk Email Button */}
          <button
            onClick={() => setIsBulkEmailModalOpen(true)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
            title={t('customers.sendBulkEmailTooltip')}
          >
            <Mail className="w-4 h-4" />
            <span>{t('templates.sendEmail')}</span>
          </button>

          {/* Show Archived Toggle */}
          <button
            onClick={() => setShowArchived(!showArchived)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
              showArchived
                ? 'bg-gray-600 text-white hover:bg-gray-700'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {showArchived ? (
              <>
                <ArchiveRestore className="w-4 h-4" />
                <span>{t('customers.viewingArchived')}</span>
              </>
            ) : (
              <>
                <Archive className="w-4 h-4" />
                <span>{t('customers.showArchived')}</span>
              </>
            )}
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-6 py-2.5 bg-black hover:bg-gray-800 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
          >
            <span>+</span>
            <span>{t('customers.addNew')}</span>
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6 shadow-sm">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder={t('customers.searchPlaceholder')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-300 rounded-lg text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
        {filteredContacts.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">👥</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">{t('customers.noCustomers')}</h3>
            <p className="text-gray-600 mb-6">{t('customers.getStarted')}</p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-6 py-2.5 bg-black hover:bg-gray-800 text-white rounded-lg font-medium transition-colors"
            >
              + {t('customers.addNew')}
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  {/* Contact Name - Sortable */}
                  <th
                    className="text-left py-3 px-6 text-sm font-semibold text-gray-700 cursor-pointer hover:bg-gray-100 transition-colors select-none"
                    onClick={() => handleSort('name')}
                  >
                    <div className="flex items-center gap-2">
                      {t('customerForm.name')} / {t('customerForm.company')}
                      {sortColumn === 'name' ? (
                        sortDirection === 'asc' ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />
                      ) : (
                        <ArrowUpDown className="w-4 h-4 text-gray-400" />
                      )}
                    </div>
                  </th>
                  <th className="text-left py-3 px-6 text-sm font-semibold text-gray-700">{t('customerForm.email')}</th>
                  <th className="text-left py-3 px-6 text-sm font-semibold text-gray-700">{t('customerForm.phone')}</th>
                  <th className="text-left py-3 px-6 text-sm font-semibold text-gray-700">{t('customerForm.serviceTier')}</th>

                  {/* Mailbox # - Sortable */}
                  <th
                    className="text-left py-3 px-6 text-sm font-semibold text-gray-700 cursor-pointer hover:bg-gray-100 transition-colors select-none"
                    onClick={() => handleSort('mailbox')}
                  >
                    <div className="flex items-center gap-2">
                      {t('customerForm.mailboxNumber')}
                      {sortColumn === 'mailbox' ? (
                        sortDirection === 'asc' ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />
                      ) : (
                        <ArrowUpDown className="w-4 h-4 text-gray-400" />
                      )}
                    </div>
                  </th>

                  <th className="text-left py-3 px-6 text-sm font-semibold text-gray-700">{t('customerForm.unitNumber')}</th>

                  {/* Status - Sortable */}
                  <th
                    className="text-left py-3 px-6 text-sm font-semibold text-gray-700 cursor-pointer hover:bg-gray-100 transition-colors select-none"
                    onClick={() => handleSort('status')}
                  >
                    <div className="flex items-center gap-2">
                      {t('common.status')}
                      {sortColumn === 'status' ? (
                        sortDirection === 'asc' ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />
                      ) : (
                        <ArrowUpDown className="w-4 h-4 text-gray-400" />
                      )}
                    </div>
                  </th>

                  <th className="text-left py-3 px-6 text-sm font-semibold text-gray-700">{t('common.actions')}</th>
                </tr>
              </thead>
              <tbody>
                {sortedContacts.map((contact) => (
                  <tr 
                    key={contact.contact_id} 
                    onClick={() => navigate(`/dashboard/contacts/${contact.contact_id}`)}
                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        {/* Avatar */}
                        {(() => {
                          const customAvatar = getCustomerAvatarUrl(
                            contact.contact_id,
                            contact.mailbox_number,
                            contact.contact_person,
                            contact.company_name
                          );
                          
                          if (customAvatar) {
                            return (
                              <img
                                src={customAvatar}
                                alt={contact.contact_person || contact.company_name || 'Contact'}
                                className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                              />
                            );
                          }
                          
                          return (
                            <div className={`w-10 h-10 rounded-full ${getAvatarColor(contact.contact_person || contact.company_name || 'U')} flex items-center justify-center text-white text-sm font-bold flex-shrink-0`}>
                              {getInitials(contact.contact_person || contact.company_name || 'UN')}
                            </div>
                          );
                        })()}
                        {/* Name and Company */}
                        <div>
                          <div className="font-medium text-gray-900">
                            {contact.contact_person || contact.company_name || 'Unnamed'}
                          </div>
                          {contact.contact_person && contact.company_name && (
                            <div className="text-sm text-gray-500 mt-1">
                              {contact.company_name}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-gray-700">
                      {contact.email || '—'}
                    </td>
                    <td className="py-4 px-6 text-gray-700">
                      {contact.phone_number || '—'}
                    </td>
                    <td className="py-4 px-6 text-gray-700">
                      {contact.service_tier || '1'}
                    </td>
                    <td className="py-4 px-6 text-gray-700">
                      {contact.mailbox_number || '—'}
                    </td>
                    <td className="py-4 px-6 text-gray-700">
                      {contact.unit_number || '—'}
                    </td>
                    <td className="py-4 px-6">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        contact.status === 'Active' ? 'bg-black text-white' :
                        contact.status === 'Pending' ? 'bg-gray-200 text-gray-700' :
                        'bg-gray-200 text-gray-700'
                      }`}>
                        {translateStatus(contact.status)}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                        {!showArchived && (
                          <>
                            <button
                              onClick={() => navigate(`/dashboard/contacts/${contact.contact_id}`)}
                              className="p-2 text-green-600 hover:text-green-700 hover:bg-green-50 rounded-lg transition-colors group relative"
                              title="View"
                            >
                              <Eye className="w-4 h-4" />
                              <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                                View
                              </span>
                            </button>
                            <button
                              onClick={() => openEditModal(contact)}
                              className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors group relative"
                              title={t('common.edit')}
                            >
                              <Edit className="w-4 h-4" />
                              <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                                Edit
                              </span>
                            </button>
                            <button
                              onClick={() => handleDelete(contact.contact_id)}
                              disabled={deletingContactId === contact.contact_id}
                              className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed group relative"
                              title="Archive"
                            >
                              {deletingContactId === contact.contact_id ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <Archive className="w-4 h-4" />
                              )}
                              <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                                {deletingContactId === contact.contact_id ? 'Archiving...' : 'Archive'}
                              </span>
                            </button>
                          </>
                        )}
                        {showArchived && (
                          <button
                            onClick={() => handleRestore(contact.contact_id)}
                            disabled={deletingContactId === contact.contact_id}
                            className="p-2 text-green-600 hover:text-green-700 hover:bg-green-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed group relative"
                            title="Restore"
                          >
                            {deletingContactId === contact.contact_id ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <ArchiveRestore className="w-4 h-4" />
                            )}
                            <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                              {deletingContactId === contact.contact_id ? 'Restoring...' : 'Restore'}
                            </span>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {filteredContacts.length > 0 && (
        <div className="mt-4 text-sm text-gray-600 text-center">
          {t('customers.showing', { count: filteredContacts.length, total: contacts.length })}
        </div>
      )}

      {/* Add/Edit Customer Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingContact ? t('customers.editCustomer') : t('customers.addNew')}
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name & Company */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                {t('customerForm.name')} <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="contact_person"
                value={formData.contact_person}
                onChange={handleChange}
                placeholder={t('customerForm.fullName')}
                className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">{t('customerForm.company')}</label>
              <input
                type="text"
                name="company_name"
                value={formData.company_name}
                onChange={handleChange}
                placeholder={t('customerForm.companyName')}
                className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>

          {/* Mailbox & Language */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                {t('customerForm.mailboxNumber')} <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="mailbox_number"
                value={formData.mailbox_number}
                onChange={handleChange}
                placeholder="e.g., A1"
                required
                className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">{t('customerForm.languagePreference')}</label>
              <select
                name="language_preference"
                value={formData.language_preference}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="English">{t('languageOptions.english')}</option>
                <option value="Chinese">{t('languageOptions.chinese')}</option>
                <option value="Both">{t('languageOptions.both')}</option>
              </select>
            </div>
          </div>

          {/* Email & Phone */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">{t('customerForm.email')}</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="email@example.com"
                className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">{t('customerForm.phone')}</label>
              <input
                type="tel"
                name="phone_number"
                value={formData.phone_number}
                onChange={handleChange}
                placeholder="917-822-5751"
                maxLength={12}
                className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>

          {/* Unit & Service Tier */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">{t('customerForm.unitNumber')}</label>
              <input
                type="text"
                name="unit_number"
                value={formData.unit_number}
                onChange={handleChange}
                placeholder="e.g., 101"
                className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">{t('customerForm.serviceTier')}</label>
              <select
                name="service_tier"
                value={formData.service_tier}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="1">1</option>
                <option value="2">2</option>
              </select>
            </div>
          </div>

          {/* Customer Status */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">{t('customerForm.status')}</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="PENDING">{t('customerStatus.pending')}</option>
              <option value="Active">{t('customerStatus.active')}</option>
              <option value="No">{t('customerStatus.archived')}</option>
            </select>
          </div>

          {/* Display Name Preference */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              {t('customerForm.displayNamePreference')}
              <span className="text-xs text-gray-500 ml-2 font-normal">
                {t('customerForm.displayNameHelp')}
              </span>
            </label>
            <select
              name="display_name_preference"
              value={formData.display_name_preference}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="both">{t('customerForm.displayBoth')}</option>
              <option value="company">{t('customerForm.displayCompany')}</option>
              <option value="person">{t('customerForm.displayPerson')}</option>
            </select>
            <p className="text-xs text-gray-500 mt-1">
              {formData.display_name_preference === 'company' && formData.company_name && `Will show: "${formData.company_name}"`}
              {formData.display_name_preference === 'company' && !formData.company_name && 'Will show company name (enter company name above)'}
              {formData.display_name_preference === 'person' && formData.contact_person && `Will show: "${formData.contact_person}"`}
              {formData.display_name_preference === 'person' && !formData.contact_person && 'Will show person name (enter name above)'}
              {(formData.display_name_preference === 'both' || !formData.display_name_preference) && formData.company_name && formData.contact_person &&
                `Will show: "${formData.company_name} - ${formData.contact_person}"`}
              {(formData.display_name_preference === 'both' || !formData.display_name_preference) && (!formData.company_name || !formData.contact_person) &&
                t('customerForm.showsBothNames')}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              disabled={saving}
              className="flex-1 px-6 py-3 bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 rounded-lg font-medium transition-colors"
            >
              {t('common.cancel')}
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 px-6 py-3 bg-black hover:bg-gray-800 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? t('common.saving') : (editingContact ? t('customers.editCustomer') : t('customers.saveCustomer'))}
            </button>
          </div>
        </form>
      </Modal>

      {/* Bulk Email Modal */}
      <BulkEmailModal
        isOpen={isBulkEmailModalOpen}
        onClose={() => setIsBulkEmailModalOpen(false)}
        contacts={filteredContacts}
      />
    </div>
  );
}
