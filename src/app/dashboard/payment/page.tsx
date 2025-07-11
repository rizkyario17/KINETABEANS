
"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlusCircle, Copy, Banknote, Trash2, Wallet, QrCode, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Image from 'next/image';

const bankList = [
    { code: "014", name: "BCA" },
    { code: "008", name: "Mandiri" },
    { code: "009", name: "BNI" },
    { code: "002", name: "BRI" },
    { code: "427", name: "CIMB Niaga" },
    { code: "022", name: "Danamon" },
    { code: "110", name: "BPD Jabar (BJB)" },
    { code: "111", name: "DKI" },
    { code: "120", name: "Bank Aceh" },
    { code: "013", name: "PermataBank" },
    { code: "011", name: "Maybank" },
    { code: "153", name: "Sinarmas" },
    { code: "422", name: "Bank Syariah Indonesia (BSI)" }
];

const eWalletList = [
    { code: "gopay", name: "GoPay" },
    { code: "ovo", name: "OVO" },
    { code: "dana", name: "DANA" },
    { code: "shopeepay", name: "ShopeePay" },
    { code: "linkaja", name: "LinkAja" },
]

interface BankAccount {
    id: string;
    bankName: string;
    accountNumber: string;
    accountHolder: string;
}

interface EWalletAccount {
    id: string;
    walletName: string;
    accountHolder: string;
    phoneNumber: string;
}

export default function PaymentPage() {
    const [userRole, setUserRole] = useState<string | null>(null);
    const [accounts, setAccounts] = useState<BankAccount[]>([]);
    const [eWallets, setEWallets] = useState<EWalletAccount[]>([]);
    const [qrisImage, setQrisImage] = useState<string | null>(null);

    const [isBankDialogOpen, setBankDialogOpen] = useState(false);
    const [isEWalletDialogOpen, setEWalletDialogOpen] = useState(false);
    const [isQrisDialogOpen, setQrisDialogOpen] = useState(false);

    const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<{ id: string, type: 'bank' | 'ewallet' | 'qris', name: string } | null>(null);
    
    const { toast } = useToast();

    useEffect(() => {
        if (typeof window !== 'undefined') {
          const role = localStorage.getItem('userRole');
          setUserRole(role);
        }
    }, []);

    const copyToClipboard = (text: string, type: string) => {
        navigator.clipboard.writeText(text);
        toast({
            title: "Tersalin!",
            description: `${type} berhasil disalin.`,
        });
    };

    const handleAddAccount = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const newAccount: BankAccount = {
            id: `acc_${Date.now()}`,
            bankName: formData.get('bankName') as string,
            accountNumber: formData.get('accountNumber') as string,
            accountHolder: formData.get('accountHolder') as string,
        };

        if (!newAccount.bankName || !newAccount.accountNumber || !newAccount.accountHolder) {
            toast({ variant: "destructive", title: "Gagal Menyimpan", description: "Harap isi semua kolom." });
            return;
        }
        setAccounts(prev => [...prev, newAccount]);
        setBankDialogOpen(false);
        toast({ title: "Berhasil!", description: "Rekening bank baru telah ditambahkan." });
    };

    const handleAddEWallet = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const newEWallet: EWalletAccount = {
            id: `ewallet_${Date.now()}`,
            walletName: formData.get('walletName') as string,
            accountHolder: formData.get('accountHolder') as string,
            phoneNumber: formData.get('phoneNumber') as string,
        };

        if (!newEWallet.walletName || !newEWallet.accountHolder || !newEWallet.phoneNumber) {
             toast({ variant: "destructive", title: "Gagal Menyimpan", description: "Harap isi semua kolom." });
            return;
        }
        setEWallets(prev => [...prev, newEWallet]);
        setEWalletDialogOpen(false);
        toast({ title: "Berhasil!", description: "E-Wallet baru telah ditambahkan." });
    };

    const handleQrisUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            const file = event.target.files[0];
            const reader = new FileReader();
            reader.onloadend = () => {
                setQrisImage(reader.result as string);
                setQrisDialogOpen(false);
                toast({ title: "Berhasil!", description: "Gambar QRIS telah diunggah." });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleDeleteClick = (item: {id: string, name: string}, type: 'bank' | 'ewallet' | 'qris') => {
        setItemToDelete({ ...item, type, name: type === 'qris' ? "QRIS" : item.name });
        setDeleteDialogOpen(true);
    };

    const confirmDelete = () => {
        if (!itemToDelete) return;

        if (itemToDelete.type === 'bank') {
            setAccounts(accounts.filter(acc => acc.id !== itemToDelete.id));
        } else if (itemToDelete.type === 'ewallet') {
            setEWallets(eWallets.filter(ew => ew.id !== itemToDelete.id));
        } else if (itemToDelete.type === 'qris') {
            setQrisImage(null);
        }

        setDeleteDialogOpen(false);
        setItemToDelete(null);
        toast({ title: "Berhasil!", description: `Metode pembayaran ${itemToDelete.name} telah dihapus.` });
    };


    return (
        <>
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight font-headline">Metode Pembayaran</h1>
                    <p className="text-muted-foreground">Kelola rekening, e-wallet, dan QRIS untuk menerima pembayaran.</p>
                </div>
            </div>

            <Tabs defaultValue="bank" className="w-full mt-4">
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="bank"><Banknote className="mr-2 h-4 w-4"/>Rekening Bank</TabsTrigger>
                    <TabsTrigger value="ewallet"><Wallet className="mr-2 h-4 w-4"/>E-Wallet</TabsTrigger>
                    <TabsTrigger value="qris"><QrCode className="mr-2 h-4 w-4"/>QRIS</TabsTrigger>
                </TabsList>

                <TabsContent value="bank">
                    <Card>
                        <CardHeader>
                            <CardTitle>Rekening Bank</CardTitle>
                            <CardDescription>Daftar rekening bank yang tersedia untuk pembayaran.</CardDescription>
                            {userRole === 'owner' && (
                                <Dialog open={isBankDialogOpen} onOpenChange={setBankDialogOpen}>
                                    <DialogTrigger asChild>
                                        <Button className="mt-4 w-fit">
                                            <PlusCircle className="mr-2 h-4 w-4" /> Tambah Rekening
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className="sm:max-w-[425px]">
                                        <DialogHeader>
                                            <DialogTitle>Tambah Rekening Bank</DialogTitle>
                                        </DialogHeader>
                                        <form onSubmit={handleAddAccount}>
                                            <div className="grid gap-4 py-4">
                                                <div className="grid grid-cols-4 items-center gap-4"><Label htmlFor="bankName" className="text-right">Bank</Label><Select name="bankName"><SelectTrigger className="col-span-3"><SelectValue placeholder="Pilih bank" /></SelectTrigger><SelectContent>{bankList.map((bank) => (<SelectItem key={bank.code} value={bank.name}>{bank.name}</SelectItem>))}</SelectContent></Select></div>
                                                <div className="grid grid-cols-4 items-center gap-4"><Label htmlFor="accountHolder" className="text-right">Nama Pemilik</Label><Input id="accountHolder" name="accountHolder" placeholder="Nama sesuai buku tabungan" className="col-span-3" /></div>
                                                <div className="grid grid-cols-4 items-center gap-4"><Label htmlFor="accountNumber" className="text-right">Nomor Rekening</Label><Input id="accountNumber" name="accountNumber" type="number" placeholder="e.g. 1234567890" className="col-span-3" /></div>
                                            </div>
                                            <DialogFooter><Button type="submit">Simpan Rekening</Button></DialogFooter>
                                        </form>
                                    </DialogContent>
                                </Dialog>
                            )}
                        </CardHeader>
                        <CardContent>
                            {accounts.length === 0 ? (
                                <div className="text-center text-muted-foreground py-10"><Banknote className="mx-auto h-12 w-12" /><h3 className="mt-4 text-lg font-semibold">Belum ada rekening</h3><p className="mt-1 text-sm">{userRole === 'owner' ? 'Anda belum menambahkan rekening bank.' : 'Belum ada rekening bank yang ditambahkan.'}</p></div>
                            ) : (
                                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                                    {accounts.map((account) => (
                                        <Card key={account.id} className="flex flex-col">
                                            <CardHeader>
                                                <CardTitle className="text-xl">{account.bankName}</CardTitle>
                                                <p className="text-lg text-muted-foreground">{account.accountHolder}</p>
                                            </CardHeader>
                                            <CardContent className="space-y-4 flex-grow">
                                                <div>
                                                    <p className="text-sm font-medium text-muted-foreground">Nomor Rekening</p>
                                                    <p className="text-lg font-semibold font-mono tracking-wider">{account.accountNumber}</p>
                                                </div>
                                                <Button className="w-full" variant="outline" onClick={() => copyToClipboard(account.accountNumber, 'Nomor rekening')}>
                                                    <Copy className="mr-2 h-4 w-4" />Salin Nomor
                                                </Button>
                                            </CardContent>
                                            {userRole === 'owner' && (
                                                <CardFooter className="border-t pt-4">
                                                    <Button variant="destructive" className="w-full" onClick={() => handleDeleteClick({id: account.id, name: account.bankName}, 'bank')}>
                                                        <Trash2 className="mr-2 h-4 w-4" />Hapus
                                                    </Button>
                                                </CardFooter>
                                            )}
                                        </Card>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="ewallet">
                    <Card>
                        <CardHeader>
                            <CardTitle>E-Wallet</CardTitle>
                            <CardDescription>Daftar e-wallet yang tersedia untuk pembayaran.</CardDescription>
                            {userRole === 'owner' && (
                                <Dialog open={isEWalletDialogOpen} onOpenChange={setEWalletDialogOpen}>
                                    <DialogTrigger asChild><Button className="mt-4 w-fit"><PlusCircle className="mr-2 h-4 w-4" /> Tambah E-Wallet</Button></DialogTrigger>
                                    <DialogContent className="sm:max-w-[425px]">
                                        <DialogHeader><DialogTitle>Tambah E-Wallet</DialogTitle></DialogHeader>
                                        <form onSubmit={handleAddEWallet}>
                                            <div className="grid gap-4 py-4">
                                                <div className="grid grid-cols-4 items-center gap-4"><Label htmlFor="walletName" className="text-right">E-Wallet</Label><Select name="walletName"><SelectTrigger className="col-span-3"><SelectValue placeholder="Pilih e-wallet" /></SelectTrigger><SelectContent>{eWalletList.map((ew) => (<SelectItem key={ew.code} value={ew.name}>{ew.name}</SelectItem>))}</SelectContent></Select></div>
                                                <div className="grid grid-cols-4 items-center gap-4"><Label htmlFor="accountHolder" className="text-right">Nama Akun</Label><Input id="accountHolder" name="accountHolder" placeholder="Nama akun e-wallet" className="col-span-3" /></div>
                                                <div className="grid grid-cols-4 items-center gap-4"><Label htmlFor="phoneNumber" className="text-right">Nomor HP</Label><Input id="phoneNumber" name="phoneNumber" type="number" placeholder="e.g. 08123456789" className="col-span-3" /></div>
                                            </div>
                                            <DialogFooter><Button type="submit">Simpan E-Wallet</Button></DialogFooter>
                                        </form>
                                    </DialogContent>
                                </Dialog>
                            )}
                        </CardHeader>
                        <CardContent>
                            {eWallets.length === 0 ? (
                                <div className="text-center text-muted-foreground py-10"><Wallet className="mx-auto h-12 w-12" /><h3 className="mt-4 text-lg font-semibold">Belum ada e-wallet</h3><p className="mt-1 text-sm">{userRole === 'owner' ? 'Anda belum menambahkan e-wallet.' : 'Belum ada e-wallet yang ditambahkan.'}</p></div>
                            ) : (
                                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                                    {eWallets.map((ewallet) => (
                                        <Card key={ewallet.id} className="flex flex-col">
                                            <CardHeader>
                                                <CardTitle className="text-xl">{ewallet.walletName}</CardTitle>
                                                <p className="text-lg text-muted-foreground">{ewallet.accountHolder}</p>
                                            </CardHeader>
                                            <CardContent className="space-y-4 flex-grow">
                                                <div>
                                                    <p className="text-sm font-medium text-muted-foreground">Nomor Telepon</p>
                                                    <p className="text-lg font-semibold font-mono tracking-wider">{ewallet.phoneNumber}</p>
                                                </div>
                                                <Button className="w-full" variant="outline" onClick={() => copyToClipboard(ewallet.phoneNumber, 'Nomor telepon')}>
                                                    <Copy className="mr-2 h-4 w-4" />Salin Nomor
                                                </Button>
                                            </CardContent>
                                            {userRole === 'owner' && (
                                                <CardFooter className="border-t pt-4">
                                                    <Button variant="destructive" className="w-full" onClick={() => handleDeleteClick({id: ewallet.id, name: ewallet.walletName}, 'ewallet')}>
                                                        <Trash2 className="mr-2 h-4 w-4" />Hapus
                                                    </Button>
                                                </CardFooter>
                                            )}
                                        </Card>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="qris">
                    <Card>
                        <CardHeader>
                            <CardTitle>QRIS</CardTitle>
                            <CardDescription>Kode QRIS untuk pembayaran universal.</CardDescription>
                             {userRole === 'owner' && !qrisImage && (
                                <Dialog open={isQrisDialogOpen} onOpenChange={setQrisDialogOpen}>
                                    <DialogTrigger asChild><Button className="mt-4 w-fit"><PlusCircle className="mr-2 h-4 w-4" /> Unggah QRIS</Button></DialogTrigger>
                                    <DialogContent className="sm:max-w-md">
                                        <DialogHeader><DialogTitle>Unggah Gambar QRIS</DialogTitle><DialogDescription>Pilih file gambar QRIS Anda. Pelanggan akan memindai kode ini untuk membayar.</DialogDescription></DialogHeader>
                                        <div className="py-4"><Label htmlFor="qris-upload" className="cursor-pointer flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg hover:bg-muted"><div className="flex flex-col items-center justify-center pt-5 pb-6"><Upload className="w-8 h-8 mb-2 text-muted-foreground" /><p className="mb-2 text-sm text-muted-foreground"><span className="font-semibold">Klik untuk mengunggah</span></p></div><Input id="qris-upload" type="file" className="hidden" accept="image/png, image/jpeg, image/webp" onChange={handleQrisUpload} /></Label></div>
                                    </DialogContent>
                                </Dialog>
                            )}
                        </CardHeader>
                        <CardContent>
                            {!qrisImage ? (
                                <div className="text-center text-muted-foreground py-10"><QrCode className="mx-auto h-12 w-12" /><h3 className="mt-4 text-lg font-semibold">Belum ada QRIS</h3><p className="mt-1 text-sm">{userRole === 'owner' ? 'Anda belum mengunggah gambar QRIS.' : 'Belum ada gambar QRIS yang ditambahkan.'}</p></div>
                            ) : (
                                <div className="max-w-sm mx-auto">
                                    <Card className="flex flex-col">
                                        <CardContent className="p-6 flex justify-center">
                                            <Image src={qrisImage} alt="QRIS Code" width={250} height={250} className="rounded-md" />
                                        </CardContent>
                                        {userRole === 'owner' && (<CardFooter className="border-t pt-4"><Button variant="destructive" className="w-full" onClick={() => handleDeleteClick({id: 'qris_1', name: 'QRIS'}, 'qris')}><Trash2 className="mr-2 h-4 w-4" />Hapus QRIS</Button></CardFooter>)}
                                    </Card>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

             <AlertDialog open={isDeleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Anda yakin ingin menghapus?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Tindakan ini tidak dapat diurungkan. Metode pembayaran <span className="font-bold">{itemToDelete?.name}</span> akan dihapus secara permanen.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setItemToDelete(null)}>Batal</AlertDialogCancel>
                        <AlertDialogAction onClick={confirmDelete}>Hapus</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
