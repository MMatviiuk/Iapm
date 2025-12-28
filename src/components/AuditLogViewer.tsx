/**
 * AUDIT LOG VIEWER
 * Medical-grade audit trail viewer for HIPAA/GDPR compliance
 * Displays all user actions with filtering and export capabilities
 */

import React, { useState, useEffect } from 'react';
import { auditLogger, AuditLogEntry } from '../utils/auditLogger';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';
import {
  Shield,
  Download,
  Search,
  Filter,
  Clock,
  User,
  Activity,
  AlertCircle,
  CheckCircle,
  XCircle,
} from 'lucide-react';

interface AuditLogViewerProps {
  darkMode: boolean;
  onClose: () => void;
}

const AuditLogViewer: React.FC<AuditLogViewerProps> = ({ darkMode, onClose }) => {
  const [logs, setLogs] = useState<AuditLogEntry[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<AuditLogEntry[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [severityFilter, setSeverityFilter] = useState<string>('all');
  const [successFilter, setSuccessFilter] = useState<string>('all');
  const [statistics, setStatistics] = useState({
    totalLogs: 0,
    successRate: 0,
    criticalActions: 0,
    failedLogins: 0,
    lastActivity: null as string | null,
  });

  useEffect(() => {
    loadLogs();
  }, []);

  useEffect(() => {
    filterLogs();
  }, [logs, searchTerm, severityFilter, successFilter]);

  const loadLogs = () => {
    const allLogs = auditLogger.getAllLogs();
    setLogs(allLogs);
    setStatistics(auditLogger.getStatistics());
  };

  const filterLogs = () => {
    let filtered = [...logs];

    // Search filter
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (log) =>
          log.userName.toLowerCase().includes(search) ||
          log.action.toLowerCase().includes(search) ||
          log.resource.toLowerCase().includes(search) ||
          log.userId.toLowerCase().includes(search)
      );
    }

    // Severity filter
    if (severityFilter !== 'all') {
      filtered = filtered.filter((log) => log.severity === severityFilter);
    }

    // Success filter
    if (successFilter !== 'all') {
      const isSuccess = successFilter === 'success';
      filtered = filtered.filter((log) => log.success === isSuccess);
    }

    setFilteredLogs(filtered);
  };

  const exportLogs = () => {
    const csv = auditLogger.exportAsCSV();
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `audit-logs-${new Date().toISOString()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getSeverityColor = (severity: AuditLogEntry['severity']) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-500';
      case 'high':
        return 'bg-orange-500';
      case 'medium':
        return 'bg-yellow-500';
      case 'low':
        return 'bg-blue-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getSuccessIcon = (success: boolean) => {
    return success ? (
      <CheckCircle className="w-4 h-4 text-green-500" />
    ) : (
      <XCircle className="w-4 h-4 text-red-500" />
    );
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'} p-4 sm:p-6 lg:p-8`}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Shield className={`w-8 h-8 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
            <div>
              <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Audit Log Viewer
              </h1>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                HIPAA/GDPR Compliance - Medical Grade Audit Trail
              </p>
            </div>
          </div>
          <Button onClick={onClose} variant="outline" size="lg">
            Close
          </Button>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
          <Card className={`p-4 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}`}>
            <div className="flex items-center gap-3">
              <Activity className="w-8 h-8 text-blue-500" />
              <div>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Total Logs
                </p>
                <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {statistics.totalLogs}
                </p>
              </div>
            </div>
          </Card>

          <Card className={`p-4 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}`}>
            <div className="flex items-center gap-3">
              <CheckCircle className="w-8 h-8 text-green-500" />
              <div>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Success Rate
                </p>
                <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {statistics.successRate.toFixed(1)}%
                </p>
              </div>
            </div>
          </Card>

          <Card className={`p-4 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}`}>
            <div className="flex items-center gap-3">
              <AlertCircle className="w-8 h-8 text-red-500" />
              <div>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Critical Actions
                </p>
                <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {statistics.criticalActions}
                </p>
              </div>
            </div>
          </Card>

          <Card className={`p-4 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}`}>
            <div className="flex items-center gap-3">
              <XCircle className="w-8 h-8 text-orange-500" />
              <div>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Failed Logins
                </p>
                <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {statistics.failedLogins}
                </p>
              </div>
            </div>
          </Card>

          <Card className={`p-4 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}`}>
            <div className="flex items-center gap-3">
              <Clock className="w-8 h-8 text-purple-500" />
              <div>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Last Activity
                </p>
                <p className={`text-xs font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {statistics.lastActivity
                    ? new Date(statistics.lastActivity).toLocaleTimeString()
                    : 'N/A'}
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Filters */}
        <Card className={`p-4 mb-6 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}`}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className={`text-sm font-medium mb-2 block ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                <Search className="w-4 h-4 inline mr-2" />
                Search
              </label>
              <Input
                placeholder="Search by user, action, resource..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={darkMode ? 'bg-gray-700 text-white' : ''}
              />
            </div>

            <div>
              <label className={`text-sm font-medium mb-2 block ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                <Filter className="w-4 h-4 inline mr-2" />
                Severity
              </label>
              <Select value={severityFilter} onValueChange={setSeverityFilter}>
                <SelectTrigger className={darkMode ? 'bg-gray-700 text-white' : ''}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Severities</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className={`text-sm font-medium mb-2 block ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Status
              </label>
              <Select value={successFilter} onValueChange={setSuccessFilter}>
                <SelectTrigger className={darkMode ? 'bg-gray-700 text-white' : ''}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="success">Success Only</SelectItem>
                  <SelectItem value="failed">Failed Only</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              <Button onClick={exportLogs} className="w-full" size="lg">
                <Download className="w-5 h-5 mr-2" />
                Export CSV
              </Button>
            </div>
          </div>
        </Card>

        {/* Logs Table */}
        <Card className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}`}>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className={darkMode ? 'border-gray-700' : ''}>
                  <TableHead className={darkMode ? 'text-gray-300' : ''}>Time</TableHead>
                  <TableHead className={darkMode ? 'text-gray-300' : ''}>User</TableHead>
                  <TableHead className={darkMode ? 'text-gray-300' : ''}>Action</TableHead>
                  <TableHead className={darkMode ? 'text-gray-300' : ''}>Resource</TableHead>
                  <TableHead className={darkMode ? 'text-gray-300' : ''}>Status</TableHead>
                  <TableHead className={darkMode ? 'text-gray-300' : ''}>Severity</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLogs.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className={`text-center py-8 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}
                    >
                      No audit logs found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredLogs.map((log) => (
                    <TableRow
                      key={log.id}
                      className={darkMode ? 'border-gray-700 hover:bg-gray-750' : ''}
                    >
                      <TableCell className={darkMode ? 'text-gray-300' : ''}>
                        <div className="text-sm">
                          {new Date(log.timestamp).toLocaleString()}
                        </div>
                      </TableCell>
                      <TableCell className={darkMode ? 'text-gray-300' : ''}>
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4" />
                          <div>
                            <div className="font-medium">{log.userName}</div>
                            <div className="text-xs text-gray-500">{log.userRole}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className={darkMode ? 'text-gray-300' : ''}>
                        <code className="text-sm bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                          {log.action}
                        </code>
                      </TableCell>
                      <TableCell className={darkMode ? 'text-gray-300' : ''}>
                        {log.resource}
                      </TableCell>
                      <TableCell>{getSuccessIcon(log.success)}</TableCell>
                      <TableCell>
                        <Badge className={getSeverityColor(log.severity)}>
                          {log.severity}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AuditLogViewer;
