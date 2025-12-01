import { useState, useEffect } from 'react';
import { Mail, CheckCircle, XCircle, RefreshCw } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { api } from '../lib/api-client';

interface GmailStatus {
  connected: boolean;
  gmailAddress?: string;
}

export default function SettingsPage() {
  const [gmailStatus, setGmailStatus] = useState<GmailStatus>({ connected: false });
  const [loading, setLoading] = useState(true);
  const [connecting, setConnecting] = useState(false);

  // Load Gmail connection status on mount
  useEffect(() => {
    loadGmailStatus();
  }, []);

  const loadGmailStatus = async () => {
    try {
      setLoading(true);
      const status = await api.oauth.getGmailStatus();
      setGmailStatus(status);
    } catch (error: any) {
      console.error('Failed to load Gmail status:', error);
      // If API call fails, assume not connected
      setGmailStatus({ connected: false });
    } finally {
      setLoading(false);
    }
  };

  const handleConnectGmail = async () => {
    try {
      setConnecting(true);
      // Get the OAuth authorization URL from backend
      const response = await api.oauth.getGmailAuthUrl();
      
      // Redirect to Google's OAuth consent screen
      window.location.href = response.authUrl;
    } catch (error: any) {
      console.error('Failed to connect Gmail:', error);
      toast.error(error.message || 'Failed to connect Gmail');
      setConnecting(false);
    }
  };

  const handleDisconnectGmail = async () => {
    if (!confirm('Are you sure you want to disconnect your Gmail account? You will need to reconnect to send emails.')) {
      return;
    }

    try {
      setConnecting(true);
      await api.oauth.disconnectGmail();
      setGmailStatus({ connected: false });
      toast.success('Gmail disconnected successfully');
    } catch (error: any) {
      console.error('Failed to disconnect Gmail:', error);
      toast.error(error.message || 'Failed to disconnect Gmail');
    } finally {
      setConnecting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="w-8 h-8 text-brand animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-2">Manage your account settings and integrations</p>
      </div>

      {/* Gmail Integration Section */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <Mail className="w-6 h-6 text-brand" />
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Gmail Integration</h2>
              <p className="text-sm text-gray-600 mt-1">
                Connect your Gmail account to send email notifications directly from the app
              </p>
            </div>
          </div>
        </div>

        <div className="p-6">
          {/* Connection Status */}
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              {gmailStatus.connected ? (
                <CheckCircle className="w-12 h-12 text-green-600" />
              ) : (
                <XCircle className="w-12 h-12 text-gray-400" />
              )}
            </div>

            <div className="flex-grow">
              {gmailStatus.connected ? (
                <>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    Gmail Connected
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Your Gmail account is connected and ready to send emails.
                  </p>
                  {gmailStatus.gmailAddress && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                      <p className="text-sm font-medium text-green-900">Connected Account:</p>
                      <p className="text-green-700 font-mono mt-1">{gmailStatus.gmailAddress}</p>
                    </div>
                  )}
                  <button
                    onClick={handleDisconnectGmail}
                    disabled={connecting}
                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg border border-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {connecting ? 'Disconnecting...' : 'Disconnect Gmail'}
                  </button>
                </>
              ) : (
                <>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    Gmail Not Connected
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Connect your Gmail account to enable email notifications. This is a secure OAuth2 connection - we never store your password.
                  </p>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                    <h4 className="font-medium text-blue-900 mb-2">What you'll be able to do:</h4>
                    <ul className="text-sm text-blue-800 space-y-1">
                      <li>• Send email notifications to customers directly from the app</li>
                      <li>• Use pre-built templates with automatic customer info</li>
                      <li>• Track which emails have been sent</li>
                      <li>• No more copy-pasting into Gmail manually</li>
                    </ul>
                  </div>
                  <button
                    onClick={handleConnectGmail}
                    disabled={connecting}
                    className="px-6 py-3 bg-brand hover:bg-brand-dark text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    <Mail className="w-5 h-5" />
                    {connecting ? 'Connecting...' : 'Connect Gmail Account'}
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Info Section */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <h4 className="font-medium text-gray-900 mb-3">About Gmail Integration</h4>
            <div className="text-sm text-gray-600 space-y-2">
              <p>
                <strong>Secure OAuth2 Connection:</strong> We use Google's secure OAuth2 protocol. Your Gmail password is never shared with our app.
              </p>
              <p>
                <strong>Permissions:</strong> We only request permission to send emails on your behalf. We cannot read your existing emails.
              </p>
              <p>
                <strong>Disconnect Anytime:</strong> You can disconnect your Gmail account at any time from this page.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Future Settings Sections Can Go Here */}
      {/* Example: Profile Settings, Notification Preferences, etc. */}
    </div>
  );
}

