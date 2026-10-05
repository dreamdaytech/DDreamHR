
import { differenceInDays } from 'date-fns';

export const calculateLeaveDays = (
  startDate: Date | undefined,
  endDate: Date | undefined,
  halfDay: boolean
): number => {
  if (!startDate || !endDate) return 0;
  const days = differenceInDays(endDate, startDate) + 1;
  return halfDay ? 0.5 : days;
};

export const validateLeaveForm = (
  leaveType: string,
  startDate: Date | undefined,
  reason: string
): boolean => {
  return !!(leaveType && startDate && reason);
};
