
// This file now serves as a re-export to maintain backward compatibility
// Importing from this file will work the same as before the refactoring
import { 
  getMockDailyAttendanceSummary,
  generateMockAttendanceForMultipleEmployees,
  generateAttendanceCalendarData,
  generateMockReportSubmissions,
  generateAllEmployeeReportSubmissions,
  getDeviationData,
  calculateHoursBreakdown,
  calculatePayrollData,
  exportToCsv,
  addFeedbackComment,
  updateReportStatus,
  getStatusBadgeColor
} from './attendance';

// Import types separately
import type {
  AttendanceSummary,
  DeviationRecord,
  HoursBreakdown,
  PayrollRecord
} from './attendance';

// Re-export functions to maintain backward compatibility
export {
  // Mock data generators
  getMockDailyAttendanceSummary,
  generateMockAttendanceForMultipleEmployees,
  generateAttendanceCalendarData,
  generateMockReportSubmissions,
  generateAllEmployeeReportSubmissions,
  
  // Calculation utilities
  getDeviationData,
  calculateHoursBreakdown,
  calculatePayrollData,
  
  // Export utilities
  exportToCsv,
  
  // Report feedback utilities
  addFeedbackComment,
  updateReportStatus,
  getStatusBadgeColor
};

// Re-export types using "export type" syntax
export type { AttendanceSummary, DeviationRecord, HoursBreakdown, PayrollRecord };
