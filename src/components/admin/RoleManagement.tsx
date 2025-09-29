import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Trash2, Edit, Plus, Search, Shield } from 'lucide-react';
import { showSuccess, showError } from '@/utils/toast';

interface Role {
  id: number;
  name: string;
  code: string;
  remark: string;
  create_time: string;
}

const RoleManagement: React.FC = () => {
  const { t } = useTranslation();
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const roleSchema = z.object({
    name: z.string().min(2, t('admin.roleManagement.validation.nameMinLength')),
    remark: z.string().max(500, t('admin.roleManagement.validation.descriptionMaxLength')).optional()
  });

  type RoleFormData = z.infer<typeof roleSchema>;

  const { register, handleSubmit, reset, formState: { errors } } = useForm<RoleFormData>({
    resolver: zodResolver(roleSchema),
    defaultValues: {
      name: '',
      remark: ''
    }
  });

  useEffect(() => {
    loadRoles();
  }, []);

  const loadRoles = async () => {
    try {
      setLoading(true);
      const { data, error } = await (window as any).ezsite.apis.tablePage(41234, {
        PageNo: 1,
        PageSize: 100,
        OrderByField: "create_time",
        IsAsc: false,
        Filters: []
      });
      
      if (error) throw error;
      setRoles(data?.List || []);
    } catch (error) {
      console.error('Error loading roles:', error);
      showError(t('admin.roleManagement.errorLoadingRoles'));
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: RoleFormData) => {
    try {
      if (editingRole) {
        // Update role
        const { error } = await (window as any).ezsite.apis.tableUpdate(41234, {
          ID: editingRole.id,
          name: data.name,
          remark: data.remark || ''
        });
        
        if (error) throw error;
        
        showSuccess(t('admin.roleManagement.roleUpdated'));
      } else {
        // Create role
        const { error } = await (window as any).ezsite.apis.tableCreate(41234, {
          name: data.name,
          remark: data.remark || ''
        });
        
        if (error) throw error;
        
        showSuccess(t('admin.roleManagement.roleAdded'));
      }
      
      setIsDialogOpen(false);
      reset();
      setEditingRole(null);
      loadRoles();
    } catch (error) {
      console.error('Error saving role:', error);
      showError(editingRole ? t('admin.roleManagement.errorUpdatingRole') : t('admin.roleManagement.errorAddingRole'));
    }
  };

  const handleEdit = (role: Role) => {
    setEditingRole(role);
    reset({
      name: role.name,
      remark: role.remark
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (role: Role) => {
    // Check if it's a system role
    if (role.code === 'Administrator' || role.code === 'GeneralUser') {
      showError('Cannot delete system roles');
      return;
    }

    if (!confirm(t('admin.roleManagement.confirmDelete'))) return;
    
    try {
      const { error } = await (window as any).ezsite.apis.tableDelete(41234, { ID: role.id });
      if (error) throw error;
      
      showSuccess(t('admin.roleManagement.roleDeleted'));
      
      loadRoles();
    } catch (error) {
      console.error('Error deleting role:', error);
      showError(t('admin.roleManagement.errorDeletingRole'));
    }
  };

  const handleAddNew = () => {
    setEditingRole(null);
    reset();
    setIsDialogOpen(true);
  };

  const filteredRoles = roles.filter(role => 
    role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    role.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (role.remark && role.remark.toLowerCase().includes(searchTerm.toLowerCase()))
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

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{t('admin.roleManagement.title')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="mt-2 text-muted-foreground">{t('admin.roleManagement.loadingRoles')}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          {t('admin.roleManagement.title')}
        </CardTitle>
        <CardDescription>
          Create and manage user roles to control access levels and permissions.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center mb-6">
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder={t('admin.roleManagement.searchRoles')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={handleAddNew} className="gap-2">
                <Plus className="h-4 w-4" />
                {t('admin.roleManagement.addRole')}
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>
                  {editingRole ? t('admin.roleManagement.editRole') : t('admin.roleManagement.addRole')}
                </DialogTitle>
                <DialogDescription>
                  {editingRole 
                    ? 'Update role information and description.' 
                    : 'Create a new role to assign to users for access control.'
                  }
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">{t('admin.roleManagement.roleName')}</Label>
                  <Input
                    id="name"
                    {...register('name')}
                    error={errors.name?.message}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="remark">{t('admin.roleManagement.roleDescription')}</Label>
                  <Textarea
                    id="remark"
                    {...register('remark')}
                    placeholder="Optional description for this role..."
                    rows={3}
                  />
                  {errors.remark && (
                    <p className="text-sm text-destructive">{errors.remark.message}</p>
                  )}
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

        {filteredRoles.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">{t('admin.roleManagement.noRoles')}</p>
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('admin.roleManagement.roleName')}</TableHead>
                  <TableHead>{t('admin.roleManagement.roleCode')}</TableHead>
                  <TableHead>{t('admin.roleManagement.roleDescription')}</TableHead>
                  <TableHead>{t('admin.roleManagement.createdAt')}</TableHead>
                  <TableHead>{t('admin.roleManagement.actions')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRoles.map((role) => (
                  <TableRow key={role.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        {role.name}
                        <Badge variant={getRoleBadgeVariant(role.code)}>
                          {role.code}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <code className="bg-muted px-2 py-1 rounded text-sm">{role.code}</code>
                    </TableCell>
                    <TableCell className="max-w-xs truncate">
                      {role.remark || '—'}
                    </TableCell>
                    <TableCell>{new Date(role.create_time).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(role)}
                          className="h-8 w-8 p-0"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(role)}
                          className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                          disabled={role.code === 'Administrator' || role.code === 'GeneralUser'}
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

export default RoleManagement;