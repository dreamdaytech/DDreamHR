
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  BookOpen, 
  UserPlus, 
  Briefcase, 
  UserX, 
  ArrowRight,
  Users,
  BarChart3,
  Calendar
} from 'lucide-react';

const HRLifecycle = () => {
  const navigate = useNavigate();
  const { user, hasRole } = useAuth();

  const lifecycleModules = [
    {
      id: 'preboarding',
      title: 'Preboarding',
      description: 'Prepare new hires before their start date with welcome packets, e-signatures, and task assignments',
      icon: BookOpen,
      iconColor: 'text-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
      route: '/hr-lifecycle/preboarding',
      roles: ['admin', 'hr'] as const,
      stats: { pending: 5, completed: 12 }
    },
    {
      id: 'onboarding',
      title: 'Onboarding',
      description: 'Guide new employees through structured workflows with task tracking and team integration',
      icon: UserPlus,
      iconColor: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      route: '/hr-lifecycle/onboarding',
      roles: ['admin', 'hr', 'manager'] as const,
      stats: { active: 8, thisWeek: 3 }
    },
    {
      id: 'portal',
      title: 'Employee Portal',
      description: 'Self-service portal for new employees to access tasks, documents, and team information',
      icon: Briefcase,
      iconColor: 'text-teal-600',
      bgColor: 'bg-teal-50',
      borderColor: 'border-teal-200',
      route: '/hr-lifecycle/portal',
      roles: ['admin', 'hr', 'manager', 'employee'] as const,
      stats: { users: 45, completion: '87%' }
    },
    {
      id: 'offboarding',
      title: 'Offboarding',
      description: 'Manage employee departures with structured checklists and progress tracking',
      icon: UserX,
      iconColor: 'text-red-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      route: '/hr-lifecycle/offboarding',
      roles: ['admin', 'hr', 'manager'],
      stats: { thisMonth: 2, pending: 1 }
    }
  ];

  const handleModuleClick = (route: string) => {
    navigate(route);
  };

  const filteredModules = lifecycleModules.filter(module => 
    hasRole(module.roles)
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">HR Lifecycle Management</h1>
          <p className="text-muted-foreground">
            Comprehensive employee journey management from preboarding to offboarding
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => navigate('/reports')}>
            <BarChart3 className="mr-2 h-4 w-4" />
            View Reports
          </Button>
          {hasRole(['admin', 'hr']) && (
            <Button onClick={() => navigate('/hr-lifecycle/settings')}>
              Settings
            </Button>
          )}
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">Active Processes</p>
                <p className="text-2xl font-bold text-blue-700">23</p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">This Week</p>
                <p className="text-2xl font-bold text-green-700">8</p>
              </div>
              <Calendar className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-amber-50 border-amber-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-amber-600">Pending Tasks</p>
                <p className="text-2xl font-bold text-amber-700">15</p>
              </div>
              <BarChart3 className="h-8 w-8 text-amber-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-purple-50 border-purple-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600">Completion Rate</p>
                <p className="text-2xl font-bold text-purple-700">94%</p>
              </div>
              <ArrowRight className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Module Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredModules.map((module) => (
          <Card 
            key={module.id}
            className={`${module.bgColor} ${module.borderColor} hover:shadow-lg transition-all duration-200 cursor-pointer`}
            onClick={() => handleModuleClick(module.route)}
          >
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg bg-white`}>
                    <module.icon className={`h-6 w-6 ${module.iconColor}`} />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{module.title}</CardTitle>
                  </div>
                </div>
                <ArrowRight className={`h-5 w-5 ${module.iconColor}`} />
              </div>
              <CardDescription className="text-sm">
                {module.description}
              </CardDescription>
            </CardHeader>
            
            <CardContent className="pt-0">
              <div className="flex items-center justify-between">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  {Object.entries(module.stats).map(([key, value]) => (
                    <div key={key}>
                      <p className="text-muted-foreground capitalize">{key.replace(/([A-Z])/g, ' $1')}</p>
                      <p className="font-semibold">{value}</p>
                    </div>
                  ))}
                </div>
                <Button variant="outline" size="sm">
                  Open Module
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default HRLifecycle;
