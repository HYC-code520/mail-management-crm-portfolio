import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Package, Bell, Search, ArrowUpDown, ArrowUp, ArrowDown, UserPlus, Plus, FileText, Clock, AlertCircle, CheckCircle2, TrendingUp, ChevronDown, ChevronUp } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { api } from '../lib/api-client.ts';

interface MailItem {
  mail_item_id: string;
  item_type: string;
  status: string;
  received_date: string;
  contact_id: string;
  quantity?: number;
  contacts?: {
    contact_person?: string;
    company_name?: string;
    mailbox_number?: string;
  };
}

interface Contact {
  contact_id: string;
  contact_person?: string;
  company_name?: string;
  mailbox_number?: string;
  status?: string;
  created_at?: string;
}

interface DashboardStats {
  todaysMail: number;
  pendingPickups: number;
  remindersDue: number;
  overdueMail: number;
  completedToday: number;
  recentMailItems: MailItem[];
  recentCustomers: Contact[];
  newCustomersToday: number;
  needsFollowUp: MailItem[];
  mailVolumeData: Array<{ date: string; count: number }>;
  customerGrowthData: Array<{ date: string; customers: number }>;
}

export default function DashboardPage() {
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [searchTerm, setSearchTerm] = useState('');
  const [isFollowUpExpanded, setIsFollowUpExpanded] = useState(true);
  
  // Sorting states
  const [sortColumn, setSortColumn] = useState<'date' | 'type' | 'customer' | 'status'>('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [contacts, mailItems] = await Promise.all([
        api.contacts.getAll(),
        api.mailItems.getAll()
      ]);

      const today = new Date().toISOString().split('T')[0];
      const now = new Date();
      
      // Filter active customers (not archived)
      const activeContacts = contacts.filter((c: Contact) => c.status !== 'No');
      
      // Get customers added today
      const newCustomersToday = activeContacts.filter((c: Contact) => 
        c.created_at?.startsWith(today)
      ).length;
      
      // Get recent customers (last 5)
      const recentCustomers = activeContacts
        .sort((a: Contact, b: Contact) => 
          new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime()
        )
        .slice(0, 5);
      
      // Calculate overdue mail (Notified for more than 7 days)
      const sevenDaysAgo = new Date(now);
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      
      const overdueMail = mailItems.filter((item: MailItem) => {
        if (item.status === 'Notified') {
          const receivedDate = new Date(item.received_date);
          return receivedDate < sevenDaysAgo;
        }
        return false;
      }).length;

      // Calculate completed today
      const completedToday = mailItems.filter((item: MailItem) => 
        item.status === 'Picked Up' && item.received_date?.startsWith(today)
      ).length;

      // Find mail that needs follow-up
      const twoDaysAgo = new Date(now);
      twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
      
      const needsFollowUp = mailItems.filter((item: MailItem) => {
        // Urgent: Notified for more than 2 days
        if (item.status === 'Notified') {
          const receivedDate = new Date(item.received_date);
          return receivedDate < twoDaysAgo;
        }
        // Action needed: Still in Received status
        if (item.status === 'Received') {
          return true;
        }
        return false;
      }).slice(0, 10); // Limit to 10 items

      // Calculate 7-day mail volume
      const mailVolumeData = [];
      for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        const count = mailItems.filter((item: MailItem) => 
          item.received_date?.startsWith(dateStr)
        ).length;
        mailVolumeData.push({
          date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          count
        });
      }

      // Calculate 30-day customer growth
      const customerGrowthData = [];
      const last30Days = [];
      for (let i = 29; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        last30Days.push(date.toISOString().split('T')[0]);
      }

      // Sample every 3 days for readability
      for (let i = 0; i < last30Days.length; i += 3) {
        const dateStr = last30Days[i];
        const date = new Date(dateStr);
        const customersUpToDate = activeContacts.filter((c: Contact) => 
          c.created_at && c.created_at <= dateStr
        ).length;
        customerGrowthData.push({
          date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          customers: customersUpToDate
        });
      }
      
      setStats({
        todaysMail: mailItems.filter((item: MailItem) => 
          item.received_date?.startsWith(today)
        ).length,
        pendingPickups: mailItems.filter((item: MailItem) => 
          item.status === 'Notified'
        ).length,
        remindersDue: mailItems.filter((item: MailItem) => 
          item.status === 'Received'
        ).length,
        overdueMail,
        completedToday,
        recentMailItems: mailItems.slice(0, 6),
        recentCustomers,
        newCustomersToday,
        needsFollowUp,
        mailVolumeData,
        customerGrowthData
      });
    } catch (err) {
      console.error('Error loading dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const getDaysSince = (dateStr: string) => {
    const now = new Date();
    const date = new Date(dateStr);
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="animate-pulse space-y-8">
          <div className="h-8 bg-gray-200 rounded w-48"></div>
          <div className="grid grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-32 bg-gray-100 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const handleSort = (column: 'date' | 'type' | 'customer' | 'status') => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection(column === 'date' ? 'desc' : 'asc');
    }
  };

  const filteredItems = stats?.recentMailItems.filter((item: any) => {
    const matchesStatus = statusFilter === 'All Status' || item.status === statusFilter;
    const matchesSearch = searchTerm === '' || 
      item.contacts?.contact_person?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.contacts?.company_name?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  }) || [];

  const sortedItems = [...filteredItems].sort((a, b) => {
    let comparison = 0;
    
    switch (sortColumn) {
      case 'date':
        comparison = new Date(a.received_date).getTime() - new Date(b.received_date).getTime();
        break;
      case 'type':
        comparison = a.item_type.localeCompare(b.item_type);
        break;
      case 'customer':
        const nameA = a.contacts?.contact_person || a.contacts?.company_name || '';
        const nameB = b.contacts?.contact_person || b.contacts?.company_name || '';
        comparison = nameA.localeCompare(nameB);
        break;
      case 'status':
        comparison = a.status.localeCompare(b.status);
        break;
    }
    
    return sortDirection === 'asc' ? comparison : -comparison;
  });

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600">Mail activity overview and quick actions</p>
      </div>

      {/* Quick Action Buttons */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <button
          onClick={() => navigate('/dashboard/mail')}
          className="flex items-center justify-center gap-3 px-6 py-4 bg-black hover:bg-gray-800 text-white rounded-lg font-medium transition-colors shadow-lg hover:shadow-xl"
        >
          <Mail className="w-5 h-5" />
          <span>Log New Mail</span>
        </button>
        <button
          onClick={() => navigate('/dashboard/contacts/new')}
          className="flex items-center justify-center gap-3 px-6 py-4 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors shadow-lg hover:shadow-xl"
        >
          <UserPlus className="w-5 h-5" />
          <span>Add Customer</span>
        </button>
        <button
          onClick={() => navigate('/dashboard/templates')}
          className="flex items-center justify-center gap-3 px-6 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors shadow-lg hover:shadow-xl"
        >
          <FileText className="w-5 h-5" />
          <span>View Templates</span>
        </button>
      </div>

      {/* Stats Cards - 4 columns */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        {/* Today's Mail */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-gray-600 text-sm mb-1">Today's Mail</p>
              <p className="text-4xl font-bold text-blue-600">{stats?.todaysMail || 0}</p>
              <p className="text-gray-500 text-sm mt-1">items received</p>
            </div>
            <Mail className="w-8 h-8 text-blue-600" />
          </div>
        </div>

        {/* Pending Pickups */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-gray-600 text-sm mb-1">Pending Pickups</p>
              <p className="text-4xl font-bold text-purple-600">{stats?.pendingPickups || 0}</p>
              <p className="text-gray-500 text-sm mt-1">awaiting collection</p>
            </div>
            <Package className="w-8 h-8 text-purple-600" />
          </div>
        </div>

        {/* Overdue! */}
        <div className="bg-white border border-red-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-red-600 text-sm mb-1 font-semibold">Overdue!</p>
              <p className="text-4xl font-bold text-red-600">{stats?.overdueMail || 0}</p>
              <p className="text-gray-500 text-sm mt-1">&gt;7 days notified</p>
            </div>
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
        </div>

        {/* Completed Today */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-gray-600 text-sm mb-1">Completed Today</p>
              <p className="text-4xl font-bold text-green-600">{stats?.completedToday || 0}</p>
              <p className="text-gray-500 text-sm mt-1">picked up</p>
            </div>
            <CheckCircle2 className="w-8 h-8 text-green-600" />
          </div>
        </div>
      </div>

      {/* Needs Follow-Up Widget - HIGH PRIORITY */}
      {stats && stats.needsFollowUp.length > 0 && (
        <div className="bg-amber-50 border-2 border-amber-300 rounded-lg mb-8">
          <div 
            className="p-4 cursor-pointer hover:bg-amber-100 transition-colors flex items-center justify-between"
            onClick={() => setIsFollowUpExpanded(!isFollowUpExpanded)}
          >
            <div className="flex items-center gap-3">
              <Clock className="w-6 h-6 text-amber-600" />
              <div>
                <h3 className="text-lg font-bold text-gray-900">⚠️ Needs Follow-Up</h3>
                <p className="text-sm text-gray-600">{stats.needsFollowUp.length} items require attention</p>
              </div>
            </div>
            {isFollowUpExpanded ? <ChevronUp className="w-5 h-5 text-gray-600" /> : <ChevronDown className="w-5 h-5 text-gray-600" />}
          </div>
          
          {isFollowUpExpanded && (
            <div className="p-4 pt-0 space-y-3">
              {stats.needsFollowUp.map((item) => {
                const daysSince = getDaysSince(item.received_date);
                const isUrgent = item.status === 'Notified' && daysSince > 2;
                
                return (
                  <div
                    key={item.mail_item_id}
                    className={`flex items-center justify-between p-4 bg-white rounded-lg border-2 ${
                      isUrgent ? 'border-red-300' : 'border-yellow-300'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-3 h-3 rounded-full ${isUrgent ? 'bg-red-600' : 'bg-yellow-600'}`}></div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {item.contacts?.contact_person || item.contacts?.company_name || 'Unknown Customer'}
                        </p>
                        <p className="text-sm text-gray-600">
                          📮 {item.contacts?.mailbox_number} • {item.item_type}
                          {isUrgent ? ` • Notified ${daysSince} days ago` : ' • Not yet notified'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {item.status === 'Received' && (
                        <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded">
                          Need to Notify
                        </span>
                      )}
                      {isUrgent && (
                        <span className="px-3 py-1 bg-red-100 text-red-700 text-xs font-medium rounded">
                          Urgent!
                        </span>
                      )}
                      <button
                        onClick={() => navigate('/dashboard/mail')}
                        className="px-4 py-2 bg-black hover:bg-gray-800 text-white text-sm rounded-lg transition-colors"
                      >
                        Take Action
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Charts Row */}
      <div className="grid grid-cols-2 gap-6 mb-8">
        {/* Mail Volume Chart */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <TrendingUp className="w-6 h-6 text-blue-600" />
            <div>
              <h2 className="text-xl font-bold text-gray-900">Mail Volume</h2>
              <p className="text-sm text-gray-600">Last 7 days</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={stats?.mailVolumeData || []}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="date" 
                tick={{ fill: '#6B7280', fontSize: 12 }}
                tickLine={{ stroke: '#E5E7EB' }}
              />
              <YAxis 
                tick={{ fill: '#6B7280', fontSize: 12 }}
                tickLine={{ stroke: '#E5E7EB' }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#fff', 
                  border: '1px solid #E5E7EB',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Bar dataKey="count" fill="#3B82F6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Customer Growth Chart */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <UserPlus className="w-6 h-6 text-green-600" />
            <div>
              <h2 className="text-xl font-bold text-gray-900">Customer Growth</h2>
              <p className="text-sm text-gray-600">Last 30 days</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={stats?.customerGrowthData || []}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="date" 
                tick={{ fill: '#6B7280', fontSize: 12 }}
                tickLine={{ stroke: '#E5E7EB' }}
              />
              <YAxis 
                tick={{ fill: '#6B7280', fontSize: 12 }}
                tickLine={{ stroke: '#E5E7EB' }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#fff', 
                  border: '1px solid #E5E7EB',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="customers" 
                stroke="#10B981" 
                strokeWidth={3}
                dot={{ fill: '#10B981', r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Mail Activity */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm mb-8">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-900">Recent Mail Activity</h2>
            <div className="flex gap-3">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option>All Status</option>
                <option>Received</option>
                <option>Pending</option>
                <option>Notified</option>
                <option>Picked Up</option>
              </select>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 bg-gray-50 border border-gray-300 rounded-lg text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th 
                  className="text-left py-3 px-6 text-sm font-semibold text-gray-700 cursor-pointer hover:bg-gray-100 transition-colors select-none"
                  onClick={() => handleSort('date')}
                >
                  <div className="flex items-center gap-2">
                    Date
                    {sortColumn === 'date' ? (
                      sortDirection === 'asc' ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />
                    ) : (
                      <ArrowUpDown className="w-4 h-4 text-gray-400" />
                    )}
                  </div>
                </th>
                <th 
                  className="text-left py-3 px-6 text-sm font-semibold text-gray-700 cursor-pointer hover:bg-gray-100 transition-colors select-none"
                  onClick={() => handleSort('type')}
                >
                  <div className="flex items-center gap-2">
                    Type
                    {sortColumn === 'type' ? (
                      sortDirection === 'asc' ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />
                    ) : (
                      <ArrowUpDown className="w-4 h-4 text-gray-400" />
                    )}
                  </div>
                </th>
                <th className="text-left py-3 px-6 text-sm font-semibold text-gray-700">Qty</th>
                <th 
                  className="text-left py-3 px-6 text-sm font-semibold text-gray-700 cursor-pointer hover:bg-gray-100 transition-colors select-none"
                  onClick={() => handleSort('customer')}
                >
                  <div className="flex items-center gap-2">
                    Customer
                    {sortColumn === 'customer' ? (
                      sortDirection === 'asc' ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />
                    ) : (
                      <ArrowUpDown className="w-4 h-4 text-gray-400" />
                    )}
                  </div>
                </th>
                <th 
                  className="text-left py-3 px-6 text-sm font-semibold text-gray-700 cursor-pointer hover:bg-gray-100 transition-colors select-none"
                  onClick={() => handleSort('status')}
                >
                  <div className="flex items-center gap-2">
                    Status
                    {sortColumn === 'status' ? (
                      sortDirection === 'asc' ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />
                    ) : (
                      <ArrowUpDown className="w-4 h-4 text-gray-400" />
                    )}
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedItems.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-12">
                    <Mail className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No mail items yet</p>
                  </td>
                </tr>
              ) : (
                sortedItems.map((item: MailItem) => (
                  <tr key={item.mail_item_id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-6 text-gray-900">
                      {new Date(item.received_date).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' }).replace(/\//g, '-')}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2 text-gray-700">
                        {item.item_type === 'Package' ? (
                          <Package className="w-4 h-4" />
                        ) : (
                          <Mail className="w-4 h-4" />
                        )}
                        <span>{item.item_type}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-gray-900 font-semibold">
                      {item.quantity || 1}
                    </td>
                    <td className="py-4 px-6 text-gray-900">
                      {item.contacts?.contact_person || item.contacts?.company_name || 'Unknown'}
                    </td>
                    <td className="py-4 px-6">
                      <span className={`px-3 py-1 rounded text-xs font-medium ${
                        item.status === 'Received' ? 'bg-blue-100 text-blue-700' :
                        item.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                        item.status === 'Notified' ? 'bg-purple-100 text-purple-700' :
                        item.status === 'Picked Up' ? 'bg-green-100 text-green-700' :
                        item.status === 'Scanned Document' ? 'bg-cyan-100 text-cyan-700' :
                        item.status === 'Forward' ? 'bg-orange-100 text-orange-700' :
                        item.status === 'Abandoned Package' ? 'bg-red-100 text-red-700' :
                        'bg-gray-200 text-gray-700'
                      }`}>
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Customer Activity Section */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <UserPlus className="w-6 h-6 text-green-600" />
            <div>
              <h2 className="text-xl font-bold text-gray-900">Recent Customers</h2>
              <p className="text-sm text-gray-600">Latest customer additions</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold text-green-600">{stats?.newCustomersToday || 0}</p>
            <p className="text-sm text-gray-500">added today</p>
          </div>
        </div>

        <div className="space-y-3">
          {stats?.recentCustomers && stats.recentCustomers.length > 0 ? (
            stats.recentCustomers.map((customer) => (
              <div
                key={customer.contact_id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                onClick={() => navigate(`/dashboard/contacts/${customer.contact_id}`)}
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <UserPlus className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      {customer.contact_person || customer.company_name || 'Unknown'}
                    </p>
                    <p className="text-sm text-gray-600">
                      {customer.mailbox_number && `📮 ${customer.mailbox_number}`}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500">
                    {customer.created_at ? new Date(customer.created_at).toLocaleDateString() : 'Recently'}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              <UserPlus className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p>No recent customers</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
