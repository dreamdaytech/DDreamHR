
import { useParams } from 'react-router-dom';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TabsContent, Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  User, 
  Phone, 
  Mail, 
  Calendar, 
  MapPin, 
  Building, 
  DollarSign,
  FileText,
  Clock,
  ChevronLeft,
  Briefcase,
  GraduationCap,
  Shield,
  Edit,
  Download
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Separator } from '@/components/ui/separator';

type EmployeeDetail = {
  id: number;
  name: string;
  email: string;
  phone: string;
  birthdate: string;
  gender: string;
  address: string;
  department: string;
  position: string;
  location: string;
  status: 'Active' | 'Inactive' | 'On Leave' | 'Onboarding' | 'Probation' | 'Terminated';
  joiningDate: string;
  employmentType: string;
  salary: string;
  manager: string;
  imageUrl?: string;
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
  };
  documents: Array<{
    id: number;
    name: string;
    type: string;
    dateUploaded: string;
  }>;
  education: Array<{
    id: number;
    degree: string;
    institution: string;
    year: string;
    grade?: string;
  }>;
  skills: Array<{
    id: number;
    name: string;
    level: string;
    category: string;
  }>;
  leaveHistory: Array<{
    id: number;
    type: string;
    startDate: string;
    endDate: string;
    status: string;
    days: number;
  }>;
  timeEntries: Array<{
    id: number;
    date: string;
    clockIn: string;
    clockOut: string;
    totalHours: number;
  }>;
};

const EmployeeProfile = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Mock employee data
  const employee: EmployeeDetail = {
    id: 1,
    name: 'John Doe',
    email: 'john.doe@dreamdayhr.com',
    phone: '+1 (555) 123-4567',
    birthdate: 'June 15, 1985',
    gender: 'Male',
    address: '123 Main Street, San Francisco, CA 94105, USA',
    department: 'Engineering',
    position: 'Senior Frontend Developer',
    location: 'San Francisco, CA',
    status: 'Active',
    joiningDate: 'March 15, 2020',
    employmentType: 'Full Time',
    salary: '$95,000',
    manager: 'Jane Wilson',
    imageUrl: '/placeholder.svg',
    emergencyContact: {
      name: 'Sarah Doe',
      relationship: 'Spouse',
      phone: '+1 (555) 987-6543',
    },
    documents: [
      { id: 1, name: 'resume.pdf', type: 'PDF', dateUploaded: '2020-03-15' },
      { id: 2, name: 'contract.pdf', type: 'PDF', dateUploaded: '2020-03-15' },
      { id: 3, name: 'id.pdf', type: 'PDF', dateUploaded: '2020-03-15' },
    ],
    education: [
      { id: 1, degree: 'Bachelor of Computer Science', institution: 'University of California, Berkeley', year: '2007', grade: 'First Class' },
      { id: 2, degree: 'Master of Software Engineering', institution: 'Stanford University', year: '2009', grade: 'Distinction' },
    ],
    skills: [
      { id: 1, name: 'React', level: 'Expert', category: 'Frontend' },
      { id: 2, name: 'TypeScript', level: 'Advanced', category: 'Programming' },
      { id: 3, name: 'Node.js', level: 'Intermediate', category: 'Backend' },
      { id: 4, name: 'UI/UX Design', level: 'Intermediate', category: 'Design' },
    ],
    leaveHistory: [
      { id: 1, type: 'Annual Leave', startDate: '2024-01-15', endDate: '2024-01-19', status: 'Approved', days: 5 },
      { id: 2, type: 'Sick Leave', startDate: '2024-03-12', endDate: '2024-03-14', status: 'Approved', days: 3 },
      { id: 3, type: 'Personal Leave', startDate: '2024-06-20', endDate: '2024-06-21', status: 'Pending', days: 2 },
    ],
    timeEntries: [
      { id: 1, date: '2024-11-25', clockIn: '09:00 AM', clockOut: '05:30 PM', totalHours: 8.5 },
      { id: 2, date: '2024-11-24', clockIn: '08:45 AM', clockOut: '05:15 PM', totalHours: 8.5 },
      { id: 3, date: '2024-11-23', clockIn: '09:05 AM', clockOut: '05:45 PM', totalHours: 8.67 },
    ],
  };

  const getStatusColor = (status: EmployeeDetail['status']) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800';
      case 'Inactive':
        return 'bg-gray-100 text-gray-800';
      case 'On Leave':
        return 'bg-orange-100 text-orange-800';
      case 'Onboarding':
        return 'bg-yellow-100 text-yellow-800';
      case 'Probation':
        return 'bg-blue-100 text-blue-800';
      case 'Terminated':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getSkillLevelColor = (level: string) => {
    switch (level) {
      case 'Expert':
        return 'bg-green-100 text-green-800';
      case 'Advanced':
        return 'bg-blue-100 text-blue-800';
      case 'Intermediate':
        return 'bg-yellow-100 text-yellow-800';
      case 'Beginner':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={() => navigate('/employees')}>
          <ChevronLeft className="h-4 w-4 mr-2" /> Back to Directory
        </Button>
        <h1 className="text-2xl font-bold tracking-tight">Employee Details</h1>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Employee Profile Card */}
        <div className="lg:col-span-1">
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center space-y-4">
                <Avatar className="h-32 w-32">
                  <AvatarImage src={employee.imageUrl} alt={employee.name} />
                  <AvatarFallback className="text-3xl">{employee.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-2xl font-bold">{employee.name}</h2>
                  <p className="text-muted-foreground text-lg">{employee.position}</p>
                  <Badge variant="outline" className={`mt-3 ${getStatusColor(employee.status)}`}>
                    {employee.status}
                  </Badge>
                  <p className="text-sm text-muted-foreground mt-2">ID: {employee.id}</p>
                </div>
              </div>
              
              <Separator className="my-6" />
              
              {/* Contact Information */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Contact Information</h3>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <Mail className="h-4 w-4 mr-3 text-muted-foreground" />
                    <span className="text-sm">{employee.email}</span>
                  </div>
                  <div className="flex items-center">
                    <Phone className="h-4 w-4 mr-3 text-muted-foreground" />
                    <span className="text-sm">{employee.phone}</span>
                  </div>
                  <div className="flex items-start">
                    <MapPin className="h-4 w-4 mr-3 mt-0.5 text-muted-foreground" />
                    <span className="text-sm">{employee.address}</span>
                  </div>
                </div>
              </div>
              
              <Separator className="my-6" />
              
              {/* Personal Information */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Personal Information</h3>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-3 text-muted-foreground" />
                    <span className="text-sm">Date of Birth: {employee.birthdate}</span>
                  </div>
                  <div className="flex items-center">
                    <User className="h-4 w-4 mr-3 text-muted-foreground" />
                    <span className="text-sm">Gender: {employee.gender}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Employment Details & Tabs */}
        <div className="lg:col-span-2 space-y-6">
          {/* Employment Details Card */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="text-lg">Employment Details</CardTitle>
                  <CardDescription>Details about the employee's position and department</CardDescription>
                </div>
                <Button variant="outline" size="sm">
                  <Edit className="mr-2 h-4 w-4" /> Edit
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-muted-foreground">Department</p>
                    <p className="font-medium">{employee.department}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Position</p>
                    <p className="font-medium">{employee.position}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Employment Type</p>
                    <p className="font-medium">{employee.employmentType}</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-muted-foreground">Start Date</p>
                    <p className="font-medium">{employee.joiningDate}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Manager</p>
                    <p className="font-medium">{employee.manager}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Salary</p>
                    <p className="font-medium">{employee.salary}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tabs for additional sections */}
          <Tabs defaultValue="documents" className="w-full">
            <TabsList className="grid grid-cols-4 w-full">
              <TabsTrigger value="documents" className="text-xs">
                <FileText className="mr-1 h-3 w-3" />
                Documents
              </TabsTrigger>
              <TabsTrigger value="education" className="text-xs">
                <GraduationCap className="mr-1 h-3 w-3" />
                Education
              </TabsTrigger>
              <TabsTrigger value="skills" className="text-xs">
                <Briefcase className="mr-1 h-3 w-3" />
                Skills
              </TabsTrigger>
              <TabsTrigger value="emergency" className="text-xs">
                <Shield className="mr-1 h-3 w-3" />
                Emergency
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="documents">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle className="text-lg">Documents</CardTitle>
                      <CardDescription>Employee's uploaded documents and files</CardDescription>
                    </div>
                    <Button variant="outline" size="sm">
                      <FileText className="mr-2 h-4 w-4" /> Upload Document
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {employee.documents.map(doc => (
                      <div key={doc.id} className="flex justify-between items-center p-3 border rounded-lg hover:bg-muted/50">
                        <div className="flex items-center">
                          <FileText className="h-4 w-4 mr-3 text-muted-foreground" />
                          <div>
                            <p className="font-medium text-sm">{doc.name}</p>
                            <p className="text-xs text-muted-foreground">Uploaded: {doc.dateUploaded}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline" className="text-xs">{doc.type}</Badge>
                          <Button variant="ghost" size="sm">
                            <Download className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="education">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle className="text-lg">Education</CardTitle>
                      <CardDescription>Educational background and qualifications</CardDescription>
                    </div>
                    <Button variant="outline" size="sm">
                      <GraduationCap className="mr-2 h-4 w-4" /> Add Education
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {employee.education.map(edu => (
                      <div key={edu.id} className="p-4 border rounded-lg hover:bg-muted/50">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium">{edu.degree}</h4>
                            <p className="text-sm text-muted-foreground">{edu.institution}</p>
                            <p className="text-xs text-muted-foreground mt-1">Graduated: {edu.year}</p>
                          </div>
                          {edu.grade && (
                            <Badge variant="outline" className="text-xs">{edu.grade}</Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="skills">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle className="text-lg">Skills</CardTitle>
                      <CardDescription>Technical and professional skills</CardDescription>
                    </div>
                    <Button variant="outline" size="sm">
                      <Briefcase className="mr-2 h-4 w-4" /> Add Skill
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {employee.skills.map(skill => (
                      <div key={skill.id} className="p-3 border rounded-lg hover:bg-muted/50">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-medium text-sm">{skill.name}</p>
                            <p className="text-xs text-muted-foreground">{skill.category}</p>
                          </div>
                          <Badge variant="outline" className={`text-xs ${getSkillLevelColor(skill.level)}`}>
                            {skill.level}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="emergency">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle className="text-lg">Emergency Contact</CardTitle>
                      <CardDescription>Emergency contact information</CardDescription>
                    </div>
                    <Button variant="outline" size="sm">
                      <Edit className="mr-2 h-4 w-4" /> Edit Contact
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-medium">{employee.emergencyContact.name}</h4>
                      <p className="text-sm text-muted-foreground">{employee.emergencyContact.relationship}</p>
                      <div className="flex items-center mt-2">
                        <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span className="text-sm">{employee.emergencyContact.phone}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default EmployeeProfile;
