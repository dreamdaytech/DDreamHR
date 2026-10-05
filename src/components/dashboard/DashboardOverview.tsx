
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Users,
  Clock,
  Calendar,
  FileText,
  ChevronRight,
  Briefcase,
  CheckSquare,
  Clock4
} from 'lucide-react';

const DashboardOverview = () => {
  // Mock data
  const stats = [
    { name: 'Total Employees', value: '124', icon: Users, color: 'bg-blue-100 text-blue-600' },
    { name: 'Present Today', value: '98', icon: Calendar, color: 'bg-green-100 text-green-600' },
    { name: 'On Leave', value: '12', icon: Briefcase, color: 'bg-yellow-100 text-yellow-600' },
    { name: 'Late Arrivals', value: '5', icon: Clock, color: 'bg-red-100 text-red-600' },
  ];

  const recentActivities = [
    { id: 1, action: 'John Smith submitted leave request', time: '10 minutes ago' },
    { id: 2, action: 'Maria Garcia completed onboarding', time: '1 hour ago' },
    { id: 3, action: 'Performance review cycle started', time: '2 hours ago' },
    { id: 4, action: 'New policy document uploaded', time: '3 hours ago' },
    { id: 5, action: 'Payroll processed for May', time: '1 day ago' },
  ];

  const pendingTasks = [
    { id: 1, task: 'Review leave requests', count: 5 },
    { id: 2, task: 'Approve timesheet entries', count: 12 },
    { id: 3, task: 'Complete performance reviews', count: 8 },
    { id: 4, task: 'Review job applications', count: 3 },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-baseline">
        <h1 className="text-2xl font-bold tracking-tight">Dashboard Overview</h1>
        <p className="text-muted-foreground">Last updated: Today at 9:41 AM</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.name} className="card-hover">
            <CardContent className="p-6 flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-muted-foreground">{stat.name}</p>
                <p className="text-3xl font-bold">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-full ${stat.color}`}>
                <stat.icon className="h-6 w-6" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-medium flex items-center">
              <Clock4 className="mr-2 h-5 w-5 text-primary" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex justify-between items-start border-b pb-3 last:border-0">
                  <div>
                    <p className="font-medium">{activity.action}</p>
                    <p className="text-sm text-muted-foreground">{activity.time}</p>
                  </div>
                  <Button variant="ghost" size="sm">
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Pending Tasks */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-medium flex items-center">
              <CheckSquare className="mr-2 h-5 w-5 text-primary" />
              Pending Tasks
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pendingTasks.map((task) => (
                <div key={task.id} className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="bg-muted rounded-full px-2 py-0.5 text-xs font-medium mr-3">{task.count}</div>
                    <span>{task.task}</span>
                  </div>
                  <Button variant="outline" size="sm">Review</Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-medium">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="outline" className="flex flex-col h-24 p-3 justify-center items-center">
              <Users className="h-6 w-6 mb-2" />
              <span>Add Employee</span>
            </Button>
            <Button variant="outline" className="flex flex-col h-24 p-3 justify-center items-center">
              <Calendar className="h-6 w-6 mb-2" />
              <span>Manage Leave</span>
            </Button>
            <Button variant="outline" className="flex flex-col h-24 p-3 justify-center items-center">
              <Clock className="h-6 w-6 mb-2" />
              <span>Record Time</span>
            </Button>
            <Button variant="outline" className="flex flex-col h-24 p-3 justify-center items-center">
              <FileText className="h-6 w-6 mb-2" />
              <span>Upload Document</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardOverview;
