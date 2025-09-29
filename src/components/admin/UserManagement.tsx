import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Trash2, Edit, UserPlus, Search } from 'lucide-react';
import { showSuccess, showError } from '@/utils/toast';

interface User {
  id: number;
  name: string;
  email: string;
  phone_number: string;
  role_id: number;
  role_name: string;
  is_activated: boolean;
  create_time: string;
}

interface Role {
  id: number;
  name: string;
  code: string;
  remark: string;
}

const UserManagement: React.FC = () => {
  const { t } = useTranslation();
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const userSchema = z.object({
    name: z.string().min(1, t('admin.userManagement.validation.nameRequired')),
    email: z.string().email(t('admin.userManagement.validation.emailInvalid')),
    phone_number: z.string().optional(),
    password: editingUser ? z.string().optional() : z.string().min(6, t('admin.userManagement.validation.passwordMinLength')),
    role_id: z.number().min(1, t('admin.userManagement.validation.roleRequired')),
    is_activated: z.boolean().default(true)
  });

  type UserFormData = z.infer<typeof userSchema>;

  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<UserFormData>({
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

  const selectedRoleId = watch('role_id');

  useEffect(() => {
    loadUsers();
    loadRoles();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const { data, error } = await (window as any).ezsite.apis.tablePage(41233, {
        PageNo: 1,
        PageSize: 100,
        OrderByField: "create_time",
        IsAsc: false,
        Filters: []
      });
      
      if (error) throw error;
      setUsers(data?.List || []);
    } catch (error) {
      console.error('Error loading users:', error);
      showError(t('admin.userManagement.errorLoadingUsers'));
    } finally {
      setLoading(false);
    }
  };

  const loadRoles = async () => {
    try {
      const { data, error } = await (window as any).ezsite.apis.tablePage(41234, {
        PageNo: 1,
        PageSize: 100,
        OrderByField: "id",
        IsAsc: true,
        Filters: []
      });
      
      if (error) throw error;
      setRoles(data?.List || []);
    } catch (error) {
      console.error('Error loading roles:', error);
    }
  };

  const onSubmit = async (data: UserFormData) => {
    try {
      if (editingUser) {
        // Update user
        const updateData: any = {
          ID: editingUser.id,
          name: data.name,
          email: data.email,
          phone_number: data.phone_number || '',
          role_id: data.role_id,
          is_activated: data.is_activated
        };
        
        if (data.password) {
          updateData.password = data.password;
        }

        const { error } = await (window as any).ezsite.apis.tableUpdate(41233, updateData);
        if (error) throw error;
        
        showSuccess(t('admin.userManagement.userUpdated'));
      } else {
        // Create user
        const { error } = await (window as any).ezsite.apis.tableCreate(41233, {
          name: data.name,
          email: data.email,
          phone_number: data.phone_number || '',
          password: data.password,
          role_id: data.role_id,
          is_activated: data.is_activated
        });
        
        if (error) throw error;
        
        showSuccess(t('admin.userManagement.userAdded'));
      }
      
      setIsDialogOpen(false);
      reset();
      setEditingUser(null);
      loadUsers();
    } catch (error) {
      console.error('Error saving user:', error);
      showError(editingUser ? t('admin.userManagement.errorUpdatingUser') : t('admin.userManagement.errorAddingUser'));
    }
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setValue('name', user.name);
    setValue('email', user.email);
    setValue('phone_number', user.phone_number);
    setValue('role_id', user.role_id);
    setValue('is_activated', user.is_activated);
    setValue('password', '');
    setIsDialogOpen(true);
  };

  const handleDelete = async (user: User) => {
    if (!confirm(t('admin.userManagement.confirmDelete'))) return;
    
    try {
      const { error } = await (window as any).ezsite.apis.tableDelete(41233, { ID: user.id });
      if (error) throw error;
      
      showSuccess(t('admin.userManagement.userDeleted'));
      
      loadUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
      showError(t('admin.userManagement.errorDeletingUser'));
    }
  };

  const handleAddNew = () => {
    setEditingUser(null);
    reset();
    setIsDialogOpen(true);
  };

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{t('admin.userManagement.title')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="mt-2 text-muted-foreground">{t('admin.userManagement.loadingUsers')}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('admin.userManagement.title')}</CardTitle>
        <CardDescription>
          Manage system users, assign roles, and control access permissions.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center mb-6">
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder={t('admin.userManagement.searchUsers')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={handleAddNew} className="gap-2">
                <UserPlus className="h-4 w-4" />
                {t('admin.userManagement.addUser')}
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>
                  {editingUser ? t('admin.userManagement.editUser') : t('admin.userManagement.addUser')}
                </DialogTitle>
                <DialogDescription>
                  {editingUser 
                    ? 'Update user information and role assignment.' 
                    : 'Create a new user account and assign appropriate role.'
                  }
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">{t('admin.userManagement.userName')}</Label>
                  <Input
                    id="name"
                    {...register('name')}
                    error={errors.name?.message}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">{t('admin.userManagement.userEmail')}</Label>
                  <Input
                    id="email"
                    type="email"
                    {...register('email')}
                    error={errors.email?.message}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone_number">{t('admin.userManagement.userPhone')}</Label>
                  <Input
                    id="phone_number"
                    {...register('phone_number')}
                    error={errors.phone_number?.message}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password">
                    {editingUser ? `${t('auth.password')} (${t('common.optional')})` : t('auth.password')}
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    {...register('password')}
                    error={errors.password?.message}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="role_id">{t('admin.userManagement.userRole')}</Label>
                  <Select 
                    value={selectedRoleId ? selectedRoleId.toString() : ''} 
                    onValueChange={(value) => setValue('role_id', parseInt(value))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                    <SelectContent>
                      {roles.map((role) => (
                        <SelectItem key={role.id} value={role.id.toString()}>
                          {role.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.role_id && (
                    <p className="text-sm text-destructive">{errors.role_id.message}</p>
                  )}
                </div>
                
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="is_activated"
                    {...register('is_activated')}
                    className="rounded border-gray-300"
                  />
                  <Label htmlFor="is_activated">{t('admin.userManagement.active')}</Label>
                </div>
                
                <div className="flex justify-end space-x-2 pt-4">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    {t('common.cancel')}
                  </Button>
                  <Button type="submit">
                    {t('common.save')}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {filteredUsers.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">{t('admin.userManagement.noUsers')}</p>
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('admin.userManagement.userName')}</TableHead>
                  <TableHead>{t('admin.userManagement.userEmail')}</TableHead>
                  <TableHead>{t('admin.userManagement.userPhone')}</TableHead>
                  <TableHead>{t('admin.userManagement.userRole')}</TableHead>
                  <TableHead>{t('admin.userManagement.userStatus')}</TableHead>
                  <TableHead>{t('admin.userManagement.createdAt')}</TableHead>
                  <TableHead>{t('admin.userManagement.actions')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.phone_number}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{user.role_name}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={user.is_activated ? "default" : "destructive"}>
                        {user.is_activated ? t('admin.userManagement.active') : t('admin.userManagement.inactive')}
                      </Badge>
                    </TableCell>
                    <TableCell>{new Date(user.create_time).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(user)}
                          className="h-8 w-8 p-0"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(user)}
                          className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UserManagement;