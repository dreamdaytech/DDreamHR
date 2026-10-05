
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface ValidationState {
  isValid: boolean;
  message: string;
}

interface TimerFormProps {
  date: Date;
  description: string;
  isBillable: boolean;
  timer: number;
  projectValidation: ValidationState;
  taskValidation: ValidationState;
  onDateChange: (date: Date | undefined) => void;
  onDescriptionChange: (description: string) => void;
  onBillableChange: (billable: boolean) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const TimerForm: React.FC<TimerFormProps> = ({
  date,
  description,
  isBillable,
  timer,
  projectValidation,
  taskValidation,
  onDateChange,
  onDescriptionChange,
  onBillableChange,
  onSubmit,
}) => {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="date">Date</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-full justify-start text-left font-normal",
                !date && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? format(date, "PPP") : <span>Pick a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={date}
              onSelect={onDateChange}
              initialFocus
              className="p-3 pointer-events-auto"
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Input
          id="description"
          value={description}
          onChange={(e) => onDescriptionChange(e.target.value)}
          placeholder="What did you work on?"
        />
      </div>

      <div className="flex items-center space-x-2">
        <Switch 
          id="billable" 
          checked={isBillable}
          onCheckedChange={onBillableChange}
        />
        <Label htmlFor="billable">Billable</Label>
      </div>

      <div className="pt-2">
        <Button 
          type="submit" 
          className="w-full bg-primary hover:bg-primary-700 text-white"
          disabled={timer === 0 || !projectValidation.isValid || !taskValidation.isValid}
        >
          Save Time Log
        </Button>
      </div>
    </>
  );
};
