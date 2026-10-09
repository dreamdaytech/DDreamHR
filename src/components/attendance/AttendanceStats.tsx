
import { useEffect, useState } from 'react';
import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Colors } from '@/lib/chart-colors';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Cell } from 'recharts';
import { Users, Clock, Calendar, MapPin } from 'lucide-react';
import { listAttendanceRecords, listTenantAttendanceRecords } from '@/services/tenantAttendance';
import type { AttendanceRecord } from '@/types/attendance';

interface AttendanceStatsProps {
  userRole: 'admin' | 'hr' | 'manager' | 'employee';
}

export const AttendanceStats = ({ userRole }: AttendanceStatsProps) => {
  // Show different stats based on user role
  const isAdmin = userRole === 'admin' || userRole === 'hr';
  
  const [period] = useState(() => {
    const today = new Date();
    return {
      weekStart: startOfWeek(today, { weekStartsOn: 1 }),
      weekEnd: endOfWeek(today, { weekStartsOn: 1 }),
      monthStart: startOfMonth(today),
      monthEnd: endOfMonth(today),
    };
  });
  const [weeklyRecords, setWeeklyRecords] = useState<AttendanceRecord[]>([]);
  const [monthlyRecords, setMonthlyRecords] = useState<AttendanceRecord[]>([]);
  const [organizationRecords, setOrganizationRecords] = useState<AttendanceRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const loadStats = async () => {
      setIsLoading(true);
      setLoadError(null);
      try {
        const [week, month, organization] = await Promise.all([
          listAttendanceRecords(period.weekStart, period.weekEnd),
          listAttendanceRecords(period.monthStart, period.monthEnd),
          isAdmin ? listTenantAttendanceRecords(period.monthStart, period.monthEnd) : Promise.resolve([]),
        ]);
        if (!cancelled) {
          setWeeklyRecords(week);
          setMonthlyRecords(month);
          setOrganizationRecords(organization);
        }
      } catch (error) {
        if (!cancelled) {
          setLoadError(error instanceof Error ? error.message : 'Unable to load attendance statistics.');
          setWeeklyRecords([]);
          setMonthlyRecords([]);
          setOrganizationRecords([]);
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };
    void loadStats();
    return () => {
      cancelled = true;
    };
  }, [isAdmin, period]);

  const weeklyData = weeklyRecords.map((record) => ({
    name: format(new Date(`${record.date}T00:00:00`), 'EEE'),
    hours: record.totalHours === null ? 0 : Number(record.totalHours),
    late: record.status === 'Late' ? 1 : 0,
    early: 0,
    status: record.status,
  }));

  const completedWeek = weeklyRecords.filter((record) => record.totalHours !== null);
  const weeklyAverage = completedWeek.length
    ? completedWeek.reduce((sum, record) => sum + Number(record.totalHours || 0), 0) / completedWeek.length
    : null;
  const monthlyHours = monthlyRecords.reduce((sum, record) => sum + Number(record.totalHours || 0), 0);
  const percentage = (count: number, total: number) => total ? Math.round((count / total) * 100) : 0;
  const presentCount = organizationRecords.filter((record) => record.status === 'Present').length;
  const remoteCount = organizationRecords.filter((record) => record.status === 'Remote').length;
  const organizationData = (['Present', 'Late', 'Absent', 'Remote'] as const).map((name) => ({
    name,
    value: percentage(organizationRecords.filter((record) => record.status === name).length, organizationRecords.length),
  }));
  const attendanceTimeSummary = weeklyRecords
    .filter((record) => record.checkIn)
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 5)
    .map((record) => ({
      day: format(new Date(`${record.date}T00:00:00`), 'EEE, MMM d'),
      time: record.checkIn || '—',
      status: record.status,
    }));

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'On Time':
        return 'text-green-600';
      case 'Early':
        return 'text-blue-600';
      case 'Late':
        return 'text-amber-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Weekly Hours Chart */}
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>Weekly Hours</CardTitle>
          <CardDescription>Your working hours for the current week</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer className="h-64" config={Colors}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData} margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis domain={[0, 10]} />
                <ChartTooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <ChartTooltipContent 
                          className="bg-background p-3 shadow-lg border rounded-lg"
                        >
                          <div className="grid gap-2">
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-primary rounded-full" />
                              <span className="text-xs">Hours: {payload[0].value}</span>
                            </div>
                            {payload[0].payload.late > 0 && (
                              <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-amber-500 rounded-full" />
                                <span className="text-xs">Late by: {payload[0].payload.late} min</span>
                              </div>
                            )}
                            {payload[0].payload.early > 0 && (
                              <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-blue-500 rounded-full" />
                                <span className="text-xs">Early by: {payload[0].payload.early} min</span>
                              </div>
                            )}
                          </div>
                        </ChartTooltipContent>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="hours" fill="#8b5cf6" radius={[4, 4, 0, 0]}>
                  {weeklyData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.late > 0 ? '#f97316' : entry.early > 0 ? '#0ea5e9' : '#8b5cf6'} 
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
          <div className="flex justify-center space-x-4 mt-2">
            <div className="flex items-center">
              <div className="h-2 w-2 rounded-full bg-primary mr-1"></div>
              <span className="text-xs">Standard</span>
            </div>
            <div className="flex items-center">
              <div className="h-2 w-2 rounded-full bg-amber-500 mr-1"></div>
              <span className="text-xs">Late Arrival</span>
            </div>
            <div className="flex items-center">
              <div className="h-2 w-2 rounded-full bg-blue-500 mr-1"></div>
              <span className="text-xs">Early Arrival</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <Card>
        <CardHeader>
          <CardTitle>Attendance Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-slate-50 p-3 rounded-lg border">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">Weekly Average</p>
                <p className="text-2xl font-bold">8.4 hrs</p>
              </div>
              <div className="p-2 bg-primary/10 rounded-full">
                <Clock className="h-5 w-5 text-primary" />
              </div>
            </div>
          </div>
          
          {isAdmin ? (
            <div className="bg-slate-50 p-3 rounded-lg border">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">Attendance Rate</p>
                  <p className="text-2xl font-bold">92%</p>
                </div>
                <div className="p-2 bg-green-100 rounded-full">
                  <Users className="h-5 w-5 text-green-600" />
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-slate-50 p-3 rounded-lg border">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">On Time %</p>
                  <p className="text-2xl font-bold">80%</p>
                </div>
                <div className="p-2 bg-blue-100 rounded-full">
                  <Calendar className="h-5 w-5 text-blue-600" />
                </div>
              </div>
            </div>
          )}
          
          {isAdmin ? (
            <div className="bg-slate-50 p-3 rounded-lg border">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">Remote Work</p>
                  <p className="text-2xl font-bold">7%</p>
                </div>
                <div className="p-2 bg-indigo-100 rounded-full">
                  <MapPin className="h-5 w-5 text-indigo-600" />
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-slate-50 p-3 rounded-lg border">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">Monthly Hours</p>
                  <p className="text-2xl font-bold">168 hrs</p>
                </div>
                <div className="p-2 bg-amber-100 rounded-full">
                  <Calendar className="h-5 w-5 text-amber-600" />
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Check-ins */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Check-ins</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {attendanceTimeSummary.map((item, i) => (
              <div key={i} className="flex justify-between items-center bg-slate-50 p-2 rounded border">
                <span className="font-medium">{item.day}</span>
                <div className="text-right">
                  <div className="text-sm font-medium">{item.time}</div>
                  <div className={`text-xs ${getStatusColor(item.status)}`}>{item.status}</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Admin Stats */}
      {isAdmin && (
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Organization Attendance</CardTitle>
            <CardDescription>Current month statistics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-4 gap-4">
              {organizationData.map((item) => (
                <div key={item.name} className="bg-slate-50 p-3 rounded-lg border text-center">
                  <p className="text-sm font-medium text-slate-500">{item.name}</p>
                  <p className="text-2xl font-bold">{item.value}%</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
