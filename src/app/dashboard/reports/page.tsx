
"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Download } from "lucide-react"
import { Badge } from '@/components/ui/badge';

const salesData = [
    { id: 'S001', date: '2024-05-20', customer: 'Andi Budi', item: 'Ground Arabika 250gr Full Roasted', quantity: 1, price: 85000, total: 85000, payment: 'Kredit', category: 'Production' },
    { id: 'S002', date: '2024-05-18', customer: 'Citra Sari', item: 'Green Beans Arabika 1Kg Honey Process', quantity: 2, price: 250000, total: 500000, payment: 'Transfer Bank', category: 'Purchase' },
    { id: 'S003', date: '2024-05-17', customer: 'Doni Firmansyah', item: 'Roasted Beans Spesial Blend 1Kg Medium Roasted', quantity: 5, price: 280000, total: 1400000, payment: 'Tunai', category: 'Production' },
    { id: 'S004', date: '2024-05-15', customer: 'Eka Putri', item: 'Green Beans Robusta 1Kg Washed Process', quantity: 10, price: 180000, total: 1800000, payment: 'QRIS', category: 'Purchase' },
];

const purchaseData = [
    { id: 'P001', date: '2024-05-19', supplier: 'PT. Biji Kopi Jaya', item: 'Green Beans Arabika 1Kg Honey Process', quantity: 50, price: 200000, total: 10000000 },
    { id: 'P002', date: '2024-05-16', supplier: 'Distributor Biji', item: 'Green Beans Robusta 1Kg Washed Process', quantity: 10, price: 150000, total: 1500000 },
];

const inventoryData = [
    { sku: 'LP15-2023', name: 'Laptop Pro 15"', stock: 23, price: 15000000, value: 345000000, status: 'In Stock' },
    { sku: 'WM-001', name: 'Wireless Mouse', stock: 8, price: 250000, value: 2000000, status: 'Low Stock' },
    { sku: 'MK-RED-01', name: 'Mechanical Keyboard', stock: 0, price: 800000, value: 0, status: 'Out of Stock' },
    { sku: '4KM-27-002', name: '4K Monitor 27"', stock: 15, price: 4500000, value: 67500000, status: 'In Stock' },
];

const profitLossData = [
    { period: "January 2024", revenue: 186000000, cogs: 120000000, grossProfit: 66000000, expenses: 25000000, netProfit: 41000000 },
    { period: "February 2024", revenue: 305000000, cogs: 210000000, grossProfit: 95000000, expenses: 30000000, netProfit: 65000000 },
    { period: "March 2024", revenue: 237000000, cogs: 160000000, grossProfit: 77000000, expenses: 28000000, netProfit: 49000000 },
    { period: "April 2024", revenue: 73000000, cogs: 50000000, grossProfit: 23000000, expenses: 20000000, netProfit: 3000000 },
];

const productionSales = salesData.filter(s => s.category === 'Production');
const purchaseSales = salesData.filter(s => s.category === 'Purchase');


const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
}

// Helper function to convert array of objects to CSV
const convertToCSV = (data: any[], headers: string[]) => {
    const headerRow = headers.join(',');
    const bodyRows = data.map(row => 
        headers.map(header => {
            const key = Object.keys(row).find(k => k.toLowerCase() === header.toLowerCase().replace(/ /g, '')) || '';
            let value = row[key] ?? '';
            if (typeof value === 'string') {
                value = `"${value.replace(/"/g, '""')}"`; // escape quotes
            }
            return value;
        }).join(',')
    ).join('\n');
    return `${headerRow}\n${bodyRows}`;
};

const downloadCSV = (csvContent: string, filename: string) => {
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", filename);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
};


export default function ReportsPage() {

  const handleDownload = (reportType: 'sales' | 'purchases' | 'inventory' | 'profitloss' | 'productionsales' | 'purchasesales') => {
    let data: any[] = [], headers: string[] = [], filename = '';
    switch (reportType) {
        case 'sales':
            data = salesData;
            headers = ['id', 'date', 'customer', 'item', 'quantity', 'price', 'total', 'payment', 'category'];
            filename = 'sales_report.csv';
            break;
        case 'purchases':
            data = purchaseData;
            headers = ['id', 'date', 'supplier', 'item', 'quantity', 'price', 'total'];
            filename = 'purchases_report.csv';
            break;
        case 'inventory':
            data = inventoryData;
            headers = ['sku', 'name', 'stock', 'price', 'value', 'status'];
            filename = 'inventory_report.csv';
            break;
        case 'profitloss':
            data = profitLossData;
            headers = ['period', 'revenue', 'cogs', 'grossProfit', 'expenses', 'netProfit'];
            filename = 'profit_loss_report.csv';
            break;
        case 'productionsales':
            data = productionSales;
            headers = ['id', 'date', 'customer', 'item', 'quantity', 'price', 'total', 'payment'];
            filename = 'production_sales_report.csv';
            break;
        case 'purchasesales':
            data = purchaseSales;
            headers = ['id', 'date', 'customer', 'item', 'quantity', 'price', 'total', 'payment'];
            filename = 'purchase_sales_report.csv';
            break;
    }
    const csv = convertToCSV(data.map(item => {
        const newItem = { ...item };
        Object.keys(newItem).forEach(key => {
            if (typeof newItem[key] === 'number' && key !== 'quantity' && key !== 'stock' ) {
                // we keep the raw number
            }
        });
        return newItem;
    }), headers);
    downloadCSV(csv, filename);
  };


  const getStatusBadge = (status: string) => {
    switch (status) {
        case 'Out of Stock': return 'destructive';
        case 'Low Stock': return 'secondary';
        default: return 'default';
    }
  }

  return (
    <>
      <div className="flex items-center justify-between">
        <div>
            <h1 className="text-3xl font-bold tracking-tight font-headline">REPORTS</h1>
            <p className="text-muted-foreground">View and download your business reports.</p>
        </div>
      </div>
      <Tabs defaultValue="sales" className="w-full mt-4">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
            <TabsTrigger value="sales">Sales</TabsTrigger>
            <TabsTrigger value="purchases">Purchases</TabsTrigger>
            <TabsTrigger value="inventory">Inventory</TabsTrigger>
            <TabsTrigger value="profit_loss">Profit &amp; Loss</TabsTrigger>
            <TabsTrigger value="production_sales">Production Sales</TabsTrigger>
            <TabsTrigger value="purchase_sales">Purchase Sales</TabsTrigger>
        </TabsList>

        <TabsContent value="sales">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle>Sales Report</CardTitle>
                        <CardDescription>Details of all sales transactions.</CardDescription>
                    </div>
                    <Button onClick={() => handleDownload('sales')}>
                        <Download className="mr-2 h-4 w-4" /> Download
                    </Button>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Transaction ID</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Customer</TableHead>
                                <TableHead>Item</TableHead>
                                <TableHead>Category</TableHead>
                                <TableHead className="text-right">Total</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {salesData.map((sale) => (
                                <TableRow key={sale.id}>
                                    <TableCell className="font-medium">{sale.id}</TableCell>
                                    <TableCell>{sale.date}</TableCell>
                                    <TableCell>{sale.customer}</TableCell>
                                    <TableCell>{sale.item}</TableCell>
                                    <TableCell><Badge variant={sale.category === 'Purchase' ? 'secondary' : 'default'}>{sale.category}</Badge></TableCell>
                                    <TableCell className="text-right">{formatCurrency(sale.total)}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </TabsContent>

        <TabsContent value="purchases">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle>Purchase Report</CardTitle>
                        <CardDescription>Details of all purchase transactions from suppliers.</CardDescription>
                    </div>
                     <Button onClick={() => handleDownload('purchases')}>
                        <Download className="mr-2 h-4 w-4" /> Download
                    </Button>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Purchase ID</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Supplier</TableHead>
                                <TableHead>Item</TableHead>
                                <TableHead className="text-center">Quantity</TableHead>
                                <TableHead className="text-right">Total</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {purchaseData.map((purchase) => (
                                <TableRow key={purchase.id}>
                                    <TableCell className="font-medium">{purchase.id}</TableCell>
                                    <TableCell>{purchase.date}</TableCell>
                                    <TableCell>{purchase.supplier}</TableCell>
                                    <TableCell>{purchase.item}</TableCell>
                                    <TableCell className="text-center">{purchase.quantity}</TableCell>
                                    <TableCell className="text-right">{formatCurrency(purchase.total)}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </TabsContent>

        <TabsContent value="inventory">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle>Inventory Report</CardTitle>
                        <CardDescription>Current status and value of your stock.</CardDescription>
                    </div>
                     <Button onClick={() => handleDownload('inventory')}>
                        <Download className="mr-2 h-4 w-4" /> Download
                    </Button>
                </CardHeader>
                <CardContent>
                     <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>SKU</TableHead>
                                <TableHead>Item Name</TableHead>
                                <TableHead className="text-center">Stock</TableHead>
                                <TableHead className="text-right">Sale Price</TableHead>
                                <TableHead className="text-right">Stock Value</TableHead>
                                <TableHead className="text-center">Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {inventoryData.map((item) => (
                                <TableRow key={item.sku}>
                                    <TableCell className="font-medium">{item.sku}</TableCell>
                                    <TableCell>{item.name}</TableCell>
                                    <TableCell className="text-center">{item.stock}</TableCell>
                                    <TableCell className="text-right">{formatCurrency(item.price)}</TableCell>
                                    <TableCell className="text-right">{formatCurrency(item.value)}</TableCell>
                                    <TableCell className="text-center">
                                        <Badge variant={getStatusBadge(item.status)}>{item.status}</Badge>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </TabsContent>

        <TabsContent value="profit_loss">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle>Profit &amp; Loss Report</CardTitle>
                        <CardDescription>A summary of your business's financial performance.</CardDescription>
                    </div>
                    <Button onClick={() => handleDownload('profitloss')}>
                        <Download className="mr-2 h-4 w-4" /> Download
                    </Button>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Period</TableHead>
                                <TableHead className="text-right">Revenue</TableHead>
                                <TableHead className="text-right">COGS</TableHead>
                                <TableHead className="text-right">Gross Profit</TableHead>
                                <TableHead className="text-right">Expenses</TableHead>
                                <TableHead className="text-right">Net Profit</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {profitLossData.map((pl) => (
                                <TableRow key={pl.period}>
                                    <TableCell className="font-medium">{pl.period}</TableCell>
                                    <TableCell className="text-right text-green-600">{formatCurrency(pl.revenue)}</TableCell>
                                    <TableCell className="text-right text-red-600">{`(${formatCurrency(pl.cogs)})`}</TableCell>
                                    <TableCell className="text-right font-semibold">{formatCurrency(pl.grossProfit)}</TableCell>
                                    <TableCell className="text-right text-red-600">{`(${formatCurrency(pl.expenses)})`}</TableCell>
                                    <TableCell className="text-right font-bold text-lg">{formatCurrency(pl.netProfit)}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </TabsContent>

        <TabsContent value="production_sales">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle>Production Sales Report</CardTitle>
                        <CardDescription>Details of all sales for production items.</CardDescription>
                    </div>
                    <Button onClick={() => handleDownload('productionsales')}>
                        <Download className="mr-2 h-4 w-4" /> Download
                    </Button>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Transaction ID</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Customer</TableHead>
                                <TableHead>Item</TableHead>
                                <TableHead className="text-right">Total</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {productionSales.map((sale) => (
                                <TableRow key={sale.id}>
                                    <TableCell className="font-medium">{sale.id}</TableCell>
                                    <TableCell>{sale.date}</TableCell>
                                    <TableCell>{sale.customer}</TableCell>
                                    <TableCell>{sale.item}</TableCell>
                                    <TableCell className="text-right">{formatCurrency(sale.total)}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </TabsContent>

        <TabsContent value="purchase_sales">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle>Purchase Sales Report</CardTitle>
                        <CardDescription>Details of all sales for purchased items.</CardDescription>
                    </div>
                    <Button onClick={() => handleDownload('purchasesales')}>
                        <Download className="mr-2 h-4 w-4" /> Download
                    </Button>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Transaction ID</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Customer</TableHead>
                                <TableHead>Item</TableHead>
                                <TableHead className="text-right">Total</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {purchaseSales.map((sale) => (
                                <TableRow key={sale.id}>
                                    <TableCell className="font-medium">{sale.id}</TableCell>
                                    <TableCell>{sale.date}</TableCell>
                                    <TableCell>{sale.customer}</TableCell>
                                    <TableCell>{sale.item}</TableCell>
                                    <TableCell className="text-right">{formatCurrency(sale.total)}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </TabsContent>

      </Tabs>
    </>
  )
}

    
