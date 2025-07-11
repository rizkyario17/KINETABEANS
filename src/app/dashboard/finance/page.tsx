
"use client"
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartConfig } from "@/components/ui/chart"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts"
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { TriangleAlert, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';

const chartData: any[] = [];
  
  const chartConfig = {
    revenue: {
      label: "Revenue",
      color: "hsl(var(--chart-2))",
    },
    expense: {
      label: "Expense",
      color: "hsl(var(--chart-5))",
    },
  } satisfies ChartConfig

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
}

export default function FinancePage() {
  const [userRole, setUserRole] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const role = localStorage.getItem('userRole');
      setUserRole(role);
      if (role !== 'owner') {
        // Optional: you can redirect or just show the access denied message.
        // For this case, we will just show the message.
      }
    }
  }, [router]);

  const handleDownload = () => {
    const headers = ["Bulan", "Pendapatan", "Pengeluaran"];
    const csvContent = [
        headers.join(','),
        ...chartData.map(row => `${row.month},${row.revenue},${row.expense}`)
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", "financial_report.csv");
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
  };

  if (userRole !== 'owner') {
    return (
        <div className="flex items-center justify-center h-[50vh]">
            <Alert variant="destructive" className="max-w-md">
                <TriangleAlert className="h-4 w-4" />
                <AlertTitle>Access Denied</AlertTitle>
                <AlertDescription>
                    You must be an Owner to view this page. Please log in with an Owner account.
                </AlertDescription>
            </Alert>
        </div>
    );
  }


  return (
    <>
      <div className="flex items-center justify-between">
        <div>
            <h1 className="text-3xl font-bold tracking-tight font-headline">Financial Summary</h1>
            <p className="text-muted-foreground">Financial summary of your business.</p>
        </div>
        <Button onClick={handleDownload}>
            <Download className="mr-2 h-4 w-4" />
            Download Report
        </Button>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="bg-primary text-primary-foreground">
          <CardHeader>
            <CardTitle className="text-primary-foreground/80">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{formatCurrency(0)}</p>
          </CardContent>
        </Card>
        <Card className="bg-primary text-primary-foreground">
          <CardHeader>
            <CardTitle className="text-primary-foreground/80">Total Expense</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{formatCurrency(0)}</p>
          </CardContent>
        </Card>
        <Card className="bg-primary text-primary-foreground">
          <CardHeader>
            <CardTitle className="text-primary-foreground/80">Profit</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{formatCurrency(0)}</p>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Monthly Summary</CardTitle>
          <CardDescription>Revenue vs. Expense for the last 6 months</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
            <BarChart accessibilityLayer data={chartData}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="month"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(value) => value.slice(0, 3)}
              />
               <YAxis 
                  tickFormatter={(value) => `${new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', notation: 'compact' }).format(Number(value))}`}
              />
              <ChartTooltip content={<ChartTooltipContent formatter={(value) => formatCurrency(Number(value))} />} />
              <Bar dataKey="revenue" fill="var(--color-revenue)" radius={4} />
              <Bar dataKey="expense" fill="var(--color-expense)" radius={4} />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </>
  )
}
