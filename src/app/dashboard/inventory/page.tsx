
'use client';

import { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogClose,
  } from "@/components/ui/dialog"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
  } from "@/components/ui/pagination"
import { Badge } from '@/components/ui/badge';
import { PlusCircle, MoreHorizontal, X, Package } from 'lucide-react';
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from '@/lib/utils';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';


const initialItems = [
    { id: '1', name: 'Ground Arabika 250gr Full Roasted', sku: 'GROUND-ARB-250G-FR', dateIn: '2023-10-01', stock: 25, price: 85000, category: 'Production' },
    { id: '2', name: 'Ground Arabika 250gr Medium Roasted', sku: 'GROUND-ARB-250G-MR', dateIn: '2023-10-01', stock: 30, price: 80000, category: 'Production' },
    { id: '3', name: 'Ground Arabika 250gr Light Roasted', sku: 'GROUND-ARB-250G-LR', dateIn: '2023-10-01', stock: 15, price: 75000, category: 'Production' },
    { id: '4', name: 'Ground Arabika 500gr Full Roasted', sku: 'GROUND-ARB-500G-FR', dateIn: '2023-10-01', stock: 20, price: 160000, category: 'Production' },
    { id: '5', name: 'Ground Arabika 500gr Medium Roasted', sku: 'GROUND-ARB-500G-MR', dateIn: '2023-10-01', stock: 8, price: 150000, category: 'Production' },
    { id: '6', name: 'Ground Arabika 500gr Light Roasted', sku: 'GROUND-ARB-500G-LR', dateIn: '2023-10-01', stock: 12, price: 145000, category: 'Production' },
    { id: '7', name: 'Ground Arabika 1Kg Full Roasted', sku: 'GROUND-ARB-1KG-FR', dateIn: '2023-10-01', stock: 18, price: 300000, category: 'Production' },
    { id: '8', name: 'Ground Arabika 1Kg Medium Roasted', sku: 'GROUND-ARB-1KG-MR', dateIn: '2023-10-01', stock: 22, price: 290000, category: 'Production' },
    { id: '9', name: 'Ground Arabika 1Kg Light Roasted', sku: 'GROUND-ARB-1KG-LR', dateIn: '2023-10-01', stock: 9, price: 280000, category: 'Production' },
    { id: '10', name: 'Ground Robusta 250gr Full Roasted', sku: 'GROUND-ROB-250G-FR', dateIn: '2023-10-02', stock: 40, price: 65000, category: 'Production' },
    { id: '11', name: 'Ground Robusta 250gr Medium Roasted', sku: 'GROUND-ROB-250G-MR', dateIn: '2023-10-02', stock: 50, price: 60000, category: 'Production' },
    { id: '12', name: 'Ground Robusta 250gr Light Roasted', sku: 'GROUND-ROB-250G-LR', dateIn: '2023-10-02', stock: 0, price: 55000, category: 'Production' },
    { id: '13', name: 'Ground Robusta 500gr Full Roasted', sku: 'GROUND-ROB-500G-FR', dateIn: '2023-10-02', stock: 35, price: 120000, category: 'Production' },
    { id: '14', name: 'Ground Robusta 500gr Medium Roasted', sku: 'GROUND-ROB-500G-MR', dateIn: '2023-10-02', stock: 28, price: 110000, category: 'Production' },
    { id: '15', name: 'Ground Robusta 500gr Light Roasted', sku: 'GROUND-ROB-500G-LR', dateIn: '2023-10-02', stock: 11, price: 105000, category: 'Production' },
    { id: '16', name: 'Ground Robusta 1Kg Full Roasted', sku: 'GROUND-ROB-1KG-FR', dateIn: '2023-10-02', stock: 25, price: 230000, category: 'Production' },
    { id: '17', name: 'Ground Robusta 1Kg Medium Roasted', sku: 'GROUND-ROB-1KG-MR', dateIn: '2023-10-02', stock: 19, price: 220000, category: 'Production' },
    { id: '18', name: 'Ground Robusta 1Kg Light Roasted', sku: 'GROUND-ROB-1KG-LR', dateIn: '2023-10-02', stock: 5, price: 210000, category: 'Production' },
    { id: '19', name: 'Green Beans Arabika 1Kg Honey Process', sku: 'GREENBEANS-ARB-1KG-HONEY', dateIn: '2023-10-03', stock: 10, price: 250000, category: 'Purchase' },
    { id: '20', name: 'Green Beans Arabika 1Kg Natural Process', sku: 'GREENBEANS-ARB-1KG-NAT', dateIn: '2023-10-03', stock: 15, price: 240000, category: 'Purchase' },
    { id: '21', name: 'Green Beans Robusta 1Kg Washed Process', sku: 'GREENBEANS-ROB-1KG-WASH', dateIn: '2023-10-03', stock: 20, price: 180000, category: 'Purchase' },
    { id: '22', name: 'Roasted Beans Arabika 250gr Medium Roasted', sku: 'ROASTEDBEANS-ARB-250G-MR', dateIn: '2023-10-04', stock: 25, price: 90000, category: 'Production' },
    { id: '23', name: 'Roasted Beans Robusta 500gr Full Roasted', sku: 'ROASTEDBEANS-ROB-500G-FR', dateIn: '2023-10-04', stock: 30, price: 130000, category: 'Production' },
    { id: '24', name: 'Roasted Beans Spesial Blend 1Kg Medium Roasted', sku: 'ROASTEDBEANS-SPB-1KG-MR', dateIn: '2023-10-04', stock: 12, price: 280000, category: 'Production' },
    { id: '25', name: 'Ground Spesial Blend 250gr Full Roasted', sku: 'GROUND-SPB-250G-FR', dateIn: '2023-10-05', stock: 30, price: 95000, category: 'Production' },
    { id: '26', name: 'Ground Spesial Blend 500gr Medium Roasted', sku: 'GROUND-SPB-500G-MR', dateIn: '2023-10-05', stock: 18, price: 180000, category: 'Production' },
    { id: '27', name: 'Green Beans Arabika 250gr Honey Process', sku: 'GREENBEANS-ARB-250G-HONEY', dateIn: '2023-10-06', stock: 50, price: 70000, category: 'Purchase' },
    { id: '28', name: 'Green Beans Robusta 500gr Natural Process', sku: 'GREENBEANS-ROB-500G-NAT', dateIn: '2023-10-06', stock: 40, price: 100000, category: 'Purchase' },
    { id: '29', name: 'Roasted Beans Spesial Blend 250gr Light Roasted', sku: 'ROASTEDBEANS-SPB-250G-LR', dateIn: '2023-10-07', stock: 22, price: 92000, category: 'Production' },
    { id: '30', name: 'Ground Arabika 1Kg Medium Roasted', sku: 'GROUND-ARB-1KG-MR-2', dateIn: '2023-10-08', stock: 14, price: 290000, category: 'Production' },
    { id: '31', name: 'Green Beans Spesial Blend 1Kg Washed Process', sku: 'GREENBEANS-SPB-1KG-WASH', dateIn: '2023-10-09', stock: 25, price: 260000, category: 'Purchase' },
    { id: '32', name: 'Roasted Beans Robusta 1Kg Full Roasted', sku: 'ROASTEDBEANS-ROB-1KG-FR-2', dateIn: '2023-10-10', stock: 3, price: 240000, category: 'Production' },
];

type InventoryItem = typeof initialItems[0];

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
}

const getStatus = (stock: number) => {
    if (stock <= 0) return { text: 'Out of Stock', className: 'bg-red-100 text-red-800 border-red-200 hover:bg-red-100' };
    if (stock <= 10) return { text: 'Low Stock', className: 'bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-100' };
    return { text: 'In Stock', className: 'bg-green-100 text-green-800 border-green-200 hover:bg-green-100' };
  };

const ITEMS_PER_PAGE = 30;

export default function InventoryPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [items, setItems] = useState(initialItems);
    const [isDialogOpen, setDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
    const [currentPage, setCurrentPage] = useState(1);

    const statusFilter = searchParams.get('filter');
    const categoryFilter = searchParams.get('category');

    const filteredItems = useMemo(() => {
        let filtered = items;
        if (statusFilter === 'low') {
            filtered = items.filter(item => item.stock > 0 && item.stock <= 10);
        } else if (statusFilter === 'empty') {
            filtered = items.filter(item => item.stock === 0);
        } else if (statusFilter === 'in-stock') {
            filtered = items.filter(item => item.stock > 10);
        }

        if (categoryFilter) {
            filtered = filtered.filter(item => item.category === categoryFilter);
        }

        return filtered.sort((a, b) => a.name.localeCompare(b.name));
    }, [items, statusFilter, categoryFilter]);

    const totalPages = Math.ceil(filteredItems.length / ITEMS_PER_PAGE);

    const paginatedItems = useMemo(() => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        const endIndex = startIndex + ITEMS_PER_PAGE;
        return filteredItems.slice(startIndex, endIndex);
    }, [filteredItems, currentPage]);

    useEffect(() => {
        setCurrentPage(1);
    }, [statusFilter, categoryFilter]);

    const handleFilterChange = (type: 'status' | 'category', value: string) => {
        const params = new URLSearchParams(window.location.search);
        if (value === 'all') {
            params.delete(type === 'status' ? 'filter' : 'category');
        } else {
             params.set(type === 'status' ? 'filter' : 'category', value);
        }
        router.push(`/dashboard/inventory?${params.toString()}`);
    };
    
    const clearFilters = () => {
        router.push('/dashboard/inventory');
    }

    const handleEditClick = (item: InventoryItem) => {
        setSelectedItem(item);
        setDialogOpen(true);
    };

    const handleDeleteClick = (item: InventoryItem) => {
        setSelectedItem(item);
        setDeleteDialogOpen(true);
    }

    const confirmDelete = () => {
        if (selectedItem) {
            setItems(items.filter(item => item.id !== selectedItem.id));
            setDeleteDialogOpen(false);
            setSelectedItem(null);
        }
    }

    const handleSaveItem = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const newItemData = {
            name: formData.get('name') as string,
            sku: formData.get('sku') as string,
            price: Number(formData.get('price')),
            stock: Number(formData.get('quantity')),
            dateIn: new Date().toISOString().split('T')[0],
            category: formData.get('category') as string,
        };

        if (selectedItem) {
            setItems(items.map(item => item.id === selectedItem.id ? { ...item, ...newItemData } : item));
        } else {
            setItems([...items, { ...newItemData, id: String(Date.now()) }]);
        }

        setDialogOpen(false);
        setSelectedItem(null);
    }


  return (
    <>
    <div className="flex items-center justify-between">
        <div>
            <h1 className="text-3xl font-bold tracking-tight font-headline">INVENTORY</h1>
            <p className="text-muted-foreground">Manage your products and stock levels.</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={(isOpen) => { setDialogOpen(isOpen); if (!isOpen) setSelectedItem(null); }}>
            <DialogTrigger asChild>
                <Button size="sm" className="h-8 gap-1" onClick={() => setSelectedItem(null)}>
                    <PlusCircle className="h-3.5 w-3.5" />
                    <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                        Add New Item
                    </span>
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <form onSubmit={handleSaveItem}>
                    <DialogHeader>
                        <DialogTitle>{selectedItem ? 'Edit Item' : 'Add New Item'}</DialogTitle>
                        <DialogDescription>
                            {selectedItem ? 'Change the item details below.' : 'Fill in the new item details below. Click save when done.'}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="name" className="text-right">Item Name</Label>
                            <Input id="name" name="name" defaultValue={selectedItem?.name} placeholder='e.g. "Laptop Pro 15"' className="col-span-3" />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="sku" className="text-right">SKU Code</Label>
                            <Input id="sku" name="sku" defaultValue={selectedItem?.sku} placeholder='e.g. "LP15-2024"' className="col-span-3" />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="category" className="text-right">Category</Label>
                            <Select name="category" defaultValue={selectedItem?.category}>
                                <SelectTrigger className="col-span-3">
                                    <SelectValue placeholder="Select category" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Purchase">Purchase</SelectItem>
                                    <SelectItem value="Production">Production</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="quantity" className="text-right">Quantity</Label>
                            <Input id="quantity" name="quantity" defaultValue={selectedItem?.stock} type="number" placeholder="e.g. 25" className="col-span-3" />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="satuan" className="text-right">Unit</Label>
                            <Select name="satuan">
                                <SelectTrigger className="col-span-3">
                                    <SelectValue placeholder="Select unit" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="gr">gr</SelectItem>
                                    <SelectItem value="kg">kg</SelectItem>
                                    <SelectItem value="pcs">pcs</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="price" className="text-right">Price</Label>
                            <Input id="price" name="price" defaultValue={selectedItem?.price} type="number" placeholder="e.g. 15000000" className="col-span-3" />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="submit">Save</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    </div>

    <Card>
        <CardHeader>
        <div className="flex items-center justify-between gap-4">
            <div>
                <CardTitle>Product List</CardTitle>
                <CardDescription>
                    List of all products in your inventory. Showing {paginatedItems.length} of {filteredItems.length} items.
                </CardDescription>
            </div>
            <div className="flex items-center gap-2">
                 <Select value={statusFilter || 'all'} onValueChange={(val) => handleFilterChange('status', val)}>
                    <SelectTrigger className="w-full md:w-[180px]">
                        <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="in-stock">In Stock</SelectItem>
                        <SelectItem value="low">Low Stock</SelectItem>
                        <SelectItem value="empty">Out of Stock</SelectItem>
                    </SelectContent>
                </Select>
                <Select value={categoryFilter || 'all'} onValueChange={(val) => handleFilterChange('category', val)}>
                    <SelectTrigger className="w-full md:w-[180px]">
                        <SelectValue placeholder="Filter by category" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        <SelectItem value="Purchase">Purchase</SelectItem>
                        <SelectItem value="Production">Production</SelectItem>
                    </SelectContent>
                </Select>
                 {(statusFilter || categoryFilter) && (
                    <Button variant="outline" size="sm" onClick={clearFilters}>
                        <X className="mr-2 h-4 w-4" />
                        Clear
                    </Button>
                )}
            </div>
        </div>
        </CardHeader>
        <CardContent>
        <Table>
            <TableHeader>
            <TableRow>
                <TableHead>Item Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="text-center">SKU Code</TableHead>
                <TableHead className="text-center">Stock</TableHead>
                <TableHead className="text-center">Stock Status</TableHead>
                <TableHead className="text-right">Price</TableHead>
                <TableHead>
                <span className="sr-only">Actions</span>
                </TableHead>
            </TableRow>
            </TableHeader>
            <TableBody>
            {paginatedItems.map((item: InventoryItem) => {
                const status = getStatus(item.stock);
                return (
                <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell>
                        <Badge variant={item.category === 'Purchase' ? 'secondary' : 'default'} className="capitalize">
                            <Package className="mr-1 h-3 w-3"/>
                            {item.category}
                        </Badge>
                    </TableCell>
                    <TableCell className="text-center">{item.sku}</TableCell>
                    <TableCell className="text-center font-semibold">{item.stock}</TableCell>
                    <TableCell className="text-center">
                        <Badge variant="outline" className={cn("w-full max-w-[120px] mx-auto justify-center", status.className)}>{status.text}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                        {formatCurrency(item.price)}
                    </TableCell>
                    <TableCell>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                        <Button aria-haspopup="true" size="icon" variant="ghost">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Toggle menu</span>
                        </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onSelect={() => handleEditClick(item)}>Edit</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive focus:text-destructive focus:bg-destructive/10" onSelect={() => handleDeleteClick(item)}>Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    </TableCell>
                </TableRow>
                );
            })}
            </TableBody>
        </Table>
        </CardContent>
        {totalPages > 1 && (
            <CardFooter>
                <Pagination>
                    <PaginationContent>
                        <PaginationItem>
                            <PaginationPrevious 
                                href="#"
                                onClick={(e) => { e.preventDefault(); setCurrentPage(prev => Math.max(1, prev - 1)); }}
                                className={currentPage === 1 ? 'pointer-events-none opacity-50' : undefined}
                            />
                        </PaginationItem>
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                            <PaginationItem key={page}>
                                <PaginationLink 
                                    href="#"
                                    onClick={(e) => { e.preventDefault(); setCurrentPage(page); }}
                                    isActive={currentPage === page}
                                >
                                    {page}
                                </PaginationLink>
                            </PaginationItem>
                        ))}
                        <PaginationItem>
                            <PaginationNext 
                                href="#"
                                onClick={(e) => { e.preventDefault(); setCurrentPage(prev => Math.min(totalPages, prev + 1)); }}
                                className={currentPage === totalPages ? 'pointer-events-none opacity-50' : undefined}
                            />
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>
            </CardFooter>
        )}
    </Card>

    <AlertDialog open={isDeleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle>Are you sure you want to delete?</AlertDialogTitle>
                <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete the item data.
                </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
                <AlertDialogCancel onClick={() => setSelectedItem(null)}>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={confirmDelete}>Delete</AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
    </AlertDialog>
    </>
  );
}

    
