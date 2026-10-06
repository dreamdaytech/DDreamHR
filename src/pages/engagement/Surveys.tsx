import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus, BarChart3, Users, Clock, Send, Eye, Edit } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { readDemoData, writeDemoData } from '@/lib/demoStore';

type Survey = {
  id: number;
  title: string;
  description: string;
  status: 'active' | 'draft' | 'completed';
  type: string;
  responses: number;
  totalEmployees: number;
  startDate: string;
  endDate: string;
  completionRate: number;
  isAnonymous: boolean;
};

const seedSurveys: Survey[] = [
  { id: 1, title: 'Q1 Employee Satisfaction Survey', description: 'Quarterly survey to measure overall employee satisfaction and engagement.', status: 'active', type: 'satisfaction', responses: 89, totalEmployees: 156, startDate: '2026-09-01', endDate: '2026-10-15', completionRate: 57, isAnonymous: true },
  { id: 2, title: 'Weekly Pulse Check', description: 'Quick weekly pulse survey to monitor team morale.', status: 'active', type: 'pulse', responses: 134, totalEmployees: 156, startDate: '2026-10-01', endDate: '2026-10-10', completionRate: 86, isAnonymous: false },
  { id: 3, title: 'Training Effectiveness Assessment', description: 'Evaluate the effectiveness of recent training programs.', status: 'draft', type: 'training', responses: 0, totalEmployees: 156, startDate: '2026-10-20', endDate: '2026-10-27', completionRate: 0, isAnonymous: true },
  { id: 4, title: 'Year-End Engagement Survey', description: 'Comprehensive annual engagement and culture assessment.', status: 'completed', type: 'engagement', responses: 142, totalEmployees: 148, startDate: '2025-12-01', endDate: '2025-12-15', completionRate: 96, isAnonymous: true },
];

const Surveys = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('active');
  const [surveys, setSurveys] = useState<Survey[]>(() => readDemoData<Survey[]>('engagement-surveys', seedSurveys));
  const [editorOpen, setEditorOpen] = useState(false);
  const [selectedSurvey, setSelectedSurvey] = useState<Survey | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [draft, setDraft] = useState({ title: '', description: '', type: 'pulse', startDate: '', endDate: '', isAnonymous: true });

  const persist = (next: Survey[]) => {
    setSurveys(next);
    writeDemoData('engagement-surveys', next);
  };

  const openCreate = () => {
    setEditingId(null);
    setDraft({ title: '', description: '', type: 'pulse', startDate: '', endDate: '', isAnonymous: true });
    setEditorOpen(true);
  };

  const openEdit = (survey: Survey) => {
    setEditingId(survey.id);
    setDraft({
      title: survey.title,
      description: survey.description,
      type: survey.type,
      startDate: survey.startDate,
      endDate: survey.endDate,
      isAnonymous: survey.isAnonymous,
    });
    setEditorOpen(true);
  };

  const saveSurvey = () => {
    if (!draft.title.trim() || !draft.startDate || !draft.endDate) {
      toast({ title: 'Missing information', description: 'Title, start date and end date are required.', variant: 'destructive' });
      return;
    }

    if (editingId) {
      persist(surveys.map((survey) => survey.id === editingId ? { ...survey, ...draft } : survey));
      toast({ title: 'Survey updated', description: draft.title });
    } else {
      const newSurvey: Survey = {
        id: Date.now(),
        ...draft,
        status: 'draft',
        responses: 0,
        totalEmployees: 156,
        completionRate: 0,
      };
      persist([newSurvey, ...surveys]);
      setActiveTab('draft');
      toast({ title: 'Survey created', description: 'The new survey was saved as a draft.' });
    }
    setEditorOpen(false);
  };

  const launchSurvey = (surveyId: number) => {
    persist(surveys.map((survey) => survey.id === surveyId ? { ...survey, status: 'active' as const } : survey));
    setActiveTab('active');
    toast({ title: 'Survey launched', description: 'The survey is now active.' });
  };

  const sendReminder = (survey: Survey) => {
    toast({ title: 'Reminder sent', description: `A demo reminder was sent for "${survey.title}".` });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredSurveys = surveys.filter((survey) => survey.status === activeTab);

  return (
    <div className="container mx-auto space-y-6 p-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Surveys & Feedback</h1>
          <p className="mt-2 text-muted-foreground">Create, manage, and analyze employee surveys and feedback</p>
        </div>
        <Button onClick={openCreate}><Plus className="mr-2 h-4 w-4" />Create Survey</Button>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <Card><CardContent className="p-6"><div className="flex items-center justify-between"><div><p className="text-sm text-muted-foreground">Active Surveys</p><p className="text-2xl font-bold">{surveys.filter((s) => s.status === 'active').length}</p></div><Send className="h-8 w-8 text-green-500" /></div></CardContent></Card>
        <Card><CardContent className="p-6"><div className="flex items-center justify-between"><div><p className="text-sm text-muted-foreground">Total Responses</p><p className="text-2xl font-bold">{surveys.reduce((sum, s) => sum + s.responses, 0)}</p></div><Users className="h-8 w-8 text-blue-500" /></div></CardContent></Card>
        <Card><CardContent className="p-6"><div className="flex items-center justify-between"><div><p className="text-sm text-muted-foreground">Avg. Completion Rate</p><p className="text-2xl font-bold">{Math.round(surveys.reduce((sum, s) => sum + s.completionRate, 0) / Math.max(surveys.length, 1))}%</p></div><BarChart3 className="h-8 w-8 text-purple-500" /></div></CardContent></Card>
        <Card><CardContent className="p-6"><div className="flex items-center justify-between"><div><p className="text-sm text-muted-foreground">Response Window</p><p className="text-2xl font-bold">Live</p></div><Clock className="h-8 w-8 text-orange-500" /></div></CardContent></Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="active">Active Surveys</TabsTrigger>
          <TabsTrigger value="draft">Drafts</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6 space-y-4">
          <div className="grid grid-cols-1 gap-6">
            {filteredSurveys.map((survey) => (
              <Card key={survey.id} className="transition-shadow hover:shadow-lg">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <CardTitle className="text-lg">{survey.title}</CardTitle>
                        <Badge variant="outline" className={getStatusColor(survey.status)}>{survey.status}</Badge>
                        {survey.isAnonymous && <Badge variant="secondary">Anonymous</Badge>}
                      </div>
                      <CardDescription>{survey.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm md:grid-cols-4">
                    <div><span className="text-muted-foreground">Responses:</span><p className="font-semibold">{survey.responses} / {survey.totalEmployees}</p></div>
                    <div><span className="text-muted-foreground">Completion Rate:</span><p className="font-semibold">{survey.completionRate}%</p></div>
                    <div><span className="text-muted-foreground">Start Date:</span><p className="font-semibold">{survey.startDate}</p></div>
                    <div><span className="text-muted-foreground">End Date:</span><p className="font-semibold">{survey.endDate}</p></div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm"><span>Progress</span><span>{survey.completionRate}%</span></div>
                    <div className="h-2 w-full rounded-full bg-muted"><div className="h-2 rounded-full bg-primary" style={{ width: `${survey.completionRate}%` }} /></div>
                  </div>
                  <div className="flex items-center justify-between border-t pt-2">
                    <Badge variant="outline" className="capitalize">{survey.type} Survey</Badge>
                    <div className="flex flex-wrap gap-2">
                      {survey.status === 'active' && <>
                        <Button variant="outline" size="sm" onClick={() => setSelectedSurvey(survey)}><Eye className="mr-1 h-4 w-4" />View Results</Button>
                        <Button variant="outline" size="sm" onClick={() => sendReminder(survey)}><Send className="mr-1 h-4 w-4" />Send Reminder</Button>
                      </>}
                      {survey.status === 'draft' && <>
                        <Button variant="outline" size="sm" onClick={() => openEdit(survey)}><Edit className="mr-1 h-4 w-4" />Edit</Button>
                        <Button size="sm" onClick={() => launchSurvey(survey.id)}><Send className="mr-1 h-4 w-4" />Launch</Button>
                      </>}
                      {survey.status === 'completed' && <Button variant="outline" size="sm" onClick={() => setSelectedSurvey(survey)}><BarChart3 className="mr-1 h-4 w-4" />View Analytics</Button>}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            {filteredSurveys.length === 0 && <Card><CardContent className="p-8 text-center text-muted-foreground">No surveys in this section.</CardContent></Card>}
          </div>
        </TabsContent>
      </Tabs>

      <Dialog open={editorOpen} onOpenChange={setEditorOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editingId ? 'Edit survey' : 'Create survey'}</DialogTitle></DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-2"><Label htmlFor="survey-title">Title</Label><Input id="survey-title" value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} /></div>
            <div className="grid gap-2"><Label htmlFor="survey-description">Description</Label><Textarea id="survey-description" value={draft.description} onChange={(e) => setDraft({ ...draft, description: e.target.value })} /></div>
            <div className="grid gap-2"><Label htmlFor="survey-type">Type</Label><Input id="survey-type" value={draft.type} onChange={(e) => setDraft({ ...draft, type: e.target.value })} /></div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="grid gap-2"><Label htmlFor="survey-start">Start date</Label><Input id="survey-start" type="date" value={draft.startDate} onChange={(e) => setDraft({ ...draft, startDate: e.target.value })} /></div>
              <div className="grid gap-2"><Label htmlFor="survey-end">End date</Label><Input id="survey-end" type="date" value={draft.endDate} onChange={(e) => setDraft({ ...draft, endDate: e.target.value })} /></div>
            </div>
            <Button onClick={saveSurvey}>{editingId ? 'Save survey' : 'Create draft'}</Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={!!selectedSurvey} onOpenChange={(open) => !open && setSelectedSurvey(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>{selectedSurvey?.title}</DialogTitle></DialogHeader>
          {selectedSurvey && <div className="grid gap-4 sm:grid-cols-3">
            <Card><CardContent className="p-4 text-center"><p className="text-2xl font-bold">{selectedSurvey.responses}</p><p className="text-xs text-muted-foreground">Responses</p></CardContent></Card>
            <Card><CardContent className="p-4 text-center"><p className="text-2xl font-bold">{selectedSurvey.completionRate}%</p><p className="text-xs text-muted-foreground">Completion</p></CardContent></Card>
            <Card><CardContent className="p-4 text-center"><p className="text-2xl font-bold">{selectedSurvey.totalEmployees}</p><p className="text-xs text-muted-foreground">Audience</p></CardContent></Card>
          </div>}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Surveys;
