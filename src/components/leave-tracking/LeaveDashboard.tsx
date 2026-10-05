import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useIsMobile } from '@/hooks/use-mobile';
import { useAuth } from '@/context/AuthContext';
import { 
  Calendar, 
  Clock, 
  TrendingUp, 
  AlertCircle,
  Plus,
  CheckCircle,
  XCircle
} from 'lucide-react';

interface LeaveDashboardProps {
  onNavigateToApply?: () => void;
  onNavigateToCalendar?: () => void;
}

export const LeaveDashboard: React.FC<LeaveDashboardProps> = ({
  onNavigateToApply,
  onNavigateToCalendar
}) => {
  const isMobile = useIsMobile();
  const { user } = useAuth();

  const leaveBalances = [
    { type: 'Annual Leave', balance: 15, total: 25, color: 'bg-blue-500' },
    { type: 'Sick Leave', balance: 8, total: 10, color: 'bg-green-500' },
    { type: 'Personal Leave', balance: 3, total: 5, color: 'bg-purple-500' },
    { type: 'Maternity Leave', balance: 90, total: 90, color: 'bg-pink-500' }
  ];

  const recentRequests = [
    { id: 1, type: 'Annual Leave', dates: 'Dec 23-27, 2024', status: 'approved', days: 5 },
    { id: 2, type: 'Sick Leave', dates: 'Dec 15, 2024', status: 'pending', days: 1 },
    { id: 3, type: 'Personal Leave', dates: 'Nov 20, 2024', status: 'rejected', days: 1 }
  ];

  const upcomingLeaves = [
    { id: 1, type: 'Annual Leave', dates: 'Dec 23-27, 2024', days: 5 },
    { id: 2, type: 'Annual Leave', dates: 'Jan 15-16, 2025', days: 2 }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return <CheckCircle className="h-4 w-4" />;
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'rejected': return <XCircle className="h-4 w-4" />;
      default: return <AlertCircle className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className={`grid ${isMobile ? 'grid-cols-1' : 'grid-cols-2'} gap-4`}>
            <Button 
              className="w-full" 
              size={isMobile ? "lg" : "default"}
              onClick={onNavigateToApply}
            >
              <Plus className="mr-2 h-4 w-4" />
              Apply for Leave
            </Button>
            <Button 
              variant="outline" 
              className="w-full" 
              size={isMobile ? "lg" : "default"}
              onClick={onNavigateToCalendar}
            >
              <Calendar className="mr-2 h-4 w-4" />
              View Calendar
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Leave Balances */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Leave Balances
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className={`grid ${isMobile ? 'grid-cols-1' : 'grid-cols-2 lg:grid-cols-4'} gap-4`}>
            {leaveBalances.map((leave, index) => (
              <div key={index} className="p-4 border rounded-lg space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-sm">{leave.type}</h3>
                  <div className={`w-3 h-3 rounded-full ${leave.color}`} />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold">{leave.balance}</span>
                    <span className="text-sm text-muted-foreground">/ {leave.total}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${leave.color}`}
                      style={{ width: `${(leave.balance / leave.total) * 100}%` }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {leave.balance} days remaining
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Requests */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Recent Requests
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentRequests.map((request) => (
              <div key={request.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{request.type}</span>
                    <Badge variant="secondary" className="text-xs">
                      {request.days} day{request.days > 1 ? 's' : ''}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{request.dates}</p>
                </div>
                <Badge className={`${getStatusColor(request.status)} flex items-center gap-1`}>
                  {getStatusIcon(request.status)}
                  {request.status}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Upcoming Leaves */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Upcoming Leaves
          </CardTitle>
        </CardHeader>
        <CardContent>
          {upcomingLeaves.length > 0 ? (
            <div className="space-y-3">
              {upcomingLeaves.map((leave) => (
                <div key={leave.id} className="flex items-center justify-between p-3 border rounded-lg bg-blue-50">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{leave.type}</span>
                      <Badge variant="secondary" className="text-xs">
                        {leave.days} day{leave.days > 1 ? 's' : ''}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{leave.dates}</p>
                  </div>
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No upcoming leaves scheduled</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
