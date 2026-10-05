import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, AlertCircle, Play, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface Project {
  id: string;
  name: string;
  department: string;
  dueDate: string;
}

interface Task {
  id: string;
  name: string;
  projectId: string;
  estimatedHours: number;
}

interface ValidationState {
  isValid: boolean;
  message: string;
}

interface ProjectTaskSelectorProps {
  project: string;
  task: string;
  projectInput: string;
  taskInput: string;
  showProjectDropdown: boolean;
  showTaskDropdown: boolean;
  projectValidation: ValidationState;
  taskValidation: ValidationState;
  projects: Project[];
  tasks: Task[];
  onProjectInputChange: (value: string) => void;
  onTaskInputChange: (value: string) => void;
  onProjectSelect: (projectName: string) => void;
  onTaskSelect: (taskName: string) => void;
  onProjectDropdownChange: (open: boolean) => void;
  onTaskDropdownChange: (open: boolean) => void;
  onStartTaskTimer: (taskId: string) => void;
  getProjectTasks: (projectName: string) => Task[];
}

export const ProjectTaskSelector: React.FC<ProjectTaskSelectorProps> = ({
  project,
  task,
  projectInput,
  taskInput,
  showProjectDropdown,
  showTaskDropdown,
  projectValidation,
  taskValidation,
  projects = [],
  tasks = [],
  onProjectInputChange,
  onTaskInputChange,
  onProjectSelect,
  onTaskSelect,
  onProjectDropdownChange,
  onTaskDropdownChange,
  onStartTaskTimer,
  getProjectTasks,
}) => {
  const projectDropdownRef = useRef<HTMLDivElement>(null);
  const taskDropdownRef = useRef<HTMLDivElement>(null);

  const safeProjects = Array.isArray(projects) ? projects : [];
  const filteredProjects = safeProjects.filter(p => 
    p && p.name && p.name.toLowerCase().includes((projectInput || '').toLowerCase())
  );

  const projectTasks = project ? getProjectTasks(project) : [];
  const safeProjectTasks = Array.isArray(projectTasks) ? projectTasks : [];
  const filteredTasks = safeProjectTasks.filter(t => 
    t && t.name && t.name.toLowerCase().includes((taskInput || '').toLowerCase())
  );

  const isNewProject = projectInput && !safeProjects.some(p => p.name.toLowerCase() === projectInput.toLowerCase());
  const isNewTask = taskInput && !safeProjectTasks.some(t => t.name.toLowerCase() === taskInput.toLowerCase());

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (projectDropdownRef.current && !projectDropdownRef.current.contains(event.target as Node)) {
        onProjectDropdownChange(false);
      }
      if (taskDropdownRef.current && !taskDropdownRef.current.contains(event.target as Node)) {
        onTaskDropdownChange(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onProjectDropdownChange, onTaskDropdownChange]);

  const handleProjectInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    onProjectInputChange(value);
    if (!showProjectDropdown) {
      onProjectDropdownChange(true);
    }
  };

  const handleTaskInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    onTaskInputChange(value);
    if (!showTaskDropdown && project) {
      onTaskDropdownChange(true);
    }
  };

  const handleProjectSelect = (projectName: string) => {
    onProjectSelect(projectName);
    onProjectDropdownChange(false);
  };

  const handleTaskSelect = (taskName: string) => {
    onTaskSelect(taskName);
    onTaskDropdownChange(false);
  };

  const handleCreateProject = () => {
    if (projectInput && projectInput.trim() && projectValidation.isValid) {
      handleProjectSelect(projectInput.trim());
    }
  };

  const handleCreateTask = () => {
    if (taskInput && taskInput.trim() && taskValidation.isValid) {
      handleTaskSelect(taskInput.trim());
    }
  };

  const handleProjectKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && projectInput && projectInput.trim() && projectValidation.isValid) {
      e.preventDefault();
      handleCreateProject();
    } else if (e.key === 'Escape') {
      onProjectDropdownChange(false);
    }
  };

  const handleTaskKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && taskInput && taskInput.trim() && taskValidation.isValid) {
      e.preventDefault();
      handleCreateTask();
    } else if (e.key === 'Escape') {
      onTaskDropdownChange(false);
    }
  };

  return (
    <>
      {/* Project Selector */}
      <div className="space-y-2">
        <Label htmlFor="project">Project *</Label>
        <div className="relative" ref={projectDropdownRef}>
          <div className="relative">
            <Input
              id="project"
              type="text"
              value={project || projectInput}
              onChange={handleProjectInputChange}
              onKeyDown={handleProjectKeyDown}
              onFocus={() => onProjectDropdownChange(true)}
              placeholder="Type to create new or search existing projects..."
              className={cn(
                "pr-10",
                !projectValidation.isValid && "border-red-500"
              )}
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-1 top-1 h-8 w-8 p-0"
              onClick={() => onProjectDropdownChange(!showProjectDropdown)}
            >
              <ChevronDown className={cn("h-4 w-4 transition-transform", showProjectDropdown && "rotate-180")} />
            </Button>
          </div>

          {/* Project Dropdown */}
          {showProjectDropdown && (
            <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-80 overflow-y-auto">
              {/* Create New Section */}
              {projectInput && projectInput.trim() && isNewProject && projectValidation.isValid && (
                <div className="bg-blue-50 border-b border-blue-100">
                  <div className="px-3 py-2 text-xs font-medium text-blue-600 uppercase tracking-wide">
                    Create New
                  </div>
                  <button
                    type="button"
                    onClick={handleCreateProject}
                    className="w-full px-3 py-3 text-left hover:bg-blue-100 border-b border-blue-100 last:border-b-0"
                  >
                    <div className="flex items-center">
                      <Plus className="h-4 w-4 mr-3 text-blue-600" />
                      <div className="flex flex-col">
                        <span className="font-medium text-gray-900">Create "{projectInput}"</span>
                        <span className="text-xs text-gray-500">Press Enter to create</span>
                      </div>
                    </div>
                  </button>
                </div>
              )}

              {/* Existing Projects Section */}
              {filteredProjects.length > 0 && (
                <div className="bg-white">
                  <div className="px-3 py-2 text-xs font-medium text-gray-500 uppercase tracking-wide border-b border-gray-100">
                    Existing Projects ({filteredProjects.length})
                  </div>
                  {filteredProjects.map((proj) => (
                    <button
                      key={proj.id}
                      type="button"
                      onClick={() => handleProjectSelect(proj.name)}
                      className="w-full px-3 py-3 text-left hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                    >
                      <div className="flex flex-col">
                        <span className="font-medium text-gray-900">{proj.name}</span>
                        <span className="text-xs text-gray-500">
                          {proj.department} • Due: {proj.dueDate}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {/* Empty State */}
              {!projectInput && (
                <div className="px-3 py-6 text-center text-sm text-gray-500">
                  Start typing to create a new project or search existing ones
                </div>
              )}

              {projectInput && filteredProjects.length === 0 && !isNewProject && (
                <div className="px-3 py-6 text-center text-sm text-gray-500">
                  No matching projects found
                </div>
              )}
            </div>
          )}
        </div>
        {!projectValidation.isValid && (
          <div className="flex items-center gap-1 text-sm text-red-600">
            <AlertCircle className="h-4 w-4" />
            {projectValidation.message}
          </div>
        )}
      </div>

      {/* Task Selector */}
      <div className="space-y-2">
        <Label htmlFor="task">Task *</Label>
        <div className="relative" ref={taskDropdownRef}>
          <div className="relative">
            <Input
              id="task"
              type="text"
              value={task || taskInput}
              onChange={handleTaskInputChange}
              onKeyDown={handleTaskKeyDown}
              onFocus={() => project && onTaskDropdownChange(true)}
              placeholder={project ? "Type to create new or search existing tasks..." : "Select a project first"}
              disabled={!project}
              className={cn(
                "pr-10",
                !project && "opacity-50 cursor-not-allowed",
                !taskValidation.isValid && "border-red-500"
              )}
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-1 top-1 h-8 w-8 p-0"
              onClick={() => project && onTaskDropdownChange(!showTaskDropdown)}
              disabled={!project}
            >
              <ChevronDown className={cn("h-4 w-4 transition-transform", showTaskDropdown && "rotate-180")} />
            </Button>
          </div>

          {/* Task Dropdown */}
          {showTaskDropdown && project && (
            <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-80 overflow-y-auto">
              {/* Create New Section */}
              {taskInput && taskInput.trim() && isNewTask && taskValidation.isValid && (
                <div className="bg-green-50 border-b border-green-100">
                  <div className="px-3 py-2 text-xs font-medium text-green-600 uppercase tracking-wide">
                    Create New
                  </div>
                  <button
                    type="button"
                    onClick={handleCreateTask}
                    className="w-full px-3 py-3 text-left hover:bg-green-100 border-b border-green-100 last:border-b-0"
                  >
                    <div className="flex items-center">
                      <Plus className="h-4 w-4 mr-3 text-green-600" />
                      <div className="flex flex-col">
                        <span className="font-medium text-gray-900">Create "{taskInput}"</span>
                        <span className="text-xs text-gray-500">Press Enter to create</span>
                      </div>
                    </div>
                  </button>
                </div>
              )}

              {/* Existing Tasks Section */}
              {filteredTasks.length > 0 && (
                <div className="bg-white">
                  <div className="px-3 py-2 text-xs font-medium text-gray-500 uppercase tracking-wide border-b border-gray-100">
                    Existing Tasks ({filteredTasks.length})
                  </div>
                  {filteredTasks.map((taskItem) => (
                    <button
                      key={taskItem.id}
                      type="button"
                      onClick={() => handleTaskSelect(taskItem.name)}
                      className="w-full px-3 py-3 text-left hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                    >
                      <div className="flex flex-col">
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-gray-900">{taskItem.name}</span>
                          <Button
                            type="button"
                            size="sm"
                            variant="ghost"
                            className="h-6 px-2 text-xs hover:bg-gray-200 text-gray-700 ml-2"
                            onClick={(e) => {
                              e.stopPropagation();
                              onStartTaskTimer(taskItem.id);
                            }}
                          >
                            <Play className="h-3 w-3 mr-1" />
                            Start Timer
                          </Button>
                        </div>
                        <span className="text-xs text-gray-500">
                          {taskItem.estimatedHours}h estimated
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {/* Empty State */}
              {!taskInput && (
                <div className="px-3 py-6 text-center text-sm text-gray-500">
                  Start typing to create a new task or search existing ones
                </div>
              )}

              {taskInput && filteredTasks.length === 0 && !isNewTask && (
                <div className="px-3 py-6 text-center text-sm text-gray-500">
                  No matching tasks found
                </div>
              )}
            </div>
          )}
        </div>
        {!taskValidation.isValid && (
          <div className="flex items-center gap-1 text-sm text-red-600">
            <AlertCircle className="h-4 w-4" />
            {taskValidation.message}
          </div>
        )}
      </div>
    </>
  );
};
