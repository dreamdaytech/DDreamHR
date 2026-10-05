
import { AttendanceStatus, ReviewStatus } from "./attendance";

export type TimeLogStatus = 'Pending' | 'Submitted' | 'Approved' | 'Rejected';
export type TimesheetPeriod = 'Daily' | 'Weekly' | 'Monthly';
export type TimesheetStatus = ReviewStatus;

export interface TimeLog {
  id: string;
  employeeId: number;
  employeeName: string;
  projectId: string;
  projectName: string;
  taskId: string | null;
  taskName: string | null;
  date: string; // ISO format
  startTime: string | null; // HH:MM format
  endTime: string | null; // HH:MM format
  duration: number; // minutes
  description: string | null;
  status: TimeLogStatus;
  isBillable: boolean;
  billableRate?: number;
  timesheetId?: string; // Reference to a timesheet if part of one
  createdAt: string; // ISO format
  updatedAt: string; // ISO format
}

export interface Timesheet {
  id: string;
  employeeId: number;
  employeeName: string;
  period: TimesheetPeriod;
  startDate: string; // ISO format
  endDate: string; // ISO format
  status: TimesheetStatus;
  submittedAt: string | null; // ISO format
  approvedBy: number | null;
  approvedAt: string | null; // ISO format
  notes: string | null;
  timeLogIds: string[]; // IDs of included time logs
}

export interface Project {
  id: string;
  name: string;
  clientId: string;
  clientName: string;
  description: string | null;
  startDate: string | null; // ISO format
  endDate: string | null; // ISO format
  status: 'Active' | 'Completed' | 'On Hold' | 'Cancelled';
  billable: boolean;
  defaultBillableRate?: number;
}

export interface Task {
  id: string;
  projectId: string;
  name: string;
  description: string | null;
  status: 'Open' | 'In Progress' | 'Completed';
  estimatedHours: number | null;
  assignees: number[]; // Employee IDs
}

export interface Client {
  id: string;
  name: string;
  contactPerson: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
  status: 'Active' | 'Inactive';
}

export interface TimeLogSummary {
  totalHours: number;
  billableHours: number;
  nonBillableHours: number;
  period: 'day' | 'week' | 'month';
  startDate: string;
  endDate: string;
}
