
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Plus, Building, Users, User, CalendarIcon, CheckCircle, Clock, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface Project {
  id: string;
  name: string;
  assignedTo: string[];
  department: string;
  createdBy?: string;
  dueDate?: string;
}

interface Task {
  id: string;
  name: string;
  projectId: string;
  estimatedHours: number;
  assignedTo?: string;
  status?: string;
}

interface ProjectTaskManagerProps {
  projects: Project[];
  tasks: Task[];
  onAddProject: (project: Omit<Project, 'id'>) => void;
  onAddTask: (task: Omit<Task, 'id'>) => void;
}

export const ProjectTaskManager: React.FC<ProjectTaskManagerProps> = ({
  projects,
  tasks,
  onAddProject,
  onAddTask
}) => {
  const { toast } = useToast();
  const [newProject, setNewProject] = useState({
    name: "",
    department: "",
    assignedTo: [] as string[],
    dueDate: undefined as Date | undefined,
    notes: ""
  });
  
  const [newTask, setNewTask] = useState({
    name: "",
    projectId: "",
    estimatedHours: 0,
    assignedTo: "individual",
    notes: "",
    dueDate: undefined as Date | undefined
  });

  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const departments = ["Development", "HR", "Marketing", "Sales", "Finance", "Operations", "Design", "QA"];
  
  const assignmentOptions = [
    { value: "all", label: "All Employees", icon: Building, description: "Assign to entire organization" },
    { value: "team-dev", label: "Development Team", icon: Users, description: "All developers and engineers" },
    { value: "team-hr", label: "HR Team", icon: Users, description: "Human resources department" },
    { value: "team-marketing", label: "Marketing Team", icon: Users, description: "Marketing and communications" },
    { value: "team-sales", label: "Sales Team", icon: Users, description: "Sales and business development" },
    { value: "team-finance", label: "Finance Team", icon: Users, description: "Finance and accounting" },
    { value: "team-design", label: "Design Team", icon: Users, description: "UI/UX and graphic design" },
    { value: "individual", label: "Individual Assignment", icon: User, description: "Assign to specific person" }
  ];

  const taskAssignmentOptions = [
    { value: "individual", label: "Individual", description: "Assign to one person" },
    { value: "team-dev", label: "Development Team", description: "Any developer can work on this" },
    { value: "team-design", label: "Design Team", description: "Design team members" },
    { value: "team-qa", label: "QA Team", description: "Quality assurance team" }
  ];

  const validateProject = () => {
    const errors: Record<string, string> = {};
    
    if (!newProject.name.trim()) {
      errors.projectName = "Project name is required";
    } else if (newProject.name.length < 3) {
      errors.projectName = "Project name must be at least 3 characters";
    } else if (projects.some(p => p.name.toLowerCase() === newProject.name.toLowerCase())) {
      errors.projectName = "Project name already exists";
    }
    
    if (!newProject.department) {
      errors.department = "Department is required";
    }
    
    if (newProject.assignedTo.length === 0) {
      errors.assignment = "At least one assignment is required";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateTask = () => {
    const errors: Record<string, string> = {};
    
    if (!newTask.name.trim()) {
      errors.taskName = "Task name is required";
    } else if (newTask.name.length < 2) {
      errors.taskName = "Task name must be at least 2 characters";
    }
    
    if (!newTask.projectId) {
      errors.project = "Project selection is required";
    }
    
    if (newTask.estimatedHours <= 0) {
      errors.hours = "Estimated hours must be greater than 0";
    } else if (newTask.estimatedHours > 200) {
      errors.hours = "Estimated hours cannot exceed 200";
    }

    // Check for duplicate task in same project
    if (newTask.projectId && newTask.name.trim()) {
      const existingTasks = tasks.filter(t => t.projectId === newTask.projectId);
      if (existingTasks.some(t => t.name.toLowerCase() === newTask.name.toLowerCase())) {
        errors.taskName = "Task already exists in this project";
      }
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleAddProject = () => {
    if (!validateProject()) return;

    const projectData = {
      name: newProject.name.trim(),
      department: newProject.department,
      assignedTo: newProject.assignedTo,
      dueDate: newProject.dueDate ? format(newProject.dueDate, 'yyyy-MM-dd') : undefined,
      notes: newProject.notes
    };

    onAddProject(projectData);
    setNewProject({ name: "", department: "", assignedTo: [], dueDate: undefined, notes: "" });
    setValidationErrors({});

    toast({
      title: "Project Created Successfully",
      description: `${projectData.name} has been created and assigned to selected teams.`,
      action: (
        <CheckCircle className="h-5 w-5 text-green-600" />
      ),
    });
  };

  const handleAddTask = () => {
    if (!validateTask()) return;

    const taskData = {
      name: newTask.name.trim(),
      projectId: newTask.projectId,
      estimatedHours: newTask.estimatedHours,
      assignedTo: newTask.assignedTo,
      notes: newTask.notes,
      dueDate: newTask.dueDate ? format(newTask.dueDate, 'yyyy-MM-dd') : undefined
    };

    onAddTask(taskData);
    setNewTask({ 
      name: "", 
      projectId: "", 
      estimatedHours: 0, 
      assignedTo: "individual", 
      notes: "",
      dueDate: undefined 
    });
    setValidationErrors({});

    toast({
      title: "Task Created Successfully",
      description: `${taskData.name} has been added and is ready for time tracking.`,
      action: (
        <CheckCircle className="h-5 w-5 text-green-600" />
      ),
    });
  };

  const toggleAssignment = (assignment: string) => {
    setNewProject(prev => ({
      ...prev,
      assignedTo: prev.assignedTo.includes(assignment)
        ? prev.assignedTo.filter(a => a !== assignment)
        : [...prev.assignedTo, assignment]
    }));
  };

  const getProjectStats = (projectId: string) => {
    const projectTasks = tasks.filter(t => t.projectId === projectId);
    const totalEstimatedHours = projectTasks.reduce((sum, task) => sum + task.estimatedHours, 0);
    return {
      taskCount: projectTasks.length,
      totalHours: totalEstimatedHours
    };
  };

  return (
    <Tabs defaultValue="projects" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="projects">Projects</TabsTrigger>
        <TabsTrigger value="tasks">Tasks</TabsTrigger>
      </TabsList>

      <TabsContent value="projects" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Create New Project
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="project-name">Project Name *</Label>
                <Input
                  id="project-name"
                  value={newProject.name}
                  onChange={(e) => setNewProject(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter project name"
                  className={validationErrors.projectName ? "border-red-500" : ""}
                />
                {validationErrors.projectName && (
                  <p className="text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    {validationErrors.projectName}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="department">Department *</Label>
                <Select 
                  value={newProject.department} 
                  onValueChange={(value) => setNewProject(prev => ({ ...prev, department: value }))}
                >
                  <SelectTrigger className={validationErrors.department ? "border-red-500" : ""}>
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map(dept => (
                      <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {validationErrors.department && (
                  <p className="text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    {validationErrors.department}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Due Date (Optional)</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !newProject.dueDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {newProject.dueDate ? format(newProject.dueDate, "PPP") : "Pick a due date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={newProject.dueDate}
                    onSelect={(date) => setNewProject(prev => ({ ...prev, dueDate: date }))}
                    initialFocus
                    disabled={(date) => date < new Date()}
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label>Assignment *</Label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {assignmentOptions.map(option => (
                  <Button
                    key={option.value}
                    variant={newProject.assignedTo.includes(option.value) ? "default" : "outline"}
                    size="sm"
                    onClick={() => toggleAssignment(option.value)}
                    className="justify-start h-auto p-3"
                  >
                    <option.icon className="h-4 w-4 mr-2 flex-shrink-0" />
                    <div className="text-left">
                      <div className="font-medium">{option.label}</div>
                      <div className="text-xs opacity-75">{option.description}</div>
                    </div>
                  </Button>
                ))}
              </div>
              {validationErrors.assignment && (
                <p className="text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="h-4 w-4" />
                  {validationErrors.assignment}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="project-notes">Notes (Optional)</Label>
              <Textarea
                id="project-notes"
                value={newProject.notes}
                onChange={(e) => setNewProject(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="Add project description or notes..."
                rows={3}
              />
            </div>

            <Button onClick={handleAddProject} className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              Create Project
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Existing Projects ({projects.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {projects.map(project => {
                const stats = getProjectStats(project.id);
                return (
                  <div key={project.id} className="flex items-start justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-medium text-lg">{project.name}</h4>
                          <p className="text-sm text-muted-foreground flex items-center gap-2">
                            <Building className="h-4 w-4" />
                            {project.department}
                            {project.dueDate && (
                              <>
                                <span>•</span>
                                <Clock className="h-4 w-4" />
                                Due: {project.dueDate}
                              </>
                            )}
                          </p>
                        </div>
                        <div className="text-right text-sm text-muted-foreground">
                          <div>{stats.taskCount} tasks</div>
                          <div>{stats.totalHours}h estimated</div>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {project.assignedTo.map(assignment => (
                          <Badge key={assignment} variant="secondary" className="text-xs">
                            {assignmentOptions.find(opt => opt.value === assignment)?.label || assignment}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
              {projects.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <Building className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No projects created yet. Create your first project above.</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="tasks" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Create New Task
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="task-project">Project *</Label>
                <Select 
                  value={newTask.projectId} 
                  onValueChange={(value) => setNewTask(prev => ({ ...prev, projectId: value }))}
                >
                  <SelectTrigger className={validationErrors.project ? "border-red-500" : ""}>
                    <SelectValue placeholder="Select project" />
                  </SelectTrigger>
                  <SelectContent>
                    {projects.map(project => (
                      <SelectItem key={project.id} value={project.id}>
                        <div className="flex flex-col">
                          <span>{project.name}</span>
                          <span className="text-xs text-muted-foreground">{project.department}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {validationErrors.project && (
                  <p className="text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    {validationErrors.project}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="task-name">Task Name *</Label>
                <Input
                  id="task-name"
                  value={newTask.name}
                  onChange={(e) => setNewTask(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter task name"
                  className={validationErrors.taskName ? "border-red-500" : ""}
                />
                {validationErrors.taskName && (
                  <p className="text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    {validationErrors.taskName}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="estimated-hours">Estimated Hours *</Label>
                <Input
                  id="estimated-hours"
                  type="number"
                  min="0.5"
                  step="0.5"
                  max="200"
                  value={newTask.estimatedHours || ""}
                  onChange={(e) => setNewTask(prev => ({ ...prev, estimatedHours: parseFloat(e.target.value) || 0 }))}
                  placeholder="Enter estimated hours"
                  className={validationErrors.hours ? "border-red-500" : ""}
                />
                {validationErrors.hours && (
                  <p className="text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    {validationErrors.hours}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="task-assignment">Assignment</Label>
                <Select 
                  value={newTask.assignedTo} 
                  onValueChange={(value) => setNewTask(prev => ({ ...prev, assignedTo: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select assignment type" />
                  </SelectTrigger>
                  <SelectContent>
                    {taskAssignmentOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        <div className="flex flex-col">
                          <span>{option.label}</span>
                          <span className="text-xs text-muted-foreground">{option.description}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Due Date (Optional)</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !newTask.dueDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {newTask.dueDate ? format(newTask.dueDate, "PPP") : "Pick a due date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={newTask.dueDate}
                    onSelect={(date) => setNewTask(prev => ({ ...prev, dueDate: date }))}
                    initialFocus
                    disabled={(date) => date < new Date()}
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label htmlFor="task-notes">Notes (Optional)</Label>
              <Textarea
                id="task-notes"
                value={newTask.notes}
                onChange={(e) => setNewTask(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="Add task description or notes..."
                rows={3}
              />
            </div>

            <Button onClick={handleAddTask} className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              Create Task
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Existing Tasks ({tasks.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {tasks.map(task => {
                const project = projects.find(p => p.id === task.projectId);
                return (
                  <div key={task.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex-1">
                      <h4 className="font-medium">{task.name}</h4>
                      <p className="text-sm text-muted-foreground flex items-center gap-2">
                        <Building className="h-4 w-4" />
                        {project?.name}
                        <span>•</span>
                        <Clock className="h-4 w-4" />
                        {task.estimatedHours}h estimated
                      </p>
                    </div>
                    <Badge variant="outline" className="ml-2">
                      {taskAssignmentOptions.find(opt => opt.value === task.assignedTo)?.label || task.assignedTo}
                    </Badge>
                  </div>
                );
              })}
              {tasks.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No tasks created yet. Create your first task above.</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};
