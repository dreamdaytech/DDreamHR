
import { format } from 'date-fns';

export const ClockDisplay = () => {
  const currentTime = new Date();
  const formattedDate = format(currentTime, 'EEEE, MMMM d, yyyy');
  const formattedTime = format(currentTime, 'hh:mm a');

  return (
    <div className="mb-4 text-center">
      <div className="text-4xl font-bold text-indigo-700">{formattedTime}</div>
      <div className="text-muted-foreground">{formattedDate}</div>
    </div>
  );
};
