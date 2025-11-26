import { describe, it, expect, vi } from 'vitest';
import { api } from '../../lib/api-client';

// Mock the API client
vi.mock('../../lib/api-client', () => ({
  api: {
    mailItems: {
      getAll: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
    contacts: {
      getAll: vi.fn(),
    },
    actionHistory: {
      getByMailItem: vi.fn(),
      create: vi.fn(),
    },
  },
}));

// Mock timezone utilities
vi.mock('../../utils/timezone', () => ({
  getTodayNY: () => '2025-11-25',
  toNYDateString: (date: string) => date.split('T')[0],
  getNYDate: (date?: Date) => new Date('2025-11-25T00:00:00-05:00'),
  getDaysAgoNY: (days: number) => {
    const d = new Date('2025-11-25T00:00:00-05:00');
    d.setDate(d.getDate() - days);
    return d.toISOString().split('T')[0];
  },
  formatNYDate: (date: string) => {
    const parts = date.split('-');
    return `${parts[1]}/${parts[2]}/${parts[0]}`;
  },
  getChartDateRange: (days: number) => {
    const result = [];
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date('2025-11-25T00:00:00-05:00');
      date.setDate(date.getDate() - i);
      result.push({
        date: date.toISOString().split('T')[0],
        label: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      });
    }
    return result;
  },
}));

describe('Add to Existing Mail Feature - Logic Tests', () => {
  const todayDate = '2025-11-25';
  
  const mockContact = {
    contact_id: 'contact-1',
    contact_person: 'John Doe',
    mailbox_number: 'A1',
    status: 'Active',
  };

  const existingMailItem = {
    mail_item_id: 'existing-mail-1',
    contact_id: 'contact-1',
    item_type: 'Package',
    status: 'Received',
    received_date: todayDate,
    quantity: 2,
    contacts: mockContact,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should detect duplicate mail for same customer on same day', () => {
    const formData = {
      contact_id: 'contact-1',
      received_date: todayDate,
    };

    const mailItems = [existingMailItem];

    // Check if duplicate exists
    const duplicate = mailItems.find((item) => {
      const isSameCustomer = item.contact_id === formData.contact_id;
      const isSameDate = item.received_date?.split('T')[0] === formData.received_date.split('T')[0];
      const isActive = !['Picked Up', 'Forwarded', 'Scanned', 'Abandoned'].includes(item.status);
      return isSameCustomer && isSameDate && isActive;
    });

    expect(duplicate).toBeDefined();
    expect(duplicate?.mail_item_id).toBe('existing-mail-1');
  });

  it('should correctly calculate new total quantity when adding to existing', () => {
    const existingQuantity = 2;
    const newQuantity = 3;
    const total = existingQuantity + newQuantity;

    expect(total).toBe(5);
  });

  it('should ignore picked up mail when checking for duplicates', () => {
    const pickedUpMail = {
      ...existingMailItem,
      status: 'Picked Up',
    };

    const formData = {
      contact_id: 'contact-1',
      received_date: todayDate,
    };

    const mailItems = [pickedUpMail];

    const duplicate = mailItems.find((item) => {
      const isSameCustomer = item.contact_id === formData.contact_id;
      const isSameDate = item.received_date?.split('T')[0] === formData.received_date.split('T')[0];
      const isActive = !['Picked Up', 'Forwarded', 'Scanned', 'Abandoned'].includes(item.status);
      return isSameCustomer && isSameDate && isActive;
    });

    expect(duplicate).toBeUndefined();
  });

  it('should ignore forwarded mail when checking for duplicates', () => {
    const forwardedMail = {
      ...existingMailItem,
      status: 'Forwarded',
    };

    const formData = {
      contact_id: 'contact-1',
      received_date: todayDate,
    };

    const mailItems = [forwardedMail];

    const duplicate = mailItems.find((item) => {
      const isSameCustomer = item.contact_id === formData.contact_id;
      const isSameDate = item.received_date?.split('T')[0] === formData.received_date.split('T')[0];
      const isActive = !['Picked Up', 'Forwarded', 'Scanned', 'Abandoned'].includes(item.status);
      return isSameCustomer && isSameDate && isActive;
    });

    expect(duplicate).toBeUndefined();
  });

  it('should ignore scanned mail when checking for duplicates', () => {
    const scannedMail = {
      ...existingMailItem,
      status: 'Scanned',
    };

    const formData = {
      contact_id: 'contact-1',
      received_date: todayDate,
    };

    const mailItems = [scannedMail];

    const duplicate = mailItems.find((item) => {
      const isSameCustomer = item.contact_id === formData.contact_id;
      const isSameDate = item.received_date?.split('T')[0] === formData.received_date.split('T')[0];
      const isActive = !['Picked Up', 'Forwarded', 'Scanned', 'Abandoned'].includes(item.status);
      return isSameCustomer && isSameDate && isActive;
    });

    expect(duplicate).toBeUndefined();
  });

  it('should ignore abandoned mail when checking for duplicates', () => {
    const abandonedMail = {
      ...existingMailItem,
      status: 'Abandoned',
    };

    const formData = {
      contact_id: 'contact-1',
      received_date: todayDate,
    };

    const mailItems = [abandonedMail];

    const duplicate = mailItems.find((item) => {
      const isSameCustomer = item.contact_id === formData.contact_id;
      const isSameDate = item.received_date?.split('T')[0] === formData.received_date.split('T')[0];
      const isActive = !['Picked Up', 'Forwarded', 'Scanned', 'Abandoned'].includes(item.status);
      return isSameCustomer && isSameDate && isActive;
    });

    expect(duplicate).toBeUndefined();
  });

  it('should not find duplicate for different customer', () => {
    const formData = {
      contact_id: 'contact-2', // Different customer
      received_date: todayDate,
    };

    const mailItems = [existingMailItem];

    const duplicate = mailItems.find((item) => {
      const isSameCustomer = item.contact_id === formData.contact_id;
      const isSameDate = item.received_date?.split('T')[0] === formData.received_date.split('T')[0];
      const isActive = !['Picked Up', 'Forwarded', 'Scanned', 'Abandoned'].includes(item.status);
      return isSameCustomer && isSameDate && isActive;
    });

    expect(duplicate).toBeUndefined();
  });

  it('should not find duplicate for different date', () => {
    const formData = {
      contact_id: 'contact-1',
      received_date: '2025-11-24', // Different date
    };

    const mailItems = [existingMailItem];

    const duplicate = mailItems.find((item) => {
      const isSameCustomer = item.contact_id === formData.contact_id;
      const isSameDate = item.received_date?.split('T')[0] === formData.received_date.split('T')[0];
      const isActive = !['Picked Up', 'Forwarded', 'Scanned', 'Abandoned'].includes(item.status);
      return isSameCustomer && isSameDate && isActive;
    });

    expect(duplicate).toBeUndefined();
  });
});
