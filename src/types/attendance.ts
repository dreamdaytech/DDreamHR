
export type AttendanceStatus = 'Present' | 'Late' | 'Absent' | 'Remote';
export type BreakType = 'Lunch' | 'Personal' | 'Medical' | 'Other';
export type ReviewStatus = 'Pending' | 'Approved' | 'Rejected' | 'NeedsClarification';

export interface AttendanceRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  date: string; // ISO format
  checkIn: string | null; // HH:MM format
  checkOut: string | null; // HH:MM format
  totalHours: number | null;
  status: AttendanceStatus;
  location: string;
  ipAddress: string | null;
  device: string | null;
  notes: string | null;
  isRegularized: boolean;
  reportId?: string; // Reference to an attendance report if part of one
}

export interface BreakRecord {
  id: string;
  attendanceId: string;
  startTime: string; // HH:MM format
  endTime: string | null; // HH:MM format
  type: BreakType;
  isPaid: boolean;
  notes: string | null;
}

export interface RegularizationRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  attendanceId: string | null;
  date: string; // ISO format
  requestType: 'Check-In' | 'Check-Out' | 'Full Day' | 'Break';
  requestedTime: string | null; // HH:MM format
  reason: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  requestedAt: string; // ISO format
  approvedBy: string | null;
  approvedAt: string | null; // ISO format
}

export interface AttendanceSettings {
  workingHoursStart: string; // HH:MM format
  workingHoursEnd: string; // HH:MM format
  graceTimeLate: number; // minutes
  graceTimeEarly: number; // minutes
  allowedIpAddresses: string[];
  geoFencingEnabled: boolean;
  geoFencingRadius: number; // meters
  geoFencingLocations: { lat: number; lng: number; name: string }[];
  biometricRequired: boolean;
  facialRecognitionRequired: boolean;
}

// New Interfaces for Attendance Report Workflow
export interface AttendanceReportSubmission {
  id: string;
  employeeId: string;
  employeeName: string;
  reportType: 'Daily' | 'Weekly' | 'Monthly';
  startDate: string; // ISO format
  endDate: string; // ISO format
  submittedAt: string; // ISO format
  status: ReviewStatus;
  notes: string | null;
  attachments: AttachmentFile[];
  recordIds: string[]; // IDs of included attendance records
  feedback: FeedbackComment[];
  reviewedBy: string | null;
  reviewedAt: string | null; // ISO format
}

export interface AttachmentFile {
  id: string;
  fileName: string;
  fileType: string;
  fileSize: number; // in bytes
  uploadedAt: string; // ISO format
  url: string; // Mock URL in our case
}

export interface FeedbackComment {
  id: string;
  userId: string;
  userName: string;
  userRole: 'admin' | 'hr' | 'manager' | 'employee';
  comment: string;
  createdAt: string; // ISO format
  parentCommentId: string | null; // For threaded comments
}
