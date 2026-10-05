import React, { useMemo, useState } from 'react';
import { MobileHeader } from '@/components/layout/MobileHeader';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, Calendar, FileText, CheckCircle, XCircle } from 'lucide-react';

type ApprovalStatus = 'pending' | 'approved' | 'rejected';

type ApprovalItem = {
  id: number;
  type: string;
  employee: string;
  employeeAvatar: string;
  date: string;
  duration: string;
  status: ApprovalStatus;
  icon: React.ElementType;
  description: string;
  submittedAt: string;
};

const initialApprovals: ApprovalItem[] = [
  {
    id: 1,
    type: 'Leave Request',
    employee: 'Jane Smith',
    employeeAvatar: 'JS',
    date: '2024-12-28',
    duration: '3 days',
    status: 'pending',
    icon: Calendar,
    description: 'Annual Leave - Family vacation',
    submittedAt: '2 hours ago'
  },
  {
    id: 2,
    type: 'Overtime Request',
    employee: 'John Doe',
    employeeAvatar: 'JD',
    date: '2024-12-27',
    duration: '4 hours',
    status: 'pending',
    icon: Clock,
    description: 'Project deadline completion',
    submittedAt: '5 hours ago'
  },
  {
    id: 3,
    type: 'Document Review',
    employee: 'Mike Johnson',
    employeeAvatar: 'MJ',
    date: '2024-12-26',
    duration: 'Contract',
    status: 'pending',
    icon: FileText,
    description: 'Employment contract revision',
    submittedAt: '1 day ago'
  },
  {
    id: 4,
    type: 'Leave Request',
    employee: 'Aminata Kamara',
    employeeAvatar: 'AK',
    date: '2024-12-20',
    duration: '2 days',
    status: 'approved',
    icon: Calendar,
    description: 'Personal leave',
    submittedAt: '5 days ago'
  },
  {
    id: 5,
    type: 'Timesheet Review',
    employee: 'Mohamed Sesay',
    employeeAvatar: 'MS',
    date: '2024-12-18',
    duration: '1 week',
    status: 'rejected',
    icon: Clock,
    description: 'Weekly timesheet requires correction',
    submittedAt: '1 week ago'
  }
];

const statusStyles: Record<ApprovalStatus, string> = {
  pending: 'bg-orange-100 text-orange-700 border-orange-200',
  approved: 'bg-green-100 text-green-700 border-green-200',
  rejected: 'bg-red-100 text-red-700 border-red-200'
};

const Approvals = () => {
  const [activeFilter, setActiveFilter] = useState<ApprovalStatus>('pending');
  const [approvals, setApprovals] = useState<ApprovalItem[]>(initialApprovals);

  const filteredApprovals = useMemo(
    () => approvals.filter((approval) => approval.status === activeFilter),
    [approvals, activeFilter]
  );

  const counts = useMemo(
    () => ({
      pending: approvals.filter((approval) => approval.status === 'pending').length,
      approved: approvals.filter((approval) => approval.status === 'approved').length,
      rejected: approvals.filter((approval) => approval.status === 'rejected').length
    }),
    [approvals]
  );

  const updateStatus = (id: number, status: ApprovalStatus) => {
    setApprovals((current) =>
      current.map((approval) => (approval.id === id ? { ...approval, status } : approval))
    );
  };

  const handleViewDetails = (id: number) => {
    console.log('Viewing details for:', id);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <MobileHeader title="Inbox" />

      <div className="p-4 space-y-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Work Inbox</h1>
          <p className="text-sm text-gray-500 mt-1">Review approvals and items that need your attention.</p>
        </div>

        <div className="flex space-x-2 bg-gray-100 p-1 rounded-lg">
          {(['pending', 'approved', 'rejected'] as ApprovalStatus[]).map((status) => (
            <Button
              key={status}
              variant={activeFilter === status ? 'default' : 'ghost'}
              size="sm"
              className="flex-1 rounded-md capitalize"
              onClick={() => setActiveFilter(status)}
            >
              {status}
            </Button>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-3">
          <Card className="bg-orange-50 border-orange-200">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-orange-600">{counts.pending}</div>
              <div className="text-xs text-orange-700">Pending</div>
            </CardContent>
          </Card>
          <Card className="bg-green-50 border-green-200">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">{counts.approved}</div>
              <div className="text-xs text-green-700">Approved</div>
            </CardContent>
          </Card>
          <Card className="bg-red-50 border-red-200">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-red-600">{counts.rejected}</div>
              <div className="text-xs text-red-700">Rejected</div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-gray-900 capitalize">{activeFilter} items</h2>

          {filteredApprovals.map((approval) => (
            <Card
              key={approval.id}
              className="bg-white border border-gray-200 hover:shadow-md transition-shadow duration-200"
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-start space-x-3">
                    <div className="bg-blue-100 p-2 rounded-lg">
                      <approval.icon className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <h3 className="font-semibold text-gray-900">{approval.type}</h3>
                      <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center">
                          <span className="text-xs font-medium text-gray-600">{approval.employeeAvatar}</span>
                        </div>
                        <p className="text-sm text-gray-600">{approval.employee}</p>
                      </div>
                      <p className="text-sm text-gray-500">{approval.description}</p>
                      <div className="flex items-center space-x-2 text-xs text-gray-500">
                        <span>{approval.date}</span>
                        <span>•</span>
                        <span>{approval.duration}</span>
                        <span>•</span>
                        <span>{approval.submittedAt}</span>
                      </div>
                    </div>
                  </div>
                  <Badge variant="secondary" className={statusStyles[approval.status]}>
                    {approval.status.charAt(0).toUpperCase() + approval.status.slice(1)}
                  </Badge>
                </div>

                <div className="flex space-x-2">
                  {approval.status === 'pending' && (
                    <>
                      <Button
                        size="sm"
                        className="flex-1 bg-green-600 hover:bg-green-700"
                        onClick={() => updateStatus(approval.id, 'approved')}
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1 border-red-300 text-red-600 hover:bg-red-50"
                        onClick={() => updateStatus(approval.id, 'rejected')}
                      >
                        <XCircle className="h-4 w-4 mr-1" />
                        Reject
                      </Button>
                    </>
                  )}
                  <Button size="sm" variant="ghost" onClick={() => handleViewDetails(approval.id)}>
                    View
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}

          {filteredApprovals.length === 0 && (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No {activeFilter} items</h3>
              <p className="text-gray-500">There are no {activeFilter} items in your inbox.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Approvals;
