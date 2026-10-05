
import React, { useState } from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Check, Edit, MoreHorizontal, Search, Trash2, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Mock data for time logs
const mockTimeLogs = [
  {
    id: "1",
    date: "2025-05-20",
    project: "DreamDay Website Redesign",
    task: "Design",
    description: "Working on mockups for homepage",
    duration: "2h 15m",
    status: "Approved",
    billable: true
  },
  {
    id: "2",
    date: "2025-05-20",
    project: "Mobile App Development",
    task: "UI Design",
    description: "Creating user flow diagrams",
    duration: "1h 30m",
    status: "Pending",
    billable: true
  },
  {
    id: "3",
    date: "2025-05-19",
    project: "Internal HR Portal",
    task: "Documentation",
    description: "Writing technical documentation",
    duration: "3h 45m",
    status: "Submitted",
    billable: false
  },
  {
    id: "4",
    date: "2025-05-19",
    project: "DreamDay Website Redesign",
    task: "Development",
    description: "Implementing responsive design",
    duration: "4h 00m",
    status: "Approved",
    billable: true
  },
  {
    id: "5",
    date: "2025-05-18",
    project: "Mobile App Development",
    task: "Backend Development",
    description: "API integration for user authentication",
    duration: "2h 45m",
    status: "Rejected",
    billable: false
  }
];

const TimeLogList = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [timeLogs, setTimeLogs] = useState(mockTimeLogs);
  const [selectedLog, setSelectedLog] = useState<string | null>(null);
  
  // Filter logs based on search term
  const filteredLogs = timeLogs.filter(log => 
    log.project.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.task.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = (id: string) => {
    setTimeLogs(timeLogs.filter(log => log.id !== id));
    toast({
      title: "Time log deleted",
      description: "Time log has been deleted successfully."
    });
  };

  const getStatusBadge = (status: string) => {
    switch(status.toLowerCase()) {
      case "approved":
        return <Badge className="bg-green-500 hover:bg-green-600">{status}</Badge>;
      case "pending":
        return <Badge variant="outline" className="text-orange-500 border-orange-500">{status}</Badge>;
      case "submitted":
        return <Badge className="bg-blue-500 hover:bg-blue-600">{status}</Badge>;
      case "rejected":
        return <Badge variant="destructive">{status}</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex w-full items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search time logs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Project</TableHead>
              <TableHead className="hidden md:table-cell">Task</TableHead>
              <TableHead className="hidden lg:table-cell">Description</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead className="hidden md:table-cell">Billable</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[70px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredLogs.length > 0 ? (
              filteredLogs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell>{new Date(log.date).toLocaleDateString()}</TableCell>
                  <TableCell className="font-medium">{log.project}</TableCell>
                  <TableCell className="hidden md:table-cell">{log.task}</TableCell>
                  <TableCell className="hidden lg:table-cell">{log.description}</TableCell>
                  <TableCell>{log.duration}</TableCell>
                  <TableCell className="hidden md:table-cell">
                    {log.billable ? <Check className="h-4 w-4 text-green-500" /> : <X className="h-4 w-4 text-red-500" />}
                  </TableCell>
                  <TableCell>{getStatusBadge(log.status)}</TableCell>
                  <TableCell>
                    <Dialog>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DialogTrigger asChild>
                            <DropdownMenuItem onSelect={() => setSelectedLog(log.id)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                          </DialogTrigger>
                          <DropdownMenuItem onSelect={() => handleDelete(log.id)}>
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>

                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Edit Time Log</DialogTitle>
                        </DialogHeader>
                        <div className="py-4">
                          <p>Edit time log functionality will be implemented here.</p>
                          <p className="text-sm text-muted-foreground mt-2">
                            This will include form fields for updating all time log details.
                          </p>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center">
                  No time logs found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default TimeLogList;
