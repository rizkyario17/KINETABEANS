
'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from '@/components/ui/table';
import { Download, FileText, Package, ArrowUpCircle, ArrowDownCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { transactions as initialTransactions, addTransaction } from '@/lib/transaction-data';


// This data would ideally come from a shared state/context or API
const initialInventory = [
    { id: '1', name: 'Ground Arabika 250gr Full Roasted', sku: 'GROUND-ARB-250G-FR', stock: 25, price: 85000, category: 'Production' },
    { id: '2', name: 'Ground Arabika 250gr Medium Roasted', sku: 'GROUND-ARB-250G-MR', stock: 30, price: 80000, category: 'Production' },
    { id: '3', name: 'Ground Arabika 250gr Light Roasted', sku: 'GROUND-ARB-250G-LR', stock: 15, price: 75000, category: 'Production' },
    { id: '4', name: 'Ground Arabika 500gr Full Roasted', sku: 'GROUND-ARB-500G-FR', stock: 20, price: 160000, category: 'Production' },
    { id: '5', name: 'Ground Arabika 500gr Medium Roasted', sku: 'GROUND-ARB-500G-MR', stock: 8, price: 150000, category: 'Production' },
    { id: '6', name: 'Ground Arabika 500gr Light Roasted', sku: 'GROUND-ARB-500G-LR', stock: 12, price: 145000, category: 'Production' },
    { id: '7', name: 'Ground Arabika 1Kg Full Roasted', sku: 'GROUND-ARB-1KG-FR', stock: 18, price: 300000, category: 'Production' },
    { id: '8', name: 'Ground Arabika 1Kg Medium Roasted', sku: 'GROUND-ARB-1KG-MR', stock: 22, price: 290000, category: 'Production' },
    { id: '9', name: 'Ground Arabika 1Kg Light Roasted', sku: 'GROUND-ARB-1KG-LR', stock: 9, price: 280000, category: 'Production' },
    { id: '10', name: 'Ground Robusta 250gr Full Roasted', sku: 'GROUND-ROB-250G-FR', stock: 40, price: 65000, category: 'Production' },
    { id: '11', name: 'Ground Robusta 250gr Medium Roasted', sku: 'GROUND-ROB-250G-MR', stock: 50, price: 60000, category: 'Production' },
    { id: '12', name: 'Ground Robusta 250gr Light Roasted', sku: 'GROUND-ROB-250G-LR', stock: 0, price: 55000, category: 'Production' },
    { id: '13', name: 'Ground Robusta 500gr Full Roasted', sku: 'GROUND-ROB-500G-FR', stock: 35, price: 120000, category: 'Production' },
    { id: '14', name: 'Ground Robusta 500gr Medium Roasted', sku: 'GROUND-ROB-500G-MR', stock: 28, price: 110000, category: 'Production' },
    { id: '15', name: 'Ground Robusta 500gr Light Roasted', sku: 'GROUND-ROB-500G-LR', stock: 11, price: 105000, category: 'Production' },
    { id: '16', name: 'Ground Robusta 1Kg Full Roasted', sku: 'GROUND-ROB-1KG-FR', stock: 25, price: 230000, category: 'Production' },
    { id: '17', name: 'Ground Robusta 1Kg Medium Roasted', sku: 'GROUND-ROB-1KG-MR', stock: 19, price: 220000, category: 'Production' },
    { id: '18', name: 'Ground Robusta 1Kg Light Roasted', sku: 'GROUND-ROB-1KG-LR', stock: 5, price: 210000, category: 'Production' },
    { id: '19', name: 'Green Beans Arabika 1Kg Honey Process', sku: 'GREENBEANS-ARB-1KG-HONEY', stock: 10, price: 250000, category: 'Purchase' },
    { id: '20', name: 'Green Beans Arabika 1Kg Natural Process', sku: 'GREENBEANS-ARB-1KG-NAT', stock: 15, price: 240000, category: 'Purchase' },
    { id: '21', name: 'Green Beans Robusta 1Kg Washed Process', sku: 'GREENBEANS-ROB-1KG-WASH', stock: 20, price: 180000, category: 'Purchase' },
    { id: '22', name: 'Roasted Beans Arabika 250gr Medium Roasted', sku: 'ROASTEDBEANS-ARB-250G-MR', stock: 25, price: 90000, category: 'Production' },
    { id: '23', name: 'Roasted Beans Robusta 500gr Full Roasted', sku: 'ROASTEDBEANS-ROB-500G-FR', stock: 30, price: 130000, category: 'Production' },
    { id: '24', name: 'Roasted Beans Spesial Blend 1Kg Medium Roasted', sku: 'ROASTEDBEANS-SPB-1KG-MR', stock: 12, price: 280000, category: 'Production' },
    { id: '25', name: 'Ground Spesial Blend 250gr Full Roasted', sku: 'GROUND-SPB-250G-FR', stock: 30, price: 95000, category: 'Production' },
    { id: '26', name: 'Ground Spesial Blend 500gr Medium Roasted', sku: 'GROUND-SPB-500G-MR', stock: 18, price: 180000, category: 'Production' },
    { id: '27', name: 'Green Beans Arabika 250gr Honey Process', sku: 'GREENBEANS-ARB-250G-HONEY', stock: 50, price: 70000, category: 'Purchase' },
    { id: '28', name: 'Green Beans Robusta 500gr Natural Process', sku: 'GREENBEANS-ROB-500G-NAT', stock: 40, price: 100000, category: 'Purchase' },
    { id: '29', name: 'Roasted Beans Spesial Blend 250gr Light Roasted', sku: 'ROASTEDBEANS-SPB-250G-LR', stock: 22, price: 92000, category: 'Production' },
    { id: '30', name: 'Ground Arabika 1Kg Medium Roasted', sku: 'GROUND-ARB-1KG-MR-2', stock: 14, price: 290000, category: 'Production' },
    { id: '31', name: 'Green Beans Spesial Blend 1Kg Washed Process', sku: 'GREENBEANS-SPB-1KG-WASH', stock: 25, price: 260000, category: 'Purchase' },
    { id: '32', name: 'Roasted Beans Robusta 1Kg Full Roasted', sku: 'ROASTEDBEANS-ROB-1KG-FR-2', stock: 3, price: 240000, category: 'Production' },
];

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
}

function TransactionModal({ type, inventory, onSave }: { type: 'Sale' | 'Purchase', inventory: typeof initialInventory, onSave: (transaction: any) => void }) {
    const { toast } = useToast();
    const [selectedCategory, setSelectedCategory] = useState<'Purchase' | 'Production' | 'all'>('all');
    const [selectedItem, setSelectedItem] = useState<string | undefined>();
    const [price, setPrice] = useState<number>(0);
    const [quantity, setQuantity] = useState(1);
    const [isDialogOpen, setDialogOpen] = useState(false);

    const filteredItems = useMemo(() => {
        let items = inventory;
        if (selectedCategory !== 'all') {
            items = items.filter(i => i.category === selectedCategory);
        }
        if (type === 'Sale') {
            return items.filter(i => i.stock > 0);
        }
        return items;
    }, [inventory, selectedCategory, type]);

    const handleItemChange = (value: string) => {
        const item = inventory.find(i => i.id === value);
        setSelectedItem(value);
        if (item) {
            setPrice(item.price);
        } else {
            setPrice(0);
        }
    }
    
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        if (!selectedItem || quantity <= 0) {
            toast({ variant: 'destructive', title: "Error", description: "Please select an item and enter a valid quantity." });
            return;
        }

        const item = inventory.find(i => i.id === selectedItem);
        if (!item) return;

        if (type === 'Sale' && quantity > item.stock) {
            toast({ variant: 'destructive', title: "Error", description: `Not enough stock. Only ${item.stock} available.` });
            return;
        }

        const transaction = {
            id: `T-${Date.now()}`,
            type,
            itemId: item.id,
            itemName: item.name,
            quantity,
            date: new Date().toISOString().split('T')[0],
            total: price * quantity,
            status: 'Lunas',
            category: item.category
        };

        onSave(transaction);
        toast({ title: "Success", description: `${type} transaction has been recorded.` });
        
        // Reset form
        setSelectedItem(undefined);
        setPrice(0);
        setQuantity(1);
        setSelectedCategory('all');
        setDialogOpen(false);
    }

    return (
        <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
        <DialogTrigger asChild>
          <Button>Create New {type}</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
            <form onSubmit={handleSubmit}>
                <DialogHeader>
                    <DialogTitle>Create New {type}</DialogTitle>
                    <DialogDescription>
                    Select an item and enter the transaction details. Stock will be updated automatically.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="category" className="text-right">Category</Label>
                        <Select value={selectedCategory} onValueChange={(val: any) => setSelectedCategory(val)}>
                            <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Categories</SelectItem>
                                <SelectItem value="Purchase">Purchase</SelectItem>
                                <SelectItem value="Production">Production</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="item" className="text-right">Item</Label>
                        <Select onValueChange={handleItemChange} value={selectedItem}>
                            <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="Select an item" />
                            </SelectTrigger>
                            <SelectContent>
                                {filteredItems.map(item => (
                                    <SelectItem key={item.id} value={item.id}>{item.name} (Stock: {item.stock})</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="price" className="text-right">Price</Label>
                        <Input id="price" type="text" readOnly value={formatCurrency(price)} className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="quantity" className="text-right">Quantity</Label>
                        <Input id="quantity" type="number" min="1" value={quantity} onChange={e => setQuantity(Number(e.target.value))} className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="payment-method" className="text-right">Payment</Label>
                        <Select defaultValue='Lunas'>
                            <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="Select method" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Lunas">Lunas</SelectItem>
                                <SelectItem value="Kredit">Kredit</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <DialogFooter>
                    <Button type="submit">Save Transaction</Button>
                </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    )
}

export default function TransactionsPage() {
  const [userRole, setUserRole] = useState<string | null>(null);
  const [inventory, setInventory] = useState(initialInventory);
  const [transactions, setTransactions] = useState(initialTransactions);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const role = localStorage.getItem('userRole');
      setUserRole(role);
    }
  }, []);

  const { totalSales, totalPurchases } = useMemo(() => {
    return transactions.reduce((acc, tx) => {
        if (tx.type === 'Sale') {
            acc.totalSales += tx.total;
        } else if (tx.type === 'Purchase') {
            acc.totalPurchases += tx.total;
        }
        return acc;
    }, { totalSales: 0, totalPurchases: 0 });
  }, [transactions]);

  const handleSaveTransaction = (transaction: any) => {
    addTransaction(transaction);
    setTransactions(prev => [transaction, ...prev]);

    // Update inventory stock
    setInventory(prevInventory => 
        prevInventory.map(item => {
            if (item.id === transaction.itemId) {
                const newStock = transaction.type === 'Sale' 
                    ? item.stock - transaction.quantity 
                    : item.stock + transaction.quantity;
                return { ...item, stock: newStock };
            }
            return item;
        })
    );
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <div>
            <h1 className="text-3xl font-bold tracking-tight font-headline">TRANSACTIONS</h1>
            <p className="text-muted-foreground">Record new sales and purchases.</p>
        </div>
      </div>
      <Tabs defaultValue="sale" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="sale">New Sale</TabsTrigger>
          <TabsTrigger value="purchase">New Purchase</TabsTrigger>
        </TabsList>
        <TabsContent value="sale">
          <Card>
            <CardHeader>
              <CardTitle>Record New Sale</CardTitle>
              <CardDescription>
                Select a product from inventory to record a sale. This will automatically decrease the stock level.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <TransactionModal type="Sale" inventory={inventory} onSave={handleSaveTransaction} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="purchase">
          <Card>
            <CardHeader>
              <CardTitle>Record New Purchase</CardTitle>
              <CardDescription>
                Record a new purchase to add stock to your inventory.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
                <TransactionModal type="Purchase" inventory={inventory} onSave={handleSaveTransaction} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="grid gap-4 md:grid-cols-2 my-4">
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Penjualan</CardTitle>
                <ArrowUpCircle className="h-4 w-4 text-muted-foreground text-green-500"/>
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(totalSales)}</div>
            </CardContent>
        </Card>
         <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Pembelian</CardTitle>
                <ArrowDownCircle className="h-4 w-4 text-muted-foreground text-red-500"/>
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(totalPurchases)}</div>
            </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
            <div>
                <CardTitle>Transaction History</CardTitle>
                <CardDescription>Your last sales and purchases.</CardDescription>
            </div>
            {userRole === 'owner' && (
                <Button variant="outline">
                    <Download className="mr-2 h-4 w-4" />
                    Download Report
                </Button>
            )}
        </CardHeader>
        <CardContent>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Type</TableHead>
                        <TableHead>Item</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Quantity</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Total</TableHead>
                        <TableHead><span className="sr-only">Invoice</span></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {transactions.map(tx => (
                        <TableRow key={tx.id}>
                            <TableCell>{tx.type}</TableCell>
                            <TableCell>{tx.itemName}</TableCell>
                            <TableCell>
                                <span className={`px-2 py-1 text-xs font-medium rounded-full ${tx.category === 'Purchase' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}>
                                    {tx.category}
                                </span>
                            </TableCell>
                            <TableCell className="text-center">{tx.quantity}</TableCell>
                            <TableCell>{tx.date}</TableCell>
                            <TableCell>{tx.status}</TableCell>
                            <TableCell className="text-right">{formatCurrency(tx.total)}</TableCell>
                            <TableCell className="text-right">
                                <Button variant="outline" size="sm">
                                    <FileText className="mr-2 h-4 w-4" />
                                    Invoice
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </CardContent>
      </Card>
    </>
  )
}
