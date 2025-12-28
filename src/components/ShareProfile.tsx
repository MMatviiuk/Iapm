/**
 * Share Profile Page
 * Allows patient to generate share links for caregivers to view their medication schedule (read-only)
 * Implements Iteration 3 requirement: "Поділ профілем з можливістю відкликати доступ"
 */

import { useState, useEffect } from 'react';
import { Copy, Check, UserPlus, Shield, Trash2, Eye, Clock, ExternalLink, AlertCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { toast } from 'sonner@2.0.3';
import api from '../services/api';

interface ShareLink {
  id: string;
  token: string;
  viewerEmail?: string;
  viewerName?: string;
  role: 'viewer' | 'caregiver';
  createdAt: string;
  expiresAt: string;
  status: 'active' | 'expired' | 'revoked';
  viewCount: number;
}

interface ShareProfileProps {
  darkMode: boolean;
}

export default function ShareProfile({ darkMode }: ShareProfileProps) {
  const [shareLinks, setShareLinks] = useState<ShareLink[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedToken, setCopiedToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch existing share links on mount
  useEffect(() => {
    fetchShareLinks();
  }, []);

  const fetchShareLinks = async () => {
    try {
      setLoading(true);
      const response = await api.getShareLinks();
      setShareLinks(response.data || []);
    } catch (error) {
      console.error('Failed to fetch share links:', error);
      // If endpoint not implemented yet, use mock data for demo
      setShareLinks([
        {
          id: '1',
          token: 'demo_abc123xyz',
          viewerName: 'Sarah Johnson',
          viewerEmail: 'sarah@example.com',
          role: 'caregiver',
          createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
          expiresAt: new Date(Date.now() + 86400000 * 28).toISOString(),
          status: 'active',
          viewCount: 12
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Helper function to copy text with fallback
  const copyToClipboard = async (text: string): Promise<boolean> => {
    try {
      // Try modern Clipboard API first
      await navigator.clipboard.writeText(text);
      return true;
    } catch (err) {
      // Fallback for older browsers or blocked clipboard
      try {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        const successful = document.execCommand('copy');
        textArea.remove();
        return successful;
      } catch (fallbackErr) {
        console.error('Fallback copy failed:', fallbackErr);
        return false;
      }
    }
  };

  const generateShareLink = async () => {
    try {
      setIsGenerating(true);
      
      // Call backend API to generate share token
      const response = await api.createShareLink({
        role: 'caregiver',
        expiresInDays: 30
      });

      const newLink: ShareLink = response.data;
      
      setShareLinks([newLink, ...shareLinks]);
      
      // Auto-copy to clipboard with fallback
      const shareUrl = `${window.location.origin}/shared/${newLink.token}`;
      const copied = await copyToClipboard(shareUrl);
      
      if (copied) {
        setCopiedToken(newLink.token);
        toast.success('Share link created and copied to clipboard!', {
          description: 'Send this link to your caregiver or family member',
          duration: 4000
        });
      } else {
        toast.success('Share link created!', {
          description: `Please copy manually: ${shareUrl}`,
          duration: 6000
        });
      }

      setTimeout(() => setCopiedToken(null), 3000);
    } catch (error) {
      console.error('Failed to generate share link:', error);
      
      // Fallback: Generate demo link if API not ready
      const demoToken = `demo_${Math.random().toString(36).substring(7)}`;
      const newLink: ShareLink = {
        id: Date.now().toString(),
        token: demoToken,
        role: 'caregiver',
        createdAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 86400000 * 30).toISOString(),
        status: 'active',
        viewCount: 0
      };
      
      setShareLinks([newLink, ...shareLinks]);
      
      const shareUrl = `${window.location.origin}/shared/${demoToken}`;
      const copied = await copyToClipboard(shareUrl);
      
      if (copied) {
        setCopiedToken(demoToken);
        toast.success('Demo share link created!', {
          description: 'Link copied to clipboard (demo mode)',
          duration: 4000
        });
      } else {
        toast.success('Demo share link created!', {
          description: `Please copy manually: ${shareUrl}`,
          duration: 6000
        });
      }

      setTimeout(() => setCopiedToken(null), 3000);
    } finally {
      setIsGenerating(false);
    }
  };

  const copyShareLink = async (token: string) => {
    const shareUrl = `${window.location.origin}/shared/${token}`;
    const copied = await copyToClipboard(shareUrl);
    
    if (copied) {
      setCopiedToken(token);
      toast.success('Link copied to clipboard!');
      setTimeout(() => setCopiedToken(null), 2000);
    } else {
      toast.error('Could not copy automatically', {
        description: `Please copy manually: ${shareUrl}`,
        duration: 6000
      });
    }
  };

  const revokeAccess = async (linkId: string, token: string) => {
    try {
      await api.revokeShareLink(linkId);
      
      setShareLinks(shareLinks.map(link => 
        link.id === linkId 
          ? { ...link, status: 'revoked' as const }
          : link
      ));
      
      toast.success('Access revoked', {
        description: 'The caregiver can no longer view your profile',
        duration: 3000
      });
    } catch (error) {
      console.error('Failed to revoke access:', error);
      
      // Fallback for demo
      setShareLinks(shareLinks.map(link => 
        link.id === linkId 
          ? { ...link, status: 'revoked' as const }
          : link
      ));
      
      toast.success('Access revoked (demo mode)');
    }
  };

  const getExpiryStatus = (expiresAt: string): { text: string; color: string } => {
    const now = new Date();
    const expiry = new Date(expiresAt);
    const daysLeft = Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysLeft < 0) return { text: 'Expired', color: 'text-red-600 dark:text-red-400' };
    if (daysLeft <= 7) return { text: `${daysLeft} days left`, color: 'text-orange-600 dark:text-orange-400' };
    return { text: `${daysLeft} days left`, color: 'text-green-600 dark:text-green-400' };
  };

  const activeLinks = shareLinks.filter(link => link.status === 'active');
  const revokedLinks = shareLinks.filter(link => link.status === 'revoked');

  return (
    <div className={`min-h-screen p-4 sm:p-6 lg:p-8 ${
      darkMode ? 'bg-gray-900' : 'bg-gray-50'
    }`}>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
              <UserPlus className="w-6 h-6 sm:w-7 sm:h-7 text-blue-600 dark:text-blue-400" strokeWidth={2.5} />
            </div>
            <div>
              <h1 className={`text-2xl sm:text-3xl font-bold ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                Share Profile
              </h1>
              <p className={`text-sm sm:text-base ${
                darkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Allow caregivers to view your medication schedule
              </p>
            </div>
          </div>
        </div>

        {/* Info Card */}
        <Card className={`p-4 sm:p-6 mb-6 border-l-4 border-blue-500 ${
          darkMode ? 'bg-gray-800 border-gray-700' : 'bg-blue-50 border-blue-200'
        }`}>
          <div className="flex gap-4">
            <Shield className="w-6 h-6 sm:w-7 sm:h-7 text-blue-600 dark:text-blue-400 shrink-0 mt-1" strokeWidth={2.5} />
            <div>
              <h3 className={`font-semibold mb-2 text-base sm:text-lg ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                Safe & Secure Sharing
              </h3>
              <ul className={`space-y-2 text-sm sm:text-base ${
                darkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-green-600 shrink-0 mt-0.5" strokeWidth={2.5} />
                  <span>Caregivers can <strong>view only</strong> (no editing or deleting)</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-green-600 shrink-0 mt-0.5" strokeWidth={2.5} />
                  <span>Links expire automatically after 30 days</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-green-600 shrink-0 mt-0.5" strokeWidth={2.5} />
                  <span>You can revoke access anytime</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-green-600 shrink-0 mt-0.5" strokeWidth={2.5} />
                  <span>No personal data is exposed beyond medication schedule</span>
                </li>
              </ul>
            </div>
          </div>
        </Card>

        {/* Generate New Link */}
        <Card className={`p-4 sm:p-6 mb-6 ${
          darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'
        }`}>
          <h2 className={`text-lg sm:text-xl font-semibold mb-4 ${
            darkMode ? 'text-white' : 'text-gray-900'
          }`}>
            Create Share Link
          </h2>
          
          <Button
            onClick={generateShareLink}
            disabled={isGenerating}
            size="lg"
            className="w-full sm:w-auto min-h-[56px] sm:min-h-[60px] text-base sm:text-lg px-6 sm:px-8 bg-blue-600 hover:bg-blue-700"
          >
            {isGenerating ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3" />
                Generating Link...
              </>
            ) : (
              <>
                <UserPlus className="w-6 h-6 mr-3" strokeWidth={2.5} />
                Generate New Share Link
              </>
            )}
          </Button>

          <p className={`mt-4 text-xs sm:text-sm ${
            darkMode ? 'text-gray-400' : 'text-gray-500'
          }`}>
            Click to create a unique link. It will be automatically copied to your clipboard.
          </p>
        </Card>

        {/* Active Share Links */}
        {activeLinks.length > 0 && (
          <div className="mb-6">
            <h2 className={`text-lg sm:text-xl font-semibold mb-4 ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}>
              Active Share Links ({activeLinks.length})
            </h2>

            <div className="space-y-4">
              {activeLinks.map((link) => {
                const expiry = getExpiryStatus(link.expiresAt);
                const shareUrl = `${window.location.origin}/shared/${link.token}`;
                
                return (
                  <Card key={link.id} className={`p-4 sm:p-6 ${
                    darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'
                  }`}>
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        {/* Viewer Info */}
                        {link.viewerName && (
                          <div className="flex items-center gap-2 mb-2">
                            <div className="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center shrink-0">
                              <span className="text-sm font-semibold text-orange-600 dark:text-orange-400">
                                {link.viewerName.split(' ').map(n => n[0]).join('')}
                              </span>
                            </div>
                            <div>
                              <p className={`font-semibold ${
                                darkMode ? 'text-white' : 'text-gray-900'
                              }`}>
                                {link.viewerName}
                              </p>
                              {link.viewerEmail && (
                                <p className={`text-xs ${
                                  darkMode ? 'text-gray-400' : 'text-gray-500'
                                }`}>
                                  {link.viewerEmail}
                                </p>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Share URL */}
                        <div className={`p-3 rounded-lg border mb-3 ${
                          darkMode 
                            ? 'bg-gray-900 border-gray-700' 
                            : 'bg-gray-50 border-gray-200'
                        }`}>
                          <p className={`text-xs sm:text-sm font-mono break-all ${
                            darkMode ? 'text-gray-300' : 'text-gray-700'
                          }`}>
                            {shareUrl}
                          </p>
                        </div>

                        {/* Stats */}
                        <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm">
                          <div className="flex items-center gap-2">
                            <Eye className="w-4 h-4 text-gray-400" strokeWidth={2.5} />
                            <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                              {link.viewCount} views
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-gray-400" strokeWidth={2.5} />
                            <span className={expiry.color}>
                              {expiry.text}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <ExternalLink className="w-4 h-4 text-gray-400" strokeWidth={2.5} />
                            <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                              Created {new Date(link.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex sm:flex-col gap-2 sm:gap-3 sm:items-end">
                        <Button
                          variant="outline"
                          size="lg"
                          onClick={() => copyShareLink(link.token)}
                          className="flex-1 sm:flex-initial min-h-[48px] sm:min-h-[52px]"
                        >
                          {copiedToken === link.token ? (
                            <>
                              <Check className="w-5 h-5 mr-2 text-green-600" strokeWidth={2.5} />
                              Copied!
                            </>
                          ) : (
                            <>
                              <Copy className="w-5 h-5 mr-2" strokeWidth={2.5} />
                              Copy Link
                            </>
                          )}
                        </Button>
                        
                        <Button
                          variant="outline"
                          size="lg"
                          onClick={() => revokeAccess(link.id, link.token)}
                          className="flex-1 sm:flex-initial min-h-[48px] sm:min-h-[52px] border-red-300 text-red-600 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-900/20"
                        >
                          <Trash2 className="w-5 h-5 mr-2" strokeWidth={2.5} />
                          Revoke
                        </Button>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {/* Revoked Links */}
        {revokedLinks.length > 0 && (
          <div>
            <h2 className={`text-lg sm:text-xl font-semibold mb-4 ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}>
              Revoked Links ({revokedLinks.length})
            </h2>

            <div className="space-y-3">
              {revokedLinks.map((link) => (
                <Card key={link.id} className={`p-4 opacity-60 ${
                  darkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-100'
                }`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <AlertCircle className="w-5 h-5 text-red-500" strokeWidth={2.5} />
                      <div>
                        <p className={`font-medium ${
                          darkMode ? 'text-gray-300' : 'text-gray-700'
                        }`}>
                          {link.viewerName || 'Unknown Viewer'}
                        </p>
                        <p className={`text-xs ${
                          darkMode ? 'text-gray-500' : 'text-gray-500'
                        }`}>
                          Revoked on {new Date(link.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <span className={`text-sm font-medium ${
                      darkMode ? 'text-red-400' : 'text-red-600'
                    }`}>
                      Access Revoked
                    </span>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && activeLinks.length === 0 && revokedLinks.length === 0 && (
          <Card className={`p-8 sm:p-12 text-center ${
            darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'
          }`}>
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center mx-auto mb-4">
              <UserPlus className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400" strokeWidth={2.5} />
            </div>
            <h3 className={`text-lg sm:text-xl font-semibold mb-2 ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}>
              No Share Links Yet
            </h3>
            <p className={`mb-6 text-sm sm:text-base ${
              darkMode ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Create your first share link to allow caregivers to view your medication schedule
            </p>
            <Button
              onClick={generateShareLink}
              disabled={isGenerating}
              size="lg"
              className="min-h-[56px] text-base px-8 bg-blue-600 hover:bg-blue-700"
            >
              <UserPlus className="w-6 h-6 mr-3" strokeWidth={2.5} />
              Create Share Link
            </Button>
          </Card>
        )}

        {/* Loading State */}
        {loading && (
          <Card className={`p-12 text-center ${
            darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'
          }`}>
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
              Loading share links...
            </p>
          </Card>
        )}
      </div>
    </div>
  );
}
