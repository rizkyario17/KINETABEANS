
'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartConfig } from "@/components/ui/chart"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts"
import { DollarSign, CreditCard, AlertTriangle, PackageX } from "lucide-react"
import { transactions as recentTransactions } from '@/lib/transaction-data';

const chartData = [
    { month: "January", Penjualan: 18600000 },
    { month: "February", Penjualan: 30500000 },
    { month: "March", Penjualan: 23700000 },
    { month: "April", Penjualan: 7300000 },
    { month: "May", Penjualan: 20900000 },
    { month: "June", Penjualan: 21400000 },
  ]
  
const chartConfig = {
    Penjualan: {
      label: "Penjualan",
      color: "hsl(var(--chart-2))",
    },
} satisfies ChartConfig

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
}

export default function DashboardPage() {
    const [userRole, setUserRole] = useState<string | null>(null);

    useEffect(() => {
        if (typeof window !== 'undefined') {
        const role = localStorage.getItem('userRole');
        setUserRole(role);
        }
    }, []);

    const welcomeMessage = userRole === 'owner' ? 'Welcome, Owner!' : 'Welcome!';

    return (
      <>
        <div className="flex items-center justify-between space-y-2">
            <h1 className="text-3xl font-bold tracking-tight font-headline">{welcomeMessage}</h1>
        </div>
        <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(45231890)}</div>
                <p className="text-xs text-muted-foreground">
                    +20.1% from last month
                </p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Expense</CardTitle>
                <CreditCard className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(12234000)}</div>
                <p className="text-xs text-muted-foreground">
                    +19% from last month
                </p>
                </CardContent>
            </Card>
            <Link href="/dashboard/inventory?filter=low">
              <Card className="hover:bg-muted/50 cursor-pointer transition-colors">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Low Stock</CardTitle>
                  <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                  <div className="text-2xl font-bold">2</div>
                  <p className="text-xs text-muted-foreground">
                      Items with stock &lt; 10
                  </p>
                  </CardContent>
              </Card>
            </Link>
            <Link href="/dashboard/inventory?filter=empty">
              <Card className="hover:bg-muted/50 cursor-pointer transition-colors">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Out of Stock</CardTitle>
                  <PackageX className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                  <div className="text-2xl font-bold">1</div>
                  <p className="text-xs text-muted-foreground">
                      Items sold out
                  </p>
                  </CardContent>
              </Card>
            </Link>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-7 md:gap-8">
            <Card className="lg:col-span-4">
                <CardHeader>
                    <CardTitle>Sales</CardTitle>
                    <CardDescription>Summary of sales for the last 6 months.</CardDescription>
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
                            <ChartTooltip 
                                content={<ChartTooltipContent 
                                    formatter={(value) => formatCurrency(Number(value))}
                                />} 
                            />
                            <Bar dataKey="Penjualan" fill="var(--color-Penjualan)" radius={4} />
                        </BarChart>
                    </ChartContainer>
                </CardContent>
            </Card>
            <Card className="lg:col-span-3">
                <CardHeader>
                    <CardTitle>Recent Transactions</CardTitle>
                    <CardDescription>List of recent sales and purchases.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Type</TableHead>
                                <TableHead>Item</TableHead>
                                <TableHead className="text-right">Total</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {recentTransactions.slice(0, 4).map(tx => (
                                <TableRow key={tx.id}>
                                    <TableCell>
                                        <div className="font-medium">{tx.type}</div>
                                        <div className="text-sm text-muted-foreground">{tx.date}</div>
                                    </TableCell>
                                    <TableCell>{tx.itemName}</TableCell>
                                    <TableCell className="text-right">{formatCurrency(tx.total)}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
      </>
    )
  }
  