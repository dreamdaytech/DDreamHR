
import React from "react";
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Mock data for project charts
const projectTimeData = [
  { project: "Website Redesign", hours: 48.5, billable: 42.0, nonBillable: 6.5 },
  { project: "Mobile App Dev", hours: 35.75, billable: 31.25, nonBillable: 4.5 },
  { project: "HR Portal", hours: 22.25, billable: 18.0, nonBillable: 4.25 },
  { project: "CRM Integration", hours: 15.5, billable: 12.5, nonBillable: 3.0 },
  { project: "Data Migration", hours: 10.25, billable: 8.75, nonBillable: 1.5 },
];

const weeklyData = [
  { name: "Week 1", billable: 32.5, nonBillable: 4.5 },
  { name: "Week 2", billable: 38.0, nonBillable: 6.0 },
  { name: "Week 3", billable: 28.5, nonBillable: 3.5 },
  { name: "Week 4", billable: 42.0, nonBillable: 5.5 },
];

const employeeData = [
  { name: "John D.", billable: 22.5, nonBillable: 2.5 },
  { name: "Sarah M.", billable: 18.0, nonBillable: 3.0 },
  { name: "Alex K.", billable: 32.0, nonBillable: 4.5 },
  { name: "Emma R.", billable: 28.5, nonBillable: 2.0 },
  { name: "Michael T.", billable: 15.0, nonBillable: 1.5 },
];

const ProjectDashboard = () => {
  return (
    <Tabs defaultValue="projects">
      <TabsList className="mb-4">
        <TabsTrigger value="projects">By Project</TabsTrigger>
        <TabsTrigger value="time">By Time</TabsTrigger>
        <TabsTrigger value="employees">By Employee</TabsTrigger>
      </TabsList>
      
      <TabsContent value="projects">
        <Card>
          <CardContent className="p-4">
            <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={projectTimeData} layout="vertical" margin={{ left: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis type="category" dataKey="project" width={120} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: "white", 
                      borderRadius: "8px",
                      border: "1px solid #e2e8f0"
                    }} 
                  />
                  <Legend />
                  <Bar dataKey="billable" name="Billable Hours" fill="#0FA0CE" radius={[0, 4, 4, 0]} />
                  <Bar dataKey="nonBillable" name="Non-Billable" fill="#9b87f5" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="time">
        <Card>
          <CardContent className="p-4">
            <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyData} margin={{ left: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: "white", 
                      borderRadius: "8px",
                      border: "1px solid #e2e8f0"
                    }} 
                  />
                  <Legend />
                  <Bar dataKey="billable" name="Billable Hours" fill="#0FA0CE" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="nonBillable" name="Non-Billable" fill="#9b87f5" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="employees">
        <Card>
          <CardContent className="p-4">
            <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={employeeData} layout="vertical" margin={{ left: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis type="category" dataKey="name" width={80} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: "white", 
                      borderRadius: "8px",
                      border: "1px solid #e2e8f0"
                    }} 
                  />
                  <Legend />
                  <Bar dataKey="billable" name="Billable Hours" fill="#0FA0CE" radius={[0, 4, 4, 0]} />
                  <Bar dataKey="nonBillable" name="Non-Billable" fill="#9b87f5" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};

export default ProjectDashboard;
