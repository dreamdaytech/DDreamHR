import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import {
  FileText,
  FolderUp,
  Search,
  Plus,
  Filter,
  MoreHorizontal,
  Download,
  Eye,
  FileEdit,
  Copy,
  Trash2,
  Lock,
  Unlock,
  Image,
  FileSpreadsheet,
  FilePen,
  User,
  Users
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

type Document = {
  id: number;
  name: string;
  type: 'pdf' | 'image' | 'spreadsheet' | 'document';
  category: 'HR Policies' | 'Employee' | 'Company' | 'Legal';
  dateUploaded: string;
  uploadedBy: string;
  size: string;
  accessLevel: 'Public' | 'HR Only' | 'Management' | 'Private';
  expiryDate?: string;
};

const DocumentLibrary = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  // Mock document data
  const documents: Document[] = [
    {
      id: 1,
      name: 'Employee Handbook 2023',
      type: 'pdf',
      category: 'HR Policies',
      dateUploaded: '2023-01-15',
      uploadedBy: 'Sarah Williams',
      size: '2.4 MB',
      accessLevel: 'Public',
    },
    {
      id: 2,
      name: 'Benefits Overview',
      type: 'pdf',
      category: 'HR Policies',
      dateUploaded: '2023-02-10',
      uploadedBy: 'Sarah Williams',
      size: '1.8 MB',
      accessLevel: 'Public',
    },
    {
      id: 3,
      name: 'Company Structure',
      type: 'image',
      category: 'Company',
      dateUploaded: '2023-03-05',
      uploadedBy: 'Robert Johnson',
      size: '3.2 MB',
      accessLevel: 'Public',
    },
    {
      id: 4,
      name: 'Salary Review Template',
      type: 'spreadsheet',
      category: 'HR Policies',
      dateUploaded: '2023-04-20',
      uploadedBy: 'Sarah Williams',
      size: '1.2 MB',
      accessLevel: 'HR Only',
    },
    {
      id: 5,
      name: 'John Smith - Employment Contract',
      type: 'document',
      category: 'Employee',
      dateUploaded: '2023-05-01',
      uploadedBy: 'Sarah Williams',
      size: '550 KB',
      accessLevel: 'Private',
      expiryDate: '2025-05-01',
    },
    {
      id: 6,
      name: 'Health and Safety Policy',
      type: 'pdf',
      category: 'Legal',
      dateUploaded: '2023-05-15',
      uploadedBy: 'Robert Johnson',
      size: '1.7 MB',
      accessLevel: 'Public',
    },
    {
      id: 7,
      name: 'Non-Disclosure Agreement Template',
      type: 'document',
      category: 'Legal',
      dateUploaded: '2023-06-10',
      uploadedBy: 'Sarah Williams',
      size: '320 KB',
      accessLevel: 'Management',
    },
  ];

  const filteredDocuments = documents.filter(doc => 
    doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.uploadedBy.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getDocumentIcon = (type: Document['type']) => {
    switch (type) {
      case 'pdf':
        return <FileText className="h-6 w-6 text-red-500" />;
      case 'image':
        return <Image className="h-6 w-6 text-purple-500" />;
      case 'spreadsheet':
        return <FileSpreadsheet className="h-6 w-6 text-green-500" />;
      case 'document':
        return <FilePen className="h-6 w-6 text-blue-500" />;
      default:
        return <FileText className="h-6 w-6" />;
    }
  };

  const getAccessLevelIcon = (accessLevel: Document['accessLevel']) => {
    switch (accessLevel) {
      case 'Public':
        return <Users className="h-4 w-4 text-green-500" />;
      case 'HR Only':
        return <Lock className="h-4 w-4 text-blue-500" />;
      case 'Management':
        return <Lock className="h-4 w-4 text-purple-500" />;
      case 'Private':
        return <Lock className="h-4 w-4 text-red-500" />;
      default:
        return <Unlock className="h-4 w-4" />;
    }
  };

  const handleUpload = () => {
    toast({
      title: "Upload feature coming soon",
      description: "Document upload functionality will be available in the next update"
    });
  };

  const handleDownload = (documentId: number) => {
    toast({
      title: "Download started",
      description: "Your document is being prepared for download"
    });
  };

  const handleView = (documentId: number) => {
    toast({
      title: "Document viewer",
      description: "Document viewer will be available in the next update"
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight">Document Library</h1>
        <Button onClick={handleUpload}>
          <FolderUp className="mr-2 h-4 w-4" /> Upload Document
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
          <Input
            type="search"
            placeholder="Search documents..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Plus className="mr-2 h-4 w-4" /> New Folder
          </Button>
          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" /> Filter
          </Button>
        </div>
      </div>

      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All Documents</TabsTrigger>
          <TabsTrigger value="hr">HR Policies</TabsTrigger>
          <TabsTrigger value="employee">Employee Files</TabsTrigger>
          <TabsTrigger value="legal">Legal Documents</TabsTrigger>
        </TabsList>
        <TabsContent value="all">
          <DocumentGrid documents={filteredDocuments} onDownload={handleDownload} onView={handleView} />
        </TabsContent>
        <TabsContent value="hr">
          <DocumentGrid 
            documents={filteredDocuments.filter(doc => doc.category === 'HR Policies')} 
            onDownload={handleDownload} 
            onView={handleView}
          />
        </TabsContent>
        <TabsContent value="employee">
          <DocumentGrid 
            documents={filteredDocuments.filter(doc => doc.category === 'Employee')} 
            onDownload={handleDownload} 
            onView={handleView}
          />
        </TabsContent>
        <TabsContent value="legal">
          <DocumentGrid 
            documents={filteredDocuments.filter(doc => doc.category === 'Legal')} 
            onDownload={handleDownload} 
            onView={handleView}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

interface DocumentGridProps {
  documents: Document[];
  onDownload: (documentId: number) => void;
  onView: (documentId: number) => void;
}

const DocumentGrid = ({ documents, onDownload, onView }: DocumentGridProps) => {
  const getDocumentIcon = (type: Document['type']) => {
    switch (type) {
      case 'pdf':
        return <FileText className="h-6 w-6 text-red-500" />;
      case 'image':
        return <Image className="h-6 w-6 text-purple-500" />;
      case 'spreadsheet':
        return <FileSpreadsheet className="h-6 w-6 text-green-500" />;
      case 'document':
        return <FilePen className="h-6 w-6 text-blue-500" />;
      default:
        return <FileText className="h-6 w-6" />;
    }
  };

  const getAccessLevelIcon = (accessLevel: Document['accessLevel']) => {
    switch (accessLevel) {
      case 'Public':
        return <Users className="h-4 w-4 text-green-500" />;
      case 'HR Only':
        return <Lock className="h-4 w-4 text-blue-500" />;
      case 'Management':
        return <Lock className="h-4 w-4 text-purple-500" />;
      case 'Private':
        return <Lock className="h-4 w-4 text-red-500" />;
      default:
        return <Unlock className="h-4 w-4" />;
    }
  };

  const { toast } = useToast();
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {documents.length > 0 ? (
        documents.map((doc) => (
          <Card key={doc.id} className="overflow-hidden hover:shadow-md transition-shadow">
            <CardHeader className="p-4 pb-2 flex flex-row items-start justify-between space-y-0">
              <div className="flex items-center space-x-2">
                {getDocumentIcon(doc.type)}
                <CardTitle className="text-sm font-medium line-clamp-1">{doc.name}</CardTitle>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <MoreHorizontal className="h-4 w-4" />
                    <span className="sr-only">Open menu</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => onView(doc.id)}>
                    <Eye className="mr-2 h-4 w-4" /> View
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onDownload(doc.id)}>
                    <Download className="mr-2 h-4 w-4" /> Download
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => toast({ title: "Feature coming soon" })}>
                    <FileEdit className="mr-2 h-4 w-4" /> Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => toast({ title: "Feature coming soon" })}>
                    <Copy className="mr-2 h-4 w-4" /> Copy
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => toast({ title: "Feature coming soon" })}>
                    <Trash2 className="mr-2 h-4 w-4" /> Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </CardHeader>
            <CardContent className="p-4 pt-2">
              <div className="flex justify-between items-center text-sm">
                <Badge variant="outline" className="bg-muted/50">
                  {doc.category}
                </Badge>
                <div className="flex items-center" title={`Access: ${doc.accessLevel}`}>
                  {getAccessLevelIcon(doc.accessLevel)}
                </div>
              </div>
              
              <div className="mt-4 text-xs text-muted-foreground">
                <div className="flex justify-between mb-1">
                  <span>Uploaded:</span>
                  <span>{doc.dateUploaded}</span>
                </div>
                <div className="flex justify-between mb-1">
                  <span>Size:</span>
                  <span>{doc.size}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>By:</span>
                  <div className="flex items-center">
                    <User className="h-3 w-3 mr-1" />
                    <span>{doc.uploadedBy}</span>
                  </div>
                </div>
                {doc.expiryDate && (
                  <div className="flex justify-between mt-2 pt-2 border-t border-border">
                    <span>Expires:</span>
                    <span className="text-amber-600 font-medium">{doc.expiryDate}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))
      ) : (
        <div className="col-span-full flex justify-center items-center h-64">
          <p className="text-muted-foreground">No documents match your search</p>
        </div>
      )}
    </div>
  );
};

export default DocumentLibrary;
