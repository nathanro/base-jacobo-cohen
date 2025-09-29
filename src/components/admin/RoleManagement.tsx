import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { showError, showSuccess } from '@/utils/toast';
import { useTranslation } from 'react-i18next';
import { Plus, Edit, Trash2, Search, Shield } from 'lucide-react';

interface Role {
  id: number;
  name: string;
  code: string;
  remark: string;
  create_time: string;
}

const roleSchema = z.object({
  name: z.string().min(2, 'Role name must be at least 2 characters'),
  remark: z.string().max(500, 'Remark cannot exceed 500 characters').optional()
});

type RoleFormData = z.infer<typeof roleSchema>;

export function RoleManagement() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const { t } = useTranslation();

  const form = useForm<RoleFormData>({
    resolver: zodResolver(roleSchema),
    defaultValues: {
      name: '',
      remark: ''
    }
  });

  const loadRoles = async () => {
    setLoading(true);
    try {
      const response = await window.ezsite.apis.tablePage(41234, {
        PageNo: 1,
        PageSize: 100,
        OrderByField: "create_time",
        IsAsc: false
      });

      if (response.error) throw response.error;
      setRoles(response.data.List || []);
    } catch (error: any) {
      showError(error || 'Failed to load roles');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRoles();
  }, []);

  const onSubmit = async (data: RoleFormData) => {
    try {
      if (editingRole) {
        // Update existing role
        const response = await window.ezsite.apis.tableUpdate(41234, {
          ID: editingRole.id,
          name: data.name,
          remark: data.remark || ''
        });

        if (response.error) throw response.error;
        showSuccess('Role updated successfully');
      } else {
        // Create new role
        const response = await window.ezsite.apis.tableCreate(41234, {
          name: data.name,
          remark: data.remark || ''
        });

        if (response.error) throw response.error;
        showSuccess('Role created successfully');
      }

      setDialogOpen(false);
      form.reset();
      setEditingRole(null);
      await loadRoles();
    } catch (error: any) {
      showError(error || 'Failed to save role');
    }
  };

  const handleEdit = (role: Role) => {
    setEditingRole(role);
    form.reset({
      name: role.name,
      remark: role.remark
    });
    setDialogOpen(true);
  };

  const handleDelete = async (role: Role) => {
    // Prevent deletion of system roles
    if (role.code === 'Administrator' || role.code === 'GeneralUser') {
      showError('Cannot delete system roles (Administrator or GeneralUser)');
      return;
    }

    if (!confirm(`Are you sure you want to delete the role "${role.name}"?`)) {
      return;
    }

    try {
      const response = await window.ezsite.apis.tableDelete(41234, { ID: role.id });
      if (response.error) throw response.error;

      showSuccess('Role deleted successfully');
      await loadRoles();
    } catch (error: any) {
      showError(error || 'Failed to delete role');
    }
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

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Role Management
        </CardTitle>
        <CardDescription>
          Manage user roles and permissions in the system
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Controls */}
        <div className="flex items-center justify-between gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search roles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => {
                setEditingRole(null);
                form.reset({
                  name: '',
                  remark: ''
                });
              }}>
                <Plus className="h-4 w-4 mr-2" />
                Add Role
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>
                  {editingRole ? 'Edit Role' : 'Add New Role'}
                </DialogTitle>
                <DialogDescription>
                  {editingRole 
                    ? 'Update role information and description' 
                    : 'Create a new user role'
                  }
                </DialogDescription>
              </DialogHeader>
              
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Role Name *</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Enter role name" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="remark"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea 
                            {...field} 
                            placeholder="Enter role description (optional)"
                            rows={3}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="flex gap-2">
                    <Button type="submit" className="flex-1">
                      {editingRole ? 'Update Role' : 'Create Role'}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setDialogOpen(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Roles Table */}
        {loading ? (
          <div className="flex items-center justify-center p-8">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-current border-t-transparent" />
            <span className="ml-2">Loading roles...</span>
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Role Name</TableHead>
                  <TableHead>Role Code</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRoles.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      No roles found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredRoles.map((role) => (
                    <TableRow key={role.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Badge variant={getRoleBadgeVariant(role.code)}>
                            {role.name}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <code className="text-sm bg-muted px-2 py-1 rounded">
                          {role.code}
                        </code>
                      </TableCell>
                      <TableCell>
                        <div className="max-w-xs">
                          {role.remark || '-'}
                        </div>
                      </TableCell>
                      <TableCell>
                        {new Date(role.create_time).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(role)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDelete(role)}
                            disabled={role.code === 'Administrator' || role.code === 'GeneralUser'}
                            title={
                              role.code === 'Administrator' || role.code === 'GeneralUser' 
                                ? 'System roles cannot be deleted' 
                                : 'Delete role'
                            }
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}