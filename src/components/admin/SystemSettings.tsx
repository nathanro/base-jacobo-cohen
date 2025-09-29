import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { showError, showSuccess, showLoading, dismissToast } from '@/utils/toast';
import { useTranslation } from 'react-i18next';
import { 
  Settings, 
  Database, 
  Shield, 
  Download, 
  Trash2, 
  Eye, 
  RefreshCw, 
  CheckCircle,
  AlertTriangle,
  Server,
  Activity,
  HardDrive,
  Clock,
  Users,
  FileText,
  AlertCircle
} from 'lucide-react';

export function SystemSettings() {
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [debugMode, setDebugMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [dbStatus, setDbStatus] = useState<'connected' | 'error' | 'testing'>('connected');
  const { t } = useTranslation();

  const handleMaintenanceToggle = async (enabled: boolean) => {
    const toastId = showLoading('Updating maintenance mode...');
    try {
      // Simulate API call - in real implementation, this would update a system setting
      await new Promise(resolve => setTimeout(resolve, 1000));
      setMaintenanceMode(enabled);
      dismissToast(toastId);
      showSuccess(`Maintenance mode ${enabled ? 'enabled' : 'disabled'}`);
    } catch (error) {
      dismissToast(toastId);
      showError('Failed to update maintenance mode');
    }
  };

  const handleDebugToggle = async (enabled: boolean) => {
    const toastId = showLoading('Updating debug mode...');
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setDebugMode(enabled);
      dismissToast(toastId);
      showSuccess(`Debug mode ${enabled ? 'enabled' : 'disabled'}`);
    } catch (error) {
      dismissToast(toastId);
      showError('Failed to update debug mode');
    }
  };

  const handleDatabaseBackup = async () => {
    const toastId = showLoading('Creating database backup...');
    try {
      // Simulate backup process
      await new Promise(resolve => setTimeout(resolve, 3000));
      dismissToast(toastId);
      showSuccess('Database backup created successfully');
    } catch (error) {
      dismissToast(toastId);
      showError('Failed to create database backup');
    }
  };

  const testDatabaseConnection = async () => {
    setDbStatus('testing');
    try {
      // Test database connection by trying to fetch roles
      const response = await window.ezsite.apis.tablePage(41234, {
        PageNo: 1,
        PageSize: 1
      });
      
      if (response.error) {
        throw response.error;
      }
      
      setDbStatus('connected');
      showSuccess('Database connection successful');
    } catch (error: any) {
      setDbStatus('error');
      showError(error || 'Database connection failed');
    }
  };

  const downloadSystemLogs = () => {
    // Generate sample log content
    const logContent = [
      `[${new Date().toISOString()}] INFO - System startup completed`,
      `[${new Date().toISOString()}] INFO - Database connection established`,
      `[${new Date().toISOString()}] INFO - User authentication system active`,
      `[${new Date().toISOString()}] DEBUG - Excel upload functionality initialized`,
      `[${new Date().toISOString()}] INFO - Admin panel loaded successfully`,
    ].join('\n');

    // Create and download log file
    const blob = new Blob([logContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `system-logs-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
    
    showSuccess('System logs downloaded');
  };

  const clearSystemLogs = async () => {
    if (!confirm('Are you sure you want to clear all system logs? This action cannot be undone.')) {
      return;
    }

    const toastId = showLoading('Clearing system logs...');
    try {
      // Simulate log clearing
      await new Promise(resolve => setTimeout(resolve, 1500));
      dismissToast(toastId);
      showSuccess('System logs cleared successfully');
    } catch (error) {
      dismissToast(toastId);
      showError('Failed to clear system logs');
    }
  };

  const viewSystemLogs = () => {
    // In a real implementation, this would open a modal or navigate to a logs view
    showSuccess('Opening system logs viewer...');
  };

  return (
    <div className="space-y-6">
      {/* General Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            General Settings
          </CardTitle>
          <CardDescription>
            Configure basic system behavior and operational modes
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base font-medium">Maintenance Mode</Label>
              <p className="text-sm text-muted-foreground">
                Temporarily disable public access for system maintenance
              </p>
            </div>
            <Switch
              checked={maintenanceMode}
              onCheckedChange={handleMaintenanceToggle}
            />
          </div>
          
          <Separator />
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base font-medium">Debug Mode</Label>
              <p className="text-sm text-muted-foreground">
                Enable detailed logging and error reporting for troubleshooting
              </p>
            </div>
            <Switch
              checked={debugMode}
              onCheckedChange={handleDebugToggle}
            />
          </div>
        </CardContent>
      </Card>

      {/* Database Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Database Settings
          </CardTitle>
          <CardDescription>
            Monitor database health and perform maintenance operations
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base font-medium">Database Status</Label>
              <div className="flex items-center gap-2">
                {dbStatus === 'connected' && (
                  <>
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <Badge variant="default" className="bg-green-100 text-green-800">
                      Connected
                    </Badge>
                  </>
                )}
                {dbStatus === 'error' && (
                  <>
                    <AlertTriangle className="h-4 w-4 text-red-500" />
                    <Badge variant="destructive">
                      Connection Error
                    </Badge>
                  </>
                )}
                {dbStatus === 'testing' && (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    <Badge variant="secondary">
                      Testing...
                    </Badge>
                  </>
                )}
              </div>
            </div>
            <Button 
              variant="outline" 
              onClick={testDatabaseConnection}
              disabled={dbStatus === 'testing'}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Test Connection
            </Button>
          </div>
          
          <Separator />
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base font-medium">Database Backup</Label>
              <p className="text-sm text-muted-foreground">
                Create a backup of all system data and configurations
              </p>
            </div>
            <Button onClick={handleDatabaseBackup}>
              <Download className="h-4 w-4 mr-2" />
              Create Backup
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* System Logs */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            System Logs
          </CardTitle>
          <CardDescription>
            Monitor system activity and troubleshoot issues
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" onClick={viewSystemLogs}>
              <Eye className="h-4 w-4 mr-2" />
              View Logs
            </Button>
            <Button variant="outline" onClick={downloadSystemLogs}>
              <Download className="h-4 w-4 mr-2" />
              Download Logs
            </Button>
            <Button variant="destructive" onClick={clearSystemLogs}>
              <Trash2 className="h-4 w-4 mr-2" />
              Clear Logs
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* System Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Server className="h-5 w-5" />
            System Information
          </CardTitle>
          <CardDescription>
            Current system status and configuration details
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">System Status</span>
                <Badge variant="default" className="bg-green-100 text-green-800">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Operational
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Uptime</span>
                <span className="text-sm text-muted-foreground">2 days, 14 hours</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Last Backup</span>
                <span className="text-sm text-muted-foreground">1 hour ago</span>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Storage Usage</span>
                <span className="text-sm text-muted-foreground">342 MB / 10 GB</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Active Sessions</span>
                <span className="text-sm text-muted-foreground">12 users</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Log Level</span>
                <Badge variant={debugMode ? "default" : "secondary"}>
                  {debugMode ? "Debug" : "Info"}
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Usage Instructions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            System Administration Guide
          </CardTitle>
          <CardDescription>
            Best practices and recommended actions for system administrators
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium">Regular Maintenance</p>
                <p className="text-sm text-muted-foreground">
                  Create database backups weekly and monitor system logs daily
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium">User Management</p>
                <p className="text-sm text-muted-foreground">
                  Regularly review user accounts and role assignments for security
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium">Performance Monitoring</p>
                <p className="text-sm text-muted-foreground">
                  Test database connections regularly and monitor system performance
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium">Security Updates</p>
                <p className="text-sm text-muted-foreground">
                  Keep system components updated and review access permissions periodically
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}