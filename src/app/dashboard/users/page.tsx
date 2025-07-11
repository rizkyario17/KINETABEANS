
"use client"

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { TriangleAlert, PlusCircle, User, Mail, Phone, Briefcase, Edit, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';


const initialEmployees = [
  {
    id: 'EMP-001',
    name: 'Budi Santoso',
    position: 'Kasir',
    contact: '081234567890',
    email: 'budi.santoso@example.com',
    avatar: 'https://placehold.co/100x100.png',
  },
  {
    id: 'EMP-002',
    name: 'Citra Lestari',
    position: 'Staf Gudang',
    contact: '081298765432',
    email: 'citra.lestari@example.com',
    avatar: 'https://placehold.co/100x100.png',
  },
  {
    id: 'EMP-003',
    name: 'Doni Firmansyah',
    position: 'Kasir',
    contact: '081211223344',
    email: 'doni.firmansyah@example.com',
    avatar: 'https://placehold.co/100x100.png',
  },
];

type Employee = typeof initialEmployees[0];

export default function ManageUsersPage() {
  const [userRole, setUserRole] = useState<string | null>(null);
  const [employees, setEmployees] = useState(initialEmployees);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [employeeToEdit, setEmployeeToEdit] = useState<Employee | null>(null);
  const [employeeToDelete, setEmployeeToDelete] = useState<Employee | null>(null);
  const [isAddDialogOpen, setAddDialogOpen] = useState(false);
  const [isDetailDialogOpen, setDetailDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const role = localStorage.getItem('userRole');
      setUserRole(role);
    }
  }, []);

  const handleEditClick = (employee: Employee) => {
    setEmployeeToEdit(employee);
    setAddDialogOpen(true);
  };
  
  const handleDeleteClick = (employee: Employee) => {
    setEmployeeToDelete(employee);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (employeeToDelete) {
        setEmployees(employees.filter(emp => emp.id !== employeeToDelete.id));
        setDeleteDialogOpen(false);
        setEmployeeToDelete(null);
        toast({
            title: "Karyawan Dihapus",
            description: `Data untuk ${employeeToDelete.name} telah berhasil dihapus.`,
        });
    }
  }

  const handleSaveEmployee = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const employeeData = {
        id: formData.get('id') as string,
        name: formData.get('name') as string,
        position: formData.get('position') as string,
        contact: formData.get('contact') as string,
        email: formData.get('email') as string,
        avatar: employeeToEdit?.avatar || 'https://placehold.co/100x100.png',
    };

    if (!employeeData.id || !employeeData.name || !employeeData.position) {
        toast({
            variant: "destructive",
            title: "Gagal Menyimpan",
            description: "ID, Nama, dan Jabatan wajib diisi.",
        });
        return;
    }

    if (employeeToEdit) {
        // Update employee
        setEmployees(employees.map(emp => emp.id === employeeToEdit.id ? { ...employeeToEdit, ...employeeData } : emp));
        toast({
            title: "Berhasil Diperbarui",
            description: `Data karyawan ${employeeData.name} telah diperbarui.`,
        });
    } else {
        // Add new employee
        if (employees.some(emp => emp.id === employeeData.id)) {
            toast({
                variant: "destructive",
                title: "Gagal Menambahkan",
                description: `ID Karyawan ${employeeData.id} sudah digunakan.`,
            });
            return;
        }
        setEmployees([...employees, employeeData]);
        toast({
            title: "Karyawan Ditambahkan",
            description: `${employeeData.name} telah ditambahkan sebagai karyawan baru.`,
        });
    }

    setAddDialogOpen(false);
    setEmployeeToEdit(null);
  };

  if (!userRole) {
    // a loading state can be added here
    return null;
  }

  if (userRole !== 'owner') {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <Alert variant="destructive" className="max-w-md">
          <TriangleAlert className="h-4 w-4" />
          <AlertTitle>Akses Ditolak</AlertTitle>
          <AlertDescription>
            Anda harus menjadi Owner untuk melihat halaman ini. Silakan masuk
            dengan akun Owner.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight font-headline">
            Kelola Pengguna
          </h1>
          <p className="text-muted-foreground">
            Lihat dan kelola informasi karyawan Anda.
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={(isOpen) => { setAddDialogOpen(isOpen); if (!isOpen) setEmployeeToEdit(null); }}>
          <DialogTrigger asChild>
            <Button size="sm" className="h-8 gap-1" onClick={() => setEmployeeToEdit(null)}>
              <PlusCircle className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                Tambah Karyawan
              </span>
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <form onSubmit={handleSaveEmployee}>
                <DialogHeader>
                  <DialogTitle>{employeeToEdit ? 'Edit Karyawan' : 'Tambah Karyawan Baru'}</DialogTitle>
                  <DialogDescription>
                    {employeeToEdit ? 'Ubah detail karyawan di bawah ini.' : 'Isi detail karyawan baru di bawah ini.'}
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="id" className="text-right">
                      ID Karyawan
                    </Label>
                    <Input id="id" name="id" placeholder="e.g. EMP-004" defaultValue={employeeToEdit?.id} className="col-span-3" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                      Nama
                    </Label>
                    <Input id="name" name="name" placeholder="Nama lengkap" defaultValue={employeeToEdit?.name} className="col-span-3" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="position" className="text-right">
                      Jabatan
                    </Label>
                    <Input id="position" name="position" placeholder="e.g. Kasir" defaultValue={employeeToEdit?.position} className="col-span-3" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="contact" className="text-right">
                      Kontak
                    </Label>
                    <Input
                      id="contact"
                      name="contact"
                      placeholder="Nomor telepon"
                      defaultValue={employeeToEdit?.contact}
                      className="col-span-3"
                    />
                  </div>
                   <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="email" className="text-right">
                      Email
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="email@karyawan.com"
                      defaultValue={employeeToEdit?.email}
                      className="col-span-3"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit">Simpan</Button>
                </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {employees.map((employee) => (
            <Card key={employee.id} className="flex flex-col">
                <CardContent 
                    className="flex flex-col items-center justify-center p-6 text-center flex-grow cursor-pointer hover:bg-muted/50"
                    onClick={() => { setSelectedEmployee(employee); setDetailDialogOpen(true); }}
                >
                    <Avatar className="h-24 w-24 mb-4">
                        <AvatarImage src={employee.avatar} alt={employee.name} data-ai-hint="profile picture" />
                        <AvatarFallback>
                        {employee.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                    </Avatar>
                    <h3 className="text-lg font-semibold font-headline">{employee.name}</h3>
                    <p className="text-sm text-muted-foreground">{employee.id}</p>
                </CardContent>
                <CardFooter className="flex justify-center gap-2 border-t pt-4">
                    <Button variant="outline" size="sm" onClick={() => handleEditClick(employee)}>
                        <Edit className="mr-2 h-4 w-4" /> Edit
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => handleDeleteClick(employee)}>
                        <Trash2 className="mr-2 h-4 w-4" /> Hapus
                    </Button>
                </CardFooter>
            </Card>
        ))}
      </div>
      
      {/* Employee Detail Dialog */}
      <Dialog open={isDetailDialogOpen} onOpenChange={(isOpen) => { setDetailDialogOpen(isOpen); if (!isOpen) setSelectedEmployee(null); }}>
        <DialogContent className="sm:max-w-md">
          {selectedEmployee && (
            <>
              <DialogHeader>
                <DialogTitle>Detail Karyawan</DialogTitle>
                <DialogDescription>
                  Informasi lengkap untuk {selectedEmployee.name}.
                </DialogDescription>
              </DialogHeader>
              <div className="py-4 space-y-4">
                <div className="flex justify-center">
                  <Avatar className="h-32 w-32">
                    <AvatarImage src={selectedEmployee.avatar} alt={selectedEmployee.name} data-ai-hint="profile picture" />
                    <AvatarFallback>
                      {selectedEmployee.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <div className="space-y-3">
                    <div className="flex items-center gap-4">
                      <User className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Nama Lengkap</p>
                        <p className="font-medium">{selectedEmployee.name}</p>
                      </div>
                    </div>
                     <div className="flex items-center gap-4">
                      <Briefcase className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Jabatan</p>
                        <p className="font-medium">{selectedEmployee.position}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <Phone className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Kontak</p>
                        <p className="font-medium">{selectedEmployee.contact}</p>
                      </div>
                    </div>
                     <div className="flex items-center gap-4">
                      <Mail className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Email</p>
                        <p className="font-medium">{selectedEmployee.email}</p>
                      </div>
                    </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setDetailDialogOpen(false)}>Tutup</Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle>Anda yakin ingin menghapus?</AlertDialogTitle>
                <AlertDialogDescription>
                    Tindakan ini tidak dapat diurungkan. Ini akan menghapus data karyawan <span className="font-bold">{employeeToDelete?.name}</span> secara permanen.
                </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
                <AlertDialogCancel onClick={() => setEmployeeToDelete(null)}>Batal</AlertDialogCancel>
                <AlertDialogAction onClick={confirmDelete}>Hapus</AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
    </AlertDialog>
    </>
  );
}
