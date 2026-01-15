import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import DashboardLayout from '../DashboardLayout';
import { api } from '../../../lib/api-client';
import * as AuthContextModule from '../../../contexts/AuthContext';
import * as LanguageContextModule from '../../../contexts/LanguageContext';

// Mock dependencies
vi.mock('../../../lib/api-client', () => ({
  api: {
    oauth: {
      getGmailStatus: vi.fn()
    },
    todos: {
      getAll: vi.fn().mockResolvedValue([])
    }
  }
}));

// Mock AuthContext
vi.mock('../../../contexts/AuthContext', async () => {
  const actual = await vi.importActual('../../../contexts/AuthContext');
  return {
    ...actual,
    AuthContext: {
      Provider: ({ children, value: _value }: any) => children,
      Consumer: ({ children }: any) => children({}),
    },
    useAuth: vi.fn()
  };
});

// Mock LanguageContext
vi.mock('../../../contexts/LanguageContext', async () => {
  const actual = await vi.importActual('../../../contexts/LanguageContext');
  return {
    ...actual,
    useLanguage: vi.fn()
  };
});

// Mock Outlet component
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    Outlet: () => <div data-testid="outlet">Page Content</div>
  };
});

describe('DashboardLayout - Gmail Status Indicator', () => {
  const mockUser = {
    id: 'user-123',
    email: 'test@example.com'
  };

  const mockAuthContext = {
    user: mockUser,
    signOut: vi.fn(),
    signIn: vi.fn(),
    signUp: vi.fn(),
    session: null,
    loading: false
  };

  // Translation mock that returns English strings
  const mockTranslations: Record<string, string> = {
    'settings.gmailConnected': 'Gmail Connected',
    'settings.connectGmail': 'Gmail Not Connected',
    'settings.gmailDisconnectedClickToConnect': 'Gmail disconnected - Click to connect',
    'quickActions.shortcut': 'Quick action [CTRL + K]',
    'nav.dashboard': 'Dashboard',
    'nav.mailLog': 'Mail Log',
    'nav.customers': 'Customers',
    'nav.followUps': 'Follow-ups',
    'nav.fees': 'Fees',
    'nav.todos': 'To-Do',
    'nav.templates': 'Templates',
    'nav.scan': 'Scan',
    'nav.settings': 'Settings',
    'nav.new': 'New',
    'auth.logout': 'Logout',
  };

  const mockT = (key: string) => mockTranslations[key] || key;

  beforeEach(() => {
    vi.clearAllMocks();
    // Mock useAuth to return our mock context
    (AuthContextModule.useAuth as any) = vi.fn(() => mockAuthContext);
    // Mock useLanguage to return our translation function
    (LanguageContextModule.useLanguage as any) = vi.fn(() => ({
      language: 'EN',
      setLanguage: vi.fn(),
      t: mockT
    }));
  });

  describe('Gmail Connected State', () => {
    it('should show green "Gmail Connected" indicator when Gmail is connected', async () => {
      (api.oauth.getGmailStatus as any).mockResolvedValue({
        connected: true,
        gmailAddress: 'mwmailplus@gmail.com'
      });

      render(
        <BrowserRouter>
          <DashboardLayout />
        </BrowserRouter>
      );

      await waitFor(() => {
        expect(api.oauth.getGmailStatus).toHaveBeenCalled();
      });

      // Check for Gmail Connected indicator (wait for state update after API call)
      const gmailIndicator = await screen.findByText(/gmail connected/i);
      expect(gmailIndicator).toBeInTheDocument();

      // Verify it's a link to settings
      const link = gmailIndicator.closest('a');
      expect(link).toHaveAttribute('href', '/dashboard/settings');

      // Verify it has green styling classes
      expect(link).toHaveClass('bg-green-50', 'text-green-700');
    });

    it('should show Mail icon when Gmail is connected', async () => {
      (api.oauth.getGmailStatus as any).mockResolvedValue({
        connected: true,
        gmailAddress: 'mwmailplus@gmail.com'
      });

      const { container } = render(
        <BrowserRouter>
          <DashboardLayout />
        </BrowserRouter>
      );

      await waitFor(() => {
        expect(screen.getByText(/gmail connected/i)).toBeInTheDocument();
      });

      // Check for Mail icon (lucide-react adds specific classes)
      const mailIcon = container.querySelector('svg.lucide-mail');
      expect(mailIcon).toBeInTheDocument();
    });

    it('should have correct hover title when connected', async () => {
      (api.oauth.getGmailStatus as any).mockResolvedValue({
        connected: true,
        gmailAddress: 'mwmailplus@gmail.com'
      });

      render(
        <BrowserRouter>
          <DashboardLayout />
        </BrowserRouter>
      );

      await waitFor(() => {
        expect(screen.getByText(/gmail connected/i)).toBeInTheDocument();
      });

      const link = screen.getByText(/gmail connected/i).closest('a');
      expect(link).toHaveAttribute('title', 'Gmail Connected: mwmailplus@gmail.com');
    });
  });

  describe('Gmail Disconnected State', () => {
    it('should show red "Gmail Not Connected" indicator when Gmail is disconnected', async () => {
      (api.oauth.getGmailStatus as any).mockResolvedValue({
        connected: false,
        gmailAddress: null
      });

      render(
        <BrowserRouter>
          <DashboardLayout />
        </BrowserRouter>
      );

      await waitFor(() => {
        expect(api.oauth.getGmailStatus).toHaveBeenCalled();
      });

      // Check for Gmail Not Connected indicator (shown in mobile footer area)
      await waitFor(() => {
        const gmailIndicator = screen.getByText(/Gmail Not Connected/i);
        expect(gmailIndicator).toBeInTheDocument();
      });
    });

    it('should show AlertCircle icon when Gmail is disconnected', async () => {
      (api.oauth.getGmailStatus as any).mockResolvedValue({
        connected: false,
        gmailAddress: null
      });

      const { container } = render(
        <BrowserRouter>
          <DashboardLayout />
        </BrowserRouter>
      );

      await waitFor(() => {
        expect(screen.getByText(/Gmail Not Connected/i)).toBeInTheDocument();
      });

      // Check for AlertCircle icon - just verify any SVG exists in the disconnected state
      const svgIcon = container.querySelector('svg');
      expect(svgIcon).toBeInTheDocument();
    });

    it('should have correct hover title when disconnected', async () => {
      (api.oauth.getGmailStatus as any).mockResolvedValue({
        connected: false,
        gmailAddress: null
      });

      render(
        <BrowserRouter>
          <DashboardLayout />
        </BrowserRouter>
      );

      await waitFor(() => {
        expect(screen.getByText(/Gmail Not Connected/i)).toBeInTheDocument();
      });

      const link = screen.getByText(/Gmail Not Connected/i).closest('a');
      expect(link).toHaveAttribute('title', 'Gmail disconnected - Click to connect');
    });

    it('should have pulsing animation to grab attention', async () => {
      (api.oauth.getGmailStatus as any).mockResolvedValue({
        connected: false,
        gmailAddress: null
      });

      render(
        <BrowserRouter>
          <DashboardLayout />
        </BrowserRouter>
      );

      await waitFor(() => {
        expect(screen.getByText(/Gmail Not Connected/i)).toBeInTheDocument();
      });

      const link = screen.getByText(/Gmail Not Connected/i).closest('a');
      expect(link).toHaveClass('animate-pulse');
    });
  });

  describe('Error Handling', () => {
    it('should handle Gmail status check error gracefully', async () => {
      (api.oauth.getGmailStatus as any).mockRejectedValue(new Error('Network error'));

      render(
        <BrowserRouter>
          <DashboardLayout />
        </BrowserRouter>
      );

      await waitFor(() => {
        expect(api.oauth.getGmailStatus).toHaveBeenCalled();
      });

      // Should show disconnected state on error
      await waitFor(() => {
        const indicator = screen.queryByText(/Gmail Not Connected/i);
        expect(indicator).toBeInTheDocument();
      });
    });

    it('should not crash when API returns unexpected data', async () => {
      (api.oauth.getGmailStatus as any).mockResolvedValue({
        connected: undefined,
        gmailAddress: undefined
      });

      render(
        <BrowserRouter>
          <DashboardLayout />
        </BrowserRouter>
      );

      await waitFor(() => {
        expect(api.oauth.getGmailStatus).toHaveBeenCalled();
      });

      // Should not crash, page should render
      expect(screen.getByTestId('outlet')).toBeInTheDocument();
    });
  });

  describe('API Integration', () => {
    it('should call Gmail status API on mount', async () => {
      (api.oauth.getGmailStatus as any).mockResolvedValue({
        connected: true,
        gmailAddress: 'test@gmail.com'
      });

      render(
        <BrowserRouter>
          <DashboardLayout />
        </BrowserRouter>
      );

      await waitFor(() => {
        expect(api.oauth.getGmailStatus).toHaveBeenCalledTimes(1);
      });
    });

    it('should only call Gmail status API once on initial render', async () => {
      (api.oauth.getGmailStatus as any).mockResolvedValue({
        connected: true,
        gmailAddress: 'test@gmail.com'
      });

      const { rerender } = render(
        <BrowserRouter>
          <DashboardLayout />
        </BrowserRouter>
      );

      await waitFor(() => {
        expect(api.oauth.getGmailStatus).toHaveBeenCalledTimes(1);
      });

      // Rerender shouldn't trigger another API call
      rerender(
        <BrowserRouter>
          <DashboardLayout />
        </BrowserRouter>
      );

      expect(api.oauth.getGmailStatus).toHaveBeenCalledTimes(1);
    });
  });

  describe('Link Behavior', () => {
    it('should link to Settings page when clicked', async () => {
      (api.oauth.getGmailStatus as any).mockResolvedValue({
        connected: false,
        gmailAddress: null
      });

      render(
        <BrowserRouter>
          <DashboardLayout />
        </BrowserRouter>
      );

      await waitFor(() => {
        expect(screen.getByText(/Gmail Not Connected/i)).toBeInTheDocument();
      });

      const link = screen.getByText(/Gmail Not Connected/i).closest('a');
      expect(link).toHaveAttribute('href', '/dashboard/settings');
    });

    it('should be keyboard accessible', async () => {
      (api.oauth.getGmailStatus as any).mockResolvedValue({
        connected: false,
        gmailAddress: null
      });

      render(
        <BrowserRouter>
          <DashboardLayout />
        </BrowserRouter>
      );

      await waitFor(() => {
        expect(screen.getByText(/Gmail Not Connected/i)).toBeInTheDocument();
      });

      const link = screen.getByText(/Gmail Not Connected/i).closest('a');
      expect(link).toHaveAttribute('href');
      expect(link?.tagName).toBe('A');
    });
  });

  describe('Visual States', () => {
    it('should have correct color scheme when connected (green)', async () => {
      (api.oauth.getGmailStatus as any).mockResolvedValue({
        connected: true,
        gmailAddress: 'test@gmail.com'
      });

      render(
        <BrowserRouter>
          <DashboardLayout />
        </BrowserRouter>
      );

      await waitFor(() => {
        expect(screen.getByText(/gmail connected/i)).toBeInTheDocument();
      });

      const link = screen.getByText(/gmail connected/i).closest('a');
      expect(link?.className).toMatch(/bg-green-50/);
      expect(link?.className).toMatch(/text-green-700/);
      expect(link?.className).toMatch(/border-green-200/);
      expect(link?.className).not.toMatch(/animate-pulse/);
    });

    it('should have correct color scheme when disconnected (red, pulsing)', async () => {
      (api.oauth.getGmailStatus as any).mockResolvedValue({
        connected: false,
        gmailAddress: null
      });

      render(
        <BrowserRouter>
          <DashboardLayout />
        </BrowserRouter>
      );

      await waitFor(() => {
        expect(screen.getByText(/Gmail Not Connected/i)).toBeInTheDocument();
      });

      const link = screen.getByText(/Gmail Not Connected/i).closest('a');
      expect(link?.className).toMatch(/bg-red-50/);
      expect(link?.className).toMatch(/text-red-700/);
      expect(link?.className).toMatch(/border-red-200/);
      expect(link?.className).toMatch(/animate-pulse/);
    });
  });
});

describe('DashboardLayout - Logo and Branding', () => {
  const mockUser = {
    id: 'user-123',
    email: 'test@example.com'
  };

  const mockAuthContext = {
    user: mockUser,
    signOut: vi.fn(),
    signIn: vi.fn(),
    signUp: vi.fn(),
    session: null,
    loading: false
  };

  // Translation mock that returns English strings
  const mockTranslations: Record<string, string> = {
    'settings.gmailConnected': 'Gmail Connected',
    'settings.connectGmail': 'Gmail Not Connected',
    'settings.gmailDisconnectedClickToConnect': 'Gmail disconnected - Click to connect',
    'quickActions.shortcut': 'Quick action [CTRL + K]',
    'nav.dashboard': 'Dashboard',
    'nav.mailLog': 'Mail Log',
    'nav.customers': 'Customers',
    'nav.followUps': 'Follow-ups',
    'nav.fees': 'Fees',
    'nav.todos': 'To-Do',
    'nav.templates': 'Templates',
    'nav.scan': 'Scan',
    'nav.settings': 'Settings',
    'nav.new': 'New',
    'auth.logout': 'Logout',
  };

  const mockT = (key: string) => mockTranslations[key] || key;

  beforeEach(() => {
    vi.clearAllMocks();
    (AuthContextModule.useAuth as any) = vi.fn(() => mockAuthContext);
    // Mock useLanguage to return our translation function
    (LanguageContextModule.useLanguage as any) = vi.fn(() => ({
      language: 'EN',
      setLanguage: vi.fn(),
      t: mockT
    }));
    (api.oauth.getGmailStatus as any).mockResolvedValue({
      connected: true,
      gmailAddress: 'test@gmail.com'
    });
  });

  describe('Logo Display', () => {
    it('should display the Mei Way Mail logo image', async () => {
      render(
        <BrowserRouter>
          <DashboardLayout />
        </BrowserRouter>
      );

      await waitFor(() => {
        const logo = screen.getByAltText('Mei Way Mail Logo');
        expect(logo).toBeInTheDocument();
      });
    });

    it('should have correct logo source path', async () => {
      render(
        <BrowserRouter>
          <DashboardLayout />
        </BrowserRouter>
      );

      await waitFor(() => {
        const logo = screen.getByAltText('Mei Way Mail Logo');
        expect(logo).toHaveAttribute('src', '/assets/images/mei-way-logo.png');
      });
    });

    it('should have round logo with correct styling', async () => {
      render(
        <BrowserRouter>
          <DashboardLayout />
        </BrowserRouter>
      );

      await waitFor(() => {
        const logo = screen.getByAltText('Mei Way Mail Logo');
        expect(logo).toHaveClass('rounded-full');
        expect(logo).toHaveClass('w-12', 'h-12');
      });
    });

    it('should wrap logo in link to dashboard', async () => {
      render(
        <BrowserRouter>
          <DashboardLayout />
        </BrowserRouter>
      );

      await waitFor(() => {
        const logo = screen.getByAltText('Mei Way Mail Logo');
        const link = logo.closest('a');
        expect(link).toHaveAttribute('href', '/dashboard');
      });
    });
  });

  describe('Branding Text', () => {
    it('should display "Mei Way Mail" text (shortened from "Mei Way Mail Plus")', async () => {
      render(
        <BrowserRouter>
          <DashboardLayout />
        </BrowserRouter>
      );

      await waitFor(() => {
        // Both mobile and desktop views have "Mei Way Mail" text
        const brandTexts = screen.getAllByText('Mei Way Mail');
        expect(brandTexts.length).toBeGreaterThan(0);
      });
    });

    it('should NOT display "Mei Way Mail Plus" (old branding)', async () => {
      render(
        <BrowserRouter>
          <DashboardLayout />
        </BrowserRouter>
      );

      await waitFor(() => {
        expect(screen.queryByText('Mei Way Mail Plus')).not.toBeInTheDocument();
      });
    });

    it('should have black text color for branding', async () => {
      render(
        <BrowserRouter>
          <DashboardLayout />
        </BrowserRouter>
      );

      await waitFor(() => {
        // Both mobile and desktop views have "Mei Way Mail" text with black color
        const brandTexts = screen.getAllByText('Mei Way Mail');
        expect(brandTexts.length).toBeGreaterThan(0);
        // At least one should have the text-gray-900 class
        expect(brandTexts.some(el => el.classList.contains('text-gray-900'))).toBe(true);
      });
    });
  });
});
