import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useIsMobile } from '@/hooks/use-mobile';
import { useAuth } from '@/context/AuthContext';
import { downloadTextFile, isDemoSession, readDemoData, toCsv } from '@/lib/demoStore';
import { listLeaveHistory } from '@/services/tenantLeave';
import { LeaveDetailsModal } from './components/LeaveDetailsModal';
import { 
  History, 
  Search, 
  Filter, 
  Download,
  CheckCircle,
  Clock,
  XCircle,
  Eye,
  Users
} from 'lucide-react';

export const LeaveHistory = () => {
  const isMobile = useIsMobile();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [selectedLeave, setSelectedLeave] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const isManagerOrAbove = user?.role && ['manager', 'hr', 'admin'].includes(user.role);
  const [realPersonalLeaveHistory, setRealPersonalLeaveHistory] = useState<any[]>([]);
  const [realTeamLeaveHistory, setRealTeamLeaveHistory] = useState<any[]>([]);

  useEffect(() => {
    if (isDemoSession()) return;

    void Promise.all([
      listLeaveHistory(false),
      isManagerOrAbove ? listLeaveHistory(true) : Promise.resolve([]),
    ]).then(([personal, team]) => {
      setRealPersonalLeaveHistory(personal);
      setRealTeamLeaveHistory(team.filter((leave: any) => !personal.some((mine: any) => mine.id === leave.id)));
    }).catch((error) => {
      console.error('Could not load leave history', error);
    });
  }, [isManagerOrAbove]);

  const seedPersonalLeaveHistory = [
    {
      id: 1,
      type: 'Annual Leave',
      startDate: '2024-12-23',
      endDate: '2024-12-27',
      days: 5,
      status: 'approved',
      appliedDate: '2024-12-01',
      approvedBy: 'John Manager',
      reason: 'Holiday vacation with family',
      documents: ['vacation-itinerary.pdf'],
      timeline: [
        { date: '2024-12-01', action: 'Request Submitted', by: 'You' },
        { date: '2024-12-02', action: 'Approved', by: 'John Manager', comment: 'Enjoy your vacation!' }
      ]
    },
    {
      id: 2,
      type: 'Sick Leave',
      startDate: '2024-12-15',
      endDate: '2024-12-15',
      days: 1,
      status: 'pending',
      appliedDate: '2024-12-14',
      approvedBy: null,
      reason: 'Fever and flu symptoms',
      timeline: [
        { date: '2024-12-14', action: 'Request Submitted', by: 'You' }
      ]
    },
    {
      id: 3,
      type: 'Personal Leave',
      startDate: '2024-11-20',
      endDate: '2024-11-20',
      days: 1,
      status: 'rejected',
      appliedDate: '2024-11-18',
      approvedBy: 'John Manager',
      reason: 'Personal appointment',
      timeline: [
        { date: '2024-11-18', action: 'Request Submitted', by: 'You' },
        { date: '2024-11-19', action: 'Rejected', by: 'John Manager', comment: 'Please provide more notice for personal leave.' }
      ]
    }
  ];

  const storedLeaveRequests = readDemoData<any[]>('leave-requests', []);
  const personalLeaveHistory = isDemoSession()
    ? [
        ...storedLeaveRequests.filter((leave) => leave.employeeId === user?.id),
        ...seedPersonalLeaveHistory,
      ]
    : realPersonalLeaveHistory;

  const teamLeaveHistory = isDemoSession()
    ? [
        ...storedLeaveRequests
          .filter((leave) => leave.employeeId !== user?.id)
          .map((leave) => ({ ...leave, employeeName: leave.employeeName || leave.employee || 'Employee' })),
        {
      id: 4,
      type: 'Annual Leave',
      employeeName: 'Sarah Johnson',
      startDate: '2024-12-20',
      endDate: '2024-12-22',
      days: 3,
      status: 'approved',
      appliedDate: '2024-11-28',
      approvedBy: 'You',
      reason: 'Family event'
    },
    {
      id: 5,
      type: 'Sick Leave',
      employeeName: 'Mike Davis',
      startDate: '2024-12-10',
      endDate: '2024-12-12',
      days: 3,
      status: 'pending',
      appliedDate: '2024-12-09',
      approvedBy: null,
      reason: 'Medical procedure'
    }
      ]
    : realTeamLeaveHistory;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800 border-green-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'rejected': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return <CheckCircle className="h-4 w-4" />;
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'rejected': return <XCircle className="h-4 w-4" />;
      default: return null;
    }
  };

  const filteredPersonalHistory = personalLeaveHistory.filter(leave => {
    const matchesSearch = leave.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         leave.reason.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || leave.status === statusFilter;
    const matchesType = typeFilter === 'all' || leave.type.toLowerCase().includes(typeFilter.toLowerCase());
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const filteredTeamHistory = teamLeaveHistory.filter(leave => {
    const matchesSearch = leave.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         leave.reason.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         leave.employeeName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || leave.status === statusFilter;
    const matchesType = typeFilter === 'all' || leave.type.toLowerCase().includes(typeFilter.toLowerCase());
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const openDetailsModal = (leave: any) => {
    setSelectedLeave(leave);
    setIsModalOpen(true);
  };

  const renderMobileLeaveCard = (leave: any, isTeam = false) => (
    <div key={leave.id} className="border rounded-lg p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h3 className="font-medium">{leave.type}</h3>
          {isTeam && (
            <p className="text-sm text-muted-foreground">{leave.employeeName}</p>
          )}
          <p className="text-sm text-muted-foreground">
            {leave.startDate} {leave.endDate !== leave.startDate && `- ${leave.endDate}`}
          </p>
        </div>
        <Badge className={`${getStatusColor(leave.status)} flex items-center gap-1`}>
          {getStatusIcon(leave.status)}
          {leave.status}
        </Badge>
      </div>
      
      <div className="flex items-center justify-between text-sm">
        <span>{leave.days} day{leave.days > 1 ? 's' : ''}</span>
        <span className="text-muted-foreground">Applied: {leave.appliedDate}</span>
      </div>
      
      <p className="text-sm text-muted-foreground line-clamp-2">{leave.reason}</p>
      
      <Button 
        variant="outline" 
        size="sm" 
        className="w-full"
        onClick={() => openDetailsModal(leave)}
      >
        <Eye className="mr-2 h-4 w-4" />
        View Details
      </Button>
    </div>
  );

  const renderDesktopTable = (history: any[], isTeam = false) => (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Leave Type</TableHead>
            {isTeam && <TableHead>Employee</TableHead>}
            <TableHead>Dates</TableHead>
            <TableHead>Days</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Applied Date</TableHead>
            <TableHead>Approved By</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {history.map((leave) => (
            <TableRow key={leave.id}>
              <TableCell className="font-medium">{leave.type}</TableCell>
              {isTeam && <TableCell>{leave.employeeName}</TableCell>}
              <TableCell>
                {leave.startDate}
                {leave.endDate !== leave.startDate && ` - ${leave.endDate}`}
              </TableCell>
              <TableCell>{leave.days}</TableCell>
              <TableCell>
                <Badge className={`${getStatusColor(leave.status)} flex items-center gap-1 w-fit`}>
                  {getStatusIcon(leave.status)}
                  {leave.status}
                </Badge>
              </TableCell>
              <TableCell>{leave.appliedDate}</TableCell>
              <TableCell>{leave.approvedBy || '-'}</TableCell>
              <TableCell>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => openDetailsModal(leave)}
                >
                  <Eye className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );

  if (isMobile) {
    return (
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <History className="h-5 w-5" />
              Leave History
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Mobile Filters */}
            <div className="space-y-3">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search leaves..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="annual">Annual</SelectItem>
                    <SelectItem value="sick">Sick</SelectItem>
                    <SelectItem value="personal">Personal</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Mobile Tabs */}
            <Tabs defaultValue="personal" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="personal">My Leaves</TabsTrigger>
                {isManagerOrAbove && (
                  <TabsTrigger value="team">
                    <Users className="h-4 w-4 mr-1" />
                    Team
                  </TabsTrigger>
                )}
              </TabsList>
              
              <TabsContent value="personal" className="space-y-3 mt-4">
                {filteredPersonalHistory.map((leave) => renderMobileLeaveCard(leave))}
              </TabsContent>
              
              {isManagerOrAbove && (
                <TabsContent value="team" className="space-y-3 mt-4">
                  {filteredTeamHistory.map((leave) => renderMobileLeaveCard(leave, true))}
                </TabsContent>
              )}
            </Tabs>
          </CardContent>
        </Card>

        <LeaveDetailsModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          leaveRequest={selectedLeave}
        />
      </div>
    );
  }

  // Desktop view
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <History className="h-5 w-5" />
            Leave History
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              const csv = toCsv(filteredPersonalHistory.map(({ timeline, documents, ...leave }) => ({
                ...leave,
                documents: Array.isArray(documents) ? documents.join('; ') : '',
              })));
              downloadTextFile('ddreamhr-leave-history.csv', csv, 'text/csv;charset=utf-8');
            }}
          >
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Desktop Filters */}
        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search by type or reason..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="annual">Annual</SelectItem>
              <SelectItem value="sick">Sick</SelectItem>
              <SelectItem value="personal">Personal</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Desktop Tabs */}
        <Tabs defaultValue="personal" className="w-full">
          <TabsList>
            <TabsTrigger value="personal">My Leave History</TabsTrigger>
            {isManagerOrAbove && (
              <TabsTrigger value="team">
                <Users className="h-4 w-4 mr-2" />
                Team Leave History
              </TabsTrigger>
            )}
          </TabsList>
          
          <TabsContent value="personal" className="mt-4">
            {renderDesktopTable(filteredPersonalHistory)}
          </TabsContent>
          
          {isManagerOrAbove && (
            <TabsContent value="team" className="mt-4">
              {renderDesktopTable(filteredTeamHistory, true)}
            </TabsContent>
          )}
        </Tabs>

        <LeaveDetailsModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          leaveRequest={selectedLeave}
        />
      </CardContent>
    </Card>
  );
};
