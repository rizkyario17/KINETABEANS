
"use client";

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { PlusCircle, Trash2, CalendarIcon, Edit, Download } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { format } from 'date-fns';
import { id as localeID } from 'date-fns/locale';
import { cn } from '@/lib/utils';


interface Expense {
  id: string;
  date: Date;
  category: string;
  description: string;
  amount: number;
}

const expenseCategories = [
    "Transport", "Food & Drink", "Utilities", "Rent/Mortgage", "Shopping", "Entertainment", "Health", "Education", "Family", "Other"
];

const initialExpenses: Expense[] = [];

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
}

const convertToCSV = (data: Expense[]) => {
    const headers = ["Date", "Category", "Description", "Amount"];
    const headerRow = headers.join(',');
    const bodyRows = data.map(row => 
        [
            format(row.date, 'yyyy-MM-dd'),
            `"${row.category.replace(/"/g, '""')}"`,
            `"${row.description.replace(/"/g, '""')}"`,
            row.amount
        ].join(',')
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


export default function PersonalExpensesPage() {
  const [expenses, setExpenses] = useState<Expense[]>(initialExpenses);
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const { toast } = useToast();

  const totalExpenses = useMemo(() => expenses.reduce((acc, expense) => acc + expense.amount, 0), [expenses]);
  
  const handleEditClick = (expense: Expense) => {
    setEditingExpense(expense);
    setDialogOpen(true);
  }

  const handleDelete = (id: string) => {
    setExpenses(expenses.filter(exp => exp.id !== id));
    toast({
        title: "Expense Deleted",
        description: "The expense has been successfully removed.",
    });
  };
  
  const handleDownload = () => {
    if (expenses.length === 0) {
        toast({
            variant: "destructive",
            title: "No Data",
            description: "There is no expense data to download.",
        });
        return;
    }
    const csv = convertToCSV(expenses);
    downloadCSV(csv, 'personal_expenses_report.csv');
  };

  const handleSaveExpense = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const dateValue = formData.get('date');
    
    const expenseData = {
        date: dateValue ? new Date(dateValue as string) : new Date(),
        category: formData.get('category') as string,
        description: formData.get('description') as string,
        amount: parseFloat(formData.get('amount') as string),
    };

    if (!expenseData.category || !expenseData.description || !expenseData.amount) {
        toast({ variant: 'destructive', title: "Validation Error", description: "Please fill all required fields." });
        return;
    }

    if (editingExpense) {
        setExpenses(expenses.map(exp => exp.id === editingExpense.id ? { ...editingExpense, ...expenseData } : exp));
        toast({ title: "Success", description: "Expense has been updated." });
    } else {
        const newExpense = { ...expenseData, id: `exp_${Date.now()}` };
        setExpenses([newExpense, ...expenses]);
        toast({ title: "Success", description: "New expense has been added." });
    }

    setDialogOpen(false);
    setEditingExpense(null);
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <div>
            <h1 className="text-3xl font-bold tracking-tight font-headline">Personal Expenses</h1>
            <p className="text-muted-foreground">Track your personal spending here.</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={(isOpen) => { setDialogOpen(isOpen); if (!isOpen) setEditingExpense(null); }}>
            <DialogTrigger asChild>
                <Button onClick={() => setEditingExpense(null)}>
                    <PlusCircle className="mr-2 h-4 w-4" /> Add New Expense
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <form onSubmit={handleSaveExpense}>
                    <DialogHeader>
                        <DialogTitle>{editingExpense ? "Edit Expense" : "Add New Expense"}</DialogTitle>
                        <DialogDescription>
                            Fill in the details of your expense below.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                         <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="date" className="text-right">Date</Label>
                             <Popover>
                                <PopoverTrigger asChild>
                                     <Button name="date-trigger" variant={"outline"} className={cn("col-span-3 justify-start text-left font-normal", !editingExpense?.date && "text-muted-foreground")}>
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {editingExpense?.date ? format(editingExpense.date, "PPP") : <span>Pick a date</span>}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0">
                                    <Calendar
                                        mode="single"
                                        selected={editingExpense?.date}
                                        onSelect={(date) => {
                                            const updatedExpense = {...(editingExpense || {id: '', date: new Date(), category: '', description: '', amount: 0}), date: date || new Date()};
                                            setEditingExpense(updatedExpense);
                                        }}
                                        initialFocus
                                    />
                                    <input type="hidden" name="date" value={editingExpense?.date?.toISOString()} />
                                </PopoverContent>
                            </Popover>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="category" className="text-right">Category</Label>
                            <Select name="category" defaultValue={editingExpense?.category}>
                                <SelectTrigger className="col-span-3">
                                    <SelectValue placeholder="Select a category" />
                                </SelectTrigger>
                                <SelectContent>
                                    {expenseCategories.map(cat => (
                                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="description" className="text-right">Description</Label>
                            <Input id="description" name="description" defaultValue={editingExpense?.description} className="col-span-3" placeholder="e.g., Coffee meeting"/>
                        </div>
                         <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="amount" className="text-right">Amount</Label>
                            <Input id="amount" name="amount" type="number" defaultValue={editingExpense?.amount} className="col-span-3" placeholder="e.g., 50000"/>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="submit">Save Expense</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-3 mt-6">
        <Card className="md:col-span-3">
          <CardHeader className="flex flex-row items-start justify-between">
            <div>
              <CardTitle>Expense History</CardTitle>
              <CardDescription>A list of your recent personal expenses.</CardDescription>
            </div>
            <Button variant="outline" onClick={handleDownload}>
              <Download className="mr-2 h-4 w-4" /> Download Report
            </Button>
          </CardHeader>
          <CardContent>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {expenses.map((expense) => (
                        <TableRow key={expense.id}>
                            <TableCell>{format(expense.date, 'd MMMM yyyy', { locale: localeID })}</TableCell>
                            <TableCell>
                                <span className="px-2 py-1 text-xs font-medium rounded-full bg-muted text-muted-foreground">{expense.category}</span>
                            </TableCell>
                            <TableCell className="font-medium">{expense.description}</TableCell>
                            <TableCell className="text-right">{formatCurrency(expense.amount)}</TableCell>
                            <TableCell className="text-right">
                               <div className="flex items-center justify-end gap-2">
                                    <Button variant="ghost" size="icon" onClick={() => handleEditClick(expense)}>
                                        <Edit className="h-4 w-4" />
                                    </Button>
                                    <Button variant="ghost" size="icon" onClick={() => handleDelete(expense.id)}>
                                        <Trash2 className="h-4 w-4 text-destructive" />
                                    </Button>
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
          </CardContent>
          <CardFooter className="flex justify-end font-bold text-lg border-t pt-4">
            <div className="flex items-center gap-4">
                <span>Total Expenses:</span>
                <span>{formatCurrency(totalExpenses)}</span>
            </div>
          </CardFooter>
        </Card>
      </div>
    </>
  );
}
