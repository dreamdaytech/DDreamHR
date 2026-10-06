
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Calendar } from 'lucide-react';
import { isDemoSession, readDemoData, writeDemoData } from '@/lib/demoStore';
import { createTenantEmployee } from '@/services/tenantPeople';
import { sendEmployeeInvitation, type EmployeeAccessRole } from '@/services/tenantInvitations';

const formSchema = z.object({
  employeeId: z.string().min(1, { message: 'Employee ID is required' }),
  firstName: z.string().min(1, { message: 'First name is required' }),
  lastName: z.string().min(1, { message: 'Last name is required' }),
  nickname: z.string().optional(),
  email: z.string().email({ message: 'Invalid email address' }),
  
  // Work Information
  department: z.string().min(1, { message: 'Department is required' }),
  location: z.string().min(1, { message: 'Location is required' }),
  designation: z.string().min(1, { message: 'Designation is required' }),
  role: z.string().min(1, { message: 'Role is required' }),
  employmentType: z.string().min(1, { message: 'Employment type is required' }),
  status: z.string().min(1, { message: 'Status is required' }),
  sourceOfHire: z.string().min(1, { message: 'Source of hire is required' }),
  dateOfJoining: z.string().optional(),
  currentExperience: z.string().optional(),
  totalExperience: z.string().optional(),
  
  // Hierarchy Information
  reportingManager: z.string().optional(),
  
  // Personal Details
  dateOfBirth: z.string().optional(),
  age: z.string().optional(),
  gender: z.string().optional(),
  maritalStatus: z.string().optional(),
  aboutMe: z.string().optional(),
  expertise: z.string().optional(),
  
  // Contact Details
  workPhone: z.string().optional(),
  extension: z.string().optional(),
  seatingLocation: z.string().optional(),
  tags: z.string().optional(),
  
  // Present Address
  presentAddressLine1: z.string().optional(),
  presentAddressLine2: z.string().optional(),
  presentCity: z.string().optional(),
  presentCountry: z.string().optional(),
  presentState: z.string().optional(),
  presentPostalCode: z.string().optional(),
  
  // Permanent Address
  sameAsPresent: z.boolean().default(false),
  permanentAddressLine1: z.string().optional(),
  permanentAddressLine2: z.string().optional(),
  permanentCity: z.string().optional(),
  permanentCountry: z.string().optional(),
  permanentState: z.string().optional(),
  permanentPostalCode: z.string().optional(),
  
  // Additional Contact
  personalMobile: z.string().optional(),
  personalEmail: z.string().optional(),
  
  // Separation Information
  dateOfExit: z.string().optional(),
});

type WorkExperience = {
  id: string;
  companyName: string;
  jobTitle: string;
  fromDate: string;
  toDate: string;
  jobDescription: string;
};

type Education = {
  id: string;
  instituteName: string;
  degree: string;
  specialization: string;
  completionDate: string;
};

type Dependent = {
  id: string;
  name: string;
  relationship: string;
  dateOfBirth: string;
};

const EmployeeForm = ({ onSaved, onCancel }: { onSaved?: () => void; onCancel?: () => void }) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [workExperiences, setWorkExperiences] = useState<WorkExperience[]>([]);
  const [educations, setEducations] = useState<Education[]>([]);
  const [dependents, setDependents] = useState<Dependent[]>([]);
  const [sendInvitation, setSendInvitation] = useState(true);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      sameAsPresent: false,
      employmentType: 'Permanent',
      status: 'Active',
      role: 'Employee',
    },
  });

  const steps = [
    'Basic Information', 
    'Work Information', 
    'Hierarchy Information', 
    'Personal Details', 
    'Contact Details', 
    'Additional Details'
  ];

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      if (isDemoSession()) {
        const existing = readDemoData<any[]>('employees', []);
        const numericId = Date.now();
        const employee = {
          id: numericId,
          name: `${values.firstName} ${values.lastName}`.trim(),
          email: values.email,
          phone: values.workPhone || values.personalMobile || '',
          department: values.department,
          position: values.designation,
          location: values.location,
          status: values.status,
          imageUrl: '/placeholder.svg',
          joiningDate: values.dateOfJoining || new Date().toISOString().split('T')[0],
          employeeId: values.employeeId,
          employmentType: values.employmentType,
          reportingManager: values.reportingManager || '',
          workExperiences,
          educations,
          dependents,
        };
        writeDemoData('employees', [employee, ...existing]);
      } else {
        const createdEmployee = await createTenantEmployee(values, { workExperiences, educations, dependents });

        if (sendInvitation) {
          const roleMap: Record<string, EmployeeAccessRole> = {
            Admin: 'admin',
            HR: 'hr',
            Manager: 'manager',
            Employee: 'employee',
          };
          const accessRole = roleMap[values.role] || 'employee';

          try {
            const invitation = await sendEmployeeInvitation(createdEmployee.id, accessRole);
            if (invitation.delivery_status === 'link_only') {
              await navigator.clipboard?.writeText(invitation.invite_url);
              toast({
                title: 'Employee added — invitation link copied',
                description: 'Email delivery was unavailable, so the secure invitation link was copied to your clipboard.',
              });
            } else {
              toast({
                title: 'Employee added and invited',
                description: `${values.firstName} ${values.lastName} can join DDreamHR from the invitation email.`,
              });
            }
          } catch (inviteError) {
            toast({
              title: 'Employee added, invitation needs attention',
              description: inviteError instanceof Error
                ? inviteError.message
                : 'The employee record was created, but the invitation could not be sent.',
              variant: 'destructive',
            });
          }
        } else {
          toast({
            title: 'Employee record created',
            description: `${values.firstName} ${values.lastName} was added without login access.`,
          });
        }
      }

      if (isDemoSession()) {
        toast({
          title: "Employee added successfully",
          description: `${values.firstName} ${values.lastName} has been added to DDreamHR.`,
        });
      }

      if (onSaved) onSaved();
      else navigate('/employees?view=directory');
    } catch (error) {
      toast({
        title: "Could not add employee",
        description: error instanceof Error ? error.message : "Please try again.",
        variant: "destructive",
      });
    }
  };
  
  const addWorkExperience = () => {
    setWorkExperiences([
      ...workExperiences,
      {
        id: `exp-${workExperiences.length + 1}`,
        companyName: '',
        jobTitle: '',
        fromDate: '',
        toDate: '',
        jobDescription: ''
      }
    ]);
  };
  
  const addEducation = () => {
    setEducations([
      ...educations,
      {
        id: `edu-${educations.length + 1}`,
        instituteName: '',
        degree: '',
        specialization: '',
        completionDate: ''
      }
    ]);
  };
  
  const addDependent = () => {
    setDependents([
      ...dependents,
      {
        id: `dep-${dependents.length + 1}`,
        name: '',
        relationship: '',
        dateOfBirth: ''
      }
    ]);
  };
  
  const updateWorkExperience = (id: string, field: string, value: string) => {
    setWorkExperiences(workExperiences.map(exp => 
      exp.id === id ? { ...exp, [field]: value } : exp
    ));
  };
  
  const updateEducation = (id: string, field: string, value: string) => {
    setEducations(educations.map(edu => 
      edu.id === id ? { ...edu, [field]: value } : edu
    ));
  };
  
  const updateDependent = (id: string, field: string, value: string) => {
    setDependents(dependents.map(dep => 
      dep.id === id ? { ...dep, [field]: value } : dep
    ));
  };

  const nextStep = () => {
    setActiveStep((prev) => Math.min(prev + 1, steps.length - 1));
  };

  const prevStep = () => {
    setActiveStep((prev) => Math.max(prev - 1, 0));
  };

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight">Add Employee</h1>
        <Button variant="ghost" onClick={() => onCancel ? onCancel() : navigate('/employees?view=directory')}>
          Cancel
        </Button>
      </div>
      
      <div className="flex justify-between mb-8">
        {steps.map((step, index) => (
          <div 
            key={index} 
            className={`flex flex-col items-center ${index > 0 ? 'ml-4' : ''}`}
          >
            <div 
              className={`w-8 h-8 rounded-full flex items-center justify-center 
              ${activeStep === index 
                ? 'bg-primary text-primary-foreground' 
                : activeStep > index 
                  ? 'bg-green-500 text-white' 
                  : 'bg-gray-200 text-gray-500'}`}
            >
              {activeStep > index ? '✓' : index + 1}
            </div>
            <span className="text-xs mt-1">{step}</span>
          </div>
        ))}
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {activeStep === 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="employeeId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Employee ID*</FormLabel>
                        <FormControl>
                          <Input placeholder="Employee ID" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>First Name*</FormLabel>
                        <FormControl>
                          <Input placeholder="First Name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Last Name*</FormLabel>
                        <FormControl>
                          <Input placeholder="Last Name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="nickname"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nickname</FormLabel>
                        <FormControl>
                          <Input placeholder="Nickname" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email Address*</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="Email Address" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>
          )}
          
          {activeStep === 1 && (
            <Card>
              <CardHeader>
                <CardTitle>Work Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="department"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Department*</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select Department" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="IT">IT</SelectItem>
                            <SelectItem value="HR">HR</SelectItem>
                            <SelectItem value="Marketing">Marketing</SelectItem>
                            <SelectItem value="Sales">Sales</SelectItem>
                            <SelectItem value="Finance">Finance</SelectItem>
                            <SelectItem value="Management">Management</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Location*</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select Location" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="New York">New York</SelectItem>
                            <SelectItem value="San Francisco">San Francisco</SelectItem>
                            <SelectItem value="London">London</SelectItem>
                            <SelectItem value="Berlin">Berlin</SelectItem>
                            <SelectItem value="Tokyo">Tokyo</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="designation"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Designation*</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select Designation" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Software Engineer">Software Engineer</SelectItem>
                            <SelectItem value="Senior Developer">Senior Developer</SelectItem>
                            <SelectItem value="Team Lead">Team Lead</SelectItem>
                            <SelectItem value="Manager">Manager</SelectItem>
                            <SelectItem value="Director">Director</SelectItem>
                            <SelectItem value="Administrator">Administrator</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="role"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Zoho Role*</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select Role" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Employee">Employee</SelectItem>
                            <SelectItem value="Manager">Manager</SelectItem>
                            <SelectItem value="HR">HR</SelectItem>
                            <SelectItem value="Admin">Admin</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="employmentType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Employment Type*</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select Employment Type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Permanent">Permanent</SelectItem>
                            <SelectItem value="On Contract">On Contract</SelectItem>
                            <SelectItem value="Temporary">Temporary</SelectItem>
                            <SelectItem value="Trainee">Trainee</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Employee Status*</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select Status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Active">Active</SelectItem>
                            <SelectItem value="Terminated">Terminated</SelectItem>
                            <SelectItem value="Deceased">Deceased</SelectItem>
                            <SelectItem value="Resigned">Resigned</SelectItem>
                            <SelectItem value="Probation">Probation</SelectItem>
                            <SelectItem value="Notice Period">Notice Period</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="sourceOfHire"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Source of Hire*</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select Source" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Direct">Direct</SelectItem>
                            <SelectItem value="Referral">Referral</SelectItem>
                            <SelectItem value="Web">Web</SelectItem>
                            <SelectItem value="Newspaper">Newspaper</SelectItem>
                            <SelectItem value="Advertisement">Advertisement</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="dateOfJoining"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Date of Joining</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input 
                              type="date" 
                              placeholder="Date of Joining" 
                              {...field} 
                              className="pl-10"
                            />
                            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="currentExperience"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Current Experience (Years)</FormLabel>
                        <FormControl>
                          <Input type="text" placeholder="Current Experience" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="totalExperience"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Total Experience (Years)</FormLabel>
                        <FormControl>
                          <Input type="text" placeholder="Total Experience" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>
          )}
          
          {activeStep === 2 && (
            <Card>
              <CardHeader>
                <CardTitle>Hierarchy Information & Work Experience</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="reportingManager"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Reporting Manager</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select Reporting Manager" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="1">John Smith</SelectItem>
                            <SelectItem value="2">Maria Garcia</SelectItem>
                            <SelectItem value="3">Robert Johnson</SelectItem>
                            <SelectItem value="4">Sarah Williams</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium text-lg">Work Experience</h3>
                    <Button type="button" variant="outline" onClick={addWorkExperience}>
                      Add Work Experience
                    </Button>
                  </div>
                  
                  {workExperiences.map((exp, index) => (
                    <div key={exp.id} className="border p-4 rounded-md space-y-4">
                      <h4 className="font-medium">Experience #{index + 1}</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <FormLabel>Company Name</FormLabel>
                          <Input 
                            value={exp.companyName} 
                            onChange={(e) => updateWorkExperience(exp.id, 'companyName', e.target.value)}
                            placeholder="Company Name"
                          />
                        </div>
                        <div>
                          <FormLabel>Job Title</FormLabel>
                          <Input 
                            value={exp.jobTitle} 
                            onChange={(e) => updateWorkExperience(exp.id, 'jobTitle', e.target.value)}
                            placeholder="Job Title"
                          />
                        </div>
                        <div>
                          <FormLabel>From Date</FormLabel>
                          <div className="relative">
                            <Input 
                              type="date" 
                              value={exp.fromDate} 
                              onChange={(e) => updateWorkExperience(exp.id, 'fromDate', e.target.value)}
                              className="pl-10"
                            />
                            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
                          </div>
                        </div>
                        <div>
                          <FormLabel>To Date</FormLabel>
                          <div className="relative">
                            <Input 
                              type="date" 
                              value={exp.toDate} 
                              onChange={(e) => updateWorkExperience(exp.id, 'toDate', e.target.value)}
                              className="pl-10"
                            />
                            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
                          </div>
                        </div>
                      </div>
                      <div>
                        <FormLabel>Job Description</FormLabel>
                        <Input 
                          value={exp.jobDescription} 
                          onChange={(e) => updateWorkExperience(exp.id, 'jobDescription', e.target.value)}
                          placeholder="Job Description"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
          
          {activeStep === 3 && (
            <Card>
              <CardHeader>
                <CardTitle>Personal Details & Education</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="dateOfBirth"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Date of Birth</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input 
                              type="date" 
                              placeholder="Date of Birth" 
                              {...field} 
                              className="pl-10"
                            />
                            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="age"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Age</FormLabel>
                        <FormControl>
                          <Input type="text" placeholder="Age" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="gender"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Gender</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select Gender" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Male">Male</SelectItem>
                            <SelectItem value="Female">Female</SelectItem>
                            <SelectItem value="Other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="maritalStatus"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Marital Status</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select Marital Status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Single">Single</SelectItem>
                            <SelectItem value="Married">Married</SelectItem>
                            <SelectItem value="Divorced">Divorced</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="aboutMe"
                    render={({ field }) => (
                      <FormItem className="col-span-2">
                        <FormLabel>About Me</FormLabel>
                        <FormControl>
                          <Input placeholder="About Me" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="expertise"
                    render={({ field }) => (
                      <FormItem className="col-span-2">
                        <FormLabel>Ask Me About / Expertise</FormLabel>
                        <FormControl>
                          <Input placeholder="Expertise" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium text-lg">Education Details</h3>
                    <Button type="button" variant="outline" onClick={addEducation}>
                      Add Education
                    </Button>
                  </div>
                  
                  {educations.map((edu, index) => (
                    <div key={edu.id} className="border p-4 rounded-md space-y-4">
                      <h4 className="font-medium">Education #{index + 1}</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <FormLabel>Institute Name</FormLabel>
                          <Input 
                            value={edu.instituteName} 
                            onChange={(e) => updateEducation(edu.id, 'instituteName', e.target.value)}
                            placeholder="Institute Name"
                          />
                        </div>
                        <div>
                          <FormLabel>Degree/Diploma</FormLabel>
                          <Input 
                            value={edu.degree} 
                            onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)}
                            placeholder="Degree/Diploma"
                          />
                        </div>
                        <div>
                          <FormLabel>Specialization</FormLabel>
                          <Input 
                            value={edu.specialization} 
                            onChange={(e) => updateEducation(edu.id, 'specialization', e.target.value)}
                            placeholder="Specialization"
                          />
                        </div>
                        <div>
                          <FormLabel>Date of Completion</FormLabel>
                          <div className="relative">
                            <Input 
                              type="date" 
                              value={edu.completionDate} 
                              onChange={(e) => updateEducation(edu.id, 'completionDate', e.target.value)}
                              className="pl-10"
                            />
                            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
          
          {activeStep === 4 && (
            <Card>
              <CardHeader>
                <CardTitle>Contact Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="workPhone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Work Phone Number</FormLabel>
                        <FormControl>
                          <Input placeholder="Work Phone Number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="extension"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Extension</FormLabel>
                        <FormControl>
                          <Input placeholder="Extension" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="seatingLocation"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Seating Location</FormLabel>
                        <FormControl>
                          <Input placeholder="Seating Location" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="tags"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tags</FormLabel>
                        <FormControl>
                          <Input placeholder="Tags (comma separated)" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="personalMobile"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Personal Mobile Number</FormLabel>
                        <FormControl>
                          <Input placeholder="Personal Mobile Number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="personalEmail"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Personal Email Address</FormLabel>
                        <FormControl>
                          <Input placeholder="Personal Email Address" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="space-y-4">
                  <h3 className="font-medium text-lg">Present Address</h3>
                  <div className="grid grid-cols-1 gap-4">
                    <FormField
                      control={form.control}
                      name="presentAddressLine1"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Address Line 1</FormLabel>
                          <FormControl>
                            <Input placeholder="Address Line 1" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="presentAddressLine2"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Address Line 2</FormLabel>
                          <FormControl>
                            <Input placeholder="Address Line 2" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="presentCity"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>City</FormLabel>
                            <FormControl>
                              <Input placeholder="City" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="presentPostalCode"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Postal Code</FormLabel>
                            <FormControl>
                              <Input placeholder="Postal Code" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="presentCountry"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Country</FormLabel>
                            <Select 
                              onValueChange={field.onChange} 
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select Country" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="USA">USA</SelectItem>
                                <SelectItem value="Canada">Canada</SelectItem>
                                <SelectItem value="UK">UK</SelectItem>
                                <SelectItem value="Germany">Germany</SelectItem>
                                <SelectItem value="Japan">Japan</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="presentState"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>State/Province</FormLabel>
                            <Select 
                              onValueChange={field.onChange} 
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select State" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="CA">California</SelectItem>
                                <SelectItem value="NY">New York</SelectItem>
                                <SelectItem value="TX">Texas</SelectItem>
                                <SelectItem value="FL">Florida</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium text-lg">Permanent Address</h3>
                    <FormField
                      control={form.control}
                      name="sameAsPresent"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>Same as Present Address</FormLabel>
                          </div>
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  {!form.watch("sameAsPresent") && (
                    <div className="grid grid-cols-1 gap-4">
                      <FormField
                        control={form.control}
                        name="permanentAddressLine1"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Address Line 1</FormLabel>
                            <FormControl>
                              <Input placeholder="Address Line 1" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="permanentAddressLine2"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Address Line 2</FormLabel>
                            <FormControl>
                              <Input placeholder="Address Line 2" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="permanentCity"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>City</FormLabel>
                              <FormControl>
                                <Input placeholder="City" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="permanentPostalCode"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Postal Code</FormLabel>
                              <FormControl>
                                <Input placeholder="Postal Code" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="permanentCountry"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Country</FormLabel>
                              <Select 
                                onValueChange={field.onChange} 
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select Country" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="USA">USA</SelectItem>
                                  <SelectItem value="Canada">Canada</SelectItem>
                                  <SelectItem value="UK">UK</SelectItem>
                                  <SelectItem value="Germany">Germany</SelectItem>
                                  <SelectItem value="Japan">Japan</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="permanentState"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>State/Province</FormLabel>
                              <Select 
                                onValueChange={field.onChange} 
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select State" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="CA">California</SelectItem>
                                  <SelectItem value="NY">New York</SelectItem>
                                  <SelectItem value="TX">Texas</SelectItem>
                                  <SelectItem value="FL">Florida</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
          
          {activeStep === 5 && (
            <Card>
              <CardHeader>
                <CardTitle>Additional Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="dateOfExit"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Date of Exit</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input 
                              type="date" 
                              placeholder="Date of Exit" 
                              {...field} 
                              className="pl-10"
                            />
                            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium text-lg">Dependent Details</h3>
                    <Button type="button" variant="outline" onClick={addDependent}>
                      Add Dependent
                    </Button>
                  </div>
                  
                  {dependents.map((dep, index) => (
                    <div key={dep.id} className="border p-4 rounded-md space-y-4">
                      <h4 className="font-medium">Dependent #{index + 1}</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <FormLabel>Name</FormLabel>
                          <Input 
                            value={dep.name} 
                            onChange={(e) => updateDependent(dep.id, 'name', e.target.value)}
                            placeholder="Name"
                          />
                        </div>
                        <div>
                          <FormLabel>Relationship</FormLabel>
                          <Select 
                            onValueChange={(value) => updateDependent(dep.id, 'relationship', value)} 
                            value={dep.relationship}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select Relationship" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Spouse">Spouse</SelectItem>
                              <SelectItem value="Child">Child</SelectItem>
                              <SelectItem value="Parent">Parent</SelectItem>
                              <SelectItem value="Sibling">Sibling</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <FormLabel>Date of Birth</FormLabel>
                          <div className="relative">
                            <Input 
                              type="date" 
                              value={dep.dateOfBirth} 
                              onChange={(e) => updateDependent(dep.id, 'dateOfBirth', e.target.value)}
                              className="pl-10"
                            />
                            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
          
          {activeStep === steps.length - 1 && (
            <Card className="border-dashed">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <Checkbox
                    id="send-invitation"
                    checked={sendInvitation}
                    onCheckedChange={(checked) => setSendInvitation(Boolean(checked))}
                  />
                  <div className="space-y-1">
                    <label htmlFor="send-invitation" className="text-sm font-medium leading-none cursor-pointer">
                      Send DDreamHR invitation now
                    </label>
                    <p className="text-sm text-muted-foreground">
                      The employee will receive secure workspace access using the role selected above. Clear this option to create the employee record without a login.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="flex justify-between mt-10">
            <Button
              type="button"
              variant="outline"
              onClick={prevStep}
              disabled={activeStep === 0}
            >
              Previous
            </Button>
            
            {activeStep < steps.length - 1 ? (
              <Button
                type="button"
                onClick={nextStep}
              >
                Next
              </Button>
            ) : (
              <Button type="submit">
                {sendInvitation ? 'Add & Invite Employee' : 'Create Employee Record'}
              </Button>
            )}
          </div>
        </form>
      </Form>
    </div>
  );
};

export default EmployeeForm;
