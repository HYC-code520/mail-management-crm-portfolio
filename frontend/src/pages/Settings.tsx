import { useState, useEffect } from 'react';
import { Mail, CheckCircle, XCircle, Info, ChevronDown, AlertCircle, Lock, Eye, EyeOff } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { api } from '../lib/api-client';
import { supabase } from '../lib/supabase';
import { useLanguage } from '../contexts/LanguageContext.tsx';

interface GmailStatus {
  connected: boolean;
  gmailAddress?: string;
}

export default function SettingsPage() {
  const { t } = useLanguage();
  const [gmailStatus, setGmailStatus] = useState<GmailStatus>({ connected: false });
  const [loading, setLoading] = useState(true);
  const [connecting, setConnecting] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);

  // Password change state
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [changingPassword, setChangingPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
    if (!confirm(t('warnings.confirmDisconnectGmail') + ' ' + t('warnings.needToReconnect'))) {
      return;
    }

    try {
      setConnecting(true);
      await api.oauth.disconnectGmail();
      setGmailStatus({ connected: false });
      toast.success(t('toast.gmailDisconnected'));
    } catch (error: any) {
      console.error('Failed to disconnect Gmail:', error);
      toast.error(error.message || 'Failed to disconnect Gmail');
    } finally {
      setConnecting(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!newPassword || !confirmPassword) {
      toast.error(t('validation.fillAllFields'));
      return;
    }

    if (newPassword.length < 6) {
      toast.error(t('validation.passwordMinLength'));
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error(t('validation.passwordsDoNotMatch'));
      return;
    }

    try {
      setChangingPassword(true);

      // Use Supabase to update password
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) throw error;

      toast.success(t('toast.passwordChanged'));
      
      // Clear form
      setNewPassword('');
      setConfirmPassword('');
      setShowNewPassword(false);
      setShowConfirmPassword(false);
    } catch (error: any) {
      console.error('Failed to change password:', error);
      toast.error(error.message || 'Failed to change password');
    } finally {
      setChangingPassword(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-full mx-auto px-16 py-6">
        <div className="animate-pulse space-y-8">
          <div className="h-8 bg-gray-200 rounded w-48"></div>
          <div className="h-64 bg-gray-100 rounded-lg"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-full mx-auto px-16 py-6">
      {/* Header - Matches Dashboard Style */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('settings.title')}</h1>
        <p className="text-gray-600">{t('settings.manageAccount')}</p>
      </div>

      {/* Gmail Integration Section - Matches Dashboard Card Style */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
        {/* Card Header */}
        <div className="px-6 py-5 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Mail className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                {t('settings.gmailIntegration')}
                
                {/* Info Icon with Tooltip */}
                <div className="relative group inline-block">
                  <Info className="w-5 h-5 text-gray-400 hover:text-gray-600 cursor-help transition-colors" />
                  
                  {/* Tooltip */}
                  <div className="absolute left-0 top-full mt-2 px-4 py-3 bg-gray-200 text-gray-900 text-[11px] text-left leading-relaxed shadow-lg border border-gray-300 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity duration-75 w-80 z-50 pointer-events-none">
                    <div className="space-y-2.5">
                      <div>
                        <p className="font-semibold text-gray-900 mb-1">🔒 {t('settings.tooltipSecureOAuth')}</p>
                        <p>{t('settings.tooltipSecureOAuthDesc')}</p>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 mb-1">✓ {t('settings.tooltipPermissions')}</p>
                        <p>{t('settings.tooltipPermissionsDesc')}</p>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 mb-1">→ {t('settings.tooltipDisconnect')}</p>
                        <p>{t('settings.tooltipDisconnectDesc')}</p>
                      </div>
                    </div>
                    <div className="absolute bottom-full left-6 border-4 border-transparent border-b-gray-200"></div>
                  </div>
                </div>
              </h2>
              <p className="text-sm text-gray-600 mt-0.5">
                {t('settings.connectGmailDesc')}
              </p>
            </div>
          </div>
        </div>

        {/* Card Content */}
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
                    {t('settings.gmailConnected')}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {t('settings.gmailReadyToSend')}
                  </p>
                  {gmailStatus.gmailAddress && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                      <p className="text-sm font-semibold text-green-900 mb-1">{t('settings.connectedAccount')}</p>
                      <p className="text-green-700 font-mono text-sm">{gmailStatus.gmailAddress}</p>
                    </div>
                  )}

                  {/* Troubleshooting - Collapsible */}
                  <div className="bg-amber-50 border border-amber-200 rounded-lg mb-6">
                    <button
                      onClick={() => setShowInstructions(!showInstructions)}
                      className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-amber-100 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0" />
                        <div>
                          <h4 className="font-semibold text-amber-900 text-sm">
                            {t('settings.troubleshootingTitle')}
                          </h4>
                          <p className="text-xs text-amber-700 mt-0.5">
                            {t('settings.troubleshootingSubtitle')}
                          </p>
                        </div>
                      </div>
                      <ChevronDown 
                        className={`w-5 h-5 text-amber-600 transition-transform ${showInstructions ? 'rotate-180' : ''}`}
                      />
                    </button>
                    
                    {showInstructions && (
                      <div className="px-5 pb-4 text-sm text-amber-800 space-y-4 border-t border-amber-200 pt-4">
                        <div>
                          <p className="font-semibold text-amber-900 mb-2">❌ {t('settings.troubleCommonIssue')}</p>
                          <p className="text-amber-800 mb-2">
                            {t('settings.troubleCommonIssueDesc')}
                          </p>
                          <p className="text-amber-900 font-medium mb-2">🔧 {t('settings.troubleHowToFix')}</p>
                          <ol className="list-decimal list-inside space-y-1 text-amber-800 ml-2">
                            <li>{t('settings.troubleStep1Fix')}</li>
                            <li>{t('settings.troubleStep2Fix')}</li>
                            <li>{t('settings.troubleStep3Fix')}</li>
                            <li>{t('settings.troubleStep4Fix')}</li>
                          </ol>
                        </div>

                        <div className="pt-3 border-t border-amber-200">
                          <p className="font-semibold text-amber-900 mb-2">📋 {t('settings.troubleWhatToExpect')}</p>
                          <div className="space-y-2">
                            <div>
                              <p className="font-medium">{t('settings.troubleSetupStep1')}</p>
                              <p className="text-amber-700 text-xs">{t('settings.troubleSetupStep1Desc')}</p>
                            </div>
                            <div>
                              <p className="font-medium">{t('settings.troubleSetupStep2')}</p>
                              <p className="text-amber-700 text-xs">{t('settings.troubleSetupStep2Desc')}</p>
                            </div>
                            <div>
                              <p className="font-medium">⚠️ {t('settings.troubleSetupStep3')}</p>
                              <p className="text-amber-700 text-xs">{t('settings.troubleSetupStep3Desc')}</p>
                            </div>
                            <div>
                              <p className="font-medium">{t('settings.troubleSetupStep4')}</p>
                              <p className="text-amber-700 text-xs">{t('settings.troubleSetupStep4Desc')}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={handleDisconnectGmail}
                    disabled={connecting}
                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg border border-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                  >
                    {connecting ? t('common.processing') : t('settings.disconnectGmail')}
                  </button>
                </>
              ) : (
                <>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    {t('settings.gmailNotConnected')}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {t('settings.gmailNotConnectedDesc')}
                  </p>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-5 mb-6">
                    <h4 className="font-semibold text-blue-900 mb-3 text-sm">{t('settings.whatYouCanDo')}</h4>
                    <ul className="text-sm text-blue-800 space-y-2">
                      <li className="flex items-start gap-2">
                        <span className="text-blue-600 mt-0.5">•</span>
                        <span>{t('settings.benefit1')}</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-blue-600 mt-0.5">•</span>
                        <span>{t('settings.benefit2')}</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-blue-600 mt-0.5">•</span>
                        <span>{t('settings.benefit3')}</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-blue-600 mt-0.5">•</span>
                        <span>{t('settings.benefit4')}</span>
                      </li>
                    </ul>
                  </div>

                  {/* Connection Instructions */}
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-5 mb-6">
                    <div className="flex items-start gap-3">
                      <Info className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-amber-900 mb-3 text-sm">{t('settings.troubleWhatToExpect')}</h4>
                        <div className="text-sm text-amber-800 space-y-3">
                          <div>
                            <p className="font-medium mb-1">📋 {t('settings.setupStep1')}</p>
                            <p className="text-amber-700">{t('settings.setupStep1Desc')}</p>
                          </div>
                          <div>
                            <p className="font-medium mb-1">⚠️ {t('settings.setupStep2')}</p>
                            <p className="text-amber-700">{t('settings.setupStep2Desc')}</p>
                          </div>
                          <div>
                            <p className="font-medium mb-1">✓ {t('settings.setupStep3')}</p>
                            <p className="text-amber-700 mb-2">{t('settings.setupStep3Desc')}</p>
                            <p className="text-amber-700">{t('settings.setupStep3Desc2')}</p>
                          </div>
                          <div>
                            <p className="font-medium mb-1">🎉 {t('settings.setupStep4')}</p>
                            <p className="text-amber-700">{t('settings.setupStep4Desc')}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={handleConnectGmail}
                    disabled={connecting}
                    className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-sm"
                  >
                    <Mail className="w-5 h-5" />
                    {connecting ? t('common.processing') : t('settings.connectGmail')}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Password Change Section */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden mt-6">
        {/* Card Header */}
        <div className="px-6 py-5 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-pink-50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Lock className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                {t('settings.changePassword')}
              </h2>
              <p className="text-sm text-gray-600 mt-0.5">
                {t('settings.updatePassword')}
              </p>
            </div>
          </div>
        </div>

        {/* Card Content */}
        <div className="p-6">
          <form onSubmit={handleChangePassword} className="max-w-md space-y-4">
            {/* New Password */}
            <div>
              <label htmlFor="new-password" className="block text-sm font-medium text-gray-700 mb-1">
                {t('settings.newPassword')}
              </label>
              <div className="relative">
                <input
                  id="new-password"
                  type={showNewPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder={t('settings.passwordMinLength')}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent pr-10"
                  disabled={changingPassword}
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 mb-1">
                {t('settings.confirmPassword')}
              </label>
              <div className="relative">
                <input
                  id="confirm-password"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder={t('settings.reenterPassword')}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent pr-10"
                  disabled={changingPassword}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={changingPassword || !newPassword || !confirmPassword}
                className="px-6 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-sm"
              >
                <Lock className="w-5 h-5" />
                {changingPassword ? t('common.processing') : t('settings.changePassword')}
              </button>
            </div>

            {/* Password Requirements */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mt-4">
              <p className="text-sm font-semibold text-gray-900 mb-2">{t('settings.passwordRequirements')}</p>
              <ul className="text-sm text-gray-700 space-y-1">
                <li className="flex items-start gap-2">
                  <span className="text-gray-500 mt-0.5">•</span>
                  <span>{t('settings.passwordReq1')}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-gray-500 mt-0.5">•</span>
                  <span>{t('settings.passwordReq2')}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-gray-500 mt-0.5">•</span>
                  <span>{t('settings.passwordReq3')}</span>
                </li>
              </ul>
            </div>
          </form>
        </div>
      </div>

      {/* Future Settings Sections Can Go Here */}
      {/* Example: Profile Settings, Notification Preferences, etc. */}
    </div>
  );
}

