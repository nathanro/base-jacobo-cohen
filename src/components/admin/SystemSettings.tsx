import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Settings, Server, Database, FileText } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export function SystemSettings() {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            {t('admin.systemSettings.title')}
          </CardTitle>
          <CardDescription>
            {t('admin.systemSettings.description')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          
          {/* General Settings */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium flex items-center gap-2">
              <Server className="h-4 w-4" />
              {t('admin.systemSettings.general')}
            </h3>
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardContent className="pt-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="maintenance-mode" className="text-base">
                        {t('admin.systemSettings.maintenance')}
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Enable maintenance mode to restrict site access
                      </p>
                    </div>
                    <Switch id="maintenance-mode" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="debug-mode" className="text-base">
                        Debug Mode
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Enable detailed error logging
                      </p>
                    </div>
                    <Switch id="debug-mode" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Database Settings */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium flex items-center gap-2">
              <Database className="h-4 w-4" />
              Database Management
            </h3>
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardContent className="pt-4">
                  <div className="space-y-2">
                    <h4 className="font-medium">{t('admin.systemSettings.backups')}</h4>
                    <p className="text-sm text-muted-foreground">
                      Manage database backups and restoration
                    </p>
                    <Button variant="outline" className="w-full">
                      Create Backup
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-4">
                  <div className="space-y-2">
                    <h4 className="font-medium">Database Status</h4>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm">Connected</span>
                    </div>
                    <Button variant="outline" className="w-full">
                      Test Connection
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* System Logs */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium flex items-center gap-2">
              <FileText className="h-4 w-4" />
              {t('admin.systemSettings.logs')}
            </h3>
            <Card>
              <CardContent className="pt-4">
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    View and manage system logs and error reports
                  </p>
                  <div className="flex gap-2">
                    <Button variant="outline">View System Logs</Button>
                    <Button variant="outline">Download Logs</Button>
                    <Button variant="outline">Clear Old Logs</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Usage Instructions */}
          <div className="mt-8 p-4 bg-green-50 rounded-lg">
            <h4 className="font-medium text-green-900 mb-2">{t('admin.instructions.title')}</h4>
            <div className="space-y-2 text-sm text-green-800">
              <p>{t('admin.instructions.systemSettingsInstructions')}</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Use maintenance mode when performing system updates</li>
                <li>Regular backups are recommended before major changes</li>
                <li>Monitor system logs for any unusual activity</li>
                <li>Test database connections after configuration changes</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>);

}