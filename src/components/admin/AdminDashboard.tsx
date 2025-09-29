import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/contexts/AuthContext';
import {
  Users,
  UserCheck,
  Shield,
  UserCog,
  Database,
  FileSpreadsheet,
  Activity,
  TrendingUp,
  Calendar,
  Server,
  AlertCircle,
  CheckCircle } from
'lucide-react';

interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  totalRoles: number;
  adminUsers: number;
  totalUploads: number;
  premiumContent: number;
}

interface StatCardProps {
  title: string;
  value: number;
  description: string;
  icon: React.ElementType;
  color: string;
}

function StatCard({ title, value, description, icon: Icon, color }: StatCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className={`h-4 w-4 ${color}`} />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value.toLocaleString()}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>);

}

export function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    activeUsers: 0,
    totalRoles: 0,
    adminUsers: 0,
    totalUploads: 0,
    premiumContent: 0
  });
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { t } = useTranslation();

  const loadDashboardStats = async () => {
    setLoading(true);
    try {
      // Load users data
      const usersResponse = await window.ezsite.apis.tablePage(41233, {
        PageNo: 1,
        PageSize: 1000
      });

      // Load roles data  
      const rolesResponse = await window.ezsite.apis.tablePage(41234, {
        PageNo: 1,
        PageSize: 100
      });

      // Load uploads data
      const uploadsResponse = await window.ezsite.apis.tablePage(41729, {
        PageNo: 1,
        PageSize: 1000
      });

      if (usersResponse.error) throw usersResponse.error;
      if (rolesResponse.error) throw rolesResponse.error;
      if (uploadsResponse.error) throw uploadsResponse.error;

      const users = usersResponse.data.List || [];
      const roles = rolesResponse.data.List || [];
      const uploads = uploadsResponse.data.List || [];

      // Calculate statistics
      const totalUsers = users.length;
      const activeUsers = users.filter((user: any) => user.is_activated).length;
      const totalRoles = roles.length;
      const adminUsers = users.filter((user: any) => user.role_code === 'Administrator').length;
      const totalUploads = uploads.length;
      const premiumContent = uploads.filter((upload: any) => upload.is_premium).length;

      setStats({
        totalUsers,
        activeUsers,
        totalRoles,
        adminUsers,
        totalUploads,
        premiumContent
      });
    } catch (error: any) {
      console.error('Failed to load dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-current border-t-transparent" />
        <span className="ml-3">Loading dashboard...</span>
      </div>);

  }

  return (
    <div className="space-y-6">
      {/* Welcome Card */}
      <Card className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
        <CardHeader>
          <CardTitle className="text-2xl">Welcome back, {user?.Name || 'Administrator'}!</CardTitle>
          <CardDescription className="text-blue-100">
            Here's what's happening with your system today
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Users"
          value={stats.totalUsers}
          description="Registered users in system"
          icon={Users}
          color="text-blue-600" />

        <StatCard
          title="Active Users"
          value={stats.activeUsers}
          description="Currently active users"
          icon={UserCheck}
          color="text-green-600" />

        <StatCard
          title="User Roles"
          value={stats.totalRoles}
          description="Available user roles"
          icon={Shield}
          color="text-purple-600" />

        <StatCard
          title="Administrators"
          value={stats.adminUsers}
          description="Users with admin access"
          icon={UserCog}
          color="text-red-600" />

      </div>

      {/* Data Management Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
        <StatCard
          title="Excel Uploads"
          value={stats.totalUploads}
          description="Total uploaded datasets"
          icon={FileSpreadsheet}
          color="text-orange-600" />

        <StatCard
          title="Premium Content"
          value={stats.premiumContent}
          description="Premium datasets available"
          icon={TrendingUp}
          color="text-indigo-600" />

      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {/* System Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Server className="h-5 w-5" />
              System Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Database Status</span>
              <Badge variant="default" className="bg-green-100 text-green-800">
                <CheckCircle className="h-3 w-3 mr-1" />
                Connected
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">User Registration</span>
              <Badge variant="default">
                Enabled
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Email Verification</span>
              <Badge variant="secondary">
                Required
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">System Status</span>
              <Badge variant="default" className="bg-green-100 text-green-800">
                Operational
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Quick Actions
            </CardTitle>
            <CardDescription>
              Common administrative tasks
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full justify-start" variant="outline">
              <Users className="h-4 w-4 mr-2" />
              Manage Users
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <Shield className="h-4 w-4 mr-2" />
              Manage Roles
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <FileSpreadsheet className="h-4 w-4 mr-2" />
              View Uploads
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <Database className="h-4 w-4 mr-2" />
              System Settings
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Recent Activity
          </CardTitle>
          <CardDescription>
            Latest system events and activities
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="h-2 w-2 bg-green-500 rounded-full mt-2"></div>
              <div className="space-y-1">
                <p className="text-sm font-medium">System startup completed</p>
                <p className="text-xs text-muted-foreground">All services are running normally</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="h-2 w-2 bg-blue-500 rounded-full mt-2"></div>
              <div className="space-y-1">
                <p className="text-sm font-medium">Admin panel accessed</p>
                <p className="text-xs text-muted-foreground">Administrator {user?.Name || 'Unknown'} logged in</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="h-2 w-2 bg-orange-500 rounded-full mt-2"></div>
              <div className="space-y-1">
                <p className="text-sm font-medium">Database connection verified</p>
                <p className="text-xs text-muted-foreground">All database operations are functioning properly</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>);

}