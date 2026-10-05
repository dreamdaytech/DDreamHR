
import { format, addDays, eachDayOfInterval } from 'date-fns';
import { AttendanceRecord, AttendanceReportSubmission, FeedbackComment, AttachmentFile, ReviewStatus } from '@/types/attendance';
import { generateMockAttendanceData } from '../attendanceUtils';
import { AttendanceSummary } from './interfaces';

// Mock data for daily attendance
export const getMockDailyAttendanceSummary = (date: Date): AttendanceSummary => {
  // This would come from a real API in production
  const totalEmployees = 120;
  const presentRatio = 0.75 + Math.random() * 0.2;
  const lateRatio = 0.08 + Math.random() * 0.1;
  const absentRatio = 0.05 + Math.random() * 0.08;
  const remoteRatio = 1 - presentRatio - lateRatio - absentRatio;
  
  return {
    present: Math.floor(totalEmployees * presentRatio),
    late: Math.floor(totalEmployees * lateRatio),
    absent: Math.floor(totalEmployees * absentRatio),
    remote: Math.floor(totalEmployees * remoteRatio),
    total: totalEmployees
  };
};

// Generate mock attendance data for multiple employees
export const generateMockAttendanceForMultipleEmployees = (
  startDate: Date,
  endDate: Date,
  employeeCount: number = 5
): AttendanceRecord[] => {
  let allRecords: AttendanceRecord[] = [];
  
  for (let i = 1; i <= employeeCount; i++) {
    const employeeRecords = generateMockAttendanceData(
      startDate,
      endDate,
      i, // FIX: Pass 'i' as a number, as expected by the function.
      `Employee ${i}`
    );
    allRecords = [...allRecords, ...employeeRecords];
  }
  
  return allRecords;
};

// Generate attendance calendar data for a specific employee
export const generateAttendanceCalendarData = (
  records: AttendanceRecord[],
  employeeId: string,
  startDate: Date,
  endDate: Date
) => {
  // Generate all days in the interval
  const days = eachDayOfInterval({ start: startDate, end: endDate });
  
  // Map each day to an attendance status
  return days.map(day => {
    const dateStr = format(day, 'yyyy-MM-dd');
    const record = records.find(r => 
      r.employeeId === employeeId && r.date === dateStr
    );
    
    return {
      date: dateStr,
      dayOfWeek: format(day, 'E'),
      dayOfMonth: format(day, 'd'),
      status: record?.status || 'Absent',
      checkIn: record?.checkIn || null,
      checkOut: record?.checkOut || null
    };
  });
};

// Mock data for report submissions
export const generateMockReportSubmissions = (
  employeeId: string, 
  employeeName: string,
  count: number = 5
): AttendanceReportSubmission[] => {
  const submissions: AttendanceReportSubmission[] = [];
  const now = new Date();
  
  for (let i = 0; i < count; i++) {
    const isDaily = Math.random() > 0.6;
    const isWeekly = !isDaily && Math.random() > 0.5;
    const reportType = isDaily ? 'Daily' : isWeekly ? 'Weekly' : 'Monthly';
    
    const startDate = new Date(now);
    startDate.setDate(now.getDate() - (i * (isDaily ? 1 : isWeekly ? 7 : 30)));
    
    const endDate = new Date(startDate);
    if (!isDaily) {
      endDate.setDate(startDate.getDate() + (isWeekly ? 6 : 29));
    }
    
    // Generate random status with higher probability for 'Approved' for older submissions
    let status: ReviewStatus;
    const randomValue = Math.random();
    if (i > 3) {
      status = randomValue > 0.1 ? 'Approved' : randomValue > 0.05 ? 'Rejected' : 'NeedsClarification';
    } else if (i > 1) {
      status = randomValue > 0.4 ? 'Approved' : randomValue > 0.2 ? 'Rejected' : randomValue > 0.1 ? 'NeedsClarification' : 'Pending';
    } else {
      status = randomValue > 0.7 ? 'Approved' : 'Pending';
    }
    
    // Mock record IDs
    const recordIds = [];
    let currentDate = new Date(startDate);
    while (currentDate <= endDate) {
      if ([0, 6].includes(currentDate.getDay()) === false) { // Skip weekends
        recordIds.push(`att-mock-${employeeId}-${format(currentDate, 'yyyy-MM-dd')}`);
      }
      currentDate = addDays(currentDate, 1);
    }
    
    // Mock feedback
    const feedback: FeedbackComment[] = [];
    if (status !== 'Pending') {
      const feedbackCount = Math.floor(Math.random() * 3);
      for (let j = 0; j < feedbackCount; j++) {
        feedback.push({
          id: `feedback-${Date.now()}-${j}`,
          userId: '2', // HR user ID
          userName: 'Jane HR',
          userRole: 'hr',
          comment: j === 0 
            ? 'Please clarify your late arrival on the first day.'
            : `Thank you for providing the additional information. ${status === 'Approved' ? 'Your report has been approved.' : 'Please submit documentation for your absence.'}`,
          createdAt: format(addDays(now, -i - j), "yyyy-MM-dd'T'HH:mm:ss"),
          parentCommentId: j > 0 ? `feedback-${Date.now()}-0` : null
        });
        
        // Add employee response
        if (j === 0 && feedbackCount > 1) {
          feedback.push({
            id: `feedback-emp-${Date.now()}-${j}`,
            userId: employeeId,
            userName: employeeName,
            userRole: 'employee',
            comment: "I had a transportation issue that morning. I've attached the train delay notification.",
            createdAt: format(addDays(now, -i - j + 0.5), "yyyy-MM-dd'T'HH:mm:ss"),
            parentCommentId: `feedback-${Date.now()}-${j}`
          });
        }
      }
    }
    
    // Mock attachments
    const attachments: AttachmentFile[] = [];
    const hasAttachment = Math.random() > 0.5;
    if (hasAttachment) {
      attachments.push({
        id: `attachment-${Date.now()}-0`,
        fileName: 'attendance_proof.pdf',
        fileType: 'application/pdf',
        fileSize: Math.round(1024 * 1024 * (Math.random() * 5)), // Random size up to 5MB
        uploadedAt: format(new Date(startDate), "yyyy-MM-dd'T'HH:mm:ss"),
        url: 'https://example.com/attachments/mock-file.pdf'
      });
    }
    
    submissions.push({
      id: `report-${employeeId}-${format(startDate, 'yyyy-MM-dd')}`,
      employeeId,
      employeeName,
      reportType,
      startDate: format(startDate, 'yyyy-MM-dd'),
      endDate: format(endDate, 'yyyy-MM-dd'),
      submittedAt: format(addDays(endDate, 1), "yyyy-MM-dd'T'HH:mm:ss"),
      status,
      notes: Math.random() > 0.7 ? 'Please note that I was working remotely on Thursday due to the office maintenance.' : null,
      attachments,
      recordIds,
      feedback,
      reviewedBy: status !== 'Pending' ? '2' : null, // HR user ID if reviewed
      reviewedAt: status !== 'Pending' ? format(addDays(endDate, 2), "yyyy-MM-dd'T'HH:mm:ss") : null
    });
  }
  
  return submissions;
};

// Get submissions for ALL employees (for HR/Admin view)
export const generateAllEmployeeReportSubmissions = (
  employeeCount: number = 10,
  submissionsPerEmployee: number = 3
): AttendanceReportSubmission[] => {
  let allSubmissions: AttendanceReportSubmission[] = [];
  
  for (let i = 1; i <= employeeCount; i++) {
    const employeeName = `Employee ${i}`;
    const submissions = generateMockReportSubmissions(String(i), employeeName, submissionsPerEmployee);
    allSubmissions = [...allSubmissions, ...submissions];
  }
  
  // Sort by submission date (newest first)
  return allSubmissions.sort((a, b) => 
    new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
  );
};
