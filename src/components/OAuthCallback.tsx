import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface OAuthCallbackProps {
  setCurrentPage: (page: string) => void;
  setIsAuthenticated: (value: boolean) => void;
}

/**
 * OAuth Callback Handler
 * Handles redirect from Google/Facebook/Apple OAuth providers
 */
export function OAuthCallback({ setCurrentPage, setIsAuthenticated }: OAuthCallbackProps) {
  const [status, setStatus] = useState<'processing' | 'success' | 'error'>('processing');
  const [message, setMessage] = useState('Processing authentication...');

  useEffect(() => {
    handleOAuthCallback();
  }, []);

  const handleOAuthCallback = async () => {
    try {
      // Get URL parameters
      const params = new URLSearchParams(window.location.search);
      const code = params.get('code');
      const state = params.get('state');
      const error = params.get('error');

      // Check for OAuth errors
      if (error) {
        throw new Error(`OAuth error: ${error}`);
      }

      // Validate state (CSRF protection)
      const savedState = sessionStorage.getItem('oauth_state');
      if (state !== savedState) {
        throw new Error('Invalid state parameter - possible CSRF attack');
      }

      // Get provider
      const provider = sessionStorage.getItem('oauth_provider');
      const action = sessionStorage.getItem('oauth_action') || 'login';

      if (!code || !provider) {
        throw new Error('Missing authorization code or provider');
      }

      setMessage(`Authenticating with ${provider}...`);

      // Exchange authorization code for access token
      // In production, this should call your backend API
      let data;
      
      try {
        const response = await fetch('/api/auth/oauth/callback', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            code,
            provider,
            action,
            redirectUri: `${window.location.origin}${window.location.pathname}?page=oauth-callback`,
          }),
        });

        if (!response.ok) {
          throw new Error('Backend OAuth not configured');
        }

        data = await response.json();
      } catch (backendError) {
        console.warn('Backend OAuth not available, using demo mode:', backendError);
        
        // DEMO MODE: Simulate successful OAuth
        // In production, this should be removed
        toast.info('OAuth Demo Mode', {
          description: 'Backend OAuth not configured. Using demo authentication.',
          duration: 5000,
        });

        // Create demo user data
        data = {
          token: 'demo_oauth_token_' + Date.now(),
          user: {
            id: Math.floor(Math.random() * 10000),
            email: `${provider}user@demo.com`,
            firstName: provider.charAt(0).toUpperCase() + provider.slice(1),
            lastName: 'User',
            role: 'patient',
            onboardingComplete: false,
          },
        };
      }

      // Save JWT token
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      // Clear OAuth session data
      sessionStorage.removeItem('oauth_state');
      sessionStorage.removeItem('oauth_provider');
      sessionStorage.removeItem('oauth_action');

      // Success!
      setStatus('success');
      setMessage('Authentication successful!');

      // Show success toast
      toast.success(`Signed in with ${provider}`, {
        description: `Welcome back, ${data.user.firstName || data.user.email}!`,
        duration: 3000,
      });

      // Redirect to app
      setTimeout(() => {
        setIsAuthenticated(true);
        setCurrentPage('dashboard');
      }, 1500);

    } catch (error) {
      console.error('OAuth callback error:', error);
      
      setStatus('error');
      setMessage(error instanceof Error ? error.message : 'Authentication failed');

      // Show error toast
      toast.error('Authentication failed', {
        description: 'Please try again or use email/password',
        duration: 5000,
      });

      // Redirect back to login after delay
      setTimeout(() => {
        setCurrentPage('login');
      }, 3000);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-slate-50 p-6">
      <div className="max-w-md w-full text-center">
        {/* Loading/Status Icon */}
        <div className="mb-6 flex justify-center">
          {status === 'processing' && (
            <Loader2 className="w-16 h-16 text-blue-600 animate-spin" />
          )}
          {status === 'success' && (
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <svg className="w-10 h-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          )}
          {status === 'error' && (
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
              <svg className="w-10 h-10 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
          )}
        </div>

        {/* Status Message */}
        <h2 className="text-2xl mb-3">
          {status === 'processing' && 'Authenticating...'}
          {status === 'success' && 'Success!'}
          {status === 'error' && 'Authentication Failed'}
        </h2>

        <p className="text-slate-600 text-lg">
          {message}
        </p>

        {/* Additional Info */}
        {status === 'processing' && (
          <p className="text-sm text-slate-500 mt-4">
            Please wait while we complete your sign in...
          </p>
        )}

        {status === 'error' && (
          <button
            onClick={() => setCurrentPage('login')}
            className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Login
          </button>
        )}
      </div>
    </div>
  );
}
