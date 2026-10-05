
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
  ChevronLeft
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Separator } from '@/components/ui/separator';

// Mock data for a single employee
type EmployeeDetail = {
  id: number;
  name: string;
  email: string;
  phone: string;
  birthdate: string;
  address: string;
  departmentId: number;
  department: string;
  position: string;
  status: 'Active' | 'Inactive' | 'On Leave';
  hireDate: string;
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
  leaveHistory: Array<{
    id: number;
    type: string;
    startDate: string;
    endDate: string;
    status: string;
  }>;
  timeEntries: Array<{
    id: number;
    date: string;
    clockIn: string;
    clockOut: string;
    totalHours: number;
  }>;
};

const EmployeeDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Mock employee data - in a real app, fetch this from API
  const employee: EmployeeDetail = {
    id: 1,
    name: 'John Smith',
    email: 'john.smith@example.com',
    phone: '(555) 123-4567',
    birthdate: '1985-05-15',
    address: '123 Main St, Anytown, CA 12345',
    departmentId: 1,
    department: 'Engineering',
    position: 'Senior Developer',
    status: 'Active',
    hireDate: '2018-03-15',
    salary: '$95,000',
    manager: 'Jane Wilson',
    imageUrl: '/placeholder.svg',
    emergencyContact: {
      name: 'Sarah Smith',
      relationship: 'Spouse',
      phone: '(555) 987-6543',
    },
    documents: [
      { id: 1, name: 'Employment Contract', type: 'PDF', dateUploaded: '2018-03-15' },
      { id: 2, name: 'ID Verification', type: 'PNG', dateUploaded: '2018-03-15' },
      { id: 3, name: 'Tax Forms', type: 'PDF', dateUploaded: '2023-01-10' },
    ],
    leaveHistory: [
      { id: 1, type: 'Vacation', startDate: '2023-01-05', endDate: '2023-01-10', status: 'Approved' },
      { id: 2, type: 'Sick Leave', startDate: '2023-03-12', endDate: '2023-03-14', status: 'Approved' },
      { id: 3, type: 'Personal', startDate: '2023-06-20', endDate: '2023-06-20', status: 'Pending' },
    ],
    timeEntries: [
      { id: 1, date: '2023-05-15', clockIn: '09:00 AM', clockOut: '05:30 PM', totalHours: 8.5 },
      { id: 2, date: '2023-05-16', clockIn: '08:45 AM', clockOut: '05:15 PM', totalHours: 8.5 },
      { id: 3, date: '2023-05-17', clockIn: '09:05 AM', clockOut: '05:45 PM', totalHours: 8.67 },
    ],
  };

  const getStatusColor = (status: EmployeeDetail['status']) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800';
      case 'Inactive':
        return 'bg-gray-100 text-gray-800';
      case 'On Leave':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={() => navigate('/employees')}>
          <ChevronLeft className="h-4 w-4 mr-2" /> Back to list
        </Button>
        <h1 className="text-2xl font-bold tracking-tight">Employee Profile</h1>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Employee Info Card */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center space-y-3">
              <Avatar className="h-24 w-24">
                <AvatarImage src={employee.imageUrl} alt={employee.name} />
                <AvatarFallback className="text-2xl">{employee.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-xl font-bold">{employee.name}</h2>
                <p className="text-muted-foreground">{employee.position}</p>
                <Badge variant="outline" className={`mt-2 ${getStatusColor(employee.status)}`}>
                  {employee.status}
                </Badge>
              </div>
            </div>
            
            <Separator className="my-4" />
            
            <div className="space-y-3">
              <div className="flex items-center">
                <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>{employee.email}</span>
              </div>
              <div className="flex items-center">
                <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>{employee.phone}</span>
              </div>
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>Birth Date: {employee.birthdate}</span>
              </div>
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="truncate">{employee.address}</span>
              </div>
            </div>
            
            <Separator className="my-4" />
            
            <div className="space-y-3">
              <div className="flex items-center">
                <Building className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>Department: {employee.department}</span>
              </div>
              <div className="flex items-center">
                <User className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>Manager: {employee.manager}</span>
              </div>
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>Hire Date: {employee.hireDate}</span>
              </div>
              <div className="flex items-center">
                <DollarSign className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>Salary: {employee.salary}</span>
              </div>
            </div>
            
            <Separator className="my-4" />
            
            <h3 className="font-medium mb-2">Emergency Contact</h3>
            <div className="space-y-2">
              <p>{employee.emergencyContact.name} ({employee.emergencyContact.relationship})</p>
              <div className="flex items-center">
                <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>{employee.emergencyContact.phone}</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Tabs for additional info */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="documents">
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="documents">Documents</TabsTrigger>
              <TabsTrigger value="leave">Leave History</TabsTrigger>
              <TabsTrigger value="time">Time Entries</TabsTrigger>
            </TabsList>
            
            <TabsContent value="documents">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-medium flex items-center">
                    <FileText className="mr-2 h-5 w-5" />
                    Documents
                  </CardTitle>
                  <CardDescription>Employee's uploaded documents and forms</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {employee.documents.map(doc => (
                      <div key={doc.id} className="flex justify-between items-center p-3 border rounded-md hover:bg-muted/50">
                        <div>
                          <p className="font-medium">{doc.name}</p>
                          <p className="text-sm text-muted-foreground">Uploaded: {doc.dateUploaded}</p>
                        </div>
                        <Badge>{doc.type}</Badge>
                      </div>
                    ))}
                    <Button variant="outline" className="w-full">
                      <FileText className="mr-2 h-4 w-4" /> Upload New Document
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="leave">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-medium flex items-center">
                    <Calendar className="mr-2 h-5 w-5" />
                    Leave History
                  </CardTitle>
                  <CardDescription>Employee's leave requests and history</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {employee.leaveHistory.map(leave => (
                      <div key={leave.id} className="p-3 border rounded-md hover:bg-muted/50">
                        <div className="flex justify-between items-center mb-2">
                          <p className="font-medium">{leave.type}</p>
                          <Badge variant={leave.status === 'Approved' ? 'default' : 'outline'}>
                            {leave.status}
                          </Badge>
                        </div>
                        <p className="text-sm">
                          {leave.startDate} to {leave.endDate}
                        </p>
                      </div>
                    ))}
                    <Button variant="outline" className="w-full">
                      <Calendar className="mr-2 h-4 w-4" /> Request Leave
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="time">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-medium flex items-center">
                    <Clock className="mr-2 h-5 w-5" />
                    Time Entries
                  </CardTitle>
                  <CardDescription>Employee's recent time entries</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {employee.timeEntries.map(entry => (
                      <div key={entry.id} className="p-3 border rounded-md hover:bg-muted/50">
                        <p className="font-medium">{entry.date}</p>
                        <div className="flex justify-between text-sm mt-2">
                          <div>
                            <p className="text-muted-foreground">Clock In</p>
                            <p>{entry.clockIn}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Clock Out</p>
                            <p>{entry.clockOut}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Total</p>
                            <p>{entry.totalHours} hrs</p>
                          </div>
                        </div>
                      </div>
                    ))}
                    <Button variant="outline" className="w-full">
                      <Clock className="mr-2 h-4 w-4" /> Log Time
                    </Button>
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

export default EmployeeDetails;
