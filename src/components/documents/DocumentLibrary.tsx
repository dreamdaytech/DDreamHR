import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import {
  FileText,
  FolderUp,
  Search,
  MoreHorizontal,
  Download,
  Eye,
  Trash2,
  Lock,
  Unlock,
  Image,
  FileSpreadsheet,
  FilePen,
  User,
  Users,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { downloadTextFile, readDemoData, writeDemoData } from '@/lib/demoStore';

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

const seedDocuments: Document[] = [
  { id: 1, name: 'Employee Handbook 2023', type: 'pdf', category: 'HR Policies', dateUploaded: '2023-01-15', uploadedBy: 'Sarah Williams', size: '2.4 MB', accessLevel: 'Public' },
  { id: 2, name: 'Benefits Overview', type: 'pdf', category: 'HR Policies', dateUploaded: '2023-02-10', uploadedBy: 'Sarah Williams', size: '1.8 MB', accessLevel: 'Public' },
  { id: 3, name: 'Company Structure', type: 'image', category: 'Company', dateUploaded: '2023-03-05', uploadedBy: 'Robert Johnson', size: '3.2 MB', accessLevel: 'Public' },
  { id: 4, name: 'Salary Review Template', type: 'spreadsheet', category: 'HR Policies', dateUploaded: '2023-04-20', uploadedBy: 'Sarah Williams', size: '1.2 MB', accessLevel: 'HR Only' },
  { id: 5, name: 'John Smith - Employment Contract', type: 'document', category: 'Employee', dateUploaded: '2023-05-01', uploadedBy: 'Sarah Williams', size: '550 KB', accessLevel: 'Private', expiryDate: '2025-05-01' },
  { id: 6, name: 'Health and Safety Policy', type: 'pdf', category: 'Legal', dateUploaded: '2023-05-15', uploadedBy: 'Robert Johnson', size: '1.7 MB', accessLevel: 'Public' },
  { id: 7, name: 'Non-Disclosure Agreement Template', type: 'document', category: 'Legal', dateUploaded: '2023-06-10', uploadedBy: 'Sarah Williams', size: '320 KB', accessLevel: 'Management' },
];

const getDocumentType = (file: File): Document['type'] => {
  if (file.type.includes('pdf')) return 'pdf';
  if (file.type.startsWith('image/')) return 'image';
  if (file.type.includes('sheet') || /\.xlsx?$|\.csv$/i.test(file.name)) return 'spreadsheet';
  return 'document';
};

const formatFileSize = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const DocumentLibrary = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [documents, setDocuments] = useState<Document[]>(() => readDemoData<Document[]>('documents', seedDocuments));
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const { toast } = useToast();

  const persist = (next: Document[]) => {
    setDocuments(next);
    writeDemoData('documents', next);
  };

  const filteredDocuments = documents.filter((doc) =>
    doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.uploadedBy.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleUpload = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.multiple = true;
    input.onchange = () => {
      const files = Array.from(input.files || []);
      if (!files.length) return;
      const uploaded = files.map((file, index): Document => ({
        id: Date.now() + index,
        name: file.name,
        type: getDocumentType(file),
        category: 'Employee',
        dateUploaded: new Date().toISOString().split('T')[0],
        uploadedBy: 'Demo User',
        size: formatFileSize(file.size),
        accessLevel: 'Private',
      }));
      persist([...uploaded, ...documents]);
      toast({ title: 'Upload complete', description: `${uploaded.length} document(s) added to the demo library.` });
    };
    input.click();
  };

  const handleDownload = (documentId: number) => {
    const doc = documents.find((item) => item.id === documentId);
    if (!doc) return;
    const content = [
      `DDreamHR demo document: ${doc.name}`,
      `Category: ${doc.category}`,
      `Uploaded: ${doc.dateUploaded}`,
      `Uploaded by: ${doc.uploadedBy}`,
      `Access: ${doc.accessLevel}`,
    ].join('\n');
    downloadTextFile(`${doc.name.replace(/[^a-z0-9._-]+/gi, '-')}.txt`, content);
    toast({ title: 'Download started', description: doc.name });
  };

  const handleDelete = (documentId: number) => {
    const doc = documents.find((item) => item.id === documentId);
    persist(documents.filter((item) => item.id !== documentId));
    toast({ title: 'Document deleted', description: doc?.name || 'Document removed from demo library.' });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-bold tracking-tight">Document Library</h1>
        <Button onClick={handleUpload}>
          <FolderUp className="mr-2 h-4 w-4" /> Upload Document
        </Button>
      </div>

      <div className="relative w-full sm:w-96">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search documents..."
          className="pl-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <Tabs defaultValue="all">
        <TabsList className="h-auto flex-wrap">
          <TabsTrigger value="all">All Documents</TabsTrigger>
          <TabsTrigger value="hr">HR Policies</TabsTrigger>
          <TabsTrigger value="employee">Employee Files</TabsTrigger>
          <TabsTrigger value="legal">Legal Documents</TabsTrigger>
        </TabsList>
        <TabsContent value="all">
          <DocumentGrid documents={filteredDocuments} onDownload={handleDownload} onView={(id) => setSelectedDocument(documents.find((doc) => doc.id === id) || null)} onDelete={handleDelete} />
        </TabsContent>
        <TabsContent value="hr">
          <DocumentGrid documents={filteredDocuments.filter((doc) => doc.category === 'HR Policies')} onDownload={handleDownload} onView={(id) => setSelectedDocument(documents.find((doc) => doc.id === id) || null)} onDelete={handleDelete} />
        </TabsContent>
        <TabsContent value="employee">
          <DocumentGrid documents={filteredDocuments.filter((doc) => doc.category === 'Employee')} onDownload={handleDownload} onView={(id) => setSelectedDocument(documents.find((doc) => doc.id === id) || null)} onDelete={handleDelete} />
        </TabsContent>
        <TabsContent value="legal">
          <DocumentGrid documents={filteredDocuments.filter((doc) => doc.category === 'Legal')} onDownload={handleDownload} onView={(id) => setSelectedDocument(documents.find((doc) => doc.id === id) || null)} onDelete={handleDelete} />
        </TabsContent>
      </Tabs>

      <Dialog open={!!selectedDocument} onOpenChange={(open) => !open && setSelectedDocument(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>{selectedDocument?.name}</DialogTitle></DialogHeader>
          {selectedDocument && (
            <div className="space-y-3 text-sm">
              <div className="flex justify-between gap-4"><span className="text-muted-foreground">Category</span><span>{selectedDocument.category}</span></div>
              <div className="flex justify-between gap-4"><span className="text-muted-foreground">Uploaded</span><span>{selectedDocument.dateUploaded}</span></div>
              <div className="flex justify-between gap-4"><span className="text-muted-foreground">Uploaded by</span><span>{selectedDocument.uploadedBy}</span></div>
              <div className="flex justify-between gap-4"><span className="text-muted-foreground">Size</span><span>{selectedDocument.size}</span></div>
              <div className="flex justify-between gap-4"><span className="text-muted-foreground">Access</span><span>{selectedDocument.accessLevel}</span></div>
              {selectedDocument.expiryDate && <div className="flex justify-between gap-4"><span className="text-muted-foreground">Expires</span><span>{selectedDocument.expiryDate}</span></div>}
              <Button className="w-full" onClick={() => handleDownload(selectedDocument.id)}>
                <Download className="mr-2 h-4 w-4" /> Download
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

interface DocumentGridProps {
  documents: Document[];
  onDownload: (documentId: number) => void;
  onView: (documentId: number) => void;
  onDelete: (documentId: number) => void;
}

const DocumentGrid = ({ documents, onDownload, onView, onDelete }: DocumentGridProps) => {
  const getDocumentIcon = (type: Document['type']) => {
    switch (type) {
      case 'pdf': return <FileText className="h-6 w-6 text-red-500" />;
      case 'image': return <Image className="h-6 w-6 text-purple-500" />;
      case 'spreadsheet': return <FileSpreadsheet className="h-6 w-6 text-green-500" />;
      case 'document': return <FilePen className="h-6 w-6 text-blue-500" />;
      default: return <FileText className="h-6 w-6" />;
    }
  };

  const getAccessLevelIcon = (accessLevel: Document['accessLevel']) => {
    switch (accessLevel) {
      case 'Public': return <Users className="h-4 w-4 text-green-500" />;
      case 'HR Only': return <Lock className="h-4 w-4 text-blue-500" />;
      case 'Management': return <Lock className="h-4 w-4 text-purple-500" />;
      case 'Private': return <Lock className="h-4 w-4 text-red-500" />;
      default: return <Unlock className="h-4 w-4" />;
    }
  };

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {documents.length > 0 ? documents.map((doc) => (
        <Card key={doc.id} className="overflow-hidden transition-shadow hover:shadow-md">
          <CardHeader className="flex flex-row items-start justify-between space-y-0 p-4 pb-2">
            <div className="flex items-center space-x-2">
              {getDocumentIcon(doc.type)}
              <CardTitle className="line-clamp-1 text-sm font-medium">{doc.name}</CardTitle>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreHorizontal className="h-4 w-4" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onView(doc.id)}><Eye className="mr-2 h-4 w-4" /> View</DropdownMenuItem>
                <DropdownMenuItem onClick={() => onDownload(doc.id)}><Download className="mr-2 h-4 w-4" /> Download</DropdownMenuItem>
                <DropdownMenuItem className="text-destructive" onClick={() => onDelete(doc.id)}><Trash2 className="mr-2 h-4 w-4" /> Delete</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </CardHeader>
          <CardContent className="p-4 pt-2">
            <div className="flex items-center justify-between text-sm">
              <Badge variant="outline" className="bg-muted/50">{doc.category}</Badge>
              <div className="flex items-center" title={`Access: ${doc.accessLevel}`}>{getAccessLevelIcon(doc.accessLevel)}</div>
            </div>
            <div className="mt-4 text-xs text-muted-foreground">
              <div className="mb-1 flex justify-between"><span>Uploaded:</span><span>{doc.dateUploaded}</span></div>
              <div className="mb-1 flex justify-between"><span>Size:</span><span>{doc.size}</span></div>
              <div className="flex items-center justify-between"><span>By:</span><div className="flex items-center"><User className="mr-1 h-3 w-3" /><span>{doc.uploadedBy}</span></div></div>
              {doc.expiryDate && <div className="mt-2 flex justify-between border-t border-border pt-2"><span>Expires:</span><span className="font-medium text-amber-600">{doc.expiryDate}</span></div>}
            </div>
          </CardContent>
        </Card>
      )) : (
        <div className="col-span-full flex h-64 items-center justify-center">
          <p className="text-muted-foreground">No documents match your search</p>
        </div>
      )}
    </div>
  );
};

export default DocumentLibrary;
