
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Search } from 'lucide-react';

const tickets = [
  { id: 'TKT-001', subject: 'Login Issue', user: 'admin@business.com', business: 'Innovate Corp', status: 'Open', lastUpdated: '2 hours ago' },
  { id: 'TKT-002', subject: 'Billing Discrepancy', user: 'finance@techsolutions.io', business: 'Tech Solutions', status: 'In Progress', lastUpdated: '1 day ago' },
  { id: 'TKT-003', subject: 'Feature Request: Dark Mode', user: 'ceo@startup.co', business: 'Creative Minds', status: 'Closed', lastUpdated: '3 days ago' },
  { id: 'TKT-004', subject: 'API Integration Help', user: 'dev@webuild.com', business: 'WeBuild Inc.', status: 'Open', lastUpdated: '5 minutes ago' },
  { id: 'TKT-005', subject: 'Cannot add new user', user: 'hr@globex.net', business: 'Globex Corporation', status: 'Closed', lastUpdated: '1 week ago' },
];

const SupportTickets: React.FC = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Support Tickets</h1>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>User Support</CardTitle>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search tickets..." className="pl-8 sm:w-[300px]" />
            </div>
            <Button>New Ticket</Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ticket ID</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Business</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Updated</TableHead>
                <TableHead><span className="sr-only">Actions</span></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tickets.map((ticket) => (
                <TableRow key={ticket.id}>
                  <TableCell className="font-medium">{ticket.id}</TableCell>
                  <TableCell>{ticket.subject}</TableCell>
                  <TableCell>{ticket.business}</TableCell>
                  <TableCell>
                    <Badge variant={ticket.status === 'Open' ? 'default' : ticket.status === 'In Progress' ? 'secondary' : 'outline'}>
                      {ticket.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{ticket.lastUpdated}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>View Ticket</DropdownMenuItem>
                        <DropdownMenuItem>Assign</DropdownMenuItem>
                        <DropdownMenuItem>Close Ticket</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default SupportTickets;
