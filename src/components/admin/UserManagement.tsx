import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { showError, showSuccess } from '@/utils/toast';
import { useTranslation } from 'react-i18next';
import { Plus, Edit, Trash2, Search, Users } from 'lucide-react';

interface User {
  id: number;
  name: string;
  email: string;
  phone_number: string;
  create_time: string;
  is_activated: boolean;
  role_id: number;
  role_name: string;
  role_code: string;
}

interface Role {
  id: number;
  name: string;
  code: string;
  remark: string;
}

const userSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email format'),
  phone_number: z.string().optional(),
  password: z.string().optional(),
  role_id: z.number().min(1, 'Role is required'),
  is_activated: z.boolean().default(true)
}).refine((data) => {
  // Password is required only for new users (when no ID exists)
  return true; // We'll handle this in the component logic
}, {
  message: "Password is required for new users",
  path: ["password"]
});

type UserFormData = z.infer<typeof userSchema>;

export function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const { t } = useTranslation();

  const form = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: '',
      email: '',
      phone_number: '',
      password: '',
      role_id: 0,
      is_activated: true
    }
  });

  const loadUsers = async () => {
    setLoading(true);
    try {
      const response = await window.ezsite.apis.tablePage(41233, {
        PageNo: 1,
        PageSize: 100,
        OrderByField: "create_time",
        IsAsc: false
      });

      if (response.error) throw response.error;
      setUsers(response.data.List || []);
    } catch (error: any) {
      showError(error || 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const loadRoles = async () => {
    try {
      const response = await window.ezsite.apis.tablePage(41234, {
        PageNo: 1,
        PageSize: 100
      });

      if (response.error) throw response.error;
      setRoles(response.data.List || []);
    } catch (error: any) {
      showError(error || 'Failed to load roles');
    }
  };

  useEffect(() => {
    loadUsers();
    loadRoles();
  }, []);

  const onSubmit = async (data: UserFormData) => {
    try {
      if (editingUser) {
        // Update existing user
        const updateData: any = {
          ID: editingUser.id,
          name: data.name,
          email: data.email,
          phone_number: data.phone_number || '',
          role_id: data.role_id,
          is_activated: data.is_activated
        };

        // Only include password if it's provided
        if (data.password && data.password.trim()) {
          updateData.password = data.password;
        }

        const response = await window.ezsite.apis.tableUpdate(41233, updateData);
        if (response.error) throw response.error;

        showSuccess('User updated successfully');
      } else {
        // Create new user
        if (!data.password || data.password.trim().length < 6) {
          showError('Password is required and must be at least 6 characters long');
          return;
        }

        const response = await window.ezsite.apis.tableCreate(41233, {
          name: data.name,
          email: data.email,
          phone_number: data.phone_number || '',
          password: data.password,
          role_id: data.role_id,
          is_activated: data.is_activated
        });

        if (response.error) throw response.error;
        showSuccess('User created successfully');
      }

      setDialogOpen(false);
      form.reset();
      setEditingUser(null);
      await loadUsers();
    } catch (error: any) {
      showError(error || 'Failed to save user');
    }
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    form.reset({
      name: user.name,
      email: user.email,
      phone_number: user.phone_number,
      password: '', // Don't pre-fill password for security
      role_id: user.role_id,
      is_activated: user.is_activated
    });
    setDialogOpen(true);
  };

  const handleDelete = async (userId: number) => {
    if (!confirm('Are you sure you want to delete this user?')) {
      return;
    }

    try {
      const response = await window.ezsite.apis.tableDelete(41233, { ID: userId });
      if (response.error) throw response.error;

      showSuccess('User deleted successfully');
      await loadUsers();
    } catch (error: any) {
      showError(error || 'Failed to delete user');
    }
  };

  const filteredUsers = users.filter((user) =>
  user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
  user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
  user.role_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRoleBadgeVariant = (roleCode: string) => {
    switch (roleCode) {
      case 'Administrator':
        return 'destructive';
      case 'GeneralUser':
        return 'default';
      default:
        return 'secondary';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          User Management
        </CardTitle>
        <CardDescription>
          Manage user accounts, roles, and permissions
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Controls */}
        <div className="flex items-center justify-between gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10" />

          </div>
          
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => {
                setEditingUser(null);
                form.reset({
                  name: '',
                  email: '',
                  phone_number: '',
                  password: '',
                  role_id: 0,
                  is_activated: true
                });
              }}>
                <Plus className="h-4 w-4 mr-2" />
                Add User
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>
                  {editingUser ? 'Edit User' : 'Add New User'}
                </DialogTitle>
                <DialogDescription>
                  {editingUser ?
                  'Update user information and permissions' :
                  'Create a new user account'
                  }
                </DialogDescription>
              </DialogHeader>
              
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) =>
                    <FormItem>
                        <FormLabel>Name *</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Enter full name" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    } />

                  
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) =>
                    <FormItem>
                        <FormLabel>Email *</FormLabel>
                        <FormControl>
                          <Input {...field} type="email" placeholder="user@example.com" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    } />

                  
                  <FormField
                    control={form.control}
                    name="phone_number"
                    render={({ field }) =>
                    <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="+1234567890" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    } />

                  
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) =>
                    <FormItem>
                        <FormLabel>
                          Password {editingUser ? '(leave blank to keep current)' : '*'}
                        </FormLabel>
                        <FormControl>
                          <Input
                          {...field}
                          type="password"
                          placeholder="Enter password" />

                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    } />

                  
                  <FormField
                    control={form.control}
                    name="role_id"
                    render={({ field }) =>
                    <FormItem>
                        <FormLabel>Role *</FormLabel>
                        <Select
                        value={field.value.toString()}
                        onValueChange={(value) => field.onChange(parseInt(value))}>

                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a role" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {roles.map((role) =>
                          <SelectItem key={role.id} value={role.id.toString()}>
                                {role.name}
                              </SelectItem>
                          )}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    } />

                  
                  <FormField
                    control={form.control}
                    name="is_activated"
                    render={({ field }) =>
                    <FormItem className="flex items-center space-x-2">
                        <FormControl>
                          <input
                          type="checkbox"
                          checked={field.value}
                          onChange={field.onChange}
                          className="h-4 w-4" />

                        </FormControl>
                        <FormLabel className="text-sm font-normal">
                          Account is active
                        </FormLabel>
                      </FormItem>
                    } />

                  
                  <div className="flex gap-2">
                    <Button type="submit" className="flex-1">
                      {editingUser ? 'Update User' : 'Create User'}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setDialogOpen(false)}>

                      Cancel
                    </Button>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Users Table */}
        {loading ?
        <div className="flex items-center justify-center p-8">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-current border-t-transparent" />
            <span className="ml-2">Loading users...</span>
          </div> :

        <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.length === 0 ?
              <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      No users found
                    </TableCell>
                  </TableRow> :

              filteredUsers.map((user) =>
              <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.phone_number || '-'}</TableCell>
                      <TableCell>
                        <Badge variant={getRoleBadgeVariant(user.role_code)}>
                          {user.role_name}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={user.is_activated ? 'default' : 'secondary'}>
                          {user.is_activated ? 'Active' : 'Inactive'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {new Date(user.create_time).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(user)}>

                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(user.id)}>

                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
              )
              }
              </TableBody>
            </Table>
          </div>
        }
      </CardContent>
    </Card>);

}