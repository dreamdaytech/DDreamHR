
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { readDemoData, writeDemoData } from "@/lib/demoStore";
import { useAuth } from "@/context/AuthContext";
import { ProjectTaskManager } from "./ProjectTaskManager";
import { TimerControls } from "./TimerControls";
import { ProjectTaskSelector } from "./ProjectTaskSelector";
import { ActiveTimers } from "./ActiveTimers";
import { TimerForm } from "./TimerForm";

const TimeTracker = () => {
  const { toast } = useToast();
  const { user, hasRole } = useAuth();
  
  // Basic timer state
  const [isTracking, setIsTracking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [timer, setTimer] = useState(0);
  const [intervalId, setIntervalId] = useState<number | null>(null);
  const [date, setDate] = useState<Date>(new Date());
  const [project, setProject] = useState<string>("");
  const [task, setTask] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [isBillable, setIsBillable] = useState(true);
  const [showProjectDialog, setShowProjectDialog] = useState(false);
  
  // Project/Task selection state
  const [projectInput, setProjectInput] = useState<string>("");
  const [taskInput, setTaskInput] = useState<string>("");
  const [showProjectDropdown, setShowProjectDropdown] = useState(false);
  const [showTaskDropdown, setShowTaskDropdown] = useState(false);
  const [projectValidation, setProjectValidation] = useState<{ isValid: boolean; message: string }>({ isValid: true, message: "" });
  const [taskValidation, setTaskValidation] = useState<{ isValid: boolean; message: string }>({ isValid: true, message: "" });

  // Data state
  const [projects, setProjects] = useState([
    { id: "1", name: "DreamDay Website Redesign", assignedTo: ["all"], department: "Development", createdBy: "admin", dueDate: "2024-02-15" },
    { id: "2", name: "Mobile App Development", assignedTo: ["team-dev"], department: "Development", createdBy: "manager", dueDate: "2024-03-01" },
    { id: "3", name: "Internal HR Portal", assignedTo: ["team-hr"], department: "HR", createdBy: "hr", dueDate: "2024-02-28" },
    { id: "4", name: "Marketing Campaign Q1", assignedTo: ["team-marketing"], department: "Marketing", createdBy: "manager", dueDate: "2024-03-15" },
  ]);

  const [tasks, setTasks] = useState([
    { id: "1", name: "UI/UX Design", projectId: "1", estimatedHours: 20, assignedTo: "individual", status: "active" },
    { id: "2", name: "Frontend Development", projectId: "1", estimatedHours: 40, assignedTo: "team-dev", status: "active" },
    { id: "3", name: "Backend Integration", projectId: "1", estimatedHours: 30, assignedTo: "team-dev", status: "active" },
    { id: "4", name: "React Native Setup", projectId: "2", estimatedHours: 15, assignedTo: "individual", status: "active" },
    { id: "5", name: "API Development", projectId: "2", estimatedHours: 25, assignedTo: "team-dev", status: "active" },
    { id: "6", name: "Authentication Module", projectId: "3", estimatedHours: 18, assignedTo: "team-dev", status: "active" },
    { id: "7", name: "Content Strategy", projectId: "4", estimatedHours: 12, assignedTo: "team-marketing", status: "active" },
    { id: "8", name: "Testing & QA", projectId: "1", estimatedHours: 16, assignedTo: "individual", status: "active" },
    { id: "9", name: "Performance Optimization", projectId: "2", estimatedHours: 8, assignedTo: "individual", status: "active" },
  ]);

  // Active timers for multiple tasks
  const [activeTimers, setActiveTimers] = useState<Record<string, { timer: number; isRunning: boolean; intervalId: number | null }>>({});

  const canManageProjects = hasRole(['admin', 'hr', 'manager']);

  const getProjectTasks = (projectName: string) => {
    const projectObj = projects.find(p => p.name === projectName);
    if (!projectObj) return [];
    return tasks.filter(t => t.projectId === projectObj.id && t.status === 'active');
  };

  // Validation functions
  const validateProject = (projectName: string) => {
    if (!projectName.trim()) {
      setProjectValidation({ isValid: false, message: "Project name is required" });
      return false;
    }
    if (projectName.length < 3) {
      setProjectValidation({ isValid: false, message: "Project name must be at least 3 characters" });
      return false;
    }
    if (projectName.length > 50) {
      setProjectValidation({ isValid: false, message: "Project name must be less than 50 characters" });
      return false;
    }
    setProjectValidation({ isValid: true, message: "" });
    return true;
  };

  const validateTask = (taskName: string) => {
    if (!taskName.trim()) {
      setTaskValidation({ isValid: false, message: "Task name is required" });
      return false;
    }
    if (taskName.length < 2) {
      setTaskValidation({ isValid: false, message: "Task name must be at least 2 characters" });
      return false;
    }
    if (taskName.length > 40) {
      setTaskValidation({ isValid: false, message: "Task name must be less than 40 characters" });
      return false;
    }
    
    const existingTasks = getProjectTasks(project);
    const isDuplicate = existingTasks.some(t => t.name.toLowerCase() === taskName.toLowerCase());
    if (isDuplicate) {
      setTaskValidation({ isValid: false, message: "Task already exists in this project" });
      return false;
    }
    
    setTaskValidation({ isValid: true, message: "" });
    return true;
  };

  useEffect(() => {
    if (projectInput) {
      validateProject(projectInput);
    }
  }, [projectInput]);

  useEffect(() => {
    if (taskInput && project) {
      validateTask(taskInput);
    }
  }, [taskInput, project]);

  // Timer management functions
  const startTaskTimer = (taskId: string) => {
    if (activeTimers[taskId]?.intervalId) {
      clearInterval(activeTimers[taskId].intervalId);
    }
    
    const id = window.setInterval(() => {
      setActiveTimers(prev => ({
        ...prev,
        [taskId]: {
          ...prev[taskId],
          timer: (prev[taskId]?.timer || 0) + 1
        }
      }));
    }, 1000);
    
    setActiveTimers(prev => ({
      ...prev,
      [taskId]: {
        timer: prev[taskId]?.timer || 0,
        isRunning: true,
        intervalId: id
      }
    }));

    toast({
      title: "Timer Started",
      description: `Tracking time for task: ${tasks.find(t => t.id === taskId)?.name}`,
    });
  };

  const pauseTaskTimer = (taskId: string) => {
    if (activeTimers[taskId]?.intervalId) {
      clearInterval(activeTimers[taskId].intervalId);
    }
    
    setActiveTimers(prev => ({
      ...prev,
      [taskId]: {
        ...prev[taskId],
        isRunning: false,
        intervalId: null
      }
    }));

    toast({
      title: "Timer Paused",
      description: "You can continue or reset the timer.",
    });
  };

  const resetTaskTimer = (taskId: string) => {
    if (activeTimers[taskId]?.intervalId) {
      clearInterval(activeTimers[taskId].intervalId);
    }
    
    setActiveTimers(prev => {
      const newTimers = { ...prev };
      delete newTimers[taskId];
      return newTimers;
    });

    toast({
      title: "Timer Reset",
      description: "Timer has been reset.",
    });
  };

  // Legacy timer methods
  useEffect(() => {
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
      Object.values(activeTimers).forEach(timer => {
        if (timer.intervalId) {
          clearInterval(timer.intervalId);
        }
      });
    };
  }, [intervalId, activeTimers]);

  const startTimer = () => {
    if (!project || !task) {
      toast({
        title: "Selection Required",
        description: "Please select a project and task before starting the timer.",
        variant: "destructive",
      });
      return;
    }

    if (intervalId) {
      clearInterval(intervalId);
    }
    
    const id = window.setInterval(() => {
      setTimer(prev => prev + 1);
    }, 1000);
    
    setIntervalId(id);
    setIsTracking(true);
    setIsPaused(false);

    toast({
      title: "Timer Started",
      description: `Tracking time for ${project}`,
    });
  };

  const pauseTimer = () => {
    if (intervalId) {
      clearInterval(intervalId);
      setIntervalId(null);
    }
    setIsPaused(true);
    setIsTracking(false);

    toast({
      title: "Timer Paused",
      description: "You can continue or reset the timer.",
    });
  };

  const continueTimer = () => {
    if (intervalId) {
      clearInterval(intervalId);
    }
    
    const id = window.setInterval(() => {
      setTimer(prev => prev + 1);
    }, 1000);
    
    setIntervalId(id);
    setIsTracking(true);
    setIsPaused(false);

    toast({
      title: "Timer Continued",
      description: "Time tracking resumed.",
    });
  };

  const stopTimer = () => {
    if (intervalId) {
      clearInterval(intervalId);
      setIntervalId(null);
    }
    setIsTracking(false);
    setIsPaused(false);

    toast({
      title: "Timer Stopped",
      description: "Ready to save your time log.",
    });
  };

  const resetTimer = () => {
    if (intervalId) {
      clearInterval(intervalId);
      setIntervalId(null);
    }
    setTimer(0);
    setIsTracking(false);
    setIsPaused(false);

    toast({
      title: "Timer Reset",
      description: "Timer has been reset to 00:00:00.",
    });
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (timer === 0) {
      toast({
        title: "No Time Logged",
        description: "Please track some time before saving.",
        variant: "destructive",
      });
      return;
    }

    const log = {
      id: Date.now().toString(),
      userId: user?.id || 'demo-user',
      date: date.toISOString().split('T')[0],
      project,
      task,
      description,
      seconds: timer,
      hours: Number((timer / 3600).toFixed(2)),
      billable: isBillable,
      createdAt: new Date().toISOString(),
    };
    const existing = readDemoData<any[]>('time-logs', []);
    writeDemoData('time-logs', [log, ...existing]);

    toast({
      title: "Time Log Saved",
      description: `${formatTime(timer)} logged for ${project || 'unassigned project'}`,
    });
    
    resetTimer();
    setProject("");
    setTask("");
    setProjectInput("");
    setTaskInput("");
    setDescription("");
  };

  const handleProjectSelect = (projectName: string) => {
    console.log("Project selected:", projectName);
    if (validateProject(projectName)) {
      setProject(projectName);
      setProjectInput(projectName);
      setShowProjectDropdown(false);
      setTask("");
      setTaskInput("");
      
      toast({
        title: "Project Selected",
        description: `Selected: ${projectName}`,
      });
    }
  };

  const handleTaskSelect = (taskName: string) => {
    console.log("Task selected:", taskName);
    if (validateTask(taskName)) {
      setTask(taskName);
      setTaskInput(taskName);
      setShowTaskDropdown(false);
      
      toast({
        title: "Task Selected",
        description: `Selected: ${taskName}`,
      });
    }
  };

  const handleAddProject = (newProject: any) => {
    const projectWithDefaults = {
      ...newProject,
      id: Date.now().toString(),
      createdBy: user?.id || 'current-user',
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    };
    
    setProjects(prev => [...prev, projectWithDefaults]);
    setShowProjectDialog(false);
    
    toast({
      title: "Project Created",
      description: `${newProject.name} has been created and assigned successfully.`,
      action: (
        <div className="flex items-center gap-2">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <span className="text-sm">Ready to use</span>
        </div>
      ),
    });
  };

  const handleAddTask = (newTask: any) => {
    const taskWithDefaults = {
      ...newTask,
      id: Date.now().toString(),
      assignedTo: "individual",
      status: "active"
    };
    
    setTasks(prev => [...prev, taskWithDefaults]);
    
    toast({
      title: "Task Created",
      description: `${newTask.name} has been added to the project.`,
      action: (
        <div className="flex items-center gap-2">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <span className="text-sm">Available for tracking</span>
        </div>
      ),
    });
  };

  return (
    <div className="p-2 space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <h2 className="text-xl font-semibold">Time Tracker</h2>
        {canManageProjects && (
          <Dialog open={showProjectDialog} onOpenChange={setShowProjectDialog}>
            <DialogTrigger asChild>
              <Button className="bg-primary hover:bg-primary-600 text-white">
                <Plus className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Add Project/Task</span>
                <span className="sm:hidden">Add</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create & Assign Projects & Tasks</DialogTitle>
              </DialogHeader>
              <ProjectTaskManager 
                projects={projects}
                tasks={tasks}
                onAddProject={handleAddProject}
                onAddTask={handleAddTask}
              />
            </DialogContent>
          </Dialog>
        )}
      </div>

      <ActiveTimers
        activeTimers={activeTimers}
        projects={projects}
        tasks={tasks}
        onStartTimer={startTaskTimer}
        onPauseTimer={pauseTaskTimer}
        onResetTimer={resetTaskTimer}
        formatTime={formatTime}
      />

      <form onSubmit={handleSubmit} className="space-y-4">
        <ProjectTaskSelector
          project={project}
          task={task}
          projectInput={projectInput}
          taskInput={taskInput}
          showProjectDropdown={showProjectDropdown}
          showTaskDropdown={showTaskDropdown}
          projectValidation={projectValidation}
          taskValidation={taskValidation}
          projects={projects}
          tasks={tasks}
          onProjectInputChange={(value) => {
            console.log("Project input changed:", value);
            setProjectInput(value);
          }}
          onTaskInputChange={(value) => {
            console.log("Task input changed:", value);
            setTaskInput(value);
          }}
          onProjectSelect={handleProjectSelect}
          onTaskSelect={handleTaskSelect}
          onProjectDropdownChange={setShowProjectDropdown}
          onTaskDropdownChange={setShowTaskDropdown}
          onStartTaskTimer={startTaskTimer}
          getProjectTasks={getProjectTasks}
        />

        <TimerForm
          date={date}
          description={description}
          isBillable={isBillable}
          timer={timer}
          projectValidation={projectValidation}
          taskValidation={taskValidation}
          onDateChange={(newDate) => newDate && setDate(newDate)}
          onDescriptionChange={setDescription}
          onBillableChange={setIsBillable}
          onSubmit={handleSubmit}
        />

        <TimerControls
          timer={timer}
          isTracking={isTracking}
          isPaused={isPaused}
          onStart={startTimer}
          onPause={pauseTimer}
          onContinue={continueTimer}
          onStop={stopTimer}
          onReset={resetTimer}
          formatTime={formatTime}
        />
      </form>
    </div>
  );
};

export default TimeTracker;
