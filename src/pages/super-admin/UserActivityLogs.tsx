
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const activityLogs = [
  { id: 1, user: 'admin@business.com', action: 'User Login', details: 'Successful login from IP 192.168.1.1', timestamp: '2025-06-15 10:30:00' },
  { id: 2, user: 'superadmin@example.com', action: 'Feature Toggle', details: 'Enabled "Dark Mode"', timestamp: '2025-06-15 10:25:00' },
  { id: 3, user: 'hr@globex.net', action: 'Employee Added', details: 'Added new employee: John Doe', timestamp: '2025-06-15 10:20:00' },
  { id: 4, user: 'finance@techsolutions.io', action: 'Report Generated', details: 'Generated "Q2 Financials" report', timestamp: '2025-06-15 10:15:00' },
  { id: 5, user: 'dev@webuild.com', action: 'API Key Created', details: 'New API key generated for "Staging"', timestamp: '2025-06-15 10:10:00' },
];

const UserActivityLogs: React.FC = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">User Activity Logs</h1>
      <Card>
        <CardHeader>
          <CardTitle>Activity Stream</CardTitle>
          <div className="relative mt-2">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search logs..." className="pl-8 sm:w-[300px]" />
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Timestamp</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Details</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {activityLogs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell>{log.timestamp}</TableCell>
                  <TableCell className="font-medium">{log.user}</TableCell>
                  <TableCell><Badge variant="outline">{log.action}</Badge></TableCell>
                  <TableCell>{log.details}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserActivityLogs;
