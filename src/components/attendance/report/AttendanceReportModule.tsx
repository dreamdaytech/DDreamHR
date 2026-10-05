
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { AttendanceReportForm } from './AttendanceReportForm';
import { AttendanceReportList } from './AttendanceReportList';
import { AttendanceReportDetail } from './AttendanceReportDetail';
import { AttendanceReportSubmission } from '@/types/attendance';
import { generateMockReportSubmissions, generateAllEmployeeReportSubmissions } from '@/utils/reportUtils';

export const AttendanceReportModule: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<string>('my-submissions');
  const [myReports, setMyReports] = useState<AttendanceReportSubmission[]>([]);
  const [allReports, setAllReports] = useState<AttendanceReportSubmission[]>([]);
  const [detailReport, setDetailReport] = useState<AttendanceReportSubmission | null>(null);
  const [showDetail, setShowDetail] = useState<boolean>(false);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  
  const isAdminOrHR = user && ['admin', 'hr'].includes(user.role);
  
  // Load mock data
  useEffect(() => {
    if (user) {
      // For employee's own reports
      const mockReports = generateMockReportSubmissions(user.id, user.name, 8);
      setMyReports(mockReports);
      
      // For HR/admin to see all employee reports
      if (isAdminOrHR) {
        const allEmployeeReports = generateAllEmployeeReportSubmissions(10, 5);
        setAllReports(allEmployeeReports);
      }
    }
  }, [user, isAdminOrHR]);
  
  // Handle creating a new report submission
  const handleSubmitReport = (reportData: Omit<AttendanceReportSubmission, 'id' | 'submittedAt' | 'status' | 'feedback' | 'reviewedBy' | 'reviewedAt'>) => {
    const newReport: AttendanceReportSubmission = {
      ...reportData,
      id: `report-${Date.now()}`,
      submittedAt: new Date().toISOString(),
      status: 'Pending',
      feedback: [],
      reviewedBy: null,
      reviewedAt: null
    };
    
    setMyReports(prev => [newReport, ...prev]);
    
    // Also add to all reports list if admin/HR
    if (isAdminOrHR) {
      setAllReports(prev => [newReport, ...prev]);
    }
  };
  
  // Handle updating an existing report
  const handleUpdateReport = (updatedReport: AttendanceReportSubmission) => {
    // Update in my reports
    setMyReports(prev => 
      prev.map(report => 
        report.id === updatedReport.id ? updatedReport : report
      )
    );
    
    // Update in all reports
    setAllReports(prev => 
      prev.map(report => 
        report.id === updatedReport.id ? updatedReport : report
      )
    );
    
    // Update detail view if open
    if (detailReport && detailReport.id === updatedReport.id) {
      setDetailReport(updatedReport);
    }
  };
  
  // Filter reports by status
  const getFilteredReports = (reports: AttendanceReportSubmission[]) => {
    if (filterStatus === 'all') return reports;
    return reports.filter(report => report.status.toLowerCase() === filterStatus.toLowerCase());
  };
  
  // Reports to display based on active tab and filters
  const displayReports = activeTab === 'my-submissions' 
    ? getFilteredReports(myReports)
    : getFilteredReports(allReports);
  
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Attendance Report Submission</h1>
          <p className="text-muted-foreground">
            {isAdminOrHR 
              ? 'Review and manage attendance reports from employees' 
              : 'Submit and track your attendance reports'
            }
          </p>
        </div>
        
        {!isAdminOrHR && <AttendanceReportForm onSubmit={handleSubmitReport} />}
      </div>
      
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <Tabs 
          value={activeTab} 
          onValueChange={setActiveTab} 
          className="w-full"
        >
          <TabsList>
            <TabsTrigger value="my-submissions">
              My Submissions
              <Badge variant="outline" className="ml-2">
                {myReports.length}
              </Badge>
            </TabsTrigger>
            {isAdminOrHR && (
              <TabsTrigger value="all-submissions">
                All Submissions
                <Badge variant="outline" className="ml-2">
                  {allReports.length}
                </Badge>
              </TabsTrigger>
            )}
          </TabsList>
        </Tabs>
        
        <div className="w-full sm:w-auto">
          <Select
            value={filterStatus}
            onValueChange={setFilterStatus}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
              <SelectItem value="needsclarification">Needs Clarification</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <AttendanceReportList
        reports={displayReports}
        onViewReport={(report) => {
          setDetailReport(report);
          setShowDetail(true);
        }}
      />
      
      {!displayReports.length && (
        <Card>
          <CardContent className="py-6 text-center">
            <p>No reports found matching the current filter.</p>
          </CardContent>
        </Card>
      )}
      
      <AttendanceReportDetail
        report={detailReport}
        open={showDetail}
        onOpenChange={setShowDetail}
        onUpdateReport={handleUpdateReport}
      />
    </div>
  );
};
