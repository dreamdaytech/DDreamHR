
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';

const announcements = [
  { id: 1, title: 'Scheduled Maintenance on Sunday', content: 'We will be performing scheduled maintenance this Sunday from 2 AM to 4 AM UTC. The platform may be unavailable during this time.', date: '2025-06-12', author: 'System Admin' },
  { id: 2, title: 'New Feature: AI-Powered Reports', content: 'We are excited to announce the launch of our new AI-powered reporting features! Check out the reports section to explore.', date: '2025-06-10', author: 'Product Team' },
];

const Announcements: React.FC = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Announcements</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Create Announcement</CardTitle>
            <CardDescription>Post an announcement for all platform users.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input id="title" placeholder="Enter announcement title" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="content">Content</Label>
              <Textarea id="content" placeholder="Enter announcement content" rows={5} />
            </div>
          </CardContent>
          <CardFooter>
            <Button>Publish Announcement</Button>
          </CardFooter>
        </Card>

        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-xl font-semibold">Recent Announcements</h2>
          {announcements.map((announcement) => (
            <Card key={announcement.id}>
              <CardHeader>
                <CardTitle>{announcement.title}</CardTitle>
                <div className="text-sm text-muted-foreground flex items-center gap-2">
                  <span>Posted on {announcement.date} by</span>
                  <Badge variant="secondary">{announcement.author}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p>{announcement.content}</p>
              </CardContent>
              <CardFooter>
                  <Button variant="outline" size="sm">Edit</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Announcements;
