
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuPortal,
} from '@/components/ui/dropdown-menu';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
  } from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
  } from "@/components/ui/popover"
import { Button } from '@/components/ui/button';
import {
  PanelLeft,
  LayoutDashboard,
  Boxes,
  ArrowRightLeft,
  Truck,
  CreditCard,
  Users,
  Settings,
  CircleUser,
  LogOut,
  Search,
  BarChart3,
  FileText,
  BookText,
  Package,
  User,
  LifeBuoy,
  Mail,
  MessageSquare,
  Receipt,
  CalendarClock
} from 'lucide-react';
import { Logo } from '../icons';

const navItems = [
    { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { href: '/dashboard/inventory', icon: Boxes, label: 'Inventory' },
    { href: '/dashboard/transactions', icon: ArrowRightLeft, label: 'Transactions' },
    { href: '/dashboard/shipping', icon: Truck, label: 'Shipping' },
    { href: '/dashboard/payment', icon: CreditCard, label: 'Payment Methods' },
    { href: '/dashboard/invoice', icon: FileText, label: 'Invoice' },
    { href: '/dashboard/attendance', icon: CalendarClock, label: 'Attendance' },
    { href: '/dashboard/finance', icon: BarChart3, label: 'Finance', ownerOnly: true },
    { href: '/dashboard/personal-expenses', icon: Receipt, label: 'Personal Expenses', ownerOnly: true },
    { href: '/dashboard/reports', icon: BookText, label: 'Reports', ownerOnly: true },
    { href: '/dashboard/users', icon: Users, label: 'Users', ownerOnly: true },
    { href: '/dashboard/settings', icon: Settings, label: 'Settings' },
];

const searchData = {
    inventory: [
        { name: 'Laptop Pro 15"', sku: 'LP15-2023', href: '/dashboard/inventory' },
        { name: 'Wireless Mouse', sku: 'WM-001', href: '/dashboard/inventory' },
    ],
    customers: [
        { name: 'Andi Budi', invoice: 'INV-123456', href: '/dashboard/invoice' },
        { name: 'Citra Sari', invoice: 'INV-789012', href: '/dashboard/invoice' },
    ],
    invoices: [
        { id: 'KINETA-INV-110724-0001', customer: 'Andi Budi', href: '/dashboard/invoice' },
        { id: 'INV-789012', customer: 'Citra Sari', href: '/dashboard/invoice' },
    ]
};

export default function Header() {
    const pathname = usePathname();
    const router = useRouter();
    const breadcrumbItems = pathname.split('/').filter(Boolean);

    const [open, setOpen] = useState(false)
 
    useEffect(() => {
        const down = (e: KeyboardEvent) => {
        if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
            e.preventDefault()
            setOpen((open) => !open)
        }
        }
        document.addEventListener("keydown", down)
        return () => document.removeEventListener("keydown", down)
    }, [])

    const runCommand = (command: () => unknown) => {
        setOpen(false)
        command()
    }

  return (
    <>
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
      <Sheet>
        <SheetTrigger asChild>
          <Button size="icon" variant="outline" className="sm:hidden">
            <PanelLeft className="h-5 w-5" />
            <span className="sr-only">Toggle Menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="sm:max-w-xs">
          <SheetHeader>
            <SheetTitle>
              <Link href="/dashboard" className="flex items-center gap-2">
                  <Logo />
              </Link>
            </SheetTitle>
          </SheetHeader>
          <nav className="grid gap-6 text-lg font-medium mt-4">
            {navItems.map(item => (
                <Link key={item.href} href={item.href} className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground">
                    <item.icon className="h-5 w-5" />
                    {item.label}
                </Link>
            ))}
          </nav>
        </SheetContent>
      </Sheet>
      <Breadcrumb className="hidden md:flex">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/dashboard">Dashboard</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          {breadcrumbItems.slice(1).map((item, index) => (
             <React.Fragment key={item}>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                    <BreadcrumbPage className="capitalize">
                        {item.replace('-', ' ')}
                    </BreadcrumbPage>
                </BreadcrumbItem>
             </React.Fragment>
          ))}
        </BreadcrumbList>
      </Breadcrumb>
      <div className="relative ml-auto flex-1 md:grow-0">
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="flex items-center gap-2 w-full justify-start text-muted-foreground pr-12 md:w-[200px] lg:w-[300px]"
                    onClick={() => setOpen(true)}
                >
                    <Search className="h-4 w-4" />
                    <span className="text-sm">Search...</span>
                    <kbd className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-xs font-medium opacity-100 sm:flex">
                        <span className="text-xs">⌘</span>K
                    </kbd>
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[300px] p-0">
                <Command>
                    <CommandInput placeholder="Search for pages, products, customers..." />
                    <CommandList>
                        <CommandEmpty>No results found.</CommandEmpty>
                        <CommandGroup heading="Pages">
                            {navItems.map((item) => (
                                <CommandItem
                                    key={item.href}
                                    value={item.label}
                                    onSelect={() => runCommand(() => router.push(item.href))}
                                >
                                    <item.icon className="mr-2 h-4 w-4" />
                                    <span>{item.label}</span>
                                </CommandItem>
                            ))}
                        </CommandGroup>
                        <CommandGroup heading="Inventory">
                            {searchData.inventory.map((item) => (
                                <CommandItem
                                    key={item.sku}
                                    value={`${item.name} ${item.sku}`}
                                    onSelect={() => runCommand(() => router.push(item.href))}
                                >
                                    <Package className="mr-2 h-4 w-4" />
                                    <div>
                                        <p>{item.name}</p>
                                        <p className="text-xs text-muted-foreground">{item.sku}</p>
                                    </div>
                                </CommandItem>
                            ))}
                        </CommandGroup>
                         <CommandGroup heading="Customers & Invoices">
                            {searchData.invoices.map((item) => (
                                <CommandItem
                                    key={item.id}
                                    value={`${item.id} ${item.customer}`}
                                    onSelect={() => runCommand(() => router.push(item.href))}
                                >
                                    <User className="mr-2 h-4 w-4" />
                                    <div>
                                        <p>{item.customer}</p>
                                        <p className="text-xs text-muted-foreground">{item.id}</p>
                                    </div>
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon" className="overflow-hidden rounded-full">
            <CircleUser className="h-6 w-6" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href="/dashboard/settings" className='flex items-center w-full cursor-pointer'>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <LifeBuoy className="mr-2 h-4 w-4" />
              <span>Support</span>
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                <DropdownMenuItem asChild>
                  <a href="mailto:rizkykesuma89@gmail.com" className="flex items-center gap-2 cursor-pointer">
                    <Mail className="h-4 w-4" />
                    <span>Email</span>
                  </a>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                   <a href="https://wa.me/6282273237329" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 cursor-pointer">
                    <MessageSquare className="h-4 w-4" />
                    <span>WhatsApp</span>
                  </a>
                </DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href="/login" className='flex items-center w-full cursor-pointer'>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Logout</span>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
    </>
  );
}
