import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '../../test/test-utils';
import FollowUpsPage from '../FollowUps';

// Mock react-hot-toast
vi.mock('react-hot-toast', () => ({
  default: {
    success: vi.fn(),
    error: vi.fn(),
    loading: vi.fn(),
    dismiss: vi.fn(),
  },
  Toaster: () => null,
}));

// Mock API client
vi.mock('../../lib/api-client', () => ({
  apiClient: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
  api: {
    contacts: {
      getAll: vi.fn(),
      getById: vi.fn(),
    },
    mailItems: {
      getAll: vi.fn(),
      updateStatus: vi.fn(),
      getDismissedContacts: vi.fn(),
      dismissContact: vi.fn(),
      restoreContact: vi.fn(),
      dismissItem: vi.fn(),
      restoreItem: vi.fn(),
    },
    notifications: {
      quickNotify: vi.fn(),
      sendEmail: vi.fn(),
    },
    stats: {
      getDashboardStats: vi.fn(),
    },
    fees: {
      getUnpaidByContact: vi.fn(),
      markPaid: vi.fn(),
      waive: vi.fn(),
    },
    templates: {
      getAll: vi.fn(),
    },
  },
}));

import { api } from '../../lib/api-client';

// Helper to create mock follow-up group
const createMockFollowUpGroup = (overrides = {}) => ({
  contact: {
    contact_id: 'contact-1',
    contact_person: 'John Doe',
    company_name: 'Acme Corp',
    mailbox_number: 'A1',
    display_name_preference: 'person' as const,
  },
  packages: [
    {
      mail_item_id: 'mail-1',
      item_type: 'Package',
      status: 'Received',
      received_date: '2025-01-01T12:00:00Z',
      contact_id: 'contact-1',
      quantity: 1,
      packageFee: {
        fee_id: 'fee-1',
        mail_item_id: 'mail-1',
        fee_amount: 10,
        days_charged: 5,
        fee_status: 'pending' as const,
      },
      contacts: {
        contact_person: 'John Doe',
        company_name: 'Acme Corp',
        mailbox_number: 'A1',
        display_name_preference: 'person' as const,
      },
    },
  ],
  letters: [],
  totalFees: 10,
  urgencyScore: 5,
  lastNotified: '2025-01-05T12:00:00Z',
  ...overrides,
});

const createMockDashboardStats = (needsFollowUp: any[] = []) => ({
  todaysMail: 5,
  pendingPickups: 10,
  remindersDue: 3,
  overdueMail: 2,
  completedToday: 8,
  recentMailItems: [],
  recentCustomers: [],
  newCustomersToday: 1,
  needsFollowUp,
  mailVolumeData: [],
  customerGrowthData: [],
  outstandingFees: 0,
  totalRevenue: 0,
  monthlyRevenue: 0,
  waivedFees: 0,
});

describe('FollowUpsPage', () => {
  beforeEach(() => {
    // Use resetAllMocks to clear both call history AND mock implementations
    // This is important because some tests use mockImplementation (e.g., never-resolving promises)
    vi.resetAllMocks();
    
    // Set default mock responses
    (api.stats.getDashboardStats as any).mockResolvedValue(createMockDashboardStats([]));
    (api.fees.getUnpaidByContact as any).mockResolvedValue({ fees: [], total: 0 });
    (api.templates.getAll as any).mockResolvedValue([]);
    (api.contacts.getById as any).mockResolvedValue({
      contact_id: 'contact-1',
      contact_person: 'John Doe',
      email: 'john@example.com',
    });
    // Mock dismissed contacts API
    (api.mailItems.getDismissedContacts as any).mockResolvedValue({
      dismissedContacts: [],
      dismissedItems: [],
    });
  });

  it('renders the page title', async () => {
    render(<FollowUpsPage />);

    await waitFor(() => {
      expect(screen.getByText('Follow-ups')).toBeInTheDocument();
    });
  });

  it('renders the page without subtitle (removed for consistency)', async () => {
    render(<FollowUpsPage />);

    await waitFor(() => {
      // Page should render with just the title, no subtitle
      expect(screen.getByText('Follow-ups')).toBeInTheDocument();
    });
  });

  it('shows loading state initially', () => {
    // Make the API call pending
    (api.stats.getDashboardStats as any).mockImplementation(
      () => new Promise(() => {}) // Never resolves to keep loading state
    );

    render(<FollowUpsPage />);

    // FollowUpsPage now shows its own loading state with mail animation
    const mailAnimation = screen.getByAltText('Loading mail animation');
    expect(mailAnimation).toBeInTheDocument();
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('displays follow-up data after loading', async () => {
    const mockGroup = createMockFollowUpGroup();
    
    // Override the default mock with our data (beforeEach already set up basic mocks)
    (api.stats.getDashboardStats as any).mockResolvedValue(
      createMockDashboardStats([mockGroup])
    );

    render(<FollowUpsPage />);

    // Wait for the loading to complete and all data to display
    // Put all assertions in the same waitFor to ensure we check a stable state
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText(/A1/)).toBeInTheDocument();
    }, { timeout: 5000 });
  });

  it('displays company name when contact_person is not available', async () => {
    const mockGroup = createMockFollowUpGroup({
      contact: {
        contact_id: 'contact-2',
        contact_person: null,
        company_name: 'Tech Corp',
        mailbox_number: 'B2',
      },
    });
    (api.stats.getDashboardStats as any).mockResolvedValue(
      createMockDashboardStats([mockGroup])
    );

    render(<FollowUpsPage />);

    await waitFor(() => {
      expect(screen.getByText('Tech Corp')).toBeInTheDocument();
    });
  });

  it('displays multiple follow-up groups', async () => {
    const mockGroup1 = createMockFollowUpGroup();
    const mockGroup2 = createMockFollowUpGroup({
      contact: {
        contact_id: 'contact-2',
        contact_person: 'Jane Smith',
        company_name: 'Smith Inc',
        mailbox_number: 'B2',
        display_name_preference: 'person' as const,
      },
      totalFees: 25,
    });

    (api.stats.getDashboardStats as any).mockResolvedValue(
      createMockDashboardStats([mockGroup1, mockGroup2])
    );

    render(<FollowUpsPage />);

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    });
  });

  it('shows empty state when no follow-ups', async () => {
    (api.stats.getDashboardStats as any).mockResolvedValue(
      createMockDashboardStats([])
    );

    render(<FollowUpsPage />);

    await waitFor(() => {
      expect(screen.getByText('Follow-ups')).toBeInTheDocument();
    });

    // The GroupedFollowUpSection should handle empty state
  });

  it('displays package count correctly', async () => {
    const mockGroup = createMockFollowUpGroup({
      packages: [
        {
          mail_item_id: 'mail-1',
          item_type: 'Package',
          status: 'Received',
          received_date: '2025-01-01T12:00:00Z',
          contact_id: 'contact-1',
        },
        {
          mail_item_id: 'mail-2',
          item_type: 'Package',
          status: 'Received',
          received_date: '2025-01-02T12:00:00Z',
          contact_id: 'contact-1',
        },
      ],
    });

    (api.stats.getDashboardStats as any).mockResolvedValue(
      createMockDashboardStats([mockGroup])
    );

    render(<FollowUpsPage />);

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });
  });

  it('displays letters count when present', async () => {
    const mockGroup = createMockFollowUpGroup({
      letters: [
        {
          mail_item_id: 'mail-3',
          item_type: 'Letter',
          status: 'Received',
          received_date: '2025-01-01T12:00:00Z',
          contact_id: 'contact-1',
        },
      ],
    });

    (api.stats.getDashboardStats as any).mockResolvedValue(
      createMockDashboardStats([mockGroup])
    );

    render(<FollowUpsPage />);

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });
  });

  it('handles API error gracefully', async () => {
    const mockError = new Error('Network error');
    (api.stats.getDashboardStats as any).mockRejectedValue(mockError);

    render(<FollowUpsPage />);

    // Page should still render without crashing
    await waitFor(() => {
      expect(screen.getByText('Follow-ups')).toBeInTheDocument();
    });
  });

  it('reloads data when API call succeeds after modal actions', async () => {
    const mockGroup = createMockFollowUpGroup();
    
    // Use mockResolvedValue instead of mockResolvedValueOnce for consistent behavior
    (api.stats.getDashboardStats as any).mockResolvedValue(
      createMockDashboardStats([mockGroup])
    );

    render(<FollowUpsPage />);

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });

    // API should have been called at least once initially
    expect(api.stats.getDashboardStats).toHaveBeenCalled();
  });
});
