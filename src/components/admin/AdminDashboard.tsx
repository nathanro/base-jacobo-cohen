import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, Shield, Activity, Database } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  totalRoles: number;
  adminUsers: number;
}

const AdminDashboard: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    activeUsers: 0,
    totalRoles: 0,
    adminUsers: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardStats();
  }, []);

  const loadDashboardStats = async () => {
    try {
      setLoading(true);

      // Load users stats
      const { data: usersData, error: usersError } = await (window as any).ezsite.apis.tablePage(41233, {
        PageNo: 1,
        PageSize: 1000,
        OrderByField: "id",
        IsAsc: true,
        Filters: []
      });

      // Load roles stats
      const { data: rolesData, error: rolesError } = await (window as any).ezsite.apis.tablePage(41234, {
        PageNo: 1,
        PageSize: 1000,
        OrderByField: "id",
        IsAsc: true,
        Filters: []
      });

      if (usersError || rolesError) {
        throw new Error(usersError || rolesError);
      }

      const users = usersData?.List || [];
      const roles = rolesData?.List || [];

      const totalUsers = users.length;
      const activeUsers = users.filter((user: any) => user.is_activated).length;
      const totalRoles = roles.length;
      const adminUsers = users.filter((user: any) => user.role_code === 'Administrator').length;

      setStats({
        totalUsers,
        activeUsers,
        totalRoles,
        adminUsers
      });

    } catch (error) {
      console.error('Error loading dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, description, icon: Icon, color }: {
    title: string;
    value: number;
    description: string;
    icon: React.ElementType;
    color: string;
  }) => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className={`h-4 w-4 ${color}`} />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {loading ? (
            <div className="h-8 w-16 bg-muted animate-pulse rounded"></div>
          ) : (
            value
          )}
        </div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            {t('admin.dashboard')}
          </CardTitle>
          <CardDescription>
            Welcome back, {user?.Name}. Here's an overview of your system.
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Users"
          value={stats.totalUsers}
          description="All registered users"
          icon={Users}
          color="text-blue-600"
        />
        <StatCard
          title="Active Users"
          value={stats.activeUsers}
          description="Currently active users"
          icon={Activity}
          color="text-green-600"
        />
        <StatCard
          title="Total Roles"
          value={stats.totalRoles}
          description="Configured user roles"
          icon={Shield}
          color="text-purple-600"
        />
        <StatCard
          title="Administrators"
          value={stats.adminUsers}
          description="Users with admin access"
          icon={Database}
          color="text-red-600"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>System Information</CardTitle>
            <CardDescription>Current system status and configuration</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Database Status</span>
              <Badge variant="default">Connected</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">User Registration</span>
              <Badge variant="default">Enabled</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Email Verification</span>
              <Badge variant="default">Active</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common administrative tasks</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="text-sm text-muted-foreground">
              • Manage users and their roles
            </div>
            <div className="text-sm text-muted-foreground">
              • Create and configure new roles
            </div>
            <div className="text-sm text-muted-foreground">
              • Upload and manage data files
            </div>
            <div className="text-sm text-muted-foreground">
              • Configure system settings
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;