
"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { PlusCircle, MoreHorizontal, Truck, MapPin, Package, Weight } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { cn } from '@/lib/utils';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type ShipmentStatus = "Diproses" | "Dikirim" | "Tiba di Tujuan" | "Batal";
type WeightUnit = "gr" | "kg";

interface Shipment {
  id: string;
  orderId: string;
  customerName: string;
  address: string;
  itemName: string;
  weight: number;
  weightUnit: WeightUnit;
  courier: string;
  trackingNumber: string;
  status: ShipmentStatus;
  shippingDate: string;
}

const initialShipments: Shipment[] = [];

const getStatusBadgeVariant = (status: ShipmentStatus) => {
  switch (status) {
    case 'Dikirim':
      return 'bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-100';
    case 'Tiba di Tujuan':
      return 'bg-green-100 text-green-800 border-green-200 hover:bg-green-100';
    case 'Batal':
      return 'bg-red-100 text-red-800 border-red-200 hover:bg-red-100';
    case 'Diproses':
    default:
      return 'bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-100';
  }
};

const courierList = [
    { value: 'JNE Express', label: 'JNE Express' },
    { value: 'JNE Trucking (JTR)', label: 'JNE Trucking (JTR)' },
    { value: 'J&T Express', label: 'J&T Express' },
    { value: 'J&T Cargo', label: 'J&T Cargo' },
    { value: 'SiCepat', label: 'SiCepat REG' },
    { value: 'SiCepat Gokil (Cargo)', label: 'SiCepat Gokil (Cargo)' },
    { value: 'Anteraja Reguler', label: 'Anteraja Reguler' },
    { value: 'Anteraja Cargo', label: 'Anteraja Cargo' },
    { value: 'Ninja Xpress', label: 'Ninja Xpress' },
    { value: 'POS Indonesia', label: 'POS Indonesia' },
    { value: 'Tiki', label: 'Tiki' },
    { value: 'Wahana', label: 'Wahana' },
    { value: 'Indah Logistik', label: 'Indah Logistik' },
    { value: 'Dakota Cargo', label: 'Dakota Cargo' },
];


export default function ShippingPage() {
  const [shipments, setShipments] = useState<Shipment[]>(initialShipments);
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [editingShipment, setEditingShipment] = useState<Shipment | null>(null);
  const { toast } = useToast();

  const handleEditClick = (shipment: Shipment) => {
    setEditingShipment(shipment);
    setDialogOpen(true);
  }

  const handleSaveShipment = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const shipmentData = {
        orderId: formData.get('orderId') as string,
        customerName: formData.get('customerName') as string,
        address: formData.get('address') as string,
        itemName: formData.get('itemName') as string,
        weight: parseFloat(formData.get('weight') as string),
        weightUnit: formData.get('weightUnit') as WeightUnit,
        courier: formData.get('courier') as string,
        trackingNumber: formData.get('trackingNumber') as string,
        status: formData.get('status') as ShipmentStatus,
        shippingDate: new Date().toISOString().split('T')[0],
    };

    if (editingShipment) {
        setShipments(shipments.map(s => s.id === editingShipment.id ? { ...s, ...shipmentData } : s));
        toast({ title: "Berhasil", description: `Pengiriman untuk pesanan ${shipmentData.orderId} telah diperbarui.` });
    } else {
        const newShipment = { ...shipmentData, id: `SHP-${Date.now().toString().slice(-4)}` };
        setShipments([newShipment, ...shipments]);
        toast({ title: "Berhasil", description: `Pengiriman baru untuk pesanan ${shipmentData.orderId} telah ditambahkan.` });
    }

    setDialogOpen(false);
    setEditingShipment(null);
  };
  
  const handleTrackShipment = (courier: string, trackingNumber: string) => {
      let trackingUrl = '';
      const lowerCourier = courier.toLowerCase();
      
      if (!trackingNumber) {
          toast({ variant: 'destructive', title: 'Nomor Resi Kosong', description: 'Nomor resi belum diinput untuk pengiriman ini.'});
          return;
      }

      if(lowerCourier.includes('jne')){
          trackingUrl = `https://www.jne.co.id/id/tracking/trace/${trackingNumber}/jne`;
      } else if (lowerCourier.includes('sicepat')) {
          trackingUrl = `https://www.sicepat.com/checkAwb?awb=${trackingNumber}`;
      } else if (lowerCourier.includes('j&t')) {
          trackingUrl = `https://jet.co.id/track?waybill=${trackingNumber}`;
      } else if (lowerCourier.includes('anteraja')) {
          trackingUrl = `https://anteraja.id/tracking/${trackingNumber}`;
      } else if (lowerCourier.includes('pos indonesia')) {
          trackingUrl = `https://www.posindonesia.co.id/id/tracking/${trackingNumber}`;
      } else {
          toast({ variant: 'destructive', title: 'Tidak Didukung', description: `Pelacakan otomatis untuk ${courier} belum tersedia.`});
          return;
      }
      
      window.open(trackingUrl, '_blank');
  }

  return (
    <>
      <div className="flex items-center justify-between">
        <div>
            <h1 className="text-3xl font-bold tracking-tight font-headline">Pengiriman</h1>
            <p className="text-muted-foreground">Kelola dan lacak semua pengiriman pesanan Anda.</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={(isOpen) => { setDialogOpen(isOpen); if (!isOpen) setEditingShipment(null); }}>
            <DialogTrigger asChild>
                <Button onClick={() => setEditingShipment(null)}>
                    <PlusCircle className="mr-2 h-4 w-4" /> Input Pengiriman Baru
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <form onSubmit={handleSaveShipment}>
                    <DialogHeader>
                        <DialogTitle>{editingShipment ? "Edit Pengiriman" : "Input Pengiriman Baru"}</DialogTitle>
                        <DialogDescription>
                            Isi detail pengiriman di bawah ini.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="orderId" className="text-right">ID Pesanan</Label>
                            <Input id="orderId" name="orderId" defaultValue={editingShipment?.orderId} className="col-span-3" placeholder="e.g. S005"/>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="customerName" className="text-right">Nama Pelanggan</Label>
                            <Input id="customerName" name="customerName" defaultValue={editingShipment?.customerName} className="col-span-3" placeholder="Nama lengkap pelanggan"/>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="address" className="text-right">Alamat</Label>
                            <Textarea id="address" name="address" defaultValue={editingShipment?.address} className="col-span-3" placeholder="Alamat lengkap pengiriman"/>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="itemName" className="text-right">Nama Barang</Label>
                            <Input id="itemName" name="itemName" defaultValue={editingShipment?.itemName} className="col-span-3" placeholder="e.g. Laptop Pro"/>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="weight" className="text-right">Berat</Label>
                            <div className="col-span-3 grid grid-cols-3 gap-2">
                                <Input id="weight" name="weight" type="number" step="0.1" defaultValue={editingShipment?.weight} className="col-span-2" placeholder="e.g. 2.5"/>
                                <Select name="weightUnit" defaultValue={editingShipment?.weightUnit || 'kg'}>
                                    <SelectTrigger> <SelectValue /> </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="gr">gr</SelectItem>
                                        <SelectItem value="kg">kg</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                         <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="courier" className="text-right">Kurir</Label>
                            <Select name="courier" defaultValue={editingShipment?.courier}>
                                <SelectTrigger className="col-span-3">
                                    <SelectValue placeholder="Pilih ekspedisi" />
                                </SelectTrigger>
                                <SelectContent>
                                    {courierList.map(courier => (
                                        <SelectItem key={courier.value} value={courier.value}>{courier.label}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="trackingNumber" className="text-right">No. Resi</Label>
                            <Input id="trackingNumber" name="trackingNumber" defaultValue={editingShipment?.trackingNumber} className="col-span-3" placeholder="Nomor pelacakan dari kurir"/>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="status" className="text-right">Status</Label>
                            <Select name="status" defaultValue={editingShipment?.status}>
                                <SelectTrigger className="col-span-3">
                                    <SelectValue placeholder="Pilih status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Diproses">Diproses</SelectItem>
                                    <SelectItem value="Dikirim">Dikirim</SelectItem>
                                    <SelectItem value="Tiba di Tujuan">Tiba di Tujuan</SelectItem>
                                    <SelectItem value="Batal">Batal</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="submit">Simpan</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Riwayat Pengiriman</CardTitle>
          <CardDescription>Daftar semua pengiriman yang sedang berjalan dan telah selesai.</CardDescription>
        </CardHeader>
        <CardContent>
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Detail Pesanan</TableHead>
                    <TableHead>Pelanggan & Alamat</TableHead>
                    <TableHead>Kurir & No. Resi</TableHead>
                    <TableHead className="text-center">Status</TableHead>
                    <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {shipments.map((shipment) => (
                    <TableRow key={shipment.id}>
                        <TableCell className="font-medium">
                            <div>{shipment.orderId}</div>
                            <div className="text-xs text-muted-foreground">{shipment.shippingDate}</div>
                            <div className="text-sm pt-1 space-y-1">
                                <div className="flex items-center gap-1"><Package className="h-3 w-3 text-muted-foreground"/> {shipment.itemName}</div>
                                <div className="flex items-center gap-1"><Weight className="h-3 w-3 text-muted-foreground"/> {shipment.weight} {shipment.weightUnit}</div>
                            </div>
                        </TableCell>
                        <TableCell>
                            <div>{shipment.customerName}</div>
                            <div className="text-xs text-muted-foreground flex items-center gap-1"><MapPin className="h-3 w-3"/>{shipment.address}</div>
                        </TableCell>
                        <TableCell>
                            <div>{shipment.courier}</div>
                            <div className="text-xs text-muted-foreground font-mono">{shipment.trackingNumber}</div>
                        </TableCell>
                        <TableCell className="text-center">
                            <Badge variant="outline" className={cn("w-full max-w-[120px] mx-auto justify-center", getStatusBadgeVariant(shipment.status))}>
                                {shipment.status}
                            </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                           <div className="flex items-center justify-end gap-2">
                                <Button variant="outline" size="sm" onClick={() => handleTrackShipment(shipment.courier, shipment.trackingNumber)}>
                                    <Truck className="mr-2 h-4 w-4" /> Lacak
                                </Button>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button size="icon" variant="ghost">
                                            <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem onSelect={() => handleEditClick(shipment)}>Edit</DropdownMenuItem>
                                        <DropdownMenuItem className="text-destructive focus:text-destructive focus:bg-destructive/10">Hapus</DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
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
