
'use client';

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { PlusCircle, Trash2, FileText, Download, Send, CalendarIcon, RefreshCcw } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { format } from 'date-fns';
import { id as localeID } from 'date-fns/locale';
import { cn } from '@/lib/utils';


interface InvoiceItem {
  id: number;
  description: string;
  quantity: number;
  unit: string;
  price: number;
}

interface SavedInvoice {
    id: string;
    customerName: string;
    customerEmail: string;
    items: InvoiceItem[];
    notes: string;
    paymentMethod: string;
    total: number;
    invoiceDate: Date;
    dueDate?: Date;
}

const initialItems: InvoiceItem[] = [{ id: 1, description: '', quantity: 1, unit: 'pcs', price: 0 }];

export default function InvoicePage() {
  const [items, setItems] = useState<InvoiceItem[]>(initialItems);
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [notes, setNotes] = useState('');
  const [invoiceHistory, setInvoiceHistory] = useState<SavedInvoice[]>([]);
  
  const [currentInvoice, setCurrentInvoice] = useState<SavedInvoice | null>(null);
  const [isInvoicePreviewOpen, setInvoicePreviewOpen] = useState(false);
  const [whatsAppNumber, setWhatsAppNumber] = useState('');

  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [invoiceDate, setInvoiceDate] = useState<Date | undefined>(new Date());
  const [dueDate, setDueDate] = useState<Date | undefined>();

  const { toast } = useToast();

  const generateInvoiceNumber = () => {
    const date = invoiceDate ? format(invoiceDate, 'ddMMyy') : format(new Date(), 'ddMMyy');
    const sequence = (invoiceHistory.length + 1).toString().padStart(4, '0');
    setInvoiceNumber(`KINETA-INV-${date}-${sequence}`);
  };

  useEffect(() => {
    generateInvoiceNumber();
  }, [invoiceDate, invoiceHistory.length]);

  const handleAddItem = () => {
    setItems([...items, { id: Date.now(), description: '', quantity: 1, unit: 'pcs', price: 0 }]);
  };

  const handleRemoveItem = (id: number) => {
    setItems(items.filter(item => item.id !== id));
  };

  const handleItemChange = (id: number, field: keyof Omit<InvoiceItem, 'id'>, value: string | number) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, [field]: typeof value === 'string' ? value : Math.max(0, value) } : item
    ));
  };
  
  const resetForm = () => {
    setCustomerName('');
    setCustomerEmail('');
    setPaymentMethod('');
    setItems(initialItems);
    setNotes('');
    setInvoiceDate(new Date());
    setDueDate(undefined);
    generateInvoiceNumber();
  }

  const total = items.reduce((acc, item) => acc + (item.quantity * item.price), 0);

  const generateInvoicePDF = (invoice: SavedInvoice) => {
    const doc = new jsPDF();
    
    doc.setFontSize(22);
    doc.text(`Invoice #${invoice.id}`, 14, 22);
    doc.setFontSize(12);
    doc.text(`Tanggal Invoice: ${format(invoice.invoiceDate, 'd MMMM yyyy', { locale: localeID })}`, 14, 32);
    if (invoice.dueDate) {
        doc.text(`Jatuh Tempo: ${format(invoice.dueDate, 'd MMMM yyyy', { locale: localeID })}`, 14, 38);
    }
    doc.text(`Untuk: ${invoice.customerName} (${invoice.customerEmail || 'N/A'})`, 14, 44);
    doc.text(`Metode Pembayaran: ${invoice.paymentMethod}`, 14, 50);
  
    (doc as any).autoTable({
        startY: 60,
        head: [['Deskripsi', 'Jumlah', 'Satuan', 'Harga Satuan', 'Total']],
        body: invoice.items.map(item => [
            item.description,
            item.quantity,
            item.unit,
            `Rp ${new Intl.NumberFormat('id-ID').format(item.price)}`,
            `Rp ${new Intl.NumberFormat('id-ID').format(item.quantity * item.price)}`
        ]),
        headStyles: { fillColor: [31, 42, 68] },
    });

    const finalY = (doc as any).lastAutoTable.finalY;
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text(`Total: Rp ${new Intl.NumberFormat('id-ID').format(invoice.total)}`, 196, finalY + 16, { align: 'right' });
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(12);
    doc.text(`Catatan: ${invoice.notes || '-'}`, 14, finalY + 24);
    
    return doc;
  };

  const handleDownloadPdf = (invoice: SavedInvoice) => {
    const doc = generateInvoicePDF(invoice);
    doc.save(`invoice-${invoice.id}.pdf`);
  };

  const handleSendWhatsApp = (invoice: SavedInvoice) => {
    if (!whatsAppNumber) {
        toast({
            variant: "destructive",
            title: "Nomor WhatsApp Diperlukan",
            description: "Silakan masukkan nomor WhatsApp tujuan.",
        });
        return;
    }
    const message = encodeURIComponent(
        `Halo ${invoice.customerName},\n\nBerikut adalah invoice Anda dengan nomor #${invoice.id} sebesar ${new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(invoice.total)}.\n\nJatuh tempo pada ${invoice.dueDate ? format(invoice.dueDate, 'd MMMM yyyy', { locale: localeID }) : 'Segera'}.\nPembayaran via ${invoice.paymentMethod}.\n\nSilakan periksa detailnya. Terima kasih!\n\n(File PDF invoice akan dilampirkan secara manual)`
    );
    const sanitizedNumber = whatsAppNumber.replace(/[^0-9]/g, '');
    window.open(`https://wa.me/${sanitizedNumber}?text=${message}`, '_blank');
    toast({
        title: "Siapkan PDF",
        description: "Unduh PDF di bawah ini dan lampirkan secara manual di WhatsApp.",
    });
  };

  const handleCreateAndSave = () => {
    if (!customerName || !paymentMethod || !invoiceNumber || !invoiceDate || !items.some(item => item.description && item.price > 0)) {
        toast({
            variant: "destructive",
            title: "Gagal Membuat Invoice",
            description: "No. Invoice, tanggal, nama pelanggan, metode pembayaran, dan minimal satu item dengan harga harus diisi.",
        });
        return;
    }

    const newInvoice: SavedInvoice = {
        id: invoiceNumber,
        customerName,
        customerEmail,
        items,
        notes,
        paymentMethod,
        total,
        invoiceDate,
        dueDate,
    };

    setInvoiceHistory(prev => [newInvoice, ...prev]);
    setCurrentInvoice(newInvoice);
    setInvoicePreviewOpen(true);
    
    toast({
        title: "Invoice Dibuat!",
        description: `Invoice ${newInvoice.id} telah disimpan dan siap diunduh/dikirim.`,
    });
    
    resetForm();
  };

  const handleViewInvoice = (invoice: SavedInvoice) => {
    setCurrentInvoice(invoice);
    setInvoicePreviewOpen(true);
  }


  return (
    <>
      <div className="flex items-center justify-between">
        <div>
            <h1 className="text-3xl font-bold tracking-tight font-headline">Generate Invoice</h1>
            <p className="text-muted-foreground">Buat invoice manual untuk transaksi di luar aplikasi.</p>
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Invoice Baru</CardTitle>
          <CardDescription>Isi detail di bawah ini untuk membuat invoice.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-8">
            <div className="grid md:grid-cols-2 gap-6 items-start">
                <div className="grid gap-6">
                    <div className="grid gap-2">
                        <Label htmlFor="invoice-number">Nomor Invoice</Label>
                        <div className="flex items-center gap-2">
                            <Input id="invoice-number" value={invoiceNumber} onChange={(e) => setInvoiceNumber(e.target.value)} />
                            <Button variant="outline" size="icon" onClick={generateInvoiceNumber}><RefreshCcw className="h-4 w-4" /></Button>
                        </div>
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="customer-name">Nama Pelanggan</Label>
                        <Input id="customer-name" placeholder="Masukkan nama pelanggan" value={customerName} onChange={(e) => setCustomerName(e.target.value)} />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="customer-email">Email Pelanggan</Label>
                        <Input id="customer-email" type="email" placeholder="Masukkan email pelanggan" value={customerEmail} onChange={(e) => setCustomerEmail(e.target.value)} />
                    </div>
                </div>

                <div className="grid gap-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="invoice-date">Tanggal Invoice</Label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button variant={"outline"} className={cn("justify-start text-left font-normal", !invoiceDate && "text-muted-foreground")}>
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {invoiceDate ? format(invoiceDate, "d MMMM yyyy", { locale: localeID }) : <span>Pilih tanggal</span>}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0">
                                    <Calendar mode="single" selected={invoiceDate} onSelect={setInvoiceDate} initialFocus />
                                </PopoverContent>
                            </Popover>
                        </div>
                         <div className="grid gap-2">
                            <Label htmlFor="due-date">Tanggal Jatuh Tempo</Label>
                             <Popover>
                                <PopoverTrigger asChild>
                                    <Button variant={"outline"} className={cn("justify-start text-left font-normal", !dueDate && "text-muted-foreground")}>
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {dueDate ? format(dueDate, "d MMMM yyyy", { locale: localeID }) : <span>Pilih tanggal</span>}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0">
                                    <Calendar mode="single" selected={dueDate} onSelect={setDueDate} initialFocus />
                                </PopoverContent>
                            </Popover>
                        </div>
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="payment-method">Metode Pembayaran</Label>
                        <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                            <SelectTrigger id="payment-method">
                                <SelectValue placeholder="Pilih metode" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Tunai">Tunai</SelectItem>
                                <SelectItem value="Kredit">Kredit</SelectItem>
                                <SelectItem value="Transfer Bank">Transfer Bank</SelectItem>
                                <SelectItem value="E-Wallet">E-Wallet</SelectItem>
                                <SelectItem value="QRIS">QRIS</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </div>

          <div className="grid gap-4">
            <Label>Item Invoice</Label>
            <div className="overflow-x-auto">
                <Table>
                <TableHeader>
                    <TableRow>
                    <TableHead className="min-w-[300px]">Deskripsi</TableHead>
                    <TableHead className="text-center w-[100px]">Jumlah</TableHead>
                    <TableHead className="text-center w-[120px]">Satuan</TableHead>
                    <TableHead className="text-right w-[180px]">Harga Satuan (Rp)</TableHead>
                    <TableHead className="text-right w-[180px]">Total (Rp)</TableHead>
                    <TableHead className="w-[50px]"><span className="sr-only">Hapus</span></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {items.map((item, index) => (
                    <TableRow key={item.id}>
                        <TableCell>
                        <Input 
                            placeholder={`e.g. Produk ${index + 1}`} 
                            value={item.description}
                            onChange={(e) => handleItemChange(item.id, 'description', e.target.value)}
                        />
                        </TableCell>
                        <TableCell>
                        <Input 
                            type="number" 
                            className="text-center" 
                            value={item.quantity}
                            min="1"
                            onChange={(e) => handleItemChange(item.id, 'quantity', parseInt(e.target.value, 10) || 1)}
                        />
                        </TableCell>
                        <TableCell>
                            <Select value={item.unit} onValueChange={(value) => handleItemChange(item.id, 'unit', value)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Pilih satuan" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="pcs">pcs</SelectItem>
                                    <SelectItem value="unit">unit</SelectItem>
                                    <SelectItem value="kg">kg</SelectItem>
                                    <SelectItem value="gr">gr</SelectItem>
                                    <SelectItem value="liter">liter</SelectItem>
                                    <SelectItem value="box">box</SelectItem>
                                    <SelectItem value="lusin">lusin</SelectItem>
                                </SelectContent>
                            </Select>
                        </TableCell>
                        <TableCell>
                        <Input 
                            type="number" 
                            className="text-right" 
                            value={item.price}
                            min="0"
                            onChange={(e) => handleItemChange(item.id, 'price', parseFloat(e.target.value) || 0)}
                        />
                        </TableCell>
                        <TableCell className="text-right font-medium">
                        {new Intl.NumberFormat('id-ID').format(item.quantity * item.price)}
                        </TableCell>
                        <TableCell>
                        <Button variant="ghost" size="icon" onClick={() => handleRemoveItem(item.id)} disabled={items.length <= 1}>
                            <Trash2 className="h-4 w-4 text-destructive" />
                            <span className="sr-only">Hapus item</span>
                            </Button>
                        </TableCell>
                    </TableRow>
                    ))}
                </TableBody>
                </Table>
            </div>
            <Button variant="outline" size="sm" className="w-fit" onClick={handleAddItem}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Tambah Item
            </Button>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="grid gap-2">
                <Label htmlFor="notes">Catatan Tambahan</Label>
                <Textarea id="notes" placeholder="Tulis catatan atau instruksi pembayaran di sini..." value={notes} onChange={(e) => setNotes(e.target.value)} />
            </div>
            <div className="flex justify-end">
              <div className="grid gap-2 w-full max-w-sm">
                <div className="flex justify-between font-bold text-lg border-t pt-2 mt-2">
                  <span>Total</span>
                  <span>Rp {new Intl.NumberFormat('id-ID').format(total)}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="justify-end gap-2 border-t pt-6">
            <Button variant="outline" onClick={resetForm}>Batal</Button>
            <Button onClick={handleCreateAndSave}>Buat & Simpan Invoice</Button>
        </CardFooter>
      </Card>
      
      <Card className="mt-8">
          <CardHeader>
              <CardTitle>Riwayat Invoice</CardTitle>
              <CardDescription>Daftar invoice yang telah Anda buat.</CardDescription>
          </CardHeader>
          <CardContent>
              {invoiceHistory.length === 0 ? (
                  <div className="text-center text-muted-foreground py-10">
                      <FileText className="mx-auto h-12 w-12" />
                      <h3 className="mt-4 text-lg font-semibold">Belum ada riwayat</h3>
                      <p className="mt-1 text-sm">Invoice yang Anda buat akan muncul di sini.</p>
                  </div>
              ) : (
                  <Table>
                      <TableHeader>
                          <TableRow>
                              <TableHead>Invoice ID</TableHead>
                              <TableHead>Tanggal</TableHead>
                              <TableHead>Pelanggan</TableHead>
                              <TableHead className="text-right">Total</TableHead>
                              <TableHead className="text-right">Aksi</TableHead>
                          </TableRow>
                      </TableHeader>
                      <TableBody>
                          {invoiceHistory.map(invoice => (
                              <TableRow key={invoice.id}>
                                  <TableCell className="font-medium">{invoice.id}</TableCell>
                                  <TableCell>{format(invoice.invoiceDate, 'd MMMM yyyy', { locale: localeID })}</TableCell>
                                  <TableCell>{invoice.customerName}</TableCell>
                                  <TableCell className="text-right">{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(invoice.total)}</TableCell>
                                  <TableCell className="text-right">
                                      <Button variant="outline" size="sm" onClick={() => handleViewInvoice(invoice)}>Lihat Invoice</Button>
                                  </TableCell>
                              </TableRow>
                          ))}
                      </TableBody>
                  </Table>
              )}
          </CardContent>
      </Card>

      {/* Invoice Preview Dialog */}
      <Dialog open={isInvoicePreviewOpen} onOpenChange={setInvoicePreviewOpen}>
        <DialogContent className="max-w-2xl">
          {currentInvoice && (
            <>
              <DialogHeader>
                <DialogTitle>Pratinjau Invoice #{currentInvoice.id}</DialogTitle>
                <DialogDescription>
                  Invoice untuk {currentInvoice.customerName}. Silakan unduh atau kirim.
                </DialogDescription>
              </DialogHeader>
              <div className="max-h-[60vh] overflow-y-auto p-2 border rounded-md my-4">
                 <div className="p-6 bg-white text-black">
                    <h2 className="text-2xl font-bold mb-4">Invoice #{currentInvoice.id}</h2>
                    <p><strong>Tanggal Invoice:</strong> {format(currentInvoice.invoiceDate, 'd MMMM yyyy', { locale: localeID })}</p>
                    {currentInvoice.dueDate && <p><strong>Jatuh Tempo:</strong> {format(currentInvoice.dueDate, 'd MMMM yyyy', { locale: localeID })}</p>}
                    <p><strong>Untuk:</strong> {currentInvoice.customerName}</p>
                    <p className="mb-4"><strong>Metode Pembayaran:</strong> {currentInvoice.paymentMethod}</p>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Deskripsi</TableHead>
                                <TableHead className='text-center'>Jumlah</TableHead>
                                <TableHead className='text-center'>Satuan</TableHead>
                                <TableHead className='text-right'>Harga Satuan</TableHead>
                                <TableHead className='text-right'>Total</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {currentInvoice.items.map(item => (
                                <TableRow key={item.id}>
                                    <TableCell>{item.description}</TableCell>
                                    <TableCell className='text-center'>{item.quantity}</TableCell>
                                    <TableCell className='text-center'>{item.unit}</TableCell>
                                    <TableCell className='text-right'>{new Intl.NumberFormat('id-ID').format(item.price)}</TableCell>
                                    <TableCell className='text-right'>{new Intl.NumberFormat('id-ID').format(item.quantity * item.price)}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                    <div className="flex justify-end mt-4">
                        <div className="w-64 space-y-2">
                            <div className="flex justify-between font-bold text-lg border-t pt-2"><span>Total:</span><span>Rp {new Intl.NumberFormat('id-ID').format(currentInvoice.total)}</span></div>
                        </div>
                    </div>
                 </div>
              </div>
              <DialogFooter className="justify-between">
                <div className="flex items-center gap-2">
                    <Input 
                        type="tel" 
                        placeholder="Nomor WhatsApp (e.g. 6281...)" 
                        value={whatsAppNumber} 
                        onChange={(e) => setWhatsAppNumber(e.target.value)}
                    />
                    <Button variant="outline" size="icon" onClick={() => handleSendWhatsApp(currentInvoice)}>
                        <Send className="h-4 w-4" />
                        <span className="sr-only">Kirim via WhatsApp</span>
                    </Button>
                </div>
                <Button onClick={() => handleDownloadPdf(currentInvoice)}>
                  <Download className="mr-2 h-4 w-4" /> Unduh PDF
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
