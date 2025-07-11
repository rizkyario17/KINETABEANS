
"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Image from 'next/image';


export default function SettingsPage() {
  const [avatarPreview, setAvatarPreview] = useState("https://placehold.co/400x400.png");
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  const handlePhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleLogoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <div>
            <h1 className="text-3xl font-bold tracking-tight font-headline">Settings</h1>
            <p className="text-muted-foreground">Manage your account and application settings.</p>
        </div>
      </div>
       <Card>
        <CardHeader>
          <CardTitle>Profil</CardTitle>
          <CardDescription>Perbarui foto dan informasi pribadi Anda.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <Avatar className="h-[400px] w-[400px]">
                <AvatarImage src={avatarPreview} alt="User Avatar" />
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
              <Input
                type="file"
                id="photo-upload"
                className="hidden"
                accept="image/*"
                onChange={handlePhotoChange}
              />
              <Button asChild>
                <Label htmlFor="photo-upload" className="cursor-pointer">
                  Ganti Foto
                </Label>
              </Button>
            </div>
            <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" defaultValue="Current User" />
            </div>
            <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" defaultValue="owner@example.com" />
            </div>
            <Button>Save Changes</Button>
        </CardContent>
      </Card>
       <Card>
        <CardHeader>
          <CardTitle>Informasi Perusahaan</CardTitle>
          <CardDescription>Kelola detail dan legalitas perusahaan Anda.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            <div className="space-y-2">
                <Label>Logo Perusahaan</Label>
                <div className="flex items-center gap-4">
                    <div className="w-32 h-32 rounded-md border flex items-center justify-center bg-muted">
                        {logoPreview ? (
                            <Image src={logoPreview} alt="Company Logo" width={128} height={128} className="object-contain rounded-md" />
                        ) : (
                            <span className="text-xs text-muted-foreground">Pratinjau</span>
                        )}
                    </div>
                    <Input
                        type="file"
                        id="logo-upload"
                        className="hidden"
                        accept="image/*"
                        onChange={handleLogoChange}
                    />
                    <Button asChild variant="outline">
                        <Label htmlFor="logo-upload" className="cursor-pointer">
                        Unggah Logo
                        </Label>
                    </Button>
                </div>
            </div>
            <div className="space-y-2">
                <Label htmlFor="company-name">Nama Perusahaan</Label>
                <Input id="company-name" defaultValue="PT. Usaha Maju" />
            </div>
            <div className="space-y-2">
                <Label htmlFor="npwp">NPWP</Label>
                <Input id="npwp" defaultValue="00.000.000.0-000.000" />
            </div>
            <Button>Simpan Informasi</Button>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Password</CardTitle>
          <CardDescription>Change your password.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="current-password">Current Password</Label>
                <Input id="current-password" type="password" />
            </div>
            <div className="space-y-2">
                <Label htmlFor="new-password">New Password</Label>
                <Input id="new-password" type="password" />
            </div>
            <Button>Update Password</Button>
        </CardContent>
      </Card>
    </>
  )
}
