/**
 * SECURITY DASHBOARD
 * HIPAA/GDPR Compliant - View and export audit logs
 * Medical-grade security monitoring for Enterprise SaaS
 */

import { useState, useEffect } from 'react';
import { 
  Shield, 
  Download, 
  Search, 
  Filter, 
  AlertCircle, 
  CheckCircle, 
  Clock,
  User,
  FileText,
  TrendingUp,
  Activity
} from 'lucide-react';
import { motion } from 'motion/react';
import { toast } from 'sonner';
import { auditLogger, AuditLogEntry, AuditAction } from '../utils/auditLogger';
import { Button } from './ui/button';
import { Input } from './ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Badge } from './ui/badge';
import { Card } from './ui/card';

interface SecurityDashboardProps {
  darkMode: boolean;
  setCurrentPage: (page: string) => void;
}

export default function SecurityDashboard({ darkMode, setCurrentPage }: SecurityDashboardProps) {
  const [logs, setLogs] = useState<AuditLogEntry[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<AuditLogEntry[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [severityFilter, setSeverityFilter] = useState<string>('all');
  const [actionFilter, setActionFilter] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLogs();
  }, []);

  useEffect(() => {
    filterLogs();
  }, [logs, searchQuery, severityFilter, actionFilter]);

  const loadLogs = () => {
    try {
      setLoading(true);
      const allLogs = auditLogger.getAllLogs();
      setLogs(allLogs);
    } catch (error) {
      console.error('Failed to load audit logs:', error);
      toast.error('Failed to load security logs');
    } finally {
      setLoading(false);
    }
  };

  const filterLogs = () => {
    let filtered = [...logs];

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (log) =>
          log.userName.toLowerCase().includes(query) ||
          log.action.toLowerCase().includes(query) ||
          log.resource.toLowerCase().includes(query) ||
          log.details?.medicationName?.toLowerCase().includes(query)
      );
    }

    // Filter by severity
    if (severityFilter !== 'all') {
      filtered = filtered.filter((log) => log.severity === severityFilter);
    }

    // Filter by action
    if (actionFilter !== 'all') {
      filtered = filtered.filter((log) => log.action === actionFilter);
    }

    // Sort by timestamp (newest first)
    filtered.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    setFilteredLogs(filtered);
  };

  const handleExportCSV = () => {
    try {
      const csv = auditLogger.exportAsCSV();
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `audit-logs-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success('Audit logs exported', {
        description: 'CSV file downloaded successfully',
      });
    } catch (error) {
      console.error('Export failed:', error);
      toast.error('Export failed', {
        description: 'Please try again',
      });
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'high':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical':
      case 'high':
        return <AlertCircle className="w-5 h-5" />;
      case 'medium':
        return <Clock className="w-5 h-5" />;
      case 'low':
        return <CheckCircle className="w-5 h-5" />;
      default:
        return <Activity className="w-5 h-5" />;
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    }).format(date);
  };

  const getActionLabel = (action: AuditAction) => {
    return action.replace(/_/g, ' ');
  };

  const stats = auditLogger.getStatistics();

  const uniqueActions = Array.from(new Set(logs.map((log) => log.action))).sort();

  return (
    <div className={`min-h-screen pb-24 ${darkMode ? 'bg-gray-900' : 'bg-[#E8F4F8]'}`}>
      {/* Header */}
      <div className={`shadow-sm sticky top-0 z-10 px-4 sm:px-6 py-4 sm:py-5 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Shield className={`w-8 h-8 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
            <h1 className={`text-xl sm:text-2xl font-semibold leading-tight ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Security Dashboard
            </h1>
          </div>
          <Button
            onClick={handleExportCSV}
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Export CSV</span>
          </Button>
        </div>
      </div>

      <div className="px-4 sm:px-6 py-6 max-w-7xl mx-auto space-y-6">
        {/* Statistics Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className={`p-4 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                <FileText className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <div className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {stats.totalLogs}
                </div>
                <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Total Logs
                </div>
              </div>
            </div>
          </Card>

          <Card className={`p-4 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-green-100 dark:bg-green-900 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <div className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {stats.successRate.toFixed(1)}%
                </div>
                <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Success Rate
                </div>
              </div>
            </div>
          </Card>

          <Card className={`p-4 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-red-100 dark:bg-red-900 flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <div className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {stats.criticalActions}
                </div>
                <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Critical Actions
                </div>
              </div>
            </div>
          </Card>

          <Card className={`p-4 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-orange-100 dark:bg-orange-900 flex items-center justify-center">
                <User className="w-6 h-6 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <div className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {stats.failedLogins}
                </div>
                <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Failed Logins
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Filters */}
        <Card className={`p-4 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Search logs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={severityFilter} onValueChange={setSeverityFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by severity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Severities</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>

            <Select value={actionFilter} onValueChange={setActionFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by action" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Actions</SelectItem>
                {uniqueActions.map((action) => (
                  <SelectItem key={action} value={action}>
                    {getActionLabel(action as AuditAction)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </Card>

        {/* Logs List */}
        <Card className={`${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Audit Logs ({filteredLogs.length})
            </h2>
          </div>

          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {loading ? (
              <div className="p-8 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto" />
              </div>
            ) : filteredLogs.length === 0 ? (
              <div className="p-8 text-center">
                <FileText className="w-12 h-12 mx-auto text-gray-400 mb-2" />
                <p className={`text-lg ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  No logs found
                </p>
              </div>
            ) : (
              filteredLogs.map((log) => (
                <motion.div
                  key={log.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getSeverityColor(log.severity)}`}>
                      {getSeverityIcon(log.severity)}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge variant="outline" className="font-mono text-xs">
                          {getActionLabel(log.action)}
                        </Badge>
                        <Badge className={getSeverityColor(log.severity)}>
                          {log.severity}
                        </Badge>
                        {!log.success && (
                          <Badge variant="destructive">Failed</Badge>
                        )}
                      </div>

                      <div className={`mt-2 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        <span className="font-semibold">{log.userName}</span>
                        {' • '}
                        <span className="capitalize">{log.userRole}</span>
                        {' • '}
                        <span>{log.resource}</span>
                        {log.resourceId && (
                          <>
                            {' • '}
                            <span className="font-mono text-xs">ID: {log.resourceId}</span>
                          </>
                        )}
                      </div>

                      {log.details && (
                        <div className={`mt-1 text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          {Object.entries(log.details).map(([key, value]) => (
                            <span key={key} className="mr-3">
                              {key}: {JSON.stringify(value)}
                            </span>
                          ))}
                        </div>
                      )}

                      {log.errorMessage && (
                        <div className="mt-2 text-sm text-red-600 dark:text-red-400">
                          Error: {log.errorMessage}
                        </div>
                      )}

                      <div className={`mt-2 text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                        <Clock className="w-3 h-3 inline mr-1" />
                        {formatTimestamp(log.timestamp)}
                        {' • '}
                        Session: {log.sessionId?.substring(0, 8)}...
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
