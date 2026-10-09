
export interface LeaveType {
  value: string;
  label: string;
  balance: number;
  isPaid?: boolean;
  visibility?: 'individual' | 'team';
  description?: string;
  active?: boolean;
}

export const leaveTypes: LeaveType[] = [
  { value: 'annual', label: 'Annual Leave', balance: 15 },
  { value: 'sick', label: 'Sick Leave', balance: 8 },
  { value: 'personal', label: 'Personal Leave', balance: 3 },
  { value: 'maternity', label: 'Maternity Leave', balance: 90 },
  { value: 'paternity', label: 'Paternity Leave', balance: 14 },
  { value: 'unpaid', label: 'Unpaid Leave', balance: 0 }
];
