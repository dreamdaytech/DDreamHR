import React from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

const mrrData = [
  { month: 'Jan', mrr: 4000 },
  { month: 'Feb', mrr: 3000 },
  { month: 'Mar', mrr: 5000 },
  { month: 'Apr', mrr: 4500 },
  { month: 'May', mrr: 6000 },
  { month: 'Jun', mrr: 5800 },
];

const planRevenueData = [
  { name: 'Basic', revenue: 12000 },
  { name: 'Pro', revenue: 25000 },
  { name: 'Enterprise', revenue: 45000 },
];

const recentTransactions = [
    { id: 'TXN-001', business: 'Innovate Corp', amount: '$99.00', date: '2025-06-15', plan: 'Pro' },
    { id: 'TXN-002', business: 'Tech Solutions', amount: '$299.00', date: '2025-06-15', plan: 'Enterprise' },
    { id: 'TXN-003', business: 'Creative Minds', amount: '$49.00', date: '2025-06-14', plan: 'Basic' },
];

const RevenueReports: React.FC = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Revenue Reports</h1>
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Monthly Recurring Revenue (MRR)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={mrrData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis tickFormatter={(value) => `$${value/1000}k`}/>
                <Tooltip formatter={(value: number) => `$${value.toLocaleString()}`}/>
                <Legend />
                <Line type="monotone" dataKey="mrr" stroke="#16A34A" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Revenue by Plan</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={planRevenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis tickFormatter={(value) => `$${value/1000}k`}/>
                <Tooltip formatter={(value: number) => `$${value.toLocaleString()}`}/>
                <Legend />
                <Bar dataKey="revenue" fill="#16A34A" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
            <CardDescription>A list of the most recent financial transactions.</CardDescription>
        </CardHeader>
        <CardContent>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Transaction ID</TableHead>
                        <TableHead>Business</TableHead>
                        <TableHead>Plan</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Date</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {recentTransactions.map(t => (
                        <TableRow key={t.id}>
                            <TableCell>{t.id}</TableCell>
                            <TableCell>{t.business}</TableCell>
                            <TableCell><Badge variant="secondary">{t.plan}</Badge></TableCell>
                            <TableCell>{t.amount}</TableCell>
                            <TableCell>{t.date}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default RevenueReports;
