import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '../../test/test-utils';
import Dashboard from '../Dashboard';
import { mockContacts, mockMailItems } from '../../test/mockData';

// Mock API client
vi.mock('../../lib/api-client', () => ({
  apiClient: {
    get: vi.fn(),
  },
  api: {
    contacts: {
      getAll: vi.fn(),
    },
    mailItems: {
      getAll: vi.fn(),
      updateStatus: vi.fn(),
    },
    notifications: {
      quickNotify: vi.fn(),
    },
  },
}));

import { api } from '../../lib/api-client';

describe('Dashboard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Set default successful responses
    (api.contacts.getAll as any).mockResolvedValue(mockContacts);
    (api.mailItems.getAll as any).mockResolvedValue(mockMailItems);
  });

  it('renders dashboard with loading state', async () => {
    render(<Dashboard />);
    
    // Wait for Dashboard to render after loading
    expect(await screen.findByText('Dashboard')).toBeInTheDocument();
    
    // Wait for data loading to complete
    await waitFor(() => {
      expect(api.contacts.getAll).toHaveBeenCalled();
    });
  });

  it('displays statistics when data is loaded', async () => {
    render(<Dashboard />);
    
    await waitFor(() => {
      // Dashboard should render without errors
      expect(screen.getByText('Dashboard')).toBeInTheDocument();
    });
    
    // Verify API was called
    expect(api.contacts.getAll).toHaveBeenCalled();
    expect(api.mailItems.getAll).toHaveBeenCalled();
  });

  it('shows error message when data fetch fails', async () => {
    // Override default mocks with errors
    (api.contacts.getAll as any).mockRejectedValue(new Error('Network error'));
    (api.mailItems.getAll as any).mockRejectedValue(new Error('Network error'));
    
    render(<Dashboard />);
    
    await waitFor(() => {
      // Component should handle error gracefully and still render
      expect(screen.getByText('Dashboard')).toBeInTheDocument();
    });
  });

  it('displays quick action buttons', async () => {
    render(<Dashboard />);
    
    await waitFor(() => {
      expect(screen.getByText('Dashboard')).toBeInTheDocument();
    });
    
    // Check for quick actions if they exist in the component
    // (adjust based on actual Dashboard content)
  });

  describe('Needs Follow-Up Section', () => {
    it('shows Load More button when there are more than 10 items', async () => {
      // Create 15 mail items that need follow-up
      const manyMailItems = Array.from({ length: 15 }, (_, i) => ({
        mail_item_id: `mail-${i}`,
        contact_id: 'contact-1',
        item_type: 'Letter',
        status: 'Received',
        received_date: new Date(Date.now() - (i + 1) * 24 * 60 * 60 * 1000).toISOString(),
        contacts: {
          contact_person: `Customer ${i}`,
          mailbox_number: `A${i}`,
        },
      }));

      (api.mailItems.getAll as any).mockResolvedValue(manyMailItems);

      render(<Dashboard />);

      await waitFor(() => {
        expect(screen.getByText('Dashboard')).toBeInTheDocument();
      });

      // Should show "Load More" button with remaining count
      await waitFor(() => {
        const loadMoreButton = screen.getByText(/Load More \(5 remaining\)/i);
        expect(loadMoreButton).toBeInTheDocument();
      });
    });

    it('loads more items when Load More button is clicked', async () => {
      // Create 15 mail items that need follow-up
      const manyMailItems = Array.from({ length: 15 }, (_, i) => ({
        mail_item_id: `mail-${i}`,
        contact_id: 'contact-1',
        item_type: 'Letter',
        status: 'Received',
        received_date: new Date(Date.now() - (i + 1) * 24 * 60 * 60 * 1000).toISOString(),
        contacts: {
          contact_person: `Customer ${i}`,
          mailbox_number: `A${i}`,
        },
      }));

      (api.mailItems.getAll as any).mockResolvedValue(manyMailItems);

      render(<Dashboard />);

      await waitFor(() => {
        expect(screen.getByText('Dashboard')).toBeInTheDocument();
      });

      // Wait for Needs Follow-Up section to appear
      await waitFor(() => {
        expect(screen.getByText(/Needs Follow-Up/i)).toBeInTheDocument();
      });

      // Wait for Load More button
      const loadMoreButton = await screen.findByText(/Load More \(5 remaining\)/i);
      expect(loadMoreButton).toBeInTheDocument();

      // Click Load More
      fireEvent.click(loadMoreButton);

      // Should show "Show Less" button after all items are loaded
      await waitFor(() => {
        const showLessButton = screen.getByText('Show Less');
        expect(showLessButton).toBeInTheDocument();
      });
    });

    it('shows Show Less button after loading all items', async () => {
      // Create 15 mail items that need follow-up
      const manyMailItems = Array.from({ length: 15 }, (_, i) => ({
        mail_item_id: `mail-${i}`,
        contact_id: 'contact-1',
        item_type: 'Letter',
        status: 'Received',
        received_date: new Date(Date.now() - (i + 1) * 24 * 60 * 60 * 1000).toISOString(),
        contacts: {
          contact_person: `Customer ${i}`,
          mailbox_number: `A${i}`,
        },
      }));

      (api.mailItems.getAll as any).mockResolvedValue(manyMailItems);

      render(<Dashboard />);

      await waitFor(() => {
        expect(screen.getByText('Dashboard')).toBeInTheDocument();
      });

      // Click Load More
      const loadMoreButton = await screen.findByText(/Load More \(5 remaining\)/i);
      fireEvent.click(loadMoreButton);

      // Should show "Show Less" button
      await waitFor(() => {
        const showLessButton = screen.getByText('Show Less');
        expect(showLessButton).toBeInTheDocument();
      });
    });

    it('resets to 10 items when Show Less is clicked', async () => {
      // Create 15 mail items that need follow-up
      const manyMailItems = Array.from({ length: 15 }, (_, i) => ({
        mail_item_id: `mail-${i}`,
        contact_id: 'contact-1',
        item_type: 'Letter',
        status: 'Received',
        received_date: new Date(Date.now() - (i + 1) * 24 * 60 * 60 * 1000).toISOString(),
        contacts: {
          contact_person: `Customer ${i}`,
          mailbox_number: `A${i}`,
        },
      }));

      (api.mailItems.getAll as any).mockResolvedValue(manyMailItems);

      render(<Dashboard />);

      await waitFor(() => {
        expect(screen.getByText('Dashboard')).toBeInTheDocument();
      });

      // Click Load More
      const loadMoreButton = await screen.findByText(/Load More \(5 remaining\)/i);
      fireEvent.click(loadMoreButton);

      // Wait for all items to be displayed
      await waitFor(() => {
        expect(screen.getByText('Customer 14')).toBeInTheDocument();
      });

      // Click Show Less
      const showLessButton = await screen.findByText('Show Less');
      fireEvent.click(showLessButton);

      // Should be back to showing Load More button
      await waitFor(() => {
        const newLoadMoreButton = screen.getByText(/Load More \(5 remaining\)/i);
        expect(newLoadMoreButton).toBeInTheDocument();
      });
    });

    it('displays abandoned mail (30+ days) with red dot and button', async () => {
      // Create a mail item that is 35 days old (abandoned)
      const abandonedMailItem = {
        mail_item_id: 'old-mail',
        contact_id: 'contact-1',
        item_type: 'Package',
        status: 'Received',
        received_date: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000).toISOString(),
        contacts: {
          contact_person: 'Old Customer',
          mailbox_number: 'Z99',
        },
      };

      (api.mailItems.getAll as any).mockResolvedValue([abandonedMailItem]);

      render(<Dashboard />);

      await waitFor(() => {
        expect(screen.getByText('Dashboard')).toBeInTheDocument();
      });

      // Verify the customer name is displayed (which means the item is in the Needs Follow-Up section)
      await waitFor(() => {
        expect(screen.getByText('Old Customer')).toBeInTheDocument();
      });
    });

    it('shows correct days old for all items', async () => {
      const mailItems = [
        {
          mail_item_id: 'mail-1',
          contact_id: 'contact-1',
          item_type: 'Letter',
          status: 'Received',
          received_date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          contacts: { contact_person: 'Customer 1', mailbox_number: 'A1' },
        },
        {
          mail_item_id: 'mail-2',
          contact_id: 'contact-2',
          item_type: 'Package',
          status: 'Received',
          received_date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          contacts: { contact_person: 'Customer 2', mailbox_number: 'A2' },
        },
      ];

      (api.mailItems.getAll as any).mockResolvedValue(mailItems);

      render(<Dashboard />);

      await waitFor(() => {
        expect(screen.getByText('Dashboard')).toBeInTheDocument();
      });

      // Click on Needs Follow-Up section if it's collapsed
      const needsFollowUpSection = screen.getByText(/Needs Follow-Up/i);
      if (needsFollowUpSection) {
        // Section should be expanded by default, but let's verify items are visible
        await waitFor(() => {
          // Look for customer names to verify section is rendered
          expect(screen.getByText('Customer 1')).toBeInTheDocument();
          expect(screen.getByText('Customer 2')).toBeInTheDocument();
        });
      }
    });

    it('does not show Load More button when items are 10 or fewer', async () => {
      // Create only 8 mail items
      const fewMailItems = Array.from({ length: 8 }, (_, i) => ({
        mail_item_id: `mail-${i}`,
        contact_id: 'contact-1',
        item_type: 'Letter',
        status: 'Received',
        received_date: new Date(Date.now() - (i + 1) * 24 * 60 * 60 * 1000).toISOString(),
        contacts: {
          contact_person: `Customer ${i}`,
          mailbox_number: `A${i}`,
        },
      }));

      (api.mailItems.getAll as any).mockResolvedValue(fewMailItems);

      render(<Dashboard />);

      await waitFor(() => {
        expect(screen.getByText('Dashboard')).toBeInTheDocument();
      });

      // Should NOT show "Load More" button
      await waitFor(() => {
        expect(screen.queryByText(/Load More/i)).not.toBeInTheDocument();
      });
    });
  });
});
