import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import QuickNotifyModal from '../QuickNotifyModal';

describe('QuickNotifyModal - Staff Names Validation', () => {
  const defaultProps = {
    isOpen: true,
    onClose: () => {},
    mailItemId: 'test-mail-id',
    contactId: 'test-contact-id',
    customerName: 'John Doe',
    onSuccess: () => {},
  };

  it('should only show Merlin and Madison as staff options (no Merlot or other incorrect names)', () => {
    render(<QuickNotifyModal {...defaultProps} />);
    
    // Check that correct staff names are present
    expect(screen.getByText('Merlin')).toBeInTheDocument();
    expect(screen.getByText('Madison')).toBeInTheDocument();
    
    // Check that incorrect staff names are NOT present  
    expect(screen.queryByText('Merlot')).not.toBeInTheDocument();
    expect(screen.queryByText('Manager')).not.toBeInTheDocument();
    expect(screen.queryByText('Admin')).not.toBeInTheDocument();
    expect(screen.queryByText('Merlot')).toBeNull();
  });

  it('should have exactly 2 staff members available', () => {
    const { container } = render(<QuickNotifyModal {...defaultProps} />);
    
    const selects = container.querySelectorAll('select');
    const staffSelect = Array.from(selects).find(select => 
      select.previousElementSibling?.textContent?.includes('Who notified')
    );
    
    expect(staffSelect).toBeTruthy();
    
    if (staffSelect) {
      const options = Array.from(staffSelect.querySelectorAll('option'));
      const staffOptions = options.filter(opt => opt.value !== ''); // Exclude placeholder
      
      expect(staffOptions).toHaveLength(2);
      expect(staffOptions[0].textContent).toBe('Merlin');
      expect(staffOptions[1].textContent).toBe('Madison');
    }
  });

  it('should have notification method dropdown', () => {
    render(<QuickNotifyModal {...defaultProps} />);
    
    // Should have all notification methods
    expect(screen.getByText('Email')).toBeInTheDocument();
    expect(screen.getByText('Phone Call')).toBeInTheDocument();
    expect(screen.getByText('Text Message')).toBeInTheDocument();
    expect(screen.getByText('WeChat')).toBeInTheDocument();
    expect(screen.getByText('In-Person')).toBeInTheDocument();
  });
});
