
"use client";

import { useState } from "react";
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Logo } from "@/components/icons";
import { Package, BarChart3, Lock, Users, Truck, CreditCard } from "lucide-react";
import { useToast } from "@/hooks/use-toast";


const GoogleIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="24px" height="24px" {...props}>
        <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" />
        <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" />
        <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.222,0-9.658-3.317-11.28-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z" />
        <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571l6.19,5.238C43.021,36.241,44,30.556,44,24C44,22.659,43.862,21.35,43.611,20.083z" />
    </svg>
);


export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();

  const handleGoogleLogin = async () => {
    // Dynamically import Firebase modules only on the client-side, inside the handler
    const { auth } = await import('@/lib/firebase');
    const { GoogleAuthProvider, signInWithPopup } = await import('firebase/auth');
    
    if (!auth) {
        toast({
            variant: "destructive",
            title: "Firebase Not Configured",
            description: "Firebase authentication is not configured. Please check your .env.local file and ensure it is loaded correctly.",
        });
        return;
    }

    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      // For this prototype, we'll assume any successful Google login is an owner.
      // In a real app, you would check the user's role from your database (e.g., Firestore).
      localStorage.setItem('userRole', 'owner');
      toast({
        title: "Login Successful",
        description: `Welcome, ${result.user.displayName}!`,
      });
      router.push('/dashboard');
    } catch (error: any) {
      console.error("Google login error:", error);
      toast({
        variant: "destructive",
        title: "Login Failed",
        description: error.message,
      });
    }
  };

  const handleLegacyLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // This is now a fallback, not the main login method.
    // In a real app, you might phase this out or connect it to Firebase email/password auth.
    localStorage.setItem('userRole', 'owner'); // Defaulting to owner for prototype
    router.push('/dashboard');
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center p-4 bg-background">
      <div className="w-full max-w-5xl lg:grid lg:grid-cols-2 rounded-lg shadow-lg overflow-hidden">
        <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-card">
          <div className="w-full max-w-md space-y-8">
            <div>
              <Logo />
              <h2 className="mt-6 text-3xl font-bold tracking-tight text-foreground font-headline">
                Selamat Datang Kembali!
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Masuk untuk mengelola data inventori bisnis Anda
              </p>
            </div>
            
            <div className="space-y-4">
              <Button onClick={handleGoogleLogin} className="w-full" variant="outline">
                <GoogleIcon className="mr-2 h-5 w-5"/>
                Masuk dengan Google
              </Button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-2 text-muted-foreground">Atau lanjutkan dengan</span>
                </div>
              </div>

              <form className="space-y-6" onSubmit={handleLegacyLogin}>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="anda@email.com"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input id="password" type="password" required />
                </div>
                
                <Button type="submit" className="w-full">
                  Masuk dengan Email
                </Button>
              </form>
            </div>
          </div>
        </div>
        <div className="hidden lg:flex items-center justify-center p-8 bg-primary text-primary-foreground flex-col">
            <div className="max-w-md text-center">
                <h2 className="text-3xl font-bold mb-4 font-headline">Solusi Lengkap Manajemen Inventori</h2>
                <p className="text-primary-foreground/80 mb-8">Semua yang Anda butuhkan untuk mengelola bisnis Anda, dari stok hingga karyawan, dalam satu platform.</p>
                <ul className="space-y-4 text-left">
                    <li className="flex items-start gap-3">
                        <Package className="h-6 w-6 shrink-0 text-accent mt-1" />
                        <span><span className="font-bold">Manajemen Stok:</span> Lacak semua produk Anda secara real-time.</span>
                    </li>
                    <li className="flex items-start gap-3">
                        <CreditCard className="h-6 w-6 shrink-0 text-accent mt-1" />
                        <span><span className="font-bold">Lacak Pembayaran:</span> Pantau status pembayaran QRIS, transfer, dan tunai.</span>
                    </li>
                     <li className="flex items-start gap-3">
                        <Truck className="h-6 w-6 shrink-0 text-accent mt-1" />
                        <span><span className="font-bold">Pantau Pengiriman:</span> Kelola dan pantau pengiriman pesanan online.</span>
                    </li>
                    <li className="flex items-start gap-3">
                        <Users className="h-6 w-6 shrink-0 text-accent mt-1" />
                        <span><span className="font-bold">Kelola Pengguna:</span> Atur akses dan jadwal untuk karyawan Anda (Khusus Owner).</span>
                    </li>
                </ul>
            </div>
        </div>
      </div>
    </div>
  );
}
