import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import ActionModal from '../ActionModal';

describe('ActionModal - Staff Names Validation', () => {
  const defaultProps = {
    isOpen: true,
    onClose: () => {},
    mailItemId: 'test-mail-id',
    mailItemDetails: {
      customerName: 'John Doe',
      itemType: 'Package',
      currentStatus: 'Received',
    },
    actionType: 'picked_up' as const,
    onSuccess: () => {},
  };

  it('should only show Merlin and Madison as staff options (no Merlot or other incorrect names)', () => {
    render(<ActionModal {...defaultProps} />);
    
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
    const { container } = render(<ActionModal {...defaultProps} />);
    
    const selects = container.querySelectorAll('select');
    const staffSelect = Array.from(selects).find(select => 
      select.previousElementSibling?.textContent?.includes('Who performed')
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

  it('should display staff dropdown for all action types', () => {
    const actionTypes: Array<'picked_up' | 'forward' | 'scanned' | 'abandoned'> = [
      'picked_up',
      'forward', 
      'scanned',
      'abandoned'
    ];

    actionTypes.forEach(actionType => {
      const { unmount } = render(<ActionModal {...defaultProps} actionType={actionType} />);
      
      expect(screen.getByText('Merlin')).toBeInTheDocument();
      expect(screen.getByText('Madison')).toBeInTheDocument();
      expect(screen.queryByText('Merlot')).not.toBeInTheDocument();
      
      unmount();
    });
  });
});
